import { toast } from '@/utils/toast';
import { ElLoading, ElMessage, ElMessageBox, UploadFile } from 'element-plus';

import localforage from 'localforage';
import { defineStore } from 'pinia';
import { ComposerTranslation, useI18n } from 'vue-i18n';

interface ISpeakText {
    title: string;
    lines: string[];
}
interface IReaderState {
    /** 语音合成对象 */
    synth: SpeechSynthesis;
    /** 文件名 */
    fileName: string;
    /** 当前朗读文本 */
    speakText: string;
    /** 要朗读的源文本 */
    sourceText: string;
    /** 分割符号 */
    splitSymbel: string;
    paragraphSplitSymbel: string;
    /** 当前的章节分割符号索引 */
    currentChapterSplitSymbel: string;
    /** 章节分割符号列表 */
    chapterSplitSymbels: string[];
    /** 自动滚动到朗读的内容 */
    isAutoScroll: boolean;
    /** 分割后的文本列表 */
    speakChapters: ISpeakText[];
    /** 当前朗读文本在列表中的索引 */
    chapterIndex: number;
    /** 当前朗读的行索引 */
    lineIndex: number;
    /** 选择的发音人索引 */
    selectedVoiceIndex: number;
    /** 发音人列表 */
    voices: SpeechSynthesisVoice[];
    /** 朗读速度 */
    speakRate: number;
    /** 是否正在朗读 null：从未朗读；boolean：朗读之后暂停和继续朗读 */
    isSpeaking: boolean | null;
    /** 话语 */
    utterance: SpeechSynthesisUtterance;
    /** 当前朗读的行的css选择器 */
    currentLineSelector: string;
    /** 当前朗读的章节的css选择器 */
    currentChapterSelector: string;
}
export const useReaderStore = defineStore({
    id: 'reader',
    state(): IReaderState {
        const { t } = useI18n();
        return {
            synth: window.speechSynthesis,
            fileName: t('common.noFileOpen'),
            speakText: '',
            sourceText: '',
            splitSymbel: '。？！；…,.?!;',
            paragraphSplitSymbel: '\n\t\n',
            currentChapterSplitSymbel: '第.*章',
            chapterSplitSymbels: [
                '第.*章',
                '第.{1,2}章',
                '第.*节',
                '第.*卷',
                '第.*回',
                'Chapter.*',
                'CHAPTER.*',
            ],
            isAutoScroll: true,
            speakChapters: [],
            chapterIndex: 0,
            lineIndex: 0,
            selectedVoiceIndex: 0,
            voices: [],
            speakRate: 1,
            isSpeaking: null,
            utterance: new SpeechSynthesisUtterance(),
            currentLineSelector:
                '.text_viewer .content .line.active',
            currentChapterSelector: '.chapter_list .chapter.active',
        };
    },
    getters: {
        chosenVoice: (state: IReaderState): SpeechSynthesisVoice => {
            return state.voices[state.selectedVoiceIndex];
        },
        splitSymbelRegExp: (state: IReaderState) => {
            return new RegExp(`(?<=[${state.splitSymbel}])`, 'g');
        },
        lines: (state: IReaderState) => {
            if (!state.speakChapters[state.chapterIndex]) return [];
            return state.speakChapters[state.chapterIndex].lines;
        },
        nextSpeakText: (state: IReaderState) => {
            let chapter = state.speakChapters[state.chapterIndex];
            if (state.lineIndex > chapter.lines.length - 1) {
                state.chapterIndex += 1;
                state.lineIndex = 0;
                currentSpeakTextElementScrollIntoView(
                    state.currentLineSelector,
                    state.isAutoScroll,
                );
            }
            chapter = state.speakChapters[state.chapterIndex];
            return chapter.lines[state.lineIndex];
        },
        currentChapterLines: (state: IReaderState) => {
            if (!state.speakChapters[state.chapterIndex]) return;
            return state.speakChapters[state.chapterIndex].lines;
        },
        chapterCount: (state: IReaderState) => {
            return state.speakChapters.length;
        },
        wordCount: (state: IReaderState) => {
            if (!state.speakChapters[state.chapterIndex]) return 0;
            const lines = state.speakChapters[state.chapterIndex].lines;
            return lines.join('').split('').length;
        },
    },
    actions: {
        /**
         * 更新源文本(相当于打开一本新的小说, 重新初始化)
         * @param text 文本
         * @returns
         */
        updateSourceText(text: string) {
            this.speakChapters = [];
            this.stopSpeak();

            this.sourceText = text;
            const regExp = new RegExp(
                `(?=${this.currentChapterSplitSymbel})`,
                'g',
            );
            const chapterList = text.split(regExp);
            if (!chapterList) return;
            chapterList.forEach((chapter) => {
                let paragraphList = chapter.split(/(\r\n|\r|\n)/g);
                paragraphList = paragraphList.filter((item) => {
                    return item.trim().length > 0;
                });
                const content = paragraphList.join(this.paragraphSplitSymbel);
                this.speakChapters.push({
                    title: paragraphList[0]?.substring(0, 30),
                    lines: content.split(this.splitSymbelRegExp),
                });
            });
            this.updateChapterIndex(0, false);
            this.save();
        },
        updateChapterIndex(index: number, isSpeak = true) {
            this.synth.cancel();
            this.chapterIndex = index;
            this.lineIndex = 0;
            if (isSpeak) {
                this.speakNext();
            }
            currentSpeakTextElementScrollIntoView(
                this.currentLineSelector,
                this.isAutoScroll,
            );
            currentSpeakTextElementScrollIntoView(
                this.currentChapterSelector,
                this.isAutoScroll,
            );
        },
        stopSpeak() {
            this.synth.cancel();
            this.updateChapterIndex(0, false);
            this.lineIndex = 0;
            this.isSpeaking = null;
            currentSpeakTextElementScrollIntoView(
                this.currentLineSelector,
                this.isAutoScroll,
            );
            currentSpeakTextElementScrollIntoView(
                this.currentChapterSelector,
                this.isAutoScroll,
            );
            this.save();
        },
        speakNext() {
            this.isSpeaking = true;
            currentSpeakTextElementScrollIntoView(
                this.currentLineSelector,
                this.isAutoScroll,
            );

            if (this.chapterIndex > this.speakChapters.length - 1) {
                this.stopSpeak();
                return;
            }

            let chapter = this.speakChapters[this.chapterIndex];
            if (this.lineIndex > chapter.lines.length - 1) {
                this.chapterIndex += 1;
                this.lineIndex = 0;
                currentSpeakTextElementScrollIntoView(
                    this.currentLineSelector,
                    this.isAutoScroll,
                );
            }
            chapter = this.speakChapters[this.chapterIndex];
            const speakText = chapter.lines[this.lineIndex];

            // 设置语音朗读的发音人
            this.utterance.voice = this.chosenVoice;
            this.utterance.text = speakText;
            this.synth.cancel(); // 停止当前语音朗读
            this.utterance.rate = this.speakRate; // 设置语速
            this.synth.speak(this.utterance);
            this.save();
            // 监听朗读结束事件，继续朗读下一段文字
            this.utterance.onend = () => {
                if (this.lineIndex < this.lines.length - 1) {
                    this.lineIndex = this.lineIndex + 1;
                    this.speakNext();
                } else {
                    this.updateChapterIndex(this.chapterIndex + 1);
                    // this.speakNext();
                }
            };
        },
        toggleIsSpeaking() {
            if (this.isSpeaking === null) {
                this.speakNext();
                return;
            }
            if (this.isSpeaking) {
                this.synth.pause();
            } else {
                this.synth.resume();
            }
            this.isSpeaking = !this.isSpeaking;
        },
        readFile(
            file: File | UploadFile,
            t: ComposerTranslation,
            callback?: () => void,
        ) {
            // const loading =ElLoading.service({ fullscreen: true })
             const loading = ElLoading.service({
                lock: true,
                text:t("common.readingFile"),
                background: 'rgba(0, 0, 0, 0.7)',
            })
            if (!(file instanceof File)) {
                file = file.raw as File;
            }
            // 如果不是文本文件，则不处理
            if (file.type.indexOf('text') === -1) {
                loading.close()
                ElMessage({
                    message: t('common.notTextFile'),
                    type: 'error',
                });
                return;
            }
            // 确保file.raw是Blob或File的实例
            const reader_gb2312 = new FileReader();
            reader_gb2312.readAsText(file, 'gb2312'); // 现在这里不会报错，因为我们已经确认了file.raw是Blob或File
            reader_gb2312.onload = (e: ProgressEvent<FileReader>) => {
                if (!e.target) return;
                const txtString = e.target.result as string;
                if (txtString === null) return;
                this.fileName = file.name;
                // utf-8 的 中文编码 正则表达式
                // 说明：如果是乱码的话，应该是不会出现"的地得"的，因为这几个字比较常用
                // (算是临时解决方案，因为不想专门引用一个库，先用着看看效果)
                const patrn = /[的地得]/gi;
                // 检测当前文本是否含有中文（如果没有，则当乱码处理）
                // 两个格式的英文编码一样，所以纯英文文件也当成乱码再处理一次
                if (!patrn.exec(txtString.substring(0, 1000))) {
                    const reader_utf8 = new FileReader();
                    // 再拿一次纯文本，这一次拿到的文本一定不会乱码
                    reader_utf8.readAsText(file as Blob, 'utf-8');
                    reader_utf8.onload = (e2: ProgressEvent<FileReader>) => {
                        if (e2.target === null) return;
                        const txtString2 = e2.target.result as string;
                        this.updateSourceText(txtString2);
                        loading.close()
                        callback && callback();
                    };
                } else {
                    this.updateSourceText(txtString);
                    loading.close()
                    callback && callback();
                }
            };
        },
        /**
         * indexedDB存储
         */
        save() {
            const readerData = {
                fileName: this.fileName,
                sourceText: this.sourceText,
                splitSymbel: this.splitSymbel,
                paragraphSplitSymbel: this.paragraphSplitSymbel,
                currentChapterSplitSymbel: this.currentChapterSplitSymbel,
                chapterSplitSymbels: this.chapterSplitSymbels,
                isAutoScroll: this.isAutoScroll,
                speakChapters: this.speakChapters,
                chapterIndex: this.chapterIndex,
                lineIndex: this.lineIndex,
                selectedVoiceIndex: this.selectedVoiceIndex,
                speakRate: this.speakRate,
            };
            localforage.setItem('readerSetting', JSON.stringify(readerData));
        },
        restore() {
            localforage.getItem('readerSetting').then((data) => {
                if (!data) return;
                const readerData = JSON.parse(data as string);
                this.fileName = readerData.fileName;
                this.sourceText = readerData.sourceText;
                this.splitSymbel = readerData.splitSymbel;
                this.paragraphSplitSymbel = readerData.paragraphSplitSymbel;
                this.currentChapterSplitSymbel =
                    readerData.currentChapterSplitSymbel;
                this.chapterSplitSymbels = readerData.chapterSplitSymbels;
                this.isAutoScroll = readerData.isAutoScroll;
                this.speakChapters = readerData.speakChapters;
                this.chapterIndex = readerData.chapterIndex;
                this.lineIndex = readerData.lineIndex;
                this.selectedVoiceIndex = readerData.selectedVoiceIndex;
                this.speakRate = readerData.speakRate;
                currentSpeakTextElementScrollIntoView(
                    this.currentLineSelector,
                    this.isAutoScroll,
                );
                currentSpeakTextElementScrollIntoView(
                    this.currentChapterSelector,
                    this.isAutoScroll,
                );
            });
        },
    },
});

/** 当前朗读文本滚动到视窗内 */
function currentSpeakTextElementScrollIntoView(
    domSelector: string,
    isAutoScroll = true,
) {
    if (!isAutoScroll) return;
    setTimeout(() => {
        const currentElement = document.querySelector(domSelector);
        if (!currentElement) return;
        const bounding = currentElement?.getBoundingClientRect();
        // 当前元素在视窗下方200像素内时滚动到视窗内
        if (
            bounding.y >= document.documentElement.clientHeight - 200 ||
            bounding.y <= 100
        ) {
            currentElement.scrollIntoView({ behavior: 'smooth' });
        }
    }, 200);
}

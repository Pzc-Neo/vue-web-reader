<script setup lang="ts">
import { useReaderStore } from '@/store/reader';
import { useStyleStore } from '@/store/style';
import { ref, shallowRef, onMounted } from 'vue';
/** 语音国际化模块 */
import { useI18n } from 'vue-i18n';

const readerStore = useReaderStore();
const styleStore = useStyleStore();
// 使用i18n实例
const { t } = useI18n();

// 检查浏览器是否支持语音朗读
const synth: SpeechSynthesis | null = window.speechSynthesis;
if (!synth) {
    alert(t('browserNotSupportSpeech'));
}

// 获取浏览器支持的语音列表
onMounted(() => {
    let count = 0;
    const interval = setInterval(() => {
        const voices = synth.getVoices();
        count++;
        if (voices.length > 0) {
            clearInterval(interval);
            readerStore.voices = voices;
        } else {
            if (count > 20) {
                clearInterval(interval);
                alert(t('browserNotSupportSpeech'));
            }
        }
    }, 100);
    readerStore.restore();
    styleStore.restore();
});

// 点击内容区域进行跳转朗读
const onContentClick = (index: number) => {
    readerStore.synth.cancel(); // 停止当前朗读
    // 设置朗读索引
    readerStore.lineIndex = index;
    readerStore.speakNext();
};

// 开始朗读用户输入的文本
const onSpeakClick = () => {
    readerStore.toggleIsSpeaking();
};

// 发音人改变时重新朗读
const onSpeakerChange = () => {
    readerStore.speakNext();
};
const onSpeakRateChange = () => {
    readerStore.speakNext();
};
</script>

<template>
    <div class="index">
        <SideSection />
        <div class="main_section">
            <div class="toolbar">
                <div class="speakers flex flex-row flex-items-center">
                    <div class="w70px">{{t('reader.speaker')}}</div>
                    <el-select
                        v-model="readerStore.selectedVoiceIndex"
                        class="voice_select_box"
                        filterable
                        placeholder="Select"
                        @change="onSpeakerChange"
                    >
                        <el-option
                            v-for="(item, index) in readerStore.voices"
                            :key="index"
                            :label="index + '. ' + item.name"
                            :value="index"
                        />
                    </el-select>
                </div>
                <div class="command">
                    <div class="control">
                        <el-button @click="onSpeakClick">{{
                            readerStore.isSpeaking
                                ? t('reader.pause')
                                : t('reader.play')
                        }}</el-button>
                    </div>
                    <div class="control rate_control">
                        <span class="label">{{ t('reader.rate') }}</span>
                        <el-slider
                            v-model="readerStore.speakRate"
                            :min="0.1"
                            :max="10"
                            :step="0.1"
                            @change="onSpeakRateChange"
                        />
                    </div>
                    <div class="control">
                        <el-checkbox
                            v-model="readerStore.isAutoScroll"
                            :label="t('reader.autoscroll')"
                        />
                    </div>
                </div>
            </div>
            <div
                class="content_container"
                :style="{
                    fontFamily: styleStore.selectedFont,
                    fontSize: styleStore.fontSize + 'px',
                    lineHeight: styleStore.lineHeight + 'em',
                }"
            >
                <div
                    class="content"
                    :style="{ width: styleStore.contentWidth + '%' }"
                >
                    <span
                        v-for="(text, index) in readerStore.currentChapterLines"
                        :key="index"
                        :class="[
                            'line',
                            index === readerStore.lineIndex ? 'active' : '',
                        ]"
                        @click="onContentClick(index)"
                    >
                        <template
                            v-if="
                                text.includes(readerStore.paragraphSplitSymbel)
                            "
                        >
                            <span
                                v-for="(_text, _index) in text.split(
                                    readerStore.paragraphSplitSymbel,
                                )"
                                :key="_index"
                            >
                                {{ _text }}
                                <div
                                    v-if="
                                        _index ===
                                        text.split(
                                            readerStore.paragraphSplitSymbel,
                                        ).length -
                                            2
                                    "
                                    class="gutter"
                                ></div>
                            </span>
                        </template>
                        <span v-else>{{ text }}</span>
                    </span>
                </div>
            </div>
        </div>
        <div v-if="styleStore.isShowSection" class="setting_section">
            <StyleSection />
        </div>
    </div>
</template>

<style lang="scss">
.index {
    display: flex;
    flex: 1;
    height: 100%;

    .side_section,
    .setting_section {
        width: 240px;
        height: 100%;
        flex-shrink: 0;
    }
    .side_section {
        border-right: 1px solid var(--main-border-color);
        /* background-color: skyblue; */
    }

    .main_section {
        width: 100%;
        height: 100%;
        overflow: hidden;
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        line-height: 1.7em;
        text-align: justify;
        cursor: default;

        .toolbar {
            display: flex;
            /* justify-content: center; */
            overflow: hidden;
            overflow-x: auto;
            flex-shrink: 0;
            padding: 0 15px;

            .voice_select_box {
                min-width: 280px;
                max-width: 340px;
            }

            .command {
                display: flex;
                margin-left: 10px;

                .control {
                    margin-left: 10px;
                    display: flex;
                    align-items: center;
                }
                .rate_control {
                    min-width: 160px;
                    .label {
                        min-width: 38px;
                    }
                }
            }
        }
    }

    .setting_section {
        border-left: 1px solid var(--main-border-color);
        padding: 0 8px;
        /* background-color: skyblue; */
    }

    .content_container {
        display: flex;
        justify-content: center;
        overflow: hidden;
        overflow-y: auto;
        padding: 0 20px;
        margin-top: 15px;
        .content {
            .gutter {
                padding: 10px;
            }
            .line {
                cursor: pointer;
                &.active {
                    color: #3192f7;
                }
            }
        }
    }
}
</style>

<template>
    <div class="side_section text-primary-dark dark:text-ternary-light">
        <div class="btn_group">
            <el-upload
                ref="upload"
                class="upload-demo"
                accept=".txt"
                :limit="1"
                :auto-upload="false"
                :show-file-list="false"
                @change="handleFileChange"
            >
                <template #trigger>
                    <el-button type="primary" class="pl2 pr2">{{
                        t('common.openFile')
                    }}</el-button>
                </template>
            </el-upload>
            <div class="flex-1">
                <el-select
                    v-model="readerStore.currentChapterSplitSymbel"
                    :placeholder="t('reader.chapterSplitter')"
                    filterable
                    @change="reloadBook"
                >
                    <el-option
                        v-for="(
                            splitSymbel, index
                        ) in readerStore.chapterSplitSymbels"
                        :key="index"
                        :label="splitSymbel"
                        :value="splitSymbel"
                    ></el-option>
                </el-select>
            </div>
            <div>
                <el-button
                    class="pl2 pr2"
                    :title="t('reader.editChapterSplitter')"
                    @click="showEditSplitSymbleDialog"
                >
                    <span i-carbon-edit></span>
                </el-button>
            </div>
        </div>
        <div class="chapter_list">
            <div
                v-for="(chapter, index) in readerStore.speakChapters"
                :key="index"
                :class="[
                    'chapter',
                    { active: index === readerStore.chapterIndex },
                ]"
                @click="handleClickChapter(index)"
            >
                {{ chapter.title }}
            </div>
        </div>
        <el-dialog
            v-model="isShowSplitSymbleDialog"
            :title="t('reader.editChapterSplitter')"
            width="300px"
            draggable
        >
            <el-input
                v-model="theInputText"
                type="textarea"
                :rows="12"
            ></el-input>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="isShowSplitSymbleDialog = false">{{
                        t('common.cancel')
                    }}</el-button>
                    <el-button type="primary" @click="onInputTextDialogConfirm">
                        {{ t('common.confirm') }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { useReaderStore } from '@/store/reader';
import type { UploadFile, UploadFiles, UploadInstance } from 'element-plus';

const { t } = useI18n();
const readerStore = useReaderStore();

const theInputText = ref('');
const isShowSplitSymbleDialog = ref(false);

const showEditSplitSymbleDialog = () => {
    isShowSplitSymbleDialog.value = true;
    theInputText.value = readerStore.chapterSplitSymbels.join('\n');
};
const reloadBook = () => {
    readerStore.updateSourceText(readerStore.sourceText);
};
const onInputTextDialogConfirm = () => {
    isShowSplitSymbleDialog.value = false;
    readerStore.chapterSplitSymbels = theInputText.value.split('\n');
    readerStore.save();
};
const upload = ref<UploadInstance>();
const handleFileChange = (file: UploadFile, fileList: UploadFiles) => {
    if (file.raw instanceof Blob) {
        // 确保file.raw是Blob或File的实例
        const reader_gb2312 = new FileReader();
        reader_gb2312.readAsText(file.raw, 'gb2312'); // 现在这里不会报错，因为我们已经确认了file.raw是Blob或File
        reader_gb2312.onload = (e: ProgressEvent<FileReader>) => {
            if (!e.target) return;
            const txtString = e.target.result as string;
            if (txtString === null) return;
            readerStore.fileName = file.name;
            // utf-8 的 中文编码 正则表达式
            // 说明：如果是乱码的话，应该是不会出现"的地得"的，因为这几个字比较常用
            // (算是临时解决方案，因为不想专门引用一个库，先用着看看效果)
            const patrn = /[的地得]/gi;
            // 检测当前文本是否含有中文（如果没有，则当乱码处理）
            // 两个格式的英文编码一样，所以纯英文文件也当成乱码再处理一次
            if (!patrn.exec(txtString.substring(0, 1000))) {
                let reader_utf8 = new FileReader();
                // 再拿一次纯文本，这一次拿到的文本一定不会乱码
                reader_utf8.readAsText(file.raw as Blob, 'utf-8');
                reader_utf8.onload = (e2: ProgressEvent<FileReader>) => {
                    if (e2.target === null) return;
                    const txtString2 = e2.target.result as string;
                    readerStore.updateSourceText(txtString2);
                    upload.value?.clearFiles();
                };
            } else {
                readerStore.updateSourceText(txtString);
                upload.value?.clearFiles();
            }
        };
    } else {
        console.error(t('common.fileTypeNotSupported'));
    }
};
const handleClickChapter = (index: number) => {
    readerStore.updateChapterIndex(index);
};
</script>

<style scoped lang="scss">
.side_section {
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .btn_group,
    .chapter_list {
        padding-left: 12px;
    }

    .btn_group {
        display: flex;
        padding-bottom: 15px;
    }

    .chapter_list {
        flex: 1;
        overflow: hidden;
        overflow-y: auto;
        text-align: left;
        cursor: default;

        .chapter {
            padding: 5px;
            cursor: pointer;

            &.active {
                color: #3192f7;
            }

            &:hover {
                background-color: rgba(239, 249, 255, 0.678);
            }
        }
    }
}
</style>

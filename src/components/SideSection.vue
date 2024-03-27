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
    readerStore.readFile(file, t, () => {
        upload.value?.clearFiles();
    });
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

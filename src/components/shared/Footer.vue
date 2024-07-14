<script lang="ts" setup>
import { useReaderStore } from '@/store/reader';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const readerStore = useReaderStore();
const nextChapter = () => {
    readerStore.updateChapterIndex(readerStore.chapterIndex + 1);
};
const preChapter = () => {
    readerStore.updateChapterIndex(readerStore.chapterIndex - 1);
};
const onSpeakClick = () => {
    readerStore.toggleIsSpeaking();
};
</script>
<template>
    <div class="footer text-primary-dark dark:text-ternary-light">
        <div class="left">
            {{ t('reader.chapterCount') }}
            {{ readerStore.chapterCount }}&nbsp;&nbsp;&nbsp;
            {{ t('reader.chapterWordCount') }} {{ readerStore.wordCount }}
        </div>
        <div class="center">
            <div class="control_button_group">
                <el-button class="control_button" @click="preChapter"
                    >{{ t('reader.previous') }}
                </el-button>
                <el-button class="control_button" @click="onSpeakClick">
                    {{
                        readerStore.isSpeaking
                            ? t('reader.pause')
                            : t('reader.play')
                    }}
                </el-button>
                <el-button class="control_button" @click="nextChapter">
                    {{ t('reader.next') }}
                </el-button>
            </div>
        </div>
        <div class="right">
            <span>{{ t('common.feedback') }}：</span>
            <a
                class="github"
                :circle="true"
                href="https://github.com/Pzc-Neo/vue-web-reader"
                target="_blank"
            >
                <div i-carbon-logo-github></div>
            </a>
            <a href="mailto:Pzc_Neo@foxmail.com">Pzc_Neo@foxmail.com</a>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.footer {
    display: flex;
    justify-content: space-between;
    line-height: 46px;
    font-size: 16px;
    padding: 0 14px;
    border-top: 1px solid var(--main-border-color);
    .right {
        display: flex;
        align-items: center;
        .github {
            margin-right: 5px;
        }
    }
}
</style>

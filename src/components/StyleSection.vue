<template>
    <div class="style_section">
        <div>
            <div class="setting_block">
                <span class="title mb1">{{ t('style.fontFamily') }}</span>
                <div class="w100% flex flex-row">
                    <el-select
                        v-model="styleStore.selectedFont"
                        class="flex-1"
                        placeholder="请选择字体"
                        filterable
                        @change="styleStore.save()"
                    >
                        <el-option
                            v-for="font in styleStore.fontList"
                            :key="font"
                            :label="font"
                            :value="font"
                        ></el-option>
                    </el-select>
                    <el-button
                        class="pl2 pr2"
                        :title="t('style.editFontList')"
                        @click="showEditorFontsDialog"
                    >
                        <span i-carbon-edit></span>
                    </el-button>
                </div>
            </div>
            <div class="setting_block">
                <span class="title">{{ t('style.contentWidth') }}</span>
                <el-slider
                    v-model="styleStore.contentWidth"
                    :min="0"
                    :max="100"
                    @change="styleStore.save()"
                />
            </div>
            <div class="setting_block">
                <span class="title">{{ t('style.fontSize') }}</span>
                <el-slider
                    v-model="styleStore.fontSize"
                    :min="5"
                    :max="100"
                    @change="styleStore.save()"
                />
            </div>
            <div class="setting_block">
                <span class="title">{{ t('style.lineHeight') }}</span>
                <el-slider
                    v-model="styleStore.lineHeight"
                    :min="1"
                    :max="5"
                    :step="0.1"
                    @change="styleStore.save()"
                />
            </div>
            <div class="setting_block">
                <span class="title mb1"
                    >{{ t('style.bgImage') }}
                    <a href="https://www.pexels.com/" target="_blank"
                        >({{ t('style.website') }})</a
                    ></span
                >
                <el-input
                    v-model="styleStore.bgImage"
                    @change="styleStore.save()"
                />
            </div>
            <div class="setting_block">
                <span class="title">{{ t('style.imageOpacity') }}</span>
                <el-slider
                    v-model="styleStore.bgImageOpacity"
                    :min="0.0"
                    :max="1"
                    :step="0.01"
                    @change="styleStore.save()"
                />
            </div>
        </div>
        <div class="information">
            <h2 class="text-2xl font-bold">{{ t('style.Instructions') }}</h2>
            <div class="content ml1">
                <div class="line">
                    {{ t('Instructions.l1') }}
                    <a
                        href="https://www.microsoft.com/zh-cn/edge/download"
                        target="_blank"
                        >({{ t('Instructions.l2') }})</a
                    >
                </div>
                <div class="line">
                    {{ t('Instructions.l3') }}
                </div>
                <div class="line">{{ t('Instructions.l4') }}</div>
                <div class="line">{{ t('Instructions.l5') }}</div>
            </div>
        </div>
        <el-dialog
            v-model="isShowEditorFontsDialog"
            :title="t('style.editFontList')"
            width="300px"
            draggable
        >
            <el-input
                v-model="theInputText"
                type="textarea"
                :rows="12"
            ></el-input>
            <template #footer>
                <a
                    class="inline-block mb2 color-#555 underline"
                    href="https://github.com/Pzc-Neo/wpf-get-fonts/releases/download/v1.0.0/wpf-get-fonts-v1.0.0.zip"
                    target="_blank"
                    >{{ t('style.downloadSoft') }}</a
                >
                <div class="dialog_footer">
                    <el-button @click="isShowEditorFontsDialog = false">{{
                        t('common.cancel')
                    }}</el-button>
                    <el-button
                        type="primary"
                        @click="onEditorFontsDialogConfirm"
                    >
                        {{ t('common.confirm') }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { useStyleStore } from '@/store/style';
const { t } = useI18n();

const styleStore = useStyleStore();
const isShowEditorFontsDialog = ref(false);
const theInputText = ref('');
const showEditorFontsDialog = () => {
    theInputText.value = styleStore.fontList?.join('\n');
    isShowEditorFontsDialog.value = true;
};
const onEditorFontsDialogConfirm = () => {
    if (theInputText.value.trim() === '') {
        styleStore.fontList = [];
    } else {
        styleStore.fontList = theInputText.value
            .split('\n')
            .map((s) => s.trim())
            .filter((s) => s !== '');
    }
    styleStore.save();
    isShowEditorFontsDialog.value = false;
};
</script>

<style scoped lang="scss">
.style_section {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: auto;

    .setting_block {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin: 10px;
        margin-top: 0;

        .title {
            text-align: left;
        }
    }

    .information {
        margin: 10px;
        text-align: left;

        .line {
            text-indent: 1.2em;
            padding-bottom: 6px;
            font-size: 0.95em;
        }
    }
}
</style>

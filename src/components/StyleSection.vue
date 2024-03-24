<template>
    <div class="style_section">
        <div>
            <div class="setting_block">
                <span class="title">字体</span>
                <el-select
                    v-model="styleStore.selectedFont"
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
                <span class="title"
                    >{{ t('style.bgImage') }}
                    <a href="https://www.pexels.com/" target="_blank"
                        >({{ t('style.source') }})</a
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
    </div>
</template>

<script setup lang="ts">
import { useStyleStore } from '@/store/style';
const { t } = useI18n();

const styleStore = useStyleStore();
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

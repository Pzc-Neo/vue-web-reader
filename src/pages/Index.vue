<script setup lang="ts">
import TextViewer from '@/components/TextViewer.vue';
import { useStyleStore } from '@/store/style';
import { useViewStore } from '@/store/view';
const viewStore = useViewStore();

const styleStore = useStyleStore();
styleStore.restore();
</script>

<template>
    <div class="index">
        <SideSection v-if="viewStore.isShowSideSection" />
        <div class="main_section">
            <ToolBar />
            <TextViewer />
        </div>
        <div v-if="viewStore.isShowStyleSection" class="setting_section">
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
    }

    .setting_section {
        border-left: 1px solid var(--main-border-color);
        padding: 0 8px;
    }
}
</style>

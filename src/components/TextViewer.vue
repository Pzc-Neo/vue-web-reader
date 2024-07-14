<template>
    <div
        class="text_viewer"
        :style="{
            fontFamily: styleStore.selectedFont,
            fontSize: styleStore.fontSize + 'px',
            lineHeight: styleStore.lineHeight + 'em',
        }"
    >
        <div class="content_container">
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
                        v-if="text.includes(readerStore.paragraphSplitSymbel)"
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
                                    text.split(readerStore.paragraphSplitSymbel)
                                        .length -
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
        <el-slider
            v-if="viewStore.isShowReadingProgress"
            v-model="readerStore.lineIndex"
            :max="maxIndex"
            @change="onLineIndexChange"
        />
    </div>
</template>

<script setup lang="ts">
import { useStyleStore } from '@/store/style';
import { useReaderStore } from '@/store/reader';
import { useViewStore } from '@/store/view';
const styleStore = useStyleStore();
const readerStore = useReaderStore();
const viewStore = useViewStore();

// 点击内容区域进行跳转朗读
const onContentClick = (index: number) => {
    readerStore.synth.cancel(); // 停止当前朗读
    // 设置朗读索引
    readerStore.lineIndex = index;
    readerStore.speakNext();
};
const onLineIndexChange = () => {
    readerStore.speakNext();
};
const maxIndex = computed(() => {
    let result = readerStore.lines.length - 1;
    if (result === -1) {
        result = 0;
    }
    return result;
});
</script>

<style scoped lang="scss">
.text_viewer {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 15px;
    overflow: hidden;
    .content_container {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
        overflow-y: auto;
        padding: 0 20px;
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
    .el-slider {
        padding: 0 20px;
    }
}
</style>

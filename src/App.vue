<script lang="ts" setup>
import Header from '@/components/shared/Header.vue';
import Footer from '@/components/shared/Footer.vue';
import { useUserStore } from '@/store/user';
import { useStyleStore } from './store/style';
import { useReaderStore } from './store/reader';
const { t } = useI18n();

const userStore = useUserStore();
const styleStore = useStyleStore();
const readerStore = useReaderStore();

userStore.initUser();

const isShow = ref(false);
const interval = ref();
const handleDragStart =   (e: DragEvent) => {
    e.preventDefault();
};
const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    isShow.value = true;
    clearInterval(interval.value);
    interval.value = setInterval(() => {
        isShow.value = false;
    }, 100);
};
const handleDragEnd = (e: DragEvent) => {
    e.preventDefault();
    isShow.value = false;
};
const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
        readerStore.readFile(files[0], t);
    }
    isShow.value = false;
};
</script>
<template>
    <Header />
    <div
        class="main"
        :draggable="true"
        @drop="handleDrop"
        @dragover="handleDragOver"
        @dragend="handleDragEnd"
        @dragstart="handleDragStart"
    >
        <div v-if="isShow" class="drop_zone">
            {{ t('common.dropFileHere') }}
        </div>
        <RouterView />
    </div>
    <Footer />
    <div
        class="background-image"
        :style="{
            backgroundImage: `url(${styleStore.bgImage})`,
            opacity: styleStore.bgImageOpacity,
        }"
    ></div>
</template>
<style lang="scss">
#app {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    font-family: Avenir, Helvetica, Arial, sans-serif;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    line-height: 150%;
    display: flex;
    flex-direction: column;

    color: var(--main-text-color);
}

.background-image {
    position: absolute;
    /* 绝对定位，相对于最近的已定位祖先元素（这里是#app） */
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-size: cover;
    /* 图片覆盖整个元素 */
    background-repeat: repeat;
    /* 图片平铺 */
    z-index: -1;
    /* 确保背景图片层位于内容之下 */
}

.main {
    flex: 1;
    overflow: hidden;

    .drop_zone {
        position: absolute;
        width: 100%;
        height: calc(100% - 60px);
        overflow: hidden;
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
        z-index: 10;

        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 50px;
        font-weight: bold;
    }
}

.sw-msg {
    margin-top: 20px;
}

::-webkit-scrollbar {
    width: 3px;
    height: 3px;
}

::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #409eff;
}

::-webkit-scrollbar-track {
    border-radius: 10px;
    margin: 4px 0;
    background-color: transparent;
}
</style>

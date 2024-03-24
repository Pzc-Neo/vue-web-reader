<script lang="ts" setup>
import Header from '@/components/shared/Header.vue';
import Footer from '@/components/shared/Footer.vue';
import { useUserStore } from '@/store/user';
import { useStyleStore } from './store/style';

const userStore = useUserStore();
const styleStore = useStyleStore();

userStore.initUser();
</script>
<template>
    <Header />
    <div class="main">
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

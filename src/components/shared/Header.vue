<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import LoginButton from '../LoginButton.vue';
import ThemeSwitcher from '../ThemeSwitcher.vue';
import LangSwitcher from '../LangSwitcher.vue';
import Menu from '../Menu.vue';
import { useReaderStore } from '@/store/reader';

const { t } = useI18n();
const readerStore = useReaderStore();
const goToGitHub = () => {
    window.open('https://github.com/Pzc-Neo/vue-web-reader');
};
</script>
<template>
    <nav class="header header-nav flex flex-row justify-center items-center">
        <div class="nav-left flex flex-row justify-between items-center">
            <router-link to="/" class="flex justify-center items-center">
                <img
                    alt="Vue logo"
                    src="@/assets/images/logo.png"
                    class="logo"
                />
                <span class="text-2xl font-bold m2">
                    {{ t('common.appName') }}</span
                >
            </router-link>

            <!-- <Menu /> -->
        </div>
        <h5
            class="center title text-2xl font-medium text-primary-dark dark:text-ternary-light hidden sm:block"
            :title="readerStore.fileName"
        >
            {{ readerStore.fileName }}
        </h5>
        <div class="nav-right flex flex-row justify-between items-center">
            <!-- <LoginButton /> -->
            <el-button :circle="true" @click.prevent="goToGitHub">
                <div i-carbon-logo-github></div>
            </el-button>
            <LangSwitcher class="switch-icon" />
            <ThemeSwitcher class="switch-icon" />
        </div>
    </nav>
</template>
<style lang="scss" scoped>
.header-nav {
    width: 100%;
    line-height: 60px;
    height: 60px;
    display: flex;
    padding: 0 10px;

    .center {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 20px;
    }
}

.logo {
    width: 30px;
    height: 30px;
}

.nav-items {
    margin-left: 10px;
}

.title {
    line-height: 60px;
    font-weight: bold;

    &.title-sm {
        font-size: 12px;
    }
}

.switch-icon {
    margin-left: 20px;
}
</style>

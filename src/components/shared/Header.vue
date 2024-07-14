<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import ThemeSwitcher from '../ThemeSwitcher.vue';
import LangSwitcher from '../LangSwitcher.vue';
import { useReaderStore } from '@/store/reader';
import { useViewStore } from '@/store/view';
const { t } = useI18n();
const readerStore = useReaderStore();
const viewStore = useViewStore();

onMounted(() => {
    viewStore.restore();
});
const onDropdownMenuClick = () => {
    viewStore.save();
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
            <el-dropdown>
                <span class="el-dropdown-link">
                    <el-button :circle="true">
                        <div class="i-carbon:view-filled"></div>
                    </el-button>
                </span>
                <template #dropdown>
                    <!-- 在 index.scss 中设置 drop_down_view -->
                    <el-dropdown-menu
                        class="drop_down_view"
                        @click="onDropdownMenuClick"
                    >
                        <el-dropdown-item>
                            <el-switch
                                v-model="viewStore.isShowSideSection"
                                size="small"
                                inactive-text="章节"
                        /></el-dropdown-item>
                        <el-dropdown-item>
                            <el-switch
                                v-model="viewStore.isShowStyleSection"
                                size="small"
                                inactive-text="侧栏"
                        /></el-dropdown-item>
                        <el-dropdown-item>
                            <el-switch
                                v-model="viewStore.isShowReadingProgress"
                                size="small"
                                inactive-text="阅读进度"
                        /></el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <!-- <LoginButton /> -->
            <!-- <el-button :circle="true" @click.prevent="goToGitHub">
                <div i-carbon-logo-github></div>
            </el-button> -->
            <LangSwitcher class="switch-icon" />
            <ThemeSwitcher class="switch-icon" />
        </div>
    </nav>
</template>
<style lang="scss" scoped>
.header {
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

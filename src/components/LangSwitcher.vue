<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t, availableLocales, locale } = useI18n();

onMounted(() => {
    // 读取本地存储的语言设置
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && availableLocales.includes(savedLocale)) {
        locale.value = savedLocale;
    }
});

function toggleLocales() {
    // change to some real logic
    const locales = availableLocales;
    locale.value =
        locales[(locales.indexOf(locale.value) + 1) % locales.length];
    localStorage.setItem('locale', locale.value);
}
</script>

<template>
    <el-button :circle="true" @click.prevent="toggleLocales">
        <div i-carbon-language />
    </el-button>
</template>

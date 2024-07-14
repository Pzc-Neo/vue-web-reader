<template>
    <div class="toolbar">
        <div class="speakers flex flex-row flex-items-center">
            <div class="w5em">{{ t('reader.speaker') }}</div>
            <el-select
                v-model="readerStore.selectedVoiceIndex"
                class="voice_select_box"
                filterable
                placeholder="Select"
                @change="onSpeakerChange"
            >
                <el-option
                    v-for="(item, index) in readerStore.voices"
                    :key="index"
                    :label="index + '. ' + item.name"
                    :value="index"
                />
            </el-select>
        </div>
        <div class="command">
            <div class="control">
                <el-button @click="onSpeakClick">{{
                    readerStore.isSpeaking
                        ? t('reader.pause')
                        : t('reader.play')
                }}</el-button>
            </div>
            <div class="control rate_control">
                <span class="label">{{ t('reader.rate') }}</span>
                <el-slider
                    v-model="readerStore.speakRate"
                    :min="0.1"
                    :max="10"
                    :step="0.1"
                    @change="onSpeakRateChange"
                />
            </div>
            <div class="control">
                <el-checkbox
                    v-model="readerStore.isAutoScroll"
                    :label="t('reader.autoscroll')"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useReaderStore } from '@/store/reader';

const { t } = useI18n();
const readerStore = useReaderStore();

// 检查浏览器是否支持语音朗读
const synth: SpeechSynthesis | null = window.speechSynthesis;
if (!synth) {
    alert(t('browserNotSupportSpeech'));
}

// 获取浏览器支持的语音列表
onMounted(() => {
    let count = 0;
    const interval = setInterval(() => {
        const voices = synth.getVoices();
        count++;
        if (voices.length > 0) {
            clearInterval(interval);
            readerStore.voices = voices;
        } else {
            if (count > 20) {
                clearInterval(interval);
                alert(t('browserNotSupportSpeech'));
            }
        }
    }, 100);
    readerStore.restore();
});

// 开始朗读用户输入的文本
const onSpeakClick = () => {
    readerStore.toggleIsSpeaking();
};

// 发音人改变时重新朗读
const onSpeakerChange = () => {
    readerStore.speakNext();
};
const onSpeakRateChange = () => {
    readerStore.speakNext();
};
</script>

<style scoped lang="scss">
.toolbar {
    display: flex;
    justify-content: center;
    overflow: hidden;
    overflow-x: auto;
    flex-shrink: 0;
    padding: 0 15px 8px;
    border-bottom: 1px solid var(--main-border-color);
    .voice_select_box {
        min-width: 280px;
        max-width: 340px;
    }

    .command {
        display: flex;
        margin-left: 10px;

        .control {
            margin-left: 10px;
            display: flex;
            align-items: center;
        }
        .rate_control {
            min-width: 160px;
            .label {
                min-width: 38px;
            }
        }
    }
}
</style>

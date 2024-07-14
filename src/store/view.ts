import { defineStore } from 'pinia';

export const useViewStore = defineStore('view', () => {
    /** 样式区域是否显示 */
    const isShowStyleSection = ref(true);
    /** 章节列表区域是否显示 */
    const isShowSideSection = ref(true);
    /** 当前章节阅读进度是否显示 */
    const isShowReadingProgress = ref(true);

    function save() {
        const temp = {
            isShowStyleSection: isShowStyleSection.value,
            isShowSideSection: isShowSideSection.value,
            isShowReadingProgress: isShowReadingProgress.value,
        };
        localStorage.setItem('view', JSON.stringify(temp));
    }
    function restore() {
        const temp = localStorage.getItem('view');
        if (temp) {
            const data = JSON.parse(temp);
            isShowStyleSection.value = data.isShowStyleSection;
            isShowSideSection.value = data.isShowSideSection;
            isShowReadingProgress.value = data.isShowReadingProgress;
        }
    }
    return {
        isShowStyleSection,
        isShowSideSection,
        isShowReadingProgress,
        save,
        restore,
    };
});

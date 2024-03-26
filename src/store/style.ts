import localforage from 'localforage';
import { defineStore } from 'pinia';

interface StyleState {
    isShowSection: boolean;
    selectedFont: string;
    fontSize: number;
    latterSpacing: number;
    lineHeight: number;
    bgImage: string;
    bgImageOpacity: number;
    contentWidth: number;
    fontList: string[];
}
export const useStyleStore = defineStore({
    id: 'style',
    state: (): StyleState => ({
        isShowSection: true,
        selectedFont: '微软雅黑',
        fontSize: 20,
        contentWidth: 65,
        latterSpacing: 1,
        lineHeight: 1.8,
        bgImage:
            'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg',
        bgImageOpacity: 0.16,
        fontList: [
            '微软雅黑',
            '宋体',
            '黑体',
            '隶书',
            '楷体',
            '华文宋体',
            '华文黑体',
            'Arial',
            'Times New Roman',
            'Helvetica',
            'Georgia',
            'Verdana',
            'Courier New',
            'Impact',
            'Comic Sans MS',
            'Trebuchet MS',
            'Palatino Linotype',
        ],
    }),
    getters: {},
    actions: {
        save() {
            const styleData = {
                isShowSection: this.isShowSection,
                selectedFont: this.selectedFont,
                fontSize: this.fontSize,
                fontList: this.fontList,
                bgImage: this.bgImage,
                bgImageOpacity: this.bgImageOpacity,
                lineHeight: this.lineHeight,
                latterSpacing: this.latterSpacing,
                contentWidth: this.contentWidth,
            };
            localforage.setItem('styleSetting', JSON.stringify(styleData));
        },
        restore() {
            localforage.getItem('styleSetting').then((styleData) => {
                if (styleData) {
                    const data = JSON.parse(styleData as string);
                    this.isShowSection = data.isShowSection;
                    this.selectedFont = data.selectedFont;
                    this.fontSize = data.fontSize;
                    this.fontList = data.fontList;
                    this.bgImage = data.bgImage;
                    this.bgImageOpacity = data.bgImageOpacity;
                    this.lineHeight = data.lineHeight;
                    this.latterSpacing = data.latterSpacing;
                    this.contentWidth = data.contentWidth;
                }
            });
        },
    },
});

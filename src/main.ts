import { createApp } from 'vue';
import ElementPlus from 'element-plus';

import App from './App.vue';
import { store } from './store';
import { router } from './router';
import { i18n } from './i18n';
import { updateTheme } from './utils/theme';

import 'uno.css';
import '@/assets/styles/index.scss';
// If you want to use ElMessage, import it.
import 'element-plus/theme-chalk/src/message.scss';
import 'element-plus/theme-chalk/el-loading.css';

async function main() {
    const app = createApp(App);

    // load plugins
    app.use(store);
    app.use(router);
    app.use(ElementPlus);
    app.use(i18n);

    app.mount('#app');

    updateTheme();
}

main();

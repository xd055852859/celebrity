import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { registerStore } from "@/store";
import router from "@/router";
import dayjs from "dayjs";
import CommonIcon from "@/components/cIcon.vue";
import CommonHeader from "@/components/cHeader.vue";
import ElementPlus from "element-plus";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "./styles/common/common.scss";
import "./styles/common/animation.scss";
import "./styles/element/common.scss";
import "element-plus/dist/index.css";
import "amfe-flexible/index.js";
const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// dayjs.extend(relativeTime);
app.provide("dayjs", dayjs);
app
  .component("cicon", CommonIcon)
  .component("cheader", CommonHeader)
app
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .use(pinia)
registerStore();
app.mount("#app");


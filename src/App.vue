<script setup lang="ts">
import { getSearchParamValue, is_mobile } from "@/services/util";
import appStore from "./store";
import request from "@/services/api";
import { storeToRefs } from "pinia";
const { token } = storeToRefs(appStore.authStore);
const { setDeviceWidth, setDeviceType } = appStore.commonStore;
const { setToken, getUserInfo } = appStore.authStore;
onBeforeMount(() => {
  window.addEventListener("message", handle, false);
  // let url = window.location.href;
  //自动切换为https
  // if (url.indexOf("http://localhost") === -1 && url.indexOf("https") < 0) {
  //   url = url.replace("http:", "https:");
  //   window.location.replace(url);
  // }
  const search = window.location.search
    ? window.location.search.split("?")[1]
    : window.location.hash.split("?")[1];
  let token = "";
  if (getSearchParamValue(search, "token")) {
    token = getSearchParamValue(search, "token") as string;
  } else if (localStorage.getItem("token")) {
    token = localStorage.getItem("token") as string;
  }
  if (token) {
    request.setToken(token);
    setToken(token);
  }
  setDeviceWidth(
    document.documentElement.offsetWidth,
    document.documentElement.offsetHeight
  );
  if (document.documentElement.offsetWidth > 650) {
    setDeviceType("pc");
  } else {
    setDeviceType("phone");
  }
});
onMounted(() => {
  window.onresize = () => {
    setDeviceWidth(
      document.documentElement.offsetWidth,
      document.documentElement.offsetHeight
    );
    if (document.documentElement.offsetWidth > 1024) {
      setDeviceType("srceen");
    } else if (document.documentElement.offsetWidth > 720) {
      setDeviceType("pc");
    } else {
      setDeviceType("phone");
    }
  };
  document.oncontextmenu = function () {
    return false;
  };
  // document.onselectstart = function () {
  //   return false;
  // };
});
onUnmounted(() => {
  window.removeEventListener("message", handle, false);
});
const handle = (e: any) => {
  if (
    e.origin === "https://account.qingtime.cn" &&
    e.data.eventName === "redirect"
  ) {
    const token = getSearchParamValue(
      e.data.data.split("?")[1],
      "token"
    ) as string;
    request.setToken(token);
    setToken(token);
  }
};
watch(
  token,
  (newVal) => {
    if (newVal) {
      getUserInfo();
    }
  },
  { immediate: true }
);
</script>

<template>
  <!-- <Timeline />  -->
  <!-- <Story /> -->
  <router-view></router-view>
</template>

<style lang="scss">
#app {
  -webkit-tap-highlight-color: transparent;
}
*::-webkit-scrollbar {
  width: 4px;
  height: 2px;
}
*::-webkit-scrollbar-thumb {
  background: #07292e;
  border-radius: 100px;
}
</style>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import logoSvg from "@/assets/svg/logo.svg";
import {
  DataLine,
  Notebook,
  SwitchButton,
  Picture,
  SetUp,
} from "@element-plus/icons-vue";
import router from "@/router";
import appStore from "@/store";
import { storeToRefs } from "pinia";
const { token } = storeToRefs(appStore.authStore);
const { setToken } = appStore.authStore;
onMounted(() => {
  if (!token.value) {
    router.replace("/login");
    ElMessage({
      message: "请登录",
      type: "error",
      duration: 1000,
    });
  }
});
const logout = () => {
  router.replace("/login");
  localStorage.clear();
  setToken("");
  ElMessage({
    message: "退出登录成功",
    type: "success",
    duration: 1000,
  });
};
</script>
<template>
  <div class="home">
    <div class="home-left">
      <div class="home-title">
        <img :src="logoSvg" alt="" class="home-logo" />
        <div style="width: 100%; height: 100%; text-align: center">
          全息数字博物馆
        </div>
      </div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="home-menu"
        :default-active="$route.fullPath"
        text-color="#fff"
        router
      >
        <el-menu-item index="/back/set">
          <el-icon :size="45"><data-line /></el-icon>
          <div class="menu-title">首页配置</div>
        </el-menu-item>
        <el-menu-item index="/back/celebrity">
          <el-icon :size="35"><SetUp /></el-icon>
          <div class="menu-title">名人管理</div>
        </el-menu-item>
    
      </el-menu>
      <div @click="logout" class="logout-button">
        <el-icon :size="35" :color="'#fff'"><switch-button /></el-icon>
      </div>
    </div>
    <div class="home-right">
      <router-view></router-view>
    </div>
  </div>
</template>
<style scoped lang="scss">
.home {
  width: 100vw;
  height: 100vh;
  @include flex(space-between, null, null);

  .home-left {
    width: 300px;
    height: 100vh;
    background-color: #545c64;
    align-content: flex-start;
    position: relative;
    z-index: 1;
    @include flex(center, null, wrap);
    .home-title {
      width: 100%;
      height: 160px;
      color: #fff;
      font-size: 20px;
      @include flex(center, center, wrap);
      .home-logo {
        width: 100px;
        height: 100px;
        margin-bottom: 10px;
        margin-top: 10px;
      }
    }
    .home-menu {
      width: 100%;
      height: calc(100% - 160px);
      border: 0px;
      &::-webkit-scrollbar {
        width: 0px;
        height: 0px;
      }
      .menu-title {
        width: calc(100% - 40px);
        margin-left: 8px;
        font-size: 20px;
      }
    }
    .logout-button {
      width: 100%;
      height: 80px;
      cursor: pointer;
      position: absolute;
      left: 0px;
      bottom: 0px;
      z-index: 2;
      @include flex(center, center, null);
    }
  }
  .home-right {
    width: calc(100vw - 300px);
    height: 100vh;
  }
}
</style>
<style></style>

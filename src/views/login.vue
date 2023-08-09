<script setup lang="ts">
import router from "@/router";
const login = () => {
  if (localStorage.getItem("token")) {
    router.replace("/");
  } else {
    let redirect = encodeURIComponent(
      `${window.location.protocol}//${window.location.host}/#/back/`
    );
    // localStorage.clear();
    // `https://account.qingtime.cn?apphigh=50&redirect=&logo=https://workfly.qingtime.cn/1650849409262_workingVip.png`;
    let href: string = `https://account.qingtime.cn/?app=9&apphigh=69&logo=https://cdn-suit.qingtime.cn/1686789290852_suit.svg&redirect=${redirect}`;
    window.open(href, "_self");
  }
};
</script>
<template>
  <div class="login">
    <div class="login-title">全息数字博物馆后台管理</div>
    <el-button type="primary" @click="login" size="large">登录</el-button>
  </div>
</template>
<style scoped lang="scss">
.login {
  width: 100vw;
  height: 100vh;
  align-content: center;
  @include flex(center, center, wrap);
  .login-title {
    width: 100%;
    font-size: 40px;
    text-align: center;
    margin-bottom:20vh;
  }
}
</style>
<style></style>

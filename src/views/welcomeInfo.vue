<script setup lang="ts">
import searchSvg from "@/assets/welcome/search.svg";
import { useDebounceFn } from "@vueuse/core";
import infoButtonSvg from "@/assets/welcome/infoButton.svg";
import leftmountainSvg from "@/assets/welcome/leftmountain.svg";
import rightmountainSvg from "@/assets/welcome/rightmountain.svg";
import { Celebrity, ResultProps } from "@/interface/Common";
import api from "@/services/api";

const page = ref<number>(1);
const total = ref<number>(0);
const tableList = ref<any[]>([]);
const searchList = ref<any[]>([]);
const name = ref<string>("");
onMounted(() => {
  getCelebrity();
});
const getCelebrity = async () => {
  const dataRes = (await api.request.get("celebrity", {
    page: 1,
    limit: 100,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    tableList.value = [...dataRes.data];
    searchName();
  }
};
const searchName = useDebounceFn(() => {
  // do something
  if (name.value) {
    searchList.value = tableList.value.filter(
      (item) => item.name.indexOf(name.value) !== -1
    );
  } else {
    searchList.value = [...tableList.value];
  }
}, 1000);
const scrollData = (e) => {
  //文档内容实际高度（包括超出视窗的溢出部分）
  let scrollHeight = e.target.scrollHeight;
  //滚动条滚动距离
  let scrollTop = e.target.scrollTop;
  //窗口可视范围高度
  let height = e.target.clientHeight;
  if (
    height + scrollTop >= scrollHeight &&
    tableList.value.length < total.value
  ) {
    page.value++;
  }
};
</script>
<template>
  <div class="welcomeInfo">
    <div class="welcomeInfo-header">
      <div class="logo-box" @click="$router.replace('/')">
        <img :src="infoButtonSvg" alt="" class="arrow" />
      </div>

      <div class="logo-title">所有名人</div>
      <div
        class="search"
        :style="{
          backgroundImage: `url(${searchSvg}`,
        }"
      >
        <input
          v-model="name"
          type="text"
          @input="searchName"
          placeholder="请输入名人名"
        />
      </div>
    </div>
    <div class="welcomeInfo-box" @scroll="scrollData">
      <div
        class="welcomeInfo-item scale-in-center"
        v-for="(item, index) in searchList"
        :key="'table' + index"
        @click="$router.push('/welcomeDetail/' + item._key)"
      >
        <div class="cover"><img :src="item.avatar" alt="" /></div>
        <div class="name">{{ item.name }}</div>
        <div class="description">{{ item.description }}</div>
      </div>
    </div>
    <div class="welcomeInfo-left"><img :src="leftmountainSvg" alt="" /></div>
    <div class="welcomeInfo-right"><img :src="rightmountainSvg" alt="" /></div>
  </div>
</template>
<style scoped lang="scss">
.welcomeInfo {
  width: 100vw;
  height: 100vh;
  background: #2b4042;
  .welcomeInfo-header {
    width: 100vw;
    height: 140px;
    padding: 0px 48px;
    box-sizing: border-box;
    @include flex(space-between, center, null);
    .logo-box {
      width: 409px;
      height: 100%;
      cursor: pointer;
      @include flex(flex-start, center, null);
      .arrow {
        width: 114px;
        height: 84px;
      }
    }

    .logo-title {
      height: 52px;
      opacity: 0.8;
      font-size: 40px;
      font-weight: 500;
      color: #dbbc84;
      line-height: 52px;
    }
    .search {
      width: 409px;
      height: 78px;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 100% 100%;
      @include flex(flex-start, center, null);
      input {
        width: 305px;
        height: 50px;
        margin-left: 70px;
        background-color: transparent;
        border: 0px;
        font-size: 25px;
        color: rgb(198, 172, 126);
        &::-webkit-input-placeholder {
          /* WebKit browsers */
          color: rgba(198, 172, 126, 0.5);
        }
        &:-moz-placeholder {
          /* Mozilla Firefox 4 to 18 */
          color: rgba(198, 172, 126, 0.5);
        }
        &::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          color: rgba(198, 172, 126, 0.5);
        }
        &:-ms-input-placeholder {
          /* Internet Explorer 10+ */
          color: rgba(198, 172, 126, 0.5);
        }
      }
    }
  }
  .welcomeInfo-box {
    width: 100vw;
    height: calc(100vh - 140px);
    padding: 15px 130px;
    box-sizing: border-box;
    position: relative;
    z-index: 2;
    @include flex(flex-start, flex-start, wrap);
    @include scroll();
    .welcomeInfo-item {
      width: 238px;
      height: 380px;
      background: #122324;
      border-radius: 20px;
      padding: 17px 22px;
      box-sizing: border-box;
      margin-right: 45px;
      margin-bottom: 37px;
      cursor: pointer;
      @include flex(center, center, wrap);
      .cover {
        width: 170px;
        height: 170px;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .name {
        width: 100%;
        height: 26px;
        font-size: 20px;
        font-weight: 500;
        color: #ffffff;
        line-height: 26px;
        @include flex(flex-start, center, null);
      }
      .description {
        width: 202px;
        height: 109px;
        font-size: 13px;
        color: #ffffff;
        line-height: 22px;
        @include more-toLong(5);
      }
      &:nth-child(6n) {
        margin-right: 0px;
      }
    }
  }
  .welcomeInfo-left {
    width: 330px;
    height: 155px;
    position: fixed;
    z-index: 1;
    left: 0px;
    bottom: 0px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .welcomeInfo-right {
    width: 475px;
    height: 186px;
    position: fixed;
    z-index: 1;
    right: 0px;
    bottom: 0px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
<style></style>

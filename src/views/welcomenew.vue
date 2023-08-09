<script setup lang="ts">
import logoSvg from "@/assets/welcome/logo.svg";
import nameSvg from "@/assets/welcome/name.svg";
import buttonPng from "@/assets/welcome/button.png";
import titlePng from "@/assets/welcome/title.png";
import background1Svg from "@/assets/welcome/background1.svg";
import background2Svg from "@/assets/welcome/background2.svg";
import background3Svg from "@/assets/welcome/background3.svg";
import background4Svg from "@/assets/welcome/background4.svg";
import background5Svg from "@/assets/welcome/background5.svg";

import leftmovePng from "@/assets/welcome/leftmove.png";
import rightmovePng from "@/assets/welcome/rightmove.png";
import slowmovePng from "@/assets/welcome/slowmove.png";
import api from "@/services/api";
import { Celebrity, ResultProps } from "@/interface/Common";
import { storeToRefs } from "pinia";
import appStore from "@/store";
import { Mousewheel } from "element-plus";
import Timeline3d from "./timeline3d.vue";
const { deviceHeight, deviceWidth } = storeToRefs(appStore.commonStore);
const logo = ref<string>("");
const background = ref<string>("");
const name = ref<string>("");
const welcome = ref<string>("");
const tableList = ref<any[]>([]);
const randomArr = ref<any[]>([]);
const timerArr = ref<any[]>([]);

const boxRef = ref<any>(null);
const maxWidth = ref<number>(0);
const maxHeight = ref<number>(0);
const circleDom = ref<any[]>([]);
const circleArr = ref<any[]>([]);
//初始化运动的最大宽和高，初始定义0
const maxW = ref<number>(0);
const maxH = ref<number>(0);
const timer = ref<any>(null);
const timer1 = ref<any>(null);
const count = ref<number>(0);
const animateState = ref<boolean>(false);
const imgRef = ref<any>(null);
onMounted(() => {
  getData();
});
const getData = async () => {
  const dataRes = (await api.request.get("site/detail")) as ResultProps;
  if (dataRes.msg === "OK") {
    name.value = dataRes.data.name;
    logo.value = dataRes.data.logo;
    background.value = dataRes.data.background + "_cover";
    welcome.value = dataRes.data.welcome;
    let imgSrc: any = new Image();
    imgSrc.src = background.value;
    console.log(imgSrc.complete);
    if (imgSrc.complete) {
      nextTick(() => {
        background.value = dataRes.data.background;
      });
    }
    imgSrc.onload = function () {
      //图片加载完成后替换图片
      background.value = dataRes.data.background;
    };
  }
};
</script>
<template>
  <div
    class="welcome"
    :style="{
      backgroundImage: `url(${background}`,
    }"
  >
    <!-- <div class="welcome-bg">
      <img :src="background + '_cover'" alt="" ref="imgRef" />
    </div> -->
    <div class="welcome-header">
      <div class="dp-center-center">
        <img :src="logoSvg" alt="" class="logo" /><img
          :src="nameSvg"
          alt=""
          class="logo-name"
        />
      </div>
      <div class="dp-center-center">
        <div
          class="welcome-button shake-bottom"
          @click="$router.push('/welcomeInfo')"
        >
          <img :src="buttonPng" alt="" />
        </div>
      </div>
    </div>

    <div class="welcome-title"><img :src="titlePng" alt="" /></div>
    <div class="welcome-box" ref="boxRef">
      <Timeline3d />
      <div class="welcome-bottom">
        <img :src="leftmovePng" alt="" class="welcome-bottom-left" />
        <img :src="rightmovePng" alt="" class="welcome-bottom-right" />
        <img :src="slowmovePng" alt="" class="welcome-bottom-slow" />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.welcome {
  width: 100vw;
  height: 100vh;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
  position: relative;
  @include flex(center, flew-start, wrap);
  .welcome-header {
    width: 100vw;
    height: 80px;
    padding: 0px 45px;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.29);
    @include flex(space-between, center, null);
    .logo {
      width: 46px;
      height: 39px;
    }
    .logo-name {
      width: 183px;
      height: 25px;
      margin-left: 8px;
    }
    .welcome-button {
      width: 220px;
      height: 54px;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .welcome-title {
    width: 582px;
    height: 180px;
    position: fixed;
    top: 115px;
    right: 669px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .welcome-box {
    width: 100vw;
    height: 680px;
    flex-direction: column;
    // overflow-x: scroll;
    align-content: flex-start;
    margin-top: 180px;
    padding: 0px 5vw;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    @include flex(flex-start, flex-start, wrap);
    .welcome-title {
      width: 33vw;
      height: 20%;
      color: #fff;
      font-size: 24px;
      @include flex(center, center, null);
    }
    .welcome-img-box {
      position: absolute;
      z-index: 1;
      .welcome-img {
        border-radius: 50%;
        overflow: hidden;
        z-index: 3;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .welcome-item-bg {
        width: 45px;
        height: 100%;
        position: absolute;
        z-index: 2;
        top: 0px;
        right: -15px;
        font-size: 18px;
        font-weight: 500;
        text-align: center;
        color: #dbbc84;
        line-height: 45px;
        writing-mode: vertical-rl;

        .welcome-img-bg {
          width: 45px;
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
      }
    }

    // .welcome-first {
    //   @include flex(center, center, null);
    //   .welcome-first-img {
    //     width: 407px;
    //     height: 407px;
    //     border-radius: 50%;
    //     overflow: hidden;
    //     position: absolute;
    //     z-index: 3;
    //     img {
    //       width: 100%;
    //       height: 100%;
    //       object-fit: contain;
    //     }
    //   }
    // }
    // &::-webkit-scrollbar {
    //   width: 0px;
    //   height: 0px;
    // }
  }
  .welcome-bottom {
    position: fixed;
    z-index: 2;
    left: 0px;
    bottom: 0px;
    .welcome-bottom-left {
      width: 1920px;
      height: 182px;
      position: absolute;
      left: 0px;
      bottom: 0px;
      z-index: 3;
      animation: rightmove 30s infinite;
    }
    .welcome-bottom-right {
      width: 1920px;
      height: 182px;
      position: absolute;
      left: 300px;
      bottom: 0px;
      z-index: 2;
      animation: leftmove 30s infinite;
    }
    .welcome-bottom-slow {
      width: 2550px;
      height: 182px;
      position: absolute;
      z-index: 1;
      left: -630px;
      bottom: 0px;
      animation: slowmove 60s infinite;
    }
  }
  .button-small {
    width: 220px;
    height: 220px;
  }
  .button-middle {
    width: 250px;
    height: 250px;
  }
  .button-large {
    width: 280px;
    height: 280px;
  }
  .button-big {
    width: 300px;
    height: 300px;
  }
  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
}
</style>
<style lang="scss">
@keyframes slowmove {
  0% {
    left: -630px;
    bottom: 0px;
  }
  50% {
    left: 0px;
    bottom: 0px;
  }
  100% {
    left: -630px;
    bottom: 0px;
  }
}
@keyframes leftmove {
  0% {
    left: 50px;
    bottom: 0px;
  }
  50% {
    left: 350px;
    bottom: 0px;
  }
  100% {
    left: 50px;
    bottom: 0px;
  }
}
@keyframes rightmove {
  0% {
    left: 0px;
    bottom: 0px;
  }
  50% {
    left: -200px;
    bottom: 0px;
  }
  100% {
    left: 0px;
    bottom: 0px;
  }
}
</style>

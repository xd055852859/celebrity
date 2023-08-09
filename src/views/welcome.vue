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
  getCelebrity();
});
onUnmounted(() => {
  //清理每个球得定时器
  if (timerArr.value.length > 0) {
    timerArr.value.forEach((item) => {
      clearInterval(item);
    });
    timerArr.value = [];
  }
  //清理签到数据
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
  if (timer1.value) {
    clearInterval(timer1.value);
    timer1.value = null;
  }
});
// beforeDestroy() {
//
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
const getCelebrity = async () => {
  const dataRes = (await api.request.get("celebrity", {
    page: 1,
    // keyword: keyWord.value,
    limit: 100,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    tableList.value = [...dataRes.data];
    // tableList.value = createdCelebrity(dataRes.data);
    getRandomList(tableList.value);
    nextTick(() => {
      initBubble();
    });
    timer.value = setInterval(() => {
      clearData();
      getRandomList(tableList.value);
      animateState.value = true;
      initBubble();
      timer1.value = setTimeout(() => {
        animateState.value = false;
      }, 2000);
    }, 15000);
  }
};
const clearData = () => {
  if (timerArr.value.length > 0) {
    timerArr.value.forEach((item) => {
      clearInterval(item);
    });
    timerArr.value = [];
  }
  if (timer1.value) {
    clearInterval(timer1.value);
    timer1.value = null;
  }
  maxWidth.value = 0;
  circleDom.value = [];
  circleArr.value = [];
  //初始化运动的最大宽和高，初始定义0
  maxW.value = 0;
  maxH.value = 0;
};
const getRandomList = (arr) => {
  // randomArr.value = [];
  let newArr = [...arr];
  if (count.value > newArr.length) {
    count.value = 0;
  }
  randomArr.value = newArr.slice(count.value, count.value + 5).reverse();
  count.value = count.value + 5;

  // for (let i = 0; i < 5; i++) {
  //   let index = Math.round(Math.random() * (newArr.length - 1));
  //   randomArr.value[i] = { ...randomArr.value[i], ...newArr[index] };
  //   newArr.splice(index, 1);
  // }
  randomArr.value = createdCelebrity(randomArr.value);
};
const createdCelebrity = (arr) => {
  let newArr: any = [];
  let styleArr = [
    "button-small",
    "button-middle",
    "button-large",
    "button-big",
  ];
  let backgroundArr = [
    background1Svg,
    background2Svg,
    background3Svg,
    background4Svg,
    background5Svg,
  ];
  let position = "left";
  for (let index = 0; index < arr.length; index++) {
    let item = { ...arr[index], left: 0, height: 0 };
    if (styleArr.length === 0) {
      styleArr = [
        "button-small",
        "button-middle",
        "button-large",
        "button-big",
      ];
      backgroundArr = [
        background1Svg,
        background2Svg,
        background3Svg,
        background4Svg,
        background5Svg,
      ];
    }
    //设置随机横坐标
    // item.left = Math.round(Math.random() * celebrityWidth + celebrityWidth);
    let styleIndex = Math.round(Math.random() * (styleArr.length - 1));
    item.style = styleArr[styleIndex];
    styleArr.splice(styleIndex, 1);
    let backgroundIndex = Math.round(
      Math.random() * (backgroundArr.length - 1)
    );
    item.background = backgroundArr[backgroundIndex];
    backgroundArr.splice(backgroundIndex, 1);
    newArr.push(item);
  }
  return newArr;
};
const initBubble = () => {
  let divDom = boxRef.value.getElementsByClassName("welcome-img-box"); //获取新增加的dom
  if (!divDom.length) return;
  //清理每个球得定时器
  timerArr.value.forEach((item) => {
    clearInterval(item);
  });
  timerArr.value = [];

  //给新增加的dom设置宽高
  for (let i = 0; i < divDom.length; i++) {
    circleDom.value.push(divDom[i]);
  }

  //根据浏览器窗口的大小自动调节小球的运动空间
  // window.onresize = () => {

  // };
  let arr: any = [];
  //数组对象的初始化
  for (let i = 0; i < circleDom.value.length; i++) {
    let obj: any = {};

    if (
      circleDom.value[i].getAttribute("class").indexOf("welcome-img-box") !== -1
    ) {
      if (maxWidth.value <= circleDom.value[i].offsetWidth) {
        maxWidth.value = circleDom.value[i].offsetWidth;
      }
      if (maxHeight.value <= circleDom.value[i].offsetHeight) {
        maxHeight.value = circleDom.value[i].offsetHeight;
      }
      maxW.value = boxRef.value.clientWidth - maxWidth.value; //为了让小球不卡在浏览器边缘
      maxH.value = boxRef.value.clientHeight - maxHeight.value; // 所以要减去自身的宽高
      if (arr.length === 0) {
        arr = [
          maxW.value * 0.1,
          maxW.value * 0.3,
          maxW.value * 0.5,
          maxW.value * 0.7,
          maxW.value * 0.9,
        ];
      }
      let xIndex = Math.round(Math.random() * (arr.length - 1));
      obj.x = arr[xIndex]; //初始x坐标
      arr.splice(xIndex, 1);
      obj.y = Math.floor(Math.random() * (maxH.value + 1)); //初始y坐标

      obj.cx = obj.x + circleDom.value[i].offsetWidth / 2; //圆心x坐标
      obj.cy = obj.y + circleDom.value[i].offsetHeight / 2; //圆心y坐标
      obj.movex = Math.floor(Math.random() * 2); //x轴移动方向
      obj.movey = Math.floor(Math.random() * 2); //y轴移动方向
      obj.speed = 1; //随机速度
      obj.timer = null; //计时器
      obj.index = i; //索引值
      circleArr.value.push(obj);
      //小球位置初始化
      circleDom.value[i].style.left = obj.x + "px";
      circleDom.value[i].style.top = obj.y + "px";
    } else {
      //保留之前数据得位置信息，不刷新位置
      obj = circleArr.value[i];
    }

    // move(obj, i);
    move(obj, i);
  }
};

//移动函数
const move = (balls, i) => {
  //每个球单独有定时器
  balls.timer = setInterval(() => {
    if (balls.movex === 1) {
      //如果往右跑，则一直加速度，碰到边界，改为反方向运动
      balls.x += balls.speed;
      if (balls.x + balls.speed >= maxW.value) {
        //防止小球出界
        balls.x = maxW.value;
        balls.movex = 0; //小球运动方向发生改变
      }
    } else {
      balls.x -= balls.speed; // 1和0表示正反方向
      if (balls.x - balls.speed <= 0) {
        balls.x = 0;
        balls.movex = 1;
      }
    }
    if (balls.movey === 1) {
      balls.y += balls.speed;
      if (balls.y + balls.speed >= maxH.value) {
        balls.y = maxH.value;
        balls.movey = 0;
      }
    } else {
      balls.y -= balls.speed;
      if (balls.y - balls.speed <= 0) {
        balls.y = 0;
        balls.movey = 1;
      }
    }
    if (circleDom.value[balls.index]) {
      balls.cx = balls.x + circleDom.value[0].offsetWidth / 2; //小球圆心等于：运动中x的值加上自身的半径
      balls.cy = balls.y + circleDom.value[0].offsetHeight / 2;
      circleDom.value[balls.index].style.left = balls.x + "px"; //小球相对于屏幕的位置
      circleDom.value[balls.index].style.top = balls.y + "px";
      crash(balls.index); //每个小球进行碰撞检测
    }
  }, 25);
  timerArr.value.push(balls.timer);
};
//碰撞函数
const crash = (a) => {
  let container = [...circleArr.value];
  let ball1x = container[a].cx; //在数组中任意球的圆心坐标
  let ball1y = container[a].cy; //思路：先随便拿一个球，然后遍历所有球，拿这个球和所有球的圆心距离比较
  for (let i = 0; i < container.length; i++) {
    if (i !== a) {
      //判断取出来的球不是本身，才能和其他球进行距离判断
      let ball2x = container[i].cx; //将其他球的圆心坐标赋值给球2
      let ball2y = container[i].cy;
      //圆心距 求两个点之间的距离,开平方
      let distence = Math.sqrt(
        (ball1x - ball2x) * (ball1x - ball2x) +
          (ball1y - ball2y) * (ball1y - ball2y)
      );
      if (distence <= maxWidth.value) {
        //球心距离和求直径比较
        if (ball1x > ball2x) {
          //当前位于未知求的右方
          if (ball1y > ball2y) {
            //预设未知球撞当前球，然后当前球改变运动
            container[a].movex = 1; //1表示为正值，对应的右和下
            container[a].movey = 1; //0表示为负值，对应的左和上
          } else if (ball1y < ball2y) {
            container[a].movex = 1;
            container[a].movey = 0;
          } else {
            container[a].movex = 1;
          }
        } else if (ball1x < ball2x) {
          if (ball1y > ball2y) {
            container[a].movex = 0;
            container[a].movey = 0;
          } else if (ball1y < ball2y) {
            container[a].movex = 0;
            container[a].movey = 1;
          } else {
            container[a].movex = 0;
          }
        } else {
          if (ball1y > ball2y) {
            container[a].movey = 1;
          } else if (ball1y < ball2y) {
            container[a].movey = 0;
          }
        }
      }
    }
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
      <!-- <div class="welcome-title">{{ welcome }}</div> -->
      <!-- <div
        class="welcome-item welcome-first"
        v-if="tableList.length > 0"
        :style="{ height: welcome ? '80%' : '100%' }"
      >
        <div class="welcome-img-box">
          <div
            class="welcome-img button-big"
            @click="$router.push('/welcomeDetail/' + tableList[0]._key)"
          >
            <img :src="tableList[0].avatar" alt="" />
          </div>
          <div class="welcome-item-bg">
            <div
              class="welcome-img-bg"
              :style="{
                backgroundImage: `url(${background1Svg}`,
              }"
            >
              <span> {{ tableList[0].name }}</span>
            </div>
          </div>
        </div> -->
      <!-- </div> -->
      <!-- <div
        class="welcome-item"
        
        :style="{
          justifyContent: item.position === 'left' ? 'flex-start' : 'flex-end',
        }"
      > -->
      <!-- :style="{
            width: item.height * 0.85 + 'px',
            height: item.height * 0.85 + 'px',
          }" -->
      <template v-if="randomArr.length > 0">
        <div
          class="welcome-img-box"
          :class="{ [item.style]: true }"
          v-for="item in randomArr"
        >
          <div
            class="welcome-img"
            :class="{
              [item.style]: true,
              'fade-in': animateState,
            }"
            @click="$router.push('/welcomeDetail/' + item._key)"
          >
            <img :src="item.avatar" alt="" />
          </div>
          <div class="welcome-item-bg">
            <div
              class="welcome-img-bg"
              :style="{
                backgroundImage: `url(${item.background}`,
              }"
            >
              <span> {{ item.name }}</span>
            </div>
          </div>
        </div>
      </template>
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

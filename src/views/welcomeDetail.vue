<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
import infoButtonSvg from "@/assets/welcome/infoButton.svg";
import avatarBgSvg from "@/assets/welcome/avatarBg.svg";
// import { vOnClickOutside } from "@vueuse/components";
const props = defineProps<{
  detailKey: string;
}>();
const detail = ref<any>(null);
const chooseState = ref<number>(0);
const chooseIndex = ref<number>(-1000);
const iframeVisible = ref<boolean>(false);
const iframeUrl = ref<string>("");
const iframeRef = ref<any>(null);
const buttonRef = ref<any>(null);
const tagList = ref<any>([]);
onMounted(() => {
  console.log(props);
  getCelebrity();
});
const getCelebrity = async () => {
  const dataRes = (await api.request.get("celebrity/detail", {
    celebrityKey: props.detailKey,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    detail.value = { ...dataRes.data };
    if (detail.value?.tagArr && detail.value?.tagArr.length > 0) {
      tagList.value = [...detail.value.tagArr];
      let length = tagList.value.length;
      tagList.value = tagList.value.map((item, index) => {
        item.position = getCirclePosition({
          x: 1.25,
          y: 1.24,
          r: 1.6,
          nodeNum: length,
          nodeIndex: index,
          allAngle: 360,
          changeAngle: -90,
        });
        item.smallPosition = getCirclePosition({
          x: 1.9,
          y: 1.8,
          r: 1.8,
          nodeNum: length,
          nodeIndex: index,
          allAngle: 100 - (8 - length) * 5,
          changeAngle: 540 + (8 - length) * 3,
        });
        return item;
      });
      // tagList.value=[...detail.value.tagArr]
      // console.log(tagList.value);
    }
  }
};
/**
 * 获取环形坐标
 * 根据圆心计算圆形布局坐标点
 * 已知圆的标准方程 (x - a) ² + (y - b) ² = r ²
 * 通过相关公式可知当前圆的坐标 x , y为当前圆圆心，α为当前点角度，r为半径
 * 圆弧坐标公式： x1 = x + r * Math.cos( α * Math.PI / 180 )， y1 = y + r * Math.sin( α * Math.PI / 180)
 * @param {Number} x 圆心x坐标
 * @param {Number} y 圆心y坐标
 * @param {Number} r 圆半径
 * @param {Number} nodeNum 节点总的数量
 * @param {Number} nodeIndex 当前节点下标
 * @param {Number} changeAngle 改变初始角度，初始角度：x轴正方向为圆的起始角度0°，以顺时针旋转计算
 * @return {Object} {x_,y_} 目标点的坐标x_,y_
 */
const getCirclePosition = ({
  x,
  y,
  r,
  nodeNum,
  nodeIndex,
  allAngle,
  changeAngle,
}: any) => {
  // 获取平分的角度
  let angle = allAngle / nodeNum;
  // 获取当前角度值
  let currentAngle = angle * nodeIndex;
  // 调整这个角度，即可变换初始角度
  if (changeAngle) {
    currentAngle = currentAngle + changeAngle;
  }
  // 圆上点的x_
  let positionX = x + r * Math.cos((currentAngle * Math.PI) / 180) + "rem";
  // 圆上点的y_
  let positionY = y + r * Math.sin((currentAngle * Math.PI) / 180) + "rem";
  return { positionX, positionY };
};
</script>
<template>
  <div
    class="welcomeDetail"
    :style="
      detail?.background
        ? {
            backgroundImage: `url(${detail.background}`,
          }
        : { background: '#2b4042' }
    "
  >
    <div class="welcomeDetail-header">
      <div></div>
      <div class="logo-title" v-if="!iframeVisible">{{ detail?.title }}</div>
      <div></div>
    </div>
    <div
      @click="
        iframeVisible
          ? ((iframeVisible = false), (chooseState = 0))
          : $router.replace('/welcomeInfo')
      "
      class="arrow-box"
    >
      <img :src="infoButtonSvg" alt="" />
    </div>
    <div class="welcomeDetail-box">
      <div
        class="welcomeDetail-avatar-box"
        :style="{
          backgroundImage: `url(${avatarBgSvg}`,
        }"
      >
        <div class="welcomeDetail-avatar">
          <img :src="detail?.avatar" alt="" />
        </div>
        <!-- :class="{ ['welcomeDetail-avatar-icon' + index]: true }" -->
        <div
          class="welcomeDetail-avatar-icon bounce-in-fwd"
          v-for="(item, index) in tagList"
          :key="'avatar' + index"
          @click="
            iframeVisible = true;
            iframeUrl = item.tagUrl;
            chooseIndex = index;
          "
          :style="{
            left: item.position.positionX,
            top: item.position.positionY,
          }"
        >
          <div class="avatar-icon-icon"><img :src="item.tagIcon" alt="" /></div>
          <div class="avatar-icon-name">
            {{ item.tagName }}
          </div>
          <!-- <link
            rel="preload"
            :href="item.tagUrl"
            as="document"
            style="width: 0px; height: 0px; opacity: 0"
          /> -->
        </div>
      </div>
      <div class="welcomeDetail-description-box text-focus-in">
        <div class="welcomeDetail-name">{{ detail?.name }}</div>
        <div class="welcomeDetail-description">{{ detail?.description }}</div>
      </div>
    </div>
  </div>
  <div class="welcomeDetail-iframe" v-if="iframeVisible">
    <iframe
      :src="iframeUrl"
      width="100%"
      height="100%"
      frameborder="no"
      allowfullscreen="true"
      ref="iframeRef"
      @click="chooseState = 2"
    ></iframe>
  </div>
  <!--  -->
  <div
    v-if="iframeVisible"
    :class="{
      'welcome-quick-button': true,
      'click-button': chooseState === 1,
      'out-button': chooseState === 2,
    }"
    ref="buttonRef"
    tabindex="-1"
    @click="buttonRef.focus()"
    @blur="chooseState = 2"
  >
    <div
      class="welcome-quick-avatar"
      @click="chooseState = chooseState === 1 ? 2 : 1"
      :class="{
        'welcome-quick-button': true,
        'click-avatar-button': chooseState === 1,
        'out-avatar-button': chooseState === 2,
      }"
    >
      <img :src="detail?.avatar" alt="" />
    </div>
    <!-- :class="{
        ['welcomeDetail-quick-icon' + index]: chooseState === 1,
        ['welcomeDetail-quick-back' + index]: chooseState === 2,
      }" -->
    <div
      class="welcome-quick-icon"
      v-for="(item, index) in tagList"
      :key="'quick' + index"
      @click="
        iframeRef.contentWindow.location.replace(item.tagUrl);
        // iframeUrl = item.tagUrl;
        chooseIndex = index;
      "
      :style="{
        backgroundColor:
          chooseIndex === index ? '#fff' : 'rgba(7, 41, 46, 0.42)',
        left: item.smallPosition.positionX,
        top: item.smallPosition.positionY,
        zoom: 1 + (8 - tagList.length) * 0.03,
      }"
    >
      <div class="quick-icon-icon"><img :src="item.tagIcon" alt="" /></div>
      <div class="quick-icon-name">{{ item.tagName }}</div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.welcomeDetail {
  width: 100vw;
  height: 100vh;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
  .welcomeDetail-header {
    width: 100vw;
    height: 140px;
    padding: 0px 48px;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    @include flex(space-between, center, null);
    .arrow {
      width: 114px;
      height: 84px;
      cursor: pointer;
    }
    .logo-title {
      height: 52px;
      opacity: 0.8;
      font-size: 40px;
      font-weight: 500;
      color: #dbbc84;
      line-height: 52px;
    }
  }
  .arrow-box {
    width: 114px;
    height: 84px;
    cursor: pointer;
    position: fixed;
    top: 28px;
    left: 48px;
    z-index: 5;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .welcomeDetail-box {
    width: 100vw;
    height: calc(100vh - 140px);
    box-sizing: border-box;
    @include flex(flex-start, center, null);
    .welcomeDetail-avatar-box {
      width: 605px;
      height: 605px;
      position: relative;
      z-index: 1;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 100% 100%;
      margin: 0px 149px 0px 225px;
      @include flex(center, center, null);
      .welcomeDetail-avatar {
        width: 402px;
        height: 402px;
        overflow: hidden;
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .welcomeDetail-avatar-icon {
        width: 120px;
        height: 120px;
        border: 1.22px solid rgba(213, 178, 112, 0.35);
        border-radius: 50%;
        position: absolute;
        z-index: 2;
        align-content: center;
        // transform-origin: 100px, 100px;
        top: 36px;
        left: 38px;
        cursor: pointer;
        @include flex(center, center, wrap);
        .avatar-icon-icon {
          width: 46px;
          height: 46px;
          margin-bottom: 10px;
          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
        .avatar-icon-name {
          width: 100%;
          height: 28px;
          font-size: 20px;
          font-weight: 400;
          text-align: center;
          color: #d5b270;
          line-height: 28px;
        }
      }
    }
    .welcomeDetail-description-box {
      width: 652px;
      height: 605px;
      .welcomeDetail-name {
        width: 100%;
        height: 60px;
        font-size: 36px;
        font-weight: 500;
        color: #ffffff;
        line-height: 60px;
        margin: 26px 0px 7px 0px;
      }
      .welcomeDetail-description {
        width: 100%;
        height: 464px;
        font-size: 18px;
        text-align: left;
        color: #ffffff;
        line-height: 32px;
        @include scroll();
      }
    }
  }
}
.welcome-quick-button {
  width: 100px;
  height: 100px;
  border-top-left-radius: 100%;
  // border-top: 4px solid #d5b270;
  // border-left: 4px solid #d5b270;
  position: fixed;
  z-index: 10;
  right: 0px;
  bottom: 0px;
  background-color: rgba(0, 0, 0, 0);

  .welcome-quick-avatar {
    width: 80px;
    height: 80px;
    overflow: hidden;
    border-radius: 50%;
    border: 0px;
    position: absolute;
    z-index: 2;
    bottom: 10px;
    right: 10px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .welcome-quick-icon {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background-color: #07292e;
    align-content: space-between;
    position: absolute;
    z-index: 1;
    left: 10px;
    bottom: 10px;
    padding: 5px 0px;
    // opacity: 0;
    box-sizing: border-box;
    cursor: pointer;
    @include flex(center, center, wrap);
    .quick-icon-icon {
      width: 28px;
      height: 28px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .quick-icon-name {
      width: 100%;
      height: 15px;
      font-size: 10px;
      text-align: center;
      color: #d5b270;
      line-height: 10px;
    }
  }

  .welcomeDetail-quick-icon0 {
    animation: move0 1s forwards;
  }
  .welcomeDetail-quick-icon1 {
    animation: move1 1s forwards;
  }
  .welcomeDetail-quick-icon2 {
    animation: move2 1s forwards;
  }
  .welcomeDetail-quick-icon3 {
    animation: move3 1s forwards;
  }
  .welcomeDetail-quick-icon4 {
    animation: move4 1s forwards;
  }
  .welcomeDetail-quick-icon5 {
    animation: move5 1s forwards;
  }
  .welcomeDetail-quick-back0 {
    animation: move0 0.5s reverse forwards;
  }
  .welcomeDetail-quick-back1 {
    animation: back1 0.5s forwards;
  }
  .welcomeDetail-quick-back2 {
    animation: back2 0.5s forwards;
  }
  .welcomeDetail-quick-back3 {
    animation: back3 0.5s forwards;
  }
  .welcomeDetail-quick-back4 {
    animation: back4 0.5s forwards;
  }
  .welcomeDetail-quick-back5 {
    animation: back5 0.5s forwards;
  }
}
.click-button {
  animation: change 1s forwards;
}
.out-button {
  animation: change1 1s forwards;
}
.click-avatar-button {
  animation: changeAvatar 1s forwards;
}
.out-avatar-button {
  animation: changeAvatar1 1s forwards;
}
// .welcome-new-button {
//   width: 410px;
//   height: 410px;
//   background-color: rgba(0, 0, 0, 0.48);
// }
.welcomeDetail-iframe {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 4;
  top: 0px;
  left: 0px;
  background: #2b4042;
}
</style>
<style>
@keyframes move0 {
  0% {
    left: 10px;
    bottom: 10px;
    opacity: 0;
  }
  100% {
    left: 43.5px;
    bottom: 12px;
    opacity: 1;
  }
}
@keyframes move1 {
  0% {
    left: 10px;
    bottom: 10px;
    opacity: 0;
  }
  100% {
    left: 66px;
    bottom: 96px;
    opacity: 1;
  }
}
@keyframes move2 {
  0% {
    left: 10px;
    bottom: 10px;
    opacity: 0;
  }
  100% {
    left: 98px;
    bottom: 180px;
    opacity: 1;
  }
}
@keyframes move3 {
  0% {
    left: 10px;
    bottom: 10px;
    opacity: 0;
  }
  100% {
    left: 159px;
    bottom: 250px;
    opacity: 1;
  }
}
@keyframes move4 {
  0% {
    left: 10px;
    bottom: 10px;
    opacity: 0;
  }
  100% {
    left: 240px;
    bottom: 295px;
    opacity: 1;
  }
}
@keyframes move5 {
  0% {
    left: 10px;
    bottom: 10px;
    opacity: 0;
  }
  100% {
    left: 325px;
    bottom: 315px;
    opacity: 1;
  }
}
@keyframes change {
  0% {
    width: 0px;
    height: 0px;
    background-color: rgba(0, 0, 0, 0);
    border-top: 0px;
    border-left: 0px;
  }
  100% {
    width: 410px;
    height: 410px;
    background-color: rgba(0, 0, 0, 0.48);
    border-top: 4px solid #d5b270;
    border-left: 4px solid #d5b270;
  }
}
@keyframes change1 {
  0% {
    width: 410px;
    height: 410px;
    background-color: rgba(0, 0, 0, 0.48);
    border-top: 4px solid #d5b270;
    border-left: 4px solid #d5b270;
  }
  100% {
    width: 100px;
    height: 100px;
    background-color: rgba(0, 0, 0, 0);
    border-top: 0px;
    border-left: 0px;
  }
}
@keyframes changeAvatar {
  0% {
    width: 80px;
    height: 80px;
    bottom: 10px;
    right: 10px;
  }
  100% {
    width: 166px;
    height: 166px;
    bottom: 50px;
    right: 50px;
  }
}
@keyframes changeAvatar1 {
  0% {
    width: 166px;
    height: 166px;
    bottom: 50px;
    right: 50px;
  }
  100% {
    width: 80px;
    height: 80px;
    bottom: 10px;
    right: 10px;
  }
}
@keyframes back0 {
  0% {
    left: 43.5px;
    bottom: 12px;
    opacity: 1;
  }
  100% {
    left: 10px;
    bottom: 10px;
    opacity: 0;
  }
}
@keyframes back1 {
  0% {
    left: 66px;
    bottom: 96px;
    opacity: 1;
  }
  100% {
    left: 10px;
    bottom: 10px;
    opacity: 0;
  }
}
@keyframes back2 {
  0% {
    left: 98px;
    bottom: 180px;
    opacity: 1;
  }
  100% {
    left: 10px;
    bottom: 10px;
    opacity: 0;
  }
}
@keyframes back3 {
  0% {
    left: 159px;
    bottom: 250px;
    opacity: 1;
  }
  100% {
    left: 10px;
    bottom: 10px;
    opacity: 0;
  }
}
@keyframes back4 {
  0% {
    left: 240px;
    bottom: 295px;
    opacity: 1;
  }
  100% {
    left: 10px;
    bottom: 10px;
    opacity: 0;
  }
}
@keyframes back5 {
  0% {
    left: 325px;
    bottom: 315px;
    opacity: 1;
  }
  100% {
    left: 10px;
    bottom: 10px;
    opacity: 0;
  }
}
</style>

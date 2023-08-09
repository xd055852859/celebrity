<script setup lang="ts">
import { uploadFile, useImageUrl } from "@/services/util";
import coverSvg from "@/assets/svg/cover.svg";
import { Close, CirclePlusFilled, DeleteFilled } from "@element-plus/icons-vue";
import api from "@/services/api";
import { ResultProps, Celebrity } from "@/interface/Common";

import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import appStore from "@/store";
import draggable from "vuedraggable";

const { deviceWidth, deviceHeight } = storeToRefs(appStore.commonStore);
const props = defineProps<{
  frameInfo?: any;
}>();
const emits = defineEmits<{
  close: []; // named tuple syntax
  flashList: [data: any];
}>();
const dayjs: any = inject("dayjs");
const drag = ref<boolean>(false);
const key = ref<string>("");
const title = ref<string>("");
const background = ref<string>("");
const name = ref<string>("");
const avatar = ref<string>("");
const description = ref<string>("");
const birthYear = ref<string>("");
const birthMonth = ref<string>("");
const birthDay = ref<string>("");
const tagArr = ref<any>([]);
const tagIndex = ref<number>(-1000);
const chooseIndex = ref<number>(-1000);
const deleteIndex = ref<number>(-1000);
const tagVisible = ref<boolean>(false);
const deleteVisible = ref<boolean>(false);
const tagIcon = ref<string>("");
const tagName = ref<string>("");
const tagUrl = ref<string>("");
const uploadIcon = ref<string>("");
const iconArr = [
  "https://cdn-suit.qingtime.cn/1689233207559_suit.svg",
  "https://cdn-suit.qingtime.cn/1689233238417_suit.svg",
  "https://cdn-suit.qingtime.cn/1689233274494_suit.svg",
  "https://cdn-suit.qingtime.cn/1689233286864_suit.svg",
  "https://cdn-suit.qingtime.cn/1689233306780_suit.svg",
  "https://cdn-suit.qingtime.cn/1689233323550_suit.svg",
];
onMounted(() => {
  if (props?.frameInfo?._key) {
    key.value = props.frameInfo._key;
    title.value = props.frameInfo.title;
    background.value = props.frameInfo.background;
    name.value = props.frameInfo.name;
    avatar.value = props.frameInfo.avatar;
    description.value = props.frameInfo.description;
    tagArr.value = props.frameInfo.tagArr;
    birthYear.value = props.frameInfo.birthdayMemo?.birthYear
      ? props.frameInfo.birthdayMemo.birthYear
      : "";
    birthMonth.value = props.frameInfo.birthdayMemo?.birthMonth
      ? props.frameInfo.birthdayMemo.birthMonth
      : "";
    birthDay.value = props.frameInfo.birthdayMemo?.birthDay
      ? props.frameInfo.birthdayMemo.birthDay
      : "";
  }
});

const uploadImage = (file, type) => {
  let mimeType = ["image/*"];
  if (file) {
    uploadFile(file, mimeType, async (url, name) => {
      switch (type) {
        case "background":
          background.value = url;
          break;
        case "avatar":
          avatar.value = url;
          break;
        case "icon":
          uploadIcon.value = url;
          tagIcon.value = url;
          break;
      }
    });
  }
};
const changeTag = () => {
  if (tagIndex.value !== -1000) {
    tagArr.value[tagIndex.value] = {
      tagIcon: tagIcon.value,
      tagName: tagName.value,
      tagUrl: tagUrl.value,
    };
    tagIndex.value === -1000;
  } else {
    tagArr.value.push({
      tagIcon: tagIcon.value,
      tagName: tagName.value,
      tagUrl: tagUrl.value,
    });
  }
  tagVisible.value = false;
};
const deleteTag = () => {
  if (deleteIndex.value !== -1000) {
    tagArr.value.splice(deleteIndex.value, 1);
  }
  deleteVisible.value = false;
};
const chooseTag = (index, item) => {
  tagIndex.value = index;
  tagVisible.value = true;
  tagIcon.value = item.tagIcon;
  tagName.value = item.tagName;
  tagUrl.value = item.tagUrl;
};
const saveCelebrity = async () => {
  let obj: any = {
    title: title.value,
    background: background.value,
    name: name.value,
    avatar: avatar.value,
    description: description.value,
    tagArr: tagArr.value,
  };
  if (!title.value) {
    ElMessage({
      message: "请输入页面标题",
      type: "error",
      duration: 1000,
    });
    return;
  }
  if (!name.value) {
    ElMessage({
      message: "请输入名人名称",
      type: "error",
      duration: 1000,
    });
    return;
  }
  if (!avatar.value) {
    ElMessage({
      message: "请上传名人头像",
      type: "error",
      duration: 1000,
    });
    return;
  }
  if (!birthYear) {
    ElMessage({
      message: "请输入出生年月",
      type: "error",
      duration: 1000,
    });
    return;
  }
  let saveRes: ResultProps | null = null;
  if (key.value) {
    obj.celebrityKey = key.value;
    obj.birthdayMemo = {
      birthYear: birthYear.value,
      birthMonth: birthMonth.value,
      birthDay: birthDay.value,
    };
    if (+birthYear.value >= 0) {
      obj.birthday = dayjs(
        new Date(
          `${birthYear.value}${birthMonth.value ? "/" + birthMonth.value : ""}${
            birthDay.value ? "/" + birthDay.value : ""
          }`
        )
      )
        .startOf("day")
        .valueOf();
    } else {
      obj.birthday = -31536000000 * (1970 + Math.abs(+birthYear.value));
    }
    saveRes = (await api.request.patch("celebrity", {
      ...obj,
    })) as ResultProps;
  } else {
    saveRes = (await api.request.post("celebrity", {
      ...obj,
    })) as ResultProps;
  }
  if (saveRes.msg === "OK") {
    ElMessage({
      message: `${key.value ? "编辑" : "创建"}名人成功`,
      type: "success",
      duration: 1000,
    });
    emits("close");
    emits("flashList", obj);
  }
};
</script>
<template>
  <div class="celebrity-detail">
    <div class="info">
      <div>
        <div class="left">页面标题</div>
        <div class="right">
          <el-input v-model="title" placeholder="请输入标题" size="large" />
        </div>
      </div>

      <div class="info-area">
        <div class="left">背景图片</div>
        <div class="right dp-center-center">
          <div
            class="upload-button upload-img-button"
            style="width: 100%; height: 250px"
            :style="background ? { border: '0px' } : {}"
          >
            <img
              :src="background"
              alt=""
              v-if="background"
              style="width: 100%; height: 100%"
              class="upload-cover"
            />
            <img :src="coverSvg" alt="" v-else />
            <input
              type="file"
              accept="image/*"
              @change="
                //@ts-ignore
                uploadImage($event.target.files[0], 'background')
              "
              class="upload-img"
            />
            <div
              class="upload-close"
              v-if="background"
              @click="background = ''"
            >
              <el-icon :size="20">
                <Close />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="left">名人名称</div>
        <div class="right">
          <el-input v-model="name" placeholder="请输入名称" size="large" />
        </div>
      </div>
      <div class="info-area">
        <div class="left">出生年月</div>
        <div class="right">
          <el-input
            v-model="birthYear"
            placeholder="请输入出生年"
            style="margin-bottom: 15px"
            size="large"
          />
          <el-input
            v-model="birthMonth"
            placeholder="请输入出生月"
            style="margin-bottom: 15px"
            size="large"
            :disable="!birthYear"
          />
          <el-input
            v-model="birthDay"
            placeholder="请输入出生日"
            size="large"
            :disable="!birthYear && !birthMonth"
          />
        </div>
      </div>
      <div class="info-area">
        <div class="left">名人头像</div>
        <div class="right dp-center-center">
          <div
            class="upload-button upload-img-button"
            style="width: 150px; height: 150px"
            :style="avatar ? { border: '0px' } : {}"
          >
            <img
              :src="avatar"
              alt=""
              v-if="avatar"
              style="width: 100%; height: 100%"
              class="upload-cover"
            />
            <img :src="coverSvg" alt="" v-else />
            <input
              type="file"
              accept="image/*"
              @change="
                //@ts-ignore
                uploadImage($event.target.files[0], 'avatar')
              "
              class="upload-img"
            />
            <div class="upload-close" v-if="avatar" @click="avatar = ''">
              <el-icon :size="20">
                <Close />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="info-area">
        <div class="left">名人描述</div>
        <div class="right">
          <el-input
            v-model="description"
            :rows="7"
            type="textarea"
            placeholder="请输入资源描述"
          />
        </div>
      </div>
      <div>
        <div class="left">媒体标签链接</div>
        <div class="right" v-if="tagArr.length < 8">
          <div
            @click="
              tagVisible = true;
              tagName = '';
              tagIcon = '';
              tagUrl = '';
            "
            style="cursor: pointer"
          >
            <el-icon size="30"><CirclePlusFilled /></el-icon>
          </div>
        </div>
      </div>
      <draggable
        v-model="tagArr"
        @start="drag = true"
        @end="drag = false"
        item-key="index"
        class="screen-container"
      >
        <template #item="{ element, index }">
          <div
            class="tag-item"
            :style="chooseIndex === index ? { background: '#efefef' } : {}"
            @mouseenter="chooseIndex = index"
            @mouseleave="chooseIndex = -1000"
            @click="chooseTag(index, element)"
          >
            <div class="tag-left">
              <div class="tag-left-logo">
                <img :src="element.tagIcon" alt="" v-if="element.tagIcon" />
              </div>

              <div>{{ element.tagName }}</div>
            </div>
            <div
              class="tag-right"
              v-if="chooseIndex === index"
              style="cursor: pointer"
              @click.stop="
                deleteVisible = true;
                deleteIndex = index;
              "
            >
              <el-icon size="18"><DeleteFilled /></el-icon>
            </div>
          </div>
        </template>
      </draggable>
    </div>
    <div class="info-footer">
      <el-button
        type="primary"
        size="large"
        style="width: 120px; margin-right: 20px"
        @click="saveCelebrity"
        >保存</el-button
      >
      <el-button
        size="large"
        style="width: 120px; margin-left: 20px"
        @click="emits('close')"
        >取消</el-button
      >
    </div>
    <el-dialog
      v-model="tagVisible"
      append-to-body
      :title="tagIndex !== -1000 ? '编辑标签' : '创建标签'"
      destroy-on-close
      style="width: 450px"
      @close="tagVisible = false"
    >
      <div class="tag">
        <div class="info" style="padding: 0px 12px">
          <div class="info-area">
            <div class="left">图标</div>
            <div class="right dp-center-center">
              <div
                class="tag-icon"
                v-for="(item, index) in iconArr"
                :key="'icon' + index"
                @click="tagIcon = item"
                :style="tagIcon === item ? { border: '1px solid #dbbc84' } : {}"
              >
                <img :src="item" alt="" />
              </div>
              <div
                class="upload-button upload-img-button"
                style="width: 50px; height: 50px"
                :style="uploadIcon ? { border: '0px' } : {}"
              >
                <img
                  :src="uploadIcon"
                  alt=""
                  v-if="uploadIcon"
                  style="width: 100%; height: 100%"
                  class="upload-cover"
                />
                <img
                  :src="coverSvg"
                  alt=""
                  v-else
                  style="width: 30px; height: 30px"
                />
                <input
                  type="file"
                  accept="image/*"
                  @change="
                    //@ts-ignore
                    uploadImage($event.target.files[0], 'icon')
                  "
                  class="upload-img"
                />
                <div
                  class="upload-close"
                  v-if="uploadIcon"
                  @click="
                    uploadIcon = '';
                    tagIcon = '';
                  "
                >
                  <el-icon :size="20">
                    <Close />
                  </el-icon>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="left">标签名称</div>
            <div class="right">
              <el-input
                v-model="tagName"
                placeholder="请输入标签名称"
                size="large"
              />
            </div>
          </div>
          <div>
            <div class="left">链接地址</div>
            <div class="right">
              <el-input
                v-model="tagUrl"
                placeholder="请输入链接地址"
                size="large"
              />
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="tagVisible = false">取消</el-button>
          <el-button type="primary" @click="changeTag"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="deleteVisible"
      append-to-body
      title="删除标签"
      style="width: 380px"
      @close="deleteVisible = false"
    >
      <span>是否删除该标签</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteVisible = false">取消</el-button>
          <el-button type="primary" @click="deleteTag"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
.celebrity-detail {
  width: 100%;
  height: 100%;
  .tag-item {
    width: 100%;
    height: 60px;
    padding: 0px 5px;
    cursor: pointer;
    @include flex(space-between, center, null);
    .tag-left {
      font-size: 20px;
      @include flex(flex-start, center, null);
      .tag-left-logo {
        width: 40px;
        height: 40px;
        margin-right: 15px;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.tag {
  .tag-icon {
    width: 45px;
    height: 45px;
    margin-right: 10px;
    padding: 5px;
    box-sizing: border-box;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>

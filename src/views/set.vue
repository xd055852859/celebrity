<script setup lang="ts">
import coverSvg from "@/assets/svg/cover.svg";
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
import { compressImg, uploadFile } from "@/services/util";
import { Close, CircleClose } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
const logo = ref<string>("");
const color = ref<string>("");
const background = ref<string>("");
const name = ref<string>("");
const welcome = ref<string>("");
const style = ref<string>("");
onMounted(() => {
  getData();
});
const getData = async () => {
  const dataRes = (await api.request.get("site/detail")) as ResultProps;
  if (dataRes.msg === "OK") {
    name.value = dataRes.data.name;
    logo.value = dataRes.data.logo;
    background.value = dataRes.data.background;
    welcome.value = dataRes.data.welcome;
  }
};
const uploadImage = async (file, type) => {
  let mimeType = ["image/*"];
  let date = new Date().getTime();
  if (file) {
    uploadFile(
      file,
      mimeType,
      async (url, name) => {
        switch (type) {
          case "logo":
            logo.value = url;
            break;
          case "background":
            background.value = url;
            break;
        }
      },
      false,
      date
    );
    if (type === "background") {
      let compressFile = await compressImg(file);
      uploadFile(
        compressFile,
        mimeType,
        (url: string) => {
          console.log("cover", url);
        },
        true,
        date
      );
    }
  }
};

const saveSet = async () => {
  if (!logo.value) {
    ElMessage({
      message: "请上传logo",
      type: "error",
      duration: 1000,
    });
    return;
  }
  if (!name.value) {
    ElMessage({
      message: "请输入站点名",
      type: "error",
      duration: 1000,
    });
    return;
  }
  const saveRes = (await api.request.post("site", {
    name: name.value,
    logo: logo.value,
    background: background.value,
    welcome: welcome.value,
  })) as ResultProps;
  if (saveRes.msg === "OK") {
    ElMessage({
      message: "保存成功",
      type: "success",
      duration: 1000,
    });
  }
};
</script>
<template>
  <div class="set">
    <cheader title="首页配置">
      <template #right>
        <el-button @click="saveSet" type="primary">保存</el-button>
      </template>
    </cheader>
    <div class="box">
      <div class="info set-info">
        <div class="info-area">
          <div class="left">站点logo</div>
          <div class="right dp-center-center">
            <div
              class="upload-button upload-img-button"
              style="width: 250px; height: 250px"
              :style="logo ? { border: '0px' } : {}"
            >
              <img
                :src="logo"
                alt=""
                v-if="logo"
                style="width: 100%; height: 100%"
                class="upload-cover"
              />
              <img :src="coverSvg" alt="" v-else />
              <input
                type="file"
                accept="image/*"
                @change="
                  //@ts-ignore
                  uploadImage($event.target.files[0], 'logo')
                "
                class="upload-img"
              />
              <div class="upload-close" v-if="logo" @click="logo = ''">
                <el-icon :size="20">
                  <Close />
                </el-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="info-area">
          <div class="left">背景图</div>
          <div class="right dp-center-center">
            <div
              class="upload-button upload-img-button"
              style="width: 250px; height: 250px"
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
          <div class="left">站点名</div>
          <div class="right">
            <el-input v-model="name" placeholder="请输入站点名" size="large" />
          </div>
        </div>
        <div>
          <div class="left">欢迎语</div>
          <div class="right">
            <el-input
              v-model="welcome"
              placeholder="请输入欢迎语"
              size="large"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.set {
  width: 100%;
  height: 100%;
  .set-info {
    height: 100%;
    margin-bottom: 70px;
    > div {
      .left {
        width: 100px;
        margin-right: 10px;
        font-size: 16px;
      }
      .right {
        width: calc(100% - 120px);
        @include flex(flex-start, center, null);
      }
    }
  }
}
</style>
<style></style>

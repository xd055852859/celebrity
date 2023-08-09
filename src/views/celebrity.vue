<script setup lang="ts">
import { ResultProps, Celebrity } from "@/interface/Common";
import CelebrityDetail from "@/views/celebrityDetail.vue";
import { Delete, Search, CircleClose } from "@element-plus/icons-vue";
import api from "@/services/api";
import { ElMessage, tabNavEmits } from "element-plus";

const tableList = ref<any[]>([]);
const tableInfo = ref<any>(null);
const searchName = ref<string>("");
const keyWord = ref<string>("");
const tableKey = ref<string>("");
const detailVisible = ref<boolean>(false);
const deleteVisible = ref<boolean>(false);
const deleteIndex = ref<number>(-1000);
const deleteKey = ref<string>("");
const tableRef = ref<any>(null);

const page = ref<number>(1);
const pageNum = ref<number>(0);

const getData = async () => {
  const dataRes = (await api.request.get("celebrity", {
    page: page.value,
    keyword: keyWord.value,
    limit: 30,
  })) as ResultProps;
  if (dataRes.msg === "OK") {
    tableList.value = [...dataRes.data];
    pageNum.value = dataRes.pageNum as number;
  }
};

// const searchData = () => {
//   if (searchName.value) {
//     tableList.value = tableList.value.filter((item) => {
//       if (item.name.indexOf(searchName.value) !== -1) {
//         return item;
//       }
//     });
//   }
// };

const deleteList = async () => {
  deleteVisible.value = false;
  const infoRes = (await api.request.delete("celebrity", {
    celebrityKey: deleteKey.value,
  })) as ResultProps;
  if (infoRes.msg === "OK") {
    ElMessage({
      message: `删除名人成功`,
      type: "success",
      duration: 1000,
    });
    let deleteIndex = tableList.value.findIndex(
      (item) => item._key === deleteKey.value
    );
    if (deleteIndex !== -1) {
      tableList.value.splice(deleteIndex, 1);
    }
  }
};
const flashList = (data: Celebrity) => {
  if (tableKey.value) {
    let tableIndex = tableList.value.findIndex(
      (item) => item._key === tableKey.value
    );
    if (tableIndex !== -1) {
      tableList.value[tableIndex] = { ...tableList.value[tableIndex], ...data };
      tableKey.value = "";
    }
  } else {
    tableList.value.push(data);
  }
};
watchEffect(() => {
  getData();
});
watch(searchName, (newInput) => {
  if (!newInput) {
    keyWord.value = "";
  }
});
</script>
<template>
  <cheader title="名人管理" />
  <div class="box">
    <div class="box-header">
      <div class="left">
        <el-input
          v-model="searchName"
          style="width: 250px"
          placeholder="请输入名人名称"
          :prefix-icon="Search"
          @change="keyWord = searchName"
          size="large"
        />
      </div>
      <div class="right">
        <el-button
          type="primary"
          @click="
            detailVisible = true;
            tableInfo = null;
            tableKey = '';
          "
          >添加名人</el-button
        >
      </div>
    </div>
    <el-table :data="tableList" class="box-table" ref="tableRef">
      <el-table-column
        prop="title"
        width="180"
        label="页面标题"
        align="center"
      />
      <el-table-column label="背景图片" width="180" align="center">
        <template #default="scope">
          <div class="site-img" v-if="scope.row.background">
            <div class="site-img-item">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.background"
                :preview-src-list="[scope.row.background]"
                :initial-index="0"
                fit="contain"
                preview-teleported
              />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="名人名称"
        width="150"
        align="center"
      />
      <el-table-column label="名人头像" width="180" align="center">
        <template #default="scope">
          <div class="site-img" v-if="scope.row.avatar">
            <div class="site-img-item">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.avatar"
                :preview-src-list="[scope.row.avatar]"
                :initial-index="0"
                fit="contain"
                preview-teleported
              />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="名人描述"
        min-width="300"
        header-align="center"
      />
      <el-table-column label="标签链接" width="150" align="center">
        <template #default="scope">
          <div
            v-for="(item, index) in scope.row.tagArr"
            class="dp-space-center"
            style="justify-content: flex-start"
          >
            <el-tag>{{ item.tagName }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="出生年月" width="150" align="center">
        <template #default="scope">
          <div>
            {{
              `${scope.row.birthdayMemo.birthYear}年${
                scope.row.birthdayMemo.birthMonth
                  ? scope.row.birthdayMemo.birthMonth + "月"
                  : ""
              }${
                scope.row.birthdayMemo.birthDay
                  ? scope.row.birthdayMemo.birthDay + "日"
                  : ""
              }`
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180" align="center">
        <template #default="scope, index">
          <el-button
            link
            type="primary"
            size="small"
            @click.stop="
              tableKey = scope.row._key;
              tableInfo = { ...scope.row };
              detailVisible = true;
            "
            >编辑</el-button
          >
          <el-button
            link
            type="primary"
            size="small"
            @click.stop="
              deleteVisible = true;
              deleteKey = scope.row._key;
            "
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="box-footer">
      <el-pagination
        background
        :page-size="30"
        layout="prev, pager, next"
        :page-count="pageNum"
        @current-change="
          (newPage) => {
            page = newPage;
          }
        "
      />
    </div>
    <el-drawer
      v-model="detailVisible"
      :title="tableKey ? '编辑名人' : '创建名人'"
      destroy-on-close
      direction="rtl"
      size="500"
    >
      <CelebrityDetail
        @close="
          detailVisible = false;
          tableInfo = null;
        "
        @flashList="flashList"
        :frameInfo="tableInfo"
      />
    </el-drawer>

    <el-dialog
      v-model="deleteVisible"
      append-to-body
      :title="`删除名人`"
      style="width: 380px"
      @close="deleteVisible = false"
    >
      <span>是否删除该名人</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteVisible = false">取消</el-button>
          <el-button type="primary" @click="deleteList"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss"></style>
<style></style>

<script setup lang="ts">
import { ElMessage } from "element-plus";
const props = defineProps<{
  name?: string;
  title?: string;
}>();
</script>
<template>
  <div class="common-header">
    {{ title }}
    <slot name="right"></slot>
  </div>
</template>
<style scoped lang="scss">
.common-header {
  width: 100%;
  height: 70px;
  font-size: 20px;
  box-shadow: 0px 8px 14px 0px rgba(72, 89, 102, 0.1);
  @include p-number(15px, 0px);
  @include flex(space-between, center, null);
}
</style>
<style></style>

<template>
  <div class="selector-format-container">
    <span
      class="selector-format-label"
      :style="labelStyle"
      >格式</span
    >
    <el-select-v2
      class="selector-format-select"
      v-model="value"
      filterable
      clearable
      allow-create
      collapse-tags
      collapse-tags-tooltip
      :max-collapse-tags="maxCollapseTags"
      :options="data.options"
      placeholder="格式过滤"
      multiple
    ></el-select-v2>
  </div>
</template>

<script setup lang="ts">
  //? 选项类型
  type option = {
    value: string;
    label: string;
  };
  interface IProps {
    value: any[];
    options: option[];
    fontSize?: string;
    maxCollapseTags?: number;
  }
  const props = withDefaults(defineProps<IProps>(), {
    value: () => [],
    options: () => <option[]>[],
    fontSize: "16px !important",
    maxCollapseTags: 1,
  });
  const emits = defineEmits<{(e: "update", value: any[]): void}>();

  //s 数据
  const data = ref({
    value: props.value,
    options: props.options,
  });

  //j 选中的结果
  const value = computed({
    get() {
      return data.value.value;
    },
    set(val) {
      //s 结果同步更新
      data.value.value = val;
      //s 向组件外部发出更新
      emits("update", val);
    },
  });

  //j 标签style
  const labelStyle = computed(() => {
    return {
      "font-size": props.fontSize,
    };
  });

  //w 监听props结果的变化
  watch(
    () => props.value,
    (newVal, oldVal) => {
      //s 数据项发生变化 -> 同步更新
      data.value.value = newVal;
    }
  );

  //w 监听数据项的变化
  watch(
    () => props.options,
    (newVal, oldVal) => {
      //s 数据项发生变化 -> 同步更新
      data.value.options = newVal;
    }
  );
</script>

<style lang="scss" scoped>
  .selector-format-container {
    position: relative;
    width: 100%;
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
    gap: 8px;

    .selector-format-label {
      margin: 0;
      text-align: center;
      white-space: nowrap; //s 防止换行
    }
    .selector-format-select {
      flex-grow: 1;
    }
  }
</style>

<template>
  <span class="input-number-range-container">
    <span class="input-number-range-item">
      <span class="input-number-range-label">最小</span>
      <el-input-number
        v-model="min"
        :min="0"
        controls-position="right"
      />
    </span>
    <span class="input-number-range-item">
      <span class="input-number-range-label">最大</span>
      <el-input-number
        v-model="max"
        :min="min"
        controls-position="right"
      />
    </span>
  </span>
</template>

<script lang="ts" setup>
  interface IProps {
    value: [number, number];
  }
  const props = withDefaults(defineProps<IProps>(), {
    value() {
      return [0, 0];
    },
  });

  const emits = defineEmits<{(e: "update", val: [number, number]): void}>();

  //s 数据项
  const data = ref({
    min: props.value[0],
    max: props.value[1],
  });

  //j 最小值
  const min = computed({
    get() {
      return data.value.min;
    },
    set(value) {
      data.value.min = value;
      returnResult();
    },
  });

  //j 最大值
  const max = computed({
    get() {
      return data.value.max;
    },
    set(value) {
      if (value >= min.value) {
        data.value.max = value;
      } else {
        data.value.max = min.value;
      }
      returnResult();
    },
  });

  //f 返回结果
  function returnResult() {
    emits("update", [min.value, max.value]);
  }
</script>

<style lang="scss" scoped>
  .input-number-range-container {
    width: 100%;
    display: flex;
    justify-content: space-around;
    gap: 4px;

    .input-number-range-item {
      display: flex;
      gap: 4px;
    }
  }
</style>

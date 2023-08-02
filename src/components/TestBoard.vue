<template>
  <xs-drag-modal
    v-model="openModal"
    :modal-init-width="400"
    :modal-init-height="400"
    modal-class="modal"
    teleport=".onlineGallery-child-window-container"
  >
    <!-- !头部 -->
    <template #title>
      <h4 style="color: black">测试窗口</h4>
    </template>
    <!-- !主体 -->
    <template #default>
      <div>当前使用内存使用情况:</div>
      <div
        v-if="isSupported && memory"
        class="inline-grid grid-cols-2 gap-x-4 gap-y-2"
      >
        <template v-if="memory">
          <div opacity="50">使用中: {{ size(memory.usedJSHeapSize) }}</div>
          <div opacity="50">已分配: {{ size(memory.totalJSHeapSize) }}</div>
          <div opacity="50">最大值: {{ size(memory.jsHeapSizeLimit) }}</div>
        </template>
      </div>
      <div>可见卡片数量: {{ cardsStore.visibleCards.length }}</div>
      <div>
        <div>剪切板支持情况：{{ clipboard_isSupported }}</div>
        <div>剪切板内容：{{ clipboard_text }}</div>
      </div>
    </template>
    <!-- !底部 -->
    <template #footer>
      <var-space :size="[0, 4]">
        <var-button
          type="primary"
          @click="handleClose"
        >
          <span style="color: rgb(256, 256, 256) !important"> 确认 </span>
        </var-button>
        <var-button
          type="primary"
          @click="get_ClipBoardText"
        >
          获取剪切板文本
        </var-button>
        <var-button @click="handleClose">取 消</var-button>
      </var-space>
    </template>
  </xs-drag-modal>
</template>

<script setup lang="ts">
  interface IProps {
    modelValue: boolean; //* 用于判断是否显示modal
  }
  const props = withDefaults(defineProps<IProps>(), {
    modelValue: false,
  });
  const emits = defineEmits(["update:modelValue"]);

  //s 用户剪切板
  const {text, isSupported: clipboard_isSupported, copy, copied} = useClipboard();

  const openModal = ref(false);

  onMounted(() => {
    openModal.value = props.modelValue;
  });
  //w 监听开关情况
  watch(
    () => props.modelValue,
    (newVal) => {
      openModal.value = newVal;
    }
  );

  //f 关闭处理
  function handleClose() {
    openModal.value = false;
    emits("update:modelValue", false);
  }

  const clipboard_text = ref("");

  async function get_ClipBoardText() {
    clipboard_text.value = await getClipBoardText();
  }

  const appInfo = useAppInfoStore();
  const cardsStore = useCardsStore();
  const eagleStore = useEagleStore(); //s 实例化eagle api数据仓库

  const eagle = eagleStore.eagle;

  const containerRef = ref<HTMLElement | null>();

  const {isSupported, memory} = useMemory();
  function size(v: number) {
    const kb = v / 1024 / 1024;
    return `${kb.toFixed(2)} MB`;
  }

  //s 初始位置信息
  const init = reactive({
    left: 0,
    top: 0,
  });

  //j 对话框样式
  const style = computed(() => {
    return {
      left: init.left + "px",
      top: init.top + "px",
    };
  });
</script>

<style lang="scss" scoped></style>

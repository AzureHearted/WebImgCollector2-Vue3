<template>
  <var-drag
    :style="style"
    teleport=".onlineGallery-child-window-container"
  >
    <div
      class="test-container"
      ref="containerRef"
    >
      <!-- !头部 -->
      <div class="test-header">
        <h3>测试窗口</h3>
      </div>
      <!-- !主体 -->
      <div class="test-body">
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
      </div>

      <!-- !底部 -->
      <div class="test-footer">
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
      </div>
    </div>
  </var-drag>
</template>

<script setup lang="ts">
  const emits = defineEmits(["toClose"]);

  const {text, isSupported: clipboard_isSupported, copy, copied} = useClipboard(); //s 用户剪切板

  const clipboard_text = ref("");

  async function get_ClipBoardText() {
    clipboard_text.value = await getClipBoardText();
  }

  const appInfo = useAppInfoStore();
  const cardsStore = useCardsStore();
  const eagleStore = useEagleStore(); //s 实例化eagle api数据仓库

  const eagle = eagleStore.eagle;

  onMounted(() => {});

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

  onMounted(() => {
    const {width: w_width, height: w_height} = appInfo.window;
    const {width: c_width, height: c_height} = containerRef.value!.getBoundingClientRect();
    // console.log(w_width, w_height);
    // console.log(c_width, c_height);
    const left = (w_width - c_width) / 2;
    const top = (w_height - c_height) / 2;
    console.log(left, top);
    init.left = left;
    init.top = top;
  });

  //* 窗口关闭处理
  function handleClose() {
    emits("toClose");
  }
</script>

<style lang="scss" scoped>
  //s 容器
  .test-container {
    // position: relative;
    width: 400px;
    height: fit-content;
    min-height: 300px;
    padding: 20px;

    background-color: rgba(245, 222, 179, 0.9);
    border-radius: 4px;

    display: flex;
    flex-flow: column nowrap;

    box-shadow: var(--el-box-shadow-dark);
  }
  //s 头部
  .test-header {
    background-color: burlywood;
    h3 {
      margin: 0;
      padding: 0;
    }
  }
  //s 主体
  .test-body {
    background-color: white;
    position: relative;
    flex-grow: 1;
    width: 100%;
    //! 虚拟列表容器
    .listContainer {
      & {
        width: 100%;
        height: 100%;
      }
      //* 虚拟列表画布
      .listWrapper {
        width: 100%;

        display: flex;
        flex-flow: row;
        justify-content: center;
        align-items: center;
      }
    }
  }
  //s 底部

  .test-footer {
    background-color: aquamarine;

    width: 100%;
    height: fit-content;
    display: flex;
    flex-flow: row nowrap;
    justify-content: end;
  }
</style>

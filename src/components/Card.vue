<template>
  <div
    ref="cardRef"
    class="onlineGallery-card"
    :data-index="index"
    :style="cardStyle"
    :data-show="show"
    :data-loading="loading"
    @contextmenu.prevent.self
  >
    <!-- !FancyBox锚点 -->
    <a
      target="_blank"
      class="card-FancyBox-anchor"
      data-onlineGallery-fancybox="onlineGallery"
      :data-type="fancyBoxType"
      :href="card.linkUrl"
      :data-thumb="card.picUrl"
      :data-width="fancyBoxWidth"
      :data-height="fancyBoxHeight"
    >
    </a>
    <!-- !内容区 -->
    <el-skeleton
      style="width: 100%; height: 100%; z-index: 0 !important"
      :loading="loading"
      :throttle="500"
      :animated="true"
      :count="1"
    >
      <template #template>
        <!-- !骨架内容 -->
        <el-skeleton-item
          variant="image"
          style="width: 100%; height: 100%"
        />
      </template>
      <template #default>
        <!-- !真实内容 -->
        <div class="really-content">
          <transition
            name="content"
            appear
          >
            <!-- !主要内容区 -->
            <div
              class="onlineGallery-card-body"
              v-if="show"
            >
              <!-- s图片 -->
              <Img
                :src="card.picUrl"
                :width="card.meta.width"
                :height="card.meta.height"
                :parentSelector="'#onlineGallery-list-container'"
                :lazy="false"
              >
              </Img>
            </div>
          </transition>
          <!-- !其他内容区 -->
          <div
            class="onlineGallery-card-other"
            v-if="show"
          >
            <transition appear>
              <!-- !标签组 -->
              <div
                class="tag-group"
                v-if="show"
              >
                <!-- s后缀名标签 -->
                <el-tooltip
                  effect="dark"
                  :show-after="1000"
                  :enterable="false"
                  :content="card.linkUrlExt"
                  placement="top"
                  v-if="card.linkUrlExt"
                >
                  <el-tag
                    class="el-tag"
                    hit
                    round
                    size="small"
                    type="danger"
                    @click.right="copyTagContent(card.linkUrlExt)"
                  >
                    {{ card.linkUrlExt }}
                  </el-tag>
                </el-tooltip>
                <!-- s大小标签 -->
                <el-tooltip
                  v-if="card.linkSize"
                  effect="dark"
                  :show-after="1000"
                  :enterable="false"
                  :content="linkSize_tag"
                  placement="top"
                >
                  <el-tag
                    class="el-tag"
                    round
                    hit
                    size="small"
                    type="info"
                    @click.right="copyTagContent(linkSize_tag)"
                  >
                    {{ linkSize_tag }}
                  </el-tag>
                </el-tooltip>
                <!-- s尺寸标签 -->
                <el-tooltip
                  effect="dark"
                  :show-after="1000"
                  :enterable="false"
                  :content="size_tag"
                  placement="top"
                >
                  <el-tag
                    class="el-tag"
                    size="small"
                    type="info"
                    hit
                    @click.right="copyTagContent(size_tag)"
                    round
                  >
                    {{ size_tag }}
                  </el-tag>
                </el-tooltip>
                <!-- s名称标签 -->
                <el-tooltip
                  effect="dark"
                  :show-after="1000"
                  :enterable="false"
                  :content="card.name"
                  placement="top"
                >
                  <el-tag
                    class="el-tag"
                    hit
                    round
                    size="small"
                    @click.right="copyTagContent(card.name)"
                  >
                    {{ card.name }}
                  </el-tag>
                </el-tooltip>
              </div>
            </transition>

            <transition appear>
              <!-- s勾选框 -->
              <el-checkbox
                v-model="card.selected"
                class="checkbox"
                v-if="show"
              />
            </transition>

            <transition appear>
              <!-- s按钮组 -->
              <div
                class="button-group"
                v-if="show"
              >
                <!-- s下载按钮 -->
                <el-button
                  class="button download"
                  type="primary"
                  circle
                  @click.stop="download"
                  :loading="downloading"
                >
                  <template #icon>
                    <el-icon><i-ep-Download /></el-icon>
                  </template>
                </el-button>

                <!-- s定位按钮 -->
                <el-button
                  class="button toPosition"
                  type="primary"
                  circle
                  @click.stop="toPosition"
                  :loading="downloading"
                >
                  <template #icon>
                    <el-icon><i-ep-LocationFilled /></el-icon>
                  </template>
                </el-button>
              </div>
            </transition>
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
  const {text, isSupported, copy} = useClipboard(); //s 剪切板

  interface Props {
    card: matchCard;
    index: number;
  }
  const props = withDefaults(defineProps<Props>(), {
    card: () => {
      return {
        name: "",
        linkUrl: "",
        picUrl: "",
        originUrls: [],
        metaOrigin: "",
        meta: <metaInterFace>{
          width: 0,
          height: 0,
          aspectRatio: 3 / 4,
        },
        selected: false, //? 选中标识符
        dom: null,
        visible: false,
        match: false,
      };
    },
  });

  const card = props.card;

  const appInfo = useAppInfoStore(); //s 导入状态仓库

  const toolBarStore = useToolBarStore();

  const downloading = ref(false); //s 用于标记下载过程

  //j loading 加载状态
  const loading = computed((): boolean => {
    return card.linkUrlType === undefined;
  });

  //j 展示状态
  const show = computed((): boolean => {
    return card.visible || visibility.value;
  });

  //j card样式
  const cardStyle = computed(() => {
    return {
      "--aspect-ratio": card.meta.aspectRatio,
    };
  });

  //s fancyBox可展示类型定义
  type fancyBoxShowType = "image" | "iframe" | "video" | "inline" | "html";
  //j fancyBoxType的类型
  const fancyBoxType = computed((): fancyBoxShowType => {
    // console.log(card);
    let type: fancyBoxShowType = "iframe";
    let linkUrlType = `${card.linkUrlType}`;
    //s 如果没有类型则先通过链接进行类型推断
    if (card.linkUrlType !== "image" && card.linkUrlType !== "video") {
      linkUrlType = guessUrlType(card.linkUrl);
    }
    if (linkUrlType === "image" || linkUrlType === "video") {
      type = linkUrlType;
    } else {
      type = "iframe";
    }
    return type;
  });

  //j fancyBox 尺寸(宽度)
  const fancyBoxWidth = computed((): number | null => {
    if (
      (fancyBoxType.value === "image" || fancyBoxType.value === "video") &&
      card.meta.width >= 350
    ) {
      return card.meta.width;
    } else {
      return null;
    }
  });

  //j fancyBox 尺寸(高度)
  const fancyBoxHeight = computed((): number | null => {
    if (
      (fancyBoxType.value === "image" || fancyBoxType.value === "video") &&
      card.meta.width >= 350
    ) {
      return card.meta.height;
    } else {
      return null;
    }
  });

  //j 尺寸计算属性
  const size_tag = computed(() => {
    return `${card.meta.width}x${card.meta.height}`;
  });

  //j link大小计算属性
  const linkSize_tag = computed(() => {
    if (card.linkSize) {
      return byteSizeAutoUnit(card.linkSize);
    } else {
      return (0).toFixed(2) + "KB";
    }
  });

  /**
   * f 字节 -> 自动单位
   * @param byteSize 字节大小
   */
  function byteSizeAutoUnit(byteSize: number, fixed: number = 2): string {
    enum Unit {
      "B" = 1,
      "KB",
      "MB",
      "GB",
      "TB",
    }
    let unit = 1;
    let num = byteSize;
    while (num / 1024 >= 1) {
      if (unit + 1 >= 1 && unit <= 5) {
        num = num / 1024;
        unit++;
      } else {
        break;
      }
    }
    let unitStr: "B" | "KB" | "MB" | "GB" | "TB";
    switch (unit) {
      case 1:
        unitStr = "B";
        break;
      case 2:
        unitStr = "KB";
        break;
      case 3:
        unitStr = "MB";
        break;
      case 4:
        unitStr = "GB";
        break;
      case 5:
        unitStr = "TB";
        break;
      default:
        num = byteSize;
        unitStr = "B";
        break;
    }
    return `${num.toFixed(fixed)}${unitStr}`;
  }

  /**
   * f 复制内容到剪切板
   * @param {string} content 文本内容
   */
  async function copyTagContent(content: string) {
    await copy(content);
    ElMessage({
      type: "success",
      // showClose: true,
      grouping: true,
      center: true,
      duration: 1000,
      offset: 120,
      message: h("p", {style: "display:flex;gap:10px"}, [
        h("i", {style: "color: teal"}, content),
        h("span", {style: "color: black"}, "复制成功！"),
      ]),
    });
  }

  //f 下载图片
  async function download() {
    const card = props.card;
    downloading.value = true;
    let blob: Blob | null = (await getBlobByUrlAuto(card.linkUrl)) as Blob;
    if (blob) {
      let ext = "";
      if (!isEmpty(card.linkUrlExt)) {
        ext = "." + card.linkUrlExt;
      }
      await saveAs(blob, `${card.name}${ext}`);
      blob = null;
      downloading.value = false;
    }
  }

  //f  在网页中定位
  async function toPosition() {
    const dom = card.dom;
    if (dom != null) {
      appInfo.container.open = !appInfo.container.open;
      dom.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }

  //f link信息补全
  async function linkInfo_complete() {
    let linkBlob: Blob | null = null;
    //s 获取blob用于判断link用于获取link尺寸和类型
    linkBlob = await getBlobByUrlAuto(card.linkUrl);

    //s 大小
    if (!card.linkSize) {
      card.linkSize = linkBlob?.size || 0;
    }

    //s 类型
    if (!card.linkUrlType) {
      if (linkBlob) {
        card.linkUrlType = getBlobType(linkBlob);
      } else {
        card.linkUrlType = getUrlType(card.linkUrl);
      }
    }

    //s 扩展名
    if (!card.linkUrlExt) {
      if (linkBlob) card.linkUrlExt = getExtByBlob(linkBlob);
    }

    //s 获取完成后销毁临时blob(防止占用堆区内存)
    linkBlob = null;
  }

  //f pic信息补全
  async function picInfo_complete() {
    let picBlob: Blob | null = null;
    //s 获取blob用于判断pic用于获取pic尺寸和类型
    picBlob = await getBlobByUrlAuto(card.picUrl);

    //s 大小
    if (!card.picSize) {
      card.picSize = picBlob?.size || 0;
    }

    //s 类型
    if (!card.picUrlType) {
      if (picBlob) {
        card.picUrlType = getBlobType(picBlob);
      } else {
        card.picUrlType = getUrlType(card.picUrl);
      }
    }

    //s 扩展名
    if (!card.picUrlExt) {
      if (picBlob) card.picUrlExt = getExtByBlob(picBlob);
    }

    //s 获取完成后销毁临时blob(防止占用堆区内存)
    picBlob = null;
  }

  //! 卡片可见性判断
  const cardRef = ref<HTMLElement | null>();

  const visibility = useElementVisibility(cardRef, {
    scrollTarget: document.querySelector("#onlineGallery-list-container") as HTMLElement,
  });

  let stopFn: Function = () => {};
  onUpdated(() => {
    //s 一旦card的状态(eg:index)变化则重新绑定监视器
    stopFn();
    const {stop} = useIntersectionObserver(
      cardRef,
      ([{isIntersecting}], observerElement) => {
        card.visible = isIntersecting;
      },
      {
        immediate: true,
        root: document.querySelector("#onlineGallery-container") as HTMLElement,
        rootMargin: "100px 100px 100px 100px",
        // threshold: [0, 0.1, 0.25, 0.5, 0.75, 0.8, 0.9, 1],
      }
    );
    stopFn = stop;
  });

  //w 监视可见性变化 -> 必要时对card状态进行更新
  watch(
    () => card.visible,
    async (visible) => {
      if (visible) {
        if (!card.linkUrlType) {
          console.log("信息获取");
          await linkInfo_complete();
        }
      }
    }
  );
</script>

<style scoped lang="scss">
  * {
    border: 0;
    margin: 0;
    box-sizing: border-box;
    /* 禁止选中文字 */
    // user-select: none;
    /* 禁止图文拖拽 */
    // -webkit-user-drag: none;
  }

  //s 卡片样式
  .onlineGallery-card {
    border: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    scroll-snap-align: start;
    position: relative;
    border-radius: 4px;
    box-shadow: var(--el-box-shadow-dark);

    aspect-ratio: var(--aspect-ratio) !important;
    max-width: 100%;
    $height: max(var(--cardMaxHeight), 200px);
    max-height: $height;
    // max-height: var(--cardMaxHeight);
    width: calc($height * var(--aspect-ratio)) !important;
    // width: calc(var(--cardMaxHeight) * var(--aspect-ratio)) !important;

    background-color: transparent;

    overflow: hidden;

    cursor: pointer;

    transition: 0.5s ease;

    //s 卡片悬停触发
    &:hover {
      box-shadow: 1px 2px 12px 6px rgba(0, 0, 0, 0.5);
    }

    //s fancyBox 锚点
    .card-FancyBox-anchor {
      position: absolute !important;
      width: 100%;
      height: 100%;
      z-index: 1;
      /* 禁止图文拖拽 */
      -webkit-user-drag: none;
    }

    //s 内容区样式
    .content {
      border: 0 !important;
      margin: 0 !important;
      padding: 0 !important;

      width: 100%;
      height: auto;
      object-position: center;
      /* object-fit: contain; */
      -webkit-user-drag: none;
      /* cursor: pointer; */

      /* 居中背景图像 */
      background-position: center;
      /* 不重复 */
      background-repeat: repeat;
      background-size: contain;
    }

    .onlineGallery-card-other {
      //s 按钮组样式
      .button-group {
        & {
          position: absolute;
          $padding: 4px;
          $margin: 4px;
          // padding: $padding;

          margin: $margin;
          top: 0;
          right: 0;
          width: 24px;
          height: 24px;
          // background-color: aquamarine;
          border-radius: 12px;
          // aspect-ratio: 1;
          // transition: 0.15s;
          z-index: 1;
        }

        //s 通用按钮样式
        .button {
          position: absolute;
          margin: auto;
          padding: 0;
          left: 0;
          top: 0;
          right: 0;
          width: 100% !important;
          height: auto !important;
          aspect-ratio: 1 !important;
          font-size: medium;
          box-shadow: var(--el-box-shadow-light);
          // transition: 0.15s;
        }
        //s 鼠标悬浮按钮组时候的样式
        &:hover {
          & {
            height: 24px + 26px;
          }
          //s 定位按钮样式
          .button.download {
            transform: translateY(26px);
            transition: 0.25s;
          }
        }
        @media (max-width: 500px) {
          & {
            height: 24px + 26px !important;
          }
          .button.download {
            transform: translateY(26px) !important;
            transition: 0.25s;
          }
        }
      }

      //s 勾选框样式
      .checkbox {
        position: absolute !important;
        height: fit-content;
        top: 4px !important;
        left: 4px !important;
        box-shadow: var(--el-box-shadow-light);
        z-index: 1;
      }

      //s 标签组样式
      .tag-group {
        position: absolute;

        width: 100% !important;
        bottom: 0px;
        left: 0px;
        padding: 4px;

        display: flex;
        flex-flow: row wrap;
        gap: 2px;
        z-index: 1;

        .el-tag {
          max-width: 100%;
          justify-content: start;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  //? transition效果
  //s	默认淡出淡入
  .v-enter-active,
  .v-leave-active {
    transition: 0.25s ease !important;
  }
  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }

  //s 从上往下
  .top-bottom-enter-active,
  .top-bottom-leave-active {
    transition: 0.25s ease !important;
  }

  .top-bottom-enter-from,
  .top-bottom-leave-to {
    transform: translateY(-100%);
  }

  //s 从下往上进入
  .bottom-top-enter-active,
  .bottom-top-leave-active {
    transition: 0.25s ease !important;
  }

  .bottom-top-enter-from,
  .bottom-top-leave-to {
    transform: translateY(100%);
  }

  //s content进出样式
  .content-enter-active,
  .content-leave-active {
    transition: 0.25s ease !important;
  }
  .content-enter-from,
  .content-leave-to {
    opacity: 0;
  }
</style>

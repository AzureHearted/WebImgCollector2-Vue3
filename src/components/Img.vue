<!-- Img.vue -->
<template>
  <div>
    <img
      :style="imgStyle"
      :parentSelector="parentSelector"
      v-lazy.src="src"
      v-if="lazy"
      @load="imgLoad"
    />
    <img
      :style="imgStyle"
      :src="src"
      v-else
      @load="imgLoad"
    />
  </div>
</template>

<script lang="ts" setup>
  interface IProps {
    parentSelector?: string;
    src: string;
    lazy: boolean;
    lazyMargin?: string;
    imgStyle?: string;
  }
  const props = withDefaults(defineProps<IProps>(), {
    src: "",
    parentSelector: "body",
    lazy: false,
    lazyMargin(props) {
      return "0%";
    },
  });
  const emits = defineEmits(["load"]);

  //s 图片真实尺寸
  const realSize = reactive({
    width: 0,
    height: 0,
  });

  //f img加载完成事件
  function imgLoad(payload: Event) {
    const img = payload.target as HTMLImageElement;
    const {naturalWidth, naturalHeight} = img;
    // console.log("img加载完成", naturalWidth, naturalHeight, img);
    if (naturalWidth > 0 && naturalHeight > 0) {
      realSize.width = naturalWidth;
      realSize.height = naturalHeight;
    }
  }

  //w 监听图片真实尺寸变化
  watch(
    () => realSize,
    (newVal, oldVal) => {
      if (newVal.width > oldVal.width && newVal.height > oldVal.height) {
        //s 返回出新尺寸 (新尺寸>旧尺寸时)
        emits("load", newVal);
      } else {
        //s 返回出旧尺寸
        emits("load", oldVal);
      }
    },
    {deep: true}
  );

  const vLazy = {
    mounted(el: HTMLImageElement, binding, vNode) {
      el.src = ""; //s 先去除src内容
      // console.log('懒加载',props.parentSelector);
      el.dataset.show = "false"; //先设置为不显示(配合css)
      let url = binding.value; //保存src
      // 回调函数定义
      let observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entire) => {
            // 调用方法得到该elDOM元素是否处于可视区域
            if (entire.isIntersecting) {
              //回调是否处于可视区域，true or false
              observer.unobserve(el); // 只需要监听一次即可，第二次滑动到可视区域时候不在监听
              el.src = url; //如果处于可视区域，将最开始保存的真实路径赋予DOM元素渲染
              // el.dataset.show = true;
              if (el.tagName == "IMG") {
                if (el.complete) {
                  el.dataset.show = "true";
                } else {
                  el.addEventListener("load", fn);
                  el.addEventListener("error", fn);
                  function fn() {
                    el.dataset.show = "true";
                    el.removeEventListener("load", fn);
                    el.removeEventListener("error", fn);
                  }
                }
              } else {
                el.dataset.show = "true";
              }
            }
          });
        },
        {
          root: document.querySelector(props.parentSelector),
          rootMargin: props.lazyMargin,
        }
      ); // 设置阈值
      // 监听调用
      observer.observe(el);
    },
  };
</script>

<style lang="scss" scoped>
  * {
    margin: 0 !important;
    padding: 0 !important;
    border: 0 !important;
    box-sizing: border-box !important;
    z-index: 0 !important;
  }

  img {
    width: 100%;
    height: 100%;
  }

  /* 显示时的样式 */
  [data-show="true"] {
    opacity: 1;
    filter: blur(0px);
    transition: 0.2s;
  }

  /* 不显示时的样式 */
  [data-show="false"] {
    opacity: 0;
    filter: blur(10px);
    transition: 0.2s;
  }
</style>

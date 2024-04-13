import { ref, reactive, computed, defineProps, withDefaults, defineEmits, } from "vue";
// 导入加载错误时的图片
import errorImg from "@/assets/svg/error-img.svg";
const { defineSlots, defineExpose, defineModel, defineOptions, } = await import('vue');
// 定义props
const props = withDefaults(defineProps(), {
    src: "",
    initWidth: 0,
    initHeight: 0,
    useThumb: false,
    thumb: "",
    thumbMaxSize: 400,
    viewportDom: null,
    viewRootMargin: "0px 0px 0px 0px",
    observerOnce: true,
    manualControl: false,
    draggable: true, // 默认允许拖拽图片
});
// 定义状态
const state = reactive({
    errorImg: errorImg,
    width: props.initWidth,
    height: props.initHeight,
    loaded: ref(false),
    isError: ref(false),
    show: ref(false),
});
// 定义宽高比
const aspectRatio = computed(() => {
    return state.width && state.height ? state.width / state.height : 1;
});
// 定义img标签的ref
const imgDom = ref(null);
// 定义事件
const emit = defineEmits();
// 加载图片
const loadImage = async (src) => {
    // console.log("src", src);
    const img = new Image();
    // 图片加载函数
    const handleLoad = () => {
        if (imgDom.value) {
            imgDom.value.src = src;
        }
        state.loaded = true;
        state.show = true;
        state.isError = false;
    };
    // 将图片赋值给img对象(开始加载)
    img.src = src;
    if (img.complete) {
        // f 当图片已经加载过了的时候
        // console.log("图片已经加载过了", src);
        // console.log("加载成功", dom);
        let info = {
            meta: {
                valid: true,
                width: img.naturalWidth,
                height: img.naturalHeight,
                aspectRatio: img.naturalWidth / img.naturalHeight, // 宽高比.
            },
        };
        // 判断是否需要用户手动加载
        if (!props.manualControl) {
            // 如果用户不需要手动加载就立即加载
            handleLoad();
            // 触发loaded事件
            emit("loaded", info);
            return;
        }
        // info.dom = dom;
        info.load = handleLoad;
        emit("loaded", info);
    }
    else {
        // f 当图片加载成功时
        img.addEventListener("load", () => {
            // console.log("加载成功", dom);
            // console.log("图片首次加载成功！", src);
            // 记录图片的宽高信息
            state.width = img.naturalWidth;
            state.height = img.naturalHeight;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            let { errorImg, loaded, isError, show, ...infoRest } = state;
            // 对剩余的属性进行类型标注
            let info = {
                meta: {
                    valid: true,
                    ...infoRest,
                    aspectRatio: infoRest.width / infoRest.height, // 宽高比.
                },
            };
            // 判断是否需要用户手动加载
            if (!props.manualControl) {
                // 如果用户不需要手动加载就立即加载
                handleLoad();
                // 触发loaded事件
                emit("loaded", info);
                return;
            }
            // 返回dom和load函数
            // info.dom = dom;
            info.load = handleLoad; // 如果需要手动加载就将该方法返回
            // 触发loaded事件,同时返回info对象
            emit("loaded", info);
        }, { once: true });
        // f 当图片加载错误时
        img.addEventListener("error", () => {
            console.log("图片加载错误", src);
            state.isError = true;
            state.loaded = true;
            // 触发error事件
            emit("error");
        }, { once: true });
    }
};
// 异步生成缩略图并返回结果
async function generateThumbnail(source, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            let width = img.width;
            let height = img.height;
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            }
            else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            const thumbnail = canvas.toDataURL("image/jpeg");
            resolve(thumbnail);
        };
        img.onerror = function (error) {
            reject(error);
        };
        if (typeof source === "string") {
            img.src = source; // 如果 source 是 URL，则直接设置图片的 src
        }
        else if (source instanceof File) {
            const reader = new FileReader();
            reader.onload = function (event) {
                // 防止event.target为null
                if (!event.target || !event.target.result) {
                    reject(new Error("Failed to read file"));
                    return;
                }
                // 如果 source 是文件对象，则先读取文件再设置图片的 src
                img.src = event.target.result;
            };
            reader.onerror = function (error) {
                reject(error);
            };
            reader.readAsDataURL(source);
        }
        else {
            reject(new Error("Invalid input source"));
        }
    });
}
// 自定义指令
const vLazy = {
    mounted(el) {
        // console.log("图片挂载", el.src, el);
        let src = props.src; // 默认使用原图
        el.src = "";
        const handleIntersection = async (entries) => {
            if (entries[0].isIntersecting) {
                // 判断是否只监听一次
                if (props.observerOnce) {
                    // 停止监听
                    observer.disconnect();
                }
                // 判断是否已经被加载过了
                if (state.loaded) {
                    // 如果已经被加载就让其显示
                    state.show = true;
                    return;
                }
                // 这里判断是否使用缩略图
                if (props.useThumb) {
                    // s 使用缩略图
                    if (props.thumb) {
                        // console.log("存在缩略图", props.thumb);
                        // 如果缩略图存在,就使用缩略图
                        src = props.thumb;
                    }
                    else {
                        // 如果没有缩略图,就使用原图生成
                        src = await generateThumbnail(props.src, props.thumbMaxSize, props.thumbMaxSize);
                    }
                }
                // 执行加载函数
                loadImage(src);
            }
            else {
                state.show = false; // 标记为不可见
            }
        };
        // 创建 IntersectionObserver
        const options = {
            root: props.viewportDom,
            rootMargin: props.viewRootMargin,
        };
        const observer = new IntersectionObserver(handleIntersection, options);
        // 开始监听
        observer.observe(el);
    },
};
const __VLS_withDefaultsArg = (function (t) { return t; })({
    src: "",
    initWidth: 0,
    initHeight: 0,
    useThumb: false,
    thumb: "",
    thumbMaxSize: 400,
    viewportDom: null,
    viewRootMargin: "0px 0px 0px 0px",
    observerOnce: true,
    manualControl: false,
    draggable: true, // 默认允许拖拽图片
});
let __VLS_modelEmitsType;
const __VLS_componentsOption = {};
let __VLS_name;
function __VLS_template() {
    let __VLS_ctx;
    /* Components */
    let __VLS_otherComponents;
    let __VLS_own;
    let __VLS_localComponents;
    let __VLS_components;
    let __VLS_styleScopedClasses;
    /* CSS variable injection */
    /* CSS variable injection end */
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.img;
    {
        const __VLS_0 = __VLS_intrinsicElements["div"];
        const __VLS_1 = __VLS_elementAsFunctionalComponent(__VLS_0);
        const __VLS_2 = __VLS_1({ ...{}, class: ("img-wrapper"), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        ({}({ ...{}, class: ("img-wrapper"), }));
        ({ loading: !__VLS_ctx.state.loaded });
        __VLS_styleScopedClasses = ({ loading: !state.loaded });
        {
            const __VLS_5 = __VLS_intrinsicElements["img"];
            const __VLS_6 = __VLS_elementAsFunctionalComponent(__VLS_5);
            const __VLS_7 = __VLS_6({ ...{}, ref: ("imgDom"), class: (({
                    loading: !__VLS_ctx.state.loaded,
                    show: __VLS_ctx.state.show,
                    error: __VLS_ctx.state.isError,
                })), style: (({ aspectRatio: __VLS_ctx.aspectRatio })), draggable: ((__VLS_ctx.draggable)), }, ...__VLS_functionalComponentArgsRest(__VLS_6));
            ({}({ ...{}, ref: ("imgDom"), class: (({
                    loading: !__VLS_ctx.state.loaded,
                    show: __VLS_ctx.state.show,
                    error: __VLS_ctx.state.isError,
                })), style: (({ aspectRatio: __VLS_ctx.aspectRatio })), draggable: ((__VLS_ctx.draggable)), }));
            __VLS_directiveFunction(__VLS_ctx.vLazy)((__VLS_ctx.src));
            // @ts-ignore
            (__VLS_ctx.imgDom);
            __VLS_styleScopedClasses = ({
                loading: !state.loaded,
                show: state.show,
                error: state.isError,
            });
            const __VLS_8 = __VLS_pickFunctionalComponentCtx(__VLS_5, __VLS_7);
        }
        {
            const __VLS_10 = {}.slot;
            const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({ ...{}, }));
            const __VLS_12 = __VLS_11({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_11));
            ({}({ ...{}, }));
            var __VLS_14 = {};
        }
        (__VLS_3.slots).default;
        const __VLS_3 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
    }
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses["img-wrapper"];
    }
    var __VLS_slots;
    // @ts-ignore
    [state, state, state, state, aspectRatio, draggable, src, imgDom,];
    return __VLS_slots;
}
const __VLS_internalComponent = (await import('vue')).defineComponent({
    setup() {
        return {
            state: state,
            aspectRatio: aspectRatio,
            imgDom: imgDom,
            vLazy: vLazy,
        };
    },
    props: {},
    emits: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    props: {},
    emits: {},
});
export default {};

import { computed, defineProps, withDefaults } from "vue";
import BaseImgCard from "@/components/base/base-img-card.vue";
import BaseImg from "@/components/base/base-img.vue";
// 导入公用TS库
import { byteAutoUnit, isMobile } from "@/utils/common";
// 导入svg
import IconDownload from "@svg/download-2.svg";
import IconMapMarker from "@svg/map-marker-outline.svg";
import IconTrashCan from "@svg/trash-can.svg";
// 导入仓库
import { useGlobalStore, useCardStore } from "@/stores";
const { defineSlots, defineEmits, defineExpose, defineModel, defineOptions, } = await import('vue');
const globalStore = useGlobalStore();
const cardStore = useCardStore();
// const data = defineModel({ type: Card, required: true });
const props = withDefaults(defineProps(), {});
const emits = defineEmits();
// 大小
const size = computed(() => {
    const byteSize = props.data.source.blob?.size;
    if (byteSize) {
        return byteAutoUnit(byteSize);
    }
    else {
        return `0B`;
    }
});
// 处理卡片加载完成的事件
function handleCardLoaded(item, info) {
    // console.log(info);
    // 仓库找到对应的数据
    const index = cardStore.validCardList.findIndex((x) => x?.id === item.id);
    if (index < 0)
        return;
    const card = cardStore.validCardList[index];
    // 刷新仓库对应卡片的preview.meta信息
    card.preview.meta = { ...card.preview.meta, ...info.meta };
    if (card.preview.meta.width > card.source.meta.width &&
        card.preview.meta.height > card.source.meta.height) {
        card.source.meta.width = card.preview.meta.width;
        card.source.meta.height = card.preview.meta.height;
    }
}
// 页面定位元素
function toLocate(item) {
    // console.log("定位元素", item);
    item.source.dom.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "center",
    }); // 滚动到指定元素位置，平滑滚动，并居中显示。
    globalStore.openWindow = false;
}
// 删除卡片
function toRemove(item) {
    // 删除卡片数据模型中的卡片。
    cardStore.removeCard(item.id); // 删除卡片数据模型中的卡片。
}
// 下载
function toDownload(item) {
    console.log("下载", item);
    cardStore.downloadCards([item.id]);
}
const __VLS_withDefaultsArg = (function (t) { return t; })({});
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
    __VLS_components.BaseImgCard;
    __VLS_components.BaseImgCard;
    __VLS_components.BaseImgCard;
    __VLS_components.BaseImgCard;
    // @ts-ignore
    [BaseImgCard, BaseImgCard,];
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_components.BaseCheckbox;
    __VLS_components.BaseCheckbox;
    // @ts-ignore
    [BaseCheckbox,];
    __VLS_components.VarButtonGroup;
    __VLS_components.varButtonGroup;
    __VLS_components.VarButtonGroup;
    __VLS_components.varButtonGroup;
    __VLS_components.VarButtonGroup;
    __VLS_components.varButtonGroup;
    __VLS_components.VarButtonGroup;
    __VLS_components.varButtonGroup;
    // @ts-ignore
    [VarButtonGroup, VarButtonGroup, VarButtonGroup, VarButtonGroup,];
    __VLS_components.VarButton;
    __VLS_components.varButton;
    __VLS_components.VarButton;
    __VLS_components.varButton;
    __VLS_components.VarButton;
    __VLS_components.varButton;
    __VLS_components.VarButton;
    __VLS_components.varButton;
    __VLS_components.VarButton;
    __VLS_components.varButton;
    __VLS_components.VarButton;
    __VLS_components.varButton;
    // @ts-ignore
    [VarButton, VarButton, VarButton, VarButton, VarButton, VarButton,];
    __VLS_components.IconTrashCan;
    __VLS_components.IconTrashCan;
    // @ts-ignore
    [IconTrashCan,];
    __VLS_components.IconMapMarker;
    __VLS_components.IconMapMarker;
    // @ts-ignore
    [IconMapMarker,];
    __VLS_components.IconDownload;
    __VLS_components.IconDownload;
    // @ts-ignore
    [IconDownload,];
    __VLS_components.BaseImg;
    __VLS_components.BaseImg;
    __VLS_components.BaseImg;
    __VLS_components.BaseImg;
    // @ts-ignore
    [BaseImg, BaseImg,];
    __VLS_components.VarChip;
    __VLS_components.varChip;
    __VLS_components.VarChip;
    __VLS_components.varChip;
    __VLS_components.VarChip;
    __VLS_components.varChip;
    __VLS_components.VarChip;
    __VLS_components.varChip;
    __VLS_components.VarChip;
    __VLS_components.varChip;
    __VLS_components.VarChip;
    __VLS_components.varChip;
    // @ts-ignore
    [VarChip, VarChip, VarChip, VarChip, VarChip, VarChip,];
    {
        const __VLS_0 = {}.BaseImgCard;
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{}, style: ({}), dataChecked: ((__VLS_ctx.data.isSelected)), class: ("gallery-card"), data: ((__VLS_ctx.data)), imgUrl: ((__VLS_ctx.data.source.url)), imgThumb: ((__VLS_ctx.data.preview.url)), }));
        ({}.BaseImgCard);
        ({}.BaseImgCard);
        const __VLS_2 = __VLS_1({ ...{}, style: ({}), dataChecked: ((__VLS_ctx.data.isSelected)), class: ("gallery-card"), data: ((__VLS_ctx.data)), imgUrl: ((__VLS_ctx.data.source.url)), imgThumb: ((__VLS_ctx.data.preview.url)), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        ({}({ ...{}, style: ({}), dataChecked: ((__VLS_ctx.data.isSelected)), class: ("gallery-card"), data: ((__VLS_ctx.data)), imgUrl: ((__VLS_ctx.data.source.url)), imgThumb: ((__VLS_ctx.data.preview.url)), }));
        {
            const __VLS_5 = __VLS_intrinsicElements["template"];
            const __VLS_6 = __VLS_elementAsFunctionalComponent(__VLS_5);
            const __VLS_7 = __VLS_6({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_6));
            ({}({ ...{}, }));
            {
                (__VLS_3.slots).header;
                {
                    const __VLS_9 = __VLS_intrinsicElements["div"];
                    const __VLS_10 = __VLS_elementAsFunctionalComponent(__VLS_9);
                    const __VLS_11 = __VLS_10({ ...{}, class: ("gallery-card-header"), }, ...__VLS_functionalComponentArgsRest(__VLS_10));
                    ({}({ ...{}, class: ("gallery-card-header"), }));
                    {
                        const __VLS_14 = __VLS_intrinsicElements["div"];
                        const __VLS_15 = __VLS_elementAsFunctionalComponent(__VLS_14);
                        const __VLS_16 = __VLS_15({ ...{}, class: ("gallery-card-header-left"), }, ...__VLS_functionalComponentArgsRest(__VLS_15));
                        ({}({ ...{}, class: ("gallery-card-header-left"), }));
                        {
                            const __VLS_19 = __VLS_intrinsicElements["div"];
                            const __VLS_20 = __VLS_elementAsFunctionalComponent(__VLS_19);
                            const __VLS_21 = __VLS_20({ ...{}, class: ("card-checkbox"), }, ...__VLS_functionalComponentArgsRest(__VLS_20));
                            ({}({ ...{}, class: ("card-checkbox"), }));
                            {
                                const __VLS_24 = {}.BaseCheckbox;
                                const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({ ...{ 'onChange': {}, }, checked: ((__VLS_ctx.data.isSelected)), }));
                                ({}.BaseCheckbox);
                                const __VLS_26 = __VLS_25({ ...{ 'onChange': {}, }, checked: ((__VLS_ctx.data.isSelected)), }, ...__VLS_functionalComponentArgsRest(__VLS_25));
                                ({}({ ...{ 'onChange': {}, }, checked: ((__VLS_ctx.data.isSelected)), }));
                                let __VLS_29 = { 'change': __VLS_pickEvent(__VLS_28['change'], {}.onChange) };
                                __VLS_29 = { change: $event => {
                                        __VLS_ctx.emits('change:selected', $event);
                                        // @ts-ignore
                                        [data, data, data, data, data, emits,];
                                    }
                                };
                                const __VLS_27 = __VLS_pickFunctionalComponentCtx(__VLS_24, __VLS_26);
                                let __VLS_28;
                            }
                            (__VLS_22.slots).default;
                            const __VLS_22 = __VLS_pickFunctionalComponentCtx(__VLS_19, __VLS_21);
                        }
                        (__VLS_17.slots).default;
                        const __VLS_17 = __VLS_pickFunctionalComponentCtx(__VLS_14, __VLS_16);
                    }
                    {
                        const __VLS_30 = __VLS_intrinsicElements["div"];
                        const __VLS_31 = __VLS_elementAsFunctionalComponent(__VLS_30);
                        const __VLS_32 = __VLS_31({ ...{}, class: ("gallery-card-header-right"), }, ...__VLS_functionalComponentArgsRest(__VLS_31));
                        ({}({ ...{}, class: ("gallery-card-header-right"), }));
                        {
                            const __VLS_35 = __VLS_intrinsicElements["div"];
                            const __VLS_36 = __VLS_elementAsFunctionalComponent(__VLS_35);
                            const __VLS_37 = __VLS_36({ ...{}, class: ("card-button-group"), }, ...__VLS_functionalComponentArgsRest(__VLS_36));
                            ({}({ ...{}, class: ("card-button-group"), }));
                            {
                                const __VLS_40 = {}.VarButtonGroup;
                                const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({ ...{}, type: ("primary"), size: ("mini"), }));
                                ({}.VarButtonGroup);
                                ({}.VarButtonGroup);
                                const __VLS_42 = __VLS_41({ ...{}, type: ("primary"), size: ("mini"), }, ...__VLS_functionalComponentArgsRest(__VLS_41));
                                ({}({ ...{}, type: ("primary"), size: ("mini"), }));
                                {
                                    const __VLS_45 = {}.VarButton;
                                    const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({ ...{ 'onClick': {}, }, type: ("danger"), }));
                                    ({}.VarButton);
                                    ({}.VarButton);
                                    const __VLS_47 = __VLS_46({ ...{ 'onClick': {}, }, type: ("danger"), }, ...__VLS_functionalComponentArgsRest(__VLS_46));
                                    ({}({ ...{ 'onClick': {}, }, type: ("danger"), }));
                                    let __VLS_50 = { 'click': __VLS_pickEvent(__VLS_49['click'], {}.onClick) };
                                    __VLS_50 = { click: $event => {
                                            __VLS_ctx.toRemove(__VLS_ctx.data);
                                            // @ts-ignore
                                            [toRemove, data,];
                                        }
                                    };
                                    {
                                        const __VLS_51 = {}.IconTrashCan;
                                        const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({ ...{}, style: ({}), }));
                                        ({}.IconTrashCan);
                                        const __VLS_53 = __VLS_52({ ...{}, style: ({}), }, ...__VLS_functionalComponentArgsRest(__VLS_52));
                                        ({}({ ...{}, style: ({}), }));
                                        const __VLS_54 = __VLS_pickFunctionalComponentCtx(__VLS_51, __VLS_53);
                                    }
                                    (__VLS_48.slots).default;
                                    const __VLS_48 = __VLS_pickFunctionalComponentCtx(__VLS_45, __VLS_47);
                                    let __VLS_49;
                                }
                                (__VLS_43.slots).default;
                                const __VLS_43 = __VLS_pickFunctionalComponentCtx(__VLS_40, __VLS_42);
                            }
                            {
                                const __VLS_56 = {}.VarButtonGroup;
                                const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({ ...{}, size: ("mini"), }));
                                ({}.VarButtonGroup);
                                ({}.VarButtonGroup);
                                const __VLS_58 = __VLS_57({ ...{}, size: ("mini"), }, ...__VLS_functionalComponentArgsRest(__VLS_57));
                                ({}({ ...{}, size: ("mini"), }));
                                {
                                    const __VLS_61 = {}.VarButton;
                                    const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({ ...{ 'onClick': {}, }, type: ("primary"), }));
                                    ({}.VarButton);
                                    ({}.VarButton);
                                    const __VLS_63 = __VLS_62({ ...{ 'onClick': {}, }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_62));
                                    ({}({ ...{ 'onClick': {}, }, type: ("primary"), }));
                                    let __VLS_66 = { 'click': __VLS_pickEvent(__VLS_65['click'], {}.onClick) };
                                    __VLS_66 = { click: $event => {
                                            __VLS_ctx.toLocate(__VLS_ctx.data);
                                            // @ts-ignore
                                            [toLocate, data,];
                                        }
                                    };
                                    {
                                        const __VLS_67 = {}.IconMapMarker;
                                        const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({ ...{}, style: ({}), }));
                                        ({}.IconMapMarker);
                                        const __VLS_69 = __VLS_68({ ...{}, style: ({}), }, ...__VLS_functionalComponentArgsRest(__VLS_68));
                                        ({}({ ...{}, style: ({}), }));
                                        const __VLS_70 = __VLS_pickFunctionalComponentCtx(__VLS_67, __VLS_69);
                                    }
                                    (__VLS_64.slots).default;
                                    const __VLS_64 = __VLS_pickFunctionalComponentCtx(__VLS_61, __VLS_63);
                                    let __VLS_65;
                                }
                                {
                                    const __VLS_72 = {}.VarButton;
                                    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({ ...{ 'onClick': {}, }, type: ("default"), }));
                                    ({}.VarButton);
                                    ({}.VarButton);
                                    const __VLS_74 = __VLS_73({ ...{ 'onClick': {}, }, type: ("default"), }, ...__VLS_functionalComponentArgsRest(__VLS_73));
                                    ({}({ ...{ 'onClick': {}, }, type: ("default"), }));
                                    let __VLS_77 = { 'click': __VLS_pickEvent(__VLS_76['click'], {}.onClick) };
                                    __VLS_77 = { click: $event => {
                                            __VLS_ctx.toDownload(__VLS_ctx.data);
                                            // @ts-ignore
                                            [toDownload, data,];
                                        }
                                    };
                                    {
                                        const __VLS_78 = {}.IconDownload;
                                        const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({ ...{}, style: ({}), }));
                                        ({}.IconDownload);
                                        const __VLS_80 = __VLS_79({ ...{}, style: ({}), }, ...__VLS_functionalComponentArgsRest(__VLS_79));
                                        ({}({ ...{}, style: ({}), }));
                                        const __VLS_81 = __VLS_pickFunctionalComponentCtx(__VLS_78, __VLS_80);
                                    }
                                    (__VLS_75.slots).default;
                                    const __VLS_75 = __VLS_pickFunctionalComponentCtx(__VLS_72, __VLS_74);
                                    let __VLS_76;
                                }
                                (__VLS_59.slots).default;
                                const __VLS_59 = __VLS_pickFunctionalComponentCtx(__VLS_56, __VLS_58);
                            }
                            (__VLS_38.slots).default;
                            const __VLS_38 = __VLS_pickFunctionalComponentCtx(__VLS_35, __VLS_37);
                        }
                        (__VLS_33.slots).default;
                        const __VLS_33 = __VLS_pickFunctionalComponentCtx(__VLS_30, __VLS_32);
                    }
                    (__VLS_12.slots).default;
                    const __VLS_12 = __VLS_pickFunctionalComponentCtx(__VLS_9, __VLS_11);
                }
            }
        }
        {
            const __VLS_83 = __VLS_intrinsicElements["template"];
            const __VLS_84 = __VLS_elementAsFunctionalComponent(__VLS_83);
            const __VLS_85 = __VLS_84({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_84));
            ({}({ ...{}, }));
            {
                (__VLS_3.slots).default;
                {
                    const __VLS_87 = {}.BaseImg;
                    const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({ ...{ 'onLoaded': {}, }, src: ((__VLS_ctx.data.source.url)), useThumb: (true), dataId: ((__VLS_ctx.data.id)), href: ((__VLS_ctx.data.source.url)), thumb: ((__VLS_ctx.data.preview.url)), initWidth: ((__VLS_ctx.data.source.meta?.width)), initHeight: ((__VLS_ctx.data.source.meta?.height)), dataFancybox: ("online-gallery"), dataThumb: ((__VLS_ctx.data.preview.url)), dataDownloadSrc: ((__VLS_ctx.data.source.url)), draggable: ((false)), }));
                    ({}.BaseImg);
                    ({}.BaseImg);
                    const __VLS_89 = __VLS_88({ ...{ 'onLoaded': {}, }, src: ((__VLS_ctx.data.source.url)), useThumb: (true), dataId: ((__VLS_ctx.data.id)), href: ((__VLS_ctx.data.source.url)), thumb: ((__VLS_ctx.data.preview.url)), initWidth: ((__VLS_ctx.data.source.meta?.width)), initHeight: ((__VLS_ctx.data.source.meta?.height)), dataFancybox: ("online-gallery"), dataThumb: ((__VLS_ctx.data.preview.url)), dataDownloadSrc: ((__VLS_ctx.data.source.url)), draggable: ((false)), }, ...__VLS_functionalComponentArgsRest(__VLS_88));
                    ({}({ ...{ 'onLoaded': {}, }, src: ((__VLS_ctx.data.source.url)), useThumb: (true), dataId: ((__VLS_ctx.data.id)), href: ((__VLS_ctx.data.source.url)), thumb: ((__VLS_ctx.data.preview.url)), initWidth: ((__VLS_ctx.data.source.meta?.width)), initHeight: ((__VLS_ctx.data.source.meta?.height)), dataFancybox: ("online-gallery"), dataThumb: ((__VLS_ctx.data.preview.url)), dataDownloadSrc: ((__VLS_ctx.data.source.url)), draggable: ((false)), }));
                    let __VLS_92 = { 'loaded': __VLS_pickEvent(__VLS_91['loaded'], {}.onLoaded) };
                    __VLS_92 = { loaded: $event => {
                            __VLS_ctx.handleCardLoaded(__VLS_ctx.data, $event);
                            // @ts-ignore
                            [data, data, data, data, data, data, data, data, handleCardLoaded, data,];
                        }
                    };
                    const __VLS_90 = __VLS_pickFunctionalComponentCtx(__VLS_87, __VLS_89);
                    let __VLS_91;
                }
            }
        }
        {
            const __VLS_93 = __VLS_intrinsicElements["template"];
            const __VLS_94 = __VLS_elementAsFunctionalComponent(__VLS_93);
            const __VLS_95 = __VLS_94({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_94));
            ({}({ ...{}, }));
            {
                (__VLS_3.slots).footer;
                {
                    const __VLS_97 = __VLS_intrinsicElements["div"];
                    const __VLS_98 = __VLS_elementAsFunctionalComponent(__VLS_97);
                    const __VLS_99 = __VLS_98({ ...{}, class: ("gallery-card-footer"), }, ...__VLS_functionalComponentArgsRest(__VLS_98));
                    ({}({ ...{}, class: ("gallery-card-footer"), }));
                    {
                        const __VLS_102 = {}.VarChip;
                        const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({ ...{}, type: ("primary"), size: ((__VLS_ctx.isMobile() ? 'mini' : 'small')), round: ((false)), }));
                        ({}.VarChip);
                        ({}.VarChip);
                        const __VLS_104 = __VLS_103({ ...{}, type: ("primary"), size: ((__VLS_ctx.isMobile() ? 'mini' : 'small')), round: ((false)), }, ...__VLS_functionalComponentArgsRest(__VLS_103));
                        ({}({ ...{}, type: ("primary"), size: ((__VLS_ctx.isMobile() ? 'mini' : 'small')), round: ((false)), }));
                        (__VLS_ctx.data.source.meta.width);
                        (__VLS_ctx.data.source.meta.height);
                        (__VLS_105.slots).default;
                        const __VLS_105 = __VLS_pickFunctionalComponentCtx(__VLS_102, __VLS_104);
                    }
                    if (!!__VLS_ctx.data.source.meta.ext) {
                        {
                            const __VLS_107 = {}.VarChip;
                            const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({ ...{}, type: ("success"), size: ((__VLS_ctx.isMobile() ? 'mini' : 'small')), round: ((false)), }));
                            ({}.VarChip);
                            ({}.VarChip);
                            const __VLS_109 = __VLS_108({ ...{}, type: ("success"), size: ((__VLS_ctx.isMobile() ? 'mini' : 'small')), round: ((false)), }, ...__VLS_functionalComponentArgsRest(__VLS_108));
                            ({}({ ...{}, type: ("success"), size: ((__VLS_ctx.isMobile() ? 'mini' : 'small')), round: ((false)), }));
                            (__VLS_ctx.data.source.meta.ext);
                            (__VLS_110.slots).default;
                            const __VLS_110 = __VLS_pickFunctionalComponentCtx(__VLS_107, __VLS_109);
                        }
                        // @ts-ignore
                        [isMobile, data, data, data, isMobile, data,];
                    }
                    if (!!__VLS_ctx.data.source.blob) {
                        {
                            const __VLS_112 = {}.VarChip;
                            const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({ ...{}, type: ("info"), size: ((__VLS_ctx.isMobile() ? 'mini' : 'small')), round: ((false)), }));
                            ({}.VarChip);
                            ({}.VarChip);
                            const __VLS_114 = __VLS_113({ ...{}, type: ("info"), size: ((__VLS_ctx.isMobile() ? 'mini' : 'small')), round: ((false)), }, ...__VLS_functionalComponentArgsRest(__VLS_113));
                            ({}({ ...{}, type: ("info"), size: ((__VLS_ctx.isMobile() ? 'mini' : 'small')), round: ((false)), }));
                            (__VLS_ctx.size);
                            (__VLS_115.slots).default;
                            const __VLS_115 = __VLS_pickFunctionalComponentCtx(__VLS_112, __VLS_114);
                        }
                        // @ts-ignore
                        [data, isMobile, size,];
                    }
                    (__VLS_100.slots).default;
                    const __VLS_100 = __VLS_pickFunctionalComponentCtx(__VLS_97, __VLS_99);
                }
            }
        }
        const __VLS_3 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
    }
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses["gallery-card"];
        __VLS_styleScopedClasses["gallery-card-header"];
        __VLS_styleScopedClasses["gallery-card-header-left"];
        __VLS_styleScopedClasses["card-checkbox"];
        __VLS_styleScopedClasses["gallery-card-header-right"];
        __VLS_styleScopedClasses["card-button-group"];
        __VLS_styleScopedClasses["gallery-card-footer"];
    }
    var __VLS_slots;
    return __VLS_slots;
}
const __VLS_internalComponent = (await import('vue')).defineComponent({
    setup() {
        return {
            BaseImgCard: BaseImgCard,
            BaseImg: BaseImg,
            isMobile: isMobile,
            IconDownload: IconDownload,
            IconMapMarker: IconMapMarker,
            IconTrashCan: IconTrashCan,
            emits: emits,
            size: size,
            handleCardLoaded: handleCardLoaded,
            toLocate: toLocate,
            toRemove: toRemove,
            toDownload: toDownload,
        };
    },
    props: {},
    emits: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    props: {},
    emits: {},
});

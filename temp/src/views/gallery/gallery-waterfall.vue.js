import { computed } from "vue";
import { useGlobalStore, useCardStore } from "@/stores";
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const globalStore = useGlobalStore();
const cardStore = useCardStore();
// 卡片列表
const cardList = computed(() => {
    return cardStore.filteredCardList.map((x) => {
        x.url = x.source.url;
        x.thumb = x.preview.url;
        x.width = x.preview.meta?.width ? x.preview.meta.width : 0;
        x.height = x.preview.meta?.height
            ? x.preview.meta.height
            : 0;
        return x;
    });
});
// 处理卡片加载完成的事件
function handleCardLoaded(item, info) {
    // 仓库找到对应的数据
    const index = cardStore.data.cardList.findIndex((x) => x.id === item.id);
    const card = cardStore.data.cardList[index];
    // 刷新仓库对应卡片的preview.meta信息
    card.preview.meta = { ...card.preview.meta, ...info.meta };
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
}
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
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_intrinsicElements.div;
    __VLS_components.BaseVirtualScrollbar;
    __VLS_components.BaseVirtualScrollbar;
    __VLS_components.BaseVirtualScrollbar;
    __VLS_components.BaseVirtualScrollbar;
    // @ts-ignore
    [BaseVirtualScrollbar, BaseVirtualScrollbar,];
    __VLS_components.WaterFallList;
    __VLS_components.WaterFallList;
    __VLS_components.WaterFallList;
    __VLS_components.WaterFallList;
    // @ts-ignore
    [WaterFallList, WaterFallList,];
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_components.BaseImgCard;
    __VLS_components.BaseImgCard;
    __VLS_components.BaseImgCard;
    __VLS_components.BaseImgCard;
    // @ts-ignore
    [BaseImgCard, BaseImgCard,];
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
    __VLS_components.VarIcon;
    __VLS_components.varIcon;
    __VLS_components.VarIcon;
    __VLS_components.varIcon;
    __VLS_components.VarIcon;
    __VLS_components.varIcon;
    // @ts-ignore
    [VarIcon, VarIcon, VarIcon,];
    __VLS_components.BaseCheckbox;
    __VLS_components.BaseCheckbox;
    __VLS_components.BaseCheckbox;
    __VLS_components.BaseCheckbox;
    // @ts-ignore
    [BaseCheckbox, BaseCheckbox,];
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
    // @ts-ignore
    [VarChip, VarChip,];
    {
        const __VLS_0 = __VLS_intrinsicElements["div"];
        const __VLS_1 = __VLS_elementAsFunctionalComponent(__VLS_0);
        const __VLS_2 = __VLS_1({ ...{ 'onWheel': {}, }, class: ("waterfall-wrapper"), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        ({}({ ...{ 'onWheel': {}, }, class: ("waterfall-wrapper"), }));
        let __VLS_5 = { 'wheel': __VLS_pickEvent(__VLS_4['wheel'], {}.onWheel) };
        __VLS_5 = { wheel: () => { } };
        {
            const __VLS_6 = {}.BaseVirtualScrollbar;
            const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({ ...{}, }));
            ({}.BaseVirtualScrollbar);
            ({}.BaseVirtualScrollbar);
            const __VLS_8 = __VLS_7({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_7));
            ({}({ ...{}, }));
            {
                const __VLS_11 = {}.WaterFallList;
                const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({ ...{}, data: __VLS_ctx.cardList, itemPadding: ("1px"), }));
                ({}.WaterFallList);
                ({}.WaterFallList);
                const __VLS_13 = __VLS_12({ ...{}, data: __VLS_ctx.cardList, itemPadding: ("1px"), }, ...__VLS_functionalComponentArgsRest(__VLS_12));
                ({}({ ...{}, data: __VLS_ctx.cardList, itemPadding: ("1px"), }));
                {
                    const __VLS_16 = __VLS_intrinsicElements["template"];
                    const __VLS_17 = __VLS_elementAsFunctionalComponent(__VLS_16);
                    const __VLS_18 = __VLS_17({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_17));
                    ({}({ ...{}, }));
                    {
                        const [{ item }] = __VLS_getSlotParams((__VLS_14.slots).default);
                        {
                            const __VLS_20 = {}.BaseImgCard;
                            const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({ ...{}, style: ({}), data: ((item)), imgUrl: ((item.url)), imgThumb: ((item.thumb)), }));
                            ({}.BaseImgCard);
                            ({}.BaseImgCard);
                            const __VLS_22 = __VLS_21({ ...{}, style: ({}), data: ((item)), imgUrl: ((item.url)), imgThumb: ((item.thumb)), }, ...__VLS_functionalComponentArgsRest(__VLS_21));
                            ({}({ ...{}, style: ({}), data: ((item)), imgUrl: ((item.url)), imgThumb: ((item.thumb)), }));
                            {
                                const __VLS_25 = __VLS_intrinsicElements["template"];
                                const __VLS_26 = __VLS_elementAsFunctionalComponent(__VLS_25);
                                const __VLS_27 = __VLS_26({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_26));
                                ({}({ ...{}, }));
                                {
                                    (__VLS_23.slots).header;
                                    {
                                        const __VLS_29 = __VLS_intrinsicElements["div"];
                                        const __VLS_30 = __VLS_elementAsFunctionalComponent(__VLS_29);
                                        const __VLS_31 = __VLS_30({ ...{}, class: ("card-header"), }, ...__VLS_functionalComponentArgsRest(__VLS_30));
                                        ({}({ ...{}, class: ("card-header"), }));
                                        {
                                            const __VLS_34 = __VLS_intrinsicElements["div"];
                                            const __VLS_35 = __VLS_elementAsFunctionalComponent(__VLS_34);
                                            const __VLS_36 = __VLS_35({ ...{}, class: ("card-button-group"), }, ...__VLS_functionalComponentArgsRest(__VLS_35));
                                            ({}({ ...{}, class: ("card-button-group"), }));
                                            {
                                                const __VLS_39 = {}.VarButtonGroup;
                                                const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({ ...{}, type: ("primary"), size: ("mini"), }));
                                                ({}.VarButtonGroup);
                                                ({}.VarButtonGroup);
                                                const __VLS_41 = __VLS_40({ ...{}, type: ("primary"), size: ("mini"), }, ...__VLS_functionalComponentArgsRest(__VLS_40));
                                                ({}({ ...{}, type: ("primary"), size: ("mini"), }));
                                                {
                                                    const __VLS_44 = {}.VarButton;
                                                    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({ ...{ 'onClick': {}, }, type: ("danger"), }));
                                                    ({}.VarButton);
                                                    ({}.VarButton);
                                                    const __VLS_46 = __VLS_45({ ...{ 'onClick': {}, }, type: ("danger"), }, ...__VLS_functionalComponentArgsRest(__VLS_45));
                                                    ({}({ ...{ 'onClick': {}, }, type: ("danger"), }));
                                                    let __VLS_49 = { 'click': __VLS_pickEvent(__VLS_48['click'], {}.onClick) };
                                                    __VLS_49 = { click: $event => {
                                                            __VLS_ctx.toRemove(item);
                                                            // @ts-ignore
                                                            [cardList, toRemove,];
                                                        }
                                                    };
                                                    {
                                                        const __VLS_50 = {}.VarIcon;
                                                        const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({ ...{}, name: ("trash-can"), }));
                                                        ({}.VarIcon);
                                                        const __VLS_52 = __VLS_51({ ...{}, name: ("trash-can"), }, ...__VLS_functionalComponentArgsRest(__VLS_51));
                                                        ({}({ ...{}, name: ("trash-can"), }));
                                                        const __VLS_53 = __VLS_pickFunctionalComponentCtx(__VLS_50, __VLS_52);
                                                    }
                                                    (__VLS_47.slots).default;
                                                    const __VLS_47 = __VLS_pickFunctionalComponentCtx(__VLS_44, __VLS_46);
                                                    let __VLS_48;
                                                }
                                                (__VLS_42.slots).default;
                                                const __VLS_42 = __VLS_pickFunctionalComponentCtx(__VLS_39, __VLS_41);
                                            }
                                            {
                                                const __VLS_55 = {}.VarButtonGroup;
                                                const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({ ...{}, size: ("mini"), }));
                                                ({}.VarButtonGroup);
                                                ({}.VarButtonGroup);
                                                const __VLS_57 = __VLS_56({ ...{}, size: ("mini"), }, ...__VLS_functionalComponentArgsRest(__VLS_56));
                                                ({}({ ...{}, size: ("mini"), }));
                                                {
                                                    const __VLS_60 = {}.VarButton;
                                                    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({ ...{ 'onClick': {}, }, type: ("primary"), }));
                                                    ({}.VarButton);
                                                    ({}.VarButton);
                                                    const __VLS_62 = __VLS_61({ ...{ 'onClick': {}, }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_61));
                                                    ({}({ ...{ 'onClick': {}, }, type: ("primary"), }));
                                                    let __VLS_65 = { 'click': __VLS_pickEvent(__VLS_64['click'], {}.onClick) };
                                                    __VLS_65 = { click: $event => {
                                                            __VLS_ctx.toLocate(item);
                                                            // @ts-ignore
                                                            [toLocate,];
                                                        }
                                                    };
                                                    {
                                                        const __VLS_66 = {}.VarIcon;
                                                        const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({ ...{}, name: ("map-marker-outline"), }));
                                                        ({}.VarIcon);
                                                        const __VLS_68 = __VLS_67({ ...{}, name: ("map-marker-outline"), }, ...__VLS_functionalComponentArgsRest(__VLS_67));
                                                        ({}({ ...{}, name: ("map-marker-outline"), }));
                                                        const __VLS_69 = __VLS_pickFunctionalComponentCtx(__VLS_66, __VLS_68);
                                                    }
                                                    (__VLS_63.slots).default;
                                                    const __VLS_63 = __VLS_pickFunctionalComponentCtx(__VLS_60, __VLS_62);
                                                    let __VLS_64;
                                                }
                                                {
                                                    const __VLS_71 = {}.VarButton;
                                                    const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({ ...{ 'onClick': {}, }, type: ("default"), }));
                                                    ({}.VarButton);
                                                    ({}.VarButton);
                                                    const __VLS_73 = __VLS_72({ ...{ 'onClick': {}, }, type: ("default"), }, ...__VLS_functionalComponentArgsRest(__VLS_72));
                                                    ({}({ ...{ 'onClick': {}, }, type: ("default"), }));
                                                    let __VLS_76 = { 'click': __VLS_pickEvent(__VLS_75['click'], {}.onClick) };
                                                    __VLS_76 = { click: $event => {
                                                            __VLS_ctx.toDownload(item);
                                                            // @ts-ignore
                                                            [toDownload,];
                                                        }
                                                    };
                                                    {
                                                        const __VLS_77 = {}.VarIcon;
                                                        const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({ ...{}, name: ("download"), }));
                                                        ({}.VarIcon);
                                                        const __VLS_79 = __VLS_78({ ...{}, name: ("download"), }, ...__VLS_functionalComponentArgsRest(__VLS_78));
                                                        ({}({ ...{}, name: ("download"), }));
                                                        const __VLS_80 = __VLS_pickFunctionalComponentCtx(__VLS_77, __VLS_79);
                                                    }
                                                    (__VLS_74.slots).default;
                                                    const __VLS_74 = __VLS_pickFunctionalComponentCtx(__VLS_71, __VLS_73);
                                                    let __VLS_75;
                                                }
                                                (__VLS_58.slots).default;
                                                const __VLS_58 = __VLS_pickFunctionalComponentCtx(__VLS_55, __VLS_57);
                                            }
                                            (__VLS_37.slots).default;
                                            const __VLS_37 = __VLS_pickFunctionalComponentCtx(__VLS_34, __VLS_36);
                                        }
                                        {
                                            const __VLS_82 = __VLS_intrinsicElements["div"];
                                            const __VLS_83 = __VLS_elementAsFunctionalComponent(__VLS_82);
                                            const __VLS_84 = __VLS_83({ ...{}, class: ("card-checkbox"), }, ...__VLS_functionalComponentArgsRest(__VLS_83));
                                            ({}({ ...{}, class: ("card-checkbox"), }));
                                            {
                                                const __VLS_87 = {}.BaseCheckbox;
                                                const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({ ...{}, modelValue: ((item.isSelected)), }));
                                                ({}.BaseCheckbox);
                                                ({}.BaseCheckbox);
                                                const __VLS_89 = __VLS_88({ ...{}, modelValue: ((item.isSelected)), }, ...__VLS_functionalComponentArgsRest(__VLS_88));
                                                ({}({ ...{}, modelValue: ((item.isSelected)), }));
                                                const __VLS_90 = __VLS_pickFunctionalComponentCtx(__VLS_87, __VLS_89);
                                            }
                                            (__VLS_85.slots).default;
                                            const __VLS_85 = __VLS_pickFunctionalComponentCtx(__VLS_82, __VLS_84);
                                        }
                                        (__VLS_32.slots).default;
                                        const __VLS_32 = __VLS_pickFunctionalComponentCtx(__VLS_29, __VLS_31);
                                    }
                                }
                            }
                            {
                                const __VLS_92 = __VLS_intrinsicElements["template"];
                                const __VLS_93 = __VLS_elementAsFunctionalComponent(__VLS_92);
                                const __VLS_94 = __VLS_93({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_93));
                                ({}({ ...{}, }));
                                {
                                    (__VLS_23.slots).default;
                                    {
                                        const __VLS_96 = {}.BaseImg;
                                        const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({ ...{ 'onLoaded': {}, }, src: ((item.url)), href: ((item.url)), thumb: ((item.thumb)), initWidth: ((item.width)), initHeight: ((item.height)), dataFancybox: ("online-gallery"), dataThumb: ((item.thumb)), dataDownloadSrc: ((item.url)), draggable: ((false)), }));
                                        ({}.BaseImg);
                                        ({}.BaseImg);
                                        const __VLS_98 = __VLS_97({ ...{ 'onLoaded': {}, }, src: ((item.url)), href: ((item.url)), thumb: ((item.thumb)), initWidth: ((item.width)), initHeight: ((item.height)), dataFancybox: ("online-gallery"), dataThumb: ((item.thumb)), dataDownloadSrc: ((item.url)), draggable: ((false)), }, ...__VLS_functionalComponentArgsRest(__VLS_97));
                                        ({}({ ...{ 'onLoaded': {}, }, src: ((item.url)), href: ((item.url)), thumb: ((item.thumb)), initWidth: ((item.width)), initHeight: ((item.height)), dataFancybox: ("online-gallery"), dataThumb: ((item.thumb)), dataDownloadSrc: ((item.url)), draggable: ((false)), }));
                                        let __VLS_101 = { 'loaded': __VLS_pickEvent(__VLS_100['loaded'], {}.onLoaded) };
                                        __VLS_101 = { loaded: $event => {
                                                __VLS_ctx.handleCardLoaded(item, $event);
                                                // @ts-ignore
                                                [handleCardLoaded,];
                                            }
                                        };
                                        const __VLS_99 = __VLS_pickFunctionalComponentCtx(__VLS_96, __VLS_98);
                                        let __VLS_100;
                                    }
                                }
                            }
                            {
                                const __VLS_102 = __VLS_intrinsicElements["template"];
                                const __VLS_103 = __VLS_elementAsFunctionalComponent(__VLS_102);
                                const __VLS_104 = __VLS_103({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_103));
                                ({}({ ...{}, }));
                                {
                                    (__VLS_23.slots).footer;
                                    {
                                        const __VLS_106 = __VLS_intrinsicElements["div"];
                                        const __VLS_107 = __VLS_elementAsFunctionalComponent(__VLS_106);
                                        const __VLS_108 = __VLS_107({ ...{}, class: ("card-footer"), }, ...__VLS_functionalComponentArgsRest(__VLS_107));
                                        ({}({ ...{}, class: ("card-footer"), }));
                                        {
                                            const __VLS_111 = {}.VarChip;
                                            const __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({ ...{}, type: ("info"), size: ("small"), }));
                                            ({}.VarChip);
                                            ({}.VarChip);
                                            const __VLS_113 = __VLS_112({ ...{}, type: ("info"), size: ("small"), }, ...__VLS_functionalComponentArgsRest(__VLS_112));
                                            ({}({ ...{}, type: ("info"), size: ("small"), }));
                                            (item.width);
                                            (item.height);
                                            (__VLS_114.slots).default;
                                            const __VLS_114 = __VLS_pickFunctionalComponentCtx(__VLS_111, __VLS_113);
                                        }
                                        (__VLS_109.slots).default;
                                        const __VLS_109 = __VLS_pickFunctionalComponentCtx(__VLS_106, __VLS_108);
                                    }
                                }
                            }
                            const __VLS_23 = __VLS_pickFunctionalComponentCtx(__VLS_20, __VLS_22);
                        }
                    }
                }
                const __VLS_14 = __VLS_pickFunctionalComponentCtx(__VLS_11, __VLS_13);
            }
            (__VLS_9.slots).default;
            const __VLS_9 = __VLS_pickFunctionalComponentCtx(__VLS_6, __VLS_8);
        }
        (__VLS_3.slots).default;
        const __VLS_3 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
        let __VLS_4;
    }
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses["waterfall-wrapper"];
        __VLS_styleScopedClasses["card-header"];
        __VLS_styleScopedClasses["card-button-group"];
        __VLS_styleScopedClasses["card-checkbox"];
        __VLS_styleScopedClasses["card-footer"];
    }
    var __VLS_slots;
    return __VLS_slots;
}
const __VLS_internalComponent = (await import('vue')).defineComponent({
    setup() {
        return {
            cardList: cardList,
            handleCardLoaded: handleCardLoaded,
            toLocate: toLocate,
            toRemove: toRemove,
            toDownload: toDownload,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});

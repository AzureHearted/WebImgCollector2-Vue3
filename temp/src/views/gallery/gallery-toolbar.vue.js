import { ref, reactive, computed, watch } from "vue";
// 导入svg
import IconDownload from "@svg/download.svg";
import IconArrowDown from "@svg/arrow-down.svg";
import IconCloseCircleMultiple from "@svg/close-circle-multiple.svg";
// 导入公用ts库
import { isMobile } from "@/utils/common";
// 导入仓库
import { useCardStore, useLoadingStore } from "@/stores";
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const cardStore = useCardStore();
const loadingStore = useLoadingStore();
// 状态数据
const state = reactive({
    loading: false,
});
// 过滤器定义
const filters = reactive({
    size: {
        width: ref([
            cardStore.filters.size.width[0],
            cardStore.filters.size.width[1],
        ]),
        height: ref([
            cardStore.filters.size.height[0],
            cardStore.filters.size.height[1],
        ]),
    },
});
// 监听card仓库卡片尺寸最大值变化
watch(() => [cardStore.info.size.width[1], cardStore.info.size.height[1]], ([width, height]) => {
    // console.log("过滤器变化", width, height);
    // 更新组件过滤器最大值
    if (filters.size.width[1] < width) {
        filters.size.width[1] = width;
    }
    if (filters.size.height[1] < height) {
        filters.size.height[1] = height;
    }
});
// 被选中的卡片
const checkedCardList = computed(() => {
    return cardStore.validCardList.filter((x) => x.isSelected);
});
// 获取卡片
async function getCards() {
    state.loading = true;
    await cardStore.getPageCard();
    state.loading = false;
}
// 过滤器改变
function filterChange(key, value) {
    // console.log("过滤器变化", key, value);
    cardStore.filters.size[key] = value; // 更新仓库过滤器
}
// 全选
function checkAll() {
    cardStore.filteredCardList.forEach((c) => (c.isSelected = true));
}
// 反选
function inverseAll() {
    cardStore.filteredCardList.forEach((c) => (c.isSelected = !c.isSelected));
}
// 取消
function cancel() {
    cardStore.validCardList.forEach((c) => (c.isSelected = false));
}
// 清空
function clear() {
    // data.cardList = [];
    cardStore.clearCardList();
    filters.size.width = cardStore.filters.size.width;
    filters.size.height = cardStore.filters.size.height;
}
// 下载选中项
function downloadSelected() {
    const ids = cardStore.validCardList
        .filter((x) => x.isSelected)
        .map((x) => x.id);
    cardStore.downloadCards(ids);
}
// 下载全部
function downloadAll() {
    const ids = cardStore.filteredCardList.map((x) => x.id);
    cardStore.downloadCards(ids);
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
    __VLS_components.VSheet;
    __VLS_components.vSheet;
    __VLS_components.VSheet;
    __VLS_components.vSheet;
    __VLS_components.VSheet;
    __VLS_components.vSheet;
    __VLS_components.VSheet;
    __VLS_components.vSheet;
    __VLS_components.VSheet;
    __VLS_components.vSheet;
    __VLS_components.VSheet;
    __VLS_components.vSheet;
    __VLS_components.VSheet;
    __VLS_components.vSheet;
    __VLS_components.VSheet;
    __VLS_components.vSheet;
    __VLS_components.VSheet;
    __VLS_components.vSheet;
    __VLS_components.VSheet;
    __VLS_components.vSheet;
    // @ts-ignore
    [VSheet, VSheet, VSheet, VSheet, VSheet, VSheet, VSheet, VSheet, VSheet, VSheet,];
    __VLS_components.VProgressLinear;
    __VLS_components.vProgressLinear;
    __VLS_components.VProgressLinear;
    __VLS_components.vProgressLinear;
    // @ts-ignore
    [VProgressLinear, VProgressLinear,];
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.template;
    __VLS_intrinsicElements.strong;
    __VLS_intrinsicElements.strong;
    __VLS_components.VarBadge;
    __VLS_components.varBadge;
    __VLS_components.VarBadge;
    __VLS_components.varBadge;
    __VLS_components.VarBadge;
    __VLS_components.varBadge;
    __VLS_components.VarBadge;
    __VLS_components.varBadge;
    // @ts-ignore
    [VarBadge, VarBadge, VarBadge, VarBadge,];
    __VLS_components.VarMenu;
    __VLS_components.varMenu;
    __VLS_components.VarMenu;
    __VLS_components.varMenu;
    __VLS_components.VarMenu;
    __VLS_components.varMenu;
    __VLS_components.VarMenu;
    __VLS_components.varMenu;
    // @ts-ignore
    [VarMenu, VarMenu, VarMenu, VarMenu,];
    __VLS_components.VarButtonGroup;
    __VLS_components.varButtonGroup;
    __VLS_components.VarButtonGroup;
    __VLS_components.varButtonGroup;
    __VLS_components.VarButtonGroup;
    __VLS_components.varButtonGroup;
    __VLS_components.VarButtonGroup;
    __VLS_components.varButtonGroup;
    __VLS_components.VarButtonGroup;
    __VLS_components.varButtonGroup;
    __VLS_components.VarButtonGroup;
    __VLS_components.varButtonGroup;
    __VLS_components.VarButtonGroup;
    __VLS_components.varButtonGroup;
    __VLS_components.VarButtonGroup;
    __VLS_components.varButtonGroup;
    __VLS_components.VarButtonGroup;
    __VLS_components.varButtonGroup;
    __VLS_components.VarButtonGroup;
    __VLS_components.varButtonGroup;
    // @ts-ignore
    [VarButtonGroup, VarButtonGroup, VarButtonGroup, VarButtonGroup, VarButtonGroup, VarButtonGroup, VarButtonGroup, VarButtonGroup, VarButtonGroup, VarButtonGroup,];
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
    [VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton,];
    __VLS_components.IconArrowDown;
    __VLS_components.IconArrowDown;
    __VLS_components.IconArrowDown;
    __VLS_components.IconArrowDown;
    // @ts-ignore
    [IconArrowDown, IconArrowDown,];
    __VLS_components.IconCloseCircleMultiple;
    __VLS_components.IconCloseCircleMultiple;
    // @ts-ignore
    [IconCloseCircleMultiple,];
    __VLS_components.IconDownload;
    __VLS_components.IconDownload;
    // @ts-ignore
    [IconDownload,];
    __VLS_components.VRangeSlider;
    __VLS_components.vRangeSlider;
    __VLS_components.VRangeSlider;
    __VLS_components.vRangeSlider;
    __VLS_components.VRangeSlider;
    __VLS_components.vRangeSlider;
    __VLS_components.VRangeSlider;
    __VLS_components.vRangeSlider;
    // @ts-ignore
    [VRangeSlider, VRangeSlider, VRangeSlider, VRangeSlider,];
    __VLS_components.VLabel;
    __VLS_components.vLabel;
    __VLS_components.VLabel;
    __VLS_components.vLabel;
    __VLS_components.VLabel;
    __VLS_components.vLabel;
    __VLS_components.VLabel;
    __VLS_components.vLabel;
    // @ts-ignore
    [VLabel, VLabel, VLabel, VLabel,];
    __VLS_components.VTextField;
    __VLS_components.vTextField;
    __VLS_components.VTextField;
    __VLS_components.vTextField;
    __VLS_components.VTextField;
    __VLS_components.vTextField;
    __VLS_components.VTextField;
    __VLS_components.vTextField;
    __VLS_components.VTextField;
    __VLS_components.vTextField;
    __VLS_components.VTextField;
    __VLS_components.vTextField;
    __VLS_components.VTextField;
    __VLS_components.vTextField;
    __VLS_components.VTextField;
    __VLS_components.vTextField;
    // @ts-ignore
    [VTextField, VTextField, VTextField, VTextField, VTextField, VTextField, VTextField, VTextField,];
    {
        const __VLS_0 = __VLS_intrinsicElements["div"];
        const __VLS_1 = __VLS_elementAsFunctionalComponent(__VLS_0);
        const __VLS_2 = __VLS_1({ ...{}, class: ("gallery-toolbar-container"), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        ({}({ ...{}, class: ("gallery-toolbar-container"), }));
        {
            const __VLS_5 = {}.VSheet;
            const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({ ...{}, class: ("gallery-toolbar"), width: ("100%"), elevation: ((4)), }));
            ({}.VSheet);
            ({}.VSheet);
            const __VLS_7 = __VLS_6({ ...{}, class: ("gallery-toolbar"), width: ("100%"), elevation: ((4)), }, ...__VLS_functionalComponentArgsRest(__VLS_6));
            ({}({ ...{}, class: ("gallery-toolbar"), width: ("100%"), elevation: ((4)), }));
            {
                const __VLS_10 = {}.VProgressLinear;
                const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({ ...{}, class: ("gallery-toolbar-loading"), color: ("primary"), active: ((__VLS_ctx.loadingStore.loading)), max: ((__VLS_ctx.loadingStore.total)), modelValue: ((__VLS_ctx.loadingStore.current)), height: ("14"), rounded: (true), roundedBar: (true), }));
                ({}.VProgressLinear);
                ({}.VProgressLinear);
                const __VLS_12 = __VLS_11({ ...{}, class: ("gallery-toolbar-loading"), color: ("primary"), active: ((__VLS_ctx.loadingStore.loading)), max: ((__VLS_ctx.loadingStore.total)), modelValue: ((__VLS_ctx.loadingStore.current)), height: ("14"), rounded: (true), roundedBar: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_11));
                ({}({ ...{}, class: ("gallery-toolbar-loading"), color: ("primary"), active: ((__VLS_ctx.loadingStore.loading)), max: ((__VLS_ctx.loadingStore.total)), modelValue: ((__VLS_ctx.loadingStore.current)), height: ("14"), rounded: (true), roundedBar: (true), }));
                {
                    const __VLS_15 = __VLS_intrinsicElements["template"];
                    const __VLS_16 = __VLS_elementAsFunctionalComponent(__VLS_15);
                    const __VLS_17 = __VLS_16({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_16));
                    ({}({ ...{}, }));
                    {
                        const [{ value }] = __VLS_getSlotParams((__VLS_13.slots).default);
                        {
                            const __VLS_19 = __VLS_intrinsicElements["strong"];
                            const __VLS_20 = __VLS_elementAsFunctionalComponent(__VLS_19);
                            const __VLS_21 = __VLS_20({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_20));
                            ({}({ ...{}, }));
                            (value.toFixed(2));
                            (__VLS_22.slots).default;
                            const __VLS_22 = __VLS_pickFunctionalComponentCtx(__VLS_19, __VLS_21);
                        }
                        // @ts-ignore
                        [loadingStore, loadingStore, loadingStore,];
                    }
                }
                const __VLS_13 = __VLS_pickFunctionalComponentCtx(__VLS_10, __VLS_12);
            }
            {
                const __VLS_24 = {}.VSheet;
                const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({ ...{}, class: ("gallery-container-control-panel"), elevation: ((0)), width: ("fit-content"), }));
                ({}.VSheet);
                ({}.VSheet);
                const __VLS_26 = __VLS_25({ ...{}, class: ("gallery-container-control-panel"), elevation: ((0)), width: ("fit-content"), }, ...__VLS_functionalComponentArgsRest(__VLS_25));
                ({}({ ...{}, class: ("gallery-container-control-panel"), elevation: ((0)), width: ("fit-content"), }));
                {
                    const __VLS_29 = {}.VarBadge;
                    const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({ ...{}, offsetY: ((2)), offsetX: ((-8)), style: ({}), hidden: ((!__VLS_ctx.cardStore.validCardList.length)), value: ((__VLS_ctx.cardStore.validCardList.length)), }));
                    ({}.VarBadge);
                    ({}.VarBadge);
                    const __VLS_31 = __VLS_30({ ...{}, offsetY: ((2)), offsetX: ((-8)), style: ({}), hidden: ((!__VLS_ctx.cardStore.validCardList.length)), value: ((__VLS_ctx.cardStore.validCardList.length)), }, ...__VLS_functionalComponentArgsRest(__VLS_30));
                    ({}({ ...{}, offsetY: ((2)), offsetX: ((-8)), style: ({}), hidden: ((!__VLS_ctx.cardStore.validCardList.length)), value: ((__VLS_ctx.cardStore.validCardList.length)), }));
                    {
                        const __VLS_34 = {}.VarMenu;
                        const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({ ...{}, placement: ("bottom"), defaultStyle: ((false)), sameWidth: (true), trigger: ((__VLS_ctx.isMobile() ? 'click' : 'hover')), teleport: ((false)), }));
                        ({}.VarMenu);
                        ({}.VarMenu);
                        const __VLS_36 = __VLS_35({ ...{}, placement: ("bottom"), defaultStyle: ((false)), sameWidth: (true), trigger: ((__VLS_ctx.isMobile() ? 'click' : 'hover')), teleport: ((false)), }, ...__VLS_functionalComponentArgsRest(__VLS_35));
                        ({}({ ...{}, placement: ("bottom"), defaultStyle: ((false)), sameWidth: (true), trigger: ((__VLS_ctx.isMobile() ? 'click' : 'hover')), teleport: ((false)), }));
                        {
                            const __VLS_39 = {}.VarButtonGroup;
                            const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({ ...{}, size: ((__VLS_ctx.isMobile() ? 'small' : 'normal')), type: ("success"), }));
                            ({}.VarButtonGroup);
                            ({}.VarButtonGroup);
                            const __VLS_41 = __VLS_40({ ...{}, size: ((__VLS_ctx.isMobile() ? 'small' : 'normal')), type: ("success"), }, ...__VLS_functionalComponentArgsRest(__VLS_40));
                            ({}({ ...{}, size: ((__VLS_ctx.isMobile() ? 'small' : 'normal')), type: ("success"), }));
                            {
                                const __VLS_44 = {}.VarButton;
                                const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({ ...{ 'onClick': {}, }, loading: ((__VLS_ctx.state.loading)), block: (true), iconContainer: (true), }));
                                ({}.VarButton);
                                ({}.VarButton);
                                const __VLS_46 = __VLS_45({ ...{ 'onClick': {}, }, loading: ((__VLS_ctx.state.loading)), block: (true), iconContainer: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_45));
                                ({}({ ...{ 'onClick': {}, }, loading: ((__VLS_ctx.state.loading)), block: (true), iconContainer: (true), }));
                                let __VLS_49 = { 'click': __VLS_pickEvent(__VLS_48['click'], {}.onClick) };
                                __VLS_49 = { click: (__VLS_ctx.getCards) };
                                (__VLS_47.slots).default;
                                const __VLS_47 = __VLS_pickFunctionalComponentCtx(__VLS_44, __VLS_46);
                                let __VLS_48;
                            }
                            {
                                const __VLS_50 = {}.VarButton;
                                const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({ ...{}, style: ({}), }));
                                ({}.VarButton);
                                ({}.VarButton);
                                const __VLS_52 = __VLS_51({ ...{}, style: ({}), }, ...__VLS_functionalComponentArgsRest(__VLS_51));
                                ({}({ ...{}, style: ({}), }));
                                {
                                    const __VLS_55 = {}.IconArrowDown;
                                    const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({ ...{}, style: ({}), }));
                                    ({}.IconArrowDown);
                                    const __VLS_57 = __VLS_56({ ...{}, style: ({}), }, ...__VLS_functionalComponentArgsRest(__VLS_56));
                                    ({}({ ...{}, style: ({}), }));
                                    const __VLS_58 = __VLS_pickFunctionalComponentCtx(__VLS_55, __VLS_57);
                                }
                                (__VLS_53.slots).default;
                                const __VLS_53 = __VLS_pickFunctionalComponentCtx(__VLS_50, __VLS_52);
                            }
                            (__VLS_42.slots).default;
                            const __VLS_42 = __VLS_pickFunctionalComponentCtx(__VLS_39, __VLS_41);
                        }
                        {
                            const __VLS_60 = __VLS_intrinsicElements["template"];
                            const __VLS_61 = __VLS_elementAsFunctionalComponent(__VLS_60);
                            const __VLS_62 = __VLS_61({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_61));
                            ({}({ ...{}, }));
                            {
                                (__VLS_37.slots).menu;
                                {
                                    const __VLS_64 = {}.VarButtonGroup;
                                    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({ ...{}, size: ((__VLS_ctx.isMobile() ? 'small' : 'normal')), vertical: (true), }));
                                    ({}.VarButtonGroup);
                                    ({}.VarButtonGroup);
                                    const __VLS_66 = __VLS_65({ ...{}, size: ((__VLS_ctx.isMobile() ? 'small' : 'normal')), vertical: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_65));
                                    ({}({ ...{}, size: ((__VLS_ctx.isMobile() ? 'small' : 'normal')), vertical: (true), }));
                                    {
                                        const __VLS_69 = {}.VarButton;
                                        const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({ ...{ 'onClick': {}, }, type: ("danger"), iconContainer: (true), block: (true), }));
                                        ({}.VarButton);
                                        ({}.VarButton);
                                        const __VLS_71 = __VLS_70({ ...{ 'onClick': {}, }, type: ("danger"), iconContainer: (true), block: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_70));
                                        ({}({ ...{ 'onClick': {}, }, type: ("danger"), iconContainer: (true), block: (true), }));
                                        let __VLS_74 = { 'click': __VLS_pickEvent(__VLS_73['click'], {}.onClick) };
                                        __VLS_74 = { click: (__VLS_ctx.clear) };
                                        {
                                            const __VLS_75 = {}.IconCloseCircleMultiple;
                                            const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({ ...{}, class: ("gallery-toolbar-icon"), style: ({}), }));
                                            ({}.IconCloseCircleMultiple);
                                            const __VLS_77 = __VLS_76({ ...{}, class: ("gallery-toolbar-icon"), style: ({}), }, ...__VLS_functionalComponentArgsRest(__VLS_76));
                                            ({}({ ...{}, class: ("gallery-toolbar-icon"), style: ({}), }));
                                            const __VLS_78 = __VLS_pickFunctionalComponentCtx(__VLS_75, __VLS_77);
                                        }
                                        (__VLS_72.slots).default;
                                        const __VLS_72 = __VLS_pickFunctionalComponentCtx(__VLS_69, __VLS_71);
                                        let __VLS_73;
                                    }
                                    (__VLS_67.slots).default;
                                    const __VLS_67 = __VLS_pickFunctionalComponentCtx(__VLS_64, __VLS_66);
                                }
                                // @ts-ignore
                                [cardStore, cardStore, isMobile, isMobile, state, getCards, isMobile, clear,];
                            }
                        }
                        const __VLS_37 = __VLS_pickFunctionalComponentCtx(__VLS_34, __VLS_36);
                    }
                    (__VLS_32.slots).default;
                    const __VLS_32 = __VLS_pickFunctionalComponentCtx(__VLS_29, __VLS_31);
                }
                (__VLS_27.slots).default;
                const __VLS_27 = __VLS_pickFunctionalComponentCtx(__VLS_24, __VLS_26);
            }
            {
                const __VLS_80 = {}.VSheet;
                const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({ ...{}, class: ("gallery-container-control-panel"), elevation: ((0)), width: ("fit-content"), }));
                ({}.VSheet);
                ({}.VSheet);
                const __VLS_82 = __VLS_81({ ...{}, class: ("gallery-container-control-panel"), elevation: ((0)), width: ("fit-content"), }, ...__VLS_functionalComponentArgsRest(__VLS_81));
                ({}({ ...{}, class: ("gallery-container-control-panel"), elevation: ((0)), width: ("fit-content"), }));
                {
                    const __VLS_85 = {}.VarButtonGroup;
                    const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({ ...{}, class: ("control-button-group"), size: ((__VLS_ctx.isMobile() ? 'small' : 'normal')), }));
                    ({}.VarButtonGroup);
                    ({}.VarButtonGroup);
                    const __VLS_87 = __VLS_86({ ...{}, class: ("control-button-group"), size: ((__VLS_ctx.isMobile() ? 'small' : 'normal')), }, ...__VLS_functionalComponentArgsRest(__VLS_86));
                    ({}({ ...{}, class: ("control-button-group"), size: ((__VLS_ctx.isMobile() ? 'small' : 'normal')), }));
                    {
                        const __VLS_90 = {}.VarButton;
                        const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({ ...{ 'onClick': {}, }, type: ("primary"), }));
                        ({}.VarButton);
                        ({}.VarButton);
                        const __VLS_92 = __VLS_91({ ...{ 'onClick': {}, }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_91));
                        ({}({ ...{ 'onClick': {}, }, type: ("primary"), }));
                        let __VLS_95 = { 'click': __VLS_pickEvent(__VLS_94['click'], {}.onClick) };
                        __VLS_95 = { click: (__VLS_ctx.checkAll) };
                        (__VLS_93.slots).default;
                        const __VLS_93 = __VLS_pickFunctionalComponentCtx(__VLS_90, __VLS_92);
                        let __VLS_94;
                    }
                    {
                        const __VLS_96 = {}.VarButton;
                        const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({ ...{ 'onClick': {}, }, type: ("info"), }));
                        ({}.VarButton);
                        ({}.VarButton);
                        const __VLS_98 = __VLS_97({ ...{ 'onClick': {}, }, type: ("info"), }, ...__VLS_functionalComponentArgsRest(__VLS_97));
                        ({}({ ...{ 'onClick': {}, }, type: ("info"), }));
                        let __VLS_101 = { 'click': __VLS_pickEvent(__VLS_100['click'], {}.onClick) };
                        __VLS_101 = { click: (__VLS_ctx.inverseAll) };
                        (__VLS_99.slots).default;
                        const __VLS_99 = __VLS_pickFunctionalComponentCtx(__VLS_96, __VLS_98);
                        let __VLS_100;
                    }
                    {
                        const __VLS_102 = {}.VarButton;
                        const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({ ...{ 'onClick': {}, }, }));
                        ({}.VarButton);
                        ({}.VarButton);
                        const __VLS_104 = __VLS_103({ ...{ 'onClick': {}, }, }, ...__VLS_functionalComponentArgsRest(__VLS_103));
                        ({}({ ...{ 'onClick': {}, }, }));
                        let __VLS_107 = { 'click': __VLS_pickEvent(__VLS_106['click'], {}.onClick) };
                        __VLS_107 = { click: (__VLS_ctx.cancel) };
                        (__VLS_105.slots).default;
                        const __VLS_105 = __VLS_pickFunctionalComponentCtx(__VLS_102, __VLS_104);
                        let __VLS_106;
                    }
                    (__VLS_88.slots).default;
                    const __VLS_88 = __VLS_pickFunctionalComponentCtx(__VLS_85, __VLS_87);
                }
                (__VLS_83.slots).default;
                const __VLS_83 = __VLS_pickFunctionalComponentCtx(__VLS_80, __VLS_82);
            }
            {
                const __VLS_108 = {}.VSheet;
                const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({ ...{}, class: ("gallery-container-control-panel"), elevation: ((0)), width: ("fit-content"), }));
                ({}.VSheet);
                ({}.VSheet);
                const __VLS_110 = __VLS_109({ ...{}, class: ("gallery-container-control-panel"), elevation: ((0)), width: ("fit-content"), }, ...__VLS_functionalComponentArgsRest(__VLS_109));
                ({}({ ...{}, class: ("gallery-container-control-panel"), elevation: ((0)), width: ("fit-content"), }));
                {
                    const __VLS_113 = {}.VarBadge;
                    const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({ ...{}, type: ("info"), offsetY: ((2)), style: ({}), hidden: ((!__VLS_ctx.checkedCardList.length)), value: ((__VLS_ctx.checkedCardList.length)), }));
                    ({}.VarBadge);
                    ({}.VarBadge);
                    const __VLS_115 = __VLS_114({ ...{}, type: ("info"), offsetY: ((2)), style: ({}), hidden: ((!__VLS_ctx.checkedCardList.length)), value: ((__VLS_ctx.checkedCardList.length)), }, ...__VLS_functionalComponentArgsRest(__VLS_114));
                    ({}({ ...{}, type: ("info"), offsetY: ((2)), style: ({}), hidden: ((!__VLS_ctx.checkedCardList.length)), value: ((__VLS_ctx.checkedCardList.length)), }));
                    {
                        const __VLS_118 = {}.VarMenu;
                        const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({ ...{}, placement: ("bottom"), defaultStyle: ((false)), trigger: ((__VLS_ctx.isMobile() ? 'click' : 'hover')), teleport: ((false)), }));
                        ({}.VarMenu);
                        ({}.VarMenu);
                        const __VLS_120 = __VLS_119({ ...{}, placement: ("bottom"), defaultStyle: ((false)), trigger: ((__VLS_ctx.isMobile() ? 'click' : 'hover')), teleport: ((false)), }, ...__VLS_functionalComponentArgsRest(__VLS_119));
                        ({}({ ...{}, placement: ("bottom"), defaultStyle: ((false)), trigger: ((__VLS_ctx.isMobile() ? 'click' : 'hover')), teleport: ((false)), }));
                        {
                            const __VLS_123 = {}.VarButtonGroup;
                            const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({ ...{}, size: ((__VLS_ctx.isMobile() ? 'small' : 'normal')), type: ("primary"), }));
                            ({}.VarButtonGroup);
                            ({}.VarButtonGroup);
                            const __VLS_125 = __VLS_124({ ...{}, size: ((__VLS_ctx.isMobile() ? 'small' : 'normal')), type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_124));
                            ({}({ ...{}, size: ((__VLS_ctx.isMobile() ? 'small' : 'normal')), type: ("primary"), }));
                            {
                                const __VLS_128 = {}.VarButton;
                                const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({ ...{ 'onClick': {}, }, }));
                                ({}.VarButton);
                                ({}.VarButton);
                                const __VLS_130 = __VLS_129({ ...{ 'onClick': {}, }, }, ...__VLS_functionalComponentArgsRest(__VLS_129));
                                ({}({ ...{ 'onClick': {}, }, }));
                                let __VLS_133 = { 'click': __VLS_pickEvent(__VLS_132['click'], {}.onClick) };
                                __VLS_133 = { click: (__VLS_ctx.downloadSelected) };
                                (__VLS_131.slots).default;
                                const __VLS_131 = __VLS_pickFunctionalComponentCtx(__VLS_128, __VLS_130);
                                let __VLS_132;
                            }
                            {
                                const __VLS_134 = {}.VarButton;
                                const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({ ...{}, style: ({}), }));
                                ({}.VarButton);
                                ({}.VarButton);
                                const __VLS_136 = __VLS_135({ ...{}, style: ({}), }, ...__VLS_functionalComponentArgsRest(__VLS_135));
                                ({}({ ...{}, style: ({}), }));
                                {
                                    const __VLS_139 = {}.IconArrowDown;
                                    const __VLS_140 = __VLS_asFunctionalComponent(__VLS_139, new __VLS_139({ ...{}, style: ({}), }));
                                    ({}.IconArrowDown);
                                    const __VLS_141 = __VLS_140({ ...{}, style: ({}), }, ...__VLS_functionalComponentArgsRest(__VLS_140));
                                    ({}({ ...{}, style: ({}), }));
                                    const __VLS_142 = __VLS_pickFunctionalComponentCtx(__VLS_139, __VLS_141);
                                }
                                (__VLS_137.slots).default;
                                const __VLS_137 = __VLS_pickFunctionalComponentCtx(__VLS_134, __VLS_136);
                            }
                            (__VLS_126.slots).default;
                            const __VLS_126 = __VLS_pickFunctionalComponentCtx(__VLS_123, __VLS_125);
                        }
                        {
                            const __VLS_144 = __VLS_intrinsicElements["template"];
                            const __VLS_145 = __VLS_elementAsFunctionalComponent(__VLS_144);
                            const __VLS_146 = __VLS_145({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_145));
                            ({}({ ...{}, }));
                            {
                                (__VLS_121.slots).menu;
                                {
                                    const __VLS_148 = {}.VarButtonGroup;
                                    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({ ...{}, size: ((__VLS_ctx.isMobile() ? 'small' : 'normal')), vertical: (true), }));
                                    ({}.VarButtonGroup);
                                    ({}.VarButtonGroup);
                                    const __VLS_150 = __VLS_149({ ...{}, size: ((__VLS_ctx.isMobile() ? 'small' : 'normal')), vertical: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_149));
                                    ({}({ ...{}, size: ((__VLS_ctx.isMobile() ? 'small' : 'normal')), vertical: (true), }));
                                    {
                                        const __VLS_153 = {}.VarButton;
                                        const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({ ...{ 'onClick': {}, }, iconContainer: (true), block: (true), elevation: ((false)), }));
                                        ({}.VarButton);
                                        ({}.VarButton);
                                        const __VLS_155 = __VLS_154({ ...{ 'onClick': {}, }, iconContainer: (true), block: (true), elevation: ((false)), }, ...__VLS_functionalComponentArgsRest(__VLS_154));
                                        ({}({ ...{ 'onClick': {}, }, iconContainer: (true), block: (true), elevation: ((false)), }));
                                        let __VLS_158 = { 'click': __VLS_pickEvent(__VLS_157['click'], {}.onClick) };
                                        __VLS_158 = { click: (__VLS_ctx.downloadAll) };
                                        {
                                            const __VLS_159 = {}.IconDownload;
                                            const __VLS_160 = __VLS_asFunctionalComponent(__VLS_159, new __VLS_159({ ...{}, class: ("gallery-toolbar-icon"), style: ({}), }));
                                            ({}.IconDownload);
                                            const __VLS_161 = __VLS_160({ ...{}, class: ("gallery-toolbar-icon"), style: ({}), }, ...__VLS_functionalComponentArgsRest(__VLS_160));
                                            ({}({ ...{}, class: ("gallery-toolbar-icon"), style: ({}), }));
                                            const __VLS_162 = __VLS_pickFunctionalComponentCtx(__VLS_159, __VLS_161);
                                        }
                                        (__VLS_156.slots).default;
                                        const __VLS_156 = __VLS_pickFunctionalComponentCtx(__VLS_153, __VLS_155);
                                        let __VLS_157;
                                    }
                                    (__VLS_151.slots).default;
                                    const __VLS_151 = __VLS_pickFunctionalComponentCtx(__VLS_148, __VLS_150);
                                }
                                // @ts-ignore
                                [isMobile, checkAll, inverseAll, cancel, checkedCardList, checkedCardList, isMobile, isMobile, downloadSelected, isMobile, downloadAll,];
                            }
                        }
                        const __VLS_121 = __VLS_pickFunctionalComponentCtx(__VLS_118, __VLS_120);
                    }
                    (__VLS_116.slots).default;
                    const __VLS_116 = __VLS_pickFunctionalComponentCtx(__VLS_113, __VLS_115);
                }
                (__VLS_111.slots).default;
                const __VLS_111 = __VLS_pickFunctionalComponentCtx(__VLS_108, __VLS_110);
            }
            {
                const __VLS_164 = {}.VSheet;
                const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({ ...{}, class: ("gallery-container-control-panel filter-control-panel"), elevation: ((0)), width: ((200)), }));
                ({}.VSheet);
                ({}.VSheet);
                const __VLS_166 = __VLS_165({ ...{}, class: ("gallery-container-control-panel filter-control-panel"), elevation: ((0)), width: ((200)), }, ...__VLS_functionalComponentArgsRest(__VLS_165));
                ({}({ ...{}, class: ("gallery-container-control-panel filter-control-panel"), elevation: ((0)), width: ((200)), }));
                {
                    const __VLS_169 = {}.VRangeSlider;
                    const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({ ...{ 'onEnd': {}, }, class: ("filter-input-slider"), label: ("宽度"), modelValue: ((__VLS_ctx.filters.size.width)), color: ("primary"), density: ("compact"), rounded: (true), hideDetails: (true), step: ("1"), max: ((__VLS_ctx.cardStore.info.size.width[1])), min: ((__VLS_ctx.cardStore.info.size.width[0])), ripple: ((false)), }));
                    ({}.VRangeSlider);
                    ({}.VRangeSlider);
                    const __VLS_171 = __VLS_170({ ...{ 'onEnd': {}, }, class: ("filter-input-slider"), label: ("宽度"), modelValue: ((__VLS_ctx.filters.size.width)), color: ("primary"), density: ("compact"), rounded: (true), hideDetails: (true), step: ("1"), max: ((__VLS_ctx.cardStore.info.size.width[1])), min: ((__VLS_ctx.cardStore.info.size.width[0])), ripple: ((false)), }, ...__VLS_functionalComponentArgsRest(__VLS_170));
                    ({}({ ...{ 'onEnd': {}, }, class: ("filter-input-slider"), label: ("宽度"), modelValue: ((__VLS_ctx.filters.size.width)), color: ("primary"), density: ("compact"), rounded: (true), hideDetails: (true), step: ("1"), max: ((__VLS_ctx.cardStore.info.size.width[1])), min: ((__VLS_ctx.cardStore.info.size.width[0])), ripple: ((false)), }));
                    let __VLS_174 = { 'end': __VLS_pickEvent(__VLS_173['end'], {}.onEnd) };
                    __VLS_174 = { end: $event => {
                            __VLS_ctx.filterChange('width', $event);
                            // @ts-ignore
                            [filters, cardStore, cardStore, filterChange,];
                        }
                    };
                    {
                        const __VLS_175 = __VLS_intrinsicElements["template"];
                        const __VLS_176 = __VLS_elementAsFunctionalComponent(__VLS_175);
                        const __VLS_177 = __VLS_176({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_176));
                        ({}({ ...{}, }));
                        {
                            (__VLS_172.slots).label;
                            {
                                const __VLS_179 = {}.VLabel;
                                const __VLS_180 = __VLS_asFunctionalComponent(__VLS_179, new __VLS_179({ ...{}, class: ("input-slider-label"), }));
                                ({}.VLabel);
                                ({}.VLabel);
                                const __VLS_181 = __VLS_180({ ...{}, class: ("input-slider-label"), }, ...__VLS_functionalComponentArgsRest(__VLS_180));
                                ({}({ ...{}, class: ("input-slider-label"), }));
                                (__VLS_182.slots).default;
                                const __VLS_182 = __VLS_pickFunctionalComponentCtx(__VLS_179, __VLS_181);
                            }
                        }
                    }
                    {
                        const __VLS_184 = __VLS_intrinsicElements["template"];
                        const __VLS_185 = __VLS_elementAsFunctionalComponent(__VLS_184);
                        const __VLS_186 = __VLS_185({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_185));
                        ({}({ ...{}, }));
                        {
                            (__VLS_172.slots).prepend;
                            {
                                const __VLS_188 = {}.VTextField;
                                const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({ ...{}, class: ("filter-input-number"), modelValue: ((__VLS_ctx.filters.size.width[0])), type: ("number"), variant: ("plain"), disabled: (true), hideDetails: (true), }));
                                ({}.VTextField);
                                ({}.VTextField);
                                const __VLS_190 = __VLS_189({ ...{}, class: ("filter-input-number"), modelValue: ((__VLS_ctx.filters.size.width[0])), type: ("number"), variant: ("plain"), disabled: (true), hideDetails: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_189));
                                ({}({ ...{}, class: ("filter-input-number"), modelValue: ((__VLS_ctx.filters.size.width[0])), type: ("number"), variant: ("plain"), disabled: (true), hideDetails: (true), }));
                                const __VLS_191 = __VLS_pickFunctionalComponentCtx(__VLS_188, __VLS_190);
                            }
                            // @ts-ignore
                            [filters,];
                        }
                    }
                    {
                        const __VLS_193 = __VLS_intrinsicElements["template"];
                        const __VLS_194 = __VLS_elementAsFunctionalComponent(__VLS_193);
                        const __VLS_195 = __VLS_194({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_194));
                        ({}({ ...{}, }));
                        {
                            (__VLS_172.slots).append;
                            {
                                const __VLS_197 = {}.VTextField;
                                const __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({ ...{}, class: ("filter-input-number"), modelValue: ((__VLS_ctx.filters.size.width[1])), type: ("number"), variant: ("plain"), disabled: (true), hideDetails: (true), }));
                                ({}.VTextField);
                                ({}.VTextField);
                                const __VLS_199 = __VLS_198({ ...{}, class: ("filter-input-number"), modelValue: ((__VLS_ctx.filters.size.width[1])), type: ("number"), variant: ("plain"), disabled: (true), hideDetails: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_198));
                                ({}({ ...{}, class: ("filter-input-number"), modelValue: ((__VLS_ctx.filters.size.width[1])), type: ("number"), variant: ("plain"), disabled: (true), hideDetails: (true), }));
                                const __VLS_200 = __VLS_pickFunctionalComponentCtx(__VLS_197, __VLS_199);
                            }
                            // @ts-ignore
                            [filters,];
                        }
                    }
                    const __VLS_172 = __VLS_pickFunctionalComponentCtx(__VLS_169, __VLS_171);
                    let __VLS_173;
                }
                {
                    const __VLS_202 = {}.VRangeSlider;
                    const __VLS_203 = __VLS_asFunctionalComponent(__VLS_202, new __VLS_202({ ...{ 'onEnd': {}, }, class: ("filter-input-slider"), label: ("高度"), modelValue: ((__VLS_ctx.filters.size.height)), color: ("primary"), density: ("comfortable"), rounded: (true), hideDetails: (true), step: ("1"), max: ((__VLS_ctx.cardStore.info.size.height[1])), min: ((__VLS_ctx.cardStore.info.size.height[0])), ripple: ((false)), }));
                    ({}.VRangeSlider);
                    ({}.VRangeSlider);
                    const __VLS_204 = __VLS_203({ ...{ 'onEnd': {}, }, class: ("filter-input-slider"), label: ("高度"), modelValue: ((__VLS_ctx.filters.size.height)), color: ("primary"), density: ("comfortable"), rounded: (true), hideDetails: (true), step: ("1"), max: ((__VLS_ctx.cardStore.info.size.height[1])), min: ((__VLS_ctx.cardStore.info.size.height[0])), ripple: ((false)), }, ...__VLS_functionalComponentArgsRest(__VLS_203));
                    ({}({ ...{ 'onEnd': {}, }, class: ("filter-input-slider"), label: ("高度"), modelValue: ((__VLS_ctx.filters.size.height)), color: ("primary"), density: ("comfortable"), rounded: (true), hideDetails: (true), step: ("1"), max: ((__VLS_ctx.cardStore.info.size.height[1])), min: ((__VLS_ctx.cardStore.info.size.height[0])), ripple: ((false)), }));
                    let __VLS_207 = { 'end': __VLS_pickEvent(__VLS_206['end'], {}.onEnd) };
                    __VLS_207 = { end: $event => {
                            __VLS_ctx.filterChange('height', $event);
                            // @ts-ignore
                            [filters, cardStore, cardStore, filterChange,];
                        }
                    };
                    {
                        const __VLS_208 = __VLS_intrinsicElements["template"];
                        const __VLS_209 = __VLS_elementAsFunctionalComponent(__VLS_208);
                        const __VLS_210 = __VLS_209({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_209));
                        ({}({ ...{}, }));
                        {
                            (__VLS_205.slots).label;
                            {
                                const __VLS_212 = {}.VLabel;
                                const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({ ...{}, class: ("input-slider-label"), }));
                                ({}.VLabel);
                                ({}.VLabel);
                                const __VLS_214 = __VLS_213({ ...{}, class: ("input-slider-label"), }, ...__VLS_functionalComponentArgsRest(__VLS_213));
                                ({}({ ...{}, class: ("input-slider-label"), }));
                                (__VLS_215.slots).default;
                                const __VLS_215 = __VLS_pickFunctionalComponentCtx(__VLS_212, __VLS_214);
                            }
                        }
                    }
                    {
                        const __VLS_217 = __VLS_intrinsicElements["template"];
                        const __VLS_218 = __VLS_elementAsFunctionalComponent(__VLS_217);
                        const __VLS_219 = __VLS_218({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_218));
                        ({}({ ...{}, }));
                        {
                            (__VLS_205.slots).prepend;
                            {
                                const __VLS_221 = {}.VTextField;
                                const __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({ ...{}, class: ("filter-input-number"), modelValue: ((__VLS_ctx.filters.size.height[0])), type: ("number"), variant: ("plain"), disabled: (true), hideDetails: (true), }));
                                ({}.VTextField);
                                ({}.VTextField);
                                const __VLS_223 = __VLS_222({ ...{}, class: ("filter-input-number"), modelValue: ((__VLS_ctx.filters.size.height[0])), type: ("number"), variant: ("plain"), disabled: (true), hideDetails: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_222));
                                ({}({ ...{}, class: ("filter-input-number"), modelValue: ((__VLS_ctx.filters.size.height[0])), type: ("number"), variant: ("plain"), disabled: (true), hideDetails: (true), }));
                                const __VLS_224 = __VLS_pickFunctionalComponentCtx(__VLS_221, __VLS_223);
                            }
                            // @ts-ignore
                            [filters,];
                        }
                    }
                    {
                        const __VLS_226 = __VLS_intrinsicElements["template"];
                        const __VLS_227 = __VLS_elementAsFunctionalComponent(__VLS_226);
                        const __VLS_228 = __VLS_227({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_227));
                        ({}({ ...{}, }));
                        {
                            (__VLS_205.slots).append;
                            {
                                const __VLS_230 = {}.VTextField;
                                const __VLS_231 = __VLS_asFunctionalComponent(__VLS_230, new __VLS_230({ ...{}, class: ("filter-input-number"), modelValue: ((__VLS_ctx.filters.size.height[1])), type: ("number"), variant: ("plain"), disabled: (true), hideDetails: (true), }));
                                ({}.VTextField);
                                ({}.VTextField);
                                const __VLS_232 = __VLS_231({ ...{}, class: ("filter-input-number"), modelValue: ((__VLS_ctx.filters.size.height[1])), type: ("number"), variant: ("plain"), disabled: (true), hideDetails: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_231));
                                ({}({ ...{}, class: ("filter-input-number"), modelValue: ((__VLS_ctx.filters.size.height[1])), type: ("number"), variant: ("plain"), disabled: (true), hideDetails: (true), }));
                                const __VLS_233 = __VLS_pickFunctionalComponentCtx(__VLS_230, __VLS_232);
                            }
                            // @ts-ignore
                            [filters,];
                        }
                    }
                    const __VLS_205 = __VLS_pickFunctionalComponentCtx(__VLS_202, __VLS_204);
                    let __VLS_206;
                }
                (__VLS_167.slots).default;
                const __VLS_167 = __VLS_pickFunctionalComponentCtx(__VLS_164, __VLS_166);
            }
            (__VLS_8.slots).default;
            const __VLS_8 = __VLS_pickFunctionalComponentCtx(__VLS_5, __VLS_7);
        }
        (__VLS_3.slots).default;
        const __VLS_3 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
    }
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses["gallery-toolbar-container"];
        __VLS_styleScopedClasses["gallery-toolbar"];
        __VLS_styleScopedClasses["gallery-toolbar-loading"];
        __VLS_styleScopedClasses["gallery-container-control-panel"];
        __VLS_styleScopedClasses["gallery-toolbar-icon"];
        __VLS_styleScopedClasses["gallery-container-control-panel"];
        __VLS_styleScopedClasses["control-button-group"];
        __VLS_styleScopedClasses["gallery-container-control-panel"];
        __VLS_styleScopedClasses["gallery-toolbar-icon"];
        __VLS_styleScopedClasses["gallery-container-control-panel"];
        __VLS_styleScopedClasses["filter-control-panel"];
        __VLS_styleScopedClasses["filter-input-slider"];
        __VLS_styleScopedClasses["input-slider-label"];
        __VLS_styleScopedClasses["filter-input-number"];
        __VLS_styleScopedClasses["filter-input-number"];
        __VLS_styleScopedClasses["filter-input-slider"];
        __VLS_styleScopedClasses["input-slider-label"];
        __VLS_styleScopedClasses["filter-input-number"];
        __VLS_styleScopedClasses["filter-input-number"];
    }
    var __VLS_slots;
    return __VLS_slots;
}
const __VLS_internalComponent = (await import('vue')).defineComponent({
    setup() {
        return {
            IconDownload: IconDownload,
            IconArrowDown: IconArrowDown,
            IconCloseCircleMultiple: IconCloseCircleMultiple,
            isMobile: isMobile,
            cardStore: cardStore,
            loadingStore: loadingStore,
            state: state,
            filters: filters,
            checkedCardList: checkedCardList,
            getCards: getCards,
            filterChange: filterChange,
            checkAll: checkAll,
            inverseAll: inverseAll,
            cancel: cancel,
            clear: clear,
            downloadSelected: downloadSelected,
            downloadAll: downloadAll,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});

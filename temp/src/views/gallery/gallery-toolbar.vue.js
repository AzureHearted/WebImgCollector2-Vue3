import { ref, reactive, computed } from "vue";
import { useCardStore } from "@/stores";
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const cardStore = useCardStore();
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
// 被选中的卡片
const checkedCardList = computed(() => {
    return cardStore.data.cardList.filter((x) => x.isSelected);
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
    cardStore.data.cardList.forEach((c) => (c.isSelected = true));
}
// 反选
function inverseAll() {
    cardStore.data.cardList.forEach((c) => (c.isSelected = !c.isSelected));
}
// 取消
function cancel() {
    cardStore.data.cardList.forEach((c) => (c.isSelected = false));
}
// 清空
function clear() {
    // data.cardList = [];
    cardStore.clearCardList();
    filters.size.width = cardStore.filters.size.width;
    filters.size.height = cardStore.filters.size.height;
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
    [VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton, VarButton,];
    __VLS_components.VarSpace;
    __VLS_components.varSpace;
    __VLS_components.VarSpace;
    __VLS_components.varSpace;
    // @ts-ignore
    [VarSpace, VarSpace,];
    __VLS_components.VarTooltip;
    __VLS_components.varTooltip;
    __VLS_components.VarTooltip;
    __VLS_components.varTooltip;
    __VLS_components.VarTooltip;
    __VLS_components.varTooltip;
    __VLS_components.VarTooltip;
    __VLS_components.varTooltip;
    // @ts-ignore
    [VarTooltip, VarTooltip, VarTooltip, VarTooltip,];
    __VLS_components.VarIcon;
    __VLS_components.varIcon;
    __VLS_components.VarIcon;
    __VLS_components.varIcon;
    // @ts-ignore
    [VarIcon, VarIcon,];
    __VLS_components.VarBadge;
    __VLS_components.varBadge;
    __VLS_components.VarBadge;
    __VLS_components.varBadge;
    // @ts-ignore
    [VarBadge, VarBadge,];
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
        const __VLS_2 = __VLS_1({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        ({}({ ...{}, }));
        {
            const __VLS_5 = {}.VSheet;
            const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({ ...{}, class: ("gallery-container-toolbar"), width: ("100%"), elevation: ((4)), }));
            ({}.VSheet);
            ({}.VSheet);
            const __VLS_7 = __VLS_6({ ...{}, class: ("gallery-container-toolbar"), width: ("100%"), elevation: ((4)), }, ...__VLS_functionalComponentArgsRest(__VLS_6));
            ({}({ ...{}, class: ("gallery-container-toolbar"), width: ("100%"), elevation: ((4)), }));
            {
                const __VLS_10 = {}.VSheet;
                const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({ ...{}, class: ("gallery-container-control-panel"), elevation: ((0)), width: ("fit-content"), }));
                ({}.VSheet);
                ({}.VSheet);
                const __VLS_12 = __VLS_11({ ...{}, class: ("gallery-container-control-panel"), elevation: ((0)), width: ("fit-content"), }, ...__VLS_functionalComponentArgsRest(__VLS_11));
                ({}({ ...{}, class: ("gallery-container-control-panel"), elevation: ((0)), width: ("fit-content"), }));
                {
                    const __VLS_15 = {}.VarButtonGroup;
                    const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({ ...{}, class: ("control-button-group"), size: ("normal"), }));
                    ({}.VarButtonGroup);
                    ({}.VarButtonGroup);
                    const __VLS_17 = __VLS_16({ ...{}, class: ("control-button-group"), size: ("normal"), }, ...__VLS_functionalComponentArgsRest(__VLS_16));
                    ({}({ ...{}, class: ("control-button-group"), size: ("normal"), }));
                    {
                        const __VLS_20 = {}.VarButton;
                        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({ ...{ 'onClick': {}, }, type: ("primary"), loading: ((__VLS_ctx.state.loading)), }));
                        ({}.VarButton);
                        ({}.VarButton);
                        const __VLS_22 = __VLS_21({ ...{ 'onClick': {}, }, type: ("primary"), loading: ((__VLS_ctx.state.loading)), }, ...__VLS_functionalComponentArgsRest(__VLS_21));
                        ({}({ ...{ 'onClick': {}, }, type: ("primary"), loading: ((__VLS_ctx.state.loading)), }));
                        let __VLS_25 = { 'click': __VLS_pickEvent(__VLS_24['click'], {}.onClick) };
                        __VLS_25 = { click: (__VLS_ctx.getCards) };
                        (__VLS_23.slots).default;
                        const __VLS_23 = __VLS_pickFunctionalComponentCtx(__VLS_20, __VLS_22);
                        let __VLS_24;
                    }
                    {
                        const __VLS_26 = {}.VarButton;
                        const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({ ...{ 'onClick': {}, }, type: ("danger"), }));
                        ({}.VarButton);
                        ({}.VarButton);
                        const __VLS_28 = __VLS_27({ ...{ 'onClick': {}, }, type: ("danger"), }, ...__VLS_functionalComponentArgsRest(__VLS_27));
                        ({}({ ...{ 'onClick': {}, }, type: ("danger"), }));
                        let __VLS_31 = { 'click': __VLS_pickEvent(__VLS_30['click'], {}.onClick) };
                        __VLS_31 = { click: (__VLS_ctx.clear) };
                        (__VLS_29.slots).default;
                        const __VLS_29 = __VLS_pickFunctionalComponentCtx(__VLS_26, __VLS_28);
                        let __VLS_30;
                    }
                    (__VLS_18.slots).default;
                    const __VLS_18 = __VLS_pickFunctionalComponentCtx(__VLS_15, __VLS_17);
                }
                (__VLS_13.slots).default;
                const __VLS_13 = __VLS_pickFunctionalComponentCtx(__VLS_10, __VLS_12);
            }
            {
                const __VLS_32 = {}.VSheet;
                const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({ ...{}, class: ("gallery-container-control-panel"), elevation: ((0)), width: ("fit-content"), }));
                ({}.VSheet);
                ({}.VSheet);
                const __VLS_34 = __VLS_33({ ...{}, class: ("gallery-container-control-panel"), elevation: ((0)), width: ("fit-content"), }, ...__VLS_functionalComponentArgsRest(__VLS_33));
                ({}({ ...{}, class: ("gallery-container-control-panel"), elevation: ((0)), width: ("fit-content"), }));
                {
                    const __VLS_37 = {}.VarButtonGroup;
                    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({ ...{}, class: ("control-button-group"), size: ("normal"), }));
                    ({}.VarButtonGroup);
                    ({}.VarButtonGroup);
                    const __VLS_39 = __VLS_38({ ...{}, class: ("control-button-group"), size: ("normal"), }, ...__VLS_functionalComponentArgsRest(__VLS_38));
                    ({}({ ...{}, class: ("control-button-group"), size: ("normal"), }));
                    {
                        const __VLS_42 = {}.VarButton;
                        const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({ ...{ 'onClick': {}, }, type: ("primary"), }));
                        ({}.VarButton);
                        ({}.VarButton);
                        const __VLS_44 = __VLS_43({ ...{ 'onClick': {}, }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_43));
                        ({}({ ...{ 'onClick': {}, }, type: ("primary"), }));
                        let __VLS_47 = { 'click': __VLS_pickEvent(__VLS_46['click'], {}.onClick) };
                        __VLS_47 = { click: (__VLS_ctx.checkAll) };
                        (__VLS_45.slots).default;
                        const __VLS_45 = __VLS_pickFunctionalComponentCtx(__VLS_42, __VLS_44);
                        let __VLS_46;
                    }
                    {
                        const __VLS_48 = {}.VarButton;
                        const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({ ...{ 'onClick': {}, }, type: ("primary"), }));
                        ({}.VarButton);
                        ({}.VarButton);
                        const __VLS_50 = __VLS_49({ ...{ 'onClick': {}, }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_49));
                        ({}({ ...{ 'onClick': {}, }, type: ("primary"), }));
                        let __VLS_53 = { 'click': __VLS_pickEvent(__VLS_52['click'], {}.onClick) };
                        __VLS_53 = { click: (__VLS_ctx.inverseAll) };
                        (__VLS_51.slots).default;
                        const __VLS_51 = __VLS_pickFunctionalComponentCtx(__VLS_48, __VLS_50);
                        let __VLS_52;
                    }
                    {
                        const __VLS_54 = {}.VarButton;
                        const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({ ...{ 'onClick': {}, }, type: ("primary"), }));
                        ({}.VarButton);
                        ({}.VarButton);
                        const __VLS_56 = __VLS_55({ ...{ 'onClick': {}, }, type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_55));
                        ({}({ ...{ 'onClick': {}, }, type: ("primary"), }));
                        let __VLS_59 = { 'click': __VLS_pickEvent(__VLS_58['click'], {}.onClick) };
                        __VLS_59 = { click: (__VLS_ctx.cancel) };
                        (__VLS_57.slots).default;
                        const __VLS_57 = __VLS_pickFunctionalComponentCtx(__VLS_54, __VLS_56);
                        let __VLS_58;
                    }
                    (__VLS_40.slots).default;
                    const __VLS_40 = __VLS_pickFunctionalComponentCtx(__VLS_37, __VLS_39);
                }
                (__VLS_35.slots).default;
                const __VLS_35 = __VLS_pickFunctionalComponentCtx(__VLS_32, __VLS_34);
            }
            {
                const __VLS_60 = {}.VSheet;
                const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({ ...{}, class: ("gallery-container-control-panel"), elevation: ((0)), width: ("fit-content"), }));
                ({}.VSheet);
                ({}.VSheet);
                const __VLS_62 = __VLS_61({ ...{}, class: ("gallery-container-control-panel"), elevation: ((0)), width: ("fit-content"), }, ...__VLS_functionalComponentArgsRest(__VLS_61));
                ({}({ ...{}, class: ("gallery-container-control-panel"), elevation: ((0)), width: ("fit-content"), }));
                {
                    const __VLS_65 = {}.VarSpace;
                    const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({ ...{}, wrap: ((false)), size: (([4, 4])), }));
                    ({}.VarSpace);
                    ({}.VarSpace);
                    const __VLS_67 = __VLS_66({ ...{}, wrap: ((false)), size: (([4, 4])), }, ...__VLS_functionalComponentArgsRest(__VLS_66));
                    ({}({ ...{}, wrap: ((false)), size: (([4, 4])), }));
                    {
                        const __VLS_70 = {}.VarTooltip;
                        const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({ ...{}, content: ("全部下载"), teleport: (".online-gallery-top-container"), }));
                        ({}.VarTooltip);
                        ({}.VarTooltip);
                        const __VLS_72 = __VLS_71({ ...{}, content: ("全部下载"), teleport: (".online-gallery-top-container"), }, ...__VLS_functionalComponentArgsRest(__VLS_71));
                        ({}({ ...{}, content: ("全部下载"), teleport: (".online-gallery-top-container"), }));
                        {
                            const __VLS_75 = {}.VarButton;
                            const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({ ...{ 'onClick': {}, }, size: ("normal"), type: ("primary"), }));
                            ({}.VarButton);
                            ({}.VarButton);
                            const __VLS_77 = __VLS_76({ ...{ 'onClick': {}, }, size: ("normal"), type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_76));
                            ({}({ ...{ 'onClick': {}, }, size: ("normal"), type: ("primary"), }));
                            let __VLS_80 = { 'click': __VLS_pickEvent(__VLS_79['click'], {}.onClick) };
                            __VLS_80 = { click: (__VLS_ctx.checkAll) };
                            {
                                const __VLS_81 = {}.VarIcon;
                                const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({ ...{}, name: ("download"), }));
                                ({}.VarIcon);
                                const __VLS_83 = __VLS_82({ ...{}, name: ("download"), }, ...__VLS_functionalComponentArgsRest(__VLS_82));
                                ({}({ ...{}, name: ("download"), }));
                                const __VLS_84 = __VLS_pickFunctionalComponentCtx(__VLS_81, __VLS_83);
                            }
                            (__VLS_78.slots).default;
                            const __VLS_78 = __VLS_pickFunctionalComponentCtx(__VLS_75, __VLS_77);
                            let __VLS_79;
                        }
                        (__VLS_73.slots).default;
                        const __VLS_73 = __VLS_pickFunctionalComponentCtx(__VLS_70, __VLS_72);
                    }
                    {
                        const __VLS_86 = {}.VarTooltip;
                        const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({ ...{}, content: ("选中下载"), teleport: (".online-gallery-top-container"), }));
                        ({}.VarTooltip);
                        ({}.VarTooltip);
                        const __VLS_88 = __VLS_87({ ...{}, content: ("选中下载"), teleport: (".online-gallery-top-container"), }, ...__VLS_functionalComponentArgsRest(__VLS_87));
                        ({}({ ...{}, content: ("选中下载"), teleport: (".online-gallery-top-container"), }));
                        {
                            const __VLS_91 = {}.VarBadge;
                            const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({ ...{}, type: ("info"), offsetY: ((4)), style: ({}), hidden: ((!__VLS_ctx.checkedCardList.length)), value: ((__VLS_ctx.checkedCardList.length)), }));
                            ({}.VarBadge);
                            ({}.VarBadge);
                            const __VLS_93 = __VLS_92({ ...{}, type: ("info"), offsetY: ((4)), style: ({}), hidden: ((!__VLS_ctx.checkedCardList.length)), value: ((__VLS_ctx.checkedCardList.length)), }, ...__VLS_functionalComponentArgsRest(__VLS_92));
                            ({}({ ...{}, type: ("info"), offsetY: ((4)), style: ({}), hidden: ((!__VLS_ctx.checkedCardList.length)), value: ((__VLS_ctx.checkedCardList.length)), }));
                            {
                                const __VLS_96 = {}.VarButton;
                                const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({ ...{ 'onClick': {}, }, size: ("normal"), type: ("primary"), }));
                                ({}.VarButton);
                                ({}.VarButton);
                                const __VLS_98 = __VLS_97({ ...{ 'onClick': {}, }, size: ("normal"), type: ("primary"), }, ...__VLS_functionalComponentArgsRest(__VLS_97));
                                ({}({ ...{ 'onClick': {}, }, size: ("normal"), type: ("primary"), }));
                                let __VLS_101 = { 'click': __VLS_pickEvent(__VLS_100['click'], {}.onClick) };
                                __VLS_101 = { click: (__VLS_ctx.inverseAll) };
                                {
                                    const __VLS_102 = {}.VarIcon;
                                    const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({ ...{}, name: ("download-outline"), }));
                                    ({}.VarIcon);
                                    const __VLS_104 = __VLS_103({ ...{}, name: ("download-outline"), }, ...__VLS_functionalComponentArgsRest(__VLS_103));
                                    ({}({ ...{}, name: ("download-outline"), }));
                                    const __VLS_105 = __VLS_pickFunctionalComponentCtx(__VLS_102, __VLS_104);
                                }
                                (__VLS_99.slots).default;
                                const __VLS_99 = __VLS_pickFunctionalComponentCtx(__VLS_96, __VLS_98);
                                let __VLS_100;
                            }
                            (__VLS_94.slots).default;
                            const __VLS_94 = __VLS_pickFunctionalComponentCtx(__VLS_91, __VLS_93);
                        }
                        (__VLS_89.slots).default;
                        const __VLS_89 = __VLS_pickFunctionalComponentCtx(__VLS_86, __VLS_88);
                    }
                    (__VLS_68.slots).default;
                    const __VLS_68 = __VLS_pickFunctionalComponentCtx(__VLS_65, __VLS_67);
                }
                (__VLS_63.slots).default;
                const __VLS_63 = __VLS_pickFunctionalComponentCtx(__VLS_60, __VLS_62);
            }
            {
                const __VLS_107 = {}.VSheet;
                const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({ ...{}, class: ("gallery-container-control-panel filter-control-panel"), elevation: ((0)), width: ((200)), }));
                ({}.VSheet);
                ({}.VSheet);
                const __VLS_109 = __VLS_108({ ...{}, class: ("gallery-container-control-panel filter-control-panel"), elevation: ((0)), width: ((200)), }, ...__VLS_functionalComponentArgsRest(__VLS_108));
                ({}({ ...{}, class: ("gallery-container-control-panel filter-control-panel"), elevation: ((0)), width: ((200)), }));
                {
                    const __VLS_112 = {}.VRangeSlider;
                    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({ ...{ 'onEnd': {}, }, class: ("filter-input-slider"), label: ("宽度"), modelValue: ((__VLS_ctx.filters.size.width)), color: ("primary"), density: ("compact"), rounded: (true), hideDetails: (true), step: ("1"), max: ((__VLS_ctx.cardStore.info.size.width[1])), min: ((__VLS_ctx.cardStore.info.size.width[0])), ripple: ((false)), }));
                    ({}.VRangeSlider);
                    ({}.VRangeSlider);
                    const __VLS_114 = __VLS_113({ ...{ 'onEnd': {}, }, class: ("filter-input-slider"), label: ("宽度"), modelValue: ((__VLS_ctx.filters.size.width)), color: ("primary"), density: ("compact"), rounded: (true), hideDetails: (true), step: ("1"), max: ((__VLS_ctx.cardStore.info.size.width[1])), min: ((__VLS_ctx.cardStore.info.size.width[0])), ripple: ((false)), }, ...__VLS_functionalComponentArgsRest(__VLS_113));
                    ({}({ ...{ 'onEnd': {}, }, class: ("filter-input-slider"), label: ("宽度"), modelValue: ((__VLS_ctx.filters.size.width)), color: ("primary"), density: ("compact"), rounded: (true), hideDetails: (true), step: ("1"), max: ((__VLS_ctx.cardStore.info.size.width[1])), min: ((__VLS_ctx.cardStore.info.size.width[0])), ripple: ((false)), }));
                    let __VLS_117 = { 'end': __VLS_pickEvent(__VLS_116['end'], {}.onEnd) };
                    __VLS_117 = { end: $event => {
                            __VLS_ctx.filterChange('width', $event);
                            // @ts-ignore
                            [state, getCards, clear, checkAll, inverseAll, cancel, checkAll, checkedCardList, checkedCardList, inverseAll, filters, cardStore, cardStore, filterChange,];
                        }
                    };
                    {
                        const __VLS_118 = __VLS_intrinsicElements["template"];
                        const __VLS_119 = __VLS_elementAsFunctionalComponent(__VLS_118);
                        const __VLS_120 = __VLS_119({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_119));
                        ({}({ ...{}, }));
                        {
                            (__VLS_115.slots).label;
                            {
                                const __VLS_122 = {}.VLabel;
                                const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({ ...{}, class: ("input-slider-label"), }));
                                ({}.VLabel);
                                ({}.VLabel);
                                const __VLS_124 = __VLS_123({ ...{}, class: ("input-slider-label"), }, ...__VLS_functionalComponentArgsRest(__VLS_123));
                                ({}({ ...{}, class: ("input-slider-label"), }));
                                (__VLS_125.slots).default;
                                const __VLS_125 = __VLS_pickFunctionalComponentCtx(__VLS_122, __VLS_124);
                            }
                        }
                    }
                    {
                        const __VLS_127 = __VLS_intrinsicElements["template"];
                        const __VLS_128 = __VLS_elementAsFunctionalComponent(__VLS_127);
                        const __VLS_129 = __VLS_128({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_128));
                        ({}({ ...{}, }));
                        {
                            (__VLS_115.slots).prepend;
                            {
                                const __VLS_131 = {}.VTextField;
                                const __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({ ...{}, class: ("filter-input-number"), modelValue: ((__VLS_ctx.filters.size.width[0])), type: ("number"), variant: ("plain"), disabled: (true), hideDetails: (true), }));
                                ({}.VTextField);
                                ({}.VTextField);
                                const __VLS_133 = __VLS_132({ ...{}, class: ("filter-input-number"), modelValue: ((__VLS_ctx.filters.size.width[0])), type: ("number"), variant: ("plain"), disabled: (true), hideDetails: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_132));
                                ({}({ ...{}, class: ("filter-input-number"), modelValue: ((__VLS_ctx.filters.size.width[0])), type: ("number"), variant: ("plain"), disabled: (true), hideDetails: (true), }));
                                const __VLS_134 = __VLS_pickFunctionalComponentCtx(__VLS_131, __VLS_133);
                            }
                            // @ts-ignore
                            [filters,];
                        }
                    }
                    {
                        const __VLS_136 = __VLS_intrinsicElements["template"];
                        const __VLS_137 = __VLS_elementAsFunctionalComponent(__VLS_136);
                        const __VLS_138 = __VLS_137({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_137));
                        ({}({ ...{}, }));
                        {
                            (__VLS_115.slots).append;
                            {
                                const __VLS_140 = {}.VTextField;
                                const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({ ...{}, class: ("filter-input-number"), modelValue: ((__VLS_ctx.filters.size.width[1])), type: ("number"), variant: ("plain"), disabled: (true), hideDetails: (true), }));
                                ({}.VTextField);
                                ({}.VTextField);
                                const __VLS_142 = __VLS_141({ ...{}, class: ("filter-input-number"), modelValue: ((__VLS_ctx.filters.size.width[1])), type: ("number"), variant: ("plain"), disabled: (true), hideDetails: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_141));
                                ({}({ ...{}, class: ("filter-input-number"), modelValue: ((__VLS_ctx.filters.size.width[1])), type: ("number"), variant: ("plain"), disabled: (true), hideDetails: (true), }));
                                const __VLS_143 = __VLS_pickFunctionalComponentCtx(__VLS_140, __VLS_142);
                            }
                            // @ts-ignore
                            [filters,];
                        }
                    }
                    const __VLS_115 = __VLS_pickFunctionalComponentCtx(__VLS_112, __VLS_114);
                    let __VLS_116;
                }
                {
                    const __VLS_145 = {}.VRangeSlider;
                    const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({ ...{ 'onEnd': {}, }, class: ("filter-input-slider"), label: ("高度"), modelValue: ((__VLS_ctx.filters.size.height)), color: ("primary"), density: ("comfortable"), rounded: (true), hideDetails: (true), step: ("1"), max: ((__VLS_ctx.cardStore.info.size.height[1])), min: ((__VLS_ctx.cardStore.info.size.height[0])), ripple: ((false)), }));
                    ({}.VRangeSlider);
                    ({}.VRangeSlider);
                    const __VLS_147 = __VLS_146({ ...{ 'onEnd': {}, }, class: ("filter-input-slider"), label: ("高度"), modelValue: ((__VLS_ctx.filters.size.height)), color: ("primary"), density: ("comfortable"), rounded: (true), hideDetails: (true), step: ("1"), max: ((__VLS_ctx.cardStore.info.size.height[1])), min: ((__VLS_ctx.cardStore.info.size.height[0])), ripple: ((false)), }, ...__VLS_functionalComponentArgsRest(__VLS_146));
                    ({}({ ...{ 'onEnd': {}, }, class: ("filter-input-slider"), label: ("高度"), modelValue: ((__VLS_ctx.filters.size.height)), color: ("primary"), density: ("comfortable"), rounded: (true), hideDetails: (true), step: ("1"), max: ((__VLS_ctx.cardStore.info.size.height[1])), min: ((__VLS_ctx.cardStore.info.size.height[0])), ripple: ((false)), }));
                    let __VLS_150 = { 'end': __VLS_pickEvent(__VLS_149['end'], {}.onEnd) };
                    __VLS_150 = { end: $event => {
                            __VLS_ctx.filterChange('height', $event);
                            // @ts-ignore
                            [filters, cardStore, cardStore, filterChange,];
                        }
                    };
                    {
                        const __VLS_151 = __VLS_intrinsicElements["template"];
                        const __VLS_152 = __VLS_elementAsFunctionalComponent(__VLS_151);
                        const __VLS_153 = __VLS_152({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_152));
                        ({}({ ...{}, }));
                        {
                            (__VLS_148.slots).label;
                            {
                                const __VLS_155 = {}.VLabel;
                                const __VLS_156 = __VLS_asFunctionalComponent(__VLS_155, new __VLS_155({ ...{}, class: ("input-slider-label"), }));
                                ({}.VLabel);
                                ({}.VLabel);
                                const __VLS_157 = __VLS_156({ ...{}, class: ("input-slider-label"), }, ...__VLS_functionalComponentArgsRest(__VLS_156));
                                ({}({ ...{}, class: ("input-slider-label"), }));
                                (__VLS_158.slots).default;
                                const __VLS_158 = __VLS_pickFunctionalComponentCtx(__VLS_155, __VLS_157);
                            }
                        }
                    }
                    {
                        const __VLS_160 = __VLS_intrinsicElements["template"];
                        const __VLS_161 = __VLS_elementAsFunctionalComponent(__VLS_160);
                        const __VLS_162 = __VLS_161({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_161));
                        ({}({ ...{}, }));
                        {
                            (__VLS_148.slots).prepend;
                            {
                                const __VLS_164 = {}.VTextField;
                                const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({ ...{}, class: ("filter-input-number"), modelValue: ((__VLS_ctx.filters.size.height[0])), type: ("number"), variant: ("plain"), disabled: (true), hideDetails: (true), }));
                                ({}.VTextField);
                                ({}.VTextField);
                                const __VLS_166 = __VLS_165({ ...{}, class: ("filter-input-number"), modelValue: ((__VLS_ctx.filters.size.height[0])), type: ("number"), variant: ("plain"), disabled: (true), hideDetails: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_165));
                                ({}({ ...{}, class: ("filter-input-number"), modelValue: ((__VLS_ctx.filters.size.height[0])), type: ("number"), variant: ("plain"), disabled: (true), hideDetails: (true), }));
                                const __VLS_167 = __VLS_pickFunctionalComponentCtx(__VLS_164, __VLS_166);
                            }
                            // @ts-ignore
                            [filters,];
                        }
                    }
                    {
                        const __VLS_169 = __VLS_intrinsicElements["template"];
                        const __VLS_170 = __VLS_elementAsFunctionalComponent(__VLS_169);
                        const __VLS_171 = __VLS_170({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_170));
                        ({}({ ...{}, }));
                        {
                            (__VLS_148.slots).append;
                            {
                                const __VLS_173 = {}.VTextField;
                                const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({ ...{}, class: ("filter-input-number"), modelValue: ((__VLS_ctx.filters.size.height[1])), type: ("number"), variant: ("plain"), disabled: (true), hideDetails: (true), }));
                                ({}.VTextField);
                                ({}.VTextField);
                                const __VLS_175 = __VLS_174({ ...{}, class: ("filter-input-number"), modelValue: ((__VLS_ctx.filters.size.height[1])), type: ("number"), variant: ("plain"), disabled: (true), hideDetails: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_174));
                                ({}({ ...{}, class: ("filter-input-number"), modelValue: ((__VLS_ctx.filters.size.height[1])), type: ("number"), variant: ("plain"), disabled: (true), hideDetails: (true), }));
                                const __VLS_176 = __VLS_pickFunctionalComponentCtx(__VLS_173, __VLS_175);
                            }
                            // @ts-ignore
                            [filters,];
                        }
                    }
                    const __VLS_148 = __VLS_pickFunctionalComponentCtx(__VLS_145, __VLS_147);
                    let __VLS_149;
                }
                (__VLS_110.slots).default;
                const __VLS_110 = __VLS_pickFunctionalComponentCtx(__VLS_107, __VLS_109);
            }
            (__VLS_8.slots).default;
            const __VLS_8 = __VLS_pickFunctionalComponentCtx(__VLS_5, __VLS_7);
        }
        (__VLS_3.slots).default;
        const __VLS_3 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
    }
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses["gallery-container-toolbar"];
        __VLS_styleScopedClasses["gallery-container-control-panel"];
        __VLS_styleScopedClasses["control-button-group"];
        __VLS_styleScopedClasses["gallery-container-control-panel"];
        __VLS_styleScopedClasses["control-button-group"];
        __VLS_styleScopedClasses["gallery-container-control-panel"];
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
            cardStore: cardStore,
            state: state,
            filters: filters,
            checkedCardList: checkedCardList,
            getCards: getCards,
            filterChange: filterChange,
            checkAll: checkAll,
            inverseAll: inverseAll,
            cancel: cancel,
            clear: clear,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});

import { ref, reactive, computed, watch } from "vue";
import WaterFallList from "@/components/base/waterfall-list.vue"; // 瀑布流组件
import BaseVirtualScrollbar from "@/components/base/base-virtual-scrollbar.vue";
import GalleryCard from "./gallery-card.vue";
import { useCardStore } from "@/stores";
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const cardStore = useCardStore();
// 卡片列表
const cardList = computed(() => {
    return cardStore.filteredCardList;
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
    __VLS_components.GalleryCard;
    __VLS_components.GalleryCard;
    // @ts-ignore
    [GalleryCard,];
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
                            const __VLS_20 = {}.GalleryCard;
                            const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({ ...{ 'onChange:selected': {}, }, data: ((item)), }));
                            ({}.GalleryCard);
                            const __VLS_22 = __VLS_21({ ...{ 'onChange:selected': {}, }, data: ((item)), }, ...__VLS_functionalComponentArgsRest(__VLS_21));
                            ({}({ ...{ 'onChange:selected': {}, }, data: ((item)), }));
                            let __VLS_25 = { 'change:selected': __VLS_pickEvent(__VLS_24['change:selected'], {}['onChange:selected']) };
                            __VLS_25 = { "change:selected": $event => {
                                    item.isSelected = $event;
                                    // @ts-ignore
                                    [cardList,];
                                }
                            };
                            const __VLS_23 = __VLS_pickFunctionalComponentCtx(__VLS_20, __VLS_22);
                            let __VLS_24;
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
    }
    var __VLS_slots;
    return __VLS_slots;
}
const __VLS_internalComponent = (await import('vue')).defineComponent({
    setup() {
        return {
            WaterFallList: WaterFallList,
            BaseVirtualScrollbar: BaseVirtualScrollbar,
            GalleryCard: GalleryCard,
            cardList: cardList,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});

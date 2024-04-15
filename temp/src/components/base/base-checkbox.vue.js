import { defineProps, withDefaults, computed, defineEmits } from "vue";
import IconCheckboxBlank from "@svg/checkbox-blank-circle-outline.svg";
import IconCheckboxChecked from "@svg/check-circle.svg";
const { defineSlots, defineExpose, defineModel, defineOptions, } = await import('vue');
const props = withDefaults(defineProps(), {
    checked: false,
});
const emits = defineEmits();
const isChecked = computed({
    get() {
        return props.checked;
    },
    set(val) {
        emits("change", val);
    },
});
const __VLS_withDefaultsArg = (function (t) { return t; })({
    checked: false,
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
    __VLS_components.Transition;
    __VLS_components.Transition;
    __VLS_components.Transition;
    __VLS_components.Transition;
    // @ts-ignore
    [Transition, Transition,];
    __VLS_components.VarButton;
    __VLS_components.varButton;
    __VLS_components.VarButton;
    __VLS_components.varButton;
    __VLS_components.VarButton;
    __VLS_components.varButton;
    __VLS_components.VarButton;
    __VLS_components.varButton;
    // @ts-ignore
    [VarButton, VarButton, VarButton, VarButton,];
    __VLS_components.IconCheckboxBlank;
    __VLS_components.IconCheckboxBlank;
    // @ts-ignore
    [IconCheckboxBlank,];
    __VLS_components.IconCheckboxChecked;
    __VLS_components.IconCheckboxChecked;
    // @ts-ignore
    [IconCheckboxChecked,];
    {
        const __VLS_0 = __VLS_intrinsicElements["div"];
        const __VLS_1 = __VLS_elementAsFunctionalComponent(__VLS_0);
        const __VLS_2 = __VLS_1({ ...{ 'onClick': {}, }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        ({}({ ...{ 'onClick': {}, }, }));
        let __VLS_5 = { 'click': __VLS_pickEvent(__VLS_4['click'], {}.onClick) };
        __VLS_5 = { click: $event => {
                __VLS_ctx.isChecked = !__VLS_ctx.isChecked;
                // @ts-ignore
                [isChecked, isChecked,];
            }
        };
        {
            const __VLS_6 = {}.Transition;
            const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({ ...{}, appear: (true), }));
            ({}.Transition);
            ({}.Transition);
            const __VLS_8 = __VLS_7({ ...{}, appear: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_7));
            ({}({ ...{}, appear: (true), }));
            if (!__VLS_ctx.isChecked) {
                {
                    const __VLS_11 = {}.VarButton;
                    const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({ ...{}, type: ((__VLS_ctx.isChecked ? 'success' : 'default')), iconContainer: (true), round: (true), }));
                    ({}.VarButton);
                    ({}.VarButton);
                    const __VLS_13 = __VLS_12({ ...{}, type: ((__VLS_ctx.isChecked ? 'success' : 'default')), iconContainer: (true), round: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_12));
                    ({}({ ...{}, type: ((__VLS_ctx.isChecked ? 'success' : 'default')), iconContainer: (true), round: (true), }));
                    {
                        const __VLS_16 = {}.IconCheckboxBlank;
                        const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({ ...{}, class: ("card-checkbox-icon"), style: ({}), }));
                        ({}.IconCheckboxBlank);
                        const __VLS_18 = __VLS_17({ ...{}, class: ("card-checkbox-icon"), style: ({}), }, ...__VLS_functionalComponentArgsRest(__VLS_17));
                        ({}({ ...{}, class: ("card-checkbox-icon"), style: ({}), }));
                        const __VLS_19 = __VLS_pickFunctionalComponentCtx(__VLS_16, __VLS_18);
                    }
                    (__VLS_14.slots).default;
                    const __VLS_14 = __VLS_pickFunctionalComponentCtx(__VLS_11, __VLS_13);
                }
                // @ts-ignore
                [isChecked, isChecked,];
            }
            else {
                {
                    const __VLS_21 = {}.VarButton;
                    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({ ...{}, type: ((__VLS_ctx.isChecked ? 'success' : 'default')), iconContainer: (true), round: (true), }));
                    ({}.VarButton);
                    ({}.VarButton);
                    const __VLS_23 = __VLS_22({ ...{}, type: ((__VLS_ctx.isChecked ? 'success' : 'default')), iconContainer: (true), round: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_22));
                    ({}({ ...{}, type: ((__VLS_ctx.isChecked ? 'success' : 'default')), iconContainer: (true), round: (true), }));
                    {
                        const __VLS_26 = {}.IconCheckboxChecked;
                        const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({ ...{}, class: ("card-checkbox-icon"), style: ({}), }));
                        ({}.IconCheckboxChecked);
                        const __VLS_28 = __VLS_27({ ...{}, class: ("card-checkbox-icon"), style: ({}), }, ...__VLS_functionalComponentArgsRest(__VLS_27));
                        ({}({ ...{}, class: ("card-checkbox-icon"), style: ({}), }));
                        const __VLS_29 = __VLS_pickFunctionalComponentCtx(__VLS_26, __VLS_28);
                    }
                    (__VLS_24.slots).default;
                    const __VLS_24 = __VLS_pickFunctionalComponentCtx(__VLS_21, __VLS_23);
                }
                // @ts-ignore
                [isChecked,];
            }
            (__VLS_9.slots).default;
            const __VLS_9 = __VLS_pickFunctionalComponentCtx(__VLS_6, __VLS_8);
        }
        (__VLS_3.slots).default;
        const __VLS_3 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2);
        let __VLS_4;
    }
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses["card-checkbox-icon"];
        __VLS_styleScopedClasses["card-checkbox-icon"];
    }
    var __VLS_slots;
    return __VLS_slots;
}
const __VLS_internalComponent = (await import('vue')).defineComponent({
    setup() {
        return {
            IconCheckboxBlank: IconCheckboxBlank,
            IconCheckboxChecked: IconCheckboxChecked,
            isChecked: isChecked,
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

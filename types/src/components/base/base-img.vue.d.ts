export type returnInfo = {
    meta: {
        valid: boolean;
        width: number;
        height: number;
        aspectRatio: number;
        [key: string]: any;
    };
    dom?: HTMLImageElement;
    load?: Function;
};
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToOption<{
    src: string;
    initWidth?: number | undefined;
    initHeight?: number | undefined;
    useThumb?: boolean | undefined;
    thumb?: string | undefined;
    thumbMaxSize?: number | undefined;
    viewportDom?: Element | Document | null | undefined;
    viewRootMargin?: string | undefined;
    observerOnce?: boolean | undefined;
    manualControl?: boolean | undefined;
    draggable?: boolean | undefined;
}>, {
    src: string;
    initWidth: number;
    initHeight: number;
    useThumb: boolean;
    thumb: string;
    thumbMaxSize: number;
    viewportDom: null;
    viewRootMargin: string;
    observerOnce: boolean;
    manualControl: boolean;
    draggable: boolean;
}>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    loaded: (info: returnInfo) => void;
    error: () => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<{
    src: string;
    initWidth?: number | undefined;
    initHeight?: number | undefined;
    useThumb?: boolean | undefined;
    thumb?: string | undefined;
    thumbMaxSize?: number | undefined;
    viewportDom?: Element | Document | null | undefined;
    viewRootMargin?: string | undefined;
    observerOnce?: boolean | undefined;
    manualControl?: boolean | undefined;
    draggable?: boolean | undefined;
}>, {
    src: string;
    initWidth: number;
    initHeight: number;
    useThumb: boolean;
    thumb: string;
    thumbMaxSize: number;
    viewportDom: null;
    viewRootMargin: string;
    observerOnce: boolean;
    manualControl: boolean;
    draggable: boolean;
}>>> & {
    onError?: (() => any) | undefined;
    onLoaded?: ((info: returnInfo) => any) | undefined;
}, {
    src: string;
    initWidth: number;
    initHeight: number;
    useThumb: boolean;
    thumb: string;
    thumbMaxSize: number;
    viewportDom: Element | Document | null;
    viewRootMargin: string;
    observerOnce: boolean;
    manualControl: boolean;
    draggable: boolean;
}, {}>, {
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithDefaults<P, D> = {
    [K in keyof Pick<P, keyof P>]: K extends keyof D ? __VLS_Prettify<P[K] & {
        default: D[K];
    }> : P[K];
};
type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToOption<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};

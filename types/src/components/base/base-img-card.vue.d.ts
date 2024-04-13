declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToOption<{
    data: any;
    imgUrl: string;
    useThumb?: boolean | undefined;
    imgThumb?: string | undefined;
    backgroundColor?: string | undefined;
    layout?: "default" | "absolute" | undefined;
}>, {
    data: {};
    imgUrl: string;
    useThumb: boolean;
    imgThumb: string;
    backgroundColor: string;
    layout: string;
}>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    error: (...args: any[]) => void;
    loaded: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<{
    data: any;
    imgUrl: string;
    useThumb?: boolean | undefined;
    imgThumb?: string | undefined;
    backgroundColor?: string | undefined;
    layout?: "default" | "absolute" | undefined;
}>, {
    data: {};
    imgUrl: string;
    useThumb: boolean;
    imgThumb: string;
    backgroundColor: string;
    layout: string;
}>>> & {
    onError?: ((...args: any[]) => any) | undefined;
    onLoaded?: ((...args: any[]) => any) | undefined;
}, {
    data: any;
    useThumb: boolean;
    imgUrl: string;
    imgThumb: string;
    backgroundColor: string;
    layout: "default" | "absolute";
}, {}>, {
    default?(_: {
        data: any;
        src: string;
        thumb: string;
    }): any;
    header?(_: {
        data: any;
    }): any;
    footer?(_: {
        data: any;
    }): any;
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

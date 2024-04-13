import type { BaseCard } from "@/stores/cardStore/interface/base-card";
interface IData extends BaseCard {
    url: string;
    thumb: string;
    [K: keyof BaseCard]: any;
}
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToOption<{
    data: IData[];
    keyProp?: string | undefined;
    itemPadding?: string | number | undefined;
    itemBaseWidth?: number | undefined;
    sizeMap?: {
        [key: number]: {
            columns: number;
        };
    } | undefined;
    loading?: boolean | undefined;
}>, {
    data: () => IData[];
    keyProp: string;
    itemPadding: string;
    itemBaseWidth: number;
    sizeMap: () => {
        1280: {
            columns: number;
        };
        1100: {
            columns: number;
        };
        720: {
            columns: number;
        };
        380: {
            columns: number;
        };
        0: {
            columns: number;
        };
    };
    loading: boolean;
}>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<{
    data: IData[];
    keyProp?: string | undefined;
    itemPadding?: string | number | undefined;
    itemBaseWidth?: number | undefined;
    sizeMap?: {
        [key: number]: {
            columns: number;
        };
    } | undefined;
    loading?: boolean | undefined;
}>, {
    data: () => IData[];
    keyProp: string;
    itemPadding: string;
    itemBaseWidth: number;
    sizeMap: () => {
        1280: {
            columns: number;
        };
        1100: {
            columns: number;
        };
        720: {
            columns: number;
        };
        380: {
            columns: number;
        };
        0: {
            columns: number;
        };
    };
    loading: boolean;
}>>>, {
    data: IData[];
    loading: boolean;
    keyProp: string;
    itemPadding: string | number;
    itemBaseWidth: number;
    sizeMap: {
        [key: number]: {
            columns: number;
        };
    };
}, {}>, {
    default?(_: {
        item: {
            [x: string]: any;
            id?: string | undefined;
            description: {
                [x: string]: any;
                title: string;
                content?: string | undefined;
                dom: HTMLElement | null;
                url?: string | undefined;
                host?: string | undefined;
            };
            preview: {
                [x: string]: any;
                dom: HTMLElement | null;
                meta?: {
                    [x: string]: any;
                    valid: boolean;
                    width: number;
                    height: number;
                    aspectRatio?: number | undefined;
                    type?: "audio" | "html" | "video" | "image" | null | undefined;
                    size?: number | undefined;
                    ext?: string | undefined;
                } | undefined;
                blob?: {
                    readonly size: number;
                    readonly type: string;
                    arrayBuffer: () => Promise<ArrayBuffer>;
                    slice: (start?: number | undefined, end?: number | undefined, contentType?: string | undefined) => Blob;
                    stream: () => ReadableStream<Uint8Array>;
                    text: () => Promise<string>;
                } | undefined;
                url: string;
                host?: string | undefined;
            };
            source: {
                [x: string]: any;
                originUrls?: string[] | undefined;
                dom: HTMLElement | null;
                meta?: {
                    [x: string]: any;
                    valid: boolean;
                    width: number;
                    height: number;
                    aspectRatio?: number | undefined;
                    type?: "audio" | "html" | "video" | "image" | null | undefined;
                    size?: number | undefined;
                    ext?: string | undefined;
                } | undefined;
                blob?: {
                    readonly size: number;
                    readonly type: string;
                    arrayBuffer: () => Promise<ArrayBuffer>;
                    slice: (start?: number | undefined, end?: number | undefined, contentType?: string | undefined) => Blob;
                    stream: () => ReadableStream<Uint8Array>;
                    text: () => Promise<string>;
                } | undefined;
                url: string;
                host?: string | undefined;
            };
            isMatch: boolean;
            isSelected: boolean;
            isLoaded: boolean;
        };
        index: number;
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

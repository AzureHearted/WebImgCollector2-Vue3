declare const _default: import("pinia").StoreDefinition<"cardStore", import("pinia")._UnwrapAll<Pick<{
    data: {
        cardList: {
            readonly id: string;
            source: {
                [x: string]: any;
                originUrls?: string[] | undefined;
                dom: HTMLElement | null;
                meta: {
                    [x: string]: any;
                    valid: boolean;
                    width: number;
                    height: number;
                    aspectRatio?: number | undefined;
                    type?: "image" | "video" | "audio" | "html" | null | undefined;
                    size?: number | undefined;
                    ext?: string | undefined;
                };
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
            preview: {
                [x: string]: any;
                dom: HTMLElement | null;
                meta: {
                    [x: string]: any;
                    valid: boolean;
                    width: number;
                    height: number;
                    aspectRatio?: number | undefined;
                    type?: "image" | "video" | "audio" | "html" | null | undefined;
                    size?: number | undefined;
                    ext?: string | undefined;
                };
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
            description: {
                [x: string]: any;
                title: string;
                content?: string | undefined;
                dom: HTMLElement | null;
                url?: string | undefined;
                host?: string | undefined;
            };
            isMatch: boolean;
            isLoaded: boolean;
            isSelected: boolean;
            setPreviewBlob: (blob: Blob) => void;
            setSourceBlob: (blob: Blob) => void;
            setDescription: (description: import("./interface").CardDescription) => void;
            setPreview: (preview: import("./interface").CardPreview) => void;
            setSource: (source: import("./interface").CardSource & {
                originUrls?: string[] | undefined;
            }) => void;
        }[];
        urlSet: Set<string> & Omit<Set<string>, keyof Set<any>>;
        domSet: Set<HTMLElement> & Omit<Set<HTMLElement>, keyof Set<any>>;
        excludeIdSet: Set<string> & Omit<Set<string>, keyof Set<any>>;
    };
    info: {
        size: {
            width: [number, number];
            height: [number, number];
        };
    };
    filters: {
        size: {
            width: [number, number];
            height: [number, number];
        };
    };
    validCardList: import("vue").ComputedRef<{
        readonly id: string;
        source: {
            [x: string]: any;
            originUrls?: string[] | undefined;
            dom: HTMLElement | null;
            meta: {
                [x: string]: any;
                valid: boolean;
                width: number;
                height: number;
                aspectRatio?: number | undefined;
                type?: "image" | "video" | "audio" | "html" | null | undefined;
                size?: number | undefined;
                ext?: string | undefined;
            };
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
        preview: {
            [x: string]: any;
            dom: HTMLElement | null;
            meta: {
                [x: string]: any;
                valid: boolean;
                width: number;
                height: number;
                aspectRatio?: number | undefined;
                type?: "image" | "video" | "audio" | "html" | null | undefined;
                size?: number | undefined;
                ext?: string | undefined;
            };
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
        description: {
            [x: string]: any;
            title: string;
            content?: string | undefined;
            dom: HTMLElement | null;
            url?: string | undefined;
            host?: string | undefined;
        };
        isMatch: boolean;
        isLoaded: boolean;
        isSelected: boolean;
        setPreviewBlob: (blob: Blob) => void;
        setSourceBlob: (blob: Blob) => void;
        setDescription: (description: import("./interface").CardDescription) => void;
        setPreview: (preview: import("./interface").CardPreview) => void;
        setSource: (source: import("./interface").CardSource & {
            originUrls?: string[] | undefined;
        }) => void;
    }[]>;
    filteredCardList: import("vue").ComputedRef<{
        readonly id: string;
        source: {
            [x: string]: any;
            originUrls?: string[] | undefined;
            dom: HTMLElement | null;
            meta: {
                [x: string]: any;
                valid: boolean;
                width: number;
                height: number;
                aspectRatio?: number | undefined;
                type?: "image" | "video" | "audio" | "html" | null | undefined;
                size?: number | undefined;
                ext?: string | undefined;
            };
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
        preview: {
            [x: string]: any;
            dom: HTMLElement | null;
            meta: {
                [x: string]: any;
                valid: boolean;
                width: number;
                height: number;
                aspectRatio?: number | undefined;
                type?: "image" | "video" | "audio" | "html" | null | undefined;
                size?: number | undefined;
                ext?: string | undefined;
            };
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
        description: {
            [x: string]: any;
            title: string;
            content?: string | undefined;
            dom: HTMLElement | null;
            url?: string | undefined;
            host?: string | undefined;
        };
        isMatch: boolean;
        isLoaded: boolean;
        isSelected: boolean;
        setPreviewBlob: (blob: Blob) => void;
        setSourceBlob: (blob: Blob) => void;
        setDescription: (description: import("./interface").CardDescription) => void;
        setPreview: (preview: import("./interface").CardPreview) => void;
        setSource: (source: import("./interface").CardSource & {
            originUrls?: string[] | undefined;
        }) => void;
    }[]>;
    getPageCard: () => Promise<void>;
    clearCardList: () => void;
    removeCard: (id: string) => void;
    downloadCards: (ids: string[]) => Promise<void>;
}, "data" | "info" | "filters">>, Pick<{
    data: {
        cardList: {
            readonly id: string;
            source: {
                [x: string]: any;
                originUrls?: string[] | undefined;
                dom: HTMLElement | null;
                meta: {
                    [x: string]: any;
                    valid: boolean;
                    width: number;
                    height: number;
                    aspectRatio?: number | undefined;
                    type?: "image" | "video" | "audio" | "html" | null | undefined;
                    size?: number | undefined;
                    ext?: string | undefined;
                };
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
            preview: {
                [x: string]: any;
                dom: HTMLElement | null;
                meta: {
                    [x: string]: any;
                    valid: boolean;
                    width: number;
                    height: number;
                    aspectRatio?: number | undefined;
                    type?: "image" | "video" | "audio" | "html" | null | undefined;
                    size?: number | undefined;
                    ext?: string | undefined;
                };
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
            description: {
                [x: string]: any;
                title: string;
                content?: string | undefined;
                dom: HTMLElement | null;
                url?: string | undefined;
                host?: string | undefined;
            };
            isMatch: boolean;
            isLoaded: boolean;
            isSelected: boolean;
            setPreviewBlob: (blob: Blob) => void;
            setSourceBlob: (blob: Blob) => void;
            setDescription: (description: import("./interface").CardDescription) => void;
            setPreview: (preview: import("./interface").CardPreview) => void;
            setSource: (source: import("./interface").CardSource & {
                originUrls?: string[] | undefined;
            }) => void;
        }[];
        urlSet: Set<string> & Omit<Set<string>, keyof Set<any>>;
        domSet: Set<HTMLElement> & Omit<Set<HTMLElement>, keyof Set<any>>;
        excludeIdSet: Set<string> & Omit<Set<string>, keyof Set<any>>;
    };
    info: {
        size: {
            width: [number, number];
            height: [number, number];
        };
    };
    filters: {
        size: {
            width: [number, number];
            height: [number, number];
        };
    };
    validCardList: import("vue").ComputedRef<{
        readonly id: string;
        source: {
            [x: string]: any;
            originUrls?: string[] | undefined;
            dom: HTMLElement | null;
            meta: {
                [x: string]: any;
                valid: boolean;
                width: number;
                height: number;
                aspectRatio?: number | undefined;
                type?: "image" | "video" | "audio" | "html" | null | undefined;
                size?: number | undefined;
                ext?: string | undefined;
            };
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
        preview: {
            [x: string]: any;
            dom: HTMLElement | null;
            meta: {
                [x: string]: any;
                valid: boolean;
                width: number;
                height: number;
                aspectRatio?: number | undefined;
                type?: "image" | "video" | "audio" | "html" | null | undefined;
                size?: number | undefined;
                ext?: string | undefined;
            };
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
        description: {
            [x: string]: any;
            title: string;
            content?: string | undefined;
            dom: HTMLElement | null;
            url?: string | undefined;
            host?: string | undefined;
        };
        isMatch: boolean;
        isLoaded: boolean;
        isSelected: boolean;
        setPreviewBlob: (blob: Blob) => void;
        setSourceBlob: (blob: Blob) => void;
        setDescription: (description: import("./interface").CardDescription) => void;
        setPreview: (preview: import("./interface").CardPreview) => void;
        setSource: (source: import("./interface").CardSource & {
            originUrls?: string[] | undefined;
        }) => void;
    }[]>;
    filteredCardList: import("vue").ComputedRef<{
        readonly id: string;
        source: {
            [x: string]: any;
            originUrls?: string[] | undefined;
            dom: HTMLElement | null;
            meta: {
                [x: string]: any;
                valid: boolean;
                width: number;
                height: number;
                aspectRatio?: number | undefined;
                type?: "image" | "video" | "audio" | "html" | null | undefined;
                size?: number | undefined;
                ext?: string | undefined;
            };
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
        preview: {
            [x: string]: any;
            dom: HTMLElement | null;
            meta: {
                [x: string]: any;
                valid: boolean;
                width: number;
                height: number;
                aspectRatio?: number | undefined;
                type?: "image" | "video" | "audio" | "html" | null | undefined;
                size?: number | undefined;
                ext?: string | undefined;
            };
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
        description: {
            [x: string]: any;
            title: string;
            content?: string | undefined;
            dom: HTMLElement | null;
            url?: string | undefined;
            host?: string | undefined;
        };
        isMatch: boolean;
        isLoaded: boolean;
        isSelected: boolean;
        setPreviewBlob: (blob: Blob) => void;
        setSourceBlob: (blob: Blob) => void;
        setDescription: (description: import("./interface").CardDescription) => void;
        setPreview: (preview: import("./interface").CardPreview) => void;
        setSource: (source: import("./interface").CardSource & {
            originUrls?: string[] | undefined;
        }) => void;
    }[]>;
    getPageCard: () => Promise<void>;
    clearCardList: () => void;
    removeCard: (id: string) => void;
    downloadCards: (ids: string[]) => Promise<void>;
}, "validCardList" | "filteredCardList">, Pick<{
    data: {
        cardList: {
            readonly id: string;
            source: {
                [x: string]: any;
                originUrls?: string[] | undefined;
                dom: HTMLElement | null;
                meta: {
                    [x: string]: any;
                    valid: boolean;
                    width: number;
                    height: number;
                    aspectRatio?: number | undefined;
                    type?: "image" | "video" | "audio" | "html" | null | undefined;
                    size?: number | undefined;
                    ext?: string | undefined;
                };
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
            preview: {
                [x: string]: any;
                dom: HTMLElement | null;
                meta: {
                    [x: string]: any;
                    valid: boolean;
                    width: number;
                    height: number;
                    aspectRatio?: number | undefined;
                    type?: "image" | "video" | "audio" | "html" | null | undefined;
                    size?: number | undefined;
                    ext?: string | undefined;
                };
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
            description: {
                [x: string]: any;
                title: string;
                content?: string | undefined;
                dom: HTMLElement | null;
                url?: string | undefined;
                host?: string | undefined;
            };
            isMatch: boolean;
            isLoaded: boolean;
            isSelected: boolean;
            setPreviewBlob: (blob: Blob) => void;
            setSourceBlob: (blob: Blob) => void;
            setDescription: (description: import("./interface").CardDescription) => void;
            setPreview: (preview: import("./interface").CardPreview) => void;
            setSource: (source: import("./interface").CardSource & {
                originUrls?: string[] | undefined;
            }) => void;
        }[];
        urlSet: Set<string> & Omit<Set<string>, keyof Set<any>>;
        domSet: Set<HTMLElement> & Omit<Set<HTMLElement>, keyof Set<any>>;
        excludeIdSet: Set<string> & Omit<Set<string>, keyof Set<any>>;
    };
    info: {
        size: {
            width: [number, number];
            height: [number, number];
        };
    };
    filters: {
        size: {
            width: [number, number];
            height: [number, number];
        };
    };
    validCardList: import("vue").ComputedRef<{
        readonly id: string;
        source: {
            [x: string]: any;
            originUrls?: string[] | undefined;
            dom: HTMLElement | null;
            meta: {
                [x: string]: any;
                valid: boolean;
                width: number;
                height: number;
                aspectRatio?: number | undefined;
                type?: "image" | "video" | "audio" | "html" | null | undefined;
                size?: number | undefined;
                ext?: string | undefined;
            };
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
        preview: {
            [x: string]: any;
            dom: HTMLElement | null;
            meta: {
                [x: string]: any;
                valid: boolean;
                width: number;
                height: number;
                aspectRatio?: number | undefined;
                type?: "image" | "video" | "audio" | "html" | null | undefined;
                size?: number | undefined;
                ext?: string | undefined;
            };
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
        description: {
            [x: string]: any;
            title: string;
            content?: string | undefined;
            dom: HTMLElement | null;
            url?: string | undefined;
            host?: string | undefined;
        };
        isMatch: boolean;
        isLoaded: boolean;
        isSelected: boolean;
        setPreviewBlob: (blob: Blob) => void;
        setSourceBlob: (blob: Blob) => void;
        setDescription: (description: import("./interface").CardDescription) => void;
        setPreview: (preview: import("./interface").CardPreview) => void;
        setSource: (source: import("./interface").CardSource & {
            originUrls?: string[] | undefined;
        }) => void;
    }[]>;
    filteredCardList: import("vue").ComputedRef<{
        readonly id: string;
        source: {
            [x: string]: any;
            originUrls?: string[] | undefined;
            dom: HTMLElement | null;
            meta: {
                [x: string]: any;
                valid: boolean;
                width: number;
                height: number;
                aspectRatio?: number | undefined;
                type?: "image" | "video" | "audio" | "html" | null | undefined;
                size?: number | undefined;
                ext?: string | undefined;
            };
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
        preview: {
            [x: string]: any;
            dom: HTMLElement | null;
            meta: {
                [x: string]: any;
                valid: boolean;
                width: number;
                height: number;
                aspectRatio?: number | undefined;
                type?: "image" | "video" | "audio" | "html" | null | undefined;
                size?: number | undefined;
                ext?: string | undefined;
            };
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
        description: {
            [x: string]: any;
            title: string;
            content?: string | undefined;
            dom: HTMLElement | null;
            url?: string | undefined;
            host?: string | undefined;
        };
        isMatch: boolean;
        isLoaded: boolean;
        isSelected: boolean;
        setPreviewBlob: (blob: Blob) => void;
        setSourceBlob: (blob: Blob) => void;
        setDescription: (description: import("./interface").CardDescription) => void;
        setPreview: (preview: import("./interface").CardPreview) => void;
        setSource: (source: import("./interface").CardSource & {
            originUrls?: string[] | undefined;
        }) => void;
    }[]>;
    getPageCard: () => Promise<void>;
    clearCardList: () => void;
    removeCard: (id: string) => void;
    downloadCards: (ids: string[]) => Promise<void>;
}, "getPageCard" | "clearCardList" | "removeCard" | "downloadCards">>;
export default _default;

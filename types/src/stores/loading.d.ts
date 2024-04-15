declare const _default: import("pinia").StoreDefinition<"loadingStore", import("pinia")._UnwrapAll<Pick<{
    loading: import("vue").Ref<boolean>;
    current: import("vue").Ref<number>;
    total: import("vue").Ref<number>;
    start: (_total?: number) => void;
    update: (_current: number, _total?: number) => void;
    updatePercent: (percent: number, _total?: number) => void;
    end: () => void;
}, "loading" | "current" | "total">>, Pick<{
    loading: import("vue").Ref<boolean>;
    current: import("vue").Ref<number>;
    total: import("vue").Ref<number>;
    start: (_total?: number) => void;
    update: (_current: number, _total?: number) => void;
    updatePercent: (percent: number, _total?: number) => void;
    end: () => void;
}, never>, Pick<{
    loading: import("vue").Ref<boolean>;
    current: import("vue").Ref<number>;
    total: import("vue").Ref<number>;
    start: (_total?: number) => void;
    update: (_current: number, _total?: number) => void;
    updatePercent: (percent: number, _total?: number) => void;
    end: () => void;
}, "start" | "update" | "updatePercent" | "end">>;
export default _default;

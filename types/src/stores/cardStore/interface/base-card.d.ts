export interface BaseCard extends BaseState {
    id?: string;
    name?: string;
    description: CardDescription;
    preview: CardPreview;
    source: CardSource;
    [key: string]: any;
}
export interface BaseState {
    isMatch: boolean;
    isSelected: boolean;
    isLoaded: boolean;
}
export interface BaseMeta {
    valid: boolean;
    width: number;
    height: number;
    aspectRatio?: number;
    type?: "image" | "video" | "audio" | "html" | null;
    size?: number;
    ext?: string;
    [key: string]: any;
}
export interface BaseLink {
    url: string;
    host?: string;
}
export interface CardSource extends BaseLink {
    originUrls?: string[];
    dom: HTMLElement | null;
    meta: BaseMeta;
    blob?: Blob;
    [key: string]: any;
}
export interface CardPreview extends BaseLink {
    dom: HTMLElement | null;
    meta: BaseMeta;
    blob?: Blob;
    [key: string]: any;
}
export interface CardDescription extends Partial<BaseLink> {
    title: string;
    content?: string;
    dom: HTMLElement | null;
    [key: string]: any;
}

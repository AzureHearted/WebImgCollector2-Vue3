import type { BaseCard, CardDescription, CardPreview, CardSource, BaseState } from "../interface";
export type ICard = Partial<BaseCard> & BaseState;
export default class Card implements ICard {
    readonly id: string;
    source: CardSource;
    preview: CardPreview;
    description: CardDescription;
    isMatch: boolean;
    isLoaded: boolean;
    isSelected: boolean;
    constructor(source?: CardSource, preview?: CardPreview, description?: CardDescription);
    setPreviewBlob(blob: Blob): void;
    setSourceBlob(blob: Blob): void;
    setDescription(description: CardDescription): void;
    setPreview(preview: CardPreview): void;
    setSource(source: CardSource & {
        originUrls?: string[];
    }): void;
}

import type { MatchRule } from "../interface/match-rule";
import type { BaseMeta } from "../interface";
import Card from "../class/Card";
export default function getCard(rule: MatchRule, onAllDOMGet?: (doms: HTMLElement[]) => Promise<HTMLElement[]>, // 用于给用户过滤dom
onCardGet?: (card: Card, index: number, dom: HTMLElement | null, addCard: () => Promise<void>) => Promise<void>): Promise<Card[]>;
export declare function getImgMetaByImage(url: string): Promise<BaseMeta>;
export declare function getImgMetaByBlob(blob: Blob): Promise<BaseMeta>;

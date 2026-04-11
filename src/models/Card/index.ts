import type { Card } from "./Card";
import type { Meta } from "./Meta";
export * from "./Card";
export * from "./FavoriteCard";
export * from "./Meta";

// t 卡片类型
export type CardType = "all" | Meta["type"];

// t 卡片分组类型
export type CardGroup<T extends CardType = CardType, R extends Card = Card> = {
	[key in T]: R[];
};

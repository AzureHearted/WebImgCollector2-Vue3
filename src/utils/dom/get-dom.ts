// 获取Dom元素
type optionsType = {
	mode: "all" | "first" | "last";
	regionDOM: HTMLElement | Document;
};

// 函数重载
export default function getDOM(
	selector: keyof HTMLElementTagNameMap,
	options?: Partial<optionsType>
): HTMLElement[] | HTMLElement | null;
export default function getDOM(
	selector: string,
	options?: Partial<optionsType>
): HTMLElement[] | HTMLElement | null;
export default function getDOM(
	selector: keyof HTMLElementTagNameMap | string,
	options?: Partial<optionsType>
): HTMLElement[] | HTMLElement | null {
	// 默认选项
	const defaultOptions: optionsType = {
		mode: "first",
		regionDOM: document,
	};
	// 合并选项
	const { mode, regionDOM } = { ...defaultOptions, ...options };
	// 选择器为空则返回空值
	if (!selector) {
		if (mode === "all") {
			return [] as HTMLElement[];
		} else {
			return null;
		}
	}
	// 获取dom
	const doms = regionDOM.querySelectorAll(selector);
	// console.log("selector", selector, "doms", doms);
	// 判断返回结果
	switch (mode) {
		case "all":
			// 返回所有匹配的元素数组
			return (doms.length ? Array.from(doms) : []) as HTMLElement[];
		case "first":
			// 返回第一个匹配的元素
			return doms.length ? (doms[0] as HTMLElement) : null;
		case "last":
			// 返回最后一个匹配的元素
			return doms.length ? (doms[doms.length - 1] as HTMLElement) : null;
	}
}

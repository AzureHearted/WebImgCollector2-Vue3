import { Card, Meta, Pattern } from "@/models";
import type { BaseFix, Rule } from "@/models/Rule/interface/Rule";
import {
	getDOM,
	getDOMInfo,
	getExtByUrl,
	getHTMLDocumentFromUrl,
	getNameByUrl,
	isUrl,
	safeDecodeURI,
} from "@/utils";
import { getDOMMeta, inferUrlType } from "./get-meta";

// 配置接口
interface Options {
	// 要排除的祖先选择器
	excludeParentSelectors?: string[];
}

/**
 * 获取卡片
 * @param rule 匹配规则
 * @param options 选项
 * @returns
 */
export async function getCurrentPageCard(pattern: Pattern, options: Options) {
	const { excludeParentSelectors } = options;
	const { rules } = pattern;
	const newItems: Card[] = [];
	const doms: HTMLElement[] = [];
	// 依次执行每个规则
	for (const rule of rules) {
		if (!rule.enable) continue;

		const {
			region: regionMatch,
			source: sourceMatch,
			preview: previewMatch,
			description: descriptionMatch,
		} = rule;

		if (regionMatch.enable) {
			// 开启区域匹配

			// 区域 DOM 元素列表
			let regionDOMs = getDOM(rule.region.selector, {
				mode: "all",
				excludeParentSelectors,
			});
			// 过滤无效值
			regionDOMs = regionDOMs.filter((x): x is HTMLElement => x != null); // ★ 修改：类型收窄，避免后续 undefined
			// 记录 DOM 元素
			doms.push(...regionDOMs);

			// 遍历区域 DOM 元素
			for (let i = 0; i < regionDOMs.length; i++) {
				const regionDOM = regionDOMs[i];

				const source: Card["source"] = {
					url: "",
					host: location.host,
					meta: new Meta(),
					dom: null,
				};
				let preview: Card["preview"] = {
					url: "",
					meta: new Meta(),
					dom: null,
				};
				let description: Card["description"] = { content: "", dom: null };

				// 获取 source 的 DOM 元素
				if (sourceMatch.selector.trim() !== "") {
					// 选择器不为空
					// ★ 修改：区域模式下，source selector 应相对 regionDOM 查询
					const [dom] = getDOM(sourceMatch.selector, {
						root: regionDOM,
					});
					source.dom = dom ?? regionDOM; // ★ 新增：兜底
				} else {
					// 选择器为空
					source.dom = regionDOM;
				}

				// 获取 preview 的 DOM 元素
				switch (previewMatch.origin) {
					case "custom":
						if (previewMatch.selector.trim() !== "") {
							// 选择器不为空
							// ★ 修改：相对 regionDOM 查询
							const [dom] = getDOM(previewMatch.selector, {
								root: regionDOM,
							});
							preview.dom = dom ?? source.dom; // ★ 新增兜底
						} else {
							// 选择器为空
							preview.dom = regionDOM;
						}
						break;
					case "region":
						preview.dom = regionDOM;
						break;
					case "source":
						preview.dom = source.dom;
						break;
				}

				// 获取 description 的 DOM 元素
				switch (descriptionMatch.origin) {
					case "custom":
						if (descriptionMatch.selector.trim() !== "") {
							// 选择器不为空
							// ★ 修改：相对 regionDOM 查询
							const [dom] = getDOM(descriptionMatch.selector, {
								root: regionDOM,
							});
							description.dom = dom ?? preview.dom; // ★ 新增兜底
						} else {
							// 选择器为空
							description.dom = regionDOM;
						}
						break;
					case "region":
						description.dom = regionDOM;
						break;
					case "source":
						description.dom = source.dom;
						break;
					case "preview":
						description.dom = preview.dom;
						break;
				}

				// 获取 source 的信息
				source.url = matchInfo(source.dom, sourceMatch);

				// ? 修正 source 的信息
				source.url = await fixResult(source.url, sourceMatch.fix);

				// 简单尝试通过DOM获取meta信息
				if (source.dom != null)
					source.meta = await getDOMMeta(source.dom, { url: source.url });

				// 推断类型
				try {
					if (rule.source.assertionType !== "auto") {
						source.meta.type = rule.source.assertionType;
					} else {
						if (!source.meta.valid || source.meta.type === "unknown")
							source.meta.type = inferUrlType(new URL(source.url));
					}
				} catch {}

				// 扩展名推断
				source.meta.ext = getExtByUrl(source.url);

				// 获取 preview 的信息
				if (previewMatch.enable) {
					// 启用了 preview 匹配
					preview.url = matchInfo(preview.dom, previewMatch);
				} else {
					// 未启用 preview 匹配
					preview = { ...source };
				}

				// ? 修正 preview 的信息
				preview.url = await fixResult(preview.url, previewMatch.fix);

				// 简单尝试通过DOM获取meta信息
				if (preview.dom != null)
					preview.meta = await getDOMMeta(preview.dom, { url: preview.url });

				// 推断类型
				try {
					if (rule.preview.assertionType !== "auto") {
						preview.meta.type = rule.preview.assertionType;
					} else {
						if (!preview.meta.valid || preview.meta.type === "unknown") {
							preview.meta.type = inferUrlType(new URL(preview.url));
						}
					}
				} catch {}

				preview.meta.ext = getExtByUrl(preview.url);

				// 获取 description 的信息
				if (descriptionMatch.enable) {
					// 启用了 description 匹配
					description.content = matchInfo(description.dom, descriptionMatch);
				} else {
					// 未启用 description 匹配
					const { url, ...remain } = source;
					description = { ...remain, content: url };
				}

				// ? 修正 description 的信息
				description.content = await fixResult(
					description.content,
					descriptionMatch.fix,
				);

				// 最后判断是否是链接，如果是链接则进行名称提取
				if (isUrl(description.content)) {
					description.content = getNameByUrl(description.content);
				}
				description.content = safeDecodeURI(description.content);

				// 设置 source 来源
				source.originUrls = [location.origin + location.pathname];

				const resource = new Card({ source, preview, description });

				resource.matchedRule = rule;

				// 记录结果
				newItems.push(resource);
			}
		} else {
			// 未开启区域匹配

			// 获取所有 source 的 DOM
			let sourceDOMs = getDOM(rule.source.selector, {
				mode: "all",
				excludeParentSelectors,
			});

			// 过滤无效值
			sourceDOMs = sourceDOMs.filter((x): x is HTMLElement => x != null); // ★ 修改：类型收窄
			// 记录 DOM 元素
			doms.push(...sourceDOMs);

			// 获取所有 preview 的 DOM
			let previewDOMs: (HTMLElement | null)[] = rule.preview.enable
				? getDOM(rule.preview.selector, { mode: "all" })
				: sourceDOMs;

			// 获取所有 description 的 DOM
			let descriptionDOMs: (HTMLElement | null)[] = rule.description.enable
				? getDOM(rule.description.selector, { mode: "all" })
				: sourceDOMs;

			// 将所有 DOM 类比长度统一成 sourceDOMs 的长度，因为它们应该是一一对应的。
			const maxLength = Math.max(
				sourceDOMs.length,
				previewDOMs.length,
				descriptionDOMs.length,
			);

			// 填充到最大长度，如果为空则用 null 填充。
			previewDOMs = fillArrayToLength(previewDOMs, maxLength, null);
			descriptionDOMs = fillArrayToLength(descriptionDOMs, maxLength, null);

			// 遍历所有 sourceDOM 获取卡片信息。
			for (let i = 0; i < sourceDOMs.length; i++) {
				const sourceDOM = sourceDOMs[i];
				const source: Card["source"] = {
					url: "",
					host: location.host,
					meta: new Meta(),
					dom: null,
				};
				let preview: Card["preview"] = {
					url: "",
					meta: new Meta(),
					dom: null,
				};
				let description: Card["description"] = { content: "", dom: null };

				// 获取 source 的信息
				source.url = matchInfo(sourceDOM, sourceMatch);
				// 简单尝试通过DOM获取meta信息
				if (source.dom != null)
					source.meta = await getDOMMeta(source.dom, { url: source.url });

				// ? 修正 source 的信息
				source.url = await fixResult(source.url, sourceMatch.fix);

				// 推断类型
				try {
					if (rule.source.assertionType !== "auto") {
						source.meta.type = rule.source.assertionType;
					} else {
						if (!source.meta.valid || source.meta.type === "unknown")
							source.meta.type = inferUrlType(new URL(source.url));
					}
				} catch {}

				// 扩展名推断
				source.meta.ext = getExtByUrl(source.url);

				// 获取 preview 的信息
				if (previewMatch.enable) {
					// 启用了 preview 匹配
					preview.url = matchInfo(
						previewDOMs[i] ?? sourceDOM, // ★ 修改：null 合理兜底
						previewMatch,
					);
				} else {
					// 未启用 preview 匹配
					preview = { ...source };
				}

				// ? 修正 preview 的信息
				preview.url = await fixResult(preview.url, previewMatch.fix);

				// 简单尝试通过DOM获取meta信息
				if (preview.dom != null)
					preview.meta = await getDOMMeta(preview.dom, { url: preview.url });

				// 推断类型
				try {
					if (rule.preview.assertionType !== "auto") {
						preview.meta.type = rule.preview.assertionType;
					} else {
						if (!preview.meta.valid || preview.meta.type === "unknown")
							preview.meta.type = inferUrlType(new URL(preview.url));
					}
				} catch {}

				// 扩展名推断
				preview.meta.ext = getExtByUrl(preview.url);

				// 获取 description 的信息
				if (descriptionMatch.enable) {
					// 启用了 description 匹配
					description.content = matchInfo(
						descriptionDOMs[i] ?? sourceDOM, // ★ 修改：null 合理兜底
						descriptionMatch,
					);
				} else {
					// 未启用 description 匹配
					const { url, ...remain } = source;
					description = { ...remain, content: url };
				}

				// ? 修正 description 的信息
				description.content = await fixResult(
					description.content,
					descriptionMatch.fix,
				);

				// 最后判断是否是链接，如果是链接则进行名称提取
				if (isUrl(description.content)) {
					description.content = getNameByUrl(description.content);
				}
				description.content = safeDecodeURI(description.content);

				// 设置 source 来源
				source.originUrls = [location.origin + location.pathname];

				const resource = new Card({ source, preview, description });

				resource.matchedRule = rule;

				// 记录结果
				newItems.push(resource);
			}
		}
	}

	return newItems;
}

// f 匹配信息
function matchInfo(
	dom: HTMLElement,
	matchRule: Rule["source"] | Rule["preview"] | Rule["description"],
) {
	// ★ 新增：兜底保护，防止异常 DOM 导致整体规则中断
	if (!dom) return "";

	switch (matchRule.infoType) {
		case "attribute":
			return getDOMInfo(dom, {
				type: matchRule.infoType,
				name: matchRule.name,
			});
		case "property":
			return getDOMInfo(dom, {
				type: matchRule.infoType,
				name: matchRule.name,
			});
		case "value":
		case "innerText":
		case "innerHTML":
		case "outerHTML":
			return getDOMInfo(dom, {
				type: matchRule.infoType,
			});
	}
}

// 修正结果
export async function fixResult(
	value: string,
	fixRules: BaseFix[],
): Promise<string> {
	for (let i = 0; i < fixRules.length; i++) {
		const fixRule = fixRules[i];
		const { type: fixType } = fixRule;
		if (fixType === "regex-replace" || fixType === "regex-extract") {
			// 尝试合成正则表达式
			const { expression } = fixRule;
			if (!expression.trim().length) continue; //如果表达式为空则跳过该规则
			const flags = [...new Set(["g", ...fixRule.flags])].join("");
			let regex: RegExp;
			try {
				regex = new RegExp(expression, flags);
			} catch (e) {
				console.error(e);
				continue; //如果失败则直接跳过该修正规则
			}
			// s 正则提取类型的修正
			if (fixType === "regex-extract") {
				const match = value.match(regex);
				// console.log("正则提取", value, regex, match);
				if (match) {
					value = match[0];
				}
			}
			// s 正则替换类型的修正
			if (fixType === "regex-replace") {
				// console.log("正则替换", value, regex, fixRule.replaceTo);
				value = value.replace(regex, fixRule.replaceTo);
			}
		} else if (fixType === "fetch-page-and-extract-content") {
			const { selector, infoType, name } = fixRule;
			// s 抓取页面并提取内容
			const doc = await getHTMLDocumentFromUrl(value);
			if (doc) {
				// console.log(`url:${value}\n获取到的Document对象`, doc.documentElement);
				const dom = getDOM(selector, {
					mode: "first",
					root: doc.documentElement,
				})[0];
				value = getDOMInfo(dom, { type: infoType, name });
				// console.log(`抓取页面并提取内容`, dom, value);
			}
		}
	}
	return value;
}

// 填充数组到指定长度，如果数组长度小于指定长度，则用value填充数组。
function fillArrayToLength<T>(
	array: (T | undefined | null)[],
	length: number,
	value: T | null,
): (T | null)[] {
	// 先对原数组中值为undefined和null的值进行替换，替换为value。
	const newArray = array.map((item) => (item ? item : value));
	// 如果数组长度已经大于或等于指定长度，则直接返回原始数组
	if (array.length >= length) {
		newArray;
	} else {
		// 计算需要添加的元素个数
		const elementsToAdd = length - newArray.length;
		// 循环添加元素到数组末尾
		for (let i = 0; i < elementsToAdd; i++) {
			newArray.push(value);
		}
	}
	return newArray;
}

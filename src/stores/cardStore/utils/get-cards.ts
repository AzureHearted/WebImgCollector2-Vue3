import { getDOM, getDOMInfo } from "@/utils/dom";
import type { BaseMatch, MatchRule } from "../interface/match-rule";
import type {
	BaseMeta,
	CardDescription,
	CardPreview,
	CardSource,
} from "../interface";
import Card from "../class/Card";

// 获取卡片
export default async function getCard(
	rule: MatchRule,
	// 当获取到所有DOM时的回调
	onAllDOMGet: (doms: HTMLElement[]) => Promise<HTMLElement[]> = async (doms) =>
		doms, // 用于给用户过滤dom
	// 每当有一个卡片获取到的时候的回调
	onCardGet: (
		card: Card,
		index: number,
		dom: HTMLElement | null,
		addCard: () => Promise<void>
	) => Promise<void> = async () => {}
) {
	// 卡片列表
	const cardList = [] as Card[];

	// 判断是否开启区域匹配
	if (rule.region.enable) {
		// ! 区域匹配模式
		// 区域DOM元素列表
		let regionDOMs = getDOM(rule.region.selector, {
			mode: "all",
		}) as HTMLElement[];

		// 触发回调(进行dom过滤)
		regionDOMs = await onAllDOMGet(regionDOMs);

		// 遍历所有区域dom，获取卡片dom列表
		for (let i = 0; i < regionDOMs.length; i++) {
			const regionDOM = regionDOMs[i]; // 拿到当前区域DOM

			// s source的匹配
			const source = await handleRegionGetInfo<CardSource>(
				rule.source,
				regionDOM,
				async (value, dom) => {
					dom = dom || regionDOM;
					// 元信息获取
					let meta = await getMeta(dom); // 获取元信息(通过dom)
					if (!meta.valid) {
						meta = await getMeta(value); // 获取元信息(通过可能是url的匹配结果)
					}
					return {
						url: value,
						// 如果sourceDOM不存在，则使用当前区域DOM作为sourceDOM。
						dom,
						meta,
					};
				}
			);
			// s preview的匹配
			let preview: CardPreview;
			// 判断是否启用匹配preview
			if (rule.preview.enable) {
				preview = await handleRegionGetInfo<CardPreview>(
					rule.preview,
					regionDOM,
					async (value, dom) => {
						// 如果sourceDOM不存在，则使用当前区域DOM作为sourceDOM。
						dom = dom || source.dom || regionDOM;
						// 如果preview.url为空，则尝试使用source.url作为preview.url，因为可能没有预览图，只有链接。
						value = value || source.url;
						// 元信息获取
						let meta = await getMeta(dom); // 获取元信息(通过dom)
						if (!meta.valid) {
							meta = await getMeta(value); // 获取元信息(通过可能是url的匹配结果)
						}
						return {
							url: value,
							dom,
							meta,
						};
					}
				);
			} else {
				// 如果不匹配就直接使用source
				preview = {
					url: source.url,
					dom: source.dom,
					meta: {
						...source.meta!,
					},
				};
			}

			// s description的匹配
			let description: CardDescription;
			if (rule.description.enable) {
				description = await handleRegionGetInfo<CardDescription>(
					rule.preview,
					regionDOM,
					async (value, dom) => {
						// 如果sourceDOM不存在，则使用当前区域DOM作为sourceDOM。
						dom = dom || source.dom || regionDOM || preview.dom;
						// 如果preview.url为空，则尝试使用source.url作为preview.url，因为可能没有预览图，只有链接。
						value = value || source.url || preview.url;
						return {
							title: value,
							dom,
						};
					}
				);
			} else {
				// 如果不匹配就直接使用source
				description = {
					title: source.url,
					dom: source.dom,
				};
			}

			// f 创建卡片
			const card = new Card(source, preview, description);

			// 触发回调
			onCardGet(card, i, regionDOM, async () => {
				// 传出函数用给外部判断是否要添加该卡片
				cardList.push(card);
			});
		}
	} else {
		// ! 全局匹配模式(先分别匹配source、preview、description，然后创建卡片)
		// 获取所有 sourceDOMs
		let sourceDOMs = getDOM(rule.source.selector, {
			mode: "all",
		}) as HTMLElement[];

		// 触发回调(进行dom过滤)
		sourceDOMs = await onAllDOMGet(sourceDOMs);

		// 获取所有 previewDOMs
		let previewDOMs = (
			rule.preview.enable
				? getDOM(rule.preview.selector, {
						mode: "all",
				  })
				: sourceDOMs
		) as (HTMLElement | null)[];
		// 获取所有 descriptionDOMs
		let descriptionDOMs = (
			rule.description.enable
				? getDOM(rule.description.selector, {
						mode: "all",
				  })
				: sourceDOMs
		) as (HTMLElement | null)[];

		// 将所有DOMs长度统一成sourceDOMs的长度，因为它们应该是一一对应的。
		const maxLength = Math.max(
			sourceDOMs.length,
			previewDOMs.length,
			descriptionDOMs.length
		);
		// 填充到最大长度，如果为空则用null填充。
		previewDOMs = fillArrayToLength(previewDOMs, maxLength, null);
		descriptionDOMs = fillArrayToLength(descriptionDOMs, maxLength, null);

		// 遍历所有sourceDOMs，获取卡片信息。
		for (let i = 0; i < sourceDOMs.length; i++) {
			const sourceDOM = sourceDOMs[i];
			// s 直接获取source信息
			const source: CardSource = {
				url: await getDOMInfo(
					sourceDOM,
					rule.source.infoType,
					rule.source.name
				),
				dom: sourceDOM,
				meta: { valid: false, width: 0, height: 0 }, // 初始化meta未一个无效值
			};
			// 获取source.meta
			// 先使用dom进行判断
			source.meta = await getMeta(source.dom as HTMLElement);
			if (!source.meta.valid) {
				// 如果无效在使用匹配到的内容判断
				source.meta = await getMeta(source.url);
			}

			// s 获取preview信息
			let preview: CardPreview;
			if (rule.preview.enable) {
				const previewDOM = previewDOMs[i] || sourceDOM;
				// 获取到基础信息
				preview = {
					url: await getDOMInfo(
						previewDOM,
						rule.preview.infoType,
						rule.preview.name
					),
					dom: previewDOM,
					meta: { valid: false, width: 0, height: 0 }, // 初始化meta未一个无效值
				};
				// 获取preview.meta
				// 先使用dom进行判断
				preview.meta = await getMeta(preview.dom as HTMLElement);
				if (!preview.meta.valid) {
					// 如果无效在使用匹配到的内容判断
					preview.meta = await getMeta(preview.url);
				}
			} else {
				preview = {
					url: source.url,
					dom: source.dom,
					meta: {
						...source.meta,
					},
				};
			}

			// s 获取description信息
			let description: CardDescription;
			if (rule.description.enable) {
				const descriptionDOM = descriptionDOMs[i] || sourceDOM;
				description = {
					title: await getDOMInfo(
						descriptionDOM,
						rule.description.infoType,
						rule.description.name
					),
					dom: descriptionDOM,
				};
			} else {
				description = {
					title: source.url,
					dom: source.dom,
				};
			}

			// 创建卡片
			const card = new Card(source, preview, description);

			// 触发回调
			onCardGet(card, i, source.dom, async () => {
				// 传出函数用给外部判断是否要添加该卡片
				cardList.push(card);
			});
		}
	}

	return cardList;
}

// 获取在region模式下信息的处理函数
async function handleRegionGetInfo<T>(
	rule: BaseMatch, // 规则对象
	regionDOM: HTMLElement = document.body, //区域DOM
	callback: (value: string, dom: HTMLElement | null) => Promise<T>
) {
	// 获取选择器
	const { selector, infoType, name } = rule;

	// 匹配DOM
	let matchDOM: HTMLElement | null;
	// 判断选择器是否为空
	if (!!selector && !!selector.trim().length) {
		// 如果不为空则正常使用选择器获取dom
		matchDOM = getDOM(selector, {
			regionDOM,
		}) as HTMLElement | null;
	} else {
		// 如果选择器为空，则使用当前区域DOM作为sourceDOM。
		matchDOM = regionDOM;
	}

	// 匹配信息
	let value: string = "";
	if (matchDOM) {
		value = await getDOMInfo(matchDOM, infoType, name);
	}

	// 调用其回调函数将结果以对象形式返回
	return await callback(value, matchDOM);
}

// 填充数组到指定长度，如果数组长度小于指定长度，则用value填充数组。
function fillArrayToLength<T>(
	array: (T | undefined | null)[],
	length: number,
	value: T | null
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

// 推断字符串是否是链接
function isUrl(str: string) {
	const regex = /^([^/]+?:)?\/\/[\w.,@?^=%&:/~+#-]+/i;
	let isUrl = false;
	if (regex.test(str)) {
		try {
			new URL(str);
			isUrl = true;
		} catch {
			isUrl = false;
		}
	}
	return isUrl;
}

// 获取元信息(根据传入的值类型判断获取方式)
async function getMeta(
	target: string | Blob | HTMLElement,
	method: "auto" | "byNaturalSize" | "byUrl" | "byBlob" = "auto"
) {
	let meta: BaseMeta = {
		valid: false,
		width: 0,
		height: 0,
	}; //设置一个初始空值
	if (method === "auto") {
		// s 安装优先级顺序一次尝试各种方式获取meta
		if (typeof target === "object" && target instanceof HTMLElement) {
			// console.log("获取元信息(类型:DOM元素)", target);
			// 如果只能是一个HTML元素
			const { width, height } = getDOMNaturalSize(target);
			meta = {
				valid: width > 0 && height > 0,
				width,
				height,
			};
		}
		if (!meta.valid && typeof target === "string" && isUrl(target)) {
			const url = new URL(target);
			// console.log("获取元信息(类型:链接)", url);
			// 如果是一个链接
			meta = await getMetaByUrl(url);
			// console.log("获取结果", target, meta);
		}
		if (!meta.valid && typeof target === "object" && target instanceof Blob) {
			// console.log("获取元信息(类型:Blob)", target);
			// 如果是一个Blob
			meta = await getMetaByBlob(target);
		}
	} else {
		// s 指定方式
		if (
			method === "byNaturalSize" &&
			typeof target === "object" &&
			target instanceof HTMLElement
		) {
			// 如果只能是一个HTML元素
			const { width, height } = getDOMNaturalSize(target);
			meta = {
				valid: width > 0 && height > 0,
				width,
				height,
			};
		} else if (
			method === "byUrl" &&
			typeof target === "string" &&
			isUrl(target)
		) {
			// 如果是一个链接
			meta = await getMetaByUrl(new URL(target));
		} else if (
			method === "byBlob" &&
			typeof target === "object" &&
			target instanceof Blob
		) {
			// 如果是一个Blob
			meta = await getMetaByBlob(target);
		} else {
			// 没有符合的匹配条件
			meta = {
				valid: false,
				width: 0,
				height: 0,
			};
		}
	}

	return meta;
}

// 获取元信息(通过url)
async function getMetaByUrl(url: URL) {
	// 先推断链接类型
	const type = inferUrlType(url);
	// console.log("链接类型==>", type);
	let meta: BaseMeta;
	if (type === "image") {
		// 处理图片类型
		meta = await getImgMetaByImage(url.href);
	} else {
		// 其他类型暂时不进行处理
		meta = {
			valid: false,
			width: 0,
			height: 0,
		};
	}
	return meta;
}

// 获取元信息(通过Blob对象)
async function getMetaByBlob(blob: Blob) {
	let meta: BaseMeta;
	// 先推断类型
	const blobType = inferBlobType(blob);
	// 判断主类型
	if (blobType.mainType === "image") {
		meta = await getMetaByBlob(blob);
	} else {
		// 其他类型暂不处理
		meta = {
			valid: false,
			width: 0,
			height: 0,
		};
	}
	return meta;
}

//f [功能封装]通过Image对象获取图片meta
export function getImgMetaByImage(url: string): Promise<BaseMeta> {
	if (!url || !url.trim().length) {
		console.log("链接无效", url);
		const errMeta: BaseMeta = {
			valid: false,
			width: 0,
			height: 0,
		};
		return Promise.resolve(errMeta);
	}
	let meta: BaseMeta;
	const img = new Image();
	img.src = url;
	return new Promise((resolve) => {
		if (img.complete) {
			// console.log("图片信息获取-->成功!");
			meta = {
				valid: true,
				width: img.width,
				height: img.height,
				aspectRatio: img.width / img.height,
			};
			resolve(meta);
		} else {
			img.addEventListener(
				"load",
				() => {
					// console.log("图片信息获取-->成功!");
					meta = {
						valid: true,
						width: img.width,
						height: img.height,
						aspectRatio: img.width / img.height,
					};
					resolve(meta);
				},
				{ once: true }
			);
			img.addEventListener(
				"error",
				() => {
					// console.log("图片信息获取-->失败!");
					meta = {
						valid: false,
						width: 0,
						height: 0,
					};
					resolve(meta);
				},
				{ once: true }
			);
		}
	});
}

//f [功能封装]通过blob获取图片meta
export function getImgMetaByBlob(blob: Blob): Promise<BaseMeta> {
	let meta: BaseMeta;
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.addEventListener(
			"load",
			() => {
				const image = new Image();
				image.src = (reader.result as string) || "";
				image.addEventListener("load", () => {
					meta = {
						valid: true,
						width: image.width,
						height: image.height,
						aspectRatio: image.width / image.height,
					};
					//s 释放内存
					URL.revokeObjectURL((reader.result as string) || "");
					resolve(meta);
				});
				image.addEventListener(
					"error",
					() => {
						meta = {
							valid: false,
							width: 0,
							height: 0,
						};
						//s 释放内存
						URL.revokeObjectURL((reader.result as string) || "");
						resolve(meta);
					},
					{ once: true }
				);
			},
			{ once: true }
		);
		reader.addEventListener("error", () => {
			meta = {
				valid: false,
				width: 0,
				height: 0,
			};
			resolve(meta);
		});
	});
}

// 获取DOM的natural尺寸
function getDOMNaturalSize(dom: HTMLElement) {
	let [width, height] = [0, 0]; // 初始化宽高为0
	// 判断是否是img、video或canvas,如果是就获取自然宽高
	if (dom instanceof HTMLImageElement) {
		const { naturalWidth, naturalHeight } = dom;
		width = naturalWidth;
		height = naturalHeight;
	} else if (dom instanceof HTMLVideoElement) {
		const { videoWidth, videoHeight } = dom;
		width = videoWidth;
		height = videoHeight;
	} else if (dom instanceof HTMLCanvasElement) {
		({ width, height } = dom);
	}
	return { width, height };
}

// 推断链接类型
function inferUrlType(url: URL) {
	// 推测链接类型
	const imageRegex = /(jpg|jpeg|png|gif|webp|bmp|icon|svg)/i;
	const videoRegex =
		/(mp4|avi|mov|mkv|mpeg|mpg|wmv|3gp|flv|f4v|rmvb|webm|ts|webp|ogv)/i;
	const audioRegex = /(mp3|wav|ogg|aac|flac)/i;

	// 默认标记类型为未确定
	let type: "image" | "video" | "html" | "audio" | null = null;
	const urlStr = url.origin + url.pathname; //只保留“源”和“路径”防止查询参数干扰
	// console.log("进行类型推断-->", urlStr);
	// 根据文件扩展名判断类型
	if (imageRegex.test(urlStr)) {
		type = "image";
	} else if (videoRegex.test(urlStr)) {
		type = "video";
	} else if (audioRegex.test(urlStr)) {
		type = "audio";
	} else {
		type = "html";
	}

	return type;
}

// 推测Blob类型
function inferBlobType(blob: Blob) {
	// 获取Blob的MIME类型，并判断是否为图片类型。
	type MainType = "image" | "video" | "audio" | "html";
	const [mainType, subType] = blob.type.split("/") as [MainType, string];
	return {
		mainType,
		subType,
	};
}

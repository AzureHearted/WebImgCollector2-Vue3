import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
// 导入类
import Card from "./class/Card";
import { TaskQueue } from "@/utils/taskQueue"; // 任务队列
// 导入工具
import getCard from "./utils/get-cards";
import { getBlobType, getExtByBlob, getNameByUrl } from "@/utils/common";
// 导入网络工具请求
import { getBlobByUrlAuto } from "@/utils/http";
// 导入打包和保存工具
import JSZip from "jszip";
import { saveAs } from "file-saver"; //* 用于原生浏览器"保存"来实现文件保存

// 导入其他仓库
import { useLoadingStore } from "@/stores";

import { ElNotification } from "@/plugin/element-plus";

export default defineStore("cardStore", () => {
	const loadingStore = useLoadingStore();

	// 数据定义
	const data = reactive({
		cardList: [] as Card[], //s 卡片列表
		// 所有匹配到的链接集合
		urlSet: new Set() as Set<string>,
		// 所有匹配到的dom集合
		domSet: new Set() as Set<HTMLElement>,
		// 所有被排除的卡片集合
		excludeIdSet: new Set() as Set<Card["id"]>,
		// 类型与数量的映射表
		typeMap: new Map<string, number>([]),
		// 扩展名与数量的映射表
		extensionMap: new Map<string, number>([]),
		// 记录所有链接与Blob的映射表
		urlBlobMap: new Map<string, Blob>(),
	});

	// 卡片数据信息定义，用于过滤。
	const info = reactive({
		size: {
			width: ref<[number, number]>([0, 2000]), //宽度范围
			height: ref<[number, number]>([0, 2000]), //高度范围
		},
	});

	// 过滤器
	const filters = reactive({
		size: {
			width: ref<[number, number]>([300, info.size.width[1]]), //宽度过滤器
			height: ref<[number, number]>([300, info.size.height[1]]), //高度过滤器
		},
		type: ref<string[]>(["image"]), //类型过滤器
		extension: ref<string[]>([]), //扩展名过滤器
	});

	// j 有效的卡片
	const validCardList = computed(() => {
		return data.cardList.filter((x) => !!x);
	});

	// j 过滤后的卡片
	const filteredCardList = computed(() => {
		// 后续添加处理逻辑，例如过滤、排序等操作。
		return data.cardList.filter((x) => {
			const isMatch =
				!!x && // 过滤排除
				!data.excludeIdSet.has(x.id) && // 过滤被排除的项
				(filters.type.length > 0
					? filters.type.includes(String(x.source.meta.type))
					: true) &&
				(filters.extension.length > 0
					? filters.extension.includes(String(x.source.meta.ext))
					: true) &&
				(x.source.meta.type === "image"
					? x.source.meta.width! >= filters.size.width[0] &&
					  x.source.meta.width! <= filters.size.width[1] &&
					  x.source.meta.height! >= filters.size.height[0] &&
					  x.source.meta.height! <= filters.size.height[1]
					: true);
			if (!isMatch) {
				// 如果不匹配的需要将选中状态设置为false
				x.isSelected = false;
				// console.log("未被选中");
			}
			return isMatch;
		});
	});

	// j 类型列表
	const typeOptions = computed(() => {
		const typeNameMap = new Map<string, string>([
			["image", "图片"],
			["video", "视频"],
			["audio", "音频"],
			["html", "网页"],
		]);
		const options = [...data.typeMap.keys()]
			.sort((a, b) => {
				// 降序排序
				return data.typeMap.get(b)! - data.typeMap.get(a)!;
			})
			.map((x) => {
				const label = typeNameMap.get(x);
				return {
					value: x,
					label: label ? label : x,
					count: data.typeMap.get(x),
				};
			});
		if (!options.length) {
			options.push({
				label: "图片",
				value: "image",
				count: 0,
			});
		}
		return options;
	});

	// j 扩展名列表
	const extensionOptions = computed(() => {
		return [...data.extensionMap.keys()]
			.sort((a, b) => {
				// 降序排序
				return data.extensionMap.get(b)! - data.extensionMap.get(a)!;
			})
			.map((x) => {
				return {
					value: x,
					label: x,
					count: data.extensionMap.get(x),
				};
			});
	});

	// 获取页面资源
	async function getPageCard() {
		loadingStore.start();
		ElNotification({
			title: "提示",
			message: "正在获取信息……",
			type: "info",
			appendTo: ".web-img-collector-notification-container",
		});
		// 记录开始前的cardList长度
		await getCard(
			// 规则配置
			{
				id: "###",
				name: "###",
				region: {
					enable: false,
					selector: "",
				},
				source: {
					selector:
						"a:has(img),[href*=\\.jpg],[href*=\\.png],[href*=\\.webp],[href*=\\.jpeg],img[data-src],img[src]",
					infoType: "attribute",
					name: "href|srcset|data-src|src",
				},
				preview: {
					origin: "source",
					enable: false,
					selector: "",
					infoType: "property",
					name: "src",
				},
				description: {
					origin: "source",
					enable: false,
					selector: "",
					infoType: "property",
					name: "src",
				},
				filter: {
					formats: [],
					width: [350, 2000] as [number, number],
					height: [350, 2000] as [number, number],
				},
				state: {
					editing: false,
				},
			},
			// 选项配置
			{
				// 当获取到所有基准dom时的回调
				onAllDOMGet: async (doms) => {
					// console.log("匹配到的DOM", doms);
					loadingStore.update(0, doms.length);
					return doms;
				},
				// 当获得卡片时的回调
				onCardGet: async (card, index, dom, addCard) => {
					loadingStore.current++;
					const sourceMeta = card.source.meta;
					// 判断该卡片中的链接是否已经存在于集合中，如果存在则不添加到卡片列表中。
					if (sourceMeta.valid && !data.urlSet.has(card.source.url)) {
						// console.log("新增卡片", card, dom);
						if (dom) {
							data.domSet.add(dom); // 记录dom用于排序
						}
						data.urlSet.add(card.source.url); // 添加到链接集合中
						// 如果类型存在则记录类型
						if (sourceMeta.type) {
							if (data.typeMap.has(sourceMeta.type)) {
								// 如果已经存在了就++
								data.typeMap.set(
									sourceMeta.type,
									data.typeMap.get(sourceMeta.type)! + 1
								);
							} else {
								data.typeMap.set(sourceMeta.type, 1);
							}
						}
						// 如果扩展名存在则记录扩展名
						if (sourceMeta.ext) {
							if (data.extensionMap.has(sourceMeta.ext)) {
								// 如果已经存在了就++
								data.extensionMap.set(
									sourceMeta.ext,
									data.extensionMap.get(sourceMeta.ext)! + 1
								);
							} else {
								data.extensionMap.set(sourceMeta.ext, 1);
							}
						}
						// (如果blob存在则)记录到url和blob的Map对象中
						if (card.source.blob) {
							data.urlBlobMap.set(card.source.url, card.source.blob);
						}
						// data.cardList.push(card); // 添加到卡片列表中。
						data.cardList[index] = card; // 添加到卡片列表中。
						updateMaxSize(sourceMeta.width, sourceMeta.height); // 更新最大宽高。
						await addCard(); //执行回调函数
					}
				},
				// 传入已有url和blob的map对象,用于防止重复发送请求
				existingUrlBlobMap: data.urlBlobMap,
			}
		);
		loadingStore.end();
	}

	// 更新最大宽高
	function updateMaxSize(
		width: number | undefined,
		height: number | undefined
	) {
		info.size.width[1] = Math.max(info.size.width[1], width ? width : 0); // 更新最大宽度。
		info.size.height[1] = Math.max(info.size.height[1], height ? height : 0); // 更新最大高度。
		filters.size.width[1] = info.size.width[1]; // 更新过滤器最大宽度。
		filters.size.height[1] = info.size.height[1]; // 更新过滤器最大宽度。
	}

	// 清空卡片
	function clearCardList() {
		data.urlSet.clear(); // 清空链接集合
		data.domSet.clear(); // 清空DOM集合
		data.excludeIdSet.clear(); //清空被排除卡片id集合
		data.typeMap.clear(); // 清空类型映射表
		data.extensionMap.clear(); // 清空扩展名映射表
		data.urlBlobMap.clear(); // 清空url和blob的Map对象
		data.cardList = []; // 清空卡片列表
		info.size.width = [0, 2000]; // 重置宽度范围。
		info.size.height = [0, 2000]; // 重置高度范围。
		filters.size.width = [350, 2000];
		filters.size.height = [350, 2000];
		filters.extension = [];
		filters.type = [];
	}

	// 移除卡片
	function removeCard(id: string) {
		data.excludeIdSet.add(id);
		return;
	}

	// 下载卡片
	async function downloadCards(ids: string[]) {
		if (!ids.length) return;
		// 先找到对应的卡片
		const cards = validCardList.value.filter((x) => ids.includes(x.id));
		if (cards.length === 1) {
			const card = cards[0];
			// 等于1的时候不打包，直接下载
			if (!card.source.blob) {
				// 如果没有blob先获取
				const blob = await getBlobByUrlAuto(card.description.title);
				if (blob) {
					card.source.blob = blob;
				}
			}
			let name = getNameByUrl(card.source.url);
			if (card.source.meta.type !== "html") {
				name = name + `.${card.source.meta.ext}`;
			}
			// 保存
			saveAs(card.source.blob!, name);
		} else {
			loadingStore.start(ids.length); // 开启进度条

			ElNotification({
				title: "提示",
				message: "开始下载……",
				type: "info",
				appendTo: ".web-img-collector-notification-container",
			});

			// 大于1的时候进行打包
			// 创建zip容器
			const zipContainer = new JSZip();
			// 创建任务队列实例
			const taskQueue = new TaskQueue({
				interval: 300,
				maxConcurrent: 6,
				// 每个任务处理完成时的回调
				onTaskComplete(_, completed) {
					loadingStore.update(completed);
				},
				// 所有任务处理完成时的回调
				async onAllTasksComplete() {
					ElNotification({
						title: "提示",
						message: "下载完成！正在打包……",
						type: "info",
						appendTo: ".web-img-collector-notification-container",
					});

					// console.log("全部处理完成", zipContainer);
					loadingStore.update(0, zipContainer.length);
					//s 生成压缩包
					// console.log("准备生成压缩包", zipContainer);
					const zip: Blob = await zipContainer.generateAsync(
						{
							type: "blob",
							compression: "DEFLATE",
						},
						// 压缩的进度回调
						(metadata) => {
							// console.log(`压缩进度：${metadata.percent.toFixed(2)}%`);
							loadingStore.updatePercent(metadata.percent * 0.01);
						}
					);
					// console.log("压缩包生成成功", zip);

					// 下载压缩包
					// 获取标题
					let zipName: string;
					const titles = [
						document.title,
						...[...document.querySelectorAll("h1")].map((dom) => dom.innerText),
						...[...document.querySelectorAll("title")].map(
							(dom) => dom.innerText
						),
					]
						.filter((title) => !!title && !!title.trim().length)
						.map((title) => title.replace("\\", "-").replace(",", "_"));
					if (titles.length) {
						zipName = titles[0]; // 如果标题获取成功就使用首个标题
					} else {
						zipName = getNameByUrl(decodeURI(location.href)); // 如果标题获取失败就直接使用href提取标题
					}

					// console.log("压缩包名称:", zipName);
					saveAs(zip, `${zipName}.zip`);

					ElNotification({
						title: "成功",
						message: "开始下载压缩包……",
						type: "success",
						appendTo: ".web-img-collector-notification-container",
					});
					loadingStore.end(); // 结束进度条
					// console.groupEnd();
				},
			});
			// 添加任务
			taskQueue.addTask(
				cards.map((card, i) => {
					return () =>
						new Promise<void | JSZip>((resolve) => {
							(async () => {
								if (!card.source.blob) {
									// 如果没有blob先获取
									const blob = await getBlobByUrlAuto(card.description.title);
									if (blob) {
										card.source.blob = blob;
									} else {
										// 如果获取失败就跳过
										resolve();
										return;
									}
									card.source.meta.type = getBlobType(card.source.blob);
									card.source.meta.ext = getExtByBlob(card.source.blob);
								}
								let name = getNameByUrl(card.source.url);
								if (card.source.meta.type !== "html") {
									name = name + `.${card.source.meta.ext}`;
								}
								// 将blob存入zip容器
								zipContainer.file(`${i} - ${name}`, card.source.blob);
								resolve(zipContainer);
							})();
						});
				})
			);
			// 运行队列
			taskQueue.run();
		}
	}

	return {
		data,
		info,
		filters,
		validCardList,
		filteredCardList,
		typeOptions,
		extensionOptions,
		getPageCard,
		clearCardList,
		removeCard,
		downloadCards,
	};
});

import Card from "@/stores/CardStore/class/Card";
import { isEqualUrl, mixSort } from "@/utils/common";
import localforage from "localforage";
import { defineStore } from "pinia";
import useCardStore from "@/stores/CardStore";
import { computed, reactive, ref } from "vue";

export default defineStore("FavoriteStore", () => {
	const cardStore = useCardStore();
	const { downloadCards } = cardStore;
	//s 基础信息
	const info = reactive({
		dbName: "WebImgCollector2",
		storeName: "favorite_card",
	});

	//s localforage仓库对象
	const store = ref(
		localforage.createInstance({
			driver: localforage.INDEXEDDB,
			name: info.dbName,
			storeName: info.storeName,
			description: "收藏的卡片数据",
		})
	);

	//s 过滤关键词
	const filterKeyword = ref("");

	//s 卡片数据列表
	const cardList = ref<Card[]>([]);

	//j 类型->数量映射列表
	const typeMap = computed<Map<string, number>>(() => {
		return cardList.value.reduce((prev, curr) => {
			const currType = curr.source.meta.type;
			if (!currType) return prev;
			if (prev.has(currType)) {
				prev.set(currType, prev.get(currType)! + 1);
			} else {
				prev.set(currType, 1);
			}
			return prev;
		}, new Map<string, number>());
	});

	//j 扩展名->数量映射列表
	const extensionMap = computed<Map<string, number>>(() => {
		return cardList.value.reduce((prev, curr) => {
			const currExt = curr.source.meta.ext;
			if (!currExt) return prev;
			if (prev.has(currExt)) {
				prev.set(currExt, prev.get(currExt)! + 1);
			} else {
				prev.set(currExt, 1);
			}
			return prev;
		}, new Map<string, number>());
	});

	//j 仓库尺寸范围
	const sizeRange = computed<{
		width: [number, number];
		height: [number, number];
		max: number;
		min: number;
	}>(() => {
		return cardList.value.reduce(
			(prev, curr) => {
				const { width, height } = curr.source.meta;
				if (prev.width[0] > width) prev.width[0] = width;
				if (prev.height[0] > height) prev.height[0] = height;
				if (prev.width[1] < width) prev.width[1] = width;
				if (prev.height[1] < height) prev.height[1] = height;
				prev.min = Math.min(prev.min, prev.width[0], prev.height[0]);
				prev.max = Math.max(prev.max, prev.width[1], prev.height[1]);
				return prev;
			},
			{
				width: [0, 2000],
				height: [0, 2000],
				min: 0,
				max: 2000,
			}
		);
	});

	//j 仓库中所有Key值列表
	const keys = computed(() => {
		return cardList.value.map((c) => c.id);
	});

	//j 选中的卡片列表
	const selectedCardList = computed<Card[]>(() => {
		return cardList.value.filter((c) => c.isSelected);
	});

	//s 过滤器
	const filters = reactive({
		type: [] as string[], //类型过滤器
		extension: [] as string[], //扩展名过滤器
		size: {
			width: [250, 2000] as [number, number], //宽度过滤器
			height: [250, 2000] as [number, number], //高度过滤器
			marks: computed(() => {
				const markStyle = reactive({
					"font-size": "10px !important",
					"margin-top": "0 !important",
					bottom: "5px",
				});
				const tempMarks = {
					360: {
						label: "360",
						style: markStyle,
					},
					720: {
						label: "720",
						style: {
							...markStyle,
							display: sizeRange.value.max / 720 < 3 ? "" : "none",
						},
					},
					1080: {
						label: "1080",
						style: {
							...markStyle,
							display: sizeRange.value.max / 1080 < 3 ? "" : "none",
						},
					},
					1920: {
						label: "1920",
						style: {
							...markStyle,
							display: sizeRange.value.max / 1920 < 3 ? "" : "none",
						},
					},
					2560: {
						label: "2560",
						style: {
							...markStyle,
							display: sizeRange.value.max / 2560 < 3 ? "" : "none",
						},
					},
					3840: {
						label: "3840",
						style: markStyle,
					},
					[`${sizeRange.value.max}`]: {
						label: `${sizeRange.value.max}`,
						style: {
							...markStyle,
							display: sizeRange.value.max > 1.8 * 3840 ? "" : "none",
						},
					},
				};
				return tempMarks;
			}),
		},
	});

	//j 类型选项列表
	const typeOptions = computed(() => {
		const typeNameMap = new Map<string, string>([
			["image", "图片"],
			["video", "视频"],
			["audio", "音频"],
			["html", "网页"],
		]);
		const options = [...typeMap.value.keys()]
			.sort((a, b) => {
				// 降序排序
				return typeMap.value.get(b)! - typeMap.value.get(a)!;
			})
			.map((x) => {
				const label = typeNameMap.get(x);
				return {
					value: x,
					label: label ? label : x,
					count: typeMap.value.get(x),
				};
			});
		return options;
	});

	//j 扩展名选项列
	const extensionOptions = computed(() => {
		return [...extensionMap.value.keys()]
			.sort((a, b) => {
				// 降序排序
				return extensionMap.value.get(b)! - extensionMap.value.get(a)!;
			})
			.map((x) => {
				return {
					value: x,
					label: x,
					count: extensionMap.value.get(x),
				};
			});
	});

	//s 排序相关
	const sortOptions = [
		{ value: "#", label: "默认排序", group: "#" },
		{ value: "name-asc", label: "名称-升序", group: "名称" },
		{ value: "name-desc", label: "名称-降序", group: "名称" },
		{ value: "width-asc", label: "宽度-升序", group: "尺寸" },
		{ value: "width-desc", label: "宽度-降序", group: "尺寸" },
		{ value: "height-asc", label: "高度-升序", group: "尺寸" },
		{ value: "height-desc", label: "高度-降序", group: "尺寸" },
	] as const; // 这里断言数组中的所有属性值为只读(为了能正确进行类型提示)
	type sortGroup = {
		type: "group";
		label: string;
		key: string;
		children: ((typeof sortOptions)[number] & { key: string })[];
	};
	//s 排序对象
	const sortInfo = reactive({
		method: "#" as (typeof sortOptions)[number]["value"],
		options: sortOptions,
		// (访问器)获取分组数组
		get groups(): sortGroup[] {
			return Object.values(
				this.options.reduce((prev, curr) => {
					if (!prev[curr.group]) {
						prev[curr.group] = {
							type: "group",
							key: curr.group,
							label: curr.group,
							children: [],
						};
					}
					prev[curr.group].children.push({
						...curr,
						key: curr.value,
					});
					return prev;
				}, <{ [key: string]: sortGroup }>{})
			);
		},
	});

	//j 初步过滤后的卡片列表
	const filterCardList = computed<{
		all: Card[];
		image: Card[];
		html: Card[];
		other: Card[];
	}>(() => {
		let matchList = cardList.value.filter((c) => {
			// console.log(c.source.meta.width, filters.size.width[1]);
			return (
				c.description.title
					.trim()
					.toLocaleLowerCase()
					.includes(filterKeyword.value.trim().toLocaleLowerCase()) &&
				// (filters.type.length > 0
				// 	? filters.type.includes(String(c.source.meta.type))
				// 	: true) &&
				(filters.extension.length > 0
					? filters.extension.includes(String(c.source.meta.ext))
					: true) &&
				(c.source.meta.type === "image"
					? c.source.meta.width >= filters.size.width[0] &&
					  c.source.meta.width <= filters.size.width[1] &&
					  c.source.meta.height <= filters.size.height[1] &&
					  c.source.meta.height >= filters.size.height[0]
					: true)
			);
		});
		// 排序
		if (sortInfo.method === "#") {
			matchList = matchList.sort((a, b) =>
				mixSort(
					a.source.originUrls ? a.source.originUrls[0] : "",
					b.source.originUrls ? b.source.originUrls[0] : ""
				)
			);
		} else if (sortInfo.method === "name-asc") {
			matchList = matchList.sort((a, b) =>
				mixSort(a.description.title, b.description.title)
			);
		} else if (sortInfo.method === "name-desc") {
			matchList = matchList.sort((a, b) =>
				mixSort(b.description.title, a.description.title)
			);
		} else if (sortInfo.method === "width-asc") {
			matchList = matchList.sort(
				(a, b) => a.source.meta.width - b.source.meta.width
			);
		} else if (sortInfo.method === "width-desc") {
			matchList = matchList.sort(
				(a, b) => b.source.meta.width - a.source.meta.width
			);
		} else if (sortInfo.method === "height-asc") {
			matchList = matchList.sort(
				(a, b) => a.source.meta.height - b.source.meta.height
			);
		} else if (sortInfo.method === "height-desc") {
			matchList = matchList.sort(
				(a, b) => b.source.meta.height - a.source.meta.height
			);
		}
		return {
			all: matchList,
			image: matchList.filter((c) => c.source.meta.type === "image"),
			html: matchList.filter((c) => c.source.meta.type === "html"),
			other: matchList.filter(
				(c) => c.source.meta.type !== "image" && c.source.meta.type !== "html"
			),
		};
	});

	//f 刷新仓库数据
	const refreshStore = async () => {
		cardList.value = await new Promise<Card[]>((resolve) => {
			const list: Card[] = [];
			store.value
				.iterate((value: any) => {
					const { id, source, preview, description } = value;
					list.push(
						new Card({ id, source, preview, description, isFavorite: true })
					);
				})
				.finally(() => {
					resolve(list);
				});
		});
	};

	//f 清空仓库数据
	const clearStore = async () => {
		await store.value.clear();
		refreshStore();
	};

	//f 添加卡片
	const addCard = async (cards: Card[]) => {
		// console.log(
		// 	"添加收藏",
		// 	cards,
		// 	cards.map((c) => c.id)
		// );
		for (const card of cards) {
			// 判断卡片是否已经存在
			if (!(await isExist(card))) {
				const rowCard = card.getRowData();
				rowCard.isFavorite = true;
				await store.value.setItem(card.id, rowCard);
				console.log("成功收藏卡片", card);
			} else {
				console.log("卡片已存在", card);
			}
		}
		refreshStore();
	};

	//f 更新卡片
	const updateCard = async (cards: Card[]) => {
		for (const card of cards) {
			// 先查找卡片在仓库的id
			const id = await findCardId(
				(c) =>
					isEqualUrl(c.source.url, card.source.url, { excludeSearch: true }) &&
					isEqualUrl(c.preview.url, card.preview.url, { excludeSearch: true })
			);
			if (!id) continue; //如果id无效就跳过该卡片的更新
			const rowCard = card.getRowData(); // 获取不带ID的未加工数据
			await store.value.setItem(id, rowCard);
			console.log("成功更新卡片", card);
		}
		refreshStore();
	};

	//f 删除卡片
	const deleteCard = async (cards: Card[]) => {
		for (const card of cards) {
			// 先查找卡片在仓库的id
			const id = await findCardId(
				(c) =>
					isEqualUrl(c.source.url, card.source.url, { excludeSearch: true }) &&
					isEqualUrl(c.preview.url, card.preview.url, { excludeSearch: true })
			);
			if (!id) continue; //如果id无效就跳过该卡片的取消收藏
			await store.value.removeItem(id);
			console.log("成功从Favorite仓库删除卡片", card);
		}
		refreshStore();
	};

	//f 取消收藏卡片
	const unFavoriteCard = async (cards: Card[]) => {
		for (const card of cards) {
			// 先查找卡片在仓库的id
			const id = await findCardId(
				(c) =>
					isEqualUrl(c.source.url, card.source.url, { excludeSearch: true }) &&
					isEqualUrl(c.preview.url, card.preview.url, { excludeSearch: true })
			);
			if (!id) continue; //如果id无效就跳过该卡片的取消收藏
			await store.value.removeItem(id);
			console.log("成功取消收藏卡片", card);
		}
		refreshStore();
	};

	//f 查找卡片id
	const findCardId = async (
		/** 匹配函数 */
		matchComparator: (currCard: Card) => boolean
	): Promise<string | undefined> => {
		// 先刷新仓库
		await refreshStore();
		return cardList.value.find((c) => matchComparator(c))?.id;
	};

	//f 查找卡片
	const findCard = async (
		/** 匹配函数 */
		matchComparator: (currCard: Card) => boolean
	): Promise<Card | undefined> => {
		// 先刷新仓库
		await refreshStore();
		return cardList.value.find((c) => matchComparator(c));
	};

	//f 查询卡片(通过id)
	const findCardById = async (id: string): Promise<Card | undefined> => {
		// 先刷新仓库
		await refreshStore();
		return cardList.value.find((c) => c.id === id);
	};

	//f 查询多张卡片(通过id)
	const findCardsById = async (ids: string[]): Promise<Card[]> => {
		// 先刷新仓库
		await refreshStore();
		return cardList.value.filter((c) => ids.includes(c.id)) || [];
	};

	//f 判断卡片是否存在
	/** 若source.url和preview.url相同则视为同一张卡片 */
	const isExist = async (card: Card) => {
		// 先刷新仓库
		await refreshStore();
		// 判断是否包含卡片
		return cardList.value.some(
			(c) =>
				isEqualUrl(c.source.url, card.source.url, { excludeSearch: true }) &&
				isEqualUrl(c.preview.url, card.preview.url, { excludeSearch: true })
		);
	};

	return {
		store,
		cardList,
		sizeRange,
		filters,
		sortInfo,
		sortOptions,
		typeOptions,
		extensionOptions,
		filterCardList,
		selectedCardList,
		keys,
		filterKeyword,
		refreshStore,
		clearStore,
		addCard,
		updateCard,
		deleteCard,
		unFavoriteCard,
		findCard,
		findCardById,
		findCardsById,
		isExist,
		downloadCards,
	};
});

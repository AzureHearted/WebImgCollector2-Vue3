import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
// 导入类
import Card from "./class/Card";
// 导入工具
import getCard from "./utils/get-cards";

export default defineStore("cardStore", () => {
	// 数据定义
	const data = reactive({
		cardList: [] as Card[], //s 卡片列表
		// 所有匹配到的链接集合
		urlSet: new Set() as Set<string>,
		// 所有匹配到的dom集合
		domSet: new Set() as Set<HTMLElement>,
		// 所有被排除的卡片集合
		excludeIdSet: new Set() as Set<Card["id"]>,
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
			width: ref<[number, number]>([350, info.size.width[1]]), //宽度过滤器
			height: ref<[number, number]>([350, info.size.height[1]]), //高度过滤器
		},
	});

	// 计算属性定义
	// j 过滤后的卡片
	const filteredCardList = computed(() => {
		// 后续添加处理逻辑，例如过滤、排序等操作。
		return data.cardList.filter((x) => {
			return (
				!!x && // 过滤排除
				!data.excludeIdSet.has(x.id) && // 过滤被排除的项
				x.source.meta?.width! >= filters.size.width[0] &&
				x.source.meta?.width! <= filters.size.width[1] &&
				x.source.meta?.height! >= filters.size.height[0] &&
				x.source.meta?.height! <= filters.size.height[1]
			);
		});
	});

	// 获取页面资源
	async function getPageCard() {
		const oldLength = data.cardList.length;
		// 记录开始前的cardList长度
		await getCard(
			{
				region: {
					enable: false,
					selector: "",
				},
				source: {
					selector: "img",
					infoType: "property",
					name: "src",
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
			},
			async (doms) => {
				// console.log("匹配到的DOM", doms);
				return doms;
			},
			async (card, index, dom, addCard) => {
				const oldLength = data.cardList.length;
				// 判断该卡片中的链接是否已经存在于集合中，如果存在则不添加到卡片列表中。

				if (!data.urlSet.has(card.source.url)) {
					// console.log(
					// 	`第${oldLength + 1}张卡片获取成功!`,
					// 	card
					// );
					if (dom) {
						data.domSet.add(dom); // 记录dom用于排序
					}
					data.urlSet.add(card.source.url); // 添加到链接集合中
					data.cardList.push(card); // 添加到卡片列表中。
					updateMaxSize(card.source.meta?.width, card.source.meta?.height); // 更新最大宽高。
					await addCard(); //执行回调函数
				}
			}
		);
		// data.cardList.push(...res); // 更新卡片列表。
		// 最后过滤空值
		data.cardList = data.cardList.filter((x) => x); // 更新卡片列表。
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
		data.cardList = []; // 清空卡片列表
		info.size.width = [0, 2000]; // 重置宽度范围。
		info.size.height = [0, 2000]; // 重置高度范围。
		filters.size.width = [350, 2000];
		filters.size.height = [350, 2000];
	}

	// 移除卡片
	function removeCard(id: string) {
		data.excludeIdSet.add(id);
		return;
	}

	// 下载卡片
	function downloadCards(ids: string[]) {
		console.log("下载", ids);
	}

	return {
		data,
		info,
		filters,
		filteredCardList,
		getPageCard,
		clearCardList,
		removeCard,
		downloadCards,
	};
});

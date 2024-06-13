import { useCardStore } from "@/stores";
import Card from "@/stores/CardStore/class/Card";
import localforage from "localforage";
import { defineStore } from "pinia";
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

	//j 仓库中所有Key值列表
	const keys = computed(() => {
		return cardList.value.map((c) => c.id);
	});

	//j 选中的卡片列表
	const selectedCardList = computed<Card[]>(() => {
		return cardList.value.filter((c) => c.isSelected);
	});

	//j 过滤后的卡片列表
	const filterCardList = computed<Card[]>(() => {
		return cardList.value.filter((c) => {
			return c.description.title
				.trim()
				.toLocaleLowerCase()
				.includes(filterKeyword.value.trim().toLocaleLowerCase());
		});
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
					card.source.url === c.source.url && card.preview.url === c.preview.url
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
					card.source.url === c.source.url && card.preview.url === c.preview.url
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
					card.source.url === c.source.url && card.preview.url === c.preview.url
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
				//s 需要source.url和preview.url相同才视为同一张卡片
				c.source.url === card.source.url && c.preview.url === card.preview.url
		);
	};

	return {
		store,
		cardList,
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
		isExist,
		downloadCards,
	};
});

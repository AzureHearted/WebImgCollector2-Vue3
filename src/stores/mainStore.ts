import {defineStore} from "pinia";
import {IORule, MatchRule} from "../ts/class/MatchRule";
import {Fancybox} from "@fancyapps/ui";

/**
 *! appInfo 信息共享
 */
export const useAppInfoStore = defineStore("appInfo", () => {
	//* 容器信息
	const container = reactive({
		open: false, //* 开关标识符
		widthPercentage: 100, //* 宽度百分比
	});
	//* 窗口信息
	const window = reactive({
		width: useWindowSize().width,
		height: useWindowSize().height,
	});

	//* 进度(条)
	const loading = reactive({
		value: false,
		show: false,
		state: "",
		percentage: 0,
		//f 进度条初始化函数
		init: () => {
			loading.value = true;
			loading.show = true;
			loading.percentage = 0;
			loading.state = "";
		},
		//f 进度条重置函数
		reset: () => {
			setTimeout(() => {
				loading.value = false;
				loading.state = "success";

				setTimeout(() => {
					loading.show = false;
					loading.percentage = 0;
					loading.state = "";
				}, 1500);
			}, 500);
		},
	});

	return {container, window, loading};
});

/**
 *! 卡片 共享信息
 */
export const useCardsStore = defineStore("Cards", () => {
	const appInfo = useAppInfoStore();
	const toolBar = useToolBarStore();
	const ruleEditor = useRuleEditorStore();

	interface cardData {
		cardList: matchCard[];
		urlSet: Set<string>;
		domSet: Set<any>;
	}
	//* 数据
	const data: cardData = reactive({
		cardList: <matchCard[]>[], //* 卡片列表
		//f 所有匹配到的链接集合
		urlSet: new Set(),
		//f 所有匹配到的dom集合
		domSet: new Set(),
	});

	const allValidCards = computed((): matchCard[] => {
		return data.cardList.filter((card) => card);
	});

	//f 过滤后的cardList结果(计算属性) 返回结果在script中需要使用.value访问
	const filterCards = computed((): matchCard[] => {
		const filter = toolBar.filter;
		const listControl = toolBar.listControl;
		let regex = filter.formats.value.length
			? new RegExp(`\\.(${filter.formats.value.join("|")})$`)
			: new RegExp("");
		//* 过滤
		let cardList = allValidCards.value.filter(
			(card: matchCard) =>
				card.meta.width >= filter.size.width.value[0] &&
				card.meta.width <= filter.size.width.value[1] &&
				card.meta.height >= filter.size.height.value[0] &&
				card.meta.height <= filter.size.height.value[1] &&
				regex.test(card.linkUrl)
		);
		//* 排序
		if (listControl.sortMethod.value === "name-asc") {
			cardList = cardList.sort((a, b) => mixSort(a.name, b.name));
		} else if (listControl.sortMethod.value === "name-desc") {
			cardList = cardList.sort((a, b) => mixSort(b.name, a.name));
		} else if (listControl.sortMethod.value === "width-asc") {
			cardList = cardList.sort((a, b) => a.meta.width - b.meta.width);
		} else if (listControl.sortMethod.value === "width-desc") {
			cardList = cardList.sort((a, b) => b.meta.width - a.meta.width);
		} else if (listControl.sortMethod.value === "height-asc") {
			cardList = cardList.sort((a, b) => a.meta.height - b.meta.height);
		} else if (listControl.sortMethod.value === "height-desc") {
			cardList = cardList.sort((a, b) => b.meta.height - a.meta.height);
		}
		return cardList;
	});

	//f  选中的卡片列表
	const selectedCards = computed(() => {
		return filterCards.value.filter((card) => card.selected);
	});

	//f 获取卡片
	const getCard = async (rule: IORule) => {
		const filter = toolBar.filter;
		appInfo.loading.init();
		//* 每次处理完成一张时的回调
		const singleCallBack = (
			card: matchCard,
			realIndex: number,
			processedCount: number,
			allCount: number
		) => {
			appInfo.loading.percentage = (processedCount / allCount) * 100;
			if (card.match && !data.urlSet.has(card.picUrl)) {
				console.log("匹配成功!", card, filter);
				data.cardList[realIndex] = card;
				// data.cardList.push(card);
				data.urlSet.add(card.picUrl); //* 记录匹配过的链接
				data.domSet.add(card.dom); //* 记录匹配过的dom
				//* 更新尺寸过滤器最大值

				const max =
					(filter.size.width.max =
					filter.size.height.max =
						Math.max(
							filter.size.width.max,
							filter.size.height.max,
							card.meta.width,
							card.meta.height
						));
				console.log(max);

				filter.size.width.value[1] = max;
				filter.size.height.value[1] = max;
			}
		};
		//* 全部处理完成后的回到
		const finallyCallback = (
			cardList_output: matchCard[],
			rowCardList: rowCard[]
		) => {
			appInfo.loading.percentage = 100;
			appInfo.loading.reset();
			if (!cardList_output.length) {
				ElMessage({
					message: "没有匹配到合适的项目(请切换/创建预设后重试)",
					type: "info",
					showClose: true,
					grouping: true,
					offset: 120,
				});
			} else {
				// console.log(rowCardList);
				// console.log("匹配完成", data, filterCards);
			}

			//* 所有操作都结束后对原先cardList中无效的项目进行过滤
			data.cardList = data.cardList.filter((card) => card);
		};
		// *定义每次处理完每个结果后的回调定义
		await getCardsByRule(
			rule,
			data.cardList.length,
			singleCallBack,
			finallyCallback,
			{
				excludeDomSet: data.domSet,
				excludeUrlSet: data.urlSet,
			}
		);
	};

	//f 打开FancyBox预览器
	const openFancyBox = async (startIndex: number = 0) => {
		const nodeList = filterCards.value.map((card) => card.linkUrlDom);
		Fancybox.fromNodes(nodeList as HTMLElement[], {
			hideScrollbar: true,
			startIndex: startIndex,
			parentEl: document.querySelector(
				".onlineGallery-child-window-container"
			) as HTMLElement,
			groupAll: true,
			Thumbs: {type: "modern"},
			Images: {
				Panzoom: {
					maxScale: 5,
				},
			},
			Toolbar: {
				display: {
					left: ["infobar"],
					middle: [
						"zoomIn",
						"zoomOut",
						"toggle1to1",
						"rotateCCW",
						"rotateCW",
						"flipX",
						"flipY",
					],
					right: ["slideshow", "download", "thumbs", "close"],
				},
			},
		});
	};

	return {
		data,
		allValidCards,
		filterCards,
		selectedCards,
		getCard,
		openFancyBox,
	};
});

/**
 *! ToolBar 共享信息
 */
export const useToolBarStore = defineStore("ToolBar", () => {
	const cardsStore = useCardsStore();
	const ruleEditor = useRuleEditorStore();

	//* 过滤器参数
	const filter = reactive({
		size: {
			width: {
				value: [350, 500],
				max: 500,
			},
			height: {
				value: [350, 500],
				max: 500,
			},
		},
		formats: {
			options: [
				{value: "png", label: "png"},
				{value: "jpg", label: "jpg"},
				{value: "jpeg", label: "jpeg"},
				{value: "gif", label: "gif"},
				{value: "bmp", label: "bmp"},
				{value: "webp", label: "webp"},
				{value: "svg", label: "svg"},
			],
			value: ["png", "jpg", "jpeg", "gif", "webp", "bmp"],
		},
	});

	//* 规则选择器
	const ruleSelector = reactive({
		value: <string | undefined>undefined,
		option: computed(() => {
			let options = [
				{
					value: "#",
					label: "(内置)默认规则",
					iconUrl: "",
				},
			];
			options.push(
				...ruleEditor.data.ruleList.map((rule) => {
					return {
						value: rule.id,
						label: rule.main.name,
						iconUrl: rule.main.iconUrl,
					};
				})
			);
			return options;
		}),
	});

	//* 列表控制信息
	const listControl = reactive({
		//* 排序方式
		sortMethod: {
			options: [
				{value: "#", label: "默认排序"},
				{value: "name-asc", label: "名称-升序"},
				{value: "name-desc", label: "名称-降序"},
				{value: "width-asc", label: "宽度-升序"},
				{value: "width-desc", label: "宽度-降序"},
				{value: "height-asc", label: "高度-升序"},
				{value: "height-desc", label: "高度-降序"},
			],
			value: "#",
		},
		//* 显示行数
		showColumn: 3,
		allSelected: false,
	});

	//f 选出首个匹配的规则
	const selectingInitRule = () => {
		let matchedRule: IORule[] = ruleEditor.data.ruleList
			.filter((rule) => {
				//* 先过滤域名
				return new RegExp(`${rule.main.domainName}`).test(location.origin);
			})
			.filter((rule) => {
				const pattern = rule.main.pathFilter.pattern;
				const flags = rule.main.pathFilter.flags.join("");
				//* 再过滤路径
				return new RegExp(pattern, flags).test(
					location.pathname + location.search
				);
			});
		if (matchedRule.length) {
			ruleSelector.value = matchedRule[0].id;
		} else {
			//* 没有匹配到则使用默认规则
			ruleSelector.value = "#";
		}
	};

	return {filter, listControl, ruleSelector, selectingInitRule};
});

/**
 *! 规则管理器 共享信息
 */
export const useRuleEditorStore = defineStore("ruleEditor", () => {
	/**
	 * ? node接口定义
	 */
	interface node {
		id: string;
		label: string;
		iconUrl?: string;
		children: node[];
		disabled: boolean;
		isNew?: boolean;
	}

	//* 容器
	const container = reactive({
		open: false,
	});

	//* 信息
	const info = reactive({
		showRuleId: "#",
		form: {
			activeName: <string>"main",
			realTimeData: <MatchRule | undefined>undefined,
		},
		tree: {
			query: "", //* 查询(过滤)文本
			//* 树形列表配置信息对象
			treeProps: {
				value: "id",
				label: "label",
				children: "children",
				disabled: "disabled",
			},
			//* 树形列表数据
			treeData: computed((): node[] => {
				let result = data.ruleList.map((rule) => {
					return <node>{
						id: rule.id,
						label: rule.main.name || "未命名规则",
						iconUrl: rule.main.iconUrl,
						children: [],
						disabled: false,
						isNew: rule.status.isNewCreated,
					};
				});
				result.push(<node>{
					id: "#",
					label: "创建规则",
					children: [],
					disabled: false,
				});
				return result;
			}),
		},
	});

	//* 树形列表数据
	const treeData = computed((): node[] => {
		let result = data.ruleList.map((rule) => {
			return <node>{
				id: rule.id,
				label: rule.main.name || "未命名规则",
				iconUrl: rule.main.iconUrl,
				children: [],
				disabled: false,
				isNew: rule.status.isNewCreated,
			};
		});
		result.push(<node>{
			id: "#",
			label: "创建规则",
			children: [],
			disabled: false,
		});
		return result;
	});

	interface IData {
		ruleList: Array<MatchRule>;
	}
	//* 数据
	const data: IData = reactive({
		ruleList: [], //* 规则列表
	});

	//f 获取用户本地规则信息
	const getLocationRule = async () => {
		let localRuleList = GM_getValue<string>("ruleList");
		if (localRuleList != null) {
			//* 本地数据不为空则直接赋值给组件
			data.ruleList = JSON.parse(localRuleList).map((rawRule: any) => {
				return new MatchRule(rawRule); //* 这里将本地数据解析出来的对象进一步转为Rule对象
			});
			console.log("数据已导入", data);
		} else {
			data.ruleList = [];
			console.log("本地数据为空 -> 初始化数据", data);
		}
	};

	//f 保存规则信息到本地
	const saveRuleToLocation = async () => {
		const list = data.ruleList.map((rule) => rule.getJsonData());
		const jsonData = `[${list.join(",")}]`;
		console.log("保存数据", jsonData);
		GM_setValue("ruleList", jsonData);
		ElMessage({
			type: "success",
			grouping: true,
			center: true,
			offset: 120,
			duration: 1000,
			message: `保存成功!`,
		});
	};

	//f 创建规则
	const createRule = async (): Promise<MatchRule> => {
		let rule = new MatchRule(); //* 通过Rule创建一个rule对象
		data.ruleList.push(rule); //* 并将其push进ruleList
		rule.main.domainName = location.origin; //* 记录域名
		rule.main.iconUrl = await getFavicon(); //* 获取图标链接
		console.log("规则创建", rule);
		return rule;
	};

	//f 删除规则
	const deleteRule = async (id: string) => {
		const index = data.ruleList.findIndex((item) => item.id === id);
		const target = data.ruleList.splice(index, 1);
		console.log("移除规则", target);
		MatchRule.count--;
	};

	//! 默认规则
	const defaultRule: IORule = reactive({
		id: "#",
		main: {
			name: "(内置)默认规则",
			domainName: "",
			pathFilter: {pattern: "", flags: []},
			titleSelector: "",
			iconUrl: "",
		},
		domItem: {enable: false, method: 0, selector: ["", "", "", ""]},
		linkUrl: {
			method: 0,
			selector: [
				'meta[property="og:image"]',
				"img[data-src]",
				"img[src]",
				"[srcset]",
			],
			infoType: 2,
			attribute: [
				"content",
				"srcset|data-src|src",
				"srcset|data-src|src",
				"srcset|data-src|src",
			],
		},
		picUrl: {
			enable: false,
			origin: 0,
			method: 0,
			selector: ["", "", "", ""],
			infoType: 3,
			attribute: ["", "", "", ""],
		},
		name: {
			enable: false,
			origin: 0,
			method: 0,
			selector: ["", "", "", ""],
			infoType: 4,
			attribute: ["", "", "", ""],
		},
		meta: {
			enable: true,
			origin: 2,
			method: 0,
			selector: ["", "", "", ""],
			infoType: 0,
			attribute: ["", "", "", ""],
			getMethod: 0,
		},
	});

	return {
		container,
		info,
		data,
		defaultRule,
		getLocationRule,
		saveRuleToLocation,
		createRule,
		deleteRule,
	};
});

//* list仓库
export const useListInfoStore = defineStore("list", () => {
	//* 信息
	const info = reactive({
		nowColumn: <number>3,
		allSelected: false,
	});

	return {info};
});

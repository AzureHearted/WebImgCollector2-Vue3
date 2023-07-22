import {defineStore} from "pinia";
import {MatchRule} from "../ts/class/MatchRule";

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
	const toolBar = useToolBarStore();
	const filter = toolBar.filter;

	interface cardData {
		cardList: matchCard[];
		filterCards: matchCard[];
		urlSet: Set<string>;
		domSet: Set<any>;
	}
	//* 数据
	const data: cardData = reactive({
		cardList: <matchCard[]>[], //* 卡片列表
		//f 过滤后的cardList结果(计算属性) 返回结果在script中需要使用.value访问
		filterCards: computed((): matchCard[] => {
			let regex = filter.formats.value.length
				? new RegExp(`\\.(${filter.formats.value.join("|")})$`)
				: new RegExp("");
			const result = data.cardList.filter(
				(card: matchCard) =>
					card.meta.width >= filter.size.width.value[0] &&
					card.meta.width <= filter.size.width.value[1] &&
					card.meta.height >= filter.size.height.value[0] &&
					card.meta.height <= filter.size.height.value[1] &&
					regex.test(card.url)
			);
			return result;
		}),
		//f 所有匹配到的链接集合
		urlSet: new Set(),
		//f 所有匹配到的dom集合
		domSet: new Set(),
	});

	return {data};
});

/**
 *! ToolBar 共享信息
 */
export const useToolBarStore = defineStore("ToolBar", () => {
	const cardsStore = useCardsStore();

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

	return {filter};
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
			treeData: computed(() => {
				let result = data.ruleList.map((rule) => {
					return <node>{
						id: rule.id,
						label: rule.main.name || "未命名规则",
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

	//* 数据
	const data = reactive({
		ruleList: <MatchRule[]>[], //* 规则列表
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
	};

	//f 创建规则
	const createRule = async (): Promise<MatchRule> => {
		let rule = new MatchRule(); //* 通过Rule创建一个rule对象
		data.ruleList.push(rule); //* 并将其push进ruleList
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

	return {
		container,
		info,
		data,
		getLocationRule,
		saveRuleToLocation,
		createRule,
		deleteRule,
	};
});

export const useListInfoStore = defineStore("list", () => {
	//* 信息
	const info = reactive({
		nowColumn: 3,
		allSelected: false,
	});

	return {info};
});

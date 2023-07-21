import {defineStore} from "pinia";
import {Rule} from "../js/class/Rule";

/**
 ** appInfo 信息共享
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

	//* 数据
	const data = reactive({
		cardList: [], //* 卡片列表
		filterCards: [], //* 过滤后的结果
	});

	return {data, container, window};
});

/**
 * * 规则编辑窗口 共享信息
 */
export const useRuleEditorStore = defineStore("ruleEditor", () => {
	//* 容器信息
	const container = reactive({
		open: false,
	});

	const info = reactive({
		showRuleId: "#",
		form: {
			activeName: <string>"main",
			realTimeData: <Rule | undefined>undefined,
		},
		tree: {
			query: "", //* 查询(过滤)文本
		},
	});

	//* 数据
	const data = reactive({
		ruleList: [], //* 规则列表
	});

	/**
	 * * 树形列表配置对象
	 */
	const treeProps = reactive({
		value: "id",
		label: "label",
		children: "children",
		disabled: "disabled",
	});

	/**
	 * * node接口定义
	 */
	interface node {
		id: string;
		label: string;
		children: node[];
		disabled: boolean;
		isNew?: boolean;
	}

	/**
	 * ? 树形列表数据
	 */
	const treeData = computed(() => {
		// console.log(data.ruleList.length);
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
	});
	return {container, info, data, treeProps, treeData};
});

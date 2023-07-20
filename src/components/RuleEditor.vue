<template>
	<div class="onlineGallery-RuleEditor-modal">
		<!-- *规则管理器 -->
		<el-dialog
			style="pointer-events: auto !important; padding: 0px"
			v-model="ruleEditor.container.open"
			width="60%"
			:before-close="handleClose"
			:modal="false"
			:close-on-click-modal="false"
			top="10vh"
			draggable
			:lock-scroll="false">
			<!-- *标题部分 -->
			<template #header>
				<span style="color: black; font-size: large">规则管理器</span>
			</template>
			<!-- *内容主体 -->
			<template #default>
				<el-container style="user-select: none">
					<!-- f左侧树形列表 -->
					<el-aside width="200px" show-checkbox highlight-current style="padding: 5px">
						<!-- *过滤框 -->
						<el-input
							size="small"
							v-model="info.tree.query"
							placeholder="输入关键词"
							@input="onQueryChanged" />
						<!-- *树形列表本体 -->
						<el-tree-v2
							ref="treeRef"
							:data="treeData"
							:props="treeProps"
							:height="208"
							highlight-current
							:current-node-key="info.showRuleId"
							:filter-method="treeFilterMethod"
							@node-click="treeNodeClick">
							<template #default="{node}">
								<div v-if="node.key != '#'" class="tree-item tree-item-normal">
									<span class="ruleName">{{ node.label }}</span>
									<span class="icon-button-deleteRule">
										<HoverButton @click.stop="deleteRule(node.key, node)" />
									</span>
								</div>
								<div v-if="node.key == '#'" class="tree-item tree-item-add-button">
									<el-button
										type="primary"
										size="small"
										:icon="CirclePlusFilled"
										@click="createRule"
										>{{ node.label }}
									</el-button>
								</div>
							</template>
						</el-tree-v2>
					</el-aside>
					<!-- f表单主体 -->
					<el-main style="padding: 5px">
						<RuleForm :formData="info.form.realTimeData" />
					</el-main>
				</el-container>
			</template>
			<!-- *底部 -->
			<template #footer>
				<el-button type="primary" @click="allSave">全部保存</el-button>
				<el-button @click="handleClose">取消</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
	import {useRuleEditorStore} from "../store/mainStore.js"; //* 共享信息导入

	import HoverButton from "./HoverButton.vue";
	import RuleForm from "./RuleForm.vue";

	import {Rule, buildUUID} from "../js/public.js";

	import {Management, CirclePlusFilled} from "@element-plus/icons-vue"; //? element icon导入

	const ruleEditor = useRuleEditorStore();

	/**
	 * * 信息对象
	 */
	const info = reactive({
		showRuleId: "#",
		form: {
			activeName: "main",
			realTimeData: null,
		},
		tree: {
			query: "", //* 查询(过滤)文本
		},
	});

	/**
	 * * 数据对象
	 */
	const data = reactive({
		ruleList: [],
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
	 *f 导入表单数据 & 显示
	 * @param {Rule} ruleData 留空 - 表示还原表单到初始状态
	 */
	const inputFormData = async (ruleData = {}) => {
		if (ruleData.constructor === Rule) {
			if (!ruleData.status.editing && !ruleData.status.isNewCreated) {
				ruleData.createBackup(); //* 创建备份
				ruleData.status.editing == true; //* 标记为编辑ing
			}
			ruleData.status.isNewCreated = false; //* 只要查看过都不再是新创建的规则
			info.form.realTimeData = ruleData; //* 将待编辑rule对象传递给表单
			info.showRuleId = ruleData.id; //* 同步左侧树形列表激活的位置
			info.form.activeName = "main"; //* 标签页位置初始化
		} else {
			info.form.realTimeData = null;
			info.showRuleId = "#"; //* 同步左侧树形列表激活的位置
		}
	};

	/**
	 * ? 树形列表数据
	 */
	const treeData = computed(() => {
		let result = data.ruleList.map((rule) => {
			return {
				id: rule.id,
				label: rule.main.name,
				children: [],
				disabled: false,
				isNew: rule.status.isNewCreated,
			};
		});
		result.push({
			id: "#",
			label: "创建规则",
			children: [],
			disabled: false,
			icon: CirclePlusFilled,
		});
		return result;
	});

	/**
	 * * 用于接收树形列表的实例对象
	 */
	const treeRef = ref(null);

	/**
	 * f el-input查询框内容变化时触发的回调函数 (定义)
	 * @param {string} query 查询(过滤)内容
	 * - 由el-input组件返回
	 */
	const onQueryChanged = (query) => {
		treeRef.value.filter(query); //* 触发过滤
	};

	/**
	 * f 树形节点的过滤方法/逻辑（定义）
	 * @param {string} query 过滤文本(查询文本)
	 * @param {TreeNode} node 树形节点数据
	 * @returns {Boolean}
	 * - 返回值为 true 表示 显示
	 * - 返回值为 false 表示 隐藏
	 */
	const treeFilterMethod = (query, node) => {
		/**
		 * 过滤逻辑
		 */
		return node.label.includes(query);
	};

	/**
	 * f 树形列表节点点击(左键点击)事件
	 * @param {TreeNodeData} nodeData 所点击的节点data数据
	 * @param {TreeNode} node 所点击的节点node数据
	 * @param {MouseEvent} e 鼠标对象
	 */
	const treeNodeClick = (nodeData, node, e) => {
		console.log(node);
		// console.log(nodeData.id, e.target);
		const ruleIndex = data.ruleList.findIndex((item) => item.id === nodeData.id);
		// console.log(ruleIndex);

		if (ruleIndex >= 0) {
			inputFormData(data.ruleList[ruleIndex]);
		}
	};

	/**
	 * f 创建规则
	 */
	const createRule = async () => {
		let rule = new Rule(); //* 通过Rule创建一个rule对象
		// console.log(rule);
		data.ruleList.push(rule); //* 并将其push进ruleList

		//* 激活表单
		inputFormData(rule);
	};

	/**
	 * f 删除规则
	 * @param {string} id 要删除的规则的id
	 * @param {*} node
	 */
	const deleteRule = async (id, node) => {
		const index = data.ruleList.findIndex((item) => item.id === id);
		// console.log(index, node);
		let rule = data.ruleList[index];
		// console.log(rule);
		const ruleName = rule.main.name;

		ElMessageBox.confirm(`确认删除规则 “${ruleName}” ？(此操作无法恢复)`, null, {
			confirmButtonText: "确认",
			cancelButtonText: "取消",
			lockScroll: false,
		})
			.then(() => {
				delete data.ruleList[index];
				data.ruleList.splice(index, 1);
				Rule.count--;

				// console.log("当前规则数", Rule.count);
				inputFormData();
				ElMessage({
					type: "success",
					grouping: true,
					center: true,
					duration: 1000,
					offset: 80,
					message: `规则 “${ruleName}” 删除成功!`,
				});
			})
			.catch(() => {});
	};

	//f 关闭前的处理(不保存关闭)
	const handleClose = async () => {
		ElMessageBox.confirm("确认关闭？", null, {
			confirmButtonText: "确认",
			cancelButtonText: "取消",
			lockScroll: false,
		})
			.then(() => {
				ruleEditor.container.open = false;
				initDialog();
				cleanData();
				// console.log("关闭窗口");
			})
			.catch(() => {
				// catch error
				// console.log("取消关闭窗口");
			});
	};

	/**
	 * f 初始化窗口
	 */
	const initDialog = async () => {
		info.form.activeName = "main";
		inputFormData();
	};

	//f 全部保存操作
	const allSave = async () => {
		GM_setValue("ruleList", JSON.stringify(data.ruleList));
		ruleEditor.container.open = false;
		cleanData();
	};

	/**
	 * f 清空数据
	 */
	const cleanData = async () => {
		for (let i = 0, len = data.ruleList.length; i < len; i++) {
			delete data.ruleList[i];
			Rule.count--;
		}
		data.ruleList = [];
	};

	//* 监听open状态
	watch(
		() => ruleEditor.container.open,
		(newVal, oldVal) => {
			if (newVal) {
				//* 初始化窗口
				initDialog();
				//* 如果打开了就读取本地存储的数据
				let localRuleList = GM_getValue("ruleList");
				if (localRuleList != null) {
					//* 本地数据不为空则直接赋值给组件
					data.ruleList = JSON.parse(localRuleList).map((rawRule) => {
						return new Rule(rawRule); //* 这里将本地数据解析出来的对象进一步转为Rule对象
					});
					console.log("数据已导入", data);
				} else {
					data.ruleList = [];
					console.log("本地数据为空 -> 初始化数据", data);
				}
			}
		}
	);
</script>

<style lang="scss">
	.onlineGallery-RuleEditor-modal {
		//* 遮罩层样式
		& {
			pointer-events: none !important;
		}

		//* 对话框头部框架样式
		.el-dialog__header {
			padding: 15px 10px 5px 20px;
			//* 关闭按钮样式
			.el-dialog__headerbtn {
				top: 0;
				right: 0;
				width: 50px;
				height: 50px;
			}
		}

		//* 对话框主体框架样式
		.el-dialog__body {
			padding: 10px;
			min-height: 300px;

			//* tree-item通用样式
			.tree-item {
				& {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding-right: 10px;
				}

				//* 普通tree-item
				&.tree-item-normal {
					//* 规则删除 - 图标按钮
					> .icon-button-deleteRule {
						position: absolute;
						right: 12px;
						display: flex;
						justify-content: center;
						align-items: center;
						color: red;
						font-size: medium;
					}
				}
				//* 增加按钮的tree-item
				&.tree-item-add-button {
					> button {
						width: 100%;
					}
				}
			}
		}

		//* 对话框底部框架样式
		.el-dialog__footer {
			padding: 10px;
		}
	}
</style>

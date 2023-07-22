<template>
	<div class="onlineGallery-RuleEditor-modal">
		<!-- *规则管理器 -->
		<el-dialog
			style="pointer-events: auto !important; padding: 0px"
			v-model="ruleEditor.container.open"
			:width="appInfo.window.width > 800 ? '800px' : '100%'"
			:before-close="handleClose"
			:modal="false"
			:close-on-click-modal="false"
			:lock-scroll="false"
			destroy-on-close
			draggable
			@open="handleOpen"
			@closed="handleClosed">
			<!-- *标题部分 -->
			<template #header>
				<span style="color: black; font-size: large">规则管理器</span>
				<span style="color: black; font-size: large">
					(共{{ ruleEditor.data.ruleList.length }}条规则)
				</span>
			</template>
			<!-- *内容主体 -->
			<template #default>
				<el-container style="user-select: none">
					<!-- f左侧树形列表 -->
					<el-aside
						width="200px"
						show-checkbox
						highlight-current
						style="padding: 5px">
						<!-- *过滤框 -->
						<el-input
							clearable
							v-model="tree.query"
							placeholder="输入关键词"
							@input="onQueryChanged" />
						<!-- *树形列表本体 -->
						<el-tree-v2
							ref="treeRef"
							:data="tree.treeData"
							:props="tree.treeProps"
							:height="400"
							highlight-current
							:current-node-key="info.showRuleId"
							:filter-method="treeFilterMethod"
							@node-click="treeNodeClick"
							:item-size="32">
							<template #default="{node}">
								<!-- *规则项 -->
								<div v-if="node.key != '#'" class="tree-item tree-item-normal">
									<el-tooltip
										:show-after="500"
										effect="dark"
										:content="node.label"
										placement="top">
										<span class="label-ruleName">{{ node.label }}</span>
									</el-tooltip>
									<span class="icon-button-deleteRule">
										<HoverButton
											@click.stop="deleteRule(node.key, node)"></HoverButton>
									</span>
								</div>
								<!-- *规则创建按钮 -->
								<div
									v-if="node.key == '#'"
									class="tree-item tree-item-add-button">
									<el-button type="primary" @click="createRule">
										<template #icon>
											<el-icon><i-ep-CirclePlusFilled /></el-icon>
										</template>
										<span> {{ node.label }} </span>
									</el-button>
								</div>
							</template>
						</el-tree-v2>
					</el-aside>
					<!-- f表单主体 -->
					<el-main style="padding: 5px">
						<RuleForm :formData="<MatchRule|undefined>form.realTimeData" />
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

<script setup lang="ts">
	import {MatchRule} from "../ts/class/MatchRule";

	const appInfo = useAppInfoStore(); //* 实例化appInfo数据仓库
	const ruleEditor = useRuleEditorStore(); //* 实例化ruleEditor数据仓库

	//* 用于接收树形列表的实例对象
	const treeRef = ref();

	//* 信息对象
	const info = ruleEditor.info;

	//* 表单信息
	const form = ruleEditor.info.form;

	//* 虚拟列表信息
	const tree = ruleEditor.info.tree;

	//* 数据对象
	const data = ruleEditor.data;

	/**
	 *f 导入表单数据 & 显示
	 * @param {MatchRule} ruleData 留空 - 表示还原表单到初始状态
	 */
	const inputFormData = async (ruleData?: MatchRule) => {
		if (ruleData != undefined) {
			if (!ruleData.status.editing && !ruleData.status.isNewCreated) {
				ruleData.createBackup(); //* 创建备份
				ruleData.status.editing = true; //* 标记为编辑ing
			}
			ruleData.status.isNewCreated = false; //* 只要查看过都不再是新创建的规则
			form.realTimeData = ruleData; //* 将待编辑rule对象传递给表单
			info.showRuleId = ruleData.id; //* 同步左侧树形列表激活的位置
			form.activeName = "main"; //* 标签页位置初始化
		} else {
			form.realTimeData = undefined;
			info.showRuleId = "-1"; //* 同步左侧树形列表激活的位置
		}
	};

	/**
	 * f el-input查询框内容变化时触发的回调函数 (定义)
	 * @param {string} query 查询(过滤)内容
	 * - 由el-input组件返回
	 */
	const onQueryChanged = (query: string) => {
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
	const treeFilterMethod = (query: string, node: any): boolean => {
		return node.label.includes(query);
	};

	/**
	 * f 树形列表节点点击(左键点击)事件
	 * @param {TreeNodeData} nodeData 所点击的节点data数据
	 * @param {TreeNode} node 所点击的节点node数据
	 * @param {MouseEvent} e 鼠标对象
	 */
	const treeNodeClick = (nodeData: any, node: any, e: MouseEvent) => {
		// console.log(node);
		const ruleIndex = data.ruleList.findIndex(
			(item) => item.id === nodeData.id
		);

		if (ruleIndex >= 0) {
			const rule = data.ruleList[ruleIndex];
			inputFormData(<any>rule);
		}
	};

	/**
	 * f 创建规则
	 */
	const createRule = async () => {
		const rule = await ruleEditor.createRule();
		//* 激活表单
		inputFormData(rule);
	};

	/**
	 * f 删除规则
	 * @param {string} id 要删除的规则的id
	 * @param {*} node
	 */
	const deleteRule = async (id: string, node: any) => {
		const ruleName = node.label;
		ElMessageBox.confirm(`确认删除规则 “${ruleName}” ？`, "提示", {
			confirmButtonText: "确认",
			cancelButtonText: "取消",
			lockScroll: false,
		})
			.then(() => {
				ruleEditor.deleteRule(id);
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

	//f 打开时的处理
	const handleOpen = () => {
		//* 初始化窗口
		initDialog();
		//*	获取用户本地规则信息
		ruleEditor.getLocationRule();
		console.log("规则管理器 - Open");
	};

	//f 关闭前的处理(不保存关闭)
	const handleClose = async () => {
		ElMessageBox.confirm("确认关闭？", "提示", {
			confirmButtonText: "确认",
			cancelButtonText: "取消",
			lockScroll: false,
		})
			.then(() => {
				ruleEditor.container.open = false; //! 关闭窗口
			})
			.catch(() => {});
	};

	//f 关闭后的处理(任何关闭操作)
	const handleClosed = async () => {
		initDialog();
		cleanTempData();
		console.log("规则管理器 - Close");
	};

	/**
	 * f 清空组件临时数据
	 */
	const cleanTempData = async () => {
		for (let i = 0, len = data.ruleList.length; i < len; i++) {
			delete data.ruleList[i];
			MatchRule.count--;
		}
		data.ruleList = [];
	};

	/**
	 * f 初始化窗口
	 */
	const initDialog = async () => {
		form.activeName = "main";
		inputFormData();
	};

	//f 全部保存操作
	const allSave = async () => {
		//*	存储修改后的最新数据到脚本的用户存储中
		ruleEditor.saveRuleToLocation();
		ruleEditor.container.open = false; //! 关闭窗口
	};
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
			//* body内容容器样式
			.el-container {
				position: relative;
				height: max-content;
				min-height: 300px;
				//* body标签页样式
				.el-tabs {
					height: 90%;
				}
			}
			//* tree-item通用样式
			.tree-item {
				& {
					display: flex;
					align-items: center;
					justify-content: space-between;
					// padding-right: 10px;
					overflow: hidden;
				}

				//* 普通tree-item
				&.tree-item-normal {
					position: relative;
					flex-grow: 1;
					//* 名称样式
					> .label-ruleName {
						flex-grow: 1;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					//* 规则删除 - 图标按钮
					> .icon-button-deleteRule {
						// position: relative;
						right: 2px;
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

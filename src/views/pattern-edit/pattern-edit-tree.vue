<template>
	<div class="pattern-tree-container">
		<el-card>
			<div class="pattern-tree__button-group-list">
				<el-button-group class="pattern-tree__button-group">
					<el-button type="primary" @click="addPattern">
						<template #icon>
							<i-material-symbols-list-alt-add />
						</template>
						新建方案
					</el-button>
					<el-button type="danger">
						<template #icon>
							<i-material-symbols-delete-rounded />
						</template>
						删除
					</el-button>
				</el-button-group>
				<el-button-group class="pattern-tree__button-group">
					<el-button type="success" @click="pastePattern">
						<template #icon>
							<i-material-symbols-content-paste-search-rounded />
						</template>
						粘贴方案
					</el-button>
					<el-button
						v-if="
							patternStore.editingPattern &&
							!patternStore.editingPattern.id.includes('#')
						"
						type="warning"
						@click="pasteRule">
						<template #icon>
							<i-material-symbols-markdown-paste-rounded />
						</template>
						粘贴规则
					</el-button>
				</el-button-group>
			</div>
		</el-card>
		<el-card>
			<el-input
				class="pattern-tree-filter-input"
				clearable
				v-model="filterText"
				placeholder="输入关键词">
			</el-input>
		</el-card>
		<div class="pattern-tree">
			<BaseScrollbar :show-bakctop-button="false">
				<el-tree
					ref="treeRef"
					:data="data"
					node-key="id"
					:indent="14"
					show-checkbox
					:expand-on-click-node="false"
					check-strictly
					highlight-current
					:current-node-key="currentNodeKey"
					default-expand-all
					:props="defaultProps"
					:filter-node-method="filterNode"
					@node-click="handleNodeClick">
					<template #default="{ node, data }">
						<span class="custom-tree-node">
							<!-- 节点名称区域 -->
							<div class="custom-tree-node-left">
								<!-- 节点图标(图片) -->
								<span class="custom-tree-node-icon">
									<BaseImg
										v-if="data.type === 'pattern' && !data.id.includes('#')"
										style="width: 16px; height: 16px"
										:src="(data.rowData as Pattern).backup?.mainInfo.icon">
									</BaseImg>
									<el-icon v-if="data.type === 'rule'">
										<i-material-symbols-regular-expression-rounded />
									</el-icon>
								</span>
								<!-- 节点名称 -->
								<el-tooltip
									:content="node.label"
									placement="top-start"
									:enterable="false">
									<el-badge
										class="custom-tree-node-name"
										is-dot
										:offset="[-4, 4]"
										:hidden="!(data.rowData as Pattern|Rule).isChange()">
										<span v-if="data.id.includes('#')">
											{{ node.label }}
										</span>
										<span v-else>
											<!-- 方案类型 -->
											<span v-if="data.type === 'pattern'">
												<!-- {{ (data.rowData as Pattern).backup?.mainInfo.name }} -->
												{{ node.label }}
											</span>
											<!-- 规则类型 -->
											<span v-if="data.type === 'rule'">
												<span v-if="(data.rowData as Rule).state.editing">
													<el-input
														size="small"
														@blur="(data.rowData as Rule).state.editing = false"
														v-model="(data.rowData as Rule).name">
													</el-input>
												</span>
												<span
													v-else
													@dblclick="
														(data.rowData as Rule).state.editing = true
													">
													{{ node.label }}
												</span>
											</span>
										</span>
									</el-badge>
								</el-tooltip>
							</div>
							<!-- 操作按钮 -->
							<div class="custom-tree-node-right" v-if="!data.id.includes('#')">
								<!-- 添加规则 -->
								<el-button
									v-if="data.type === 'pattern'"
									type="primary"
									size="small"
									circle
									@click.stop="addRule(node, data)">
									<template #icon>
										<i-ep-circle-plus />
									</template>
								</el-button>
								<!-- 重命名(规则) -->
								<el-button
									v-if="data.type === 'rule'"
									:type="(data.rowData as Rule).state.editing ? 'success' : 'primary'"
									size="small"
									circle
									@click.stop="
										(data.rowData as Rule).state.editing = !(
											data.rowData as Rule
										).state.editing
									">
									<template #icon>
										<i-ant-design-edit-outlined
											v-if="!(data.rowData as Rule).state.editing" />
										<i-ant-design-check-circle-filled v-else />
									</template>
								</el-button>
								<!-- 删除按钮 -->
								<el-popconfirm
									title="确定删除?"
									:hide-after="0"
									confirm-button-text="是"
									cancel-button-text="否"
									@confirm="
										data.type === 'pattern'
											? removePattern(node, data)
											: removeRule(node, data)
									">
									<template #reference>
										<el-button type="danger" size="small" circle @click.stop>
											<template #icon>
												<i-material-symbols-delete-rounded />
											</template>
										</el-button>
									</template>
								</el-popconfirm>
							</div>
						</span>
					</template>
				</el-tree>
			</BaseScrollbar>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, watch, computed, nextTick, onBeforeUpdate } from "vue";
	import BaseScrollbar from "@/components/base/base-scrollbar.vue";
	import type { ComputedRef } from "vue";
	import type { ElTree } from "element-plus";
	import type Node from "element-plus/es/components/tree/src/model/node";
	import BaseImg from "@/components/base/base-img.vue";
	import { ElNotification } from "@/plugin/element-plus";

	import { storeToRefs } from "pinia";
	import { usePatternStore } from "@/stores";
	import { Pattern } from "@/stores/patternStore/class/Pattern";
	import { Rule } from "@/stores/patternStore/class/Rule";

	const patternStore = usePatternStore();
	const { list } = storeToRefs(patternStore);
	const { createPattern, deletePattern, findPattern } = patternStore;

	// 定义Tree节点结构
	interface Tree {
		id: string;
		label: string;
		type: "pattern" | "rule";
		children?: Tree[];
		rowData: Pattern | Rule;
		[key: string]: any;
	}
	// 默认参数映射
	const defaultProps = {
		children: "children",
		label: "label",
		disabled: "disabled",
	};

	// 列表数据
	const data: ComputedRef<Tree[]> = computed(() => {
		return list.value.map((p) => {
			return {
				id: p.id,
				label: p.mainInfo.name,
				type: "pattern",
				disabled: p.id.includes("#"),
				rowData: p,
				children: p.rules.map((r) => {
					return {
						id: r.id,
						label: r.name,
						type: "rule",
						rowData: r,
						disabled: r.id.includes("#"),
					};
				}),
			} as Tree;
		});
	});

	// 过滤关键词
	const filterText = ref("");
	// tree组件的DOM
	const treeRef = ref<InstanceType<typeof ElTree>>();

	const currentNodeKey = ref("#"); //当前选中的节点
	const defaultExpandedKeys = ref<string[]>([]); //默认展开的节点Key数组

	// 在组件更新前记录默认要展开的节点(防止el-tree组件自动展开或收起)
	onBeforeUpdate(() => {
		// console.log("准备更新");
		defaultExpandedKeys.value = setDefaultExpandedKeys();
	});

	// 获取默认展开的节点key
	const setDefaultExpandedKeys = () => {
		// 获取树形组件实例
		const nodes = treeRef.value?.store._getAllNodes();
		let expandedKeys: string[] = [];
		if (nodes) {
			// 记录所有展开的节点id
			expandedKeys = nodes
				.filter((n) => n.expanded || (n.data as Tree).rowData.state.editing)
				.map((x) => x.data.id as string);
		}
		return expandedKeys;
	};

	// 监听过滤关键词变化
	watch(filterText, (val) => {
		treeRef.value!.filter(val);
	});

	// 过滤Tree节点函数
	const filterNode: any = (value: string, data: Tree) => {
		if (!value) return true;
		return data.label.includes(value);
	};

	// 节点点击时的回调
	const handleNodeClick = (data: Tree, node: Node) => {
		// console.log("点击Tree节点", data, data.type);
		// 判断节点类型
		if (data.type === "rule") {
			// 如果点击的是“规则”节点
			const parent = node.parent.data as Tree;
			const patternId = parent.id;
			// emits("node-click", patternId, data.id);
			patternStore.editing.id = patternId;
			patternStore.editing.ruleId = data.id;
			currentNodeKey.value = data.id;
		} else {
			// 如果点击的是"方案"节点
			const patternId = data.id;
			patternStore.editing.id = patternId;
			patternStore.editing.ruleId = "";
			// 查询是否含义“规则”节点
			const pattern = findPattern(patternId);
			if (pattern?.rules.length) {
				patternStore.editing.ruleId = pattern.rules[0].id;
				currentNodeKey.value = pattern.rules[0].id;
			} else {
				currentNodeKey.value = patternId;
			}
			// emits("node-click", patternId);
		}
	};

	// 创建方案
	function addPattern() {
		createPattern();
	}

	// 删除方案
	function removePattern(node: Node, data: Tree) {
		// console.log("删除方案节点", node, data);
		deletePattern(data.id);
	}

	// 粘贴方案
	function pastePattern() {
		navigator.clipboard
			.readText()
			.then((dataStr) => {
				console.log("剪贴板文本：", dataStr);
				// 先尝试解析成一个对象
				let obj: any;
				try {
					obj = JSON.parse(dataStr);
				} catch (e) {
					ElNotification({
						type: "error",
						title: "失败",
						message: "剪贴板内容解析失败",
						appendTo: ".web-img-collector-notification-container",
					});
					return;
				}
				// 如果成功解析成对象,则进一步尝试解析为方案
				let pattern: Pattern | false = false;
				try {
					pattern = new Pattern(obj);
					// 如果成功解析为方案则添加为方案
					patternStore.list.push(pattern);
					patternStore.saveUserPatternInfo();
					ElNotification({
						type: "success",
						title: "成功",
						message: "成功解析为方案",
						appendTo: ".web-img-collector-notification-container",
					});
				} catch (e) {
					// 如果解析失败则提示错误
					ElNotification({
						type: "error",
						title: "失败",
						message: "剪贴板内容不符合方案的数据格式",
						appendTo: ".web-img-collector-notification-container",
					});
				}
			})
			.catch(() => {
				ElNotification({
					type: "error",
					title: "失败",
					message: "剪贴板内容读取失败",
					appendTo: ".web-img-collector-notification-container",
				});
			});
	}

	// 粘贴规则
	function pasteRule() {
		navigator.clipboard
			.readText()
			.then((dataStr) => {
				console.log("剪贴板文本：", dataStr);
				// 先尝试解析成一个对象
				let obj: any;
				try {
					obj = JSON.parse(dataStr);
				} catch (e) {
					ElNotification({
						type: "error",
						title: "失败",
						message: "剪贴板内容解析失败",
						appendTo: ".web-img-collector-notification-container",
					});
					return;
				}
				// 如果方案解析失败,则进一步尝试解析为规则
				let rule: Rule | false = false;
				try {
					rule = new Rule(obj);
					// 将解析出来的规则添加到当前编辑中的方案中
					if (
						!patternStore.editingPattern ||
						patternStore.editingPattern.id.includes("#")
					) {
						ElNotification({
							type: "error",
							title: "失败",
							message: "请在方案中进行此操作",
							appendTo: ".web-img-collector-notification-container",
						});
						return;
					}
					patternStore.editingPattern.rules.push(rule);
					patternStore.saveUserPatternInfo();
					ElNotification({
						type: "success",
						title: "成功",
						message: "成功解析为规则",
						appendTo: ".web-img-collector-notification-container",
					});
				} catch (e) {
					// 如果解析失败则提示错误
					ElNotification({
						type: "error",
						title: "失败",
						message: "剪贴板内容不符合规则的数据格式",
						appendTo: ".web-img-collector-notification-container",
					});
				}
			})
			.catch(() => {
				ElNotification({
					type: "error",
					title: "失败",
					message: "剪贴板内容读取失败",
					appendTo: ".web-img-collector-notification-container",
				});
			});
	}

	// 添加规则
	function addRule(node: Node, data: Tree) {
		// console.log("添加规则", node, data);
		// 获取方案index
		const index = list.value.findIndex((p) => p.id === data.id);
		// 找到方案
		const pattern = list.value[index];
		// 如果成功找到方案就调用该方案的创建规则方法
		if (pattern) {
			const id = pattern.createRule();
			nextTick(() => {
				defaultExpandedKeys.value = [id]; // 暂存
				treeRef.value?.$forceUpdate();
			});
		}
	}

	// 删除规则
	function removeRule(node: Node, data: Tree) {
		// console.log("删除规则节点", node, data);
		const parent = node.parent.data;
		// 获取方案index
		const patternIndex = list.value.findIndex((p) => p.id === parent.id);
		// 找到方案
		const pattern = list.value[patternIndex];
		if (!pattern) return;
		// 调用方案中的删除规则方法删除规则
		pattern.deleteRule(data.id);
		nextTick(() => {
			defaultExpandedKeys.value = [pattern.id]; // 暂存
			treeRef.value?.$forceUpdate();
		});
	}
</script>

<style lang="scss" scoped>
	.pattern-tree-container {
		display: flex;
		flex-flow: column;
		gap: 6px;
		height: 100%;
		:deep(.wic2-card__body) {
			padding: 4px;
		}
		.pattern-tree__button-group-list {
			display: flex;
			flex-flow: row wrap;
			gap: 4px;
		}

		.pattern-tree {
			flex: 1;
			overflow: hidden;
			display: flex;
			// 必须设置方向这样虚拟滚动条才生效
			flex-direction: column;
			border-radius: 4px;

			:deep(.base-scrollbar__wrap) {
				border-radius: 4px;
				// background: #ffffff;
			}
			:deep(.base-scrollbar__view) {
				box-shadow: var(--wic2-box-shadow-light);
				border-radius: 4px;
				overflow: hidden;
				// background: #ffffff;
			}

			.pattern-tree-filter-input {
				position: sticky;
				top: 0;
			}
		}
	}
	// 自定义节点样式
	.custom-tree-node {
		position: relative;
		flex: auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		overflow: hidden;
		padding-right: 8px;

		// 左侧
		.custom-tree-node-left {
			flex: 1 auto;
			display: flex;
			// background: yellow;
			padding-right: 4px;

			overflow: hidden;

			// 图标
			.custom-tree-node-icon {
				flex: 0;
				display: flex;
				align-items: center;
				margin-right: 1px;
			}
			// 节点名称
			.custom-tree-node-name {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
		// 右侧
		.custom-tree-node-right {
			flex: 0 0;
			padding: 0 4px;
		}
	}

	:deep(.wic2-tree) {
		--wic2-tree-node-content-height: 40px;
		.wic2-tree-node__content {
			position: relative;
			box-sizing: border-box;
		}
		.wic2-button + .wic2-button {
			margin-left: 4px;
		}
	}
</style>

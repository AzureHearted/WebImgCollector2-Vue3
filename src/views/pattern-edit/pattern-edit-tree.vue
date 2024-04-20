<template>
	<div class="pattern-tree-container">
		<el-button-group class="pattern-tree-button-group">
			<el-button type="primary" :icon="CirclePlus" @click="createPattern()">
				新建方案
			</el-button>
			<el-button type="danger" :icon="Delete">批量删除</el-button>
		</el-button-group>
		<el-input
			class="pattern-tree-filter-input"
			clearable
			v-model="filterText"
			placeholder="输入关键词">
		</el-input>
		<el-tree
			class="pattern-tree"
			ref="treeRef"
			:data="data"
			node-key="id"
			show-checkbox
			check-strictly
			:default-expanded-keys="defaultExpandedKeys"
			accordion
			:props="defaultProps"
			:filter-node-method="filterNode"
			@node-click="handleNodeClick">
			<template #default="{ node, data }">
				<span class="custom-tree-node">
					<span>{{ node.label }}</span>
					<span v-if="!data.id.includes('#')">
						<!-- 添加规则 -->
						<el-button
							v-if="data.type === 'pattern'"
							type="primary"
							size="small"
							:icon="CirclePlus"
							circle
							@click.stop="addRule(node, data)">
						</el-button>
						<!-- 删除按钮 -->
						<el-popconfirm
							title="确定删除?"
							:hide-after="0"
							@confirm="
								data.type === 'pattern'
									? removePattern(node, data)
									: removeRule(node, data)
							">
							<template #reference>
								<el-button
									type="danger"
									size="small"
									:icon="Delete"
									circle
									@click.stop>
								</el-button>
							</template>
						</el-popconfirm>
					</span>
				</span>
			</template>
		</el-tree>
	</div>
</template>

<script setup lang="ts">
	import { ref, watch, computed, nextTick } from "vue";
	import type { ComputedRef } from "vue";
	import type { ElTree } from "element-plus";
	import type Node from "element-plus/es/components/tree/src/model/node";
	import { CirclePlus, Delete } from "@element-plus/icons-vue";

	import { storeToRefs } from "pinia";
	import { usePatternStore } from "@/stores";
	const patternStore = usePatternStore();
	const { list } = storeToRefs(patternStore);
	const { createPattern, deletePattern } = patternStore;

	// 定义Tree节点结构
	interface Tree {
		id: string;
		label: string;
		type: "pattern" | "rule";
		children?: Tree[];
		[key: string]: any;
	}
	// 默认参数映射
	const defaultProps = {
		children: "children",
		label: "label",
		disabled: "disabled",
	};
	const currentNodeKey = ref("#"); //当前选中的节点
	const defaultExpandedKeys = ref<string[]>([]); //默认展开的节点Key数组
	// 列表数据
	const data: ComputedRef<Tree[]> = computed(() => {
		return list.value.map((x) => {
			return {
				id: x.id,
				label: x.mainInfo.name,
				type: "pattern",
				disabled: x.id.includes("#"),
				children: x.rules.map((r) => {
					return {
						id: r.id,
						label: r.name,
						type: "rule",
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
	const handleNodeClick = (data: Tree) => {
		console.log("点击Tree节点", data);
	};

	// 删除方案
	const removePattern = (node: Node, data: Tree) => {
		console.log("删除方案节点", node, data);
		deletePattern(data.id);
	};

	// 删除规则
	const removeRule = (node: Node, data: Tree) => {
		console.log("删除规则节点", node, data);
		const parent = node.parent.data;
		// 获取方案index
		const patternIndex = list.value.findIndex((p) => p.id === parent.id);
		// 找到方案
		const pattern = list.value[patternIndex];
		if (!pattern) return;
		// 调用方案中的删除规则方法删除规则
		pattern.deleteRule(data.id);
		defaultExpandedKeys.value = [pattern.id]; // 暂存
		nextTick(() => {
			defaultExpandedKeys.value = []; // 然后清空
			currentNodeKey.value = parent.id;
		});
	};

	// 添加规则
	const addRule = (node: Node, data: Tree) => {
		console.log("添加规则", node, data);
		// 获取方案index
		const index = list.value.findIndex((p) => p.id === data.id);
		// 找到方案
		const pattern = list.value[index];
		// 如果成功找到方案就调用该方案的创建规则方法
		if (pattern) {
			const id = pattern.createRule();
			defaultExpandedKeys.value = [id]; // 暂存
			nextTick(() => {
				defaultExpandedKeys.value = []; // 然后清空
			});
		}
	};
</script>

<style lang="less" scoped>
	.pattern-tree-container {
		display: flex;
		flex-flow: column;
		overflow: hidden;
		max-height: 100%;
		.pattern-tree-button-group {
			// flex: 0;
			margin-bottom: 4px;
		}
		.pattern-tree-filter-input {
			// flex: 0;
		}
		.pattern-tree {
			flex: 1;
			overflow-y: auto;
		}
	}
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
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

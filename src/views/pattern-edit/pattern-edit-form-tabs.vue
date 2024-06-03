<template>
	<div>
		<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
			<el-tab-pane
				:label="`约束区域${
					!isEqual(editingRule?.region, editingRule?.backup?.region) ? '*' : ''
				}`"
				name="region">
				<el-form
					v-if="editingRule"
					ref="form"
					label-position="left"
					:disabled="editingRule!.id.includes('#')">
					<el-form-item label="开启区域约束" label-width="auto">
						<el-checkbox
							label="开启"
							v-model="editingRule!.region.enable"
							:indeterminate="false" />
					</el-form-item>
					<el-form-item
						v-show="editingRule!.region.enable"
						label="选择器"
						label-width="54px">
						<el-input
							v-model="editingRule!.region.selector"
							placeholder="请输入css选择器"
							clearable></el-input>
					</el-form-item>
				</el-form>
			</el-tab-pane>
			<el-tab-pane
				:label="`匹配：源(必填)${
					!isEqual(editingRule?.source, editingRule?.backup?.source) ? '*' : ''
				}`"
				name="source">
				<FormSource v-if="editingRule" v-model:rule="editingRule" />
			</el-tab-pane>
			<el-tab-pane
				:label="`匹配：预览源${
					!isEqual(editingRule?.preview, editingRule?.backup?.preview)
						? '*'
						: ''
				}`"
				name="preview">
				<FormPreview v-if="editingRule" v-model:rule="editingRule" />
			</el-tab-pane>
			<el-tab-pane
				:label="`匹配：描述${
					!isEqual(editingRule?.description, editingRule?.backup?.description)
						? '*'
						: ''
				}`"
				name="description">
				<FormDescription v-if="editingRule" v-model:rule="editingRule" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts" setup>
	import { ref } from "vue";
	import { isEqual } from "@/plugin/lodash";
	import type { TabsPaneContext } from "element-plus";
	import type { Rule } from "@/stores/patternStore/class/Rule";
	import type { BaseFix } from "@/stores/patternStore/interface/Pattern";

	import FixFrom from "./form/card-from-fix.vue";
	import FormSource from "./form/form-source.vue";
	import FormPreview from "./form/form-preview.vue";
	import FormDescription from "./form/form-description.vue";

	import { storeToRefs } from "pinia";
	import { usePatternStore } from "@/stores";

	const patternStore = usePatternStore();
	const { editingRule } = storeToRefs(patternStore);

	const activeName = ref("region");

	function handleClick(tab: TabsPaneContext, event: Event) {
		// console.log(tab, event);
	}

	// 添加修正方法
	function addFixItem(
		matchItem: "source" | "preview" | "description",
		type: BaseFix["type"]
	) {
		if (!editingRule.value) return;
		let fixItem: BaseFix;
		if (type === "regex-extract") {
			fixItem = {
				type,
				expression: "",
				flags: [],
			};
		} else {
			fixItem = {
				type,
				expression: "",
				flags: [],
				replaceTo: "",
			};
		}
		editingRule.value[matchItem].fix.push(fixItem);
	}
</script>

<style lang="scss" scoped>
	.fix-item-card {
		flex: 1;
		margin: 0 6px;
		:deep(.wic2-card__header) {
			padding: 4px 10px;
		}
		:deep(.wic2-card__body) {
			padding: 4px 10px;
		}
		:deep(.wic2-card__footer) {
			padding: 8px 10px;
		}

		:deep(.wic2-form-item) {
			&:nth-child(1) {
				margin-top: 6px;
			}
			margin-bottom: 6px;
		}
	}

	.form-card-header {
		display: flex;
		justify-content: space-between;

		.form-card-header-left {
			display: flex;
			align-items: center;
			gap: 8px;
		}
	}
</style>

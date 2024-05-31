<template>
	<div>
		<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
			<el-tab-pane
				:label="`约束区域${
					!_.isEqual(editingRule?.region, editingRule?.backup?.region)
						? '*'
						: ''
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
					!_.isEqual(editingRule?.source, editingRule?.backup?.source)
						? '*'
						: ''
				}`"
				name="source">
				<el-form
					v-if="editingRule"
					ref="form"
					label-position="left"
					:disabled="editingRule!.id.includes('#')">
					<el-form-item label="选择器" label-width="54px">
						<el-input
							v-model="editingRule!.source.selector"
							placeholder="请输入css选择器"
							clearable>
							<template v-if="editingRule.region.enable" #prepend>
								{{ editingRule.region.selector }}
							</template>
						</el-input>
					</el-form-item>
					<el-form-item label="类型" label-width="54px">
						<el-select
							v-model="editingRule!.source.infoType"
							placeholder="选择要提取的类型">
							<el-option value="value" label="值" />
							<el-option value="attribute" label="Attribute属性" />
							<el-option value="property" label="Property属性" />
							<el-option value="innerText" label="innerText 内部文本" />
							<el-option value="innerHTML" label="innerHTML 内部HTML" />
							<el-option value="outerHTML" label="outerHTML 全部HTML" />
						</el-select>
					</el-form-item>
					<el-form-item label="属性名" label-width="54px">
						<el-input
							v-model="editingRule!.source.name"
							placeholder="请输入要匹配的属性值名称 (仅在“属性”类型下生效)"
							clearable></el-input>
					</el-form-item>
				</el-form>
			</el-tab-pane>
			<el-tab-pane
				:label="`匹配：预览源${
					!_.isEqual(editingRule?.preview, editingRule?.backup?.preview)
						? '*'
						: ''
				}`"
				name="preview">
				<el-form
					v-if="editingRule"
					ref="form"
					label-position="left"
					:disabled="editingRule!.id.includes('#')">
					<el-form-item label="开启预览源匹配" label-width="auto">
						<el-checkbox
							label="开启"
							v-model="editingRule!.preview.enable"
							:indeterminate="false" />
					</el-form-item>
					<el-form-item
						label="来源"
						label-width="54px"
						v-show="editingRule!.preview.enable">
						<el-select
							v-model="editingRule!.preview.origin"
							placeholder="选择数据来源">
							<el-option value="custom" label="自定义" />
							<el-option
								value="region"
								label="约束区域"
								:disabled="!editingRule.region.enable" />
							<el-option value="source" label="源" />
						</el-select>
					</el-form-item>
					<el-form-item
						label="选择器"
						label-width="54px"
						v-show="editingRule!.preview.enable&&editingRule!.preview.origin==='custom'">
						<el-input
							v-model="editingRule!.preview.selector"
							placeholder="请输入css选择器"
							clearable>
							<template v-if="editingRule.region.enable" #prepend>
								{{ editingRule.region.selector }}
							</template>
						</el-input>
					</el-form-item>
					<el-form-item
						label="类型"
						label-width="54px"
						v-show="editingRule!.preview.enable">
						<el-select
							v-model="editingRule!.preview.infoType"
							placeholder="选择要提取的类型">
							<el-option value="value" label="值" />
							<el-option value="attribute" label="Attribute属性" />
							<el-option value="property" label="Property属性" />
							<el-option value="innerText" label="innerText 内部文本" />
							<el-option value="innerHTML" label="innerHTML 内部HTML" />
							<el-option value="outerHTML" label="outerHTML 全部HTML" />
						</el-select>
					</el-form-item>
					<el-form-item
						label="属性名"
						label-width="54px"
						v-show="editingRule!.preview.enable">
						<el-input
							v-model="editingRule!.preview.name"
							placeholder="请输入要匹配的属性值名称 (仅在“属性”类型下生效)"
							clearable></el-input>
					</el-form-item>
				</el-form>
			</el-tab-pane>
			<el-tab-pane
				:label="`匹配：描述${
					!_.isEqual(editingRule?.description, editingRule?.backup?.description)
						? '*'
						: ''
				}`"
				name="description">
				<el-form
					v-if="editingRule"
					ref="form"
					label-position="left"
					:disabled="editingRule!.id.includes('#')">
					<el-form-item label="开启描述匹配" label-width="auto">
						<el-checkbox
							label="开启"
							v-model="editingRule!.description.enable"
							:indeterminate="false" />
					</el-form-item>
					<el-form-item
						label="来源"
						label-width="54px"
						v-show="editingRule!.description.enable">
						<el-select
							v-model="editingRule!.description.origin"
							placeholder="选择数据来源">
							<el-option value="custom" label="自定义" />
							<el-option
								value="region"
								label="约束区域"
								:disabled="!editingRule.region.enable" />
							<el-option value="source" label="源" />
							<el-option
								value="preview"
								label="预览源"
								:disabled="!editingRule.preview.enable" />
						</el-select>
					</el-form-item>
					<el-form-item
						label="选择器"
						label-width="54px"
						v-show="editingRule!.description.enable&&editingRule!.description.origin==='custom'">
						<el-input
							v-model="editingRule!.description.selector"
							placeholder="请输入css选择器"
							clearable>
							<template v-if="editingRule.region.enable" #prepend>
								{{ editingRule.region.selector }}
							</template>
						</el-input>
					</el-form-item>
					<el-form-item
						label="类型"
						label-width="54px"
						v-show="editingRule!.description.enable">
						<el-select
							v-model="editingRule!.description.infoType"
							placeholder="选择要提取的类型">
							<el-option value="value" label="值" />
							<el-option value="attribute" label="Attribute属性" />
							<el-option value="property" label="Property属性" />
							<el-option value="innerText" label="innerText 内部文本" />
							<el-option value="innerHTML" label="innerHTML 内部HTML" />
							<el-option value="outerHTML" label="outerHTML 全部HTML" />
						</el-select>
					</el-form-item>
					<el-form-item
						label="属性名"
						label-width="54px"
						v-show="editingRule!.description.enable">
						<el-input
							v-model="editingRule!.description.name"
							placeholder="请输入要匹配的属性值名称 (仅在“属性”类型下生效)"
							clearable></el-input>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts" setup>
	import { ref } from "vue";
	import _ from "lodash";
	import type { TabsPaneContext } from "element-plus";

	import { storeToRefs } from "pinia";
	import { usePatternStore } from "@/stores";
	const patternStore = usePatternStore();
	const { editingRule } = storeToRefs(patternStore);

	const activeName = ref("region");

	const handleClick = (tab: TabsPaneContext, event: Event) => {
		// console.log(tab, event);
	};
</script>

<style lang="sass"></style>

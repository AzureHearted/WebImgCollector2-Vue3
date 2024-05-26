<template>
	<div>
		<el-form
			v-if="editingPattern"
			ref="form"
			label-width="90px"
			label-position="left"
			:disabled="editingPattern!.id.includes('#')">
			<el-form-item label="名称" label-width="40px">
				<el-input
					v-model="editingPattern!.mainInfo.name"
					placeholder=""
					clearable></el-input>
			</el-form-item>
			<el-form-item label="域名" label-width="40px">
				<el-input
					v-model="editingPattern!.mainInfo.host"
					placeholder=""
					clearable></el-input>
			</el-form-item>
			<el-form-item label="标题选择器">
				<el-input
					v-model="editingPattern!.mainInfo.titleSelector"
					placeholder=""
					clearable></el-input>
			</el-form-item>
		</el-form>
		<!-- 下方规则Tabs -->
		<FormTabs />
		{{ editingRule }}
	</div>
</template>

<script setup lang="ts">
	import FormTabs from "./pattern-edit-form-tabs.vue";

	import { storeToRefs } from "pinia";
	import { usePatternStore } from "@/stores";
	const patternStore = usePatternStore();
	const { editingPattern, editingRule } = storeToRefs(patternStore);
	const { findRule } = patternStore;
</script>

<style lang="scss" scoped>
	:deep(.wic2-form-item__label) {
		color: black;
	}
</style>

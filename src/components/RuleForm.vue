<template>
	<el-tabs v-model="info.activeName" type="border-card" @tab-click="" v-if="formData != null">
		<!-- *首选项 -->
		<el-tab-pane label="首选项" name="main">
			<el-form :model="formData.main" label-width="80px" size="small">
				<el-form-item label="规则名称">
					<el-input v-model="formData.main.name" />
				</el-form-item>
				<el-form-item label="根网址">
					<el-input v-model="formData.main.domainName" />
				</el-form-item>
				<el-form-item label="路径过滤器">
					<el-input v-model="formData.main.pathFilter" />
				</el-form-item>
			</el-form>
		</el-tab-pane>
		<!-- *链接 -->
		<el-tab-pane label="链接(必填)" name="linkUrl">
			<el-form :model="formData.linkUrl" label-width="80px" size="small">
				<el-form-item label="css选择器">
					<el-input v-model="formData.linkUrl.selector" type="textarea" />
				</el-form-item>
				<el-form-item label="提取类型">
					<el-select v-model="formData.linkUrl.infoType" placeholder="选择要提取的类型">
						<el-option :value="1" label="值" />
						<el-option :value="2" label="Attribute属性" />
						<el-option :value="3" label="Property属性" />
						<el-option :value="4" label="innerText 内部文本" />
						<el-option :value="5" label="innerHTML 内部HTML" />
						<el-option :value="6" label="outerHTML 全部HTML" />
					</el-select>
				</el-form-item>
				<el-form-item label="属性名">
					<el-input v-model="formData.linkUrl.attribute" type="textarea" />
				</el-form-item>
			</el-form>
		</el-tab-pane>
		<!-- *图链 -->
		<el-tab-pane label="图链" name="picUrl">
			<el-form :model="formData.picUrl" label-width="80px" size="small">
				<el-form-item label="启用">
					<el-checkbox v-model="formData.picUrl.enable" type="checkbox" />
				</el-form-item>
				<el-form-item label="css选择器" v-if="formData.picUrl.enable">
					<el-input v-model="formData.picUrl.selector" type="textarea" />
				</el-form-item>
				<el-form-item label="提取类型" v-if="formData.picUrl.enable">
					<el-select v-model="formData.picUrl.infoType" placeholder="选择要提取的类型">
						<el-option :value="1" label="值" />
						<el-option :value="2" label="Attribute属性" />
						<el-option :value="3" label="Property属性" />
						<el-option :value="4" label="innerText 内部文本" />
						<el-option :value="5" label="innerHTML 内部HTML" />
						<el-option :value="6" label="outerHTML 全部HTML" />
					</el-select>
				</el-form-item>
				<el-form-item label="属性名" v-if="formData.picUrl.enable">
					<el-input v-model="formData.picUrl.attribute" type="textarea" />
				</el-form-item>
			</el-form>
		</el-tab-pane>
		<!-- *名称 -->
		<el-tab-pane label="名称" name="name">
			<el-form :model="formData.name" label-width="80px" size="small">
				<el-form-item label="启用">
					<el-checkbox v-model="formData.name.enable" type="checkbox" />
				</el-form-item>
				<el-form-item label="css选择器" v-if="formData.name.enable">
					<el-input v-model="formData.name.selector" type="textarea" />
				</el-form-item>
				<el-form-item label="提取类型" v-if="formData.name.enable">
					<el-select v-model="formData.name.infoType" placeholder="选择要提取的类型">
						<el-option :value="1" label="值" />
						<el-option :value="2" label="Attribute属性" />
						<el-option :value="3" label="Property属性" />
						<el-option :value="4" label="innerText 内部文本" />
						<el-option :value="5" label="innerHTML 内部HTML" />
						<el-option :value="6" label="outerHTML 全部HTML" />
					</el-select>
				</el-form-item>
				<el-form-item label="属性名" v-if="formData.name.enable">
					<el-input v-model="formData.name.attribute" type="textarea" />
				</el-form-item>
			</el-form>
		</el-tab-pane>
		<!-- *元信息 -->
		<el-tab-pane label="元信息" name="meta">
			<el-form :model="formData.meta" label-width="80px" size="small">
				<el-form-item label="启用">
					<el-checkbox v-model="formData.meta.enable" type="checkbox" />
				</el-form-item>
				<el-form-item label="css选择器" v-if="formData.meta.enable">
					<el-input v-model="formData.meta.selector" type="textarea" />
				</el-form-item>
				<el-form-item label="提取类型" v-if="formData.meta.enable">
					<el-select v-model="formData.meta.infoType" placeholder="选择要提取的类型">
						<el-option :value="1" label="值" />
						<el-option :value="2" label="Attribute属性" />
						<el-option :value="3" label="Property属性" />
						<el-option :value="4" label="innerText 内部文本" />
						<el-option :value="5" label="innerHTML 内部HTML" />
						<el-option :value="6" label="outerHTML 全部HTML" />
					</el-select>
				</el-form-item>
				<el-form-item label="属性名" v-if="formData.meta.enable">
					<el-input v-model="formData.meta.attribute" type="textarea" />
				</el-form-item>
			</el-form>
		</el-tab-pane>
	</el-tabs>
</template>

<script setup>
	import {Rule} from "../js/public.js";

	const props = defineProps({
		formData: {
			type: Object,
			default() {
				return new Rule();
			},
		},
	});

	const info = reactive({
		activeName: "main",
	});

	watch(
		() => props.formData,
		(newVal, oldVal) => {
			info.activeName = "main";
		}
	);
</script>

<style lang="scss" scoped></style>

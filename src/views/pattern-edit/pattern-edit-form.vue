<template>
	<div class="form-container">
		<el-card v-if="editingPattern" class="form-card">
			<template #header>
				<div class="form-card-header">
					<div class="form-card-header-left">
						<i-material-symbols-box-edit
							v-if="editingPattern?.id.includes('#')" />
						<BaseImg
							v-else
							:src="editingPattern?.mainInfo.icon"
							style="width: 16px; height: 16px"></BaseImg>
						<span>{{ editingPattern?.mainInfo?.name }}</span>
						<!-- 在新窗口打开 -->
						<el-button
							v-if="!editingPattern?.id.includes('#')"
							type="success"
							circle
							text
							@click="open()">
							<i-material-symbols-open-in-new />
						</el-button>
					</div>
					<div class="form-card-header-right">
						<!-- 下载方案 -->
						<el-button
							type="success"
							circle
							text
							@click="saveToFile(editingPattern)">
							<i-material-symbols-download />
						</el-button>
						<!-- 拷贝方案至剪贴板 -->
						<el-button
							type="primary"
							circle
							text
							@click="copyToClipboard(editingPattern)">
							<i-ep-document-copy />
						</el-button>
					</div>
				</div>
			</template>
			<!-- 方案表单 -->
			<el-form
				v-if="editingPattern"
				ref="form"
				label-position="left"
				:disabled="editingPattern!.id.includes('#')">
				<el-form-item label="方案名称">
					<el-input
						v-model="editingPattern!.mainInfo.name"
						placeholder=""
						clearable></el-input>
				</el-form-item>
				<el-form-item label="域名">
					<el-input
						v-model="editingPattern!.mainInfo.host"
						placeholder=""
						clearable></el-input>
				</el-form-item>
				<el-form-item label="过滤器">
					<el-input
						v-model="editingPattern!.mainInfo.filter.expression"
						placeholder="输入正则表达式">
						<!-- s输入框前置内容 -->
						<!-- <template #prepend> 正则 </template> -->
						<!-- s输入框头部内容 -->
						<template #prefix> / </template>
						<!-- s输入框尾部内容 -->
						<template #suffix> / </template>
						<!-- s输入框后置内容 -->
						<template #append>
							<el-select
								style="width: 120px"
								multiple
								collapse-tags
								collapse-tags-tooltip
								clearable
								v-model="editingPattern!.mainInfo.filter.flags"
								placeholder="修饰符">
								<el-tooltip
									:show-after="500"
									effect="dark"
									content="ignore - 不区分大小写"
									placement="top">
									<el-option :value="'i'" label="i" />
								</el-tooltip>
								<el-tooltip
									:show-after="500"
									effect="dark"
									content="特殊字符圆点 . 中包含换行符 \n"
									placement="top">
									<el-option :value="'s'" label="s" />
								</el-tooltip>
							</el-select>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item label="图标">
					<el-input
						v-model="editingPattern!.mainInfo.icon"
						placeholder="输入图标地址"
						clearable>
						<template v-if="editingPattern!.mainInfo.icon.length" #append>
							<el-image
								style="aspect-ratio: 1; height: 24px"
								:src="editingPattern!.mainInfo.icon">
								<template #error>
									<span></span>
								</template>
							</el-image>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item label="标题选择器">
					<el-input
						v-model="editingPattern!.mainInfo.titleSelector"
						placeholder=""
						clearable></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button type="success" @click="save">
					<template #icon>
						<i-material-symbols-save />
					</template>
					<el-badge
						is-dot
						:hidden="!editingPattern?.isChange()"
						:offset="[15, -7]">
						保存
					</el-badge>
				</el-button>
				<el-button type="warning" @click="reset">
					<template #icon>
						<i-material-symbols-reset-wrench-rounded />
					</template>
					重置
				</el-button>
			</template>
		</el-card>
		<!-- 规则表单 -->
		<el-card v-if="editingRule">
			<template #header>
				<div class="form-card-header">
					<div class="form-card-header-left">
						<i-material-symbols-regular-expression-rounded />
						{{ editingRule?.name }}
					</div>
					<div class="form-card-header-right">
						<!-- 下载规则 -->
						<el-button
							type="success"
							circle
							text
							@click="saveToFile(editingRule)">
							<i-material-symbols-download />
						</el-button>
						<!-- 拷贝方案至剪贴板 -->
						<el-button
							type="primary"
							circle
							text
							@click="copyToClipboard(editingRule)">
							<i-ep-document-copy />
						</el-button>
					</div>
				</div>
			</template>
			<el-switch
				v-model="editingRule.enable"
				:disabled="editingRule!.id.includes('#')"
				active-text="启用"
				inactive-text="禁用" />
			<FormTabs />
		</el-card>
	</div>
</template>

<script setup lang="ts">
	import FormTabs from "./pattern-edit-form-tabs.vue";
	import BaseImg from "@/components/base/base-img.vue";
	import { ElNotification } from "@/plugin/element-plus";

	import { storeToRefs } from "pinia";
	import { usePatternStore } from "@/stores";
	import { Pattern } from "@/stores/patternStore/class/Pattern";
	import type { Rule } from "@/stores/patternStore/class/Rule";
	import { useClipboard } from "@vueuse/core";
	import { saveAs } from "file-saver";
	const patternStore = usePatternStore();
	const { editingPattern, editingRule } = storeToRefs(patternStore);
	const { saveUserPatternInfo } = patternStore;

	// 保存结果
	function save() {
		// console.log(editingPattern.value?.getJson());
		editingPattern.value?.backupData(); //先进行备份
		saveUserPatternInfo(); // 备份后进行数据存储
	}
	// 重置表单
	function reset() {
		editingPattern.value?.recoveryData();
	}

	// 拷贝方案(或规则)至剪贴板
	function copyToClipboard(obj: Pattern | Rule) {
		const { copy } = useClipboard();
		const rowData = JSON.stringify(obj.getRowData({ includeId: false }));
		copy(rowData)
			.then(() => {
				ElNotification({
					type: "success",
					title: "成功",
					message:
						obj instanceof Pattern
							? `方案“${obj.mainInfo.name}”拷贝成功！`
							: `规则“${obj.name}”拷贝成功！`,
					appendTo: ".web-img-collector-notification-container",
				});
			})
			.catch(() => {
				ElNotification({
					type: "error",
					title: "失败",
					message:
						obj instanceof Pattern
							? `方案“${obj.mainInfo.name}”拷贝失败`
							: `规则“${obj.name}”拷贝失败`,
					appendTo: ".web-img-collector-notification-container",
				});
			});
	}

	// 保存方案(或规则)至本地文件
	function saveToFile(obj: Pattern | Rule) {
		const rowData = JSON.stringify(obj.getRowData({ includeId: true }));
		// 将文本转为blob
		const blob = new Blob([rowData], { type: "text/plain;charset=utf-8" });
		if (obj instanceof Pattern) {
			saveAs(blob, `WebImgCollector2 方案-${obj.mainInfo.name}.txt`);
		} else {
			saveAs(blob, `WebImgCollector2 规则-${obj.name}.txt`);
		}
	}

	// 打开对应网站
	async function open() {
		if (!editingPattern.value) return;
		let { host: url } = editingPattern.value.mainInfo;
		if (!url.trim()) return;
		url = "https://" + url.trim();
		window.open(url, "_blank");
	}
</script>

<style lang="scss" scoped>
	.form-container {
		// max-width: 800px;
	}
	.form-card {
		margin-bottom: 8px;
	}
	:deep(.wic2-card__header),
	:deep(.wic2-card__footer) {
		padding: 8px 20px;
	}
	:deep(.wic2-card__body) {
		padding-bottom: 0;
	}
	.form-card-header {
		display: flex;
		justify-content: space-between;
		font-size: 14px;

		.form-card-header-left {
			display: flex;
			align-items: center;
			gap: 8px;
		}
	}
	.form-container :deep(.wic2-form-item__label) {
		color: black;
	}
	.form-container :deep(.wic2-input-group__append .wic2-select__wrapper) {
		box-shadow: unset;
	}
</style>

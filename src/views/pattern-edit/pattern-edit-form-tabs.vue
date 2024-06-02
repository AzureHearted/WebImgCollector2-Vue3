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
					<el-form-item label="结果修正">
						<el-form>
							<!-- 修正项目添加 -->
							<el-form-item>
								<el-dropdown trigger="click" placement="bottom">
									<el-button type="success">添加修正规则</el-button>
									<template #dropdown>
										<el-dropdown-menu>
											<el-dropdown-item
												@click="addFixItem('source', 'regex-extract')">
												正则提取
											</el-dropdown-item>
											<el-dropdown-item
												@click="addFixItem('source', 'regex-replace')">
												正则替换
											</el-dropdown-item>
										</el-dropdown-menu>
									</template>
								</el-dropdown>
							</el-form-item>
							<!-- 修正列表 -->
							<!-- <el-form-item>
								
							</el-form-item> -->
						</el-form>
					</el-form-item>
					<!-- 修正项 -->
					<el-form-item
						v-for="(item, index) in editingRule.source.fix"
						:key="index">
						<el-card class="fix-item-card" shadow="hover">
							<template #header>
								<div class="form-card-header">
									<div class="form-card-header-left">
										<span>
											<span v-if="editingRule.source.fix.length > 1">
												{{ index + 1 }}-
											</span>
											{{
												item.type === "regex-extract" ? "正则提取" : "正则替换"
											}}
										</span>
									</div>
									<div class="form-card-header-right">
										<!-- 删除 -->
										<el-button
											type="danger"
											circle
											plain
											@click="editingRule.source.fix.splice(index, 1)">
											<template #icon>
												<i-material-symbols-delete-rounded />
											</template>
										</el-button>
									</div>
								</div>
							</template>
							<el-form label-position="left">
								<el-form-item
									:label="
										item.type === 'regex-extract' ? '提取表达式' : '匹配表达式'
									">
									<el-input
										v-model="item.expression"
										placeholder="输入正则表达式">
										<template #prefix> / </template>
										<template #suffix> / </template>
										<template #append>
											<el-select
												style="width: 120px"
												multiple
												collapse-tags
												collapse-tags-tooltip
												clearable
												v-model="item.flags"
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
								<el-form-item
									v-if="item.type === 'regex-replace'"
									label="替换表达式">
									<el-input
										v-model="item.replaceTo"
										placeholder="输入正则表达式" />
								</el-form-item>
							</el-form>
						</el-card>
					</el-form-item>
				</el-form>
			</el-tab-pane>
			<el-tab-pane
				:label="`匹配：预览源${
					!isEqual(editingRule?.preview, editingRule?.backup?.preview)
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
					<el-form-item label="结果修正">
						<el-form>
							<!-- 修正项目添加 -->
							<el-form-item>
								<el-dropdown trigger="click" placement="bottom">
									<el-button type="success">添加修正规则</el-button>
									<template #dropdown>
										<el-dropdown-menu>
											<el-dropdown-item
												@click="addFixItem('preview', 'regex-extract')">
												正则提取
											</el-dropdown-item>
											<el-dropdown-item
												@click="addFixItem('preview', 'regex-replace')">
												正则替换
											</el-dropdown-item>
										</el-dropdown-menu>
									</template>
								</el-dropdown>
							</el-form-item>
							<!-- 修正列表 -->
							<!-- <el-form-item>
				
			</el-form-item> -->
						</el-form>
					</el-form-item>
					<!-- 修正项 -->
					<el-form-item
						v-for="(item, index) in editingRule.preview.fix"
						:key="index">
						<el-card class="fix-item-card" shadow="hover">
							<template #header>
								<div class="form-card-header">
									<div class="form-card-header-left">
										<span>
											<span v-if="editingRule.preview.fix.length > 1">
												{{ index + 1 }}-
											</span>
											{{
												item.type === "regex-extract" ? "正则提取" : "正则替换"
											}}
										</span>
									</div>
									<div class="form-card-header-right">
										<!-- 删除 -->
										<el-button
											type="danger"
											circle
											plain
											@click="editingRule.preview.fix.splice(index, 1)">
											<template #icon>
												<i-material-symbols-delete-rounded />
											</template>
										</el-button>
									</div>
								</div>
							</template>
							<el-form label-position="left">
								<el-form-item
									:label="
										item.type === 'regex-extract' ? '提取表达式' : '匹配表达式'
									">
									<el-input
										v-model="item.expression"
										placeholder="输入正则表达式">
										<template #prefix> / </template>
										<template #suffix> / </template>
										<template #append>
											<el-select
												style="width: 120px"
												multiple
												collapse-tags
												collapse-tags-tooltip
												clearable
												v-model="item.flags"
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
								<el-form-item
									v-if="item.type === 'regex-replace'"
									label="替换表达式">
									<el-input
										v-model="item.replaceTo"
										placeholder="输入正则表达式" />
								</el-form-item>
							</el-form>
						</el-card>
					</el-form-item>
				</el-form>
			</el-tab-pane>
			<el-tab-pane
				:label="`匹配：描述${
					!isEqual(editingRule?.description, editingRule?.backup?.description)
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
					<el-form-item label="结果修正">
						<el-form>
							<!-- 修正项目添加 -->
							<el-form-item>
								<el-dropdown trigger="click" placement="bottom">
									<el-button type="success">添加修正规则</el-button>
									<template #dropdown>
										<el-dropdown-menu>
											<el-dropdown-item
												@click="addFixItem('description', 'regex-extract')">
												正则提取
											</el-dropdown-item>
											<el-dropdown-item
												@click="addFixItem('description', 'regex-replace')">
												正则替换
											</el-dropdown-item>
										</el-dropdown-menu>
									</template>
								</el-dropdown>
							</el-form-item>
							<!-- 修正列表 -->
							<!-- <el-form-item>
				
			</el-form-item> -->
						</el-form>
					</el-form-item>
					<!-- 修正项 -->
					<el-form-item
						v-for="(item, index) in editingRule.description.fix"
						:key="index">
						<el-card class="fix-item-card" shadow="hover">
							<template #header>
								<div class="form-card-header">
									<div class="form-card-header-left">
										<span>
											<span v-if="editingRule.description.fix.length > 1">
												{{ index + 1 }}-
											</span>
											{{
												item.type === "regex-extract" ? "正则提取" : "正则替换"
											}}
										</span>
									</div>
									<div class="form-card-header-right">
										<!-- 删除 -->
										<el-button
											type="danger"
											circle
											plain
											@click="editingRule.description.fix.splice(index, 1)">
											<template #icon>
												<i-material-symbols-delete-rounded />
											</template>
										</el-button>
									</div>
								</div>
							</template>
							<el-form label-position="left">
								<el-form-item
									:label="
										item.type === 'regex-extract' ? '提取表达式' : '匹配表达式'
									">
									<el-input
										v-model="item.expression"
										placeholder="输入正则表达式">
										<template #prefix> / </template>
										<template #suffix> / </template>
										<template #append>
											<el-select
												style="width: 120px"
												multiple
												collapse-tags
												collapse-tags-tooltip
												clearable
												v-model="item.flags"
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
								<el-form-item
									v-if="item.type === 'regex-replace'"
									label="替换表达式">
									<el-input
										v-model="item.replaceTo"
										placeholder="输入正则表达式" />
								</el-form-item>
							</el-form>
						</el-card>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts" setup>
	import { ref } from "vue";
	import { isEqual } from "@/plugin/lodash";
	import type { TabsPaneContext } from "element-plus";

	import { storeToRefs } from "pinia";
	import { usePatternStore } from "@/stores";
	import type { Rule } from "@/stores/patternStore/class/Rule";
	import type { BaseFix } from "@/stores/patternStore/interface/Pattern";
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

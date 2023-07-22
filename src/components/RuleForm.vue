<template>
	<el-tabs
		v-model="info.activeName"
		type="border-card"
		@tab-click=""
		v-if="formData != undefined">
		<!-- !首选项 -->
		<el-tab-pane label="首选项" name="main">
			<el-form :model="formData.main" label-width="100px">
				<el-form-item label="规则名称">
					<el-input v-model="formData.main.name" />
				</el-form-item>
				<el-form-item label="根网址">
					<el-input v-model="formData.main.domainName" />
				</el-form-item>
				<el-form-item label="路径过滤器">
					<el-input
						v-model="formData.main.pathFilter.pattern"
						placeholder="(正则表达式)">
						<!-- *输入框前置内容 -->
						<!-- <template #prepend> 正则 </template> -->
						<!-- *输入框头部内容 -->
						<template #prefix> / </template>
						<!-- *输入框尾部内容 -->
						<template #suffix> / </template>
						<!-- *输入框后置内容 -->
						<template #append>
							<el-select
								style="width: 180px"
								multiple
								v-model="formData.main.pathFilter.flags"
								placeholder="修饰符">
								<el-tooltip
									:show-after="500"
									effect="dark"
									content="global - 全局匹配"
									placement="top">
									<el-option :value="'g'" label="g" />
								</el-tooltip>
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
				<!-- f标题选择器 -->
				<el-form-item label="标题选择器">
					<!-- *输入框-->
					<span style="flex-grow: 1">
						<el-input v-model="formData.main.titleSelector" type="text" />
					</span>
				</el-form-item>
			</el-form>
		</el-tab-pane>
		<!-- !dom限制 -->
		<el-tab-pane label="dom限定" name="domItem">
			<el-form :model="formData.domItem" label-width="100px">
				<!-- f启用按钮 -->
				<el-form-item label="启用">
					<el-checkbox v-model="formData.domItem.enable" type="checkbox" />
				</el-form-item>
				<!-- f选择器 -->
				<el-form-item
					:label="`css选择器${index + 1}`"
					v-if="formData.domItem.enable"
					v-for="(selector, index) in formData.domItem.selector"
					:key="index">
					<!-- *输入框-->
					<span style="flex-grow: 1">
						<el-input v-model="formData.domItem.selector[index]" type="text" />
					</span>
					<!-- *侧边按钮 - 增加匹配规则-->
					<span class="side-button add-match-item">
						<HoverButton @click="pushMatchItem(index)">
							<template #default>
								<el-icon><i-ep-CirclePlus /></el-icon>
							</template>
							<template #hover>
								<el-icon><i-ep-CirclePlusFilled /></el-icon>
							</template>
						</HoverButton>
					</span>
					<!-- *侧边按钮 - 删除匹配规则-->
					<span class="side-button remove-match-item">
						<HoverButton @click="removeMatchItem(index)">
							<template #default>
								<el-icon><i-ep-Remove /></el-icon>
							</template>
							<template #hover>
								<el-icon><i-ep-RemoveFilled /></el-icon>
							</template>
						</HoverButton>
					</span>
				</el-form-item>
			</el-form>
		</el-tab-pane>
		<!-- !链接 -->
		<el-tab-pane label="链接(必填)" name="linkUrl">
			<el-form :model="formData.linkUrl" label-width="100px">
				<!-- f选择器 -->
				<el-form-item
					:label="`css选择器${index + 1}`"
					v-for="(selector, index) in formData.linkUrl.selector"
					:key="index">
					<!-- *输入框-->
					<span style="flex-grow: 1">
						<el-input v-model="formData.linkUrl.selector[index]" type="text" />
					</span>
					<!-- *侧边按钮 - 增加匹配规则-->
					<span class="side-button add-match-item">
						<HoverButton @click="pushMatchItem(index)">
							<template #default>
								<el-icon><i-ep-CirclePlus /></el-icon>
							</template>
							<template #hover>
								<el-icon><i-ep-CirclePlusFilled /></el-icon>
							</template>
						</HoverButton>
					</span>
					<!-- *侧边按钮 - 删除匹配规则-->
					<span class="side-button remove-match-item">
						<HoverButton @click="removeMatchItem(index)">
							<template #default>
								<el-icon><i-ep-Remove /></el-icon>
							</template>
							<template #hover>
								<el-icon><i-ep-RemoveFilled /></el-icon>
							</template>
						</HoverButton>
					</span>
				</el-form-item>
				<!-- f提取类型 -->
				<el-form-item label="提取类型">
					<el-select
						v-model="formData.linkUrl.infoType"
						placeholder="选择要提取的类型">
						<el-option :value="1" label="值" />
						<el-option :value="2" label="Attribute属性" />
						<el-option :value="3" label="Property属性" />
						<el-option :value="4" label="innerText 内部文本" />
						<el-option :value="5" label="innerHTML 内部HTML" />
						<el-option :value="6" label="outerHTML 全部HTML" />
					</el-select>
				</el-form-item>
				<!-- f匹配属性 -->
				<el-form-item
					:label="`匹配属性${index + 1}`"
					v-for="(attribute, index) in formData.linkUrl.attribute"
					:key="index">
					<!-- *输入框-->
					<span style="flex-grow: 1">
						<el-input v-model="formData.linkUrl.attribute[index]" type="text" />
					</span>
					<!-- *侧边按钮 - 增加匹配规则-->
					<span class="side-button add-match-item">
						<HoverButton @click="pushMatchItem(index)">
							<template #default>
								<el-icon><i-ep-CirclePlus /></el-icon>
							</template>
							<template #hover>
								<el-icon><i-ep-CirclePlusFilled /></el-icon>
							</template>
						</HoverButton>
					</span>
					<!-- *侧边按钮 - 删除匹配规则-->
					<span class="side-button remove-match-item">
						<HoverButton @click="removeMatchItem(index)">
							<template #default>
								<el-icon><i-ep-Remove /></el-icon>
							</template>
							<template #hover>
								<el-icon><i-ep-RemoveFilled /></el-icon>
							</template>
						</HoverButton>
					</span>
				</el-form-item>
			</el-form>
		</el-tab-pane>
		<!-- !图链 -->
		<el-tab-pane label="图链" name="picUrl">
			<el-form :model="formData.picUrl" label-width="100px">
				<!-- f启用按钮 -->
				<el-form-item label="启用">
					<el-checkbox v-model="formData.picUrl.enable" type="checkbox" />
				</el-form-item>
				<!-- f选择器 -->
				<el-form-item
					:label="`css选择器${index + 1}`"
					v-if="formData.picUrl.enable"
					v-for="(selector, index) in formData.picUrl.selector"
					:key="index">
					<!-- *输入框-->
					<span style="flex-grow: 1">
						<el-input v-model="formData.picUrl.selector[index]" type="text" />
					</span>
					<!-- *侧边按钮 - 增加匹配规则-->
					<span class="side-button add-match-item">
						<HoverButton @click="pushMatchItem(index)">
							<template #default>
								<el-icon><i-ep-CirclePlus /></el-icon>
							</template>
							<template #hover>
								<el-icon><i-ep-CirclePlusFilled /></el-icon>
							</template>
						</HoverButton>
					</span>
					<!-- *侧边按钮 - 删除匹配规则-->
					<span class="side-button remove-match-item">
						<HoverButton @click="removeMatchItem(index)">
							<template #default>
								<el-icon><i-ep-Remove /></el-icon>
							</template>
							<template #hover>
								<el-icon><i-ep-RemoveFilled /></el-icon>
							</template>
						</HoverButton>
					</span>
				</el-form-item>
				<!-- f提取类型 -->
				<el-form-item label="提取类型" v-if="formData.picUrl.enable">
					<el-select
						v-model="formData.picUrl.infoType"
						placeholder="选择要提取的类型">
						<el-option :value="1" label="值" />
						<el-option :value="2" label="Attribute属性" />
						<el-option :value="3" label="Property属性" />
						<el-option :value="4" label="innerText 内部文本" />
						<el-option :value="5" label="innerHTML 内部HTML" />
						<el-option :value="6" label="outerHTML 全部HTML" />
					</el-select>
				</el-form-item>
				<!-- f匹配属性 -->
				<el-form-item
					v-if="formData.picUrl.enable"
					:label="`匹配属性${index + 1}`"
					v-for="(attribute, index) in formData.picUrl.attribute"
					:key="index">
					<!-- *输入框-->
					<span style="flex-grow: 1">
						<el-input v-model="formData.picUrl.attribute[index]" type="text" />
					</span>
					<!-- *侧边按钮 - 增加匹配规则-->
					<span class="side-button add-match-item">
						<HoverButton @click="pushMatchItem(index)">
							<template #default>
								<el-icon><i-ep-CirclePlus /></el-icon>
							</template>
							<template #hover>
								<el-icon><i-ep-CirclePlusFilled /></el-icon>
							</template>
						</HoverButton>
					</span>
					<!-- *侧边按钮 - 删除匹配规则-->
					<span class="side-button remove-match-item">
						<HoverButton @click="removeMatchItem(index)">
							<template #default>
								<el-icon><i-ep-Remove /></el-icon>
							</template>
							<template #hover>
								<el-icon><i-ep-RemoveFilled /></el-icon>
							</template>
						</HoverButton>
					</span>
				</el-form-item>
			</el-form>
		</el-tab-pane>
		<!-- !名称 -->
		<el-tab-pane label="名称" name="name">
			<el-form :model="formData.name" label-width="100px">
				<!-- f启用按钮 -->
				<el-form-item label="启用">
					<el-checkbox v-model="formData.name.enable" type="checkbox" />
				</el-form-item>
				<!-- f选择器 -->
				<el-form-item
					:label="`css选择器${index + 1}`"
					v-if="formData.name.enable"
					v-for="(selector, index) in formData.name.selector"
					:key="index">
					<!-- *输入框-->
					<span style="flex-grow: 1">
						<el-input v-model="formData.name.selector[index]" type="text" />
					</span>
					<!-- *侧边按钮 - 增加匹配规则-->
					<span class="side-button add-match-item">
						<HoverButton @click="pushMatchItem(index)">
							<template #default>
								<el-icon><i-ep-CirclePlus /></el-icon>
							</template>
							<template #hover>
								<el-icon><i-ep-CirclePlusFilled /></el-icon>
							</template>
						</HoverButton>
					</span>
					<!-- *侧边按钮 - 删除匹配规则-->
					<span class="side-button remove-match-item">
						<HoverButton @click="removeMatchItem(index)">
							<template #default>
								<el-icon><i-ep-Remove /></el-icon>
							</template>
							<template #hover>
								<el-icon><i-ep-RemoveFilled /></el-icon>
							</template>
						</HoverButton>
					</span>
				</el-form-item>
				<!-- f提取类型 -->
				<el-form-item label="提取类型" v-if="formData.name.enable">
					<el-select
						v-model="formData.name.infoType"
						placeholder="选择要提取的类型">
						<el-option :value="1" label="值" />
						<el-option :value="2" label="Attribute属性" />
						<el-option :value="3" label="Property属性" />
						<el-option :value="4" label="innerText 内部文本" />
						<el-option :value="5" label="innerHTML 内部HTML" />
						<el-option :value="6" label="outerHTML 全部HTML" />
					</el-select>
				</el-form-item>
				<!-- f匹配属性 -->
				<el-form-item
					v-if="formData.name.enable"
					:label="`匹配属性${index + 1}`"
					v-for="(attribute, index) in formData.name.attribute"
					:key="index">
					<!-- *输入框-->
					<span style="flex-grow: 1">
						<el-input v-model="formData.name.attribute[index]" type="text" />
					</span>
					<!-- *侧边按钮 - 增加匹配规则-->
					<span class="side-button add-match-item">
						<HoverButton @click="pushMatchItem(index)">
							<template #default>
								<el-icon><i-ep-CirclePlus /></el-icon>
							</template>
							<template #hover>
								<el-icon><i-ep-CirclePlusFilled /></el-icon>
							</template>
						</HoverButton>
					</span>
					<!-- *侧边按钮 - 删除匹配规则-->
					<span class="side-button remove-match-item">
						<HoverButton @click="removeMatchItem(index)">
							<template #default>
								<el-icon><i-ep-Remove /></el-icon>
							</template>
							<template #hover>
								<el-icon><i-ep-RemoveFilled /></el-icon>
							</template>
						</HoverButton>
					</span>
				</el-form-item>
			</el-form>
		</el-tab-pane>
		<!-- !元信息 -->
		<el-tab-pane label="元信息" name="meta">
			<el-form :model="formData.meta" label-width="100px">
				<!-- f启用按钮 -->
				<el-form-item label="启用">
					<el-checkbox v-model="formData.meta.enable" type="checkbox" />
				</el-form-item>
				<!-- f提取来源 -->
				<el-form-item label="提取类型" v-if="formData.meta.enable">
					<el-select v-model="formData.meta.origin" placeholder="提取来源">
						<el-option :value="0" label="单独指定目标dom" />
						<el-option :value="1" label="从“链接”dom获取" />
						<el-option :value="2" label="从“图链”dom获取" />
						<el-option :value="3" label="从“名称”dom获取" />
					</el-select>
				</el-form-item>
				<!-- f选择器 -->
				<el-form-item
					:label="`css选择器${index + 1}`"
					v-if="formData.meta.enable && formData.meta.origin === 0"
					v-for="(selector, index) in formData.meta.selector"
					:key="index">
					<!-- *输入框-->
					<span style="flex-grow: 1">
						<el-input v-model="formData.meta.selector[index]" type="text" />
					</span>
					<!-- *侧边按钮 - 增加匹配规则-->
					<span class="side-button add-match-item">
						<HoverButton @click="pushMatchItem(index)">
							<template #default>
								<el-icon><i-ep-CirclePlus /></el-icon>
							</template>
							<template #hover>
								<el-icon><i-ep-CirclePlusFilled /></el-icon>
							</template>
						</HoverButton>
					</span>
					<!-- *侧边按钮 - 删除匹配规则-->
					<span class="side-button remove-match-item">
						<HoverButton @click="removeMatchItem(index)">
							<template #default>
								<el-icon><i-ep-Remove /></el-icon>
							</template>
							<template #hover>
								<el-icon><i-ep-RemoveFilled /></el-icon>
							</template>
						</HoverButton>
					</span>
				</el-form-item>
				<!-- f提取类型 -->
				<el-form-item label="提取类型" v-if="formData.meta.enable">
					<el-select
						v-model="formData.meta.infoType"
						placeholder="选择要提取的类型">
						<el-option :value="1" label="值" />
						<el-option :value="2" label="Attribute属性" />
						<el-option :value="3" label="Property属性" />
						<el-option :value="4" label="innerText 内部文本" />
						<el-option :value="5" label="innerHTML 内部HTML" />
						<el-option :value="6" label="outerHTML 全部HTML" />
					</el-select>
				</el-form-item>
				<!-- f匹配属性 -->
				<el-form-item
					v-if="formData.meta.enable"
					:label="`匹配属性${index + 1}`"
					v-for="(attribute, index) in formData.meta.attribute"
					:key="index">
					<!-- *输入框-->
					<span style="flex-grow: 1">
						<el-input v-model="formData.meta.attribute[index]" type="text" />
					</span>
					<!-- *侧边按钮 - 增加匹配规则-->
					<span class="side-button add-match-item">
						<HoverButton @click="pushMatchItem(index)">
							<template #default>
								<el-icon><i-ep-CirclePlus /></el-icon>
							</template>
							<template #hover>
								<el-icon><i-ep-CirclePlusFilled /></el-icon>
							</template>
						</HoverButton>
					</span>
					<!-- *侧边按钮 - 删除匹配规则-->
					<span class="side-button remove-match-item">
						<HoverButton @click="removeMatchItem(index)">
							<template #default>
								<el-icon><i-ep-Remove /></el-icon>
							</template>
							<template #hover>
								<el-icon><i-ep-RemoveFilled /></el-icon>
							</template>
						</HoverButton>
					</span>
				</el-form-item>
			</el-form>
		</el-tab-pane>
	</el-tabs>
</template>

<script setup lang="ts">
	import {MatchRule} from "../ts/class/MatchRule";

	const props = defineProps({
		formData: {
			type: MatchRule,
		},
	});

	const info = reactive({
		activeName: "main",
	});

	//f 指定位置后追加的匹配项
	const pushMatchItem = (index: number): void => {
		const rule = <MatchRule>props.formData;
		// console.log("新增条目");
		for (const key of rule.enumMainKey) {
			for (const item of Object.keys(rule[key])) {
				if (rule.enumMatchItemKey.includes(item)) {
					rule[key][item].splice(index + 1, 0, "");
				}
			}
		}
		rule.matchItemCount++;
	};

	//f 删除指定下标的匹配项
	const removeMatchItem = (index: number): void => {
		const rule = <MatchRule>props.formData;
		if (rule.matchItemCount <= 1) {
			return;
		}
		for (const key of rule.enumMainKey) {
			for (const item of Object.keys(rule[key])) {
				if (rule.enumMatchItemKey.includes(item)) {
					rule[key][item].splice(index, 1);
				}
			}
		}
		rule.matchItemCount--;
	};

	watch(
		() => props.formData,
		(newVal, oldVal) => {
			info.activeName = "main";
		}
	);
</script>

<style lang="scss" scoped>
	.side-button {
		position: relative;
		width: 24px;
		aspect-ratio: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 18px;
		&.add-match-item {
			color: green;
		}
		&.remove-match-item {
			color: red;
		}
	}
</style>


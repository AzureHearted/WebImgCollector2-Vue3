<template>
	<div>
		<el-form-item label="结果修正">
			<el-form>
				<!-- 修正项目添加 -->
				<el-form-item>
					<el-dropdown trigger="click" placement="bottom">
						<el-button :disabled="disable" type="success">
							添加修正规则
						</el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item
									@click="rule.addFixItem(type, 'regex-extract')">
									正则提取
								</el-dropdown-item>
								<el-dropdown-item
									@click="rule.addFixItem(type, 'regex-replace')">
									正则替换
								</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</el-form-item>
			</el-form>
		</el-form-item>
		<transition-group name="list-complete" appear>
			<el-form-item
				v-for="(item, index) in fixList"
				:key="item.expression + item.flags + item.type">
				<el-card class="fix-item-card" shadow="hover">
					<template #header>
						<div class="form-card-header">
							<div class="form-card-header-left">
								<span>
									<span v-if="fixList.length > 1"> {{ index + 1 }} - </span>
									{{ item.type === "regex-extract" ? "正则提取" : "正则替换" }}
								</span>
							</div>
							<div class="form-card-header-right">
								<!-- 上移 -->
								<el-button
									:disabled="!index"
									:type="!index ? '' : 'primary'"
									:text="!index"
									circle
									@click.stop="upItem(index)">
									<template #icon>
										<i-ep-arrow-up-bold />
									</template>
								</el-button>
								<!-- 下移 -->
								<el-button
									:disabled="!(index < fixList.length - 1)"
									:type="!(index < fixList.length - 1) ? '' : 'primary'"
									circle
									:text="!(index < fixList.length - 1)"
									@click.stop="downItem(index)">
									<template #icon>
										<i-ep-arrow-down-bold />
									</template>
								</el-button>
								<!-- 删除 -->
								<el-popconfirm
									title="确定删除?"
									:hide-after="0"
									confirm-button-text="是"
									cancel-button-text="否"
									@confirm="fixList.splice(index, 1)">
									<template #reference>
										<el-button type="danger" circle plain @click.stop>
											<template #icon>
												<i-material-symbols-delete-rounded />
											</template>
										</el-button>
									</template>
								</el-popconfirm>
							</div>
						</div>
					</template>
					<el-form label-position="left">
						<el-form-item
							:label="
								item.type === 'regex-extract' ? '提取表达式' : '匹配表达式'
							">
							<el-input v-model="item.expression" placeholder="输入正则表达式">
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
								placeholder="输入正则替换表达式" />
						</el-form-item>
					</el-form>
				</el-card>
			</el-form-item>
		</transition-group>
	</div>
</template>

<script setup lang="ts">
	import { computed, defineProps, defineModel, withDefaults } from "vue";
	import { Rule } from "@/stores/patternStore/class/Rule";

	const rule = defineModel("rule", { type: Rule, required: true });
	const props = withDefaults(
		defineProps<{
			type: "source" | "preview" | "description";
			disable?: boolean;
		}>(),
		{
			disable: false,
		}
	);

	// 修正项
	const fixList = computed(() => {
		return rule.value[props.type].fix;
	});

	// 上移
	function upItem(index: number) {
		// const fixList = rule.value[props.type].fix;
		fixList.value.splice(index - 1, 0, fixList.value.splice(index, 1)[0]);
	}
	// 下移
	function downItem(index: number) {
		// const fixList = rule.value[props.type].fix;
		fixList.value.splice(index, 0, fixList.value.splice(index + 1, 1)[0]);
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
		font-size: 14px;
		width: 100%;

		.form-card-header-left {
			display: flex;
			align-items: center;
			gap: 8px;
		}
		.form-card-header-right {
			margin-left: auto;
		}
	}

	/* 对移动中的元素应用的过渡 */
	.list-complete-move,
	.list-complete-enter-active,
	.list-complete-leave-active {
		transition: all 0.3s;
	}

	// 进场过渡
	.list-complete-enter-from {
		position: absolute;
		opacity: 0;
		transform: translateY(200px);
	}
	// 退场过渡
	.list-complete-leave-to {
		opacity: 0;
		transform: scale(0.1);
	}

	// 进入的过程中
	.list-complete-enter-active {
		transition: all 0.5s;
	}
	// 离开的过程中
	.list-complete-leave-active {
		transition: all 0.3s;
	}
</style>

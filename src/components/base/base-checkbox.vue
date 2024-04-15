<template>
	<div @click="isChecked = !isChecked">
		<Transition appear>
			<var-button
				v-if="!isChecked"
				:type="isChecked ? 'success' : 'default'"
				icon-container
				round>
				<IconCheckboxBlank
					class="card-checkbox-icon"
					style="width: 20px; fill: #333" />
			</var-button>
			<var-button
				v-else
				:type="isChecked ? 'success' : 'default'"
				icon-container
				round>
				<IconCheckboxChecked
					class="card-checkbox-icon"
					style="width: 20px; fill: white" />
			</var-button>
		</Transition>
	</div>
</template>

<script setup lang="ts">
	import { defineProps, withDefaults, computed, defineEmits } from "vue";
	import IconCheckboxBlank from "@svg/checkbox-blank-circle-outline.svg";
	import IconCheckboxChecked from "@svg/check-circle.svg";

	const props = withDefaults(
		defineProps<{
			checked: boolean;
		}>(),
		{
			checked: false,
		}
	);

	const emits = defineEmits<{
		(e: "change", val: boolean): void;
	}>();

	const isChecked = computed({
		get() {
			return props.checked;
		},
		set(val) {
			emits("change", val);
		},
	});
</script>

<style scoped lang="less">
	// 进入动画的结束状态,进入动画的起始状态
	.v-leave-to,
	.v-enter-from {
		position: absolute;
		opacity: 0;
		transform: translateY(-100%);
	}
	// 进入动画的结束状态,离开动画的起始状态
	.v-enter-to,
	.v-leave-from {
		// position: absolute;
	}
	// 进入的过程中
	.v-enter-active {
		transition: all 0.5s;
	}
	// 离开的过程中
	.v-leave-active {
		transition: all 0.5s;
	}

	:deep(.var-button--round) {
		width: 26px;
		height: 26px;
	}
</style>

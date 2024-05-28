<template>
	<div @click="isChecked = !isChecked">
		<Transition appear>
			<var-button
				v-if="!isChecked"
				:type="isChecked ? 'success' : 'default'"
				icon-container
				round>
				<i-material-symbols-check-box-outline-blank />
			</var-button>
			<var-button
				v-else
				:type="isChecked ? 'success' : 'default'"
				icon-container
				round>
				<i-material-symbols-check-box-rounded />
			</var-button>
		</Transition>
	</div>
</template>

<script setup lang="ts">
	import { defineProps, withDefaults, computed, defineEmits } from "vue";

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

<style scoped lang="scss">
	// 进入动画的结束状态,进入动画的起始状态
	.v-leave-to,
	.v-enter-from {
		position: absolute;
		opacity: 0;
		transform: scale(0);
	}

	// 进入的过程中
	.v-enter-active {
		transition: 0.5s;
	}
	// 离开的过程中
	.v-leave-active {
		transition: 0.5s;
	}

	:deep(.var-button--round) {
		width: 26px;
		height: 26px;
	}
</style>

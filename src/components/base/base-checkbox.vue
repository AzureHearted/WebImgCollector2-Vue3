<template>
	<div class="base-checkbox__container" @click="isChecked = !isChecked">
		<n-button :type="isChecked ? 'success' : 'default'" text block v-ripple>
			<template #icon>
				<transition appear>
					<i-material-symbols-check-box-outline-blank v-if="!isChecked" />
					<i-material-symbols-check-box-rounded v-else />
				</transition>
			</template>
		</n-button>
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
	.base-checkbox__container {
		aspect-ratio: 1;
		height: 24px;
		display: flex;
	}

	// 进场过渡,退场过渡
	.v-enter-from,
	.v-leave-to {
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
</style>

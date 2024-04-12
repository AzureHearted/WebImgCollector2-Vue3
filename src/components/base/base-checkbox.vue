<template>
	<div @click="checked = !checked">
		<Transition appear>
			<var-button
				v-if="!checked"
				size="mini"
				:type="checked ? 'success' : 'default'"
				icon-container
				round>
				<var-icon class="card-checkbox-icon" name="checkbox-blank-outline" />
			</var-button>
			<var-button
				v-else
				size="mini"
				:type="checked ? 'success' : 'default'"
				icon-container
				round>
				<var-icon class="card-checkbox-icon" name="checkbox-marked-outline" />
			</var-button>
		</Transition>
	</div>
</template>

<script setup lang="ts">
	import { defineModel } from "vue";

	const checked = defineModel({ type: Boolean, default: false });
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
		position: absolute;
	}
	// 进入的过程中
	.v-enter-active {
		transition: all 0.5s;
	}
	// 离开的过程中
	.v-leave-active {
		transition: all 0.5s;
	}
</style>

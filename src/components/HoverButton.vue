<template>
	<span class="hover-button-container" @mouseenter="isHover = true" @mouseleave="isHover = false">
		<transition name="hover-button-container">
			<!-- *默认样式 -->
			<span class="hover-button-default" v-if="!isHover">
				<slot>
					<el-icon><i-ep-Delete /></el-icon>
				</slot>
			</span>
		</transition>
		<transition name="hover-button-container">
			<!-- *悬浮样式 -->
			<span class="hover-button-hover" v-if="isHover">
				<slot name="hover">
					<el-icon><i-ep-DeleteFilled /></el-icon>
				</slot>
			</span>
		</transition>
	</span>
</template>

<script setup lang="ts">
	let isHover = ref(false);
</script>

<style lang="scss" scoped>
	.hover-button-container {
		position: relative !important;
		width: 24px;
		aspect-ratio: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;

		> * {
			position: absolute;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.hover-button-container-enter-active,
	.hover-button-container-leave-active {
		transition: opacity 0.5s ease;
	}

	.hover-button-container-enter-from,
	.hover-button-container-leave-to {
		opacity: 0;
	}
</style>

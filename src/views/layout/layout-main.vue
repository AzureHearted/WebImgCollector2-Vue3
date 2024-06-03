<template>
	<main class="main__container">
		<!-- 内容区 -->
		<keep-alive :exclude="['gallery-index']">
			<component :is="nowPage"></component>
		</keep-alive>
	</main>
</template>

<script lang="ts" setup>
	import { computed } from "vue";

	import Gallery from "@/views/gallery/gallery-index.vue";
	import PatternEdit from "@/views/pattern-edit/pattern-edit-index.vue";

	import useGlobalStore from "@/stores/global"; //导入全局仓库
	const globalStore = useGlobalStore();

	// 组件记对象
	const views: { [key: string]: any } = { Gallery, PatternEdit };
	// 动态组件
	const nowPage = computed(() => {
		return views[globalStore.tab];
	});
</script>

<style lang="scss" scoped>
	.main__container {
		// background: wheat;
	}
</style>

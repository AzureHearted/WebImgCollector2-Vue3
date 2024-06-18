<template>
	<n-flex class="test__container" vertical :size="4">
		<n-flex :size="4">
			<n-button type="primary" @click="addTag">添加标签</n-button>
		</n-flex>
		<BaseLineOverflowList
			:wrap-style="{
				gap: '2px',
				width: '50%',
			}">
			<n-tag
				v-for="(item, index) in tags"
				:key="index"
				type="default"
				size="medium"
				closable
				@close="tags.splice(index, 1)">
				{{ item.label }}
			</n-tag>
		</BaseLineOverflowList>
	</n-flex>
</template>

<script setup lang="ts">
	import BaseLineOverflowList from "@/components/base/base-line-overflow-list.vue";
	import { ref, reactive, onMounted } from "vue";

	interface Tag {
		label: string;
	}
	const tags = ref<Tag[]>(
		[...Array(6).keys()].map((i) => {
			return {
				label: `标签${i}`,
			};
		})
	);

	const addTag = () => {
		tags.value.push({
			label: `标签${tags.value.length}`,
		});
	};
</script>

<style lang="scss" scoped>
	.test__container {
		position: relative;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		padding: 4px;
		// overflow: hidden;
	}
</style>

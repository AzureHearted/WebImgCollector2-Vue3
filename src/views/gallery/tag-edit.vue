<template>
	<slot></slot>
	<BaseDragModal
		v-model:show="show"
		:title="title"
		:teleport-to="teleportTo"
		@closed="handleClose">
		<template #default>
			<div style="padding: 2px">
				<!-- {{ tags }} -->
				<n-dynamic-tags
					v-model:value="tags"
					type="info"
					@change="handleChange" />
			</div>
		</template>
		<!-- TODO 暂时禁用footer  -->
		<template #footer>
			<n-flex :size="4">
				<n-button
					tag="div"
					style="margin-left: auto"
					type="success"
					size="small"
					@click="handleSave">
					保存
				</n-button>
				<n-button tag="div" size="small" @click="handleCancel"> 取消 </n-button>
			</n-flex>
		</template>
	</BaseDragModal>
</template>

<script setup lang="ts">
	import BaseDragModal from "@/components/base/base-drag-modal.vue";
	import { ref, watch, onMounted, getCurrentInstance } from "vue";
	const show = defineModel("show", { type: Boolean, default: false });
	const tags = defineModel("tags", { type: Array<string>, default: () => [] });

	withDefaults(
		defineProps<{
			title?: string;
			teleportTo?: string;
			initWidth?: number;
			initHeight?: number;
		}>(),
		{
			initWidth: 300,
			initHeight: 200,
		}
	);

	const emits = defineEmits<{
		(e: "onSave", newTags: string[]): void;
		(e: "onCancel"): void;
		(e: "onClose"): void;
		(e: "onChange", newTags: string[]): void;
	}>();

	const instance = getCurrentInstance();
	const slotDOM = ref<HTMLElement | null>(null);
	onMounted(() => {
		slotDOM.value = (instance?.vnode.el as HTMLElement)
			.nextElementSibling as HTMLElement;
		slotDOM.value.onclick = (e) => {
			e.stopPropagation();
			show.value = !show.value;
			// console.log("点击", show.value);
		};
	});

	const handleSave = () => {
		// console.log("newTags", tags.value);
		emits("onSave", tags.value);
	};

	const handleClose = () => {
		emits("onClose");
		show.value = false;
	};

	const handleCancel = () => {
		emits("onCancel");
		show.value = false;
	};

	const handleChange = (newTags: string[]) => {
		emits("onChange", newTags);
	};
</script>

<style lang="scss" scoped></style>

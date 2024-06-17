<template>
	<slot></slot>
	<n-modal :to="to" v-model:show="show">
		<div
			ref="modelDOM"
			:style="style"
			class="tag-edit__model"
			:class="{ init: !show }"
			@touchmove.prevent>
			<n-card
				:style="{ width: initWidth + 'px', height: initHeight + 'px' }"
				title="模态框"
				:bordered="false"
				size="huge"
				role="dialog"
				aria-modal="true">
				<template #header-extra> 噢！ </template>
				内容
				<template #footer> 尾部 </template>
			</n-card>
		</div>
	</n-modal>
</template>

<script setup lang="ts">
	import { useDraggable } from "@vueuse/core";
	import { NCard } from "naive-ui";
	import { ref, onMounted, getCurrentInstance } from "vue";
	const show = defineModel("show", { type: Boolean });

	const props = withDefaults(
		defineProps<{
			to?: string | HTMLElement;
			initWidth?: number;
			initHeight?: number;
		}>(),
		{
			initWidth: 300,
			initHeight: 200,
		}
	);

	const instance = getCurrentInstance();
	const slotDOM = ref<HTMLElement | null>(null);
	const modelDOM = ref<HTMLElement | null>(null);

	const { style } = useDraggable(modelDOM, {
		containerElement() {
			if (props.to) {
				if (typeof props.to === "string") {
					return document.querySelector(props.to) as HTMLElement;
				} else {
					return props.to;
				}
			} else {
				return null;
			}
		},
		preventDefault: true,
		// initialValue() {
		// 	let dom: HTMLElement | null = null,
		// 		x: number,
		// 		y: number;
		// 	if (props.to) {
		// 		if (typeof props.to === "string") {
		// 			dom = document.querySelector(props.to) as HTMLElement;
		// 		} else {
		// 			dom = props.to;
		// 		}
		// 	}
		// 	if (dom && modelDOM.value) {
		// 		console.log("组件已挂载");
		// 		x = (dom.clientWidth - modelDOM.value.clientWidth) / 2;
		// 		y = (dom.clientHeight - modelDOM.value.clientHeight) / 2;
		// 	} else {
		// 		console.log("组件未挂载");
		// 		x = (window.innerWidth - props.initWidth) / 2;
		// 		y = (window.innerHeight - props.initHeight) / 2;
		// 	}
		// 	return { x, y };
		// },
	});
	onMounted(() => {
		slotDOM.value = (instance?.vnode.el as HTMLElement)
			.nextElementSibling as HTMLElement;
		slotDOM.value.onclick = (e) => {
			e.stopPropagation();
			show.value = !show.value;
		};
	});
</script>

<style lang="scss" scoped>
	.tag-edit__model {
		position: absolute;
		display: block;
	}
	.init {
		
	}
</style>

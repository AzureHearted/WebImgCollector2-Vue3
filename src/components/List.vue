<template>
	<div id="onlineGallery-list-container" ref="listContainerRef">
		<el-scrollbar ref="scrollbarRef" @scroll="handleScroll">
			<!-- *列表 -->
			<transition-group
				id="onlineGallery-listBody"
				ref="listBody"
				:style="getStyle"
				name="list"
				tag="div">
				<Card
					v-for="(card, index) in cardsStore.filterCards"
					:card="card"
					:key="card.id"
					:index="index"
					:data-index="index"
					:style="{
						'--aspect-ratio': card.meta.aspectRatio,
					}">
				</Card>
			</transition-group>
			<!-- *回到顶部按钮 -->
			<transition name="backTop">
				<div
					v-show="backTopShow"
					ref="backTop"
					class="onlineGallery-backTop"
					@click="backToTop">
					<el-icon><i-ep-CaretTop /></el-icon>
				</div>
			</transition>
		</el-scrollbar>
	</div>
</template>

<script setup lang="ts">
	import {Fancybox} from "@fancyapps/ui";

	const listContainerRef = ref(); //* 用于接收list容器的dom
	const listContainerSize = useElementBounding(listContainerRef);
	const listBody = ref(); //* 用于接收list本体的dom
	const scrollbarRef = ref();
	const wrapRef = ref();

	const appInfo = useAppInfoStore();
	const cardsStore = useCardsStore();

	const toolBar = useToolBarStore();

	const listControl = toolBar.listControl;

	onMounted(() => {
		//! FancyBox实例挂载
		Fancybox.bind(
			listBody.value.$el,
			'[data-onlineGallery-fancybox="onlineGallery"]',
			{
				contentClick: "toggleZoom",
				contentDblClick: false,
				defaultDisplay: "block",
				dragToClose: true,
				animated: true,
				wheel: "zoom",
				backdropClick: "close",
				groupAttr: "data-onlineGallery-fancybox",
				hideScrollbar: true,
				on: {
					done: (fancybox, slide) => {
						// console.log(slide);

						if (
							slide.contentEl.style.width == "0px" ||
							slide.contentEl.style.height == "0px"
						) {
							let aspectRatio = Number(slide.width) / Number(slide.height);
							slide.contentEl.style.width =
								(slide.el as HTMLElement).clientHeight * 0.9 * aspectRatio +
								"px";
							slide.contentEl.style.height =
								(slide.el as HTMLElement).clientHeight * 0.9 + "px";
						}
					},
				},
				parentEl: document.querySelector(
					".onlineGallery-child-window-container"
				) as HTMLElement,
				groupAll: true,
				Thumbs: {type: "classic"},
				Images: {
					Panzoom: {
						maxScale: 5,
					},
				},
				Toolbar: {
					display: {
						left: ["infobar"],
						middle: [
							"zoomIn",
							"zoomOut",
							"toggle1to1",
							"rotateCCW",
							"rotateCW",
							"flipX",
							"flipY",
						],
						right: ["open", "slideshow", "download", "thumbs", "close"],
					},
					items: {
						open: {
							tpl: /*html*/ `
							<button class="f-button"><svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"></path></svg></button>
							`,
							click: (fancybox, slide) => {
								const index = Number(
									(
										fancybox.instance.container.querySelector(
											".is-nav-selected"
										) as HTMLElement
									).dataset.index
								);
								const url = fancybox.instance.userSlides[index].src;
								window.open(url, "_blank");
							},
						},
					},
				},
			}
		);
	});

	onUpdated(() => {
		Fancybox.unbind(listBody.value.$el);
		Fancybox.close();

		Fancybox.bind(
			listBody.value.$el,
			'[data-onlineGallery-fancybox="onlineGallery"]',
			{
				contentClick: "toggleZoom",
				contentDblClick: false,
				defaultDisplay: "block",
				dragToClose: true,
				animated: true,
				wheel: "zoom",
				backdropClick: "close",
				groupAttr: "data-onlineGallery-fancybox",
				hideScrollbar: true,
				on: {
					done: (fancybox, slide) => {
						if (
							slide.contentEl.style.width == "0px" ||
							slide.contentEl.style.height == "0px"
						) {
							let aspectRatio = Number(slide.width) / Number(slide.height);
							slide.contentEl.style.width =
								(slide.el as HTMLElement).clientHeight * 0.9 * aspectRatio +
								"px";
							slide.contentEl.style.height =
								(slide.el as HTMLElement).clientHeight * 0.9 + "px";
						}
					},
				},
				parentEl: document.querySelector(
					".onlineGallery-child-window-container"
				) as HTMLElement,
				groupAll: true,
				Thumbs: {type: "classic"},
				Images: {
					Panzoom: {
						maxScale: 5,
					},
				},
				Toolbar: {
					display: {
						left: ["infobar"],
						middle: [
							"zoomIn",
							"zoomOut",
							"toggle1to1",
							"rotateCCW",
							"rotateCW",
							"flipX",
							"flipY",
						],
						right: ["open", "slideshow", "download", "thumbs", "close"],
					},
					items: {
						open: {
							tpl: /*html*/ `
							<button class="f-button"><svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"></path></svg></button>
							`,
							click: (fancybox, slide) => {
								const index = Number(
									(
										fancybox.instance.container.querySelector(
											".is-nav-selected"
										) as HTMLElement
									).dataset.index
								);
								const url = fancybox.instance.userSlides[index].src;
								window.open(url, "_blank");
							},
						},
					},
				},
			}
		);
	});

	//f 获取list的样式(计算属性)
	const getStyle = computed(() => {
		interface IStyle {
			"--nowColumn": number;
			"--listHeight": string;
			"--cardMaxHeight": string;
			"scroll-behavior"?: "smooth !important";
		}
		let style: IStyle = {
			"--nowColumn": listControl.showColumn,
			"--listHeight":
				listContainerSize.height.value - 8 * listControl.showColumn - 10 + "px",
			"--cardMaxHeight": `calc(var(--listHeight) / var(--nowColumn))`,
			"scroll-behavior": "smooth !important",
		};
		if (listContainerSize.height.value > 0) {
			style["--listHeight"] =
				listContainerSize.height.value - 8 * listControl.showColumn - 10 + "px";
		}
		if (listControl.showColumn <= 0) {
			style["--cardMaxHeight"] = "1000%";
		}
		return style;
	});

	const backTop = ref(); //* 用于接收回到顶部按钮
	const backTopShow = ref(false);

	interface scrollEvent {
		scrollLeft: number;
		scrollTop: number;
	}
	//f 处理滚动事件
	const handleScroll = (scrollEvent: scrollEvent) => {
		// console.log("list滚动", scrollEvent.scrollTop);
		if (scrollEvent.scrollTop > 150) {
			backTopShow.value = true;
		} else {
			backTopShow.value = false;
		}
	};

	//f 触发事件(回到顶部)
	const backToTop = () => {
		const warpDom = scrollbarRef.value.wrapRef as HTMLElement;
		//* 移动前加上scroll-behavior = smooth !important
		warpDom.style.scrollBehavior = "smooth";
		scrollbarRef.value.setScrollTop(0);
		//* 动画结束后移除scroll-behavior = smooth !important
		setTimeout((warpDom.style.scrollBehavior = ""));
	};
</script>

<style lang="scss" scoped>
	* {
		border: 0;
		margin: 0;
		box-sizing: border-box;
	}

	#onlineGallery-listBody {
		width: 100%;
		padding: 10px;
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
		align-items: stretch;
		align-content: start;

		gap: 8px;

		transition: 1s;

		/* 禁止选中文字 */
		user-select: none;
		/* 禁止图文拖拽 */
		-webkit-user-drag: none;
	}

	//* 返回顶部按钮样式
	.onlineGallery-backTop {
		--el-backtop-bg-color: var(--el-bg-color-overlay);
		--el-backtop-text-color: var(--el-color-primary);
		--el-backtop-hover-bg-color: var(--el-border-color-extra-light);

		position: absolute;
		width: 40px;
		height: 40px;

		right: 40px;
		bottom: 40px;

		border-radius: 50%;
		background-color: var(--el-bg-color-overlay);
		color: var(--el-color-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20px;
		box-shadow: var(--el-box-shadow-lighter);
		cursor: pointer;
		z-index: 5;
		transition: 0.5s;

		&:hover {
			background-color: var(--el-border-color-extra-light);
		}
	}

	.backTop-enter-active,
	.backTop-leave-active {
		transition: opacity 0.5s ease;
	}

	.backTop-enter-from,
	.backTop-leave-to {
		opacity: 0;
	}

	//* 对移动中的元素应用的过渡
	.list-move,
	.list-enter-active,
	.list-leave-active {
		transition: opacity 0.5s ease, transform 0.25s ease;
	}

	.list-enter-from,
	.list-leave-to {
		opacity: 0;
		transform: translateX(30px);
	}

	//* 确保将离开的元素从布局流中删除以便能够正确地计算移动的动画。
	.list-leave-active {
		position: absolute;
	}
</style>

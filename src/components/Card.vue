<template>
	<div
		ref="cardDom"
		class="card"
		:id="`id_${card.id}`"
		data-fancybox-trigger="onlineGallery"
		:data-fancybox-index="index"
		@contextmenu.prevent.self>
		<!-- *图片 -->
		<Img
			class="content"
			data-fancybox="onlineGallery"
			:src="card.picUrl"
			@click="clickHandle" />
		<!-- <img class="content" :src="card.picUrl" data-fancybox="onlineGallery" /> -->

		<div class="tag-group">
			<!-- *大小标签 -->
			<el-tooltip
				v-if="card.linkBlob"
				effect="dark"
				:content="(card.linkBlob.size / 1024 / 1024).toFixed(2) + 'Mb'"
				placement="top">
				<el-tag
					class="el-tag"
					round
					size="small"
					@click.right="
						copyTagContent((card.linkBlob.size / 1024 / 1024).toFixed(2) + 'Mb')
					">
					{{ (card.linkBlob.size / 1024 / 1024).toFixed(2) + "Mb" }}
				</el-tag>
			</el-tooltip>
			<!-- *尺寸标签 -->
			<el-tooltip
				effect="dark"
				:content="`${card.meta.width}x${card.meta.height}`"
				placement="top">
				<el-tag
					class="el-tag"
					size="small"
					type="info"
					@click.right="
						copyTagContent(card.meta.width + 'x' + card.meta.height)
					"
					round>
					{{ card.meta.width }}x{{ card.meta.height }}
				</el-tag>
			</el-tooltip>
			<!-- *名称标签 -->
			<el-tooltip effect="dark" :content="card.name" placement="top">
				<el-tag
					class="el-tag"
					round
					size="small"
					@click.right="copyTagContent(card.name)">
					{{ card.name }}
				</el-tag>
			</el-tooltip>
		</div>
		<!-- *勾选框 -->
		<el-checkbox v-model="card.selected" class="checkbox" />
		<!-- *按钮组 -->
		<div class="button-group">
			<!-- *下载按钮 -->
			<el-button
				class="button download"
				type="primary"
				circle
				@click.stop="download"
				:loading="downloading">
				<template #icon>
					<el-icon><i-ep-Download /></el-icon>
				</template>
			</el-button>

			<!-- *定位按钮 -->
			<el-button
				class="button toPosition"
				type="primary"
				circle
				@click.stop="toPosition"
				:loading="downloading">
				<template #icon>
					<el-icon><i-ep-LocationFilled /></el-icon>
				</template>
			</el-button>
		</div>
	</div>
</template>

<script setup lang="ts">
	const {text, isSupported, copy} = useClipboard(); //* 剪切板

	const cardsStore = useCardsStore();

	interface Props {
		card: matchCard;
		index: number;
	}
	const props = withDefaults(defineProps<Props>(), {
		card: () => {
			return {
				name: "",
				linkUrl: "",
				picUrl: "",
				originUrls: [],
				metaOrigin: "",
				meta: <metaInterFace>{
					width: 0,
					height: 0,
					aspectRatio: 3 / 4,
				},
				picBlob: new Blob([], {type: "none"}),
				linkBlob: new Blob([], {type: "none"}),
				nameBlob: new Blob([], {type: "none"}),
				selected: false, //? 选中标识符
				dom: null,
			};
		},
	});

	const cardDom = ref();

	const appInfo = useAppInfoStore();
	const downloading = ref(false); //* 用于标记下载过程

	/**
	 * f 复制内容到剪切板
	 * @param {string} content 文本内容
	 */
	const copyTagContent = async (content: string) => {
		await copy(content);
		ElMessage({
			type: "success",
			// showClose: true,
			grouping: true,
			center: true,
			duration: 1000,
			offset: 120,
			message: h("p", {style: "display:flex;gap:10px"}, [
				h("i", {style: "color: teal"}, content),
				h("span", {style: "color: black"}, "复制成功！"),
			]),
		});
	};

	//f 卡片点击事件
	const clickHandle = async (e: MouseEvent) => {
		cardsStore.openFancyBox(props.index);
	};

	//f 下载图片
	const download = async () => {
		const card = props.card;
		downloading.value = true;
		if (card.linkBlob) {
			//* 后缀名处理
			let ext = getExtByBlob(card.linkBlob);
			let reg = new RegExp(`(\\.${ext})+$`);
			await saveAs(card.linkBlob, `${card.name.replace(reg, "")}.${ext}`);
			downloading.value = false;
		} else {
			//* 先获取文件的blob对象
			const url = card.linkUrl;
			let tempBlob: Blob = await getBlobByUrlAuto(url);
			console.log(tempBlob);
			if (tempBlob && tempBlob.type !== "none") {
				card.linkBlob = tempBlob;
				await saveAs(card.linkBlob, card.name);
				downloading.value = false;
			} else {
				downloading.value = false;
			}
		}
	};

	//f  在网页中定位
	const toPosition = async () => {
		const dom = props.card.dom;
		if (dom != null) {
			appInfo.container.open = !appInfo.container.open;
			dom.scrollIntoView({
				behavior: "smooth",
				block: "center",
				inline: "center",
			});
		}
	};

	defineExpose({
		cardDom,
	});
</script>

<style scoped lang="scss">
	* {
		border: 0;
		margin: 0;
		box-sizing: border-box;
		/* 禁止选中文字 */
		// user-select: none;
		/* 禁止图文拖拽 */
		// -webkit-user-drag: none;
	}

	//* 卡片样式
	.card {
		border: 0 !important;
		margin: 0 !important;
		padding: 0 !important;
		scroll-snap-align: start;
		position: relative;
		border-radius: 4px;
		box-shadow: var(--el-box-shadow-dark);

		aspect-ratio: var(--aspect-ratio);
		max-width: 100%;
		max-height: var(--cardMaxHeight);
		width: calc(var(--cardMaxHeight) * var(--aspect-ratio)) !important;

		background-color: transparent;

		overflow: hidden;

		cursor: pointer;
		transition: 0.5s;

		//* 卡片悬停触发
		&:hover {
			box-shadow: 1px 2px 12px 6px rgba(0, 0, 0, 0.5);
		}

		//* 内容区样式
		.content {
			border: 0 !important;
			margin: 0 !important;
			padding: 0 !important;

			width: 100%;
			height: auto;
			object-position: center;
			/* object-fit: contain; */
			-webkit-user-drag: none;
			/* cursor: pointer; */

			/* 居中背景图像 */
			background-position: center;
			/* 不重复 */
			background-repeat: repeat;
			background-size: contain;
		}

		//* 按钮组样式
		.button-group {
			& {
				position: absolute;
				$padding: 4px;
				$margin: 4px;
				// padding: $padding;
				margin: $margin;
				top: 0;
				right: 0;
				width: 24px;
				height: 24px;
				// background-color: aquamarine;
				border-radius: 12px;
				// aspect-ratio: 1;
				transition: 0.15s;
			}

			//* 通用按钮样式
			.button {
				position: absolute;
				margin: auto;
				padding: 0;
				left: 0;
				top: 0;
				right: 0;
				width: 100% !important;
				height: auto !important;
				aspect-ratio: 1 !important;
				font-size: medium;
				box-shadow: var(--el-box-shadow-light);
				transition: 0.15s;
			}
			//* 鼠标悬浮按钮组时候的样式
			&:hover {
				& {
					height: 24px + 26px;
				}
				//* 定位按钮样式
				.button.download {
					transform: translateY(26px);
				}
			}
		}

		//* 勾选框样式
		.checkbox {
			position: absolute !important;
			height: fit-content;
			top: 4px !important;
			left: 4px !important;
			box-shadow: var(--el-box-shadow-light);
		}

		//* 标签组样式
		.tag-group {
			position: absolute;

			width: 100% !important;
			bottom: 0px;
			left: 0px;
			padding: 4px;

			display: flex;
			flex-flow: row wrap;
			gap: 2px;

			.el-tag {
				max-width: 100%;
				justify-content: start;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
</style>

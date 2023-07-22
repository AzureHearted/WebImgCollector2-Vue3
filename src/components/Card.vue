<template>
	<div class="card" @contextmenu.prevent.self @click="clickHandle">
		<!-- *图片 -->
		<Img class="content" :src="card.url"></Img>
		<div class="tag-group">
			<!-- *尺寸标签 -->
			<el-tag
				class="tag-width-and-height"
				round
				size="small"
				type="info"
				@click.right.prevent="
					copyTagContent(`${card.meta.width}x${card.meta.height}`)
				"
				>{{ card.meta.width }}x{{ card.meta.height }}
			</el-tag>
			<!-- *名称标签 -->
			<el-tag
				class="tag-width-and-height"
				round
				size="small"
				@click.right.prevent="copyTagContent(card.name)">
				{{ card.name }}
			</el-tag>
		</div>
		<!-- *勾选框 -->
		<el-checkbox v-model="card.selected" class="checkbox" size="default" />
		<!-- *按钮组 -->
		<div class="button-group">
			<!-- *下载按钮 -->
			<el-button
				class="button download"
				type="primary"
				size="small"
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
				size="small"
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
	
	interface Props {
		card: matchCard;
	}
	const props = withDefaults(defineProps<Props>(), {
		card: () => {
			return {
				name: "",
				url: "",
				originUrls: [],
				meta: <metaInterFace>{
					width: 0,
					height: 0,
					aspectRatio: 3 / 4,
				},
				selected: false, //? 选中标识符
				dom: null,
			};
		},
	});

	const appInfo = useAppInfoStore();
	const downloading = ref(false); //* 用于标记下载过程

	/**
	 * f 复制内容到剪切板
	 * @param {string} content 文本内容
	 */
	const copyTagContent = async (content) => {
		await copy(content);
		ElMessage({
			type: "success",
			// showClose: true,
			grouping: true,
			center: true,
			duration: 1000,
			offset: 80,
			message: h("p", {style: "display:flex;gap:10px"}, [
				h("i", {style: "color: teal"}, content),
				h("span", {style: "color: black"}, "复制成功！"),
			]),
		});
	};

	//f 卡片点击事件
	const clickHandle = async (e) => {
		return;
	};

	//f 下载图片
	const download = async () => {
		downloading.value = true;
		if (props.card.blob != null) {
			await saveAs(props.card.blob, props.card.name);
			downloading.value = false;
		} else {
			//* 先获取文件的blob对象
			const url = props.card.url;

			//* 先尝试通过Fetch方法获取
			let blob = await getBlobByUrl(url, "Fetch");
			if (blob.type==='none') {
				//* Fetch失败后尝试通过GM不指定referer方式获取
				blob = await getBlobByUrl(url, "GM");
			}
			if (blob.type==='none') {
				//* 再次失败后尝试通过GM指定referer方式获取
				blob = await getBlobByUrl(url, "GM", location.origin);
			}

			console.log(blob);
			if (blob&&blob['type']!=='none') {
				await saveAs(blob, props.card.name);
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
</script>

<style scoped lang="scss">
	* {
		border: 0;
		margin: 0;
		box-sizing: border-box;
		/* 禁止选中文字 */
		user-select: none;
		/* 禁止图文拖拽 */
		-webkit-user-drag: none;
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
			transition: 0.5s;
			& {
				position: absolute;
				$padding: 4px;
				top: $padding;
				right: $padding;
				margin: 0;
				width: 24px;
				aspect-ratio: 1;
				max-width: 30px;
				max-height: 30px;
			}

			//* 通用按钮样式
			.button {
				position: absolute;
				margin: auto;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
				font-size: small;
				box-shadow: var(--el-box-shadow-light);

				&.download {
					z-index: 0;
				}
				&.toPosition {
					z-index: 1;
				}
			}
			//* 鼠标悬浮按钮组时候的样式
			&:hover {
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

			width: 100%;
			bottom: 4px;
			left: 4px;

			display: flex;
			flex-flow: row wrap;
			gap: 2px;

			* {
				box-shadow: var(--el-box-shadow-light);
			}
		}
	}
</style>

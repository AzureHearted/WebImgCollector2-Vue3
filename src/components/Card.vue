<template>
	<div ref="cardRef" class="onlineGallery-card" @contextmenu.prevent.self>
		<!-- *FancyBox锚点 -->
		<a
			class="card-FancyBox-anchor"
			data-onlineGallery-fancybox="onlineGallery"
			:data-type="card.fancyBoxType"
			:href="card.linkUrl"
			:data-thumb="card.picUrl"
			:data-width="
				card.fancyBoxType == 'image' || card.fancyBoxType == 'video'
					? card.meta.width
					: null
			"
			:data-height="
				card.fancyBoxType == 'image' || card.fancyBoxType == 'video'
					? card.meta.height
					: null
			"></a>
		<transition name="content" appear>
			<div
				class="onlineGallery-card-body"
				v-if="props.card.visible || visibility">
				<!-- *图片 -->
				<Img
					class="content"
					:src="card.picUrl"
					:width="card.meta.width"
					:height="card.meta.height">
				</Img>
			</div>
		</transition>
		<transition appear>
			<div
				class="onlineGallery-card-other"
				v-if="props.card.visible || visibility">
				<transition name="bottom-to-top" appear>
					<!-- *标签组 -->
					<div class="tag-group" v-if="props.card.visible || visibility">
						<!-- *大小标签 -->
						<el-tooltip
							v-if="card.linkBlob"
							effect="dark"
							:content="blobSize_tag"
							placement="top">
							<el-tag
								class="el-tag"
								round
								size="small"
								type="info"
								@click.right="copyTagContent(blobSize_tag)">
								{{ blobSize_tag }}
							</el-tag>
						</el-tooltip>
						<!-- *尺寸标签 -->
						<el-tooltip effect="dark" :content="size_tag" placement="top">
							<el-tag
								class="el-tag"
								size="small"
								type="info"
								@click.right="copyTagContent(size_tag)"
								round>
								{{ size_tag }}
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
						<!-- *后缀名标签 -->
						<el-tooltip
							effect="dark"
							:content="card.linkUrlExt"
							placement="top"
							v-if="card.linkUrlExt">
							<el-tag
								class="el-tag"
								round
								size="small"
								type="danger"
								@click.right="copyTagContent(card.linkUrlExt)">
								{{ card.linkUrlExt }}
							</el-tag>
						</el-tooltip>
					</div>
				</transition>
				<transition name="top-to-bottom" appear>
					<!-- *勾选框 -->
					<el-checkbox
						v-model="card.selected"
						class="checkbox"
						v-if="props.card.visible || visibility" />
				</transition>
				<transition name="top-to-bottom" appear>
					<!-- *按钮组 -->
					<div class="button-group" v-if="props.card.visible || visibility">
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
				</transition>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
	const {text, isSupported, copy} = useClipboard(); //* 剪切板

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
				visible: false,
				match: false,
				fancyBoxType: "image",
			};
		},
	});

	const appInfo = useAppInfoStore();
	const downloading = ref(false); //* 用于标记下载过程

	//* 尺寸计算属性
	const size_tag = computed(() => {
		return `${props.card.meta.width}x${props.card.meta.height}`;
	});

	//* blob大小计算属性
	const blobSize_tag = computed(() => {
		if (props.card.linkBlob) {
			return byteSizeAutoUnit(props.card.linkBlob.size);
		} else {
			return (0).toFixed(2) + "KB";
		}
	});

	/**
	 * f 字节 -> 自动单位
	 * @param byteSize 字节大小
	 */
	function byteSizeAutoUnit(byteSize: number, fixed: number = 2): string {
		enum Unit {
			"B" = 1,
			"KB",
			"MB",
			"GB",
			"TB",
		}
		let unit = 1;
		let num = byteSize;
		while (num / 1024 >= 1) {
			if (unit + 1 >= 1 && unit <= 5) {
				num = num / 1024;
				unit++;
			} else {
				break;
			}
		}
		let unitStr: "B" | "KB" | "MB" | "GB" | "TB";
		switch (unit) {
			case 1:
				unitStr = "B";
				break;
			case 2:
				unitStr = "KB";
				break;
			case 3:
				unitStr = "MB";
				break;
			case 4:
				unitStr = "GB";
				break;
			case 4:
				unitStr = "GB";
				break;
			case 5:
				unitStr = "TB";
				break;
			default:
				num = byteSize;
				unitStr = "B";
				break;
		}
		return `${num.toFixed(fixed)}${unitStr}`;
	}

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

	//f 下载图片
	const download = async () => {
		const card = props.card;
		downloading.value = true;
		if (card.linkBlob) {
			//* 后缀名处理
			let ext = getExtByBlob(card.linkBlob);
			// console.log(ext);
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
				//* 后缀名处理
				let ext = getExtByBlob(card.linkBlob);
				// console.log(ext);
				let reg = new RegExp(`(\\.${ext})+$`);
				await saveAs(card.linkBlob, `${card.name.replace(reg, "")}.${ext}`);

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

	//! 卡片可见性判断
	const cardRef = ref<HTMLElement | null>();

	const visibility = useElementVisibility(cardRef, {
		scrollTarget: document.querySelector(
			"#onlineGallery-list-container"
		) as HTMLElement,
	});

	let stopFn: Function = () => {};
	onUpdated(() => {
		//* 一旦card的状态(eg:index)变化则重新绑定监视器
		stopFn();
		const {stop} = useIntersectionObserver(
			cardRef,
			([{isIntersecting}], observerElement) => {
				// console.log("可见状态", isIntersecting, observerElement);
				props.card.visible = isIntersecting;
			},
			{
				immediate: true,
				root: document.querySelector("#onlineGallery-container") as HTMLElement,
				rootMargin: "100px 0px 100px 0px",
				threshold: [0, 0.1, 0.25, 0.5, 0.75, 0.8, 0.9, 1],
			}
		);
		stopFn = stop;
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
	.onlineGallery-card {
		border: 0 !important;
		margin: 0 !important;
		padding: 0 !important;
		scroll-snap-align: start;
		position: relative;
		border-radius: 4px;
		box-shadow: var(--el-box-shadow-dark);

		aspect-ratio: var(--aspect-ratio) !important;
		max-width: 100%;
		$height: max(var(--cardMaxHeight), 200px);
		max-height: $height;
		// max-height: var(--cardMaxHeight);
		width: calc($height * var(--aspect-ratio)) !important;
		// width: calc(var(--cardMaxHeight) * var(--aspect-ratio)) !important;

		background-color: transparent;

		overflow: hidden;

		cursor: pointer;

		transition: box-shadow 0.5s ease;

		//* 卡片悬停触发
		&:hover {
			box-shadow: 1px 2px 12px 6px rgba(0, 0, 0, 0.5);
		}

		//* fancyBox 锚点
		.card-FancyBox-anchor {
			position: absolute !important;
			width: 100%;
			height: 100%;
			z-index: 1;
			/* 禁止图文拖拽 */
			-webkit-user-drag: none;
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

		.onlineGallery-card-other {
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
					// transition: 0.15s;
					z-index: 1;
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
					// transition: 0.15s;
				}
				//* 鼠标悬浮按钮组时候的样式
				&:hover {
					& {
						height: 24px + 26px;
					}
					//* 定位按钮样式
					.button.download {
						transform: translateY(26px);
						transition: 0.25s;
					}
				}
				@media (max-width: 500px) {
					& {
						height: 24px + 26px !important;
					}
					.button.download {
						transform: translateY(26px) !important;
						transition: 0.25s;
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
				z-index: 1;
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
				z-index: 1;

				.el-tag {
					max-width: 100%;
					justify-content: start;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}

	//* transition效果
	.content-enter-active,
	.content-leave-active {
		transition: opacity 0.25s ease, transform 0.15s ease;
	}

	.content-enter-from,
	.content-leave-to {
		opacity: 0;
		transform: translateY(100%);
	}

	//* 从下往上进入
	.bottom-to-top-enter-active,
	.bottom-to-top-leave-active {
		transition: opacity 0.5s ease, transform 0.25s ease;
	}

	.bottom-to-top-enter-from,
	.bottom-to-top-leave-to {
		opacity: 0;
		transform: translateY(100%);
	}

	//* 从上往下进入
	.top-to-bottom-enter-active,
	.top-to-bottom-leave-active {
		transition: opacity 0.5s ease, transform 0.25s ease;
	}

	.top-to-bottom-enter-from,
	.top-to-bottom-leave-to {
		opacity: 0;
		transform: translateY(-100%);
	}
</style>

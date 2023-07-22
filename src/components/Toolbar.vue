<template>
	<div class="onlineGallery-toolBar">
		<!-- *数量统计 -->
		<el-statistic class="statistic" :value="cardsStore.data.filterCards.length">
			<template #title>
				<div style="display: flex; justify-content: center">
					选中 / 可见 / 总数
				</div>
			</template>
			<template #prefix>{{ selectedCards.length }} / </template>
			<template #suffix>/ {{ cardsStore.data.cardList.length }} </template>
		</el-statistic>
		<!-- *过滤器控制条 -->
		<div class="filter">
			<!-- *尺寸过滤 -->
			<div class="size">
				<div class="width row">
					<span class="label">宽度</span>
					<el-slider
						:debounce="500"
						class="slider"
						label="宽度"
						
						v-model="filter.size.width.value"
						range
						:min="0"
						:max="filter.size.width.max"
						placement="right" />
				</div>
				<div class="height row">
					<span class="label">高度</span>
					<el-slider
						:debounce="500"
						class="slider"
						label="高度"
						
						v-model="filter.size.height.value"
						range
						:min="0"
						:max="filter.size.height.max"
						placement="right" />
				</div>
			</div>
			<!-- *格式过滤 -->
			<div class="format">
				<span class="label">格式</span>
				<el-select-v2
					class="select"
					
					v-model="filter.formats.value"
					filterable
					clearable
					allow-create
					collapse-tags
					collapse-tags-tooltip
					:max-collapse-tags="1"
					:options="filter.formats.options"
					placeholder="格式过滤"
					multiple></el-select-v2>
			</div>
		</div>
		<!-- *最大显示行数控制条 -->
		<div class="zoom-slider">
			<span>最大显示行数</span>
			<el-slider
				label="最大显示行数"
				v-model="listStore.info.nowColumn"
				:min="1"
				:max="6"
				:step="1"
				placement="right"
				show-stops />
		</div>
		<!-- *按钮组 -->
		<el-button-group class="button-group">
			<!-- *刷新按钮 -->
			<el-button
				type="primary"
				@click="refresh"
				
				:loading="loading.value">
				刷新
				<template #icon>
					<el-icon><i-ep-RefreshRight /></el-icon>
				</template>
			</el-button>
			<!-- *全选按钮 -->
			<el-button
				type="primary"
				@click="allSelectSwitch"
				
				:loading="loading.value"
				:icon="listStore.info.allSelected ? CheckboxAll : CheckboxNone">
				{{ listStore.info.allSelected ? "全选" : "取消全选" }}
			</el-button>
			<!-- *下载按钮 -->
			<el-button
				type="primary"
				@click="downloadSelected"
				
				:loading="loading.value">
				下载选中
				<template #icon>
					<el-icon><i-ep-Download /></el-icon>
				</template>
			</el-button>
		</el-button-group>
		<!-- *下拉菜单 -->
		<el-dropdown >
			<el-button type="primary" >
				<template #icon>
					<el-icon><i-ep-MoreFilled /></el-icon>
				</template>
			</el-button>
			<template #dropdown>
				<el-dropdown-menu>
					<!-- *规则管理按钮 -->
					<el-dropdown-item @click="ruleEditor.container.open = true">
						<el-icon><i-ep-Management /></el-icon>
						规则管理
					</el-dropdown-item>
					<!-- *设置菜单入口按钮 -->
					<el-dropdown-item @click="">
						<el-icon><i-ep-Tools /></el-icon>
						设置
					</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>
</template>

<script setup lang="ts">
	import CheckboxNone from "/src/svg/checkbox-blank-line.svg"; //? svg导入
	import CheckboxAll from "/src/svg/checkbox-fill.svg"; //? svg导入

	const appInfo = useAppInfoStore(); //* 实例化appInfo数据仓库
	const cardsStore = useCardsStore(); //* 实例化cardsStore数据仓库
	const Toolbar = useToolBarStore(); //* 实例化Toolbar数据仓库
	const listStore = useListInfoStore();
	const ruleEditor = useRuleEditorStore(); //* 实例化ruleEditor数据仓库

	//* 进度条
	const loading = appInfo.loading;

	//* 过滤器参数
	const filter = Toolbar.filter;

	//f 刷新函数
	const refresh = async () => {
		await getCards();
	};

	//f  选中的卡片列表
	const selectedCards = computed(() => {
		return cardsStore.data.cardList.filter((card) => card.selected);
	});

	//f 全选切换
	const allSelectSwitch = async () => {
		listStore.info.allSelected = !listStore.info.allSelected; //* 全选标识符取反
		appInfo.loading.value = true;
		//* 刷新结果
		cardsStore.data.filterCards.forEach(
			(card) => (card.selected = listStore.info.allSelected)
		);
		appInfo.loading.value = false;
	};

	//f 下载选中项
	const downloadSelected = async () => {
		const downloadCards = selectedCards.value;
		if (!downloadCards.length) {
			ElMessage({
				message: "请选择要下载的数据",
				type: "info",
				showClose: true,
				grouping: true,
				offset: 80,
			});
			return;
		}
		const taskQueue = new TaskQueue({showMessage: false, max: 5});
		loading.init();
		let finallyCount = 0;

		//* 创建任务清单
		for (const card of downloadCards) {
			if (card.blob == null) {
				//* 队列任务定义
				const task = async () => {
					const url = card.url;

					//* 先尝试通过Fetch方法获取
					let blob = await getBlobByUrl(url, "Fetch");
					if (!blob) {
						//* Fetch失败后尝试通过GM不指定referer方式获取
						blob = await getBlobByUrl(url, "GM");
					}
					if (!blob) {
						//* 再次失败后尝试通过GM指定referer方式获取
						blob = await getBlobByUrl(url, "GM", location.origin);
					}

					card.blob = blob;

					if (card.blob != null) {
						return [card.name, "处理成功!"];
					} else {
						return [card.name, "处理失败"];
					}
				};
				taskQueue.addTask(task);
			}
		}

		taskQueue.singleCallback = () => {
			finallyCount++;
			loading.percentage = (finallyCount / downloadCards.length) * 100;
		};

		taskQueue.finallyCallback = async () => {
			ElMessage({
				message: "下载成功! (正在生成压缩包)",
				type: "success",
				showClose: true,
				grouping: true,
				offset: 80,
			});
			const zipContainer = new JSZip();
			//* 生成压缩包
			for (const card of downloadCards) {
				// console.log(card);
				if (card.name != null && card.blob != null) {
					zipContainer.file(card.name, card.blob);
				}
			}
			// console.log(zipContainer);
			const zip = await zipContainer.generateAsync({
				type: "blob",
				compression: "DEFLATE",
				level: 9,
			});
			// console.log(zip);
			//* 下载压缩包
			let zipName: string = document.querySelector<any>("title").innerText;
			saveAs(zip, `${zipName}.zip`);

			loading.percentage = 100;
			loading.reset();
		};

		//* 开始执行
		taskQueue.run();
	};

	//f 获取卡片
	const getCards = async () => {
		let cardDomList = await getImgOrVideoDom(); //* 先获取dom
		// console.log(cardDomList);
		let tempCardList: matchCard[] = [];

		//* 没有匹配到任何dom就停止操作直接返回
		if (!cardDomList.length) {
			ElMessage({
				message: "没有匹配到相应数据",
				type: "info",
				showClose: true,
				grouping: true,
				offset: 80,
			});
			return;
		}

		const taskQueue = new TaskQueue({showMessage: false, max: 10});
		//* 进度条初始化
		loading.init();
		let finallyCount = 0;

		taskQueue.taskList = cardDomList.map((dom, index) => {
			// console.log(initCount + index);
			return async () => {
				//* 从得到的dom中找出符合条件的dom并生成card对象
				const card: matchCard = {
					name: "",
					url: "",
					originUrls: [],
					//* 初始meta信息
					meta: <metaInterFace>{
						isOk: false,
						width: 0,
						height: 0,
						aspectRatio: 3 / 4,
					},
					match: false, //? 匹配标识符
					selected: false, //? 选中标识符
					dom: dom,
				};

				//* 标签类型判断
				if (dom.tagName == "META") {
					// 如果是meta标签上的链接：通过请求进行判断
					card.originUrls = <string[]>(
						[getTagInfo(dom, 3, "content")].filter((url) => !isEmpty(url, true))
					);
					if (card.originUrls.length > 0) {
						card.url = card.originUrls[0];
						const blob = await fetch(card.url)
							.then((res) => res.blob())
							.catch(() => {
								return new Blob(undefined, {type: "none"});
							});
						// console.log(`是否是img文件：${/^image/.test(blob.type)}`);
						if (/^image/.test(blob.type)) {
							//! 获取meta信息
							const meta: metaInterFace = await getMetaByBlob(blob);
							// console.log(meta);
							if (meta.isOk) {
								card.name = getNameByUrl(card.url);
								card.meta.width = meta.width;
								card.meta.height = meta.height;
								card.meta.aspectRatio = meta.width / meta.height;
								card.match = true;
							}
						}
					}
				} else if (dom.tagName == "IMG" || dom.tagName == "VIDEO") {
					// 确保每个img/video的尺寸都有效
					if (dom.naturalWidth > 0 && dom.naturalHeight > 0) {
						//* naturalWidth和naturalHeight都 有效时：直接使用有效值
						card.originUrls = <string[]>(
							[
								getTagInfo(dom, 2, "srcset"),
								getTagInfo(dom, 2, "data-src"),
								getTagInfo(dom, 3, "src"),
							].filter((url) => !isEmpty(url, true))
						);
						if (card.originUrls.length > 0) {
							card.url = card.originUrls[0];
							card.name = getNameByUrl(card.url);
							card.meta.width = dom.naturalWidth;
							card.meta.height = dom.naturalHeight;
							card.meta.aspectRatio = dom.naturalWidth / dom.naturalHeight;
							card.match = true;
						}
					} else {
						//* naturalWidth和naturalHeight 无效时：通过请求进行判断
						card.originUrls = <any>(
							[
								getTagInfo(dom, 2, "srcset"),
								getTagInfo(dom, 2, "data-src"),
								getTagInfo(dom, 3, "src"),
							].filter((url) => !isEmpty(url, true))
						);
						if (card.originUrls.length > 0) {
							card.url = card.originUrls[0];
							const blob = await fetch(card.url)
								.then((res) => res.blob())
								.catch((err) => {
									return new Blob(undefined, {type: "none"});
								});
							if (/^image/.test(blob.type)) {
								//! 获取meta信息
								const meta: metaInterFace = await getMetaByBlob(blob);
								if (meta.isOk) {
									card.name = getNameByUrl(card.url);
									card.meta.width = meta.width;
									card.meta.height = meta.height;
									card.meta.aspectRatio = meta.width / meta.height;
									card.match = true;
								}
							}
						}
					}
				} else if (dom.tagName == "A") {
					card.originUrls = <string[]>(
						[getTagInfo(dom, 3, "href")].filter((url) => !isEmpty(url, true))
					);
					if (card.originUrls.length > 0) {
						card.url = card.originUrls[0];
						const blob = await fetch(card.url)
							.then((res) => res.blob())
							.catch((err) => {
								return new Blob(undefined, {type: "none"});
							});
						if (/^image/.test(blob.type)) {
							//! 获取meta信息
							const meta: metaInterFace = await getMetaByBlob(blob);
							// console.log(meta);
							if (meta.isOk) {
								card.name = getNameByUrl(card.url);
								card.meta.width = meta.width;
								card.meta.height = meta.height;
								card.meta.aspectRatio = meta.width / meta.height;
								card.match = true;
							}
						}
					}
				}

				//* 从未匹配过的才进行添加
				if (card.match && !cardsStore.data.urlSet.has(card.url)) {
					//? 更新过滤器的最大值
					const max =
						(filter.size.width.max =
						filter.size.height.max =
							Math.max(
								filter.size.width.max,
								filter.size.height.max,
								card.meta.width,
								card.meta.height
							));
					filter.size.width.value[1] = filter.size.height.value[1] = max;

					delete card.match; //*消除临时属性
					card["id"] = buildUUID(); //* 生成id
					tempCardList[index] = card;
					cardsStore.data.urlSet.add(card.url);
					cardsStore.data.domSet.add(card.dom);
					return ["符合条件（添加）", card.dom];
				} else {
					return ["不符合条件（排除）"];
				}
			};
		});

		//* [额外操作]每个任务成功时的回调
		taskQueue.singleCallback = () => {
			finallyCount++;
			loading.percentage = (finallyCount / cardDomList.length) * 100;
		};

		//* [额外操作]所有任务成功时的回调
		taskQueue.finallyCallback = () => {
			//* 过滤空值
			cardsStore.data.cardList.push(...tempCardList.filter((card) => card));
			// console.log("更新成功");
			ElMessage({
				message: "数据更新成功!",
				type: "success",
				showClose: true,
				grouping: true,
				offset: 80,
			});
			loading.percentage = 100;
			loading.reset();
		};
		//! 执行队列
		taskQueue.run();
	};

	//f 获取匹配的dom
	const getImgOrVideoDom = async () => {
		let imgDoms: any[] = [];
		if (filter.formats.value.length) {
			//* 格式过滤器不为空
			const formatList = filter.formats.value;
			for (const format of formatList) {
				imgDoms.push(
					...Array.from(
						document.querySelectorAll(
							`meta[property="og:image"][content $= '\.${format}']`
						)
					)
				);
				imgDoms.push(
					...Array.from(document.querySelectorAll(`img[src $= '\.${format}']`))
				);
				imgDoms.push(
					...Array.from(document.querySelectorAll(`[href $= '\.${format}']`))
				);
			}
		} else {
			//* 格式过滤器为空
			imgDoms.push(
				...Array.from(
					document.querySelectorAll(`meta[property="og:image"][content]`)
				)
			);
			imgDoms.push(...Array.from(document.querySelectorAll(`img[src]`)));
		}

		return imgDoms;
	};

	//? 向父组件暴露内容(只有父组件onMounted后才能被读取到)
	defineExpose({
		getCards,
	});
</script>

<style lang="scss" scoped>
	* {
		font-family: win-bug-omega, system-ui, -apple-system, "Segoe UI", Roboto,
			Ubuntu, Cantarell, "Noto Sans", "Hiragino Kaku Gothic ProN", Meiryo,
			sans-serif !important;
	}

	$my-font-family: win-bug-omega, system-ui, -apple-system, "Segoe UI", Roboto,
		Ubuntu, Cantarell, "Noto Sans", "Hiragino Kaku Gothic ProN", Meiryo,
		sans-serif;

	.onlineGallery-toolBar {
		& {
			position: relative;
			margin-top: 10px;
			margin-bottom: 10px;
			display: flex;
			flex-flow: row wrap;
			justify-content: start;
			align-items: center;
			// align-items:center;

			gap: 14px;

			color: black;

			/* 禁止选中文字 */
			user-select: none;
			/* 禁止图文拖拽 */
			-webkit-user-drag: none;
			@media (max-width: 500px) {
				gap: 2px;
				margin-top: 4px;
				margin-bottom: 8px;
				padding-left: 20px;
				padding-right: 20px;
			}
		}

		// *统计组件样式
		.statistic {
			flex-shrink: 0;
			width: 120px;
			font-size: 16px !important;
			display: flex;
			flex-flow: column;
			justify-content: center;
			align-items: center;
			@media (max-width: 500px) {
				width: 100%;
				align-items: start;
			}
		}

		// *过滤器控制条样式
		.filter {
			& {
				// flex-grow: 2;
				width: fit-content;
				display: flex;
				flex-flow: column;
				justify-content: center;
				align-items: center;
				@media (max-width: 500px) {
					width: 100%;
					align-items: start;
					gap: 2px;
				}
			}

			//* 尺寸过滤器
			.size {
				& {
					flex-grow: 2;
					width: 250px;
					display: flex;
					flex-flow: column nowrap;
					@media (max-width: 500px) {
						gap: 2px;
					}
				}
				//* 每一行的样式
				.row {
					display: flex;
					flex-flow: row nowrap;
					gap: 8px;
					justify-content: start;
					align-items: center;
					.slider {
						flex-grow: 1;
						// min-width: 150px;
						// max-width: 190px;
					}
					.label {
						margin: 0;
						white-space: nowrap; //* 防止换行
						font-size: 16px !important;
					}
				}
			}

			//* 格式过滤器
			.format {
				& {
					width: 250px;
					flex-grow: 1;
					display: flex;
					flex-flow: row;
					justify-content: center;
					align-items: center;
					gap: 8px;
				}
				.select {
					flex-grow: 1;
				}
				.label {
					margin: 0;
					text-align: center;
					white-space: nowrap; //* 防止换行
					font-size: 16px !important;
				}
			}
		}

		// *缩放控制条样式
		.zoom-slider {
			width: 180px;
			font-size: 16px !important;
			@media (max-width: 500px) {
				width: 100%;
			}
		}

		//* 按钮组样式
		.button-group {
			width: fit-content;
		}
	}

	/* *统计组件样式 */
</style>

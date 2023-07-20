<template>
	<div class="onlineGallery-toolBar">
		<!-- *数量统计 -->
		<el-statistic class="statistic" :value="filterCards.length">
			<template #title>
				<div style="display: flex; justify-content: center">选中 / 可见 / 总数</div>
			</template>
			<template #prefix>{{ selectedCards.length }} / </template>
			<template #suffix>/ {{ data.cardList.length }} </template>
		</el-statistic>
		<!-- *过滤器控制条 -->
		<div class="filter">
			<!-- *尺寸过滤 -->
			<div class="size">
				<div class="width row">
					<span class="label">宽度</span>
					<el-slider
						class="slider"
						label="宽度"
						size="small"
						v-model="filter.size.width.value"
						range
						:min="0"
						:max="filter.size.width.max"
						placement="right" />
				</div>
				<div class="height row">
					<span class="label">高度</span>
					<el-slider
						class="slider"
						label="高度"
						size="small"
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
					size="small"
					v-model="filter.formats.value"
					filterable
					clearable
					allow-create
					collapse-tags
					collapse-tags-tooltip
					:max-collapse-tags="1"
					:options="filter.formats.options"
					placeholder="格式过滤"
					multiple />
			</div>
		</div>
		<!-- *最大显示行数控制条 -->
		<div class="zoom-slider">
			<span>最大显示行数</span>
			<el-slider
				label="最大显示行数"
				v-model="info.nowColumn"
				:min="1"
				:max="8"
				:step="1"
				size="small"
				placement="right"
				show-stops>
			</el-slider>
		</div>
		<!-- *按钮组 -->
		<el-button-group class="button-group">
			<!-- *刷新按钮 -->
			<el-button
				type="primary"
				@click="refresh"
				size="small"
				round
				:loading="loading.value"
				:icon="RefreshRight">
				刷新
			</el-button>
			<!-- *全选按钮 -->
			<el-button
				type="primary"
				@click="allSelectSwitch"
				size="small"
				round
				:loading="loading.value"
				:icon="info.allSelected ? CheckboxAll : CheckboxNone">
				{{ info.allSelected ? "取消全选" : "选择全部" }}
			</el-button>
			<!-- *下载按钮 -->
			<el-button
				type="primary"
				@click="downloadSelected"
				size="small"
				round
				:loading="loading.value"
				:icon="Download">
				下载选中项
			</el-button>
			<!-- *下拉菜单 -->
			<el-dropdown size="small">
				<el-button type="primary" size="small" :icon="MoreFilled"></el-button>
				<template #dropdown>
					<el-dropdown-menu>
						<!-- *规则管理器入口按钮 -->
						<RuleEditor />
						<!-- <el-dropdown-item command="openRuleEditor">
								<AppRuleEditor />
							</el-dropdown-item> -->
						<!-- *设置菜单入口按钮 -->
						<!-- <AppSettingMenu /> -->

						<!-- <el-dropdown-item command="openAppSettingMenu">
								<SettingMenu />
							</el-dropdown-item> -->
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</el-button-group>
	</div>
</template>

<script setup>
	import SettingMenu from "./SettingMenu.vue";
	import RuleEditor from "./RuleEditor.vue";

	import {getBlobByUrl, getOriginByUrl, getNameByUrl, buildUUID} from "../js/public.js";

	import {RefreshRight, Download, MoreFilled} from "@element-plus/icons-vue"; //? element icon导入

	import CheckboxNone from "/src/svg/checkbox-blank-line.svg"; //? svg导入
	import CheckboxIndeterminate from "/src/svg/checkbox-indeterminate-fill.svg"; //? svg导入
	import CheckboxAll from "/src/svg/checkbox-fill.svg"; //? svg导入

	const props = defineProps({
		data: Object,
		info: Object,
		loading: Object,
	});

	//* 过滤器参数
	const filter = reactive({
		size: {
			width: {value: [350, 3840], max: 3840},
			height: {value: [350, 3840], max: 3840},
		},
		formats: {
			options: [
				{value: "png", label: "png"},
				{value: "jpg", label: "jpg"},
				{value: "jpeg", label: "jpeg"},
				{value: "gif", label: "gif"},
				{value: "bmp", label: "bmp"},
				{value: "webp", label: "webp"},
				{value: "svg", label: "svg"},
			],
			value: ["png", "jpg", "jpeg", "gif", "webp", "bmp"],
		},
	});

	//f 过滤后的cardList结果(计算属性) 返回结果在script中需要使用.value访问
	const filterCards = computed(() => {
		let regex = filter.formats.value.length
			? new RegExp(`\\.(${filter.formats.value.join("|")})$`)
			: new RegExp("");
		const result = props.data.cardList.filter(
			(card) =>
				card.width >= filter.size.width.value[0] &&
				card.width <= filter.size.width.value[1] &&
				card.height >= filter.size.height.value[0] &&
				card.height <= filter.size.height.value[1] &&
				regex.test(card.url)
		);
		props.data.filterCards = result;
		return result;
	});

	//f 刷新函数
	const refresh = async () => {
		await getCards();
	};

	//f  选中的卡片列表
	const selectedCards = computed(() => {
		return props.data.cardList.filter((card) => card.selected);
	});

	//f 全选切换
	const allSelectSwitch = async () => {
		props.info.allSelected = !props.info.allSelected; //* 全选标识符取反
		props.loading.value = true;
		//* 刷新结果
		filterCards.value.forEach((card) => (card.selected = props.info.allSelected));
		props.loading.value = false;
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
		props.loading.init();
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
			props.loading.percentage = (finallyCount / downloadCards.length) * 100;
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
			saveAs(zip, `${document.querySelector("title").innerText}.zip`);

			props.loading.percentage = 100;
			props.loading.reset();
		};

		//* 开始执行
		taskQueue.run();
	};

	//f 获取卡片
	const getCards = async () => {
		let cardDomList = await getImgOrVideoDom(); //* 先获取dom
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
		props.loading.init();
		let finallyCount = 0;

		let oldUrlList = new Set(props.data.cardList.map((card) => card.url)); //* 获取旧对象对应的url集合
		const taskList = cardDomList.map((dom) => {
			return async () => {
				//* 从得到的dom中找出符合条件的dom并生成card对象

				let temp = {
					name: "",
					url: "",
					originUrls: [],
					width: 0,
					height: 0,
					aspectRatio: 0,
					match: false, //? 匹配标识符
					selected: false, //? 选中标识符
					dom: dom,
				};

				//* 标签类型判断
				if (dom.tagName == "META") {
					// 如果是meta标签上的链接：通过请求进行判断
					temp.originUrls = [getTagInfo(dom, 3, "content")].filter((url) => !isEmpty(url, true));
					if (temp.originUrls.length > 0) {
						temp.url = temp.originUrls[0];
						const blob = await fetch(temp.url)
							.then((res) => res.blob())
							.catch((err) => {
								// console.log(err);
								return {
									type: "none",
								};
							});
						// console.log(`是否是img文件：${/^image/.test(blob.type)}`);
						if (/^image/.test(blob.type)) {
							// 读取获取meta信息
							const meta = await new Promise((resolve, reject) => {
								let reader = new FileReader();
								reader.readAsDataURL(blob);
								reader.onload = function (theFile) {
									let image = new Image();
									image.src = theFile.target.result;
									image.onload = function () {
										// console.log(`图片尺寸：${this.width}*${this.height}`,this);
										resolve({
											isOk: true,
											width: this.width,
											height: this.height,
										});
									};
									image.onerror = function () {
										reject({
											isOk: false,
											width: 0,
											height: 0,
										});
									};
								};
							});
							// console.log(meta);
							if (meta.isOk) {
								temp.name = getNameByUrl(temp.url);
								temp.width = meta.width;
								temp.height = meta.height;
								temp.aspectRatio = meta.width / meta.height;
								temp.match = true;
							}
						}
					}
				} else if (dom.tagName == "IMG" || dom.tagName == "VIDEO") {
					// 确保每个img/video的尺寸都有效
					if (dom.naturalWidth > 0 && dom.naturalHeight > 0) {
						// naturalWidth和naturalHeight都有效时：直接使用有效值
						temp.originUrls = [
							getTagInfo(dom, 2, "srcset"),
							getTagInfo(dom, 2, "data-src"),
							getTagInfo(dom, 3, "src"),
						].filter((url) => !isEmpty(url, true));
						if (temp.originUrls.length > 0) {
							temp.url = temp.originUrls[0];
							temp.name = getNameByUrl(temp.url);
							temp.width = dom.naturalWidth;
							temp.height = dom.naturalHeight;
							temp.aspectRatio = dom.naturalWidth / dom.naturalHeight;
							temp.match = true;
						} else {
							temp.match = false;
						}
					} else {
						// naturalWidth和naturalHeight无效时：通过请求进行判断
						temp.originUrls = [
							getTagInfo(dom, 2, "srcset"),
							getTagInfo(dom, 2, "data-src"),
							getTagInfo(dom, 3, "src"),
						].filter((url) => !isEmpty(url, true));
						if (temp.originUrls.length > 0) {
							temp.url = temp.originUrls[0];
							const blob = await fetch(temp.url)
								.then((res) => res.blob())
								.catch((err) => {
									// console.log(err);
									return {
										type: "none",
									};
								});
							if (/^image/.test(blob.type)) {
								// 读取获取meta信息
								const meta = await new Promise((resolve, reject) => {
									let reader = new FileReader();
									reader.readAsDataURL(blob);
									reader.onload = function (theFile) {
										let image = new Image();
										image.src = theFile.target.result;
										image.onload = function () {
											// console.log(`图片尺寸：${this.width}*${this.height}`,this);
											resolve({
												isOk: true,
												width: this.width,
												height: this.height,
											});
										};
										image.onerror = function () {
											reject({
												isOk: false,
												width: 0,
												height: 0,
											});
										};
									};
								});
								// console.log(meta);
								if (meta.isOk) {
									temp.name = getNameByUrl(temp.url);
									temp.width = meta.width;
									temp.height = meta.height;
									temp.aspectRatio = meta.width / meta.height;
									temp.match = true;
								}
							}
						}
					}
				} else if (dom.tagName == "A") {
					temp.originUrls = [getTagInfo(dom, 3, "href")].filter((url) => !isEmpty(url, true));
					if (temp.originUrls.length > 0) {
						temp.url = temp.originUrls[0];
						const blob = await fetch(temp.url)
							.then((res) => res.blob())
							.catch((err) => {
								// console.log(err);
								return {
									type: "none",
								};
							});
						if (/^image/.test(blob.type)) {
							// 读取获取meta信息
							const meta = await new Promise((resolve, reject) => {
								let reader = new FileReader();
								reader.readAsDataURL(blob);
								reader.onload = function (theFile) {
									let image = new Image();
									image.src = theFile.target.result;
									image.onload = function () {
										// console.log(`图片尺寸：${this.width}*${this.height}`,this);
										resolve({
											isOk: true,
											width: this.width,
											height: this.height,
										});
									};
									image.onerror = function () {
										reject({
											isOk: false,
											width: 0,
											height: 0,
										});
									};
								};
							});
							// console.log(meta);
							if (meta.isOk) {
								temp.name = getNameByUrl(temp.url);
								temp.width = meta.width;
								temp.height = meta.height;
								temp.aspectRatio = meta.width / meta.height;
								temp.match = true;
							}
						}
					}
				}
				//* 只用匹配项目才push进cardList
				if (temp.match && !oldUrlList.has(temp.url)) {
					//? 更新过滤器的最大值
					filter.size.width.max = Math.max(filter.size.width.max, temp.width);
					filter.size.height.max = Math.max(filter.size.height.max, temp.height);
					let card = temp;
					delete card.match; //*消除临时属性
					card.id = buildUUID(); //* 生成id
					props.data.cardList.push(card);
					return ["符合条件（添加）", card.dom];
				} else {
					return ["不符合条件（排除）"];
				}
			};
		});
		taskQueue.taskList = taskList;

		taskQueue.singleCallback = () => {
			finallyCount++;
			props.loading.percentage = (finallyCount / cardDomList.length) * 100;
		};
		taskQueue.finallyCallback = () => {
			console.log("更新成功");
			ElMessage({
				message: "数据更新成功!",
				type: "success",
				showClose: true,
				grouping: true,
				offset: 80,
			});
			props.loading.percentage = 100;
			props.loading.reset();
		};
		//* 执行队列
		taskQueue.run();
	};

	//f 获取匹配的dom
	const getImgOrVideoDom = async () => {
		let imgDoms = [];
		if (filter.formats.value.length) {
			//* 格式过滤器不为空
			const formatList = filter.formats.value;
			for (const format of formatList) {
				imgDoms.push(
					...Array.from(
						document.querySelectorAll(`meta[property="og:image"][content $= '\.${format}']`)
					)
				);
				imgDoms.push(...Array.from(document.querySelectorAll(`img[src $= '\.${format}']`)));
				imgDoms.push(...Array.from(document.querySelectorAll(`[href $= '\.${format}']`)));
			}
		} else {
			//* 格式过滤器为空
			imgDoms.push(...Array.from(document.querySelectorAll(`meta[property="og:image"][content]`)));
			imgDoms.push(...Array.from(document.querySelectorAll(`img[src]`)));
		}

		return imgDoms;
	};

	//f 获取媒体文件的尺寸信息
	const getMetaInfo = async (url) => {};

	//f [功能封装]获取dom标签的相关内容
	//? (1:值,2:Attribute属性,3:Property属性,4:innerText内部文本,5:innerHTML,6:outerHTML)

	const getTagInfo = (domTag, type, attr) => {
		let attrList = [];
		if (/\|/.test(attr)) {
			attrList = attr.split("|");
		} else {
			attrList = [attr];
		}
		if (domTag == null) {
			return null;
		}
		let result;
		if (type == 1) {
			//* 提取 值(value)
			result = domTag.value;
		} else if (type == 2) {
			//* 提取 Attribute属性
			result = "";
			for (let i = 0; i < attrList.length; i++) {
				const attr = attrList[i];
				let temp = domTag.getAttribute(attr);
				//* 判空操作
				if (!isEmpty(temp)) {
					if (attr == "srcset") {
						//* srcset属性信息的处理方式
						temp = getSrcsetMaximumValue(temp);
					}
					result = temp;
					break;
				}
			}
		} else if (type == 3) {
			//* 提取 Property属性
			result = "";
			for (let i = 0; i < attrList.length; i++) {
				const attr = attrList[i];
				let temp = domTag[attr];
				//* 判空操作
				if (!isEmpty(temp)) {
					if (attr == "srcset") {
						//* srcset属性信息的处理方式
						temp = getSrcsetMaximumValue(temp);
					}
					result = temp;
					break;
				}
			}
		} else if (type == 4) {
			//* 提取 innerText内部文本
			result = domTag.innerText;
		} else if (type == 5) {
			//* 提取 innerHTML
			result = domTag.innerHTML;
		} else if (type == 6) {
			//* 提取 outerHTML
			result = domTag.outerHTML;
		}
		if (isUrl(result)) {
			result = urlCompletion(result);
		}
		return String(result);
	};

	//f [功能封装]判断字符串是否为空
	const isEmpty = (str = "", includeSpace = false) => {
		return includeSpace
			? str == null || str == undefined || str == "" || /^ +?$/.test(str)
			: str == null || str == undefined || str == "";
	};

	//f [功能封装]url路径补全
	const urlCompletion = (url) => {
		const v1 = /^\/[^\/].*$/i;
		const v2 = /^\/\/.*$/i;
		if (v1.test(url)) {
			return window.document.location.origin + url;
		}
		if (v2.test(url)) {
			return window.document.location.protocol + url;
		}
	};

	//f [功能封装]判断字符串是否是一个路径
	const isUrl = (str) => {
		var v = /^(\/|(.\/)).+?$/i;
		return v.test(str);
	};

	//f [功能封装] 获取srcset内容最大值
	const getSrcsetMaximumValue = (srcsetString) => {
		let result = srcsetString;
		if (/\d+w/.test(srcsetString)) {
			let dataList = srcsetString
				.split(/\, */)
				.filter((item) => !isEmpty(item, true))
				.map((item) => {
					const itemDataInfos = item.split(" ");
					if (itemDataInfos.length == 2) {
						return {
							url: itemDataInfos[0],
							resolution: Number(itemDataInfos[1].split(/w|W/)[0]),
						};
					} else {
						return {
							url: itemDataInfos[0],
							resolution: 0,
						};
					}
				});
			// console.log(dataList);
			let maxItem = dataList[0];
			dataList.forEach((item) => {
				if (maxItem.resolution < item.resolution) {
					maxItem = item;
				}
			}); //*选区最大尺寸的链接
			result = maxItem.url;
		}

		return result;
	};

	//? 向父组件暴露内容(只有父组件onMounted后才能被读取到)
	defineExpose({
		getCards,
	});
</script>

<style lang="scss" scoped>
	* {
		font-family: win-bug-omega, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell,
			"Noto Sans", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif !important;
	}

	$my-font-family: win-bug-omega, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell,
		"Noto Sans", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;

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
				margin-top: 14px;
				margin-bottom: 4px;
			}
		}

		// *统计组件样式
		.statistic {
			flex-shrink: 0;
			width: 150px;
			font-size: 14px !important;
			display: flex;
			flex-flow: column;
			justify-content: center;
			align-items: center;
		}

		// *过滤器控制条样式
		.filter {
			& {
				// flex-grow: 2;
				width: fit-content;
				display: flex;
				flex-flow: row wrap;
				justify-content: center;
				align-items: center;
				gap: 20px;

				@media (max-width: 500px) {
					width: 100%;
					gap: 2px;
				}
			}
			//* 尺寸过滤器
			.size {
				& {
					flex-grow: 3;
					display: flex;
					flex-flow: column nowrap;
					@media (max-width: 500px) {
						margin-left: 10px;
						margin-right: 10px;
						width: 50%;
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
						min-width: 150px;
						max-width: 190px;
					}
					.label {
						margin: 0;
						white-space: nowrap; //* 防止换行
						font-size: 14px !important;
					}
				}
			}

			//* 格式过滤器
			.format {
				& {
					flex-grow: 2;
					display: flex;
					flex-flow: row;
					justify-content: center;
					align-items: center;
					gap: 10px;

					@media (max-width: 500px) {
						margin-left: 10px;
						margin-right: 10px;
						width: 50%;
						justify-content: stretch;
					}
				}
				.select {
					flex-grow: 1;
					min-width: 150px;
					max-width: 200px;
				}
				.label {
					margin: 0;
					text-align: center;
					white-space: nowrap; //* 防止换行
					font-size: 14px !important;
				}
			}
		}

		// *缩放控制条样式
		.zoom-slider {
			flex-grow: 1;
			min-width: 150px;
			max-width: 200px;
			font-size: 14px !important;
			@media (max-width: 500px) {
				width: 100%;
				padding-left: 10px;
			}
		}

		//* 按钮组样式
		.button-group {
			flex-grow: 1;
		}
	}

	/* *统计组件样式 */
</style>

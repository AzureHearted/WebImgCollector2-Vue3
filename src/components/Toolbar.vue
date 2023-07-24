<template>
	<div class="onlineGallery-toolBar">
		<!-- *数量统计 -->
		<el-statistic
			class="statistic"
			:value="cardsStore.filterCards.length"
			:prefix="cardsStore.selectedCards.length.toString() + ' /'"
			:suffix="'/ ' + cardsStore.allValidCards.length.toString()">
			<template #title>
				<div style="display: flex; justify-content: center">
					选中 / 可见 / 总数
				</div>
			</template>
		</el-statistic>
		<!-- *过滤器 -->
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
		<!-- *列表控制 -->
		<div class="list-control">
			<!-- *最大显示行数控制条 -->
			<div class="zoom-slider">
				<span class="label">行数</span>
				<el-input-number
					class="input-number"
					:min="1"
					:max="6"
					:step="1"
					step-strictly
					controls-position="right"
					@wheel="
					(e:WheelEvent) => {
						if (e.deltaY < 0) {
							if (toolbar.listControl.showColumn < 6) toolbar.listControl.showColumn++;
						} else {
							if (toolbar.listControl.showColumn > 1) toolbar.listControl.showColumn--;
						}
					}"
					v-model="toolbar.listControl.showColumn"></el-input-number>
			</div>
			<div class="sort-method">
				<span class="label">排序</span>
				<el-select-v2
					class="select"
					v-model="listControl.sortMethod.value"
					:options="listControl.sortMethod.options"
					placeholder="排序方法"></el-select-v2>
			</div>
		</div>
		<!-- *预设规则选择 -->
		<div class="ruleSelector">
			<span class="label">预设</span>
			<el-select-v2
				class="select"
				v-model="ruleSelector.value"
				filterable
				:options="ruleSelector.option"
				placeholder="选择当前预设">
				<template #empty> 11 </template>
				<template #default="node">
					<div class="rule-item">
						<el-image class="rule-icon" :src="node.item.iconUrl"> </el-image>
						{{ node.item.label }}
					</div>
				</template>
			</el-select-v2>
		</div>
		<!-- *按钮组 -->
		<el-button-group class="button-group">
			<!-- *刷新按钮 -->
			<el-button type="primary" @click="refresh" :loading="loading.value">
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
				:icon="toolbar.listControl.allSelected ? CheckboxAll : CheckboxNone">
				{{ toolbar.listControl.allSelected ? "全选" : "取消全选" }}
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
		<el-dropdown>
			<el-button type="primary">
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
	import {ITask} from "../ts/public";
	import CheckboxNone from "/src/svg/checkbox-blank-line.svg"; //? svg导入
	import CheckboxAll from "/src/svg/checkbox-fill.svg"; //? svg导入

	const appInfo = useAppInfoStore(); //* 实例化appInfo数据仓库
	const cardsStore = useCardsStore(); //* 实例化cardsStore数据仓库
	const toolbar = useToolBarStore(); //* 实例化Toolbar数据仓库
	const ruleEditor = useRuleEditorStore(); //* 实例化ruleEditor数据仓库

	//* 进度条
	const loading = appInfo.loading;

	//* 过滤器参数
	const filter = toolbar.filter;

	//* list控制项
	const listControl = toolbar.listControl;

	//* 预设规则选择器
	const ruleSelector = toolbar.ruleSelector;

	//f 刷新函数
	const refresh = async () => {
		if (ruleSelector.value === "#") {
			await cardsStore.getCard(ruleEditor.defaultRule);
		} else {
			const ruleIndex = ruleEditor.data.ruleList.findIndex(
				(rule) => rule.id === ruleSelector.value
			);
			const rule = ruleEditor.data.ruleList[ruleIndex];
			if (rule) {
				await cardsStore.getCard(rule);
			} else {
				ElMessage({
					message: "请选择预设后再尝试此操作",
					type: "info",
					showClose: true,
					grouping: true,
					offset: 120,
				});
			}
		}
	};

	//f 全选切换
	const allSelectSwitch = async () => {
		toolbar.listControl.allSelected = !toolbar.listControl.allSelected; //* 全选标识符取反
		appInfo.loading.value = true;
		//* 刷新结果
		cardsStore.filterCards.forEach(
			(card) => (card.selected = toolbar.listControl.allSelected)
		);
		appInfo.loading.value = false;
	};

	//f 下载选中项
	const downloadSelected = async () => {
		const downloadCards = cardsStore.selectedCards;
		// console.log(downloadCards);
		if (!downloadCards.length) {
			ElMessage({
				message: "请选择要下载的数据",
				type: "info",
				showClose: true,
				grouping: true,
				offset: 120,
			});
			return;
		}
		const taskQueue = new TaskQueue({showMessage: false, max: 5});
		loading.init();
		let finallyCount = 0;

		//* 创建任务清单
		for (let index = 0; index < downloadCards.length; index++) {}

		const taskList: ITask[] = downloadCards.map((card, index) => {
			//* 队列任务定义
			return <ITask>{
				index: index,
				//* 主要执行函数
				main: async () => {
					if (!card.linkBlob) {
						const url = card.linkUrl;

						card.linkBlob = await getBlobByUrlAuto(url);

						if (card.linkBlob && card.linkBlob["type"] !== "none") {
							return [card.name, "处理成功!"];
						} else {
							return [card.name, "处理失败"];
						}
					} else {
						return [card.name, "处理成功!"];
					}
				},
				//* 单次执行完成后的回调
				callback: (res, index) => {
					finallyCount++;
					loading.percentage = (finallyCount / downloadCards.length) * 100;
				},
			};
		});

		taskQueue.pushTask(taskList);

		//* 全部执行完成后的回调
		taskQueue.finallyCallback = async () => {
			ElMessage({
				message: "下载成功! (正在生成压缩包)",
				type: "success",
				showClose: true,
				grouping: true,
				offset: 120,
			});
			const zipContainer = new JSZip();
			//* 生成压缩包
			for (let index = 0; index < downloadCards.length; index++) {
				const card = downloadCards[index];
				if (card.name && card.linkBlob) {
					//* 后缀名处理
					let ext = getExtByBlob(card.linkBlob);
					let reg = new RegExp(`(\\.${ext})+$`);
					let fix = strAutofill(index.toString(), 0, 4);
					zipContainer.file(
						`${fix} - ${card.name.replace(reg, "")}.${ext}`,
						card.linkBlob
					);
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

			gap: 10px;

			color: black;

			/* 禁止选中文字 */
			user-select: none;
			/* 禁止图文拖拽 */
			-webkit-user-drag: none;
			@media (max-width: 500px) {
				gap: 4px;
				margin-top: 4px;
				margin-bottom: 8px;
				padding-left: 10px;
				padding-right: 10px;
			}
		}

		// *统计组件样式
		.statistic {
			flex-shrink: 0;
			width: 140px;
			font-size: 14px !important;
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
				width: fit-content;
				width: 220px;
				display: flex;
				flex-flow: column;
				justify-content: center;
				align-items: center;
				@media (max-width: 500px) {
					align-items: start;
					gap: 2px;
				}
			}

			//* 尺寸过滤器
			.size {
				& {
					position: relative;
					width: 100%;
					display: flex;
					flex-flow: column nowrap;
					justify-content: center;
					align-items: center;
					@media (max-width: 500px) {
						gap: 2px;
					}
				}
				//* 每一行的样式
				.row {
					width: 100%;
					display: flex;
					flex-flow: row nowrap;
					gap: 8px;
					justify-content: start;
					align-items: center;
					.slider {
						flex-grow: 1;
						padding-right: 10px;
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
					position: relative;
					width: 100%;
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

		//* 规则选择器样式
		.ruleSelector {
			& {
				position: relative;
				width: fit-content;
				display: flex;
				flex-flow: row;
				justify-content: center;
				align-items: center;
				gap: 8px;
			}
			.select {
				width: 160px;
			}
			.label {
				margin: 0;
				text-align: center;
				white-space: nowrap; //* 防止换行
				font-size: 16px !important;
			}
		}

		// *列表控制区
		.list-control {
			& {
				position: relative;
				width: fit-content;
				display: flex;
				flex-flow: column;
				justify-content: center;
				align-items: start;
				gap: 8px;
				@media (max-width: 500px) {
					flex-flow: row;
				}
			}

			// *缩放控制条样式
			.zoom-slider {
				& {
					position: relative;
					width: fit-content;
					display: flex;
					flex-flow: row;
					justify-content: center;
					align-items: center;
					gap: 8px;
				}
				.input-number {
					width: 80px;
				}
				.label {
					margin: 0;
					text-align: center;
					white-space: nowrap; //* 防止换行
					font-size: 16px !important;
				}
			}
			// *排序方式选择器
			.sort-method {
				& {
					position: relative;
					width: fit-content;
					display: flex;
					flex-flow: row;
					justify-content: center;
					align-items: center;
					gap: 8px;
				}
				.select {
					width: 120px;
				}
				.label {
					margin: 0;
					text-align: center;
					white-space: nowrap; //* 防止换行
					font-size: 16px !important;
				}
			}
		}

		//* 按钮组样式
		.button-group {
			width: fit-content;
		}
	}

	//* 规则项样式
	.rule-item {
		height: 100% !important;
		display: flex;
		justify-content: start;
		align-items: center;
		gap: 8px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	//* 规则图标样式
	.rule-icon {
		flex-shrink: 0;
		width: 16px !important;
		aspect-ratio: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>

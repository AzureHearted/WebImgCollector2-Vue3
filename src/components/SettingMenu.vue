<template>
	<el-dropdown-item :icon="Tools" @click="info.open = true">
		设置菜单
		<teleport to=".onlineGallery-container" v-if="info.open">
			<!-- *设置菜单 -->
			<el-dialog
				v-model="info.open"
				title="设置菜单"
				width="50%"
				:before-close="handleClose"
				top="10vh"
				align-center
				draggable
				lock-scroll>
				<span>设置菜单</span>
				<el-tree-v2 :data="data" :props="props" :height="208" />
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="info.open = false">取消</el-button>
						<el-button type="primary" @click="info.open = false">保存</el-button>
					</span>
				</template>
			</el-dialog>
		</teleport>
	</el-dropdown-item>
</template>

<script setup>
	import {Tools} from "@element-plus/icons-vue"; //? element icon导入

	const props = {
		value: "id",
		label: "label",
		children: "children",
	};

	const info = reactive({
		open: false,
	});

	const data = reactive({});

	//f 关闭前的处理
	const handleClose = (done) => {
		ElMessageBox.confirm("确认关闭？", null, {
			confirmButtonText: "确认",
			cancelButtonText: "取消",
		})
			.then(() => {
				done();
			})
			.catch(() => {
				// catch error
			});
	};
</script>

<style lang="scss" scoped></style>

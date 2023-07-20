<template>
	<el-icon @mouseenter="isHover = true" @mouseleave="isHover = false">
		<component v-if="!isHover" :is="Delete" />
		<component v-if="isHover" :is="DeleteFilled" />
	</el-icon>
</template>

<script setup>
	import {Delete, DeleteFilled} from "@element-plus/icons-vue"; //? element icon导入
	let isHover = ref(false);
</script>

<style lang="scss"></style>

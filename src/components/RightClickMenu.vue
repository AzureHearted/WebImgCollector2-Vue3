<template>
	<div class="right-click-menu">
		<div class="option" @click="">规则管理器</div>
	</div>
</template>

<script setup>


</script>

<style lang="scss" scoped>
	/* 右键菜单样式 */
	/* 菜单容器 */
	.right-click-menu {
		& {
			position: fixed;
			width: max-content;
			width: 0;
			height: 0;
			z-index: -100000;

			border-radius: 8px;
			background-color: rgba(0, 255, 255, 0.314);
			border-top: 1px solid rgba(255, 255, 255, 0.3);
			border-left: 1px solid rgba(255, 255, 255, 0.3);
			box-shadow: 2px 2px 24px rgba(0, 0, 0, 0.5);

			display: flex;
			flex-flow: column nowrap;
			justify-content: center;
			align-items: center;
			padding: 2px;
			gap: 2px;
			overflow: hidden;

			opacity: 0;
			display: none;
			transition: width, height 0.5s;
		}

		//* 菜单显示时的样式
		&[data-show="true"] {
			display: flex;
			width: max-content;
			height: auto;
			z-index: 10;
			opacity: 1;
			transition: width, height 0.5s;
		}

		//* 菜单项通用样式
		.option {
			position: relative;
			width: 100%;
			height: 24px;

			border-radius: 6px;
			background-color: rgba(255, 255, 255, 0.8);
			border-top: 1px solid rgba(255, 255, 255, 0.3);
			border-left: 1px solid rgba(255, 255, 255, 0.3);
			box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.5);

			cursor: pointer;

			display: flex;
			flex-flow: row nowrap;
			justify-content: start;
			align-items: center;
			padding: 2px;

			transition: 0.5s;
		}

		.option:hover {
			box-shadow: 0px 0px 10px rgba(0, 0, 0, 1);
			transition: 0.5s;
		}

		/* 菜单中图标的样式 */
		.option svg {
			width: 20px;
			height: 20px;
			transition: 0.5s;
		}

		.option:hover svg {
			width: 24px;
			height: 24px;
			transition: 0.5s;
		}
	}
</style>

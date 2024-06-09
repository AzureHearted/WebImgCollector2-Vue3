<template>
	<div class="test__container">
		<!-- <Tree /> -->
		<!-- 获取当前页面样式表 -->
		<div>
			<n-button type="primary" @click="getStyleSheets">获取页面样式表</n-button>
		</div>
		<n-config-provider :hljs="hljs" abstract>
			<Scrollbar>
				<ul>
					<li v-for="item in styleSheets" :key="item.index">
						<span>{{ item.index }} - {{ item.ownerNode?.nodeName }}</span>
						<div v-for="(rule, rIndex) in item.cssRules" :key="rIndex">
							{{ (rule as CSSStyleRule).selectorText }}
						</div>
						<n-code
							:code="item.ownerNode?.textContent || ''"
							language="css"
							show-line-numbers />
						<n-divider />
					</li>
				</ul>
			</Scrollbar>
		</n-config-provider>
	</div>
</template>

<script setup lang="ts">
	// import Tree from "@/views/pattern-edit/pattern-tree.vue";
	import { ref } from "vue";
	import Scrollbar from "@/components/base/base-scrollbar.vue";

	import hljs from "highlight.js/lib/core";
	import css from "highlight.js/lib/languages/css";
	hljs.registerLanguage("css", css);

	interface StyleSheet extends CSSStyleSheet {
		index: number;
	}

	const styleSheets = ref<ReturnType<typeof getStyleSheets>>([]);
	// 获取页面样式表
	const getStyleSheets: () => StyleSheet[] = () => {
		const styleSheetsList = [...document.styleSheets]
			.map((sh, index) => {
				(sh as any).index = index;
				return sh as any;
			})
			.filter((sh) => {
				return ![...sh.cssRules].some((r) => {
					const selectorText = (r as CSSStyleRule).selectorText;
					return new RegExp(/\.(wic2-|n-|var-)/g).test(selectorText);
				});
			});
		styleSheets.value = styleSheetsList;
		return styleSheetsList;
	};
</script>

<style lang="scss" scoped>
	.test__container {
		position: relative;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		padding: 4px;
		background: #d2d2d2c3;
		overflow: hidden;
		display: flex;
		flex-flow: column;
	}
</style>

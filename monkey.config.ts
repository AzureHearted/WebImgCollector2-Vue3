import type { MonkeyOption } from "vite-plugin-monkey";

//s vite-油猴插件(vite-plugin-monkey) 的配置设置
export default {
	entry: "./src/main.ts",
	userscript: {
		name: "WebImgCollector2",
		description: "图片聚合器",
		author: "ls", // 作者
		// updateURL: "", //更新地址
		version: "1.4.27",
		icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxLjQ0ZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjU2IDE3OCI+PGcgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI2ZmNDA4MSIgZD0iTTE1My42IDE3Ny45OEw1MS4xOTMuNjA1SDEwMi40TDIwNC44MDcgMTc3Ljk4eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIiBkPSJtMTUzLjYgMTc3Ljk4bDI1LjYtNDQuMzQ0bDI1LjYwNyA0NC4zNDR6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiIGQ9Im0xMjggMTMzLjYzNmwyNS42IDQ0LjM0NGwyNS42LTQ0LjM0NHoiLz48cGF0aCBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIgZD0ibTEwMi40IDg5LjI5MmwyNS42IDQ0LjM0NGwyNS42LTQ0LjM0NHoiLz48cGF0aCBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMiIgZD0iTTEwMi40IDg5LjI5MkwxMjggNDQuOTQ4bDI1LjYgNDQuMzQ0eiIvPjxwYXRoIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4zIiBkPSJtNzYuOCA0NC45NDhsMjUuNiA0NC4zNDRMMTI4IDQ0Ljk0OHoiLz48cGF0aCBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuNCIgZD0iTTc2LjggNDQuOTQ4TDEwMi40LjYwNUwxMjggNDQuOTQ4eiIvPjxwYXRoIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC41IiBkPSJNNTEuMTkzLjYwNUw3Ni44IDQ0Ljk0OEwxMDIuNC42MDV6Ii8+PHBhdGggZmlsbD0iIzUzNmRmZSIgZD0iTTUxLjE5NCAxNzcuOThMLS4wMTMgODkuMjkyTDI1LjU5MyA0NC45NUwxMDIuNCAxNzcuOThINTEuMTkzIi8+PHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjIiIGQ9Ik01MS4xOTQgMTc3Ljk4TDc2LjggMTMzLjYzNmwyNS42IDQ0LjM0NHoiLz48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIgZD0ibTI1LjU5MyAxMzMuNjM2bDI1LjYgNDQuMzQ0TDc2LjggMTMzLjYzNnoiLz48cGF0aCBkPSJtMjUuNTkzIDEzMy42MzZsMjUuNi00NC4zNDRMNzYuOCAxMzMuNjM2eiIvPjxwYXRoIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4xIiBkPSJtLS4wMTMgODkuMjkybDI1LjYwNiA0NC4zNDRsMjUuNi00NC4zNDR6Ii8+PHBhdGggZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjIiIGQ9Ik0tLjAxMyA4OS4yOTJMMjUuNTkzIDQ0Ljk1bDI1LjYgNDQuMzQzeiIvPjxwYXRoIGZpbGw9IiMzMDNmOWYiIGQ9Im01MS4xOTMgODkuMjkybC0yNS42LTQ0LjM0NEw1MS4xOTMuNjA1TDc2LjggNDQuOTQ4eiIvPjxwYXRoIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4yIiBkPSJNNzYuOCA0NC45NDhMNTEuMTkzLjYwNWwtMjUuNiA0NC4zNDN6Ii8+PHBhdGggZmlsbD0iIzNmNTFiNSIgZD0ibTIwNC44MDYgMTc3Ljk4bC0yNS42MDctNDQuMzQ0bDI1LjYwNy00NC4zNDNsMjUuNiA0NC4zNDN6Ii8+PHBhdGggZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjIiIGQ9Im0yMzAuNDA2IDEzMy42MzZsLTI1LjYgNDQuMzQ0bC0yNS42MDctNDQuMzQ0eiIvPjxwYXRoIGZpbGw9IiM3OTg2Y2IiIGQ9Ik0yMzAuNDA3IDEzMy42MzZMMTUzLjYuNjA1aDUxLjIwN2w1MS4yMDcgODguNjg3eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIiBkPSJtMjA0LjgwNiA4OS4yOTJsMjUuNiA0NC4zNDRsMjUuNjA3LTQ0LjM0NHoiLz48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIgZD0ibTIwNC44MDYgODkuMjkybDI1LjYtNDQuMzQ0bDI1LjYwNyA0NC4zNDR6Ii8+PHBhdGggZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjEiIGQ9Ik0xNzkuMiA0NC45NDhMMjA0LjgwNi42MDVsMjUuNiA0NC4zNDN6Ii8+PHBhdGggZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjIiIGQ9Im0xNTMuNi42MDVsMjUuNiA0NC4zNDNMMjA0LjgwOC42MDV6Ii8+PC9nPjwvc3ZnPg==", // 图标
		namespace: "npm/vite-plugin-monkey", // 命名空间
		match: ["*://*", "*://*/*"], // 要匹配的网站
		include: ["*"],
		noframes: true, // 禁止在iframe中使用
		connect: ["*"],
		"run-at": "document-end", // 嵌入时机
		require: [],
	},
	server: {
		open: false,
	},
} as MonkeyOption;

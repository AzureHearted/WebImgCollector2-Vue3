export const globalStyle = /*css*/ `
  /* 滚动条样式 */
	/* 滚动条整体部分，宽度 */
	*::-webkit-scrollbar {
		width: 10px !important;
		height: 10px !important;
		background: transparent !important;
		color: transparent !important;
		transition: all 0.5s;
	}

	/* 轨道 */
	*::-webkit-scrollbar-track {
		border-radius: 10px !important;
		background: transparent !important;
		color: transparent !important;


	}

	/* 滑块 */
	*::-webkit-scrollbar-thumb {
		background: #0d7ac39c !important;
		border-radius: 10px !important;
	}
`;

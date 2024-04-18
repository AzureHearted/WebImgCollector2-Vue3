// 导入Fancybox和CSS文件
import { Fancybox as _Fancybox } from "@fancyapps/ui";
import type { OptionsType } from "@fancyapps/ui/types/Fancybox/options";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

import l10n from "./l10n"; //导入汉化配置
import Toolbar from "./toolbar"; //导入工具配置
import Images from "./images"; //导入图像配置

export const configFancybox: Partial<OptionsType> = {
	l10n, // 汉化配置
	Images, // 图像相关设置
	Toolbar, // 工具栏相关设置
	on: {
		done: (fancybox, slide) => {
			console.log(slide);
			const aspectRatio = Number(slide.width) / Number(slide.height);
			slide.contentEl.style.width =
				(slide.el as HTMLElement).clientHeight * 0.9 * aspectRatio + "px";
			slide.contentEl.style.height =
				(slide.el as HTMLElement).clientHeight * 0.9 + "px";
		},
	},
};

export const Fancybox = _Fancybox;

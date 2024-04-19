// 导入Fancybox和CSS文件
import { Fancybox as _Fancybox } from "@fancyapps/ui";
import type { OptionsType } from "@fancyapps/ui/types/Fancybox/options";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

import l10n from "./l10n"; //导入汉化配置
import Toolbar from "./toolbar"; //导入工具配置
import Images from "./images"; //导入图像配置
import Thumbs from "./thumbs"; // 缩略图配置

export const configFancybox: Partial<OptionsType> = {
	l10n,
	Images,
	Toolbar,
	Thumbs,
	autoFocus: true,
};

export const Fancybox = _Fancybox;

// 导入Fancybox和CSS文件
import { Fancybox as _Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import l10n from "./l10n"; //导入汉化配置
import Toolbar from "./toolbar"; //导入工具配置
import Images from "./images"; //导入图像配置
export const configFancybox = {
    l10n, // 汉化配置
    Images, // 图像相关设置
    Toolbar, // 工具栏相关设置
};
export const Fancybox = _Fancybox;

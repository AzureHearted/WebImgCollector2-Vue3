import JSZip from "jszip";
import {saveAs} from "file-saver"; //* 用于原生浏览器"保存"来实现文件保存

//* 定义 svg 的扩展类型
export declare module "*.svg" {
	const content: any;
	export default content;
}

export {};

declare global {
	const JSZip: JSZip;
	const saveAs: saveAs;
	type JSZipType = JSZip;
}

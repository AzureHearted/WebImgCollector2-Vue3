import JSZip from "jszip";
import {saveAs} from "file-saver"; //* 用于原生浏览器"保存"来实现文件保存

//* 向window挂载方法(方法全局挂载)
window["JSZip"] = JSZip;
window["saveAs"] = saveAs;
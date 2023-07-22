import { MatchRule } from "./class/MatchRule";

/**
 * f 任务队列
 * - 可控制并发数量且能自动执行
 * @class
 * @constructor
 */
export class TaskQueue {
	public max: number;
	public initMax: number;
	public taskList: any[];
	public showMessage: boolean;
	public singleCallback: any;
	public finallyCallback: any;

	constructor(
		options = {showMessage: false, max: 10},
		singleCallback = () => {}, //* 每个项目执行完成后的回调
		finallyCallback = () => {} //* 所有执行完成后的回调
	) {
		this.max = options.max;
		this.initMax = options.max;
		this.taskList = [];
		this.showMessage = options.showMessage;
		this.singleCallback = singleCallback;
		this.finallyCallback = finallyCallback;
		// setTimeout(() => this.run());
	}
	/**
	 * * 添加任务到队列
	 * @param {any} task 任务项
	 */
	public addTask(task: any): void {
		this.taskList.push(task);
	}
	public run(): void {
		const length = this.taskList.length;
		// console.log(this.max, this.initMax);
		if (!length) {
			if (this.max === this.initMax) {
				this.finallyCallback();
			}
			return;
		}
		const min = Math.min(length, this.max);
		for (let i = 0; i < min; i++) {
			const task = this.taskList.shift();
			this.max--; //* 占用一个空间
			const p = task()
				.then((res) => {
					if (this.showMessage) console.log(res);
				})
				.catch((err) => {
					if (this.showMessage) console.log(err);
				})
				.finally(() => {
					this.max++; //* 还原一个空间
					this.singleCallback(); //* 单个任务执行完成时的回调
					this.run();
				});
		}
	}
}

/**
 * f 通过链接获取blob
 * - 模式:
 * 	- JavaScript原生fetch
 * 	- 油猴GM_xmlhttpRequest的API
 * @param {string} url 链接
 * @param {'Fetch'|'GM'} mode 获取模式
 * @param {null|string} referer 域(名)
 * @returns Promise 对象
 */
export const getBlobByUrl = (
	url: string,
	mode: "Fetch" | "GM" = "Fetch",
	referer: string | undefined = undefined
): any => {
	if (mode === "Fetch") {
		return new Promise(async (resolve, reject) => {
			let blob = await fetch(url)
				.then((res) => res.blob())
				.catch((err) => null);
			if (blob != null) {
				console.log("Fetch成功", blob);
				resolve(blob);
			} else {
				console.log("Fetch失败", blob);
				resolve(new Blob(undefined, {type: "none"}));
			}
		});
	} else if (mode === "GM") {
		return new Promise(async (resolve, reject) => {
			let headers: any;
			if (referer != null) {
				headers = {
					referer: referer,
				};
			}
			GM_xmlhttpRequest(<any>{
				methods: "GET",
				url: url,
				responseType: "blob",
				headers: headers,
				onload: (res: any) => {
					// console.log(res, res.response, res.status);
					if (res.status == 200) {
						console.log(`GM成功(referer:${referer})`, res.response, res.status);
						resolve(res.response);
					} else {
						console.log(`GM失败(referer:${referer})`, res.response, res.status);
						resolve(new Blob(undefined, {type: "none"}));
					}
				},
				onerror: (err: any) => {
					resolve(new Blob(undefined, {type: "none"}));
				},
				ontimeout: () => {
					resolve(new Blob(undefined, {type: "none"}));
				},
				onabort: () => {
					resolve(new Blob(undefined, {type: "none"}));
				},
			});
		});
	}
};

//f [功能封装]生成uuid
export const buildUUID = (): string => {
	const hexList: string[] = [];
	for (let i = 0; i <= 15; i++) {
		hexList[i] = i.toString(16);
	}
	let uuid = "";
	for (let i = 1; i <= 36; i++) {
		if (i === 9 || i === 14 || i === 19 || i === 24) {
			uuid += "-";
		} else if (i === 15) {
			uuid += 4;
		} else if (i === 20) {
			uuid += hexList[(Math.random() * 4) | 8];
		} else {
			uuid += hexList[(Math.random() * 16) | 0];
		}
	}
	return uuid.replace(/-/g, "");
};

/**
 * f 获取链接中的域名
 * @param {string} url 链接
 * @returns {string} 链接对应的域名
 */
export const getOriginByUrl = (url: string): string => {
	let list = url.match(/(https?:\/\/[^\/]+(?=\/))/g) || [];
	if (list.length > 0) {
		return list[0] || url;
	} else {
		return url;
	}
};

/**
 * f [功能封装] 通过url获取名称
 * @param {string} url 链接
 * @returns {string} 链接的名称部分
 */
export const getNameByUrl = (url: string): string => {
	let list = url.match(/(?<=\/)([^\/\r\n$]+)$/g) || [];
	if (list.length > 0) {
		return list[0] || url;
	} else {
		return url;
	}
};

//f [功能封装]判断字符串是否为空
export const isEmpty = (
	str: string | null | undefined = "",
	includeSpace = false
) => {
	return includeSpace
		? str == null || str == undefined || str == "" || /^ +?$/.test(str)
		: str == null || str == undefined || str == "";
};

//f [功能封装]通过blob获取meta
export const getMetaByBlob = async (blob: Blob) => {
	const meta: metaInterFace = await new Promise((resolve, reject) => {
		let reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.onload = (theFile: any) => {
			let image = new Image();
			image.src = theFile.target.result;
			image.onload = () => {
				resolve(<metaInterFace>{
					isOk: true,
					width: image.width,
					height: image.height,
					aspectRatio: image.width / image.height,
				});
			};
			image.onerror = () => {
				reject(<metaInterFace>{
					isOk: false,
					width: 0,
					height: 0,
				});
			};
		};
	});
	return meta;
};

/**
 * f [功能封装]获取dom标签的相关内容
 * @param domTag 要提取的dom元素
 * @param type 提取类型:
 * 	* 1 - 值
 * 	* 2 - Attribute属性
 * 	* 3 - Property属性
 * 	* 4 - innerText内部文本
 * 	* 5 - innerHTML
 * 	* 6 - outerHTML
 * @param attr 属性名
 */
export const getTagInfo = (domTag: any, type: number, attr: string) => {
	let attrList: string[] = [];
	if (/\|/.test(attr)) {
		attrList = attr.split("|");
	} else {
		attrList = [attr];
	}
	if (domTag == null) {
		return null;
	}
	let result;
	if (type == 1) {
		//* 提取 值(value)
		result = domTag.value;
	} else if (type == 2) {
		//* 提取 Attribute属性
		result = "";
		for (let i = 0; i < attrList.length; i++) {
			const attr = attrList[i];
			let temp = domTag.getAttribute(attr);
			//* 判空操作
			if (!isEmpty(temp)) {
				if (attr == "srcset") {
					//* srcset属性信息的处理方式
					temp = getSrcsetMaximumValue(temp);
				}
				result = temp;
				break;
			}
		}
	} else if (type == 3) {
		//* 提取 Property属性
		result = "";
		for (let i = 0; i < attrList.length; i++) {
			const attr = attrList[i];
			let temp = domTag[attr];
			//* 判空操作
			if (!isEmpty(temp)) {
				if (attr == "srcset") {
					//* srcset属性信息的处理方式
					temp = getSrcsetMaximumValue(temp);
				}
				result = temp;
				break;
			}
		}
	} else if (type == 4) {
		//* 提取 innerText内部文本
		result = domTag.innerText;
	} else if (type == 5) {
		//* 提取 innerHTML
		result = domTag.innerHTML;
	} else if (type == 6) {
		//* 提取 outerHTML
		result = domTag.outerHTML;
	}
	if (isUrl(result)) {
		result = urlCompletion(result);
	}
	return String(result);
};

//f [功能封装]判断字符串是否是一个路径
export const isUrl = (str: string) => {
	var v = /^(\/|(.\/)).+?$/i;
	return v.test(str);
};

//f [功能封装] 获取srcset内容最大值
export const getSrcsetMaximumValue = (srcsetString: string) => {
	let result = srcsetString;
	if (/\d+w/.test(srcsetString)) {
		let dataList = srcsetString
			.split(/\, */)
			.filter((item) => !isEmpty(item, true))
			.map((item) => {
				const itemDataInfos = item.split(" ");
				if (itemDataInfos.length == 2) {
					return {
						url: itemDataInfos[0],
						resolution: Number(itemDataInfos[1].split(/w|W/)[0]),
					};
				} else {
					return {
						url: itemDataInfos[0],
						resolution: 0,
					};
				}
			});
		// console.log(dataList);
		let maxItem = dataList[0];
		dataList.forEach((item) => {
			if (maxItem.resolution < item.resolution) {
				maxItem = item;
			}
		}); //*选区最大尺寸的链接
		result = maxItem.url;
	}
	return result;
};

//f [功能封装]url路径补全
export const urlCompletion = (url: string) => {
	const v1 = /^\/[^\/].*$/i;
	const v2 = /^\/\/.*$/i;
	if (v1.test(url)) {
		return window.document.location.origin + url;
	}
	if (v2.test(url)) {
		return window.document.location.protocol + url;
	}
};

export const getDomByRule = (rule: MatchRule) => {};



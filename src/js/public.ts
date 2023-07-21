/**
 * f 任务队列
 * - 可控制并发数量且能自动执行
 * @class
 * @constructor
 */
export class TaskQueue {
	public max: number;
	public initMax: number;
	public taskList: Function[];
	public showMessage: boolean;
	public singleCallback: Function;
	public finallyCallback: Function;
	/**
	 * @param {Object={}} options
	 * @param {Function=()} singleCallback
	 * @param {Function=()} finallyCallback
	 */
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
	 * @param {Function} task 任务项
	 */
	public addTask(task: Function) {
		this.taskList.push(task);
	}
	run() {
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
export const getBlobByUrl = (url, mode = "Fetch", referer = null) => {
	if (mode === "Fetch") {
		return new Promise(async (resolve, reject) => {
			let blob = await fetch(url)
				.then((res) => res.blob())
				.catch((err) => null);
			if (blob != null) {
				console.log("Fetch成功", blob);
			} else {
				console.log("Fetch失败", blob);
			}
			resolve(blob);
		});
	} else if (mode === "GM") {
		return new Promise(async (resolve, reject) => {
			let headers = null;
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
				onload: (res) => {
					// console.log(res, res.response, res.status);
					if (res.status == 200) {
						console.log(`GM成功(referer:${referer})`, res.response, res.status);
						resolve(res.response);
					} else {
						console.log(`GM失败(referer:${referer})`, res.response, res.status);
						resolve(null);
					}
				},
				onerror: (err) => {
					resolve(null);
				},
				ontimeout: () => {
					resolve(null);
				},
				onabort: () => {
					resolve(null);
				},
			});
		});
	} else {
	}
};

//f [功能封装]生成uuid
export const buildUUID = () => {
	const hexList = [];
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
export const getOriginByUrl = (url) => {
	let list = url.match(/(https?:\/\/[^\/]+(?=\/))/g) || [];
	if (list.length > 0) {
		return list[0];
	} else {
		return url;
	}
};

/**
 * f [功能封装] 通过url获取名称
 * @param {string} url 链接
 * @returns {string} 链接的名称部分
 */
export const getNameByUrl = (url) => {
	let list = url.match(/(?<=\/)([^\/\r\n$]+)$/g) || [];
	if (list.length > 0) {
		return list[0];
	} else {
		return url;
	}
};

//? rule类 - 规则数据结构
import {Rule} from "./class/Rule";
export {Rule};

// import JSZip from "jszip";
// import {saveAs} from "file-saver"; //* 用于原生浏览器"保存"来实现文件保存
// export {JSZip, saveAs};

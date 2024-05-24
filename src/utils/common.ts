//f [功能封装]生成uuid
export function buildUUID(): string {
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
}

//f 字符串混合排序
export function mixSort(_a: string, _b: string) {
	const reg = /[a-zA-Z0-9]/;
	// 比对仅针对字符串，数字参与对比会导致对比的字符串转为number类型，变成NaN
	const a = _a.toString();
	const b = _b.toString();
	// 比对0号位的原因是字符串中有可能出现中英文混合的情况，这种仅按首位排序即可
	if (reg.test(a[0]) || reg.test(b[0])) {
		if (a > b) {
			return 1;
		} else if (a < b) {
			return -1;
		} else {
			return 0;
		}
	} else {
		return a.localeCompare(b);
	}
}

//f 通过blob获取文件的ext扩展名
export function getExtByBlob(blob: Blob) {
	let ext = "";
	if (blob) {
		const match = /(?<=\/).+$/.exec(blob.type);
		if (match) {
			ext = match[0].trim().length > 0 ? match[0] : "";
		}
	}
	// 特殊情况处理
	if (ext === "jpeg") ext = "jpg";
	return ext;
}

//f 获取站点Favicon图标
export async function getFavicon(): Promise<string> {
	let iconUrl: string;
	//s [1]通过link标签查找
	const urls = (
		[...document.querySelectorAll("link[rel=icon]")] as HTMLLinkElement[]
	)
		.map((item: HTMLLinkElement) => item.href)
		.filter((url) => /\.(png|svg|jpg|jpeg|webp|icon?)$/i.test(url));

	if (urls.length > 0) {
		iconUrl = urls[0];
	} else {
		//s [2]若没找到直接使用域名拼接
		iconUrl = `${location.origin}/favicon.ico`;
	}
	return iconUrl;
}

/**
 * f 获取链接中的域名
 * @param {string} url 链接
 * @returns {string} 链接对应的域名
 */
export function getHostByUrl(url: string): string {
	const list = url.match(/(https?:\/\/[^/]+(?=\/))/g) || [];
	if (list.length > 0) {
		return list[0] || url;
	} else {
		return url;
	}
}

/**
 * f [功能封装] 通过url获取名称
 * @param {string} url 链接
 * @returns {string} 链接的名称部分
 */
export function getNameByUrl(url: string): string {
	url = decodeURI(url);
	// 先尝试转为URL对象
	let urlObj: URL;
	try {
		urlObj = new URL(url);
	} catch {
		// 如果不是url则替换掉所有“/”“\”后返回
		return url.replace(/[/\\]/, "-");
	}
	// 去除查询参数和结尾的“/”
	url = url.replace(/([/\\])$/, "").replace(urlObj.search, "");
	const list = url.match(/(?<=[/\\]+)([^\\/\r\n$]+)$/g) || [];
	if (list.length > 0) {
		return list[0] || url;
	} else {
		return url;
	}
}

// 提取链接扩展名
export function getExtByUrl(url: string): string {
	let ext = "";
	const name = getNameByUrl(url);
	const match = /(?<=\.)[^.]+$/.exec(name);
	if (match) {
		ext = match[0];
	}
	// 特殊情况处理
	if (ext === "jpeg") ext = "jpg";
	return ext;
}

// f [功能封装]通过blob获取图片原信息meta
export async function getPicMetaByBlob(blob: Blob) {
	type Meta = {
		isOk: boolean;
		width: number;
		height: number;
		aspectRatio?: number;
	};
	const meta: Meta = await new Promise((resolve, reject) => {
		const reader = new FileReader();
		if (blob) {
			reader.readAsDataURL(blob);
			reader.onload = (theFile) => {
				const image = new Image();
				image.src = (reader.result as string) || "";
				image.onload = () => {
					const meta: Meta = {
						isOk: true,
						width: image.width,
						height: image.height,
						aspectRatio: image.width / image.height,
					};
					//s 释放内存
					URL.revokeObjectURL((reader.result as string) || "");
					resolve(meta);
				};
				image.onerror = () => {
					const meta: Meta = {
						isOk: false,
						width: 0,
						height: 0,
					};
					//s 释放内存
					URL.revokeObjectURL((reader.result as string) || "");
					reject(meta);
				};
			};
		} else {
			const meta: Meta = {
				isOk: false,
				width: 0,
				height: 0,
			};
			//s 释放内存
			URL.revokeObjectURL((reader.result as string) || "");
			reject(meta);
		}
	});
	return meta;
}

//f [功能封装]通过Image对象获取图片meta
export async function getPicMetaByImage(url: string) {
	type Meta = {
		isOk: boolean;
		width: number;
		height: number;
		aspectRatio?: number;
	};
	// 判断传入的url变量有效(不为null或undefined)且不为空(不能全部都是空字符或者没有字符)
	if (!url || !url.trim().length) {
		const errMeta: Meta = {
			isOk: false,
			width: 0,
			height: 0,
		};
		return errMeta;
	}
	return await new Promise((resolve, reject) => {
		const img = new Image();
		img.src = url;
		if (img.complete) {
			resolve({
				isOk: true,
				width: img.width,
				height: img.height,
				aspectRatio: img.width / img.height,
			} as Meta);
		} else {
			img.onload = () => {
				resolve({
					isOk: true,
					width: img.width,
					height: img.height,
					aspectRatio: img.width / img.height,
				} as Meta);
			};
			img.onerror = () => {
				resolve({
					isOk: false,
					width: 0,
					height: 0,
				} as Meta);
			};
		}
	});
}

//f 文本自动填充
export function strAutofill(
	str: string,
	fillContent: string | number,
	fillLength: number,
	direction: "prefix" | "suffix" = "prefix"
): string {
	if (direction === "prefix") {
		// 前缀填充
		return str.padStart(fillLength, fillContent.toString());
	} else {
		// 后缀填充
		return str.padEnd(fillLength, fillContent.toString());
	}
}

//f 判断是否是移动端设备
export function isMobile(): boolean {
	const sUserAgent = navigator.userAgent.toLowerCase();
	const regex =
		/ipad|iphone os|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/i;
	return regex.test(sUserAgent);
}

//f blob类型判断
export function getBlobType(blob: Blob): "image" | "video" | "html" | "audio" {
	const blobTypeRegex = {
		isImg: /^image/i,
		isVideo: /^video/i,
		isAudio: /^audio/i,
	};
	if (!blob) {
		return "html";
	}
	let blobType: "image" | "video" | "html" | "audio" = "html";
	if (blobTypeRegex.isImg.test(blob.type)) {
		blobType = "image";
	} else if (blobTypeRegex.isVideo.test(blob.type)) {
		blobType = "video";
	} else if (blobTypeRegex.isAudio.test(blob.type)) {
		blobType = "audio";
	} else {
		blobType = "html";
	}

	return blobType;
}

//f 获取剪切板文本
export async function getClipBoardText() {
	const text = await navigator.clipboard
		.readText()
		.then((res) => res)
		.catch(() => "");
	return text;
}

/**
 * f 字节 -> 自动单位
 * @param byteSize 字节大小
 */
export function byteAutoUnit(byteSize: number, decimal: number = 2): string {
	// 单位映射表
	const unitMap = new Map([
		[1, "B"],
		[2, "KB"],
		[3, "MB"],
		[4, "GB"],
		[5, "TB"],
	]);
	let unit = 1;
	let num = byteSize;
	while (num / 1024 >= 1) {
		if (unit + 1 >= 1 && unit <= 5) {
			num = num / 1024;
			unit++;
		} else {
			break;
		}
	}
	return `${num.toFixed(decimal)}${unitMap.get(unit)}`;
}

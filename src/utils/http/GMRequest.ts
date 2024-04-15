/// <reference types="vite-plugin-monkey/client" />
import { GM_xmlhttpRequest } from "$";

// 封装油猴GM_xmlhttpRequest的API
interface IGMRequestOptions {
	method?: "GET" | "POST" | "HEAD";
	url: string;
	referer?: string;
	responseType?: keyof GmResponseTypeMap;
	data?: string;
}
// 返回结果映射
interface GmResponseTypeMap {
	text: string;
	json: any;
	arraybuffer: ArrayBuffer;
	blob: Blob;
	document: Document;
	stream: ReadableStream<Uint8Array>;
}

// 功能实现
// 函数重载，允许调用GMRequest时强制指定responseType
export function GMRequest<ResponseType extends keyof GmResponseTypeMap>(
	options: IGMRequestOptions & { responseType: ResponseType }
): Promise<GmResponseTypeMap[ResponseType] | null>;
// 默认情况下responseType为"json"
export function GMRequest(
	options: Omit<IGMRequestOptions, "responseType"> & {
		responseType?: undefined;
	}
): Promise<any | null>;
// 函数实现
export async function GMRequest(
	options: IGMRequestOptions
): Promise<any | null> {
	// 默认选项
	const defaultOptions: IGMRequestOptions = {
		url: "",
		method: "GET",
		responseType: "json",
		referer: undefined,
		data: "",
	};
	const { url, method, referer, responseType, data } = {
		...defaultOptions,
		...options,
	};
	// 防止链接为空
	if (!url || !url.trim().length) return Promise.resolve(null);
	let headers: Record<string, string> | undefined;
	if (referer) {
		headers = {
			referer,
		};
	}
	// 返回一个Promise
	return new Promise((resolve) => {
		(async () => {
			GM_xmlhttpRequest({
				method,
				url,
				responseType,
				headers,
				data,
				onload: (res) => {
					// console.log(res, res.response, res.status);
					if (res.status === 200) {
						// console.log(`GM成功(referer:${referer})`, res.response, res.status);
						resolve(res.response);
					} else {
						// console.log(`GM失败(referer:${referer})`, res.response, res.status);
						resolve(null);
					}
				},
				onerror: () => {
					// console.log(`GM失败(referer:${referer})`);
					resolve(null);
				},
				ontimeout: () => {
					// console.log(`GM超时(referer:${referer})`);
					resolve(null);
				},
				onabort: () => {
					// console.log(`GM中断请求(referer:${referer})`);
					resolve(null);
				},
			});
		})();
	});
}

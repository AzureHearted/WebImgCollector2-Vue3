import { getHostByUrl } from "../common";
import { GMRequest } from "./GMRequest";

// 通过链接获取blob
export function getBlobByUrl(
	url: string,
	mode: "Fetch" | "GM" = "Fetch",
	referer?: string
): Promise<Blob | null> {
	// 防止url为空
	if (!url || !url.trim().length) return Promise.resolve(null);

	if (mode === "Fetch") {
		// 使用Fetch API
		return new Promise<Blob | null>((resolve) => {
			(async () => {
				// 首次尝试：直接通过链接获取
				let blob = await fetch(url)
					.then((res) => res.blob())
					.catch(() => null);
				if (blob && blob.size) {
					// console.log("Fetch请求成功", blob);
					resolve(blob);
				}
				// 第二次尝试：如果第一次尝试失败则再次设置cache为no-cache再次尝试
				blob = await fetch(url, { cache: "no-cache" })
					.then((res) => res.blob())
					.catch(() => null);
				if (blob && blob.size) {
					// console.log("Fetch请求成功", blob);
					resolve(blob);
				} else {
					resolve(null);
				}
			})();
		});
	} else {
		// 使用油猴GM_xmlhttpRequest的API
		return new Promise<Blob | null>((resolve) => {
			GMRequest({ url, referer, responseType: "blob" }).then((blob) => {
				if (blob && blob.size) {
					// console.log("GM请求成功", blob);
					resolve(blob);
				} else {
					// console.log("GM请求失败", blob);
					resolve(null);
				}
			});
		});
	}
}

// 通过链接获取blob(自动)
export async function getBlobByUrlAuto(url: string): Promise<Blob | null> {
	// console.log("请求", url);
	//s 链接为空直接返回空blob
	if (!url || !url.trim().length) return null;

	// 尝试获取blob
	const blob = await tryGetBlob(url, [
		{ mode: "Fetch" /* message: "Fetch请求" */ },
		{ mode: "GM" /* message: "GM请求1" */ },
		{
			mode: "GM",
			referer: location.origin + "/",
			// message: "GM请求2(referer为指定当前域名)",
		},
		{
			mode: "GM",
			referer: getHostByUrl(url) + "/",
			// message: "GM请求3(referer为链接域名)",
		},
	]);
	return blob;
}

// 尝试获取Blob(通过传入的请求队列一次请求blob,一旦成功就直接返回结果)
async function tryGetBlob(
	url: string,
	// 尝试队列
	requests: { mode: "Fetch" | "GM"; referer?: string; message?: string }[]
): Promise<Blob | null> {
	let blob: Blob | null = null;

	for (const request of requests) {
		// 打印日志消息
		if (request.message && !!request.message.trim().length) {
			console.log("[日志]WebImgCollector2:", `${request.message}: ${url}`);
		}
		// 请求blob
		blob = await getBlobByUrl(url, request.mode, request.referer);
		// 一旦成功就跳出循环
		if (blob) break;
	}
	// console.log("请求结果blob:", blob);

	return blob;
}

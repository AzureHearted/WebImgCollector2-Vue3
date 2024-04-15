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
				const blob = await fetch(url)
					.then((res) => res.blob())
					.catch(() => null);
				if (blob) {
					// console.log("Fetch请求成功", blob);
					resolve(blob);
				} else {
					// console.log("Fetch请求失败", blob);
					resolve(null);
				}
			})();
		});
	} else {
		// 使用油猴GM_xmlhttpRequest的API
		return new Promise<Blob | null>((resolve) => {
			GMRequest({ url, referer, responseType: "blob" }).then((blob) => {
				if (blob) {
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
	//s 链接为空直接返回空blob
	if (!url || !url.trim().length) return null;
	let blob: Blob | null = null;
	// console.log("Fetch请求", url);
	//s 先尝试通过Fetch方法获取
	blob = await getBlobByUrl(url, "Fetch");
	//s Fetch失败后尝试通过GM不指定referer方式获取
	if (!blob) {
		// console.log("GM请求1", url);
		blob = await getBlobByUrl(url, "GM");
	}
	//s 再次失败后尝试通过GM指定referer方式获取
	if (!blob) {
		// console.log("GM请求2", url, location.origin);
		blob = await getBlobByUrl(url, "GM", location.origin);
	}
	return blob;
}

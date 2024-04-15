/// <reference types="vite-plugin-monkey/client" />
import { GM_xmlhttpRequest } from "$";
// 函数实现
export async function GMRequest(options) {
    // 默认选项
    const defaultOptions = {
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
    if (!url || !url.trim().length)
        return Promise.resolve(null);
    let headers;
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
                    }
                    else {
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

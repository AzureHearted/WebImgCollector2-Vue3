export declare function buildUUID(): string;
export declare function mixSort(_a: string, _b: string): number;
export declare function getExtByBlob(blob: Blob): string;
export declare function getFavicon(): Promise<string>;
/**
 * f 获取链接中的域名
 * @param {string} url 链接
 * @returns {string} 链接对应的域名
 */
export declare function getHostByUrl(url: string): string;
/**
 * f [功能封装] 通过url获取名称
 * @param {string} url 链接
 * @returns {string} 链接的名称部分
 */
export declare function getNameByUrl(url: string): string;
export declare function getPicMetaByBlob(blob: Blob): Promise<{
    isOk: boolean;
    width: number;
    height: number;
    aspectRatio?: number | undefined;
}>;
export declare function getPicMetaByImage(url: string): Promise<unknown>;
export declare function strAutofill(str: string, fillContent: string | number, fillLength: number, direction?: "prefix" | "suffix"): string;
export declare function isMobile(): boolean;
export declare function getUrlType(url: string): "image" | "video" | "html";
export declare function getBlobType(blob: Blob): "image" | "video" | "html" | "audio";
export declare function guessUrlType(url: string): "image" | "video" | "html";
export declare function getClipBoardText(): Promise<string>;
/** 防抖函数
 * @param {Function} func 要进行防抖的函数
 * @param {number} delay 防抖延时
 * @returns {Function} 返回一个函数,执行该函数可以实现防抖
 * @abstract
 * 在delay期间内重复触发返回的这个函数,则一直重置计时器,
 * 直到两次触发的间隔超过delay才能成功执行一次。
 */
export declare function debounce(func: Function, delay?: number): (...args: any[]) => void;
/** 节流函数
 * @param {Function} func 要进行节流的函数
 * @param {number} wait 节流等待
 * @returns {Function} 返回一个函数,执行该函数可以实现节流
 */
export declare function throttle(func: Function, wait?: number): (...args: any[]) => void;

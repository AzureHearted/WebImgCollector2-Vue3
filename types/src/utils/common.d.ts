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
/**
 * f 字节 -> 自动单位
 * @param byteSize 字节大小
 */
export declare function byteAutoUnit(byteSize: number, decimal?: number): string;

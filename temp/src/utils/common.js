//f [功能封装]生成uuid
export function buildUUID() {
    const hexList = [];
    for (let i = 0; i <= 15; i++) {
        hexList[i] = i.toString(16);
    }
    let uuid = "";
    for (let i = 1; i <= 36; i++) {
        if (i === 9 || i === 14 || i === 19 || i === 24) {
            uuid += "-";
        }
        else if (i === 15) {
            uuid += 4;
        }
        else if (i === 20) {
            uuid += hexList[(Math.random() * 4) | 8];
        }
        else {
            uuid += hexList[(Math.random() * 16) | 0];
        }
    }
    return uuid.replace(/-/g, "");
}
//f 字符串混合排序
export function mixSort(_a, _b) {
    const reg = /[a-zA-Z0-9]/;
    // 比对仅针对字符串，数字参与对比会导致对比的字符串转为number类型，变成NaN
    const a = _a.toString();
    const b = _b.toString();
    // 比对0号位的原因是字符串中有可能出现中英文混合的情况，这种仅按首位排序即可
    if (reg.test(a[0]) || reg.test(b[0])) {
        if (a > b) {
            return 1;
        }
        else if (a < b) {
            return -1;
        }
        else {
            return 0;
        }
    }
    else {
        return a.localeCompare(b);
    }
}
//f 通过blob获取文件的ext扩展名
export function getExtByBlob(blob) {
    let ext = "";
    if (blob) {
        const match = /(?<=\/).+$/.exec(blob.type);
        if (match) {
            ext = match[0].trim().length > 0 ? match[0] : "";
        }
    }
    return ext;
}
//f 获取站点Favicon图标
export async function getFavicon() {
    let iconUrl;
    //s [1]通过link标签查找
    const urls = [...document.querySelectorAll("link[rel=icon]")]
        .map((item) => item.href)
        .filter((url) => /\.(png|svg|jpg|jpeg|webp|icon?)$/i.test(url));
    if (urls.length > 0) {
        iconUrl = urls[0];
    }
    else {
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
export function getHostByUrl(url) {
    const list = url.match(/(https?:\/\/[^/]+(?=\/))/g) || [];
    if (list.length > 0) {
        return list[0] || url;
    }
    else {
        return url;
    }
}
/**
 * f [功能封装] 通过url获取名称
 * @param {string} url 链接
 * @returns {string} 链接的名称部分
 */
export function getNameByUrl(url) {
    url = decodeURI(url);
    url = url.replace(/(\/)$/, "");
    const list = url.match(/(?<=\/)([^/\r\n$]+)$/g) || [];
    if (list.length > 0) {
        return list[0] || url;
    }
    else {
        return url;
    }
}
// f [功能封装]通过blob获取图片原信息meta
export async function getPicMetaByBlob(blob) {
    const meta = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        if (blob) {
            reader.readAsDataURL(blob);
            reader.onload = (theFile) => {
                const image = new Image();
                image.src = reader.result || "";
                image.onload = () => {
                    const meta = {
                        isOk: true,
                        width: image.width,
                        height: image.height,
                        aspectRatio: image.width / image.height,
                    };
                    //s 释放内存
                    URL.revokeObjectURL(reader.result || "");
                    resolve(meta);
                };
                image.onerror = () => {
                    const meta = {
                        isOk: false,
                        width: 0,
                        height: 0,
                    };
                    //s 释放内存
                    URL.revokeObjectURL(reader.result || "");
                    reject(meta);
                };
            };
        }
        else {
            const meta = {
                isOk: false,
                width: 0,
                height: 0,
            };
            //s 释放内存
            URL.revokeObjectURL(reader.result || "");
            reject(meta);
        }
    });
    return meta;
}
//f [功能封装]通过Image对象获取图片meta
export async function getPicMetaByImage(url) {
    // 判断传入的url变量有效(不为null或undefined)且不为空(不能全部都是空字符或者没有字符)
    if (!url || !url.trim().length) {
        const errMeta = {
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
            });
        }
        else {
            img.onload = () => {
                resolve({
                    isOk: true,
                    width: img.width,
                    height: img.height,
                    aspectRatio: img.width / img.height,
                });
            };
            img.onerror = () => {
                resolve({
                    isOk: false,
                    width: 0,
                    height: 0,
                });
            };
        }
    });
}
//f 文本自动填充
export function strAutofill(str, fillContent, fillLength, direction = "prefix") {
    if (direction === "prefix") {
        // 前缀填充
        return str.padStart(fillLength, fillContent.toString());
    }
    else {
        // 后缀填充
        return str.padEnd(fillLength, fillContent.toString());
    }
}
//f 判断是否是移动端设备
export function isMobile() {
    const sUserAgent = navigator.userAgent.toLowerCase();
    const regex = /ipad|iphone os|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/i;
    return regex.test(sUserAgent);
}
//f 链接类型判断
export function getUrlType(url) {
    let urlType = "html";
    const isImg = /\.(jpg|jpeg|png|gif|webp|bmp|icon|svg)$/i;
    const isVideo = /\.(mp4|avi|mov|mkv|mpeg|mpg|wmv|3gp|flv|f4v|rmvb|webm|ts|webp|ogv)$/i;
    if (isImg.test(url)) {
        urlType = "image";
    }
    else if (isVideo.test(url)) {
        urlType = "video";
    }
    return urlType;
}
//f blob类型判断
export function getBlobType(blob) {
    const blobTypeRegex = {
        isImg: /^image/i,
        isVideo: /^video/i,
        isAudio: /^audio/i,
    };
    if (!blob) {
        return "html";
    }
    let blobType = "html";
    if (blobTypeRegex.isImg.test(blob.type)) {
        blobType = "image";
    }
    else if (blobTypeRegex.isVideo.test(blob.type)) {
        blobType = "video";
    }
    else if (blobTypeRegex.isAudio.test(blob.type)) {
        blobType = "audio";
    }
    else {
        blobType = "html";
    }
    return blobType;
}
//f 通过链接"推测"链接类型
export function guessUrlType(url) {
    let urlType = "html";
    const isImg = /(jpg|jpeg|png|gif|webp|bmp|icon|svg)/i;
    const isVideo = /(mp4|avi|mov|mkv|mpeg|mpg|wmv|3gp|flv|f4v|rmvb|webm|ts|webp|ogv)/i;
    if (isImg.test(url)) {
        urlType = "image";
    }
    else if (isVideo.test(url)) {
        urlType = "video";
    }
    return urlType;
}
//f 获取剪切板文本
export async function getClipBoardText() {
    const text = await navigator.clipboard
        .readText()
        .then((res) => res)
        .catch(() => "");
    return text;
}
/** 防抖函数
 * @param {Function} func 要进行防抖的函数
 * @param {number} delay 防抖延时
 * @returns {Function} 返回一个函数,执行该函数可以实现防抖
 * @abstract
 * 在delay期间内重复触发返回的这个函数,则一直重置计时器,
 * 直到两次触发的间隔超过delay才能成功执行一次。
 */
export function debounce(func, delay = 500) {
    // 声明全局变量timeout
    let timeout;
    // 返回一个函数(通过解构的方式将所有变量传给args)
    return function (...args) {
        // 清除超时
        clearTimeout(timeout);
        // 设置超时
        timeout = setTimeout(() => {
            // 调用函数
            func(...args);
        }, delay);
    };
}
/** 节流函数
 * @param {Function} func 要进行节流的函数
 * @param {number} wait 节流等待
 * @returns {Function} 返回一个函数,执行该函数可以实现节流
 */
export function throttle(func, wait = 500) {
    // 声明全局变量timeout
    let timeout;
    // 返回一个函数(通过解构的方式将所有变量传给args)
    return function (...args) {
        // 如果定时器为null才执行
        if (!timeout) {
            // 设置定时器
            timeout = setTimeout(function () {
                clearTimeout(timeout); // 清除定时器
                func(...args);
            }, wait);
        }
    };
}

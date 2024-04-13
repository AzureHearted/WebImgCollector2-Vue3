export default function getDOM(selector, options) {
    // 默认选项蚕食
    const defaultOptions = {
        mode: "first",
        regionDOM: document.body,
    };
    // 初始化参数
    const { mode, regionDOM } = { ...defaultOptions, ...options };
    // 获取dom
    const doms = regionDOM.querySelectorAll(selector);
    // 判断返回结果
    switch (mode) {
        case "all":
            // 返回所有匹配的元素数组
            return (doms.length ? Array.from(doms) : []);
        case "first":
            // 返回第一个匹配的元素
            return doms.length ? doms[0] : null;
        case "last":
            // 返回最后一个匹配的元素
            return doms.length ? doms[doms.length - 1] : null;
    }
}

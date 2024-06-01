// 导入当前目录下所有以.less结尾的文件
const styleList = import.meta.glob("./*.scss");

// 根据不同网站进行修复样式的导入
export function fixStyle(hostname: string): void {
	// 获取样式注入器
	const styleInjector = styleList[`./${hostname}.scss`];
	if (styleInjector) {
		styleInjector();
		console.log(`成功导入站点“${hostname}”的修复样式`);
	} else {
		console.log(`当前站点“${hostname}”没有修复样式`);
	}
}

//? rule类 - 规则数据结构
export class Rule {
	constructor(
		rule = {
			id: undefined, //s 规则id
			main: {
				name: undefined, //s 规则名称
				domainName: undefined, //s 作用域
				pathFilter: undefined, //s 路径过滤(正则)
			},
			domItem: {
				//s 时候启用dom限定(开启后将以该项指定的dom作为起点查找查询其他项目)
				enable: undefined,
				selector: undefined,
			},
			linkUrl: {
				selector: undefined,
				infoType: undefined,
				attribute: undefined,
			},
			picUrl: {
				enable: undefined,
				//s 获取来源（0:使用dom或者linkUrl-dom; 1:通过css选择器重新指定）
				origin: undefined,
				selector: undefined,
				infoType: undefined,
				attribute: undefined,
			},
			name: {
				enable: undefined,
				origin: undefined, //s 获取来源（0:使用dom或者linkUrl-dom; 1:通过css选择器重新指定）
				selector: undefined,
				infoType: undefined,
				attribute: undefined,
			},
			meta: {
				enable: undefined,
				origin: undefined, //s 获取来源（0:使用dom或者linkUrl-dom; 1:通过css选择器重新指定）
				selector: undefined,
				infoType: undefined,
				attribute: undefined,
			},
		},
		status = {
			editing: false,
			isNewCreated: false,
		}
	) {
		Rule.count++;
		// console.log(rule);
		//! 主要参数
		//s 修正结果
		rule = rule || {};
		rule.main = rule.main || {};
		rule.domItem = rule.domItem || {};
		rule.linkUrl = rule.linkUrl || {};
		rule.picUrl = rule.picUrl || {};
		rule.name = rule.name || {};
		rule.meta = rule.meta || {};

		this.id = rule.id || (() => this.#buildUUID())();
		this.main = {
			name: rule.main.name || "新规则",
			domainName: rule.main.domainName || location.origin,
			pathFilter: rule.main.pathFilter || "",
		};
		this.domItem = {
			enable: rule.domItem.enable || false,
			selector: rule.domItem.selector || [""],
		};
		this.linkUrl = {
			selector: rule.linkUrl.selector || [""],
			infoType: rule.linkUrl.infoType || 3,
			attribute: rule.linkUrl.attribute || [""],
		};
		this.picUrl = {
			enable: rule.picUrl.enable || false,
			origin: rule.picUrl.origin || 0,
			selector: rule.picUrl.selector || [""],
			infoType: rule.picUrl.infoType || 3,
			attribute: rule.picUrl.attribute || [""],
		};
		this.name = {
			enable: rule.name.enable || false,
			origin: rule.name.origin || 0,
			selector: rule.name.selector || [""],
			infoType: rule.name.infoType || 4,
			attribute: rule.name.attribute || [""],
		};
		this.meta = {
			enable: rule.meta.enable || true,
			origin: rule.meta.origin || 0,
			selector: rule.meta.selector || [""],
			infoType: rule.meta.infoType || 3,
			attribute: rule.meta.attribute || [""],
		};

		//? 其他
		//s 修正结果
		status = status || {};
		this.status = {
			editing: status.editing || false, //s 编辑状态标记
			isNewCreated: status.isNewCreated || false, //s 标记是否为新创建的规则
		}; //s 状态对象

		this.backup = null; //s 备份(默认为空)
	}

	//? 静态成员
	static count = 0; //s 计数器

	//s 数据枚举
	#enumKey = ["main", "domItem", "linkUrl", "picUrl", "name", "meta"];

	//s 创建备份
	createBackup = () => {
		this.backup = {};
		for (const key of this.#enumKey) {
			this.backup[key] = JSON.parse(JSON.stringify(this[key]));
		}
	};

	//s 删除备份
	removeBackup = () => {
		this.backup = null;
	};

	//s 通过备份还原
	restoreByBackup = () => {
		//s 判断是否有备份
		if (this.backup != null) {
			//s 备份不为空才进行还原
			this.#enumKey.forEach((key) => {
				this[key] = this.backup[key];
			});
		}
	};

	//s 生成JSON数据(用于存储)
	getJsonData = () => {
		const jsonObj = {
			main: this.main,
			domItem: this.domItem,
			linkUrl: this.linkUrl,
			picUrl: this.picUrl,
			name: this.name,
			meta: this.meta,
		};
		return JSON.stringify(jsonObj);
	};

	//s 生成uuid
	#buildUUID = () => {
		const hexList = [];
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
	};
}

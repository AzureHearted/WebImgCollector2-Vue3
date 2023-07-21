//? rule类 - 规则数据结构
export class Rule {
	//* 主要数据枚举
	public enumMainKey = ["main", "domItem", "linkUrl", "picUrl", "name", "meta"];
	public enumMatchItemKey = ["selector", "attribute"];
	public matchItemCount = 1; //* 当前匹配项条数

	public id: string;
	public main: {
		name: string; //* 规则名称
		domainName: string; //* 作用域
		pathFilter: string; //* 路径过滤(正则)
		titleSelector: string; //* 标题选择器
	};
	public domItem: {
		//* 时候启用dom限定(开启后将以该项指定的dom作为起点查找查询其他项目)
		enable: boolean;
		selector: string[];
	};
	public linkUrl: {
		selector: string[];
		infoType: number;
		attribute: string[];
	};
	public picUrl: {
		enable: boolean;
		//* 获取来源（0:使用dom或者linkUrl-dom; 1:通过css选择器重新指定）
		origin: number;
		selector: string[];
		infoType: number;
		attribute: string[];
	};
	public name: {
		enable: boolean;
		//* 获取来源（0:使用dom或者linkUrl-dom; 1:通过css选择器重新指定）
		origin: number;
		selector: string[];
		infoType: number;
		attribute: string[];
	};
	public meta: {
		enable: boolean;
		//* 获取来源（0:使用dom或者linkUrl-dom; 1:通过css选择器重新指定）
		origin: number;
		selector: string[];
		infoType: number;
		attribute: string[];
	};

	public status: {
		editing: boolean; //* 标记是否为新创建的规则
		isNewCreated: boolean; //* 标记是否为新创建的规则
	}; //* 状态对象;
	public backup: any;

	constructor(
		rule: Object | undefined = {
			id: <string | undefined>undefined, //* 规则id
			main: <Object | undefined>{
				name: <string | undefined>undefined, //* 规则名称
				domainName: <string | undefined>undefined, //* 作用域
				pathFilter: <string | undefined>undefined, //* 路径过滤(正则)
				titleSelector: <string | undefined>undefined, //* 标题选择器
			},
			domItem: <Object | undefined>{
				//* 时候启用dom限定(开启后将以该项指定的dom作为起点查找查询其他项目)
				enable: <boolean | undefined>undefined,
				selector: <string[] | undefined>undefined,
			},
			linkUrl: <Object | undefined>{
				selector: <string[] | undefined>undefined,
				infoType: <number | undefined>undefined,
				attribute: <string[] | undefined>undefined,
			},
			picUrl: <Object | undefined>{
				enable: <boolean | undefined>undefined,
				origin: <number | undefined>undefined,
				selector: <string[] | undefined>undefined,
				infoType: <number | undefined>undefined,
				attribute: <string[] | undefined>undefined,
			},
			name: <Object | undefined>{
				enable: <boolean | undefined>undefined,
				origin: <number | undefined>undefined,
				selector: <string[] | undefined>undefined,
				infoType: <number | undefined>undefined,
				attribute: <string[] | undefined>undefined,
			},
			meta: <Object | undefined>{
				enable: <boolean | undefined>undefined,
				origin: <number | undefined>undefined,
				selector: <string[] | undefined>undefined,
				infoType: <number | undefined>undefined,
				attribute: <string[] | undefined>undefined,
			},
		},
		status: Object | undefined = {
			editing: false,
			isNewCreated: false,
		}
	) {
		Rule.count++;
		// console.log(rule);
		//! 主要参数
		//* 修正结果
		rule = rule || {};
		rule["main"] = rule["main"] || {};
		rule["domItem"] = rule["domItem"] || {};
		rule["linkUrl"] = rule["linkUrl"] || {};
		rule["picUrl"] = rule["picUrl"] || {};
		rule["name"] = rule["name"] || {};
		rule["meta"] = rule["meta"] || {};

		this.id = rule["id"] || (() => this.buildUUID())();
		this.main = {
			name: rule["main"].name || "新规则",
			domainName: rule["main"].domainName || location.origin,
			pathFilter: rule["main"].pathFilter || "",
			titleSelector: rule["main"].titleSelector || "",
		};
		this.domItem = {
			enable: rule["domItem"].enable || false,
			selector: rule["domItem"].selector || [""],
		};
		this.linkUrl = {
			selector: rule["linkUrl"].selector || [""],
			infoType: rule["linkUrl"].infoType || 3,
			attribute: rule["linkUrl"].attribute || [""],
		};
		this.picUrl = {
			enable: rule["picUrl"].enable || false,
			origin: rule["picUrl"].origin || 0,
			selector: rule["picUrl"].selector || [""],
			infoType: rule["picUrl"].infoType || 3,
			attribute: rule["picUrl"].attribute || [""],
		};
		this.name = {
			enable: rule["name"].enable || false,
			origin: rule["name"].origin || 0,
			selector: rule["name"].selector || [""],
			infoType: rule["name"].infoType || 4,
			attribute: rule["name"].attribute || [""],
		};
		this.meta = {
			enable: rule["meta"].enable || true,
			origin: rule["meta"].origin || 0,
			selector: rule["meta"].selector || [""],
			infoType: rule["meta"].infoType || 3,
			attribute: rule["meta"].attribute || [""],
		};

		//? 其他
		//* 修正结果
		status = status || {};
		this.status = {
			editing: status["editing"] || false, //* 编辑状态标记
			isNewCreated: status["isNewCreated"] || false, //* 标记是否为新创建的规则
		}; //* 状态对象

		this.backup = null; //* 备份(默认为空)
	}

	//? 静态成员
	static count = 0; //* 计数器

	//f 获取当前匹配条目数量
	public getMatchItemCount = (): number => {
		let max = 0;
		for (const key of this.enumMainKey) {
			Object.keys(this.linkUrl).forEach((item) => {
				if (this.enumMatchItemKey.includes(item)) {
					if (max < this[key][item].length) {
						max = this[key][item].length;
					}
				}
			});
		}
		return max;
	};

	//f 创建备份
	public createBackup = () => {
		this.backup = {};
		for (const key of this.enumMainKey) {
			this.backup[key] = JSON.parse(JSON.stringify(this[key]));
		}
	};

	//f 删除备份
	public removeBackup = () => {
		this.backup = null;
	};

	//f 通过备份还原
	public restoreByBackup = () => {
		//* 判断是否有备份
		if (this.backup != null) {
			//* 备份不为空才进行还原
			this.enumMainKey.forEach((key) => {
				this[key] = this.backup[key];
			});
		}
	};

	//f 生成JSON数据(用于存储)
	public getJsonData = () => {
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

	//f 生成uuid
	private buildUUID = (): string => {
		const hexList: string[] = [];
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

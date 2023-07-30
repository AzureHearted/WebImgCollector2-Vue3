//? rule类 - 规则数据结构
export class MatchRule {
  //? 静态成员
  static count = 0; //s 计数器

  //s 主要数据枚举
  public enumMainKey = ["main", "domItem", "linkUrl", "picUrl", "name", "meta", "filter"];
  public enumMatchItemKey = ["selector", "attribute"];
  public matchItemCount = 1; //s 当前匹配项条数

  public id: string;
  public main: IORule_main;
  public domItem: IORule_domItem;
  public linkUrl: IORule_linkUrl;
  public picUrl: IORule_picUrl;
  public name: IORule_name;
  public meta: IORule_meta;
  public filter: IORule_filter;

  public status: IOMatchRule_status;
  public backup: IRule;

  constructor(rule?: IRule, options?: {newCreate: boolean; status?: IMatchRule_status}) {
    MatchRule.count++;

    if (options?.newCreate) {
      this.id = this.buildUUID();
    } else {
      this.id = rule?.id || (() => this.buildUUID())();
    }

    //s 主要信息
    this.main = {
      name: rule?.main?.name || "新规则",
      domainName: rule?.main?.domainName || "",
      pathFilter: {
        pattern: rule?.main?.pathFilter?.pattern || "",
        flags: rule?.main?.pathFilter?.flags || [],
      },
      titleSelector: rule?.main?.titleSelector || "",
      iconUrl: rule?.main?.iconUrl || "",
    };
    this.domItem = {
      enable: rule?.domItem?.enable || false,
      method: rule?.domItem?.method || 0,
      selector: rule?.domItem?.selector || [""],
    };
    this.linkUrl = {
      method: rule?.linkUrl?.method || 0,
      selector: rule?.linkUrl?.selector || [""],
      infoType: rule?.linkUrl?.infoType || 3,
      attribute: rule?.linkUrl?.attribute || [""],
    };
    this.picUrl = {
      enable: rule?.picUrl?.enable || false,
      origin: rule?.picUrl?.origin || 0,
      method: rule?.picUrl?.method || 0,
      selector: rule?.picUrl?.selector || [""],
      infoType: rule?.picUrl?.infoType || 3,
      attribute: rule?.picUrl?.attribute || [""],
    };
    this.name = {
      enable: rule?.name?.enable || false,
      origin: rule?.name?.origin || 0,
      method: rule?.name?.method || 0,
      selector: rule?.name?.selector || [""],
      infoType: rule?.name?.infoType || 4,
      attribute: rule?.name?.attribute || [""],
    };
    this.meta = {
      enable: rule?.meta?.enable || true,
      origin: rule?.meta?.origin || 2,
      method: rule?.meta?.method || 0,
      selector: rule?.meta?.selector || [""],
      infoType: rule?.meta?.infoType !== undefined ? rule?.meta?.infoType : 0,
      attribute: rule?.meta?.attribute || [""],
      getMethod: rule?.meta?.getMethod !== undefined ? rule?.meta?.getMethod : 0,
    };
    this.filter = {
      formats: rule?.filter?.formats || [],
      width: rule?.filter?.width || [350, 500],
      height: rule?.filter?.height || [350, 500],
    };

    //? 状态信息
    this.status = {
      editing: options?.status?.editing || false, //s 编辑状态标记
      isNewCreated: options?.status?.isNewCreated || false, //s 标记是否为新创建的规则
    }; //s 状态对象

    //s 备份(默认为空)
    this.backup = {};
  }

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
  public createBackup = (): void => {
    this.backup = {};
    for (const key of this.enumMainKey) {
      this.backup[key] = JSON.parse(JSON.stringify(this[key]));
    }
  };

  //f 删除备份
  public removeBackup = (): void => {
    this.backup = {};
  };

  //f 通过备份还原
  public restoreByBackup = (): void => {
    //s 判断是否有备份
    if (this.backup != undefined) {
      //s 备份不为空才进行还原
      for (const key of this.enumMainKey) {
        this[key] = JSON.parse(JSON.stringify(this.backup[key]));
      }
    }
  };

  //f 生成JSON数据(用于存储)
  public getJsonData = (): string => {
    const jsonObj = {
      id: this.id,
      main: this.main,
      domItem: this.domItem,
      linkUrl: this.linkUrl,
      picUrl: this.picUrl,
      name: this.name,
      meta: this.meta,
      filter: this.filter,
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

//! Rule类的仅输入接口
export interface IMatchRule extends IRule {
  status?: IMatchRule_status;
}

//s rule的仅输入接口
export interface IRule {
  id?: string;
  main?: IRule_main;
  domItem?: IRule_domItem;
  linkUrl?: IRule_linkUrl;
  picUrl?: IRule_picUrl;
  name?: IRule_name;
  meta?: IRule_meta;
  filter?: IRule_filter;
}

//s rule-main仅输入接口
interface IRule_main {
  name?: string; //s 规则名称
  domainName?: string; //s 作用域
  pathFilter?: {
    pattern?: string; //s 正则表达式
    flags?: string[]; //s 正则修饰符
  };
  titleSelector?: string; //s 标题选择器
  iconUrl?: string; //s 站点图标链接
}

//s rule-domItem仅输入接口
interface IRule_domItem {
  //s 时候启用dom限定(开启后将以该项指定的dom作为起点查找查询其他项目)
  enable?: boolean;
  method?: 0 | 1;
  selector?: string[];
}

//s rule-linkUrl仅输入接口
interface IRule_linkUrl {
  method?: 0 | 1;
  selector?: string[];
  infoType?: 1 | 2 | 3 | 4 | 5 | 6;
  attribute?: string[];
}

//s rule-picUrl仅输入接口
interface IRule_picUrl {
  enable?: boolean;
  //s 获取来源（0:使用dom或者linkUrl-dom; 1:通过css选择器重新指定）
  origin?: number;
  method?: 0 | 1;
  selector?: string[];
  infoType?: 1 | 2 | 3 | 4 | 5 | 6;
  attribute?: string[];
}

//s rule-name仅输入接口
interface IRule_name {
  enable?: boolean;
  //s 获取来源（0:使用dom或者linkUrl-dom; 1:通过css选择器重新指定）
  origin?: number;
  method?: 0 | 1;
  selector?: string[];
  infoType?: 1 | 2 | 3 | 4 | 5 | 6;
  attribute?: string[];
}

//s rule-meta仅输入接口
interface IRule_meta {
  enable?: boolean;
  //s 获取来源（0:使用dom或者linkUrl-dom; 1:通过css选择器重新指定）
  origin?: 0 | 1 | 2 | 3;
  method?: 0 | 1;
  selector?: string[];
  infoType?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  attribute?: string[];
  getMethod?: 0 | 1 | 2 | 3; //s 元信息获取方式
}

//s rule-filter仅输入接口
interface IRule_filter {
  formats?: string[];
  width?: [number, number];
  height?: [number, number];
}

//? rule-status仅输入接口
interface IMatchRule_status {
  editing?: boolean;
  isNewCreated?: boolean;
}

//! 输入输出接口
//s rule的输入输出接口
export interface IORule {
  id: string;
  main: IORule_main;
  domItem: IORule_domItem;
  linkUrl: IORule_linkUrl;
  picUrl: IORule_picUrl;
  name: IORule_name;
  meta: IORule_meta;
  filter: IORule_filter;
}

//s rule-main输入输出接口
interface IORule_main {
  name: string; //s 规则名称
  domainName: string; //s 作用域
  pathFilter: {
    pattern: string; //s 正则表达式
    flags: string[]; //s 正则修饰符
  };
  titleSelector: string; //s 标题选择器
  iconUrl: string; //s 站点图标链接
}

//s rule-domItem输入输出接口
interface IORule_domItem {
  //s 时候启用dom限定(开启后将以该项指定的dom作为起点查找查询其他项目)
  enable: boolean;
  method: 0 | 1;
  selector: string[];
}

//s rule-linkUrl输入输出接口
interface IORule_linkUrl {
  method: 0 | 1;
  selector: string[];
  infoType: 1 | 2 | 3 | 4 | 5 | 6;
  attribute: string[];
}

//s rule-picUrl输入输出接口
interface IORule_picUrl {
  enable: boolean;
  //s 获取来源（0:使用dom或者linkUrl-dom; 1:通过css选择器重新指定）
  origin: number;
  method: 0 | 1;
  selector: string[];
  infoType: 1 | 2 | 3 | 4 | 5 | 6;
  attribute: string[];
}

//s rule-name输入输出接口
interface IORule_name {
  enable: boolean;
  //s 获取来源（0:使用dom或者linkUrl-dom; 1:通过css选择器重新指定）
  origin: number;
  method: 0 | 1;
  selector: string[];
  infoType: 1 | 2 | 3 | 4 | 5 | 6;
  attribute: string[];
}

//s rule-meta输入输出接口
interface IORule_meta {
  enable: boolean;
  //s 获取来源（0:使用dom或者linkUrl-dom; 1:通过css选择器重新指定）
  origin: 0 | 1 | 2 | 3;
  method: 0 | 1;
  selector: string[];
  infoType: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  attribute: string[];
  getMethod: 0 | 1 | 2 | 3; //s 元信息获取方式
}

//s rule-filter输入输出接口
interface IORule_filter {
  formats: string[];
  width: [number, number];
  height: [number, number];
}

//? rule-status输入输出接口
interface IOMatchRule_status {
  editing: boolean;
  isNewCreated: boolean;
}

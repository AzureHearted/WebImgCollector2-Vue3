import {blob_regex} from "@/ts/regex";
import {IORule, MatchRule} from "@/ts/class/MatchRule";

/**
 * f 任务队列
 * - 可控制并发数量且能自动执行
 * @class
 * @constructor
 */
export class TaskQueue {
  public max: number;
  public initMax: number;
  public delay: number;
  public taskList: ITask[];
  public showMessage: boolean;
  public finallyCallback: Function;

  constructor(options?: {
    showMessage?: false;
    max?: number;
    delay?: number;
    finallyCallback?: () => {};
  }) {
    this.max = options?.max || 4;
    this.initMax = options?.max || 4;
    this.delay = options?.delay || 300;
    this.taskList = [];
    this.showMessage = options?.showMessage || false;
    this.finallyCallback = options?.finallyCallback || Function();
  }
  /**
   * * 添加任务到队列
   * @param {ITask} task 任务项
   */
  public addTask(task?: ITask): void {
    if (task) {
      this.taskList.push(task);
    }
  }
  /**
   * * push任务到队列
   * @param {ITask[]} taskList 任务项
   */
  public pushTask(taskList: ITask[]): void {
    if (taskList) {
      this.taskList.push(...taskList);
    }
  }
  //f 启动任务队列(必须使用异步否则节流函数无效)
  public async run() {
    //s 外部 - 节流实现
    throttle(async () => {
      // console.log("每次请求->", this.max, "执行间隔->", this.delay);
      const length = this.taskList.length;
      // console.log(this.max, this.initMax);
      if (!length) {
        if (this.max === this.initMax) {
          this.finallyCallback();
        }
        return;
      }
      const min = Math.min(length, this.max);
      for (let i = 0; i < min; i++) {
        const task = this.taskList.shift();
        this.max--; //s 占用一个空间
        // console.log("当前剩余空间", this.max);
        if (task && task?.main) {
          task
            ?.main()
            .then((res) => {
              if (this.showMessage) console.log(res);
              if (task.callback) {
                task.callback(res, task.index); //s 单个任务执行完成时的回调
              }
            })
            .catch((err) => {
              if (this.showMessage) console.log(err);
              if (task.callback) {
                task.callback(err, task.index); //s 单个任务执行完成时的回调
              }
            })
            .finally(() => {
              this.max++; //s 还原一个空间
              //s 执行过后任务置空防止重复执行
              task.main = null;
              if (this.max === this.initMax) {
                this.run();
              }
            });
        }
      }
    }, this.delay)();
  }
}
//s 任务类型的接口
export interface ITask {
  index: number;
  main: FnReturnPromise;
  callback?: (res: any, index: number) => any;
}
type FnReturnPromise = (() => Promise<any>) | null;

/**
 * f 节流函数(内容多次触发 -> 一段时间执行一次)
 * @param fn 传入的自定义执行函数
 * @param delay 执行时长间隔
 * @returns
 */
export function throttle(fn: Function, delay: number = 1000) {
  let t: boolean = true;
  return function (this: any) {
    if (t) {
      setTimeout(() => {
        fn.call(this);
        t = true;
      }, delay);
    }
    t = false;
  };
}

/**
 * f 防抖函数(一段时间内容多次触发 -> 只有最后一次生效)
 * @param fn 传入的自定义执行函数
 * @param delay 触发的最小时长
 * @returns
 */
export function debounce(fn: Function, delay: number = 1000) {
  let t: NodeJS.Timeout | null = null;
  return function (this: any) {
    if (t !== null) {
      clearTimeout(t);
    }
    t = setTimeout(() => {
      fn.call(this);
    }, delay);
  };
}

/**
 * f 通过链接获取blob
 * - 模式:
 * 	- JavaScript原生fetch
 * 	- 油猴GM_xmlhttpRequest的API
 * @param {string} url 链接
 * @param {'Fetch'|'GM'} mode 获取模式
 * @param {null|string} referer 域(名)
 * @returns Promise 对象
 */
export function getBlobByUrl(
  url: string,
  mode: "Fetch" | "GM" = "Fetch",
  referer: string | undefined = undefined
): Promise<Blob | null> | Blob | null {
  if (isEmpty(url)) {
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  }
  if (mode === "Fetch") {
    return new Promise(async (resolve, reject) => {
      let blob = await fetch(url)
        .then((res) => res.blob())
        .catch((err) => null);
      if (blob != null) {
        // console.log("Fetch成功", blob);
        resolve(blob);
      } else {
        // console.log("Fetch失败", blob);
        resolve(null);
      }
    });
  } else if (mode === "GM") {
    return new Promise(async (resolve, reject) => {
      let headers: any;
      if (referer != null) {
        headers = {
          referer: referer,
        };
      }
      GM_xmlhttpRequest(<any>{
        methods: "GET",
        url: url,
        responseType: "blob",
        headers: headers,
        onload: (res: any) => {
          // console.log(res, res.response, res.status);
          if (res.status == 200) {
            // console.log(`GM成功(referer:${referer})`, res.response, res.status);
            resolve(res.response);
          } else {
            // console.log(`GM失败(referer:${referer})`, res.response, res.status);
            resolve(null);
          }
        },
        onerror: (err: any) => {
          resolve(null);
        },
        ontimeout: () => {
          resolve(null);
        },
        onabort: () => {
          resolve(null);
        },
      });
    });
  } else {
    return null;
  }
}

/**
 * f 通过链接获取blob(自动)
 * - 模式:
 * 	- JavaScript原生fetch
 * 	- 油猴GM_xmlhttpRequest的API
 * @param {string} url 链接
 * @returns Promise 对象
 */
export async function getBlobByUrlAuto(url: string): Promise<Blob | null> {
  //s 链接为空直接返回空blob
  if (isEmpty(url)) {
    return null;
  }
  let blob: Blob | null = null;
  //s 先尝试通过Fetch方法获取
  blob = await getBlobByUrl(url, "Fetch");
  //s Fetch失败后尝试通过GM不指定referer方式获取
  if (!blob) {
    blob = await getBlobByUrl(url, "GM");
  }
  //s 再次失败后尝试通过GM指定referer方式获取
  if (!blob) {
    blob = await getBlobByUrl(url, "GM", location.origin);
  }
  return blob;
}

//f [功能封装]生成uuid
export function buildUUID(): string {
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
}

//f 获取站点Favicon图标
export async function getFavicon(): Promise<string> {
  let iconUrl: string;
  //s [1]通过link标签查找
  let urls = ([...document.querySelectorAll("link[rel=icon]")] as HTMLLinkElement[])
    .map((item: HTMLLinkElement) => item.href)
    .filter((url) => /\.(png|svg|jpg|jpeg|webp|icon?)$/i.test(url));

  if (urls.length > 0) {
    iconUrl = urls[0];
  } else {
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
export function getOriginByUrl(url: string): string {
  let list = url.match(/(https?:\/\/[^\/]+(?=\/))/g) || [];
  if (list.length > 0) {
    return list[0] || url;
  } else {
    return url;
  }
}

/**
 * f [功能封装] 通过url获取名称
 * @param {string} url 链接
 * @returns {string} 链接的名称部分
 */
export function getNameByUrl(url: string): string {
  url = decodeURI(url)
  url = url.replace(/(\/)$/, "");
  let list = url.match(/(?<=\/)([^\/\r\n$]+)$/g) || [];
  if (list.length > 0) {
    return list[0] || url;
  } else {
    return url;
  }
}

//f [功能封装]判断字符串是否为空
export function isEmpty(str: string | null | undefined = "", includeSpace = false) {
  return includeSpace
    ? str == null || str == undefined || str == "" || /^ +?$/.test(str)
    : str == null || str == undefined || str == "";
}

//f [功能封装]通过blob获取图片meta
export async function getImgMetaByBlob(blob: Blob | null) {
  const meta: metaInterFace = await new Promise((resolve, reject) => {
    let reader = new FileReader();
    if (blob) {
      reader.readAsDataURL(blob);
      reader.onload = (theFile) => {
        let image = new Image();
        image.src = (reader.result as string) || "";
        image.onload = () => {
          const meta: metaInterFace = {
            isOk: true,
            width: image.width,
            height: image.height,
            aspectRatio: image.width / image.height,
          };
          //s 释放内存
          URL.revokeObjectURL((reader.result as string) || "");
          resolve(meta);
        };
        image.onerror = () => {
          const meta: metaInterFace = {
            isOk: false,
            width: 0,
            height: 0,
          };
          //s 释放内存
          URL.revokeObjectURL((reader.result as string) || "");
          reject(meta);
        };
      };
    } else {
      const meta: metaInterFace = {
        isOk: false,
        width: 0,
        height: 0,
      };
      //s 释放内存
      URL.revokeObjectURL((reader.result as string) || "");
      reject(meta);
    }
  });
  blob = null;
  return meta;
}

//f [功能封装]通过Image对象获取图片meta
export async function getImgMetaByImage(url: string): Promise<metaInterFace> {
  if (isEmpty(url)) {
    const errMeta: metaInterFace = {
      isOk: false,
      width: 0,
      height: 0,
      aspectRatio: 3 / 4,
    };
    return errMeta;
  }
  return await new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    if (img.complete) {
      resolve(<metaInterFace>{
        isOk: true,
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
      });
    } else {
      img.onload = () => {
        resolve(<metaInterFace>{
          isOk: true,
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height,
        });
      };
      img.onerror = () => {
        resolve(<metaInterFace>{
          isOk: false,
          width: 0,
          height: 0,
          aspectRatio: 3 / 4,
        });
      };
    }
  });
}

/**
 * f 通过匹配规则获取cards
 * - 异步操作需要使用 await
 * @param rule 匹配规则
 */
export async function getCardsByRule(
  rule: IORule,
  nowCount: number,
  singleCallback?: Function, //s 每处理成功一个卡片执行的回调
  finallyCallback?: Function, //s 处理完所有卡片时执行的回调
  option?: {
    maxLimit?: 10; //s 最大并数
    delay?: number; //s 并发间隔时长
    excludeDomSet?: Set<HTMLElement>; //s 要排除的dom集合
    excludeUrlSet?: Set<string>; //s 要排除的url集合
  }
): Promise<void> {
  let rowCardList: rowCard[] = [];
  console.log("开始匹配 - 规则信息 -> ", rule); //s 规则信息打印
  //s 获取卡片基本信息
  if (rule.domItem.enable) {
    //! 启用了dom匹配
    //? 对每个规则系列进行单独的匹配
    for (let i = 0, len = rule.domItem.selector.length; i < len; i++) {
      // 获取所有符合条件的dom对象
      let domList = (await getDom(
        document,
        rule.domItem.method,
        rule.domItem.selector[i],
        0
      )) as HTMLElement[];

      //! 对每个dom进行结果匹配
      for (let index = 0; index < domList.length; index++) {
        let card: rowCard = {
          id: buildUUID(), //s 生成uuid
          metaOrigin: "",
          dom: domList[index],
        }; // 用于接收匹配到的card对象
        rowCardList.push(card as matchCard);

        //s 参数名称简化
        let linkUrl_Selector = rule.linkUrl.selector[i],
          picUrl_Selector = rule.picUrl.selector[i],
          name_Selector = rule.name.selector[i],
          meta_Selector = rule.meta.selector[i];

        //! [匹配LinkUrl]
        card.linkUrlDom = card.dom; // 匹配LinkUrl的标签(默认为dom)
        //如果表达式不为空则表示使用表达式来匹配urlTag
        if (!isEmpty(linkUrl_Selector, true)) {
          card.linkUrlDom = (await getDom(
            card.dom as HTMLElement | null,
            rule.linkUrl.method,
            linkUrl_Selector,
            1
          )) as HTMLElement;
        }
        //! 获取对应结果(链接)
        if (card.linkUrlDom) {
          card.linkUrl = await getTagInfo(
            card.linkUrlDom,
            rule.linkUrl.infoType,
            rule.linkUrl.attribute[i]
          );
        } else {
          card.linkUrl = "";
        }

        //! [匹配PicUrl]
        if (rule.picUrl.enable == true) {
          card.picUrlDom = card.dom; // 匹配PicUrl的标签(默认为dom)
          //s [获取dom]如果表达式不为空则表示使用表达式来匹配picUrlTag
          if (!isEmpty(picUrl_Selector, true)) {
            if (picUrl_Selector == linkUrl_Selector) {
              card.picUrlDom = card.linkUrlDom;
            } else {
              card.picUrlDom = (await getDom(
                card.dom as HTMLElement | null,
                rule.picUrl.method,
                picUrl_Selector,
                1
              )) as HTMLElement;
            }
          }
          // [匹配结果]
          if (card.picUrlDom != null) {
            card.picUrl = await getTagInfo(
              card.picUrlDom,
              rule.picUrl.infoType,
              rule.picUrl.attribute[i]
            );
            if (card.picUrl == null) {
              card.picUrl = card.linkUrl;
            }
          } else {
            card.picUrl = card.linkUrl;
          }
        } else {
          card.picUrl = card.linkUrl;
          card.picUrlDom = card.linkUrlDom;
        }

        //! [匹配name]
        if (rule.name.enable == true) {
          card.nameDom = card.dom; // 匹配Content的标签(默认为dom)
          //s [获取dom]如果表达式不为空则表示使用表达式来匹配picUrlTag
          if (!isEmpty(name_Selector, true)) {
            if (name_Selector == linkUrl_Selector) {
              card.nameDom = card.linkUrlDom;
            } else if (name_Selector == picUrl_Selector) {
              card.nameDom = card.picUrlDom;
            } else {
              card.nameDom = (await getDom(
                card.dom,
                rule.name.method,
                name_Selector,
                1
              )) as HTMLElement;
            }
          }
          //s [匹配结果]
          if (card.nameDom) {
            card.name = await getTagInfo(card.nameDom, rule.name.infoType, rule.name.attribute[i]);
            if (card.name == null) {
              card.name = card.linkUrl;
            }
          } else {
            card.name = card.linkUrl;
          }
        } else {
          card.name = card.linkUrl;
          card.nameDom = card.linkUrlDom;
        }

        //! [匹配meta]
        if (rule.meta.enable == true && rule.meta.origin == 0) {
          card.metaDom = card.dom; // 匹配LinkUrl的标签(默认为dom)
          //s [获取dom]如果表达式不为空则表示使用表达式来匹配picUrlTag
          if (!isEmpty(meta_Selector, true)) {
            if (meta_Selector == linkUrl_Selector) {
              card.metaDom = card.linkUrlDom;
            } else if (meta_Selector == picUrl_Selector) {
              card.metaDom = card.picUrlDom;
            } else if (meta_Selector == name_Selector) {
              card.metaDom = card.nameDom;
            } else {
              card.metaDom = (await getDom(
                card.dom,
                rule.meta.method,
                meta_Selector,
                1
              )) as HTMLElement;
            }
          }
          //s [匹配结果]
          if (card.metaDom) {
            card.metaOrigin = await getTagInfo(
              card.metaDom,
              rule.meta.infoType,
              rule.meta.attribute[i]
            );
            if (card.metaOrigin == undefined) {
              card.metaOrigin = card.linkUrl;
            }
          } else {
            card.metaOrigin = card.linkUrl;
          }
        } else {
          if (rule.meta.origin == 1) {
            card.metaDom = card.linkUrlDom;
            card.metaOrigin = card.linkUrl;
          } else if (rule.meta.origin == 2) {
            card.metaDom = card.picUrlDom;
            card.metaOrigin = card.picUrl;
          } else if (rule.meta.origin == 3) {
            card.metaDom = card.nameDom;
            card.metaOrigin = card.name;
          }
        }
      }
    }
  } else {
    //! 未启用dom匹配
    //? 对每个规则系列进行单独的匹配
    for (let i = 0, len = rule.linkUrl.selector.length; i < len; i++) {
      // 分别获取各个匹配项目
      let linkUrlList_temp: string[] = [];
      let picUrlList_temp: string[] = [];
      let nameList_temp: string[] = [];
      let metaTextList_temp: string[] = [];

      //! 获取linkUrls
      let linkUrlDomList: HTMLElement[] = [];
      linkUrlDomList.push(
        ...((await getDom(
          document,
          rule.linkUrl.method,
          rule.linkUrl.selector[i],
          0
        )) as HTMLElement[])
      );
      for (const linkUrlDom of linkUrlDomList) {
        if (linkUrlDom) {
          linkUrlList_temp.push(
            await getTagInfo(linkUrlDom, rule.linkUrl.infoType, rule.linkUrl.attribute[i])
          );
        } else {
          linkUrlList_temp.push("");
        }
      }

      // console.log(linkUrlList_temp);

      //! 获取picUrls
      let picUrlDomList: HTMLElement[] = [];
      if (rule.picUrl.enable && !isEmpty(rule.picUrl.selector[i], true)) {
        picUrlDomList.push(
          ...((await getDom(
            document,
            rule.picUrl.method,
            rule.picUrl.selector[i],
            0
          )) as HTMLElement[])
        );
        for (const picUrlDom of picUrlDomList) {
          if (picUrlDom) {
            picUrlList_temp.push(
              await getTagInfo(picUrlDom, rule.picUrl.infoType, rule.picUrl.attribute[i])
            );
          } else {
            picUrlList_temp.push("");
          }
        }
        //s 长度填充
        picUrlList_temp = fillArrayToTargetLength(picUrlList_temp, linkUrlList_temp.length, "");
      } else {
        picUrlList_temp = Array.from(linkUrlList_temp);
        picUrlDomList = linkUrlDomList;
      }

      //! 获取名称
      let nameDomList: HTMLElement[] = [];
      if (rule.name.enable && !isEmpty(rule.name.selector[i], true)) {
        nameDomList.push(
          ...((await getDom(document, rule.name.method, rule.name.selector[i], 0)) as HTMLElement[])
        );
        for (const nameDom of nameDomList) {
          if (nameDom != null) {
            nameList_temp.push(
              await getTagInfo(nameDom, rule.name.infoType, rule.name.attribute[i])
            );
          } else {
            nameList_temp.push("");
          }
        }
        //s 长度填充
        nameList_temp = fillArrayToTargetLength(nameList_temp, linkUrlList_temp.length, "");
      } else {
        nameList_temp = Array.from(linkUrlList_temp);
        nameDomList = linkUrlDomList;
      }

      //! 获取meta
      let metaDomList: HTMLElement[] = [];
      if (rule.meta.enable && rule.meta.origin == 0 && !isEmpty(rule.meta.selector[i], true)) {
        metaDomList.push(
          ...((await getDom(document, rule.meta.method, rule.meta.selector[i], 0)) as HTMLElement[])
        );
        for (const metaDom of metaDomList) {
          if (metaDom != null) {
            metaTextList_temp.push(
              await getTagInfo(metaDom, rule.meta.infoType, rule.meta.attribute[i])
            );
          } else {
            metaTextList_temp.push("");
          }
        }
        //s 长度填充
        metaTextList_temp = fillArrayToTargetLength(metaTextList_temp, linkUrlList_temp.length, "");
      } else {
        if (rule.meta.origin == 1) {
          metaTextList_temp = Array.from(linkUrlList_temp);
          metaDomList = linkUrlDomList;
        } else if (rule.meta.origin == 2) {
          metaTextList_temp = Array.from(picUrlList_temp);
          metaDomList = picUrlDomList;
        } else if (rule.meta.origin == 3) {
          metaTextList_temp = Array.from(nameList_temp);
          metaDomList = nameDomList;
        }
      }

      //! 合成一批cards
      for (let index = 0; index < linkUrlList_temp.length; index++) {
        const link = linkUrlList_temp[index];
        let card: rowCard = {
          id: buildUUID(), //s 生成uuid
          metaOrigin: "",
        };
        //s 匹配结果
        card.linkUrl = link;
        card.picUrl = picUrlList_temp[index];
        card.name = nameList_temp[index];
        card.metaOrigin = metaTextList_temp[index];

        //s dom
        card.dom = linkUrlDomList[index];
        card.linkUrlDom = linkUrlDomList[index];
        card.picUrlDom = picUrlDomList[index];
        card.nameDom = nameDomList[index];
        card.metaDom = metaDomList[index];

        rowCardList.push(card as matchCard);
      }
    }
  }

  //s 过滤无效卡片
  rowCardList = rowCardList.filter((rowCard) => rowCard.dom && !isEmpty(rowCard.picUrl));

  //s 处理卡片信息
  let processedCount = 0;
  const taskQueue = new TaskQueue({
    showMessage: false,
    max: option?.maxLimit,
    delay: option?.delay,
  });
  let cardList: matchCard[] = [];
  for (let index = 0; index < rowCardList.length; index++) {
    const rowCard = rowCardList[index];
    // console.log(!option?.excludeDomSet?.has(rowCard.dom as HTMLElement));
    //s dom集合中没有过的才进行处理和回调
    if (
      !option?.excludeDomSet?.has(rowCard.dom as HTMLElement) &&
      !option?.excludeUrlSet?.has(rowCard.picUrl as string)
    ) {
      //s 定义任务队列
      const task: ITask = {
        index: index,
        main: async () => {
          const card = await singleCardProcessing(rowCard, rule);
          return card;
        },
        callback: async (card, realIndex) => {
          processedCount++;
          if (singleCallback)
            await singleCallback(card, nowCount + realIndex, processedCount, rowCardList.length);
          cardList.push(card);
        },
      };
      taskQueue.addTask(task);
    }
  }
  taskQueue.finallyCallback = () => {
    if (finallyCallback) finallyCallback(cardList, rowCardList);
  };
  taskQueue.run();
}

//f 卡片(单个)信息处理
async function singleCardProcessing(rowCard: rowCard, rule: IORule): Promise<matchCard> {
  let card: matchCard = {
    id: rowCard.id,
    name: rowCard.name || "",
    linkUrl: rowCard.linkUrl || "",
    picUrl: rowCard.picUrl || "",
    originUrls: rowCard.linkUrl ? [rowCard.linkUrl] : [],
    match: false,
    selected: false,
    metaOrigin: rowCard.metaOrigin,
    meta: {
      isOk: false,
      width: 0,
      height: 0,
      aspectRatio: 3 / 4,
    },
    dom: rowCard.dom,
    linkUrlDom: rowCard.linkUrlDom,
    picUrlDom: rowCard.picUrlDom,
    nameDom: rowCard.nameDom,
    metaDom: rowCard.metaDom,
    visible: false,
  };

  //! 链接处理
  if (isUrl(card.linkUrl)) {
    //? 不全链接补全
    card.linkUrl = urlCompletion(card.linkUrl);
  }
  //s 结果修正部分
  if (!isEmpty(card.linkUrl)) {
  } else {
    card.linkUrl = "";
  }

  //! 图链处理
  if (rule.picUrl.enable) {
    if (isUrl(card.picUrl)) {
      //? 不全链接补全
      card.picUrl = urlCompletion(card.picUrl);
    }
    //s 结果修正部分
    if (!isEmpty(card.picUrl)) {
    } else {
      card.picUrl = card.linkUrl;
    }
  } else {
    card.picUrl = card.linkUrl;
  }

  //s 防止链接为空的操作
  if (isEmpty(card.linkUrl, true) && !isEmpty(card.picUrl, true)) {
    card.linkUrl = card.picUrl;
  }

  //! 名称处理
  if (rule.name.enable) {
    //s 结果修正部分
    if (!isEmpty(card.name)) {
    } else {
      card.name = card.linkUrl;
    }
  } else {
    card.name = card.linkUrl;
  }
  if (isPath(card.name)) {
    card.name = getNameByUrl(card.name);
  }
  //? 去除尾部斜杠“/”
  card.name = card.name.replace(/(\/)$/, "");
  //s 名称修正
  card.name = getNameByUrl(card.name);

  //! 元信息获取
  if (rule.meta.enable) {
    if (rule.meta.origin == 0) {
      //? 指定“其他”dom
      if (card.metaDom) {
      }
    } else if (rule.meta.origin == 1) {
      //? 使用“链接”dom
      if (card.linkUrlDom) {
        await getMeta(card.linkUrlDom, card.linkUrl, card, rule.meta.getMethod, "linkBlob");
      }
    } else if (rule.meta.origin == 2) {
      //? 使用“图链”dom
      if (card.picUrlDom) {
        await getMeta(card.picUrlDom, card.picUrl, card, rule.meta.getMethod, "picBlob");
      }
    } else if (rule.meta.origin == 3) {
      //? 使用“名称”dom
      if (card.nameDom) {
        await getMeta(card.nameDom, card.name, card, rule.meta.getMethod, "nameBlob");
      }
    }
  }

  //! 匹配判断
  if (card.meta.isOk && (!isEmpty(card.linkUrl) || !isEmpty(card.picUrl))) {
    card.match = card.meta.isOk;
    card.meta.aspectRatio = card.meta.width / card.meta.height;
  }

  return card;
}

//f 获取Meta
async function getMeta(
  dom: HTMLElement | null | undefined,
  url: string,
  card: matchCard,
  getMetaMethod: 0 | 1 | 2 | 3,
  blobType: "linkBlob" | "picBlob" | "nameBlob"
) {
  if (!dom) return;
  if (getMetaMethod === 0) {
    //s 自动方式
    if (dom.tagName === "IMG") {
      //? "通过natural宽高"获取
      const {naturalWidth, naturalHeight} = dom as HTMLImageElement;
      if (naturalWidth > 1 && naturalHeight > 1) {
        card.meta.width = naturalWidth;
        card.meta.height = naturalHeight;
        card.meta.isOk = true;
      } else {
        //? 如果标签不匹配则"通过Image对象"获取
        card.meta = await getImgMetaByImage(url);
      }

      if (!card.meta.isOk && card.meta.width > 1 && card.meta.height > 1) {
        //? 最后尝试使用blob获取
        let blob = await getBlobByUrlAuto(url);
        if (blob) {
          if (blob_regex.isImg.test((blob as Blob).type)) {
            console.log("通过blob获取meta");
            card.meta = await getImgMetaByBlob(blob as Blob);
          }
        }
        //s 完成后消除blob
        blob = null;
      }
    } else {
      //? 如果不是img标签直接使用
      let blob = await getBlobByUrlAuto(url);
      if (blob) {
        if (blob_regex.isImg.test((blob as Blob).type)) {
          console.log("通过blob获取meta");
          card.meta = await getImgMetaByBlob(blob as Blob);
        }
      }
      //s 完成后消除blob
      blob = null;
    }
  } else if (getMetaMethod === 1) {
    const {naturalWidth, naturalHeight} = dom as HTMLImageElement;
    //s 通过natural宽高
    if (naturalWidth > 0 && naturalHeight > 0) {
      card.meta.width = naturalWidth;
      card.meta.height = naturalHeight;
      card.meta.isOk = true;
    }
  } else if (getMetaMethod === 2) {
    //s 通过Image对象
    card.meta = await getImgMetaByImage(url);
  } else if (getMetaMethod === 3) {
    //s 直接通过blob获取
    let blob = await getBlobByUrlAuto(url);
    if (blob) {
      if (blob_regex.isImg.test((blob as Blob).type)) {
        console.log("通过blob获取meta");
        card.meta = await getImgMetaByBlob(blob as Blob);
      }
    }
    //s 完成后消除blob
    blob = null;
  }
}

/**
 * f 获取dom
 * @param startDom 起始dom
 * @param method 方法
 * - 0:css选择器
 * - 1:xpath方法
 * @param selector 选择器
 * @param mode 模式
 * - 0:所有符合条件的
 * - 1:首个符合条件的
 * @returns 匹配到的dom
 */
export async function getDom(
  startDom: Document | HTMLElement | null | undefined,
  method: 0 | 1,
  selector: string,
  mode: 0 | 1 = 0
) {
  let selectorList: string[] = [];
  if (/\|/.test(selector)) {
    selectorList = selector.split("|");
  } else {
    selectorList = [selector];
  }

  // console.log(selectorList);

  startDom = startDom || document;
  let resultDomList: HTMLElement[] = [];
  if (method == 0) {
    for (const selectorItem of selectorList) {
      // console.log(
      // 	selectorItem,
      // 	startDom,
      // 	`是否为空? -> ${isEmpty(selectorItem)}`,
      // 	startDom.querySelectorAll(selectorItem)
      // );
      if (isEmpty(selectorItem)) {
        continue;
      }
      let tempDomList: HTMLElement[] = [];
      try {
        tempDomList = [...startDom.querySelectorAll(selectorItem)] as HTMLElement[];
      } catch (err) {
        console.log("方法getDom出错!(css选择器模式)");
      }
      resultDomList.push(...tempDomList);
      // console.log(resultDomList);
    }
  } else if (method == 1) {
    for (const selectorItem of selectorList) {
      if (isEmpty(selectorItem)) {
        continue;
      }
      let tempDomList: HTMLElement[] = [];
      try {
        tempDomList = getDomByXpath(startDom as HTMLElement, selectorItem);
      } catch (err) {
        console.log("方法getDom出错!(xpath模式)");
      }
      resultDomList.push(...tempDomList);
    }
  }
  resultDomList = resultDomList.filter((dom) => dom); //s 过滤空dom
  // console.log(resultDomList);

  if (mode == 0) {
    //s 所有符合条件的
    return resultDomList;
  } else {
    //s 首个符合条件的
    if (resultDomList.length > 0) {
      return resultDomList[0];
    } else {
      return null;
    }
  }
}

/**
 * f 通过xpath获取dom
 * @param startDom 起始dom
 * @param xpath xpath路径
 * @returns 获取到的dom元素
 */
function getDomByXpath(startDom: Document | HTMLElement, xpath: string): HTMLElement[] {
  const result: HTMLElement[] = [];
  const xpathResult = document.evaluate(xpath, startDom, null, 5, null);
  let resultItem: Node | null;
  while ((resultItem = xpathResult.iterateNext())) {
    result.push(resultItem as HTMLElement);
  }
  return result;
}

/**
 * f 获取dom标签的相关内容
 * @param dom 要提取的dom元素
 * @param type 提取类型:
 * 	* 1 - 值
 * 	* 2 - Attribute属性
 * 	* 3 - Property属性
 * 	* 4 - innerText内部文本
 * 	* 5 - innerHTML
 * 	* 6 - outerHTML
 * @param attr 属性名
 */
export async function getTagInfo(
  dom: HTMLElement | null,
  type: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  attr: string
) {
  if (type === 0) {
    return "";
  }
  let attrList: string[] = [];
  if (/\|/.test(attr)) {
    attrList = attr.split("|");
  } else {
    attrList = [attr];
  }
  let result: string = "";

  if (dom == null) {
    return result;
  }

  if (type == 1) {
    //s 提取 值(value)
    result = dom["value"] || "";
  } else if (type == 2) {
    //s 提取 Attribute属性
    for (let i = 0; i < attrList.length; i++) {
      const attr = attrList[i];
      let temp = dom.getAttribute(attr);
      //s 判空操作
      if (!isEmpty(temp)) {
        if (attr == "srcset") {
          //s srcset属性信息的处理方式
          temp = getSrcsetMaximumValue(<string>temp);
        }
        result = temp || "";
        break;
      }
    }
  } else if (type == 3) {
    //s 提取 Property属性
    result = "";
    for (let i = 0; i < attrList.length; i++) {
      const attr = attrList[i];
      let temp = dom[attr];
      //s 判空操作
      if (!isEmpty(temp)) {
        if (attr == "srcset") {
          //s srcset属性信息的处理方式
          temp = getSrcsetMaximumValue(temp);
        }
        result = temp;
        break;
      }
    }
  } else if (type == 4) {
    //s 提取 innerText内部文本
    let a = document.createElement("div");

    result = dom.innerText;
  } else if (type == 5) {
    //s 提取 innerHTML
    result = dom.innerHTML;
  } else if (type == 6) {
    //s 提取 outerHTML
    result = dom.outerHTML;
  }
  if (isUrl(result)) {
    result = urlCompletion(result);
  }
  return result;
}

//f [功能封装]判断字符串是否是一个路径
export function isUrl(str: string) {
  var v = /^(\/|(.\/)).+?$/i;
  return v.test(str);
}

export function isPath(str: string) {
  return /\//i.test(str);
}

//f [功能封装] 获取srcset内容最大值
export function getSrcsetMaximumValue(srcsetString: string) {
  let result = srcsetString;
  if (/\d+(w|x)/.test(srcsetString)) {
    let dataList = srcsetString
      .split(/\, */)
      .filter((item) => !isEmpty(item, true))
      .map((item) => {
        const itemDataInfos = item.split(" ");
        if (itemDataInfos.length == 2) {
          return {
            url: itemDataInfos[0],
            resolution: Number(itemDataInfos[1].split(/w|W/)[0]),
          };
        } else {
          return {
            url: itemDataInfos[0],
            resolution: 0,
          };
        }
      });
    // console.log(dataList);
    let maxItem = dataList[0];
    dataList.forEach((item) => {
      if (maxItem.resolution < item.resolution) {
        maxItem = item;
      }
    }); //s选区最大尺寸的链接
    result = maxItem.url;
  }
  return result;
}

//f [功能封装]url路径补全
export function urlCompletion(url: string): string {
  const v1 = /^\/[^\/].*$/i;
  const v2 = /^\/\/.*$/i;
  if (v1.test(url)) {
    return window.document.location.origin + url;
  }
  if (v2.test(url)) {
    return window.document.location.protocol + url;
  }
  return url;
}

//f [功能封装]用指定内容填充数组到指定长度(已有数据保持不变)
function fillArrayToTargetLength(input_array: any[] = [], length: number, content: any) {
  const output_array = Array.from(input_array);
  for (let i = 0; i < length; i++) {
    if (output_array[i] == null) {
      output_array.push(content);
    }
  }
  return output_array;
}

//f 字符串混合排序
export function mixSort(_a: string, _b: string) {
  const reg = /[a-zA-Z0-9]/;
  // 比对仅针对字符串，数字参与对比会导致对比的字符串转为number类型，变成NaN
  const a = _a.toString();
  const b = _b.toString();
  // 比对0号位的原因是字符串中有可能出现中英文混合的情况，这种仅按首位排序即可
  if (reg.test(a[0]) || reg.test(b[0])) {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  } else {
    return a.localeCompare(b);
  }
}

//f 通过blob获取文件的ext扩展名
export function getExtByBlob(blob: Blob | null) {
  let ext = "";
  if (blob) {
    let match = /(?<=\/).+$/.exec(blob.type);
    ext = match?.at(0) || "";
    if (!isEmpty(ext)) {
      ext = ext === "jpeg" ? "jpg" : ext;
    }
  }
  blob = null;
  return ext;
}

//f 文本填充
export function strAutofill(
  str: string,
  fillContent: string | number,
  fill_length: number,
  direction: "prefix" | "suffix" = "prefix"
): string {
  if (direction === "prefix") {
    return str.padStart(fill_length, fillContent.toString());
  } else {
    return str.padEnd(fill_length, fillContent.toString());
  }
}

//f 判断是否是移动端设备
export function isMobile(): boolean {
  let sUserAgent = navigator.userAgent.toLowerCase();
  let regex = /ipad|iphone os|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/i;
  return regex.test(sUserAgent);
}

//f 链接类型判断
export function getUrlType(url: string): "image" | "video" | "html" {
  let urlType: "image" | "video" | "html" = "html";
  const isImg = /\.(jpg|jpeg|png|gif|webp|bmp|icon|svg)$/i;
  const isVideo = /\.(mp4|avi|mov|mkv|mpeg|mpg|wmv|3gp|flv|f4v|rmvb|webm|ts|webp|ogv)$/i;

  if (isImg.test(url)) {
    urlType = "image";
  } else if (isVideo.test(url)) {
    urlType = "video";
  }

  return urlType;
}

//f blob类型判断
export function getBlobType(blob: Blob | null): "image" | "video" | "html" | "audio" {
  if (!blob) {
    return "html";
  }
  let blobType: "image" | "video" | "html" | "audio" = "html";
  if (blob_regex.isImg.test(blob.type)) {
    blobType = "image";
  } else if (blob_regex.isVideo.test(blob.type)) {
    blobType = "video";
  } else if (blob_regex.isAudio.test(blob.type)) {
    blobType = "audio";
  } else {
    blobType = "html";
  }

  return blobType;
}

//f 通过链接"推测"链接类型
export function guessUrlType(url: string): "image" | "video" | "html" {
  let urlType: "image" | "video" | "html" = "html";
  const isImg = /(jpg|jpeg|png|gif|webp|bmp|icon|svg)/i;
  const isVideo = /(mp4|avi|mov|mkv|mpeg|mpg|wmv|3gp|flv|f4v|rmvb|webm|ts|webp|ogv)/i;
  if (isImg.test(url)) {
    urlType = "image";
  } else if (isVideo.test(url)) {
    urlType = "video";
  }
  return urlType;
}

//f 获取剪切板文本
export async function getClipBoardText(): Promise<string> {
  const text = await navigator.clipboard
    .readText()
    .then((res) => res)
    .catch(() => "");
  return text;
}

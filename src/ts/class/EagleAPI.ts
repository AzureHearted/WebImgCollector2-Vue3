export class EagleAPI {
  //s Eagle API Token
  private TOKEN = "";
  //s Eagle API 服务器位置
  private EAGLE_SERVER_URL = "http://localhost:41595";
  private EAGLE_SERVER_API_URL = `${this.EAGLE_SERVER_URL}/api`;
  private EAGLE_APP_INFO_URL = `${this.EAGLE_SERVER_URL}/api/application/info`;
  private EAGLE_LIBRARY_INFO_URL = `${this.EAGLE_SERVER_URL}/api/library/info`;
  private EAGLE_IMPORT_API_URL = `${this.EAGLE_SERVER_URL}/api/item/addFromURL`;
  private EAGLE_IMPORT_API_URLS = `${this.EAGLE_SERVER_URL}/api/item/addFromURLs`;
	private EAGLE_IMPORT_API_BOOKMARK = `${this.EAGLE_SERVER_URL}/api/item/addBookmark`;
  private EAGLE_CREATE_FOLDER_API_URL = `${this.EAGLE_SERVER_URL}/api/folder/create`;
  private EAGLE_UPDATE_FOLDER_API_URL = `${this.EAGLE_SERVER_URL}/api/folder/update`;
  private EAGLE_GET_FOLDERS_API_URL = `${this.EAGLE_SERVER_URL}/api/folder/list`;
  private EAGLE_GET_ITEMS_API_URL = `${this.EAGLE_SERVER_URL}/api/item/list`;
  private EAGLE_GET_ITEM_THUMBNAIL_API_URL = `${this.EAGLE_SERVER_URL}/api/item/thumbnail`;

  private ENV: "development" | "production" = "production";

  public onlineStatus: boolean;

  constructor(token: string = "", dev_mod?: boolean) {
    //s 运行环境判断
    if (dev_mod) {
      this.TOKEN = token;
      this.ENV = "development";
    } else {
      this.ENV = "production";
    }

    //s 对象一经实例化就进行eagle在线状态判断
    this.onlineStatus = false;
    this.queryAppIsOnline().then((isOnline) => {
      this.onlineStatus = isOnline;
    });
  }

  //f 判断eagle应用是否在线
  public async queryAppIsOnline(): Promise<boolean> {
    return this.getApplicationInfo() !== null;
  }

  //f 发送请求 - 获取eagle应用版本信息
  public async getApplicationInfo(): Promise<IEagleAppInfo | null> {
    let response: IResponse;
    if (this.ENV === "development") {
      //s 开发环境
      response = await fetch(`${this.EAGLE_APP_INFO_URL}?token=${this.TOKEN}`)
        .then((res) => res.json())
        .catch((error) => console.log("error", error));
    } else {
      //s 生产环境下
      response = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          url: this.EAGLE_APP_INFO_URL,
          method: "GET",
          responseType: "json",
          onload: (res) => {
            console.log(res.response);
            resolve(res.response);
          },
        });
      });
    }
    if (this.requestIsSuccessful(response)) {
      return response.data as IEagleAppInfo;
    } else {
      return null;
    }
  }

  //f 发送请求 - 获取资源库信息
  public async getLibraryInfo(): Promise<IEagleLibraryData | null> {
    let response: IResponse;
    if (this.ENV === "development") {
      //s 开发环境
      let requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      response = await fetch(
        `${this.EAGLE_LIBRARY_INFO_URL}?token=${this.TOKEN}`,
        requestOptions as RequestInit
      )
        .then((res) => res.json())
        .catch((error) => console.log("error", error));
    } else {
      //s 生产环境下
      response = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          url: this.EAGLE_LIBRARY_INFO_URL,
          method: "GET",
          responseType: "json",
          onload: (res) => {
            // console.log(res.response);
            resolve(res.response);
          },
        });
      });
    }
    if (this.requestIsSuccessful(response)) {
      return response.data as IEagleLibraryData;
    } else {
      return null;
    }
  }

  //f 发送请求 - 创建文件夹
  public async createFolder(folderName: string): Promise<IResponse> {
    let response: IResponse;
    //? 请求信息
    const data = {
      folderName: folderName,
      token: <string | null>null,
    };

    if (this.ENV === "development") {
      //s 开发环境
      let requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      };
      response = await fetch(this.EAGLE_CREATE_FOLDER_API_URL, requestOptions as RequestInit)
        .then((res) => res.json())
        .catch((error) => console.log("error", error));
    } else {
      //s 生产环境下
      response = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          url: this.EAGLE_CREATE_FOLDER_API_URL,
          method: "POST",
          data: JSON.stringify(data),
          responseType: "json",
          onload: (res) => {
            // console.log(res.response);
            resolve(res.response);
          },
        });
      });
    }
    return response;
  }

  //f 发送请求 - 从链接添加内容到指定文件夹
  public async addFromURL(addItems: addUrl_item[] = [], folderId?: string): Promise<boolean> {
    let response: IResponse;
    //? 请求信息
    const data = {
      items: addItems,
      folderId: folderId,
      token: <string | null>null,
    };
    if (this.ENV === "development") {
      data.token = this.TOKEN;
      //s 开发环境
      let requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      };
      response = await fetch(this.EAGLE_IMPORT_API_URLS, requestOptions as RequestInit)
        .then((res) => res.json())
        .catch((error) => console.log("error", error));
    } else {
      //s 生产环境下
      response = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          url: this.EAGLE_IMPORT_API_URLS,
          method: "GET",
          data: JSON.stringify(data),
          responseType: "json",
          onload: (res) => {
            resolve(res.response);
          },
        });
      });
    }
    if (this.requestIsSuccessful(response)) {
      return true;
    } else {
      return false;
    }
  }

  //f 发送请求 - 添加网页书签
  public async addBookmarkOnce(addItems: addBookMark_item, folderId?: string): Promise<boolean> {
    let response: IResponse;
    //? 请求信息
    const data = {
      ...addItems,
      folderId,
      token: <string | null>null,
    };
    if (this.ENV === "development") {
      data.token = this.TOKEN;
      //s 开发环境
      let requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      };
      response = await fetch(this.EAGLE_IMPORT_API_BOOKMARK, requestOptions as RequestInit)
        .then((res) => res.json())
        .catch((error) => console.log("error", error));
    } else {
      //s 生产环境下
      response = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          url: this.EAGLE_IMPORT_API_BOOKMARK,
          method: "GET",
          data: JSON.stringify(data),
          responseType: "json",
          onload: (res) => {
            resolve(res.response);
          },
        });
      });
    }
    if (this.requestIsSuccessful(response)) {
      return true;
    } else {
      return false;
    }
  }

  //f 发送请求 - 获取指定文件夹下项目
  public async getItemsByFolder(folderId: string[]): Promise<IEagleItem[] | null> {
    if (!folderId.length) {
      return null;
    }
    let response: IResponse;
    if (this.ENV === "development") {
      //s 开发环境
      let requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      let url = `${this.EAGLE_GET_ITEMS_API_URL}?token=${this.TOKEN}&folders=${folderId.join(",")}`;
      response = await fetch(url, requestOptions as RequestInit)
        .then((res) => res.json())
        .catch((error) => console.log("error", error));
    } else {
      //s 生产环境下
      response = await new Promise((resolve, reject) => {
        let url = `${this.EAGLE_GET_ITEMS_API_URL}?folders=${folderId.join(",")}`;

        GM_xmlhttpRequest({
          url: url,
          method: "GET",
          responseType: "json",
          onload: (res) => {
            // console.log(res.response);
            resolve(res.response);
          },
        });
      });
    }
    if (this.requestIsSuccessful(response)) {
      return response.data as IEagleItem[];
    } else {
      return null;
    }
  }

  //f 发送请求 - 获取指定Item的缩略图链接
  public async getItemThumbnailUrl(itemId: string): Promise<string | null> {
    let response: IResponse;
    if (this.ENV === "development") {
      //s 开发环境
      let requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      let url = `${this.EAGLE_GET_ITEM_THUMBNAIL_API_URL}?token=${this.TOKEN}&id==${itemId}`;
      response = await fetch(url, requestOptions as RequestInit)
        .then((res) => res.json())
        .catch((error) => console.log("error", error));
    } else {
      //s 生产环境下
      response = await new Promise((resolve, reject) => {
        let url = `${this.EAGLE_GET_ITEM_THUMBNAIL_API_URL}?id=${itemId}`;

        GM_xmlhttpRequest({
          url: url,
          method: "GET",
          responseType: "json",
          onload: (res) => {
            // console.log(res.response);
            resolve(res.response);
          },
        });
      });
    }
    if (this.requestIsSuccessful(response)) {
      return response.data as string;
    } else {
      return null;
    }
  }

  //f 判断请求是否成功
  public requestIsSuccessful(response: IResponse | null): boolean {
    if (response && response.status === "success") {
      return true;
    } else {
      return false;
    }
  }
}

//w 请求接口 - 单个item
export interface addUrl_item {
  url: string;
  name: string;
  annotation?: string;
  website?: string;
  tags?: string[];
  modificationTime: number;
  headers?: {
    referer?: string;
  };
}

//w 请求接口 - 书签item
export interface addBookMark_item {
  url: string;
  name: string;
  tags?: string[];
  base64?: string;
  modificationTime?: number;
}

//s eagle api 响应结果数据类型
export type IResponse = {
  status: string;
  data?: any;
  message?: string;
};

//f eagle 应用信息类型
export type IEagleAppInfo = {
  version: string;
  prereleaseVersion: any;
  buildVersion: string | number;
  platform: string;
};

//f eagle 库数据类型
export type IEagleLibraryData = {
  folders: IEagleFolder[];
  smartFolders: [];
  quickAccess: [];
  tagsGroups: [];
  modificationTime: number;
  applicationVersion: string;
  library: {
    path: string;
    name: string;
  };
};

//f eagle 文件夹(Folder)数据类型
export type IEagleFolder = {
  id: string;
  name: string;
  description: string;
  children: IEagleFolder[];
  modificationTime: number;
  tags: string[];
  images?: [];
  isExpand?: boolean;
  newFolderName: string;
  imageCount?: number;
  imagesMappings?: {};
  descendantImageCount?: number;
  pinyin?: string;
  extendTags?: [];
  icon?: string;
  iconColor?: string;
  password?: string;
  passwordTips?: string;
  coverId?: string;
  orderBy?: string;
  sortIncrease?: boolean;
};

//f eagle 创建返回的文件夹(Folder)数据类型
export type IEagleCreatedFolder = {
  id: string;
  name: string;
  images: [];
  folders: [];
  modificationTime: number;
  imagesMappings: {};
  tags: [];
  parent?: string;
  children: [];
  isExpand: boolean;
};

//f eagle 项目(Item)数据类型
export type IEagleItem = {
  id: string;
  name: string;
  size: number;
  ext: string;
  tags: string[];
  folders: string[];
  isDeleted: boolean;
  url: string;
  annotation: string;
  modificationTime: number;
  width: number;
  height: number;
  noThumbnail: boolean;
  lastModified: number;
  palettes: [];
  thumbnailUrl?: string;
  fileUrl?: string;
  thumbnailBlob?: Blob;
  fileBlob?: Blob;
};

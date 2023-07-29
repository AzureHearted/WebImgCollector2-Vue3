//f 卡片类型接口
interface matchCard {
	id?: string;
	name: string;
	linkUrl: string;
	picUrl: string;
	originUrls: string[];
	picUrlExt?: string;
	linkUrlExt?: string;
	meta: metaInterFace;
	metaOrigin: string; //* meta的链接来源
	match: boolean; //? 匹配标识符
	selected: boolean; //? 选中标识符
	linkBlob?: Blob | null; //* 链接对应的blob
	linkSize?: number; //* 链接对应的内容大小(字节)
	picBlob?: Blob | null; //* 图片对应的blob
	picSize?: number; //* 图链对应的内容大小(字节)
	dom?: HTMLElement | null; //* 限定匹配的dom元素
	linkUrlDom?: HTMLElement | null; //* 匹配到的linkUrl的dom元素
	picUrlDom?: HTMLElement | null; //* 匹配到的picUrl的dom元素
	nameDom?: HTMLElement | null; //* 匹配到的nameUrl的dom元素
	metaDom?: HTMLElement | null; //* 匹配到的metaUrl的dom元素
	linkUrlType?: "image" | "video" | "audio" | "html";
	picUrlType?: "image" | "video" | "audio" | "html";
	visible: boolean;
}

//f 临时card的接口
interface rowCard {
	id?: string;
	index?: number;
	name?: string;
	linkUrl?: string;
	picUrl?: string;
	originUrls?: string[];
	picUrlExt?: string;
	linkUrlExt?: string;
	meta?: metaInterFace;
	metaOrigin: string; //* meta的链接来源
	match?: boolean; //? 匹配标识符
	selected?: boolean; //? 选中标识符
	linkBlob?: Blob | null; //* 链接对应的blob
	picBlob?: Blob | null; //* 图片对应的blob
	dom?: HTMLElement | null; //* 限定匹配的dom元素
	linkUrlDom?: HTMLElement | null; //* 匹配到的linkUrl的dom元素
	picUrlDom?: HTMLElement | null; //* 匹配到的picUrl的dom元素
	nameDom?: HTMLElement | null; //* 匹配到的nameUrl的dom元素
	metaDom?: HTMLElement | null; //* 匹配到的metaUrl的dom元素
	linkUrlType?: string;
	picUrlType?: string;
	visible?: boolean;
}

//? 媒体信息类型
interface metaInterFace {
	isOk: boolean;
	width: number;
	height: number;
	aspectRatio?: number;
}

interface IBlob{
	size:number
	type:string
}
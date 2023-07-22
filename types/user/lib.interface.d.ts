//f 卡片类型接口
interface matchCard {
	id?: string;
	name: string;
	url: string;
	originUrls: string[];
	meta: metaInterFace;
	match?: boolean; //? 匹配标识符
	selected: boolean; //? 选中标识符
	dom: any; //* dom元素
	blob?: Blob; //* 卡片对应的blob
}

//? 媒体信息类型
interface metaInterFace {
	isOk?: boolean;
	width: number;
	height: number;
	aspectRatio?: number;
}

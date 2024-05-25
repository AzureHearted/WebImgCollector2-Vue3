import "vuetify/styles";
import "@/styles/vuetify/index.scss";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";

// 引入要使用的字体图标
import {
	mdiDotsVertical,
	mdiCloseCircle,
	mdiViewGallery,
	mdiBookCog,
} from "@mdi/js";

const vuetify = createVuetify({
	defaults: {
		global: {
			ripple: false, // vuetify的ripple组件有bug先默认关闭
		},
	},
	icons: {
		defaultSet: "mdi",
		aliases: {
			...aliases,
			// 字体图标设置全局别名
			dotsVertical: mdiDotsVertical,
			closeCircle: mdiCloseCircle,
			viewGallery: mdiViewGallery,
			bookCog: mdiBookCog,
		},
		sets: {
			mdi,
		},
	},
});

export default vuetify;

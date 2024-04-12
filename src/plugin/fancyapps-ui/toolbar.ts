import type {
	ToolbarOptionsType,
	ToolbarItemsType,
} from "@fancyapps/ui/types/Fancybox/plugins";
import type { Fancybox } from "@fancyapps/ui";
// import type { Fancybox } from "@fancyapps/ui/types";

type UserSlide = {
	src: string;
	thumbElSrc: string;
	downloadSrc: string;
	fancybox: string;
	thumbEl: HTMLElement;
	triggerEl: HTMLElement;
};

export default {
	// 要显示的工具
	display: {
		left: ["infobar"],
		right: ["toLocate", "open", "download", "thumbs", "fullscreen"],
	},
	// 自定义的按钮
	items: {
		// 打开按钮
		open: {
			tpl: /*html*/ `
      <button class="f-button" title="{{NEW_TAB_OPENS}}"><svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"></path></svg></button>
      `,
			// 点击事件定义
			click: (instance) => {
				const userSlides = (instance.instance as any).userSlides as UserSlide[];
				let index = 0;
				if (userSlides.length > 1) {
					index = Number(
						(
							(instance.instance as Fancybox).container?.querySelector(
								".is-nav-selected"
							) as HTMLElement
						)?.dataset.index
					);
				}
				const url = userSlides[index].src;
				window.open(url, "_blank");
			},
		},
		toLocate: {
			tpl: /*html*/ `
      <button class="f-button" title="{{TO_LOCATE}}">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path fill-rule="evenodd" clip-rule="evenodd" d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="#222222"/>
				<path d="M12 5V3" stroke="#222222" stroke-width="2" stroke-linecap="round"/>
				<path d="M19 12L21 12" stroke="#222222" stroke-width="2" stroke-linecap="round"/>
				<path d="M12 21L12 19" stroke="#222222" stroke-width="2" stroke-linecap="round"/>
				<path d="M3 12H5" stroke="#222222" stroke-width="2" stroke-linecap="round"/>
				</svg>
			</button>
      `,
			click(instance) {
				const userSlides = (instance.instance as any).userSlides as UserSlide[];
				let index = 0;
				if (userSlides.length > 1) {
					index = Number(
						(
							(instance.instance as Fancybox).container?.querySelector(
								".is-nav-selected"
							) as HTMLElement
						)?.dataset.index
					);
				}

				(instance.instance as Fancybox).close(); // 关闭当前图片，但不关闭弹窗。

				setTimeout(() => {
					(userSlides[index].thumbEl as HTMLElement).scrollIntoView({
						behavior: "smooth",
						block: "center",
						inline: "center",
					});
				}, 100);
			},
		},
	} as ToolbarItemsType,
} as ToolbarOptionsType;

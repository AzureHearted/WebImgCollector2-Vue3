interface Options {
	immediate: boolean;
}

const defaultOptions: Options = {
	immediate: false,
};

type EventTargetType = HTMLElement;

export function useDisableScroll(
	target: EventTargetType,
	options?: Partial<Options>
) {
	const { immediate } = { ...defaultOptions, ...options };
	if (immediate) disable();

	let initPos = { x: target.scrollLeft, y: target.scrollTop };

	function preventScroll(event: Event) {
		// event.preventDefault();
		requestAnimationFrame(() => {
			// console.log("正在阻止dom滚动", target.scrollTop, target.scrollLeft);
			target.scrollTo({
				left: initPos.x,
				top: initPos.y,
				behavior: "instant",
			});
		});
	}

	function disable() {
		initPos = { x: target.scrollLeft, y: target.scrollTop };
		console.log("开始阻止dom滚动", initPos);
		window.addEventListener("wheel", preventScroll, { passive: true });
		window.addEventListener("touchmove", preventScroll, { passive: true });
		window.addEventListener("scroll", preventScroll, { passive: false });
	}

	function enable() {
		console.log("停止阻止dom滚动");
		window.removeEventListener("wheel", preventScroll);
		window.removeEventListener("touchmove", preventScroll);
		window.removeEventListener("scroll", preventScroll);
	}

	return {
		start: disable,
		stop: enable,
	};
}

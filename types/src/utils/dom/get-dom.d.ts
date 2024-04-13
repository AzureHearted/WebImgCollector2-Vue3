type optionsType = {
    mode: "all" | "first" | "last";
    regionDOM: HTMLElement;
};
export default function getDOM(selector: keyof HTMLElementTagNameMap, options?: Partial<optionsType>): HTMLElement[] | HTMLElement | null;
export default function getDOM(selector: string, options?: Partial<optionsType>): HTMLElement[] | HTMLElement | null;
export {};

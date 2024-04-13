type matchType = "value" | "attribute" | "property" | "innerText" | "innerHTML" | "outerHTML";
export default function getDOMInfo(dom: HTMLElement, type: matchType, name: string): Promise<string>;
export {};

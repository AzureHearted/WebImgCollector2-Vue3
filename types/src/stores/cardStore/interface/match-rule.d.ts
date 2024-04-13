export interface MatchPattern {
    id: string;
    mainInfo: MainInfo;
    rules: MatchRule[];
}
export interface MainInfo {
    name: string;
    host: string;
    filter: Pick<Regex, "pattern" | "flags">;
    icon: string;
    titleSelector: string;
}
export interface MatchRule {
    region: MatchRegion;
    preview: MatchPreview;
    source: MatchSource;
    description: MatchDescription;
    filter: RuleFilter;
}
export interface BaseMatch {
    selector: string;
    infoType: "value" | "attribute" | "property" | "innerText" | "innerHTML" | "outerHTML";
    name: string;
}
export interface MatchRegion extends Pick<BaseMatch, "selector"> {
    enable: boolean;
}
export interface MatchSource extends BaseMatch {
}
export interface MatchPreview extends BaseMatch {
    enable: boolean;
    origin: "custom" | "region" | "source";
}
export interface MatchDescription extends BaseMatch {
    enable: boolean;
    origin: "custom" | "region" | "source";
}
interface Regex {
    pattern: string;
    replaceTo: string;
    flags: string[];
}
interface RuleFilter {
    formats: string[];
    width: [number, number];
    height: [number, number];
}
export {};

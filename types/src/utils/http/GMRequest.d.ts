interface IGMRequestOptions {
    method?: "GET" | "POST" | "HEAD";
    url: string;
    referer?: string;
    responseType?: keyof GmResponseTypeMap;
    data?: string;
}
interface GmResponseTypeMap {
    text: string;
    json: any;
    arraybuffer: ArrayBuffer;
    blob: Blob;
    document: Document;
    stream: ReadableStream<Uint8Array>;
}
export declare function GMRequest<ResponseType extends keyof GmResponseTypeMap>(options: IGMRequestOptions & {
    responseType: ResponseType;
}): Promise<GmResponseTypeMap[ResponseType] | null>;
export declare function GMRequest(options: Omit<IGMRequestOptions, "responseType"> & {
    responseType?: undefined;
}): Promise<any | null>;
export {};

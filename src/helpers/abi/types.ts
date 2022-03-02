export interface IAbiDecoder {
    addABI(data: object): void;
    decodeMethod(data: string): IAbiDecoderResult;
}

export interface IAbiDecoderResult {
    name: string;
    params: IAbiDecoderParam[];
}

export interface IAbiDecoderParam {
    name: string;
    value: string | string[];
    type: string;
}

import { JsonFragment, Fragment } from "@ethersproject/abi";

export interface IAbiDecoder {
    addABI(data: ReadonlyArray<Fragment | JsonFragment | string>): void;
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

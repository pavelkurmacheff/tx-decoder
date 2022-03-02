import {IAbiDecoder, IAbiDecoderParam, IAbiDecoderResult} from './types';

const abiDecoder: IAbiDecoder = require('abi-decoder');

function getAbiParam<T>(paramList: IAbiDecoderParam[], name: string): T {
    const param = paramList.find((p) => p.name === name);
    if (!param) {
        throw new Error(`param not found by name "${name}"`);
    }
    return param.value as any;
}

function getParam(r: IAbiDecoderResult, name: string): null | string | string[] {
    const params = r.params.filter(p => p.name == name);
    if (params.length == 0 || params.length > 1) {
        return null;
    }

    return params[0].value;
}

export {abiDecoder, getAbiParam, getParam};

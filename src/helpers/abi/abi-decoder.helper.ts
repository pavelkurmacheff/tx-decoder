import {IAbiDecoder, IAbiDecoderParam} from './types';

const abiDecoder: IAbiDecoder = require('abi-decoder');

function getAbiParam<T>(paramList: IAbiDecoderParam[], name: string): T {
    const param = paramList.find((p) => p.name === name);
    if (!param) {
        throw new Error(`param not found by name "${name}"`);
    }
    return param.value as any;
}

export {abiDecoder, getAbiParam};

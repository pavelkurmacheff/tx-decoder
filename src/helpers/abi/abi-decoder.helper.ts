import {IAbiDecoder, IAbiDecoderParam, IAbiDecoderResult} from './types';

const abiDecoder: IAbiDecoder = require('abi-decoder');

function getParam(
    r: IAbiDecoderResult,
    name: string
): null | string | string[] {
    const params = r.params.filter((p) => p.name == name);
    if (params.length == 0 || params.length > 1) {
        return null;
    }

    return params[0].value;
}

function getParamDescriptor(
    r: IAbiDecoderResult
): IAbiDecoderParam | undefined {
    return r.params.find((p) => p.name === 'data');
}

export {abiDecoder, getParam, getParamDescriptor};

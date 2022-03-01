import {IAbiDecoder, IAbiDecoderParam} from '../../../abi/iAbiDecoder';
import {BigNumber} from '@ethersproject/bignumber';
import {IOneInchLimitOrderFillTxData} from './types';

export function parseOneInchLimitOrderFillTxCallData(
    abiDecoder: IAbiDecoder,
    data: string
): IOneInchLimitOrderFillTxData {
    const methodData = abiDecoder.decodeMethod(data);

    return {
        name: methodData.name,
        params: {
            order: parseOrder(
                getParamValueByName<unknown>(methodData.params, 'order')
            ),
            makingAmount: BigNumber.from(
                getParamValueByName<string>(methodData.params, 'makingAmount')
            ),
            takingAmount: BigNumber.from(
                getParamValueByName<string>(methodData.params, 'takingAmount')
            ),
            thresholdAmount: BigNumber.from(
                getParamValueByName<string>(
                    methodData.params,
                    'thresholdAmount'
                )
            ),
        },
    };
}

function getParamValueByName<T>(
    paramList: IAbiDecoderParam[],
    name: string
): T {
    const param = paramList.find((p) => p.name === name);
    if (!param) {
        throw new Error(`param not found by name "${name}"`);
    }
    return param.value as any;
}

function parseOrder(data: any): {
    maker: string;
    makerAsset: string;
    takerAsset: string;
} {
    return {
        maker: data['maker'],
        makerAsset: data['makerAsset'],
        takerAsset: data['takerAsset'],
    };
}

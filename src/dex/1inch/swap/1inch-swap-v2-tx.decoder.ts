import {TransactionType} from '../../../core/transaction-type';
import {DecodeResult} from '../../../core/decoder';
import {TransactionRaw} from '../../../core/transaction-raw';
import {abiDecoder, getParam} from '../../../helpers/abi/abi-decoder.helper';
import oneInchRouterV4Abi from './ONEINCH_ROUTER_V4.json';
import {IAbiDecoderResult} from '../../../helpers/abi/types';
import {
    SwapExactInputTx,
    SwapThroughPoolPayload,
} from '../../../core/transaction-parsed/swap-payload';

abiDecoder.addABI(oneInchRouterV4Abi);

export function decode1InchSwapV4(
    contractAddr: string,
    rawTx: TransactionRaw
): DecodeResult {
    if (contractAddr.toUpperCase() != rawTx.to.toUpperCase()) {
        return {tag: 'AnotherContract'};
    }

    const methodData = abiDecoder.decodeMethod(rawTx.data);

    switch (methodData.name) {
        case 'clipperSwapTo':
        case 'clipperSwap': {
            return parseClipperSwap(rawTx, methodData);
        }
        case 'unoswap': {
            return parseUnoswap(rawTx, methodData);
        }
        default:
            return {tag: 'NotSupported', funcName: methodData.name};
    }
}

function parseClipperSwap(
    rawTx: TransactionRaw,
    data: IAbiDecoderResult
): DecodeResult {
    const payload: SwapExactInputTx = {
        srcTokenAddress: getParam(data, 'srcToken') as string,
        dstTokenAddress: getParam(data, 'dstToken') as string,
        srcAmount: getParam(data, 'amount') as string,
        minDstAmount: getParam(data, 'minReturn') as string,
    };

    return {
        tag: 'Success',
        tx: {
            raw: rawTx,
            tag: TransactionType.SwapExactInput,
            payload,
        },
    };
}

function parseUnoswap(
    rawTx: TransactionRaw,
    data: IAbiDecoderResult
): DecodeResult {
    const payload: SwapThroughPoolPayload = {
        srcTokenAddress: getParam(data, 'srcToken') as string,
        srcAmount: getParam(data, 'amount') as string,
        minDstAmount: getParam(data, 'minReturn') as string,
        poolAddressess: getParam(data, 'pools') as string[],
    };

    return {
        tag: 'Success',
        tx: {
            raw: rawTx,
            tag: TransactionType.SwapThroughPool,
            payload,
        },
    };
}

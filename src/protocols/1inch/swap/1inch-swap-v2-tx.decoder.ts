import {TransactionType} from '../../../core/transaction-type';
import {DecodeResult} from '../../../core/decoder';
import {TransactionRaw} from '../../../core/transaction-raw';
import {abiDecoder, getParam} from '../../../helpers/abi/abi-decoder.helper';
import oneInchRouterV4Abi from './ONEINCH_ROUTER_V4.json';
import {IAbiDecoderResult} from '../../../helpers/abi/types';
import {SwapExactInputPayload} from '../../../core/transaction-parsed/swap-payload';
import PoolService from 'src/protocols/1inch/pools/pool.service';

abiDecoder.addABI(oneInchRouterV4Abi);

export async function decode1InchSwapV4(
    poolSvc: PoolService,
    contractAddr: string,
    rawTx: TransactionRaw
): Promise<DecodeResult> {
    if (contractAddr.toUpperCase() != rawTx.to.toUpperCase()) {
        return {tag: 'AnotherContract'};
    }

    const methodData = abiDecoder.decodeMethod(rawTx.data);

    switch (methodData.name) {
        case 'clipperSwapToWithPermit':
        case 'clipperSwapTo':
        case 'clipperSwap': {
            return parseClipperSwap(rawTx, methodData);
        }
        case 'uniswapV3SwapToWithPermit':
        case 'unoswapWithPermit':
        case 'unoswap': {
            return parseUnoswap(poolSvc, rawTx, methodData);
        }
        case 'swap': {
            return parseSwap(rawTx, methodData);
        }
        case 'uniswapV3Swap': {
            return parseUniswapV3Swap(poolSvc, rawTx, methodData);
        }

        default:
            return {tag: 'NotSupported', funcName: methodData.name};
    }
}

function parseClipperSwap(
    rawTx: TransactionRaw,
    data: IAbiDecoderResult
): DecodeResult {
    const payload: SwapExactInputPayload = {
        srcTokenAddress: getParam(data, 'srcToken') as string,
        dstTokenAddress: getParam(data, 'dstToken') as string,
        srcAmount: getParam(data, 'amount') as string,
        minDstAmount: getParam(data, 'minReturn') as string,
    };

    return {
        tag: 'Success',
        tx: {
            
            tag: TransactionType.SwapExactInput,
            functionInfo: {
                name: data.name,
                hash: rawTx.data.slice(0, 10).toLowerCase(),
                params: data.params,
                abi: oneInchRouterV4Abi,
                responseParser: (r: any) => r.returnAmount,
            },
            raw: rawTx,
            payload,
        },
    };
}

async function parseUnoswap(
    poolSvc: PoolService,
    rawTx: TransactionRaw,
    data: IAbiDecoderResult
): Promise<DecodeResult> {
    const srcTokenAddress = getParam(data, 'srcToken') as string;
    const srcAmount = getParam(data, 'amount') as string;
    const minDstAmount = getParam(data, 'minReturn') as string;
    const pools = getParam(data, 'pools') as string[];

    const dstTokenAddress = await poolSvc.getDestTokenAddress(pools[pools.length - 1])

    const payload: SwapExactInputPayload = {
        srcTokenAddress,
        dstTokenAddress,
        srcAmount,
        minDstAmount,
    };

    return {
        tag: 'Success',
        tx: {
            tag: TransactionType.SwapExactInput,
            functionInfo: {
                name: data.name,
                hash: rawTx.data.slice(0, 10).toLowerCase(),
                params: data.params,
                abi: oneInchRouterV4Abi,
                responseParser: (r: any) => r.returnAmount,
            },
            raw: rawTx,
            payload,
        },
    };
}

function parseSwap(
    rawTx: TransactionRaw,
    data: IAbiDecoderResult
): DecodeResult {
    const descData = getParam(data, 'desc') as any;

    const payload: SwapExactInputPayload = {
        srcTokenAddress: descData['srcToken'] as string,
        dstTokenAddress: descData['dstToken'] as string,
        srcAmount: descData['amount'] as string,
        minDstAmount: descData['minReturnAmount'] as string,
    };

    return {
        tag: 'Success',
        tx: {
            tag: TransactionType.SwapExactInput,
            functionInfo: {
                name: data.name,
                hash: rawTx.data.slice(0, 10).toLowerCase(),
                params: data.params,
                abi: oneInchRouterV4Abi,
                responseParser: (r: any) => r.returnAmount,
            },
            raw: rawTx,
            payload,
        },
    };
}

async function parseUniswapV3Swap(
    poolSvc: PoolService,
    rawTx: TransactionRaw,
    data: IAbiDecoderResult
): Promise<DecodeResult> {
    const srcAmount = getParam(data, 'amount') as string;
    const minDstAmount = getParam(data, 'minReturn') as string;
    const poolAddressess = getParam(data, 'pools') as string[];

    const [srcTokenAddress, dstTokenAddress] = await poolSvc.getBothTokenAddress(
        poolAddressess
    );

    const payload: SwapExactInputPayload = {
        srcTokenAddress,
        dstTokenAddress,
        srcAmount,
        minDstAmount,
    };

    return {
        tag: 'Success',
        tx: {
            tag: TransactionType.SwapExactInput,
            functionInfo: {
                name: data.name,
                hash: rawTx.data.slice(0, 10).toLowerCase(),
                params: data.params,
                abi: oneInchRouterV4Abi,
                responseParser: (r: any) => r.returnAmount,  
            },
            raw: rawTx,
            payload,
        },
    };
}

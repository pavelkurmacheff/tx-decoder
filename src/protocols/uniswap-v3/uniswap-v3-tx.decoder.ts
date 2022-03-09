import { TransactionRaw } from '../../core/transaction-raw';
import { DecodeResult } from '../../core/decoder';
import UniswapRouterV2BI from './UNI3_ROUTER_V2.json';
import { abiDecoder, getParamDescriptor } from '../../helpers/abi/abi-decoder.helper';
import { IAbiDecoderResult } from '../../helpers/abi/types';
import { TransactionType } from '../../core/transaction-type';
import { MulticallPayload } from '../../core/transaction-parsed/transaction-parsed';

abiDecoder.addABI(UniswapRouterV2BI);

export function decodeUniV3(contractAddr: string, tx: TransactionRaw): DecodeResult {
    if (contractAddr.toUpperCase() != tx.to.toUpperCase()) {
        return { tag: 'AnotherContract' };
    }
    
    const rootFunc: IAbiDecoderResult = abiDecoder.decodeMethod(tx.data);
    const functionInfo = {
        name: rootFunc.name,
        hash: tx.data.slice(0, 10).toLowerCase(),
        params: rootFunc.params,
        abi: UniswapRouterV2BI,
    };

    if (rootFunc.name === 'multicall') {
        const data = getParamDescriptor(rootFunc, 'data');
        if(!data || data.type !== 'bytes[]') {
            return { tag: 'WrongContractCall' };
        }

        const calls: string[] = data.value as string[];
        const decodedTxs: [IAbiDecoderResult, string][] = 
            calls.map(c => [abiDecoder.decodeMethod(c), c.slice(0, 10).toLowerCase()]);
        const innerResults = decodedTxs.map(([d, sig]) => decodeSimpleCall(d, sig));
        const multicallPayload: MulticallPayload = innerResults.map(i => {
            switch(i.tag) {
                case 'Success': 
                    return i.tx;
                default: 
                    return {tag: 'Error', code: i.tag, data: i};
            }
        })
        
        return {
            tag: 'Success',
            tx: {
                tag: TransactionType.Multicall,
                functionInfo,
                raw: tx,
                payload: multicallPayload,
            }
        }


    } else {
        // TODO: Is it possible to use plain UniV3 functions without multicall?
        return { tag: 'WrongContractCall' };
    }
}

function decodeSimpleCall(data: IAbiDecoderResult, sig: string): DecodeResult {
    switch (data.name) {
        case 'swapTokensForExactTokens':
            return normalizeSwapTokensForExactTokens(data, sig);
        case 'swapExactTokensForTokens':
            return normalizeSwapExactTokensForTokens(data, sig);
        case 'exactInputSingle':
            return normalizeExactInputSingle(data, sig);
        case 'exactOutputSingle':
            return normalizeExactOutputSingle(data, sig);
        case 'unwrapWETH9':
            return normailzeUnwrapWETH9(data, sig);
        case 'selfPermitAllowed':
            return normalizeSelfPermitAllowed(data, sig);
        case 'selfPermit':
            return normalizeSelfPermitAllowed(data, sig);
        default:
            return { tag: 'NotSupported', funcName: data.name }
    }
}

function normalizeSwapExactTokensForTokens(data: IAbiDecoderResult, sig: string): DecodeResult {
    if (data.params && data.params.length > 3
        && data.params[2].value.length == 2) {

        return { 
            tag: 'Success', 
            tx: { 
                tag: TransactionType.SwapExactInput, 
                raw: (undefined as unknown) as TransactionRaw,
                functionInfo: {
                    name: data.name,
                    hash: sig,
                    params: data.params,
                    abi: UniswapRouterV2BI,
                },
                payload: {
                    srcTokenAddress: data.params[2].value[0],
                    dstTokenAddress: data.params[2].value[1],
                    srcAmount: data.params[0].value as string,
                    minDstAmount: data.params[1].value as string,
                } 
            } 
        };
    }
    return { tag: 'WrongContractCall' };
}

function normalizeSwapTokensForExactTokens(data: IAbiDecoderResult, sig: string): DecodeResult {
    if (data.params && data.params.length > 3
        && data.params[2].value.length == 2) {
        return {
            tag: 'Success', 
            tx: { 
                tag: TransactionType.SwapExactOutput, 
                raw: (undefined as unknown) as TransactionRaw,
                functionInfo: {
                    name: data.name,
                    hash: sig,
                    params: data.params,
                    abi: UniswapRouterV2BI,
                },
                payload: {
                    srcTokenAddress: data.params[2].value[0],
                    dstTokenAddress: data.params[2].value[1],
                    dstAmount: data.params[0].value as string,
                    maxSrcAmount: data.params[1].value as string,
                } 
            } 
        };
    }

    return { tag: 'WrongContractCall' };
}

function normailzeUnwrapWETH9(data: IAbiDecoderResult, sig: string): DecodeResult {
    if (data.params && data.params.length > 1) {
        return {
            tag: 'Success',
            tx: {
                tag: TransactionType.Unwrap,
                raw: (undefined as unknown) as TransactionRaw,
                functionInfo: {
                    name: data.name,
                    hash: sig,
                    params: data.params,
                    abi: UniswapRouterV2BI,
                },
                // TODO: Add parameters to Unwrap tx payload
                // minReturnAmount: BigNumber.from(data.params[0].value),
                // recipient: data.params[1].value as string,
            },
        };
    }

    return { tag: 'WrongContractCall' };
}

function normalizeExactInputSingle(data: IAbiDecoderResult, sig: string): DecodeResult {
    if (data.params && data.params.length == 1 && data.params[0].value.length == 7) {
        
        return { 
            tag: 'Success', 
            tx: { 
                tag: TransactionType.SwapExactInput, 
                raw: (undefined as unknown) as TransactionRaw,
                functionInfo: {
                    name: data.name,
                    hash: sig,
                    params: data.params,
                    abi: UniswapRouterV2BI,
                },
                payload: {
                    srcTokenAddress: data.params[0].value[0],
                    dstTokenAddress: data.params[0].value[1],
                    srcAmount: data.params[0].value[4],
                    minDstAmount: data.params[0].value[5],
                } 
            } 
        };
    }

    return { tag: 'WrongContractCall' };
}

function normalizeExactOutputSingle(data: IAbiDecoderResult, sig: string): DecodeResult {
    if (data.params && data.params.length == 1 && data.params[0].value.length == 7) {
        return {
            tag: 'Success', 
            tx: { 
                tag: TransactionType.SwapExactOutput, 
                raw: (undefined as unknown) as TransactionRaw,
                functionInfo: {
                    name: data.name,
                    hash: sig,
                    params: data.params,
                    abi: UniswapRouterV2BI,
                },
                payload: {
                    srcTokenAddress: data.params[0].value[0],
                    dstTokenAddress: data.params[0].value[1],
                    dstAmount: data.params[0].value[4],
                    maxSrcAmount: data.params[0].value[5],
                } 
            } 
        };
    }

    return { tag: 'WrongContractCall' };
}

// TODO: Condition?
function normalizeSelfPermitAllowed(data: IAbiDecoderResult, sig: string): DecodeResult {
    try {
        return {
            tag: 'Success', 
            tx: { 
                tag: TransactionType.Approve, 
                raw: (undefined as unknown) as TransactionRaw,
                functionInfo: {
                    name: data.name,
                    hash: sig,
                    params: data.params,
                    abi: UniswapRouterV2BI,
                },
                // TODO: Add payload to approve txs
                // payload: {
                //     token: data.params[0].value as string,
                //     nonce: BigNumber.from(data.params[1].value),
                //     expiry: BigNumber.from(data.params[2].value),
                // } 
            } 
        };
    } catch (e) {
        return { tag: 'WrongContractCall' };
    }
}

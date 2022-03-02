import { TransactionRaw } from '../../core/transaction-raw';
import { DecodeResult } from '../../core/decoder';
import UniswapRouterV2BI from './UNI3_ROUTER_V2.json';
import ERC20ABI from '../../core/abi/ERC20ABI.json';
import { abiDecoder, getParamDescriptor } from '../../helpers/abi/abi-decoder.helper';
import { IAbiDecoderResult } from '../../helpers/abi/types';
import { TransactionType } from '../../core/transaction-type';
import { MulticallPayload } from '../../core/transaction-parsed';

abiDecoder.addABI(UniswapRouterV2BI);
abiDecoder.addABI(ERC20ABI);

export function decodeUniV3(contractAddr: string, tx: TransactionRaw): DecodeResult {
    if (contractAddr.toUpperCase() != tx.to.toUpperCase()) {
        return { tag: 'AnotherContract' };
    }
    
    const rootFunc: IAbiDecoderResult = abiDecoder.decodeMethod(tx.data);
    if (rootFunc.name === 'multicall') {
        const data = getParamDescriptor(rootFunc, 'data');
        if(!data || data.type !== 'bytes[]') {
            return { tag: 'WrongContractCall' };
        }

        const calls: string[] = data.value as string[];
        const decodedTxs = calls.map(abiDecoder.decodeMethod);
        const innerResults = decodedTxs.map(decodeSimpleCall);
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
                payload: multicallPayload,
            }
        }


    } else {
        // TODO: Is it possible to use plain UniV3 functions without multicall?
        return { tag: 'WrongContractCall' };
    }
}

function decodeSimpleCall(data: IAbiDecoderResult): DecodeResult {
    switch (data.name) {
        case 'swapTokensForExactTokens':
            return normalizeSwapTokensForExactTokens(data);
        case 'swapExactTokensForTokens':
            return normalizeSwapExactTokensForTokens(data);
        case 'exactInputSingle':
            return normalizeExactInputSingle(data);
        case 'exactOutputSingle':
            return normalizeExactOutputSingle(data);
        case 'unwrapWETH9':
            return normailzeUnwrapWETH9(data);
        case 'selfPermitAllowed':
            return normalizeSelfPermitAllowed(data);
        default:
            return { tag: 'NotSupported', funcName: data.name }
    }
}

function normalizeSwapExactTokensForTokens(data: IAbiDecoderResult): DecodeResult {
    if (data.params && data.params.length > 3
        && data.params[2].value.length == 2) {

        return { 
            tag: 'Success', 
            tx: { 
                tag: TransactionType.SwapExactInput, 
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

function normalizeSwapTokensForExactTokens(data: IAbiDecoderResult): DecodeResult {
    if (data.params && data.params.length > 3
        && data.params[2].value.length == 2) {
        return {
            tag: 'Success', 
            tx: { 
                tag: TransactionType.SwapExactOutput, 
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

function normailzeUnwrapWETH9(data: IAbiDecoderResult): DecodeResult {
    if (data.params && data.params.length > 1) {
        return {
            tag: 'Success',
            tx: {
                tag: TransactionType.Unwrap,
                // TODO: Add parameters to Unwrap tx payload
                // minReturnAmount: BigNumber.from(data.params[0].value),
                // recipient: data.params[1].value as string,
            },
        };
    }

    return { tag: 'WrongContractCall' };
}

function normalizeExactInputSingle(data: IAbiDecoderResult): DecodeResult {
    if (data.params && data.params.length == 1 && data.params[0].value.length == 7) {
        
        return { 
            tag: 'Success', 
            tx: { 
                tag: TransactionType.SwapExactInput, 
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

function normalizeExactOutputSingle(data: IAbiDecoderResult): DecodeResult {
    if (data.params && data.params.length == 1 && data.params[0].value.length == 7) {
        return {
            tag: 'Success', 
            tx: { 
                tag: TransactionType.SwapExactOutput, 
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
function normalizeSelfPermitAllowed(data: IAbiDecoderResult): DecodeResult {
    try {
        return {
            tag: 'Success', 
            tx: { 
                tag: TransactionType.Approve, 
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

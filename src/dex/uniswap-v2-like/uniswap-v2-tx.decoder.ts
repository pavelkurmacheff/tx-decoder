import { DecodeResult } from '../../core/decoder';
import { TransactionType } from '../..//core/transaction-type';
import { TransactionRaw } from '../..//core/transaction-raw';
import { abiDecoder, getParam } from '../..//helpers/abi/abi-decoder.helper';
import { IAbiDecoderResult } from '../..//helpers/abi/types';
import ERC20ABI from '../../core/abi/ERC20ABI.json';
import UniswapRouterV2BI from './UNI2_ROUTER_V2.json';

abiDecoder.addABI(UniswapRouterV2BI);
abiDecoder.addABI(ERC20ABI);

export function decodeUniV2Like(contractAddr: string, tx: TransactionRaw): DecodeResult {
    if (contractAddr.toUpperCase() != tx.to.toUpperCase()) {
        return { tag: 'AnotherContract' };
    }
    
    const rootFunc: IAbiDecoderResult = abiDecoder.decodeMethod(tx.data);

    switch(rootFunc.name) {
        case 'swapExactETHForTokens': {
            const to = getParam(rootFunc, 'to');
            if(to == null) {
                return { tag: 'WrongContractCall' };
            } else if((to as string).toUpperCase() == tx.from.toUpperCase()) {
                const path = getParam(rootFunc, 'path') as string[];
                const dst = path[path.length - 1];
                const minAmount = getParam(rootFunc, 'amountOutMin') as string;
                return { 
                    tag: 'Success',
                    tx: {
                        tag: TransactionType.SwapExactInput,
                        payload: {
                            srcTokenAddress: 'native',
                            dstTokenAddress: dst,
                            srcAmount: tx.value,
                            minDstAmount: minAmount,
                        }
                    }
                };
            } 
            return { tag: 'WrongContractCall' };
        }
        case 'approve':
            return { tag: 'Success', tx: { tag: TransactionType.Approve }};

        case 'swapExactTokensForTokens': {
            const to = getParam(rootFunc, 'to');
            if(to == null) {
                return { tag: 'WrongContractCall' };
            } else if((to as string).toUpperCase() == tx.from.toUpperCase()) {
                const path = getParam(rootFunc, 'path') as string[];
                const src = path[0];
                const dst = path[path.length - 1];
                const amountIn = getParam(rootFunc, 'amountIn') as string;
                const minAmount = getParam(rootFunc, 'amountOutMin') as string;
                return { 
                    tag: 'Success',
                    tx: {
                        tag: TransactionType.SwapExactInput,
                        payload: {
                            srcTokenAddress: src,
                            dstTokenAddress: dst,
                            srcAmount: amountIn,
                            minDstAmount: minAmount,
                        }
                    }
                };
            } 
            return { tag: 'WrongContractCall' };
        }
        case 'swapExactTokensForETH': {
            const to = getParam(rootFunc, 'to');
            if(to == null) {
                return { tag: 'WrongContractCall' };
            } else if((to as string).toUpperCase() == tx.from.toUpperCase()) {
                const path = getParam(rootFunc, 'path') as string[];
                const src = path[0];
                const amountIn = getParam(rootFunc, 'amountIn') as string;
                const minAmount = getParam(rootFunc, 'amountOutMin') as string;
                return { 
                    tag: 'Success',
                    tx: {
                        tag: TransactionType.SwapExactInput,
                        payload: {
                            srcTokenAddress: src,
                            dstTokenAddress: 'native',
                            srcAmount: amountIn,
                            minDstAmount: minAmount,
                        }
                    }
                };
            } 
            return { tag: 'WrongContractCall' };
        }
        case 'swapETHForExactTokens': {
            const to = getParam(rootFunc, 'to');
            if(to == null) {
                return { tag: 'WrongContractCall' };
            } else if((to as string).toUpperCase() == tx.from.toUpperCase()) {
                const path = getParam(rootFunc, 'path') as string[];
                const dst = path[path.length - 1];
                const amountOut = getParam(rootFunc, 'amountOut') as string;
                return { 
                    tag: 'Success',
                    tx: {
                        tag: TransactionType.SwapExactOutput,
                        payload: {
                            srcTokenAddress: 'native',
                            dstTokenAddress: dst,
                            dstAmount: amountOut,
                        }
                    }
                };
            } 
            return { tag: 'WrongContractCall' };
        }
        case 'swapTokensForExactTokens': {
            const to = getParam(rootFunc, 'to');
            if(to == null) {
                return { tag: 'WrongContractCall' };
            } else if((to as string).toUpperCase() == tx.from.toUpperCase()) {
                const path = getParam(rootFunc, 'path') as string[];
                const src = path[0];
                const dst = path[path.length - 1];
                const amountOut = getParam(rootFunc, 'amountOut') as string;
                const amountInMax = getParam(rootFunc, 'amountInMax') as string;
                return { 
                    tag: 'Success',
                    tx: {
                        tag: TransactionType.SwapExactOutput,
                        payload: {
                            srcTokenAddress: src,
                            dstTokenAddress: dst,
                            dstAmount: amountOut,
                            maxSrcAmount: amountInMax,
                        }
                    }
                };
            } 
            return { tag: 'WrongContractCall' };
        }
        case 'swapTokensForExactETH': {
            const to = getParam(rootFunc, 'to');
            if(to == null) {
                return { tag: 'WrongContractCall' };
            } else if((to as string).toUpperCase() == tx.from.toUpperCase()) {
                const path = getParam(rootFunc, 'path') as string[];
                const src = path[0];
                const amountOut = getParam(rootFunc, 'amountOut') as string;
                const amountInMax = getParam(rootFunc, 'amountInMax') as string;
                return { 
                    tag: 'Success',
                    tx: {
                        tag: TransactionType.SwapExactOutput,
                        payload: {
                            srcTokenAddress: src,
                            dstTokenAddress: 'native',
                            dstAmount: amountOut,
                            maxSrcAmount: amountInMax,
                        }
                    }
                };
            } 
            return { tag: 'WrongContractCall' };
        }
        default:
            return { tag: 'NotSupported', funcName: rootFunc.name };
    } 
}

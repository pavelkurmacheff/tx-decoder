import { Transaction } from '../../../model/common.model';
import UniswapRouterV2BI from '../../../abi/UNI2_ROUTER_V2.json';
import ERC20ABI from '../../../abi/ERC20ABI.json';
import { DecoderResult, getParam } from '../../types';
import { combineTxDecoders, DecodeResult, TxDecoder } from './decoder';
import { TxType } from './tx-types';


function decodeUniV2Like(contractAddr: string, tx: Transaction): DecodeResult {
    if (contractAddr.toUpperCase() != tx.to.toUpperCase()) {
        return { tag: 'AnotherContract' };
    }

    const abiDecoder = require('abi-decoder');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    abiDecoder.addABI(UniswapRouterV2BI);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    abiDecoder.addABI(ERC20ABI);

    const rootFunc: DecoderResult = abiDecoder.decodeMethod(tx.data);

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
                        tag: TxType.SwapExactInput,
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
            return { tag: 'Success', tx: { tag: TxType.Permit }};

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
                        tag: TxType.SwapExactInput,
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
                        tag: TxType.SwapExactInput,
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
                        tag: TxType.SwapExactOutput,
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
                        tag: TxType.SwapExactOutput,
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
                        tag: TxType.SwapExactOutput,
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

// Uniswap V2
// https://etherscan.io/address/0x7a250d5630b4cf539739df2c5dacb4c659f2488d
export function decodeUniswapV2(tx: Transaction): DecodeResult {
    return decodeUniV2Like('0x7a250d5630b4cf539739df2c5dacb4c659f2488d', tx);
}

// Pancake
// https://bscscan.com/address/0x10ed43c718714eb63d5aa57b78b54704e256024e
export function decodePancake(tx: Transaction): DecodeResult {
    return decodeUniV2Like('0x10ed43c718714eb63d5aa57b78b54704e256024e', tx);
}

export const decodeUniV2Like_: TxDecoder = combineTxDecoders([decodeUniswapV2, decodePancake]);
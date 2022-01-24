import { BlockchainResources, BlockchainRpcCaller, DecodeInfo, Transaction } from '../../../model/common.model';
import { TxDecoder } from '../../base-tx.decoder';
import { BigNumber } from '@ethersproject/bignumber';
import { SwapTxDecoded } from '../../../model/swap-tx.model';
import { TransactionReceipt } from '@ethersproject/abstract-provider';

// todo: what is that? why is it here?
export interface UniswapV3TxItemData {
    amount: string;
    minReturn: string;
    pools: BigNumber[];
}

export class UniswapV3TxDecoder implements TxDecoder<UniswapV3TxItemData> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // todo: what is that? why is it here?
    readonly decodeInfo: DecodeInfo;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    readonly txData: UniswapV3TxItemData;

    constructor(readonly resources: BlockchainResources,
                readonly rpcCaller: BlockchainRpcCaller) {
    }

    async decodeByConfig(txConfig: Transaction): Promise<SwapTxDecoded> {
        console.log(txConfig);
        // console.log(callResult);
        return {
            dstAmount: BigNumber.from('0'),
            dstToken: {
                address: '0x',
                name: '0x',
                decimals: 0,
                symbol: '0x',
                logoURI: '0x',
            },
            minReturnAmount: BigNumber.from('0'),
            srcAmount: BigNumber.from('0'),
            srcToken: {
                address: '0x',
                name: '0x',
                decimals: 0,
                symbol: '0x',
                logoURI: '0x',
            }
        }
    }


    async decodeByLogs(receipt: TransactionReceipt): Promise<SwapTxDecoded> {
        console.log(receipt);
        return {
            dstAmount: BigNumber.from('0'),
            dstToken: {
                address: '0x',
                name: '0x',
                decimals: 0,
                symbol: '0x',
                logoURI: '0x',
            },
            minReturnAmount: BigNumber.from('0'),
            srcAmount: BigNumber.from('0'),
            srcToken: {
                address: '0x',
                name: '0x',
                decimals: 0,
                symbol: '0x',
                logoURI: '0x',
            }
        }
    }


    // const dstAmount = getReturnAmountFromLogs(receipt);
    //
    // const {
    //     amount: srcAmount,
    //     minReturn: minReturnAmount,
    //     pools
    // } = this.txData;
    //
    // const {
    //     srcTokenAddress,
    //     dstTokenAddress
    // } = await getTokensOfUniswapV3Pools(
    //     pools.map(pool => pool.toString()),
    //     this.rpcCaller
    // );
    //
    // return decodeSwapTx({
    //     srcTokenAddress,
    //     dstTokenAddress,
    //     srcAmount,
    //     minReturnAmount,
    //     dstAmount
    // }, this.resources);
    // }
}


export enum uniswapTxType {
    exactIn = 'exactIn',
    exactOut = 'exactOut',
    unkown = 'unkown',
}

export interface MulticallParam {
    name: string;
    value: string;
    type: string;
}

export interface DecoderResult {
    name: string;
    params: any;
}

export interface methodDetails {
    name: string;
    type: uniswapTxType;
}

export const uniswapV3MethodsMap = {
    '0x472b43f3': {
        name: 'swapExactTokensForTokens',
        type: 'exactIn',
    },
    '0x42712a67': {
        name: 'swapTokensForExactTokens',

        type: 'exactOut',
    },
    '0x04e45aaf': {
        name: 'exactInputSingle',
        type: 'exactIn',
    },
    '0x5023b4df': {
        name: 'exactOutputSingle',
        type: 'exactOut',
    },
};

function getTxTypeByCallData(
    calldata: string,
    abiDecoder: any,
): methodDetails | null {
    try {
        const result: DecoderResult = abiDecoder.decodeMethod(calldata);
        if (result.name === 'multicall') {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            return parseMulticall(result.params);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return findSupportedCallParams(result.params[0].value);
    } catch (e) {
        return null;
    }
}

export function parseMulticall(params: MulticallParam[]): methodDetails | null {
    const dataInput = params.find((param) => param.name === 'data');
    if (!dataInput) {
        return null;
    }
    if (dataInput.type === 'bytes[]') {
        for (const v of dataInput.value) {
            const result = findSupportedCallParams(v);
            if (result) {
                return result;
            }
        }
    }
    return findSupportedCallParams(dataInput.value);
}

function findSupportedCallParams(data: string): methodDetails | null {
    const method = data.length >= 10 ? data.slice(0, 10) : '';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return uniswapV3MethodsMap[method] ? uniswapV3MethodsMap[method] : null;
}

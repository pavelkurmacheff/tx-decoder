import { BlockchainResources, BlockchainRpcCaller, DecodeInfo, Transaction } from '../../../model/common.model';
import { TxDecoder } from '../../base-tx.decoder';
import { BigNumber } from '@ethersproject/bignumber';
import { SwapTxDecoded } from '../../../model/swap-tx.model';
import { TransactionReceipt } from '@ethersproject/abstract-provider';

export interface UniswapV3TxItemData {
    amount: string;
    minReturn: string;
    pools: BigNumber[];
}

export class UniswapV3TxDecoder implements TxDecoder<UniswapV3TxItemData> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    readonly decodeInfo: DecodeInfo;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    readonly txData: UniswapV3TxItemData;

    constructor(readonly resources: BlockchainResources,
                readonly rpcCaller: BlockchainRpcCaller) {
    }

    async decodeByConfig(txConfig: Transaction): Promise<SwapTxDecoded> {
        console.log(txConfig);
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

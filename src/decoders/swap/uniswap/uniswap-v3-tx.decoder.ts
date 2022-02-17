import { BlockchainResources, BlockchainRpcCaller, DecodeInfo, Transaction } from '../../../model/common.model';
import { TxDecoder } from '../../base-tx.decoder';
import { BigNumber } from '@ethersproject/bignumber';
import { MultipleTxsDecoded, SwapTxDecoded } from '../../../model/swap-tx.model';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import UniswapRouterV2BI from '../../../abi/UNI3_ROUTER_V2.json';
import ERC20ABI from '../../../abi/ERC20ABI.json';
import { buildSwapTxDecoded, getTxTypeByCallData } from './normalization';
import { estimateWithResult } from '../../../helpers/dest-amount.helper';
import { Interface } from '@ethersproject/abi';
import { normalizeEstimation } from './estimation';
import { SwapTx, TxType } from './types';


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

    readonly decodeInfo: DecodeInfo = {
        methodSelector: '0x5ae401dc',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        iface: new Interface(UniswapRouterV2BI)
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    abiDecoder: unknown;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    readonly txData: UniswapV3TxItemData;

    constructor(readonly resources: BlockchainResources,
                readonly rpcCaller: BlockchainRpcCaller) {
        this.abiDecoder = require('abi-decoder');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.abiDecoder.addABI(UniswapRouterV2BI);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.abiDecoder.addABI(ERC20ABI);
    }

    // eslint-disable-next-line max-lines-per-function
    async decodeByConfig(txConfig: Transaction): Promise<MultipleTxsDecoded> {
        const data = getTxTypeByCallData(txConfig.data, this.abiDecoder);

        const estimated = await estimateWithResult(this, txConfig);

        let dstAmountRaw;
        if (estimated) {
            const estimatedResult = normalizeEstimation(estimated.error ? undefined : estimated.data);
            if (estimatedResult) {
                dstAmountRaw = estimatedResult;
            }
        }
        const result: MultipleTxsDecoded = {txs: []};
        const swapTx: SwapTx = data.find(item => item?.type === TxType.SWAP) as SwapTx;
        if (swapTx) {
            const tx = buildSwapTxDecoded(this.resources, swapTx, dstAmountRaw ? dstAmountRaw : '0');
            if (tx) {
                result.txs.push(tx);
            }
        }


        return result;
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

}






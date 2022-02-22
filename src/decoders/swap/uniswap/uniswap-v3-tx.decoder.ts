import { BlockchainResources, BlockchainRpcCaller, DecodeInfo, Transaction } from '../../../model/common.model';
import { TxDecoder } from '../../base-tx.decoder';
import { BigNumber } from '@ethersproject/bignumber';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import UniswapRouterV2BI from '../../../abi/UNI3_ROUTER_V2.json';
import ERC20ABI from '../../../abi/ERC20ABI.json';
import { estimateWithResult } from '../../../helpers/dest-amount.helper';
import { MultipleTxsDecoded } from '../../../model/multiple-tx.model';
import { getEstimatedValue, getTxTypeByCallData } from './normalization';
import { buildResult } from './model-builder';
import { SwapTxDecoded } from '../../../model/swap-tx.model';
import { NetworkEnum } from '../../../const/common.const';
import { UniswapV3PermitTxItemData } from '../1inch/one-inch-uniswap-v3-permit-tx.decoder';


// todo: what is that? why is it here?
export interface UniswapV3TxItemData {
    amount: string;
    minReturn: string;
    pools: BigNumber[];
}

export class UniswapV3TxDecoder implements TxDecoder<UniswapV3TxItemData> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    abiDecoder: unknown;


    constructor(readonly resources: BlockchainResources,
                readonly rpcCaller: BlockchainRpcCaller,
                readonly decodeInfo: DecodeInfo,
                readonly txData: UniswapV3PermitTxItemData,
                readonly chainId: NetworkEnum) {
        this.abiDecoder = require('abi-decoder');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.abiDecoder.addABI(UniswapRouterV2BI);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.abiDecoder.addABI(ERC20ABI);
    }

    async decodeByConfig(txConfig: Transaction): Promise<MultipleTxsDecoded> {
        const data = getTxTypeByCallData(txConfig.data, this.abiDecoder);
        const estimated = await estimateWithResult(this, txConfig);
        const estimatedResult = getEstimatedValue(estimated);

        return buildResult(this.resources, txConfig, data, estimatedResult ? estimatedResult : '0');
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






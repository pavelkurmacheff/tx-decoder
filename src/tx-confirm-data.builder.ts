// import {Item, TxType} from './dex/uniswap-v3/model/tx-ui-items.model';
// import {BlockchainResources, BlockchainRpcCaller} from './dex/uniswap-v3/model/common.model';
// import {CommonTxDecoder} from './common-tx.decoder';
// import { ChainId } from './core/chain-id';
// import { TransactionRaw } from './core/transaction-raw';

// export class TxConfirmDataBuilder {
//     constructor(
//         private readonly resources: BlockchainResources,
//         private readonly rpcCaller: BlockchainRpcCaller,
//         private readonly chainId: ChainId,
//     ) {}

//     async buildItemsForTx(txConfigOrHash: TransactionRaw | string): Promise<BuilderResult> {
//         const decoder = new CommonTxDecoder(this.resources, this.rpcCaller, this.chainId);

//         const {data, config, dataArguments, tx} = await (typeof txConfigOrHash === 'string'
//             ? decoder.decodeTxByLogs(txConfigOrHash)
//             : decoder.decodeTxByEstimation(txConfigOrHash));

//         return {
//             items: config.template(tx, data),
//             txType: config.type,
//             dataArguments
//         };
//     }
// }

// export interface BuilderResult {
//     items: Item[],
//     txType: TxType,
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     dataArguments: any
// }

import {Item, TxType} from './model/tx-ui-items.model';
import {BlockchainResources, BlockchainRpcCaller, Transaction} from './model/common.model';
import {OinchTxDecoder} from './oinch-tx.decoder';

export class TxConfirmDataBuilder {
    constructor(
        private readonly resources: BlockchainResources,
        private readonly rpcCaller: BlockchainRpcCaller,
    ) {
    }

    async buildItemsForTx(txConfig: Transaction): Promise<{items: Item[], txType: TxType, dataArguments: any}> {
        const decoder = new OinchTxDecoder(this.resources, this.rpcCaller);

        const {data, config, dataArguments} = await decoder.decodeTxByEstimation(txConfig);

        return {
            items: config.template(txConfig, data),
            txType: config.type,
            dataArguments
        };
    }
}

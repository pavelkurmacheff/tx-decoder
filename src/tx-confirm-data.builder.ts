import {Item, TxType} from './model/tx-ui-items.model';
import {BlockchainResources, BlockchainRpcCaller, Transaction} from './model/common.model';
import {OinchTxDecoder} from './oinch-tx.decoder';

export class TxConfirmDataBuilder {
    constructor(
        private readonly resources: BlockchainResources,
        private readonly rpcCaller: BlockchainRpcCaller,
    ) {
    }

    async buildItemsForTx(txConfigOrHash: Transaction | string): Promise<{
        items: Item[],
        txType: TxType,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dataArguments: any
    }> {
        const decoder = new OinchTxDecoder(this.resources, this.rpcCaller);

        const {data, config, dataArguments, txConfig} = await (typeof txConfigOrHash === 'string'
            ? decoder.decodeTxByLogs(txConfigOrHash)
            : decoder.decodeTxByEstimation(txConfigOrHash));

        return {
            items: config.template(txConfig, data),
            txType: config.type,
            dataArguments
        };
    }
}

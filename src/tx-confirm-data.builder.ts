import {Item, TxType} from './model/tx-ui-items.model';
import {BlockchainResources, BlockchainRpcCaller, Transaction} from './model/common.model';
import {TX_CONFIRM_DATA_CONFIG} from './tx-confirm-data.config';
import {Interface} from '@ethersproject/abi';

export class TxConfirmDataBuilder {
    constructor(
        private readonly resources: BlockchainResources,
        private readonly rpcCaller: BlockchainRpcCaller,
    ) {
    }

    async buildItemsForTx(txConfig: Transaction): Promise<{items: Item[], txType: TxType}> {
        const methodSelector = txConfig.data.slice(0, 10).toLowerCase();
        const methodInfo = TX_CONFIRM_DATA_CONFIG[methodSelector];

        if (!methodInfo) {
            throw new Error('Method is not registered in ABI config: ' + methodSelector);
        }

        const {abi, type, builder} = methodInfo;
        const iface = new Interface(abi);
        const methodArguments = iface.decodeFunctionData(methodSelector, txConfig.data);

        return {
            txType: type,
            items: await builder({
                resources: this.resources,
                rpcCaller: this.rpcCaller,
                txConfig,
                data: methodArguments as any
            })
        };
    }
}

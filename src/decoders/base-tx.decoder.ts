import {BlockchainResources, BlockchainRpcCaller, Transaction} from '../model/common.model';
import {TransactionReceipt} from '@ethersproject/abstract-provider';
import {DecodedTx} from '../model/decoded-tx.model';

export interface TxDecoder<T> {
    readonly resources: BlockchainResources;
    readonly rpcCaller: BlockchainRpcCaller;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly txData: T;

    decodeByConfig(txConfig: Transaction): Promise<DecodedTx>;

    decodeByLogs(receipt: TransactionReceipt): Promise<DecodedTx>;
}

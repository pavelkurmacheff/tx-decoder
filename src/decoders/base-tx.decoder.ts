import {BlockchainResources, BlockchainRpcCaller, DecodeInfo, Transaction} from '../model/common.model';
import {TransactionReceipt} from '@ethersproject/abstract-provider';
import {DecodedTx} from '../model/decoded-tx.model';
import { NetworkEnum } from '../const/common.const';

export interface TxDecoder<T> {
    readonly resources: BlockchainResources;
    readonly rpcCaller: BlockchainRpcCaller;
    readonly decodeInfo: DecodeInfo;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly txData: T;

    readonly chainId: NetworkEnum;

    decodeByConfig(txConfig: Transaction): Promise<DecodedTx>;

    decodeByLogs(receipt: TransactionReceipt): Promise<DecodedTx>;
}

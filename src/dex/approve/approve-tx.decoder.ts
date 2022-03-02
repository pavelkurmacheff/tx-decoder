import { BigNumber } from '@ethersproject/bignumber';
import {
    BlockchainRpcCaller,
    DecodeInfo,
    Transaction,
    Web3Resources
} from '../uniswap-v3/model/common.model';
import { TxDecoder } from '../uniswap-v3/base-tx.decoder';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { ApproveTxDecoded } from '../../core/transaction-rich/approve-tx.model';
import { NetworkEnum } from '../../core/const/common.const';
import { findTokenByAddress } from '../../helpers/tokens/tokens.helper';

export interface ApproveTxData {
    _value: BigNumber;
}


export class ApproveTxDecoder implements TxDecoder<ApproveTxData> {
    constructor(readonly resources: Web3Resources,
                readonly rpcCaller: BlockchainRpcCaller,
                readonly decodeInfo: DecodeInfo,
                readonly txData: ApproveTxData,
                readonly chainId: NetworkEnum
) {
}

    async decodeByConfig(txConfig: Transaction): Promise<ApproveTxDecoded> {
        return this.decode(txConfig.to.toLowerCase());
    }

    decodeByLogs(receipt: TransactionReceipt): Promise<ApproveTxDecoded> {
        return this.decode(receipt.to.toLowerCase());
    }

    private async decode(to: string): Promise<ApproveTxDecoded> {
        const {_value} = this.txData;
        const token = findTokenByAddress(this.resources, to);

        if (!token) {
            throw new Error('Token is not found for approveTxItemBuilder: ' + to);
        }

        return {token, value: _value};
    }
}

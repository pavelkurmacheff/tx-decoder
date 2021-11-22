import {BigNumber} from '@ethersproject/bignumber';
import {BlockchainResources, BlockchainRpcCaller, Token, Transaction} from '../model/common.model';
import {findTokenByAddress} from '../helpers/tokens.helper';
import {TxDecoder} from './base-tx.decoder';
import {TransactionReceipt} from '@ethersproject/abstract-provider';

export interface ApproveTxData {
    _value: BigNumber;
}

export interface ApproveTxDecoded {
    token: Token;
    value: BigNumber;
}

export class ApproveTxDecoder implements TxDecoder<ApproveTxData> {
    constructor(readonly resources: BlockchainResources,
                readonly rpcCaller: BlockchainRpcCaller,
                readonly txData: ApproveTxData) {
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

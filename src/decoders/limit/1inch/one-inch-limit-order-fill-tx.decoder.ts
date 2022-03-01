import {IAbiDecoder} from '../../../abi/iAbiDecoder';
import {NetworkEnum} from '../../../const/common.const';
import {
    BlockchainRpcCaller,
    DecodeInfo,
    Transaction,
    Web3Resources,
} from '../../../model/common.model';
import {LimitOrderFillDecoded} from '../../../model/limit-order-fill.model';
import {TxDecoder} from '../../base-tx.decoder';
import oneInchLimitV2Abi from '../../../abi/ONE_INCH_LIMIT_V2.json';
import {parseOneInchLimitOrderFillTxCallData} from './one-inch-limit-order-fill-tx.parser';
import {buildOneInchLimitOrderFillTxModel} from './one-inch-limit-order-fill-tx.builder';

export interface LimitOrderFillTxData {
    data: string;
}

export class OneInchLimitOrderFillTxDecoder
    implements TxDecoder<LimitOrderFillTxData>
{
    private abiDecoder: IAbiDecoder;

    constructor(
        readonly resources: Web3Resources,
        readonly rpcCaller: BlockchainRpcCaller,
        readonly decodeInfo: DecodeInfo,
        readonly txData: LimitOrderFillTxData,
        readonly chainId: NetworkEnum
    ) {
        this.abiDecoder = require('abi-decoder');
        this.abiDecoder.addABI(oneInchLimitV2Abi);
    }

    async decodeByConfig(
        txConfig: Transaction
    ): Promise<LimitOrderFillDecoded> {
        const data = parseOneInchLimitOrderFillTxCallData(
            this.abiDecoder,
            txConfig.data
        );
        const model = buildOneInchLimitOrderFillTxModel(this.resources, data);
        return model;
    }

    async decodeByLogs(): Promise<LimitOrderFillDecoded> {
        return {
            dstToken: {
                address: '0x',
                name: '0x',
                decimals: 0,
                symbol: '0x',
                logoURI: '0x',
            },
            srcToken: {
                address: '0x',
                name: '0x',
                decimals: 0,
                symbol: '0x',
                logoURI: '0x',
            },
        };
    }
}

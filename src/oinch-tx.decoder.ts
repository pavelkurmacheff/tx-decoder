import {BlockchainResources, BlockchainRpcCaller, Transaction} from './model/common.model';
import {getTxByHash, getTxReceipt} from './helpers/tx-logs.helper';
import {ContractMethodsDecodeConfig, TX_DECODE_CONFIG} from './tx-decode.config';
import {Interface, Result} from '@ethersproject/abi';
import {DecodedTx} from './model/decoded-tx.model';
import {TxDecoder} from './decoders/base-tx.decoder';
import {BigNumber} from '@ethersproject/bignumber';

export type OinchTxDecodingResult = {
    config: ContractMethodsDecodeConfig;
    data: DecodedTx;
    dataArguments: any;
}

function decodedResultToObject(result: Result): any {
    return Object.keys(result).reduce((acc, key) => {
        if (!/^\d+$/.test(key)) {
            acc[key] = result[key];
        }

        return acc;
    }, {} as {[key: string]: any});
}

export class OinchTxDecoder {
    constructor(
        private readonly resources: BlockchainResources,
        private readonly rpcCaller: BlockchainRpcCaller,
    ) {
    }

    async decodeTxByLogs(txHash: string): Promise<OinchTxDecodingResult> {
        const {
            to, from, data, value, gasPrice, gasLimit, nonce, input, gas
        } = await getTxByHash(this.rpcCaller, txHash);
        const receipt = await getTxReceipt(this.rpcCaller, txHash);
        const txConfig: Transaction = {
            to: to!,
            from,
            data: data || input,
            value: BigNumber.from(value),
            gasPrice: BigNumber.from(gasPrice!),
            gasLimit: BigNumber.from(gasLimit || gas),
            nonce: +nonce
        };
        const {decoder, config} = this.getDecoderAndType(txConfig.to, txConfig.data);

        return {
            config,
            data: await decoder.decodeByLogs(receipt),
            dataArguments: decodedResultToObject(decoder.txData)
        };
    }

    async decodeTxByEstimation(txConfig: Transaction): Promise<OinchTxDecodingResult> {
        const {decoder, config} = this.getDecoderAndType(txConfig.to, txConfig.data);

        return {
            config,
            data: await decoder.decodeByConfig(txConfig),
            dataArguments: decodedResultToObject(decoder.txData)
        };
    }

    private getDecoderAndType(to: string, callData: string): {
        decoder: TxDecoder<any>,
        config: ContractMethodsDecodeConfig
    } {
        const methodSelector = callData.slice(0, 10).toLowerCase();
        const methodDecodeInfo = TX_DECODE_CONFIG[methodSelector];

        if (!methodDecodeInfo) {
            throw new Error('Cannot find decoder for method: ' + methodSelector + ' in contract: ' + to);
        }

        const iface = new Interface(methodDecodeInfo.abi);
        const txArguments = iface.decodeFunctionData(methodSelector, callData);

        return {
            config: methodDecodeInfo,
            decoder: new methodDecodeInfo.Decoder(
                this.resources,
                this.rpcCaller,
                txArguments
            )
        };
    }
}

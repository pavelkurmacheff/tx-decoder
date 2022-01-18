import {BlockchainResources, BlockchainRpcCaller, DecodeInfo, Transaction} from './model/common.model';
import {getTxByHash, getTxReceipt} from './helpers/tx-logs.helper';
import {ContractMethodsDecodeConfig, TX_DECODE_CONFIG} from './tx-decode.config';
import {Interface, Result} from '@ethersproject/abi';
import {DecodedTx} from './model/decoded-tx.model';
import {TxDecoder} from './decoders/base-tx.decoder';
import {BigNumber} from '@ethersproject/bignumber';

export type OinchTxDecodingResult = {
    config: ContractMethodsDecodeConfig;
    data: DecodedTx;
    txConfig: Transaction;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataArguments: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function decodedResultToObject(result: Result): any {
    return Object.keys(result).reduce((acc, key) => {
        if (!/^\d+$/.test(key)) {
            acc[key] = result[key];
        }

        return acc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            value: value.toString(),
            gasPrice: BigNumber.from(gasPrice!),
            gasLimit: BigNumber.from(gasLimit || gas),
            nonce: +nonce
        };
        const {decoder, config} = this.getDecoderAndType(txConfig.to, txConfig.data);

        return {
            config,
            data: await decoder.decodeByLogs(receipt),
            dataArguments: decodedResultToObject(decoder.txData),
            txConfig
        };
    }

    async decodeTxByEstimation(txConfig: Transaction): Promise<OinchTxDecodingResult> {
        if (!txConfig.value || ['0', '0x', '0x00'].includes(txConfig.value)) {
            txConfig.value = '0x0';
        } else {
            txConfig.value = txConfig.value.toString();
        }

        const {decoder, config} = this.getDecoderAndType(txConfig.to, txConfig.data);

        return {
            config,
            data: await decoder.decodeByConfig(txConfig),
            dataArguments: decodedResultToObject(decoder.txData),
            txConfig
        };
    }

    private getDecoderAndType(to: string, callData: string): {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        decoder: TxDecoder<any>,
        config: ContractMethodsDecodeConfig
    } {
        const methodSelector = callData.slice(0, 10).toLowerCase();
        const methodDecodeInfo = TX_DECODE_CONFIG[methodSelector];

        if (!methodDecodeInfo) {
            throw new Error('Cannot find decoder for method: ' + methodSelector + ' in contract: ' + to);
        }
        const iface = new Interface(methodDecodeInfo.abi);
        const decodeInfo: DecodeInfo = { iface, methodSelector };
        const txArguments = iface.decodeFunctionData(methodSelector, callData);

        return {
            config: methodDecodeInfo,
            decoder: new methodDecodeInfo.Decoder(
                this.resources,
                this.rpcCaller,
                decodeInfo,
                txArguments
            )
        };
    }
}

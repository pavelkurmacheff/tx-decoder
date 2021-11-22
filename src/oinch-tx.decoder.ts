import {BlockchainResources, BlockchainRpcCaller, Transaction} from './model/common.model';
import {getTxByHash, getTxReceipt} from './helpers/tx-logs.helper';
import {ContractMethodsDecodeConfig, TX_DECODE_CONFIG} from './tx-decode.config';
import {Interface} from '@ethersproject/abi';
import {DecodedTx} from './model/decoded-tx.model';
import {TxDecoder} from './decoders/base-tx.decoder';
import {BigNumber} from '@ethersproject/bignumber';

export class OinchTxDecoder {
    constructor(
        private readonly resources: BlockchainResources,
        private readonly rpcCaller: BlockchainRpcCaller,
    ) {
    }

    async decodeTxByLogs(txHash: string): Promise<{
        config: ContractMethodsDecodeConfig,
        data: DecodedTx
    }> {
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
            data: await decoder.decodeByLogs(receipt)
        };
    }

    async decodeTxByEstimation(txConfig: Transaction): Promise<{
        config: ContractMethodsDecodeConfig,
        data: DecodedTx
    }> {
        const {decoder, config} = this.getDecoderAndType(txConfig.to, txConfig.data);

        return {
            config,
            data: await decoder.decodeByConfig(txConfig)
        };
    }

    private getDecoderAndType(to: string, callData: string): {
        decoder: TxDecoder,
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

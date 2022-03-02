// import { BlockchainResources, BlockchainRpcCaller, DecodeInfo } from './dex/uniswap-v3/model/common.model';
// import { getTxByHash, getTxReceipt } from './helpers/tx-logs.helper';
// import { ContractMethodsDecodeConfig, TX_DECODE_CONFIG } from './tx-decode.config';
// import { Interface, Result } from '@ethersproject/abi';
// import { DecodedTx } from './dex/uniswap-v3/model/decoded-tx.model';
// import { TxDecoder } from './dex/uniswap-v3/base-tx.decoder';
// import { BigNumber } from '@ethersproject/bignumber';
// import { Web3Service } from './helpers/web3/web3.service';
// import { CustomTokensService } from './helpers/tokens/custom-tokens.service';
// import { ChainId } from './core/chain-id';
// import { TransactionRaw } from './core/transaction-raw';

// export type OinchTxDecodingResult = {
//     config: ContractMethodsDecodeConfig;
//     data: DecodedTx;
//     tx: TransactionRaw;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     dataArguments: any;
// }

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// function decodedResultToObject(result: Result): any {
//     return Object.keys(result).reduce((acc, key) => {
//         if (!/^\d+$/.test(key)) {
//             acc[key] = result[key];
//         }

//         return acc;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     }, {} as {[key: string]: any});
// }

// export class CommonTxDecoder {
//     readonly web3Service: Web3Service;

//     readonly tokensService: CustomTokensService;

//     constructor(
//         private readonly resources: BlockchainResources,
//         private readonly rpcCaller: BlockchainRpcCaller,
//         private readonly chainId: ChainId,
//     ) {
//         this.web3Service = new Web3Service(this.rpcCaller.rpcUrl);
//         this.tokensService = new CustomTokensService(this.web3Service, chainId);
//     }

//     async decodeTxByLogs(txHash: string): Promise<OinchTxDecodingResult> {
//         const {
//             to, from, data, value, gasPrice, gasLimit, nonce, input, gas
//         } = await getTxByHash(this.rpcCaller, txHash);
//         const receipt = await getTxReceipt(this.rpcCaller, txHash);
//         const tx: TransactionRaw = {
//             to: to!,
//             from,
//             data: data || input,
//             value: value.toString(),
//             gasPrice: BigNumber.from(gasPrice!),
//             gasLimit: BigNumber.from(gasLimit || gas),
//             nonce: +nonce
//         };
//         const {decoder, config} = this.getDecoderAndType(tx.to, tx.data, this.chainId);

//         return {
//             config,
//             data: await decoder.decodeByLogs(receipt),
//             dataArguments: decodedResultToObject(decoder.txData),
//             tx
//         };
//     }

//     async decodeTxByEstimation(tx: TransactionRaw): Promise<OinchTxDecodingResult> {
//         if (!tx.value || ['0', '0x', '0x00'].includes(tx.value)) {
//             tx.value = '0x0';
//         } else {
//             tx.value = tx.value.toString();
//         }

//         const {decoder, config} = this.getDecoderAndType(tx.to, tx.data, this.chainId);

//         return {
//             config,
//             data: await decoder.decodeByConfig(tx),
//             dataArguments: decodedResultToObject(decoder.txData),
//             tx
//         };
//     }

//     private getDecoderAndType(to: string, callData: string, chainId: ChainId): {
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         decoder: TxDecoder<any>,
//         config: ContractMethodsDecodeConfig
//     } {
//         const methodSelector = callData.slice(0, 10).toLowerCase();
//         const methodDecodeInfo = TX_DECODE_CONFIG[methodSelector];

//         if (!methodDecodeInfo) {
//             throw new Error('Cannot find decoder for method: ' + methodSelector + ' in contract: ' + to);
//         }
//         const iface = new Interface(methodDecodeInfo.abi);
//         const decodeInfo: DecodeInfo = { iface, methodSelector };
//         const txArguments = iface.decodeFunctionData(methodSelector, callData);

//         return {
//             config: methodDecodeInfo,
//             decoder: new methodDecodeInfo.Decoder(
//                 {...this.resources, customTokens: this.tokensService},
//                 this.rpcCaller,
//                 decodeInfo,
//                 txArguments,
//                 chainId
//             )
//         };
//     }
// }

// import erc20Abi from './abi/ERC20ABI.json';
// import oneInchRouterV4Abi from './abi/ONEINCH_ROUTER_V4.json';
// import uniRouterV2ABI from './abi/UNI3_ROUTER_V2.json';
// import {JsonFragment} from '@ethersproject/abi';
// import {TxType} from './dex/uniswap-v3/model/tx-ui-items.model';
// import {ApproveTxDecoder} from './decoders/approve/approve-tx.decoder';
// import {TxDecoder} from './dex/uniswap-v3/base-tx.decoder';
// import {approveTxConfirmTemplate} from './templates/approve-tx-confirm.template';
// import {SwapTxDecoder} from './dex/1inch/swap-tx.decoder';
// import {swapTxConfirmTemplate} from './templates/swap-tx-confirm.template';
// import {ClipperTxDecoder} from './dex/1inch/swap/clipper-tx.decoder';
// import {UnoswapTxDecoder} from './dex/1inch/unoswap-tx.decoder';
// import {OneInchUniswapV3TxDecoder} from './dex/1inch/one-inch-uniswap-v3-tx.decoder';
// import {OneInchUniswapV3PermitTxDecoder} from './dex/1inch/one-inch-uniswap-v3-permit-tx.decoder';
// import {TxConfirmTemplate} from './dex/uniswap-v3/model/tx-template.model';
// import {
//     BlockchainRpcCaller,
//     DecodeInfo,
//     Web3Resources,
// } from './dex/uniswap-v3/model/common.model';
// import {UniswapV3TxDecoder} from './decoders/swap/uniswap/uniswap-v3-tx.decoder';
// import oneInchLimitV2Abi from './abi/ONE_INCH_LIMIT_V2.json';
// import {OneInchLimitOrderFillTxDecoder} from './decoders/limit/1inch/one-inch-limit-order-fill-tx.decoder';
// import {limitOrderFillTemplate} from './templates/limit-order-fill.template';
// import { ChainId } from './core/chain-id';

// interface TxDecodeConfig {
//     [methodSelector: string]: ContractMethodsDecodeConfig;
// }

// interface TxDecoderType<T> {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     new (
//         ...args: [
//             Web3Resources,
//             BlockchainRpcCaller,
//             DecodeInfo,
//             any,
//             ChainId
//         ]
//     ): T;
// }

// export interface ContractMethodsDecodeConfig {
//     abi: JsonFragment[];
//     type: TxType;
//     Decoder: TxDecoderType<TxDecoder<unknown>>;
//     template: TxConfirmTemplate;
// }

// export const TX_DECODE_CONFIG: TxDecodeConfig = {
//     // approve
//     '0x095ea7b3': {
//         type: 'approve',
//         abi: erc20Abi,
//         Decoder: ApproveTxDecoder,
//         template: approveTxConfirmTemplate,
//     },
//     // Swap: swap()
//     '0x7c025200': {
//         type: 'swap',
//         abi: oneInchRouterV4Abi,
//         Decoder: SwapTxDecoder,
//         template: swapTxConfirmTemplate,
//     },
//     // Swap: clipperSwap()
//     '0xb0431182': {
//         type: 'clipperSwap',
//         abi: oneInchRouterV4Abi,
//         Decoder: ClipperTxDecoder,
//         template: swapTxConfirmTemplate,
//     },
//     // Swap: clipperSwapWithPermit()
//     '0xd6a92a5d': {
//         type: 'clipperSwapWithPermit',
//         abi: oneInchRouterV4Abi,
//         Decoder: ClipperTxDecoder,
//         template: swapTxConfirmTemplate,
//     },
//     // Swap: unoswap()
//     '0x2e95b6c8': {
//         type: 'unoswap',
//         abi: oneInchRouterV4Abi,
//         Decoder: UnoswapTxDecoder,
//         template: swapTxConfirmTemplate,
//     },
//     // Swap: unoswapWithPermit()
//     '0xa1251d75': {
//         type: 'unoswapWithPermit',
//         abi: oneInchRouterV4Abi,
//         Decoder: UnoswapTxDecoder,
//         template: swapTxConfirmTemplate,
//     },
//     // Swap: uniswapV3Swap()
//     '0xe449022e': {
//         type: 'uniswapV3Swap',
//         abi: oneInchRouterV4Abi,
//         Decoder: OneInchUniswapV3TxDecoder,
//         template: swapTxConfirmTemplate,
//     },
//     // Swap: uniswapV3SwapToWithPermit()
//     '0x2521b930': {
//         type: 'uniswapV3SwapToWithPermit',
//         abi: oneInchRouterV4Abi,
//         Decoder: OneInchUniswapV3PermitTxDecoder,
//         template: swapTxConfirmTemplate,
//     },
//     // Swap: uniV3 multicall()
//     '0x5ae401dc': {
//         type: 'multicall',
//         abi: uniRouterV2ABI,
//         Decoder: UniswapV3TxDecoder,
//         template: swapTxConfirmTemplate,
//     },
//     // Fill limit order
//     '0x655d13cd': {
//         type: 'fillOrder',
//         abi: oneInchLimitV2Abi,
//         Decoder: OneInchLimitOrderFillTxDecoder,
//         template: limitOrderFillTemplate,
//     },
// };

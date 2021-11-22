import erc20Abi from './abi/ERC20ABI.json';
import oneInchRouterV4Abi from './abi/ONEINCH_ROUTER_V4.json';
import {JsonFragment} from '@ethersproject/abi';
import {TxType} from './model/tx-ui-items.model';
import {ApproveTxDecoder} from './decoders/approve-tx.decoder';
import {TxDecoder} from './decoders/base-tx.decoder';
import {approveTxConfirmTemplate} from './templates/approve-tx-confirm.template';
import {SwapTxDecoder} from './decoders/swap-tx.decoder';
import {swapTxConfirmTemplate} from './templates/swap-tx-confirm.template';
import {ClipperTxDecoder} from './decoders/clipper-tx.decoder';
import {UnoswapTxDecoder} from './decoders/unoswap-tx.decoder';
import {UniswapV3TxDecoder} from './decoders/uniswap-v3-tx.decoder';
import {UniswapV3PermitTxDecoder} from './decoders/uniswap-v3-permit-tx.decoder';
import {TxConfirmTemplate} from './model/tx-template.model';

interface TxDecodeConfig {
    [methodSelector: string]: ContractMethodsDecodeConfig;
}

interface Type<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (...args: any[]): T;
}

export interface ContractMethodsDecodeConfig {
    abi: JsonFragment[];
    type: TxType;
    Decoder: Type<TxDecoder>,
    template: TxConfirmTemplate
}

export const TX_DECODE_CONFIG: TxDecodeConfig = {
    // approve
    '0x095ea7b3': {
        type: 'approve',
        abi: erc20Abi,
        Decoder: ApproveTxDecoder,
        template: approveTxConfirmTemplate
    },
    // Swap: swap()
    '0x7c025200': {
        type: 'swap',
        abi: oneInchRouterV4Abi,
        Decoder: SwapTxDecoder,
        template: swapTxConfirmTemplate
    },
    // Swap: clipperSwap()
    '0xb0431182': {
        type: 'swap',
        abi: oneInchRouterV4Abi,
        Decoder: ClipperTxDecoder,
        template: swapTxConfirmTemplate
    },
    // Swap: clipperSwapWithPermit()
    '0xd6a92a5d': {
        type: 'swap',
        abi: oneInchRouterV4Abi,
        Decoder: ClipperTxDecoder,
        template: swapTxConfirmTemplate
    },
    // Swap: unoswap()
    '0x2e95b6c8': {
        type: 'swap',
        abi: oneInchRouterV4Abi,
        Decoder: UnoswapTxDecoder,
        template: swapTxConfirmTemplate
    },
    // Swap: unoswapWithPermit()
    '0xa1251d75': {
        type: 'swap',
        abi: oneInchRouterV4Abi,
        Decoder: UnoswapTxDecoder,
        template: swapTxConfirmTemplate
    },
    // Swap: uniswapV3Swap()
    '0xe449022e': {
        type: 'swap',
        abi: oneInchRouterV4Abi,
        Decoder: UniswapV3TxDecoder,
        template: swapTxConfirmTemplate
    },
    // Swap: uniswapV3SwapToWithPermit()
    '0x2521b930': {
        type: 'swap',
        abi: oneInchRouterV4Abi,
        Decoder: UniswapV3PermitTxDecoder,
        template: swapTxConfirmTemplate
    },
};

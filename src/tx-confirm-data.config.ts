import erc20Abi from './abi/ERC20ABI.json';
import oneInchRouterV4Abi from './abi/ONEINCH_ROUTER_V4.json';
import {JsonFragment} from '@ethersproject/abi';
import {TxItemBuilder, TxType} from './model/tx-ui-items.model';
import {approveTxConfirmDataBuilder} from './builders/approve-tx-confirm-data.builder';
import {swapTxConfirmDataBuilder} from './builders/swap-tx-confirm-data.builder';
import {clipperSwapTxConfirmDataBuilder} from './builders/clipper-swap-tx-confirm-data.builder';
import {clipperSwapWithPermitTxConfirmDataBuilder} from './builders/clipper-swap-with-permit-tx-confirm-data.builder';

export const TX_CONFIRM_DATA_CONFIG: {[key: string]: {abi: JsonFragment[], type: TxType, builder: TxItemBuilder}} = {
    // approve
    '0x095ea7b3': {
        type: 'approve',
        abi: erc20Abi,
        builder: approveTxConfirmDataBuilder
    },
    // Swap: swap()
    '0x7c025200': {
        type: 'swap',
        abi: oneInchRouterV4Abi,
        builder: swapTxConfirmDataBuilder
    },
    // Swap: clipperSwap()
    '0xb0431182': {
        type: 'swap',
        abi: oneInchRouterV4Abi,
        builder: clipperSwapTxConfirmDataBuilder
    },
    // Swap: clipperSwapWithPermit()
    '0xd6a92a5d': {
        type: 'swap',
        abi: oneInchRouterV4Abi,
        builder: clipperSwapWithPermitTxConfirmDataBuilder
    },
};

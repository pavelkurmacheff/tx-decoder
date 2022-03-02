import { combineTxDecoders, DecodeResult, TxDecoder } from "src/core/decoder";
import { TransactionRaw } from "src/core/transaction-raw";
import { decodeOneInchLimitOrderV2 } from "src/dex/1inch/limit/one-inch-limit-order-v2-tx.decoder";
import { decodeUniV2Like } from "src/dex/uniswap-v2-like/uniswap-v2-tx.decoder";


// Uniswap V2
// https://etherscan.io/address/0x7a250d5630b4cf539739df2c5dacb4c659f2488d
function decodeUniswapV2(tx: TransactionRaw): DecodeResult {
    return decodeUniV2Like('0x7a250d5630b4cf539739df2c5dacb4c659f2488d', tx);
}

export const ehtTransactionDecoder: TxDecoder = combineTxDecoders([
    decodeOneInchLimitOrderV2,
    decodeUniswapV2,
]);
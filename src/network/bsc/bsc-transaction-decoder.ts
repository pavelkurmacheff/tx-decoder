import { combineTxDecoders, DecodeResult, TxDecoder } from "src/core/decoder";
import { TransactionRaw } from "src/core/transaction-raw";
import { decodeUniV2Like } from "src/protocols/uniswap-v2-like/uniswap-v2-tx.decoder";


// Pancake
// https://bscscan.com/address/0x10ed43c718714eb63d5aa57b78b54704e256024e
export function decodePancake(tx: TransactionRaw): DecodeResult {
    return decodeUniV2Like('0x10ed43c718714eb63d5aa57b78b54704e256024e', tx);
}

export const ehtTransactionDecoder: TxDecoder = combineTxDecoders([
    //decodeOneInchLimitOrderV2,
    decodePancake,
]);
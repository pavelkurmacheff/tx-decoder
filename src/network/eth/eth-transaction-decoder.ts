import {combineTxDecoders, DecodeResult, TxDecoder} from 'src/core/decoder';
import {TransactionRaw} from 'src/core/transaction-raw';
import {decode1InchLimitOrderV2} from 'src/dex/1inch/limit/1inch-limit-order-v2-tx.decoder';
import {decodeUniV2Like} from 'src/dex/uniswap-v2-like/uniswap-v2-tx.decoder';
import {decodeUniV3} from 'src/dex/uniswap-v3/uniswap-v3-tx.decoder';

// Uniswap V2
// https://etherscan.io/address/0x7a250d5630b4cf539739df2c5dacb4c659f2488d
function decodeUniswapV2(tx: TransactionRaw): DecodeResult {
    return decodeUniV2Like('0x7a250d5630b4cf539739df2c5dacb4c659f2488d', tx);
}

// Uniswap V3
// https://etherscan.io/address/0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45
function decodeUniswapV3(tx: TransactionRaw): DecodeResult {
    return decodeUniV3('0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45', tx);
}

// 1inch limit order V2
// https://etherscan.io/address/0x119c71d3bbac22029622cbaec24854d3d32d2828
function decode1InchLimitV2(tx: TransactionRaw): DecodeResult {
    return decode1InchLimitOrderV2(
        '0x119c71d3bbac22029622cbaec24854d3d32d2828',
        tx
    );
}

export const ehtTransactionDecoder: TxDecoder = combineTxDecoders([
    decode1InchLimitV2,
    decodeUniswapV2,
    decodeUniswapV3,
]);

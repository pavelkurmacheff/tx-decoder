import { decodeERC20Token } from 'src/dex/erc20-token/erc20-token-tx.decoder';
import { decodeWrappedERC20Token } from 'src/dex/wrapped-erc20-token/erc20-token-tx.decoder';
import {combineTxDecoders, TxDecoder} from '../../core/decoder';
import {decode1InchLimitOrderV2} from '../../dex/1inch/limit/1inch-limit-order-v2-tx.decoder';
import {decode1InchSwapV4} from '../../dex/1inch/swap/1inch-swap-v2-tx.decoder';
import {decodeUniV2Like} from '../../dex/uniswap-v2-like/uniswap-v2-tx.decoder';
import {decodeUniV3} from '../../dex/uniswap-v3/uniswap-v3-tx.decoder';

export const ehtTransactionDecoder: TxDecoder = combineTxDecoders([
    // Uniswap V2
    // https://etherscan.io/address/0x7a250d5630b4cf539739df2c5dacb4c659f2488d
    (tx) => decodeUniV2Like('0x7a250d5630b4cf539739df2c5dacb4c659f2488d', tx),
    // Uniswap V3
    // https://etherscan.io/address/0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45
    (tx) => decodeUniV3('0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45', tx),
    // 1inch limit order V2
    // https://etherscan.io/address/0x119c71d3bbac22029622cbaec24854d3d32d2828,
    (tx) =>
        decode1InchLimitOrderV2(
            '0x119c71d3bbac22029622cbaec24854d3d32d2828',
            tx
        ),
    // 1inch swap V4
    // https://etherscan.io/address/0x1111111254fb6c44bac0bed2854e76f90643097d
    (tx) => decode1InchSwapV4('0x1111111254fb6c44bac0bed2854e76f90643097d', tx),

    // WETH
    // https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2 
    (tx) => decodeWrappedERC20Token('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', tx),
    
    (tx) => decodeERC20Token(tx),
]);

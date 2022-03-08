import { decodeCurveLiquidity } from '../../protocols/curve/pool/curve-pool.decoder';
import { decodeCurve } from '../../protocols/curve/swap/curve.decoder';
import { decodeERC20Token } from '../../protocols/erc20-token/erc20-token-tx.decoder';
import { decodeWrappedERC20Token } from '../../protocols/wrapped-erc20-token/erc20-token-tx.decoder';
import {combineTxDecoders, TxDecoder} from '../../core/decoder';
import {decode1InchLimitOrderV2} from '../../protocols/1inch/limit/1inch-limit-order-v2-tx.decoder';
import {decode1InchSwapV4} from '../../protocols/1inch/swap/1inch-swap-v2-tx.decoder';
import {decodeUniV2Like} from '../../protocols/uniswap-v2-like/uniswap-v2-tx.decoder';
import {decodeUniV3} from '../../protocols/uniswap-v3/uniswap-v3-tx.decoder';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Web3Service } from '../../helpers/web3/web3.service';
import PoolService from '../../protocols/1inch/pools/pool.service';
import { KnownEthProtocols as P } from './known-protocols';
import { decodeBalancer } from '../../protocols/balancer/swap/balancer.decoder';

export class EhtTransactionDecoder {
    readonly decode: TxDecoder;

    constructor(nodeUrl = 'https://web3-node-private.1inch.exchange/') {
        const oinctRpcProvider = new JsonRpcProvider(nodeUrl);
        const web3Svc = new Web3Service(nodeUrl);
        const poolService = new PoolService(web3Svc);

        this.decode = combineTxDecoders([
            (tx) => decodeUniV2Like(P.UniV2, tx),
            (tx) => decodeUniV3(P.UniV3, tx),
            (tx) => decode1InchLimitOrderV2(P.OInchLimit, tx),
            (tx) => decode1InchSwapV4(poolService, P.OInchSwap, tx),
            (tx) => decodeWrappedERC20Token(P.WETH, tx),
            (tx) => decodeCurve(P.CurveSwap, tx),
            (tx) => decodeBalancer(P.BalancerSwap, tx),
    
            // Curve swap via specific pool
            // List of pools: https://curve.fi/pools
            (tx) => decodeCurveLiquidity(oinctRpcProvider, tx),
            
            // ERC20, parses any ERC20 call
            // https://ethereum.org/en/developers/docs/standards/tokens/erc-20/ 
            (tx) => decodeERC20Token(tx),
        ]);        
    }
}
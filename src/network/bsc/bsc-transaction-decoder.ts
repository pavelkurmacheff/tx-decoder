import { combineTxDecoders, TxDecoder } from "src/core/decoder";
import { decodeUniV2Like } from "src/protocols/uniswap-v2-like/uniswap-v2-tx.decoder";
import { decodeERC20Token } from "../../protocols/erc20-token/erc20-token-tx.decoder";
import { KnownEthProtocols as P } from './known-protocols';

export class BscTransactionDecoder {
    readonly decode: TxDecoder;

    constructor() {
        this.decode = combineTxDecoders([
            (tx) => decodeUniV2Like(P.Pancake, tx),

            // ERC20, parses any ERC20 call
            // https://ethereum.org/en/developers/docs/standards/tokens/erc-20/ 
            (tx) => decodeERC20Token(tx),
        ]);        
    }
}
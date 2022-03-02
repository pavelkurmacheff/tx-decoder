decoder 1-1 smart contract
vendor (1inch. uni, ...) 1-many decoder 
network 


dex 
    1inch
        limit.decoder
        swap.decored
        limit.trace-decoder
        ...
    univ3 
        ... 
    univ2
        swap (smart contract)
            ABI
            decoder (transaction raw  - > transaction parsed)
            test 
        ...
    ...

network
  eth
    eth-transaction-decoder (references: univ2 univ3 1inch ...) (transaction raw  -> transaction parsed )
    eth-transaction-trace-decoder (references: univ2 univ3 1inch ...) (transaction id  -> trace parsing result )
    normalization zervice (transaction parsed -> Promise (transaction rich for UI | Error, trace parsed))
    parseEth (transaction raw  -> transaction rich for UI) = normalization zervice (eth-transaction-decoder (tx))
  bsc 
    bsc-transaction-decoder (references: pancake 1inch ....)
    normalization zervice (transaction parsed -> Promise (transaction rich for UI))

api
    ethParseForUI (transaction raw  -> transaction rich for UI )
    bscParserForUI (transaction raw  -> transaction rich for UI )
    ...
    parseForUI (ChainId, transaction raw -> transaction rich for UI)
    parseRaw (ChainId, transaction raw -> transaction parsed)

    encoder (transaction rich -> confimation screen template)

core 
  network code
  trace parsing result
  transaction raw ({to, from, calldata, gas, ...})
  transaction-payloads
    limit 
    swap ({fromToke, toToke, srcAmount, dstAmount, ....})
    unwrap
    ....
  transaction type (enum: swap , limit, permit ....)

  transaction parsed ({tag: ..} | {tag: ..} | ...)
  transaction rich for UI ( {type: limit, payload: limit} | {type: swap, payload: swap} | ....)
  ...



class ETHParserService {
    ctor(cfg) {
        this.svc1 = ....
        this.svc1 = ....
        this.svc1 = ....
    }
}


class ParserService {
    ctor() {
        this.ethSvc1 = ETHParserService()
        this.svc1 = BSCParserService()
    }

    parseForUI (ChainId, transaction raw -> transaction rich for UI)  {
        case of chainId...
        ethSvc1.
    }
    parseRaw (ChainId, transaction raw -> transaction parsed)
    encoder (transaction rich -> confimation screen template)
}



TransactionRaw {to, from, calldata, ..}
ChainId (ETH | BSC | ...)
    -- parse (ChainId, TxRaw) -->
transaction rich for UI 



TransactionRaw {to, from, calldata, ..}
ChainId (ETH | BSC | ...)
    -- parseRow (ChainId, TxRaw) -->
transaction parsed




parse(chainId: ChainId, txRaw):
    switch (chainId) {
        case ETH: 
            parseEth(tx)
        case ...
    }

parseEth(txRaw): RichTx
    parsed = eth-transaction-decoder(txRaw)
    return normalize (parsed)


 eth-transaction-decoder (txRaw): ParsedTx 
    for of decoders...



Glossary:
    ChainId - ETH | BSC | ... 
    TransactionRaw - raw tx with call data
    TransactionType - Swap | Limit | Permit | ....
    TransactionParsed - sum-type like {tag: TransactionType.Swap, payload: SwapPayload} | ...
    TransactionRich - same as TransactionParsed but with more data in payloads about tokens and formatted numbers
    Decoder - function/class which could parse TransactionRaw to TransactionParsed specific for each smart-contract
    Normallizer - class which transform TransactionParsed to TransactionRich. Should be one for each chain
    DEX - set of smart contracts from one vendor

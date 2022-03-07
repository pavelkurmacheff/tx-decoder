# Builder of transaction data for confirmation screen

## Supported transactions

### Approve

-   [x] Approve ERC20

### Swap

-   [x] 1inch V4 SwapWithPermit / Swap
-   [x] 1inch V4 UnoswapWithPermit / Unoswap
-   [x] 1inch V4 UniswapV3WithPermit / UniswapV3Swap
-   [x] 1inch V4 ClipperSwapWithPermit / ClipperSwap
-   [ ] Uniswap V2
-   [ ] Uniswap V3
-   [ ] Curve v2
-   [ ] Balancer V2

### Deposit / Withdraw

-   [ ] Deposit / Withdraw ERC20
-   [ ] 1inch Liquidity Porotocol Deposit / Withdraw
-   [ ] Uniswap V2 Deposit / Withdraw
-   [ ] Uniswap V3 Deposit / Withdraw
-   [ ] Curve V2 (all pools) Deposit / Withdraw
-   [ ] Balancer V2 Deposit / Withdraw
-   [ ] Compound Deposit / Withdraw
-   [ ] Maker DAO Deposit / Withdraw
-   [ ] AAVE Deposit / Withdraw
-   [ ] Dy/Dx Deposit / Withdraw

### Governance:

-   [ ] 1inch Stake / Unstake
-   [ ] 1inch Vote + aggregation vote + discard vote
-   [ ] 1inch Vote migrate (notify)
-   [ ] ENS / Gitcoin staking

### Reward

-   [ ] Claim 1inch
-   [ ] 1inch Governance reward
-   [ ] 1inch Referral reward
-   [ ] 1inch Staking reward

### Limit order

-   [x] 1inch Limit order cancel
-   [x] 1inch Limit order fill

## Try online

https://1inch.github.io/tx-decoder/build

**From:**

```json
{
    "from": "0x64741d0b9e376d75873c12e1b0cdccc26c3bcb04",
    "to": "0x1111111254fb6c44bac0bed2854e76f90643097d",
    "nonce": 194,
    "gasPrice": "0x1b7b430f2c",
    "gasLimit": "0x091d06",
    "value": "0x00",
    "data": "0x7c025200000000000000000000...00e26b9977"
}
```

**Into:**

```json
{
  "data": {
    "srcToken": {
      "symbol": "ETH"
      ...
    },
    "dstToken": {
      "symbol": "ATRI"
      ...
    },
    "dstAmount": {
      "type": "BigNumber",
      "hex": "0x015c6f"
    },
    "srcAmount": {
      "type": "BigNumber",
      "hex": "0x12dfb0cb5e880000"
    },
    "minReturnAmount": {
      "type": "BigNumber",
      "hex": "0x015ab1"
    }
  }
}
```

## Install

```
yarn add @1inch/tx-decoder
```

## Test coverage

| Statements                                                                                | Branches                                                                    | Functions                                                                        | Lines                                                                           |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| ![Statements](https://img.shields.io/badge/statements-98.2%25-brightgreen.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-75%25-red.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-73.68%25-red.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-98.2%25-brightgreen.svg?style=flat) |

## Quick start

```typescript
import {TxConfirmDataBuilder, Transaction} from '@1inch/tx-decoder';

/* Implement your solution to make RPC calls to blockchain */
const rpcCaller = (method, params) => {
    return window.ethereum.request({ method, params });
}

const oinchTxDecoder = new OinchTxDecoder({
    tokens: { ... }, // Result of https://tokens.1inch.io/v1.1/1
    tokenPrices: { ... } // Result of https://token-prices.1inch.io/v1.1/1
}, rpcCaller);

const txConfig: Transaction = {
    nonce: 383,
    gasPrice: '0x1da4f97c6e',
    gasLimit: '0x011150',
    from: '0x3b608c5243732903152e38f1dab1056a4a79b980',
    to: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
    value: '0x00',
    data: '0x095ea7b30000000000000000000000001111111254fb6c44bac0bed2854e76f90643097dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
};

const { data, dataArguments } = await oinchTxDecoder.decodeTxByEstimation(txConfig);

console.log('Data: ', data); // approve
console.log('Data arguments: ', dataArguments);
```

**Example of result:**

```json
{
    "config": {...}, // ContractMethodsDecodeConfig
    "txConfig": {...}, // Transaction
    "data": {
        "srcToken": {
            "symbol": "WTF",
            "name": "fees.wtf",
            "decimals": 18,
            "address": "0xa68dd8cb83097765263adad881af6eed479c4a33",
            "logoURI": "https://tokens.1inch.exchange/0xa68dd8cb83097765263adad881af6eed479c4a33.png"
        },
        "dstToken": {
            "symbol": "DAI",
            "name": "Dai Stablecoin",
            "decimals": 18,
            "address": "0x6b175474e89094c44da98b954eedeac495271d0f",
            "logoURI": "https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png",
            "eip2612": true
        },
        "dstAmount": {
            "type": "BigNumber",
            "hex": "0x35941a03eeab53c1"
        },
        "srcAmount": {
            "type": "BigNumber",
            "hex": "0x056bc75e2d63100000"
        },
        "minReturnAmount": {
            "type": "BigNumber",
            "hex": "0x90f0da5f2950eb"
        }
    },
    "dataArguments": {
        "caller": "0x220bdA5c8994804Ac96ebe4DF184d25e5c2196D4",
        "desc": [
            "0xA68Dd8cB83097765263AdAD881Af6eeD479c4a33",
            "0x6B175474E89094C44Da98b954EedeAC495271d0F",
            "0xAb293dcE330B92AA52bC2A7cD3816Edaa75F890B",
            "0xfb3c7eb936cAA12B5A884d612393969A557d4307",
            {
                "type": "BigNumber",
                "hex": "0x056bc75e2d63100000"
            },
            {
                "type": "BigNumber",
                "hex": "0x90f0da5f2950eb"
            },
            {
                "type": "BigNumber",
                "hex": "0x04"
            },
            "0x"
        ],
        "data": "0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000005e080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a4b757fed6000000000000000000000000ab293dce330b92aa52bc2a7cd3816edaa75f890b000000000000000000000000a68dd8cb83097765263adad881af6eed479c4a33000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000002dc6c0efcf8e86a2c6ab9be7fe00241651cb1b0a4983fb00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a4b757fed6000000000000000000000000efcf8e86a2c6ab9be7fe00241651cb1b0a4983fb000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000006b175474e89094c44da98b954eedeac495271d0f0000000000000000002dc6c0220bda5c8994804ac96ebe4df184d25e5c2196d4000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000024432ce0a7c00000000000000000000000000000000000000000000000000000000000000808000000000000000000000000000000000000000000000000000000000000044000000000000000000000000220bda5c8994804ac96ebe4df184d25e5c2196d400000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a4059712240000000000000000000000006b175474e89094c44da98b954eedeac495271d0f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000100000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004470bdb9470000000000000000000000006b175474e89094c44da98b954eedeac495271d0f000000000000000000000000000000000000000000000000389e154d2c239bed0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000016414284aab000000000000000000000000000000000000000000000000000000000000008080000000000000000000000000000000000000000000000000000000000000240000000000000000000000006b175474e89094c44da98b954eedeac495271d0f00000000000000000000000000000001000000000000000000000000000000010000000000000000000000006b175474e89094c44da98b954eedeac495271d0f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000044a9059cbb0000000000000000000000001111111254fb6c44bac0bed2854e76f90643097d00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
    }
}
```

> **For more examples see [unit-tests](./src/__tests__/1inch.decoder.test.ts)**

## Should be implemented by consumer

1. RPC method `eth_call`
2. List of tokens
3. List of tokens prices

## 1inch trade transactions and typed data

### Approve:

#### `approve`:

https://etherscan.io/tx/0xbd44b75afac45ef81af448c47b40d32ac705fe2d0354b39097f5ebfd62046ffe

| ##  | Name      | Type    | Data                                                                           |
| --- | --------- | ------- | ------------------------------------------------------------------------------ |
| 1   | \_spender | address | 0x1111111254fb6c44bAC0beD2854e76F90643097d                                     |
| 2   | \_value   | uint256 | 115792089237316195423570985008687907853269984665640564039457584007913129639935 |

---

### Swap:

#### `swap`:

https://etherscan.io/tx/0x698156119b255c33347bf844a0245dafdc39e871f3825ae5c24cc0019be748ed

| ##  | Name                 | Type    | Data                                       |
| --- | -------------------- | ------- | ------------------------------------------ |
| 1   | caller               | address | 0x220bdA5c8994804Ac96ebe4DF184d25e5c2196D4 |
| 2   | desc.srcToken        | address | 0xdAC17F958D2ee523a2206206994597C13D831ec7 |
| 3   | desc.dstToken        | address | 0x853d955aCEf822Db058eb8505911ED77F175b99e |
| 4   | desc.srcReceiver     | address | 0x220bdA5c8994804Ac96ebe4DF184d25e5c2196D4 |
| 5   | desc.dstReceiver     | address | 0x64741d0b9e376d75873C12e1B0cdccc26C3bCB04 |
| 6   | desc.amount          | uint256 | 114445791769                               |
| 7   | desc.minReturnAmount | uint256 | 113841200360986751251430                   |
| 8   | desc.flags           | uint256 | 4                                          |
| 9   | desc.permit          | bytes   | 0x                                         |
| 10  | data                 | bytes   | 0x                                         |

#### `clipperSwap`:

https://etherscan.io/tx/0xd0de097ca15040e588f8528162c01f5cad29fd7ea2168b2a503bc3633a4e8a6b

| ##  | Name      | Type    | Data                                       |
| --- | --------- | ------- | ------------------------------------------ |
| 1   | srcToken  | address | 0x6B175474E89094C44Da98b954EedeAC495271d0F |
| 2   | dstToken  | address | 0x0000000000000000000000000000000000000000 |
| 3   | amount    | uint256 | 2000000000000000000                        |
| 4   | minReturn | uint256 | 424579385213342                            |

#### `clipperSwapWithPermit`:

https://etherscan.io/tx/0x027dbf1121f509031eba135ef03a17f18bfa7195c035c73db4cfc94b55df522e

| ##  | Name      | Type    | Data                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --- | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | recipient | address | 0x3b608c5243732903152E38F1dAB1056A4A79b980                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 2   | srcToken  | address | 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 3   | dstToken  | address | 0x0000000000000000000000000000000000000000                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 4   | amount    | uint256 | 2000000                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 5   | minReturn | uint256 | 424703358412792                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 6   | permit    | bytes   | 0x0000000000000000000000003b608c5243732903152e38f1dab1056a4a79b9800000000000000000000000001111111254fb6c44bac0bed2854e76f90643097dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000618d1d77000000000000000000000000000000000000000000000000000000000000001b8576a8af192b84d1e122d82eeddeb2fd0b006381926590f471fd23247aeeeb09010cad06bbbf7aa344d311a13ed14419a913f2015c88600dbbd579b180bf6d36 |

#### `unoswap`:

https://etherscan.io/tx/0x179a4f63854d6e6f5d18ec1bf31d47c4debb6a7c32a094a815e4c0eeb25f4c2d

| ##  | Name      | Type      | Data                                                               |
| --- | --------- | --------- | ------------------------------------------------------------------ |
| 1   | srcToken  | address   | 0x111111111117dC0aa78b770fA6A738034120C302                         |
| 2   | amount    | uint256   | 1000000000000000000                                                |
| 3   | minReturn | uint256   | 927972006385351                                                    |
| 4   | pools     | bytes32[] | 0x40000000000000003b6d034086f518368e0d49d5916e2bd9eb162e9952b7b04d |

#### `unoswapWithPermit`:

https://etherscan.io/tx/0xe970c4f72e5d4a07d4fc52df338e75a082c3b4b835e40d7e4ea2df567b066de3

| ##  | Name      | Type      | Data                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --- | --------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | srcToken  | address   | 0x19042021329FDdcFBea5f934FB5b2670C91F7D20                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 2   | amount    | uint256   | 100000                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 3   | minReturn | uint256   | 224171088701284                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 4   | pools     | bytes32[] | 0x40000000000000003b6d0340ec9eb7af42207a8da12a04ee4b2f2b4b9cb43bd5                                                                                                                                                                                                                                                                                                                                                                                                 |
| 5   | permit    | bytes     | 0x0000000000000000000000003b608c5243732903152e38f1dab1056a4a79b9800000000000000000000000001111111254fb6c44bac0bed2854e76f90643097dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000618d1e72000000000000000000000000000000000000000000000000000000000000001bb71d754ebc94ea2fe86bd06f941b4607b58433d29a4bded6f42c9ea789e997cc161711ec3aa97cc6af741c0f3e804398198db0d50f701fe42889509a5e0d8fb9 |

#### `uniswapV3Swap`:

https://etherscan.io/tx/0xc0302a2f43cf86c04cfa8c67025da08bbc53372cc313e87ba0d32febff2f517c

| ##  | Name      | Type      | Data                                                                          |
| --- | --------- | --------- | ----------------------------------------------------------------------------- |
| 1   | amount    | uint256   | 100000000000000000                                                            |
| 2   | minReturn | uint256   | 237601593079374                                                               |
| 3   | pools     | bytes32[] | 14474011154664524427946373126746238925103584872995555959354853311969479154385 |

#### `uniswapV3SwapToWithPermit`:

https://etherscan.io/tx/0x1b251d13fd530ddf2d4125631c71ee07b56568c1a6cf55a8e53a29a599b81e92

| ##  | Name      | Type      | Data                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --- | --------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | recipient | address   | 0x3b608c5243732903152E38F1dAB1056A4A79b980                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 2   | srcToken  | address   | 0x111111111117dC0aa78b770fA6A738034120C302                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 3   | amount    | uint256   | 9976048355247503000                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 4   | minReturn | uint256   | 3195544757858711653                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 5   | pools     | bytes32[] | 1206715178360966712196380527409201132437477346116, 57896044618658097711785492505541897408525400718342232749193727702159444919374                                                                                                                                                                                                                                                                                                                                   |
| 6   | permit    | bytes     | 0x0000000000000000000000003b608c5243732903152e38f1dab1056a4a79b9800000000000000000000000001111111254fb6c44bac0bed2854e76f90643097dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000006187dd53000000000000000000000000000000000000000000000000000000000000001cdae2d3851069237b24b459c7c732ce95d1ed8519fa084ab44f167f356c1310134e9f3100eee9ec3d6b3631d82367ea69af53f5a626596da45c6c441749c376d6 |

---

### Permit typed data:

#### `regular permit`:

```json
{
    "types": {
        "EIP712Domain": [
            {
                "name": "name",
                "type": "string"
            },
            {
                "name": "version",
                "type": "string"
            },
            {
                "name": "chainId",
                "type": "uint256"
            },
            {
                "name": "verifyingContract",
                "type": "address"
            }
        ],
        "Permit": [
            {
                "name": "owner",
                "type": "address"
            },
            {
                "name": "spender",
                "type": "address"
            },
            {
                "name": "value",
                "type": "uint256"
            },
            {
                "name": "nonce",
                "type": "uint256"
            },
            {
                "name": "deadline",
                "type": "uint256"
            }
        ]
    },
    "primaryType": "Permit",
    "domain": {
        "name": "1INCH Token",
        "chainId": 1,
        "verifyingContract": "0x111111111117dc0aa78b770fa6a738034120c302",
        "version": "1"
    },
    "message": {
        "deadline": 1636957129,
        "nonce": 3,
        "spender": "0x1111111254fb6c44bac0bed2854e76f90643097d",
        "owner": "0xfb3c7eb936caa12b5a884d612393969a557d4307",
        "value": "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
}
```

#### `DAI-like permit`:

```json
{
    "types": {
        "EIP712Domain": [
            {
                "name": "name",
                "type": "string"
            },
            {
                "name": "version",
                "type": "string"
            },
            {
                "name": "chainId",
                "type": "uint256"
            },
            {
                "name": "verifyingContract",
                "type": "address"
            }
        ],
        "Permit": [
            {
                "name": "holder",
                "type": "address"
            },
            {
                "name": "spender",
                "type": "address"
            },
            {
                "name": "nonce",
                "type": "uint256"
            },
            {
                "name": "expiry",
                "type": "uint256"
            },
            {
                "name": "allowed",
                "type": "bool"
            }
        ]
    },
    "primaryType": "Permit",
    "domain": {
        "name": "renBTC",
        "chainId": 1,
        "verifyingContract": "0xeb4c2781e4eba804ce9a9803c67d0893436bb27d",
        "version": "1"
    },
    "message": {
        "expiry": 1636957217,
        "nonce": 0,
        "spender": "0x1111111254fb6c44bac0bed2854e76f90643097d",
        "holder": "0xfb3c7eb936caa12b5a884d612393969a557d4307",
        "allowed": true
    }
}
```

---

### Limit order typed data:

#### `Limit order`:

```json
{
    "primaryType": "Order",
    "types": {
        "EIP712Domain": [
            {
                "name": "name",
                "type": "string"
            },
            {
                "name": "version",
                "type": "string"
            },
            {
                "name": "chainId",
                "type": "uint256"
            },
            {
                "name": "verifyingContract",
                "type": "address"
            }
        ],
        "Order": [
            {
                "name": "salt",
                "type": "uint256"
            },
            {
                "name": "makerAsset",
                "type": "address"
            },
            {
                "name": "takerAsset",
                "type": "address"
            },
            {
                "name": "makerAssetData",
                "type": "bytes"
            },
            {
                "name": "takerAssetData",
                "type": "bytes"
            },
            {
                "name": "getMakerAmount",
                "type": "bytes"
            },
            {
                "name": "getTakerAmount",
                "type": "bytes"
            },
            {
                "name": "predicate",
                "type": "bytes"
            },
            {
                "name": "permit",
                "type": "bytes"
            },
            {
                "name": "interaction",
                "type": "bytes"
            }
        ]
    },
    "domain": {
        "name": "1inch Limit Order Protocol",
        "version": "1",
        "chainId": 1,
        "verifyingContract": "0x3ef51736315f52d568d6d2cf289419b9cfffe782"
    },
    "message": {
        "salt": "1502377947330",
        "makerAsset": "0x6b175474e89094c44da98b954eedeac495271d0f",
        "takerAsset": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        "makerAssetData": "0x23b872dd000000000000000000000000fb3c7eb936caa12b5a884d612393969a557d430700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001bc16d674ec80000",
        "takerAssetData": "0x23b872dd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fb3c7eb936caa12b5a884d612393969a557d43070000000000000000000000000000000000000000000000000002d79883d20000",
        "getMakerAmount": "0xf4a215c30000000000000000000000000000000000000000000000001bc16d674ec800000000000000000000000000000000000000000000000000000002d79883d20000",
        "getTakerAmount": "0x296637bf0000000000000000000000000000000000000000000000001bc16d674ec800000000000000000000000000000000000000000000000000000002d79883d20000",
        "predicate": "0x961d5b1e000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000003ef51736315f52d568d6d2cf289419b9cfffe7820000000000000000000000003ef51736315f52d568d6d2cf289419b9cfffe7820000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000044cf6fc6e3000000000000000000000000fb3c7eb936caa12b5a884d612393969a557d4307000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002463592c2b000000000000000000000000000000000000000000000000000000006191f0a000000000000000000000000000000000000000000000000000000000",
        "permit": "0x",
        "interaction": "0x"
    }
}
```

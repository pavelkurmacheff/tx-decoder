import { getTransactionByHash, runTransaction } from "./1inch-web3-rpc.utils";
import { TransactionRaw } from "../../core/transaction-raw";
import UniswapRouterV2BI from '../../protocols/uniswap-v3/UNI3_ROUTER_V2.json';
import { BigNumber } from "ethers";
import { Interface } from "ethers/lib/utils";

describe('Transaction logs test', () => {
    it('getTransactionByHash', async () => {
        const result = await getTransactionByHash('0x1b251d13fd530ddf2d4125631c71ee07b56568c1a6cf55a8e53a29a599b81e92');
        
        expect(result).toBeDefined();;
    });


    it('est', async () => {
        const iface = new Interface(UniswapRouterV2BI);
        
        const tx: TransactionRaw = {
            nonce: 366,
            gasPrice: BigNumber.from('0x161000aa70'),
            gasLimit: BigNumber.from('0x04734d'),
            from: '0x6e797B975B99a20d539786e5c4a32218a3d6d80E',
            to: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
            value: '0x0',
            data: '0x5ae401dc000000000000000000000000000000000000000000000000000000006221078f00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e4472b43f30000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000003597d100000000000000000000000000000000000000000000000000000000000000800000000000000000000000006e797b975b99a20d539786e5c4a32218a3d6d80e0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800000000000000000000000000000000000000000000000000000000'
        };
        try {
            const result = await runTransaction(tx, UniswapRouterV2BI);
            expect(result).toBeDefined();
            iface.decodeFunctionResult('swapExactTokensForTokens', result);
        } catch(e: unknown) {
            console.log(e);
        }
    });
});
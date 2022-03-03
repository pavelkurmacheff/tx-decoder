import { loadTokensMap } from "../../utils/1inch.utils";
import { ChainId } from "../../core/chain-id";
import {Web3Service } from '../../helpers/web3/web3.service';
import { CustomTokensService } from "../../helpers/tokens/custom-tokens.service";
import { NormalizationService } from "./normalization.service";
import { BigNumber } from "ethers";
import { TransactionRaw } from "../../core/transaction-raw";
import { ehtTransactionDecoder } from "./eth-transaction-decoder";
import { TransactionType } from "../../core/transaction-type";

describe('NormalizationService test', () => {
    let tokesSvc: CustomTokensService;

    beforeAll(async () => {
        const chain = ChainId.Ethereum;
        const nodeUrl = 'https://web3-node-private.1inch.exchange/';
        const result = await loadTokensMap(chain);
        const web3Svc = new Web3Service(nodeUrl);
        tokesSvc = new CustomTokensService(result, web3Svc, chain);
    });

    it('swap ETH to USDC on ETH-chain\'s UniswapV3', async () => {
        const normSvc = new NormalizationService(tokesSvc);

        const rawTx: TransactionRaw = {
            data: '0x5ae401dc000000000000000000000000000000000000000000000000000000006220e14800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e404e45aaf000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000006e797b975b99a20d539786e5c4a32218a3d6d80e000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000000000000101d33e6000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            from: '0x6e797B975B99a20d539786e5c4a32218a3d6d80E',
            gasLimit: BigNumber.from('0x2c137'),
            gasPrice: BigNumber.from('0x163F29F8A1'),
            to: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
            value: '3000000000000000'
        }

        const parseRes = ehtTransactionDecoder(rawTx);
        if (parseRes.tag !== 'Success') { throw 'Impossible'; }
        
        const r = await normSvc.normalize(parseRes.tx);
        if (r.tag == TransactionType.Multicall) {
            const call = r.payload[0];
            if (call.tag == TransactionType.SwapExactInput) {
                expect(call.payload.dstToken.symbol).toEqual('USDC');
                expect(call.payload.srcAmount).toEqual('100000000000000000');                
            } else {
                expect(false).toBeTruthy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });
});

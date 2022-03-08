import {loadTokensMap} from '../../utils/1inch.utils';
import {ChainId} from '../../core/chain-id';
import {Web3Service} from '../../helpers/web3/web3.service';
import {CustomTokensService} from '../../helpers/tokens/custom-tokens.service';
import {NormalizationService} from './normalization.service';
import {BigNumber} from 'ethers';
import {TransactionRaw} from '../../core/transaction-raw';
import {EhtTransactionDecoder} from './eth-transaction-decoder';
import {TransactionType} from '../../core/transaction-type';
import PoolService from '../../dex/1inch/pools/pool.service';

describe('NormalizationService test', () => {
    let tokesSvc: CustomTokensService;
    let poolSvc: PoolService;
    let decoder: EhtTransactionDecoder;
    
    beforeAll(async () => {
        const chain = ChainId.Ethereum;
        const nodeUrl = 'https://web3-node-private.1inch.exchange/';
        const result = await loadTokensMap(chain);
        const web3Svc = new Web3Service(nodeUrl);
        tokesSvc = new CustomTokensService(result, web3Svc, chain);
        poolSvc = new PoolService(web3Svc);
        decoder = new EhtTransactionDecoder(nodeUrl);
    });

    it("swap ETH to USDC on ETH-chain's UniswapV3", async () => {
        const normSvc = new NormalizationService(tokesSvc);

        const rawTx: TransactionRaw = {
            data: '0x5ae401dc000000000000000000000000000000000000000000000000000000006220e14800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e404e45aaf000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000006e797b975b99a20d539786e5c4a32218a3d6d80e000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000000000000101d33e6000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            from: '0x6e797B975B99a20d539786e5c4a32218a3d6d80E',
            gasLimit: BigNumber.from('0x2c137'),
            gasPrice: BigNumber.from('0x163F29F8A1'),
            to: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
            value: '3000000000000000',
        };

        const parseRes = await decoder.decode(rawTx);
        if (parseRes.tag !== 'Success') {
            throw 'Impossible';
        }

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

    it("permit UNI and swap 1 UNI to some USDC on ETH-chain's UniswapV3 ", async () => {
        const normSvc = new NormalizationService(tokesSvc);

        const rawTx: TransactionRaw = {
            data: '0x5ae401dc000000000000000000000000000000000000000000000000000000006220e58c000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000c4f3995c670000000000000000000000001f9840a85d5af5bf1d1762f925bdaddc4201f9840000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000006220ea0f000000000000000000000000000000000000000000000000000000000000001c66261b818f0393973b584a1ccb8052de42e9b693dad2d2d68ee0e6158fef16a079cb8bc167b8bcfac0e79dea93cfb4d5985ead46abaee7617b7778ceb5de71550000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e404e45aaf0000000000000000000000001f9840a85d5af5bf1d1762f925bdaddc4201f984000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000006e797b975b99a20d539786e5c4a32218a3d6d80e0000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000774269000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            from: '0x6e797B975B99a20d539786e5c4a32218a3d6d80E',
            gasLimit: BigNumber.from('0x2c137'),
            gasPrice: BigNumber.from('0x163F29F8A1'),
            to: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
            value: '0',
        };

        const parseRes = await decoder.decode(rawTx);
        if (parseRes.tag !== 'Success') {
            throw 'Impossible';
        }

        const r = await normSvc.normalize(parseRes.tx);
        if (r.tag == TransactionType.Multicall) {
            const permit = r.payload[0];
            expect(permit.tag).toEqual(TransactionType.Approve);

            const call = r.payload[1];
            if (call.tag == TransactionType.SwapExactInput) {
                expect(call.payload.srcToken.symbol).toEqual('UNI');
                expect(call.payload.dstToken.symbol).toEqual('USDC');
                expect(call.payload.srcAmount).toEqual('1000000000000000000');
                expect(call.payload.minDstAmount).toBeDefined();
            } else {
                expect(false).toBeTruthy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });
});

import {loadTokensMap} from '../../utils/1inch.utils';
import {ChainId} from '../../core/chain-id';
import {Web3Service} from '../../helpers/web3/web3.service';
import {CustomTokensService} from '../../helpers/tokens/custom-tokens.service';
import {NormalizationService} from './normalization.service';
import {EstimationService} from './estimation.service';
import PoolService from '../../helpers/pools/pool.service';
import { TransactionRaw } from '../../core/transaction-raw';
import { BigNumber } from 'ethers';
import { ehtTransactionDecoder } from './eth-transaction-decoder';

describe('EstimationService test', () => {
    let normSvc: NormalizationService;
    let estSvc: EstimationService;

    beforeAll(async () => {
        const chain = ChainId.Ethereum;
        const nodeUrl = 'https://web3-node-private.1inch.exchange/';
        const result = await loadTokensMap(chain);
        const web3Svc = new Web3Service(nodeUrl);
        const tokesSvc = new CustomTokensService(result, web3Svc, chain);
        const poolSvc = new PoolService(web3Svc);
        normSvc = new NormalizationService(tokesSvc, poolSvc);
        estSvc = new EstimationService();
    });

    it("Estimate 1inch swap return", async () => {
        const rawTx: TransactionRaw = {
            data: '0x2e95b6c80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016345785d8a0000000000000000000000000000000000000000000000000002d5069e44d5aa17350000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000180000000000000003b6d0340e4ebd836832f1a8a81641111a5b081a2f90b9430e26b9977',
            from: '0x6e797B975B99a20d539786e5c4a32218a3d6d80E',
            to: '0x1111111254fb6c44bAC0beD2854e76F90643097d',
            gasLimit: BigNumber.from('0x2c137'),
            gasPrice: BigNumber.from('0x163F29F8A1'),
            value: '100000000000000000',
        };

        const parseRes = ehtTransactionDecoder(rawTx);
        if (parseRes.tag !== 'Success') {
            throw 'Impossible';
        }

        const r = await normSvc.normalize(parseRes.tx);
        const er = await estSvc.estimate(r);

        console.log(er);
    });
});

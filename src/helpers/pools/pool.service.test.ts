import {Web3Service} from '../web3/web3.service';
import PoolService from './pool.service';

const nodeUrl = 'https://web3-node-private.1inch.exchange/';

describe('CustomTokensService test', () => {
    let poolService: PoolService;

    beforeAll(() => {
        const web3Svc = new Web3Service(nodeUrl);
        poolService = new PoolService(web3Svc);
    });
    it('PoolService shoold get token addres from unoswap pool', async () => {
        const tokenAddress = await poolService.getDestTokenAddressOfUnoSwap(
            '0x80000000000000003b6d0340c0bf97bffa94a50502265c579a3b7086d081664b'
        );
        expect(tokenAddress).toBeDefined();
        expect(tokenAddress).toEqual(
            '0x990f341946a3fdb507ae7e52d17851b87168017c'
        );
    });
});

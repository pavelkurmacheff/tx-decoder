import { loadTokensMap } from "../../utils/1inch.utils";
import { ChainId } from "../../core/chain-id";
import { Web3Service } from "../web3/web3.service";
import { CustomTokensService } from "./custom-tokens.service";

const OInchAddr = '0x111111111117dc0aa78b770fa6a738034120c302';

describe('CustomTokensService test', () => {
    it('CustomTokensService get inch token', async () => {
        const chain = ChainId.Ethereum;
        const nodeUrl = 'https://web3-node-private.1inch.exchange/';
        const result = await loadTokensMap(chain);
        const web3Svc = new Web3Service(nodeUrl);
        const tokesSvc = new CustomTokensService(result, web3Svc, chain);

        const token = await tokesSvc.getTokenByAddress(OInchAddr);
        expect(token).toBeDefined();
        expect(token?.symbol).toEqual('1INCH');
    });
});

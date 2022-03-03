import { ChainId } from "../core/chain-id";
import { loadTokens, loadTokensMap, loadTokensPrice, loadTokensPriceMap } from "./1inch.utils";

const OInchAddr = '0x111111111117dc0aa78b770fa6a738034120c302';

describe('Utils test', () => {
    it('loadTokensLib', async () => {
        const result = await loadTokens(ChainId.Ethereum);
        
        expect(result).toBeDefined();
        expect(result[OInchAddr].symbol).toEqual('1INCH');
    });

    it('loadTokensMap', async () => {
        const result = await loadTokensMap(ChainId.Ethereum);
        
        expect(result).toBeDefined();
        const symbol = result.get(OInchAddr)?.symbol || '';
        expect(symbol).toEqual('1INCH');
    });

    it('loadTokensPrice', async () => {
        const result = await loadTokensPrice(ChainId.Ethereum);
        
        expect(result).toBeDefined();
        expect(result[OInchAddr]).toBeDefined();
    });

    it('loadTokensPriceMap', async () => {
        const result = await loadTokensPriceMap(ChainId.Ethereum);
        
        expect(result).toBeDefined();
        expect(result.get(OInchAddr)).toBeDefined();
    });
});


import { getTransactionByHash } from "./1inch-transaction-logs.utils";

describe('Transaction logs test', () => {
    it('getTransactionByHash', async () => {
        const result = await getTransactionByHash('0x1b251d13fd530ddf2d4125631c71ee07b56568c1a6cf55a8e53a29a599b81e92');
        
        expect(result).toBeDefined();;
    });
});
import { TransactionRich } from "../../core/transaction-rich";
import { TransactionType } from "../../core/transaction-type";
import { runTransaction } from "../../utils/1inch-web3-rpc.utils";

export class EstimationService {
    async estimate(tx: TransactionRich): Promise<TransactionRich> {
        switch(tx.tag) {
            case TransactionType.SwapExactInput: {
                const res = await runTransaction(tx.raw, tx.functionInfo.abi);
                const estimated = tx.functionInfo.responseParser ? tx.functionInfo.responseParser(res) : undefined;
                return {
                    ...tx,
                    payload: {
                        ...(tx.payload),
                        dstAmountEstimated: estimated?.returnAmount.toHexString()
                    }
                }
            }
            case TransactionType.SwapExactOutput: {
                const res = await runTransaction(tx.raw, tx.functionInfo.abi);
                const estimated = tx.functionInfo.responseParser ? tx.functionInfo.responseParser(res) : undefined;
                return {
                    ...tx,
                    payload: {
                        ...(tx.payload),
                        srcAmountEstimated: estimated?.returnAmount.toHexString()
                    }
                }
            }
            case TransactionType.SwapThroughPool: {
                const res = await runTransaction(tx.raw, tx.functionInfo.abi);
                const estimated = tx.functionInfo.responseParser ? tx.functionInfo.responseParser(res) : undefined;
                return {
                    ...tx,
                    payload: {
                        ...(tx.payload),
                        dstAmountEstimated: estimated?.returnAmount.toHexString()
                    }
                }
            }
            default:
                return tx;
        }
    }
}
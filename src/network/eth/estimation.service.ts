import { TransactionRich } from "../../core/transaction-rich";
import { TransactionType } from "../../core/transaction-type";
import { runTransaction } from "../../utils/1inch-web3-rpc.utils";

export class EstimationService {
    async estimate(tx: TransactionRich): Promise<TransactionRich> {
        switch(tx.tag) {
            case TransactionType.SwapExactInput: {
                const res = await runTransaction(tx.raw, tx.functionInfo.abi);

                console.log(res);

                return {
                    ...tx,
                    payload: {
                        ...(tx.payload),
                        dstAmountEstimated: res.returnAmount
                    }
                }
            }
            case TransactionType.SwapExactOutput: {
                const res = await runTransaction(tx.raw, tx.functionInfo.abi);

                console.log(res);

                return {
                    ...tx,
                    payload: {
                        ...(tx.payload),
                        srcAmountEstimated: res.returnAmount
                    }
                }
            }
            case TransactionType.SwapThroughPool: {
                const res = await runTransaction(tx.raw, tx.functionInfo.abi);

                console.log(res);
                
                return {
                    ...tx,
                    payload: {
                        ...(tx.payload),
                        dstAmountEstimated: res.returnAmount
                    }
                }
            }
                
        }
        throw 'todo';
    }
}
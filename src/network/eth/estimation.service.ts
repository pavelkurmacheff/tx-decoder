import { TransactionEstimated } from "src/core/transaction-estimated";
import { TransactionRich } from "src/core/transaction-rich";

class EstimationService {

    estimate(tx: TransactionRich): Promise<TransactionEstimated> {
        throw 'todo';
    }
}
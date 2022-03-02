import { BigNumber } from "ethers";

export interface TransactionRaw {
    from: string;
    to: string;
    data: string;
    value: string;
    gasPrice: BigNumber;
    gasLimit: BigNumber;
    nonce?: number;
}
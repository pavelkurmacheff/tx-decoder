import { BigNumber } from '@ethersproject/bignumber';

export interface ApproveTxPayload {
    tokenAddress: string;
    value: BigNumber;
    time?: number;
}

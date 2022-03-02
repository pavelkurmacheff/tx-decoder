import { BigNumber } from '@ethersproject/bignumber';
import { Token } from './token';

export interface ApproveTxRich {
    token: Token;
    value: BigNumber;
    time?: number;
}

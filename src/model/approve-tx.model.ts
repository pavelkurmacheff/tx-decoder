import { Token } from './common.model';
import { BigNumber } from '@ethersproject/bignumber';

export interface ApproveTxDecoded {
    token: Token;
    value: BigNumber;
    time?: number;
}

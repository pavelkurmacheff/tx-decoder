import { BigNumber } from '@ethersproject/bignumber';
import { Token } from '../token';

export interface ApproveRich {
    token: Token;
    value: BigNumber;
    time?: number;
}

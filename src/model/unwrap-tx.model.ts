import { Token } from './common.model';
import { BigNumber } from '@ethersproject/bignumber';

export interface UnwrapTxDecoded {
    readonly token: Token;
    readonly amount?: BigNumber;
    readonly minReturnAmount?: BigNumber;
    readonly error?: Error;
}


import {Token} from '../token';

export interface ApproveRich {
    toWhomAddress: string;
    token: Token;
    value: string;
    time?: number;
}

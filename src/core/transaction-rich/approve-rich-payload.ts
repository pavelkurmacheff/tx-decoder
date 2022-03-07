import {Token} from '../token';

export interface ApproveRichTxPayload {
    toWhomAddress: string;
    token: Token;
    value: string;
    time?: number;
}

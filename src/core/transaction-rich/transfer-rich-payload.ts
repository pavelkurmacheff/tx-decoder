import {Token} from '../token';

export interface TransferRichTxPayload {
    srcAddress: string;
    dstAddress: string;
    token: Token;
    value: string;
}

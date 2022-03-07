import {Token} from '../token';

export interface ApproveRich {
    token: Token;
    value: string;
    time?: number;
}

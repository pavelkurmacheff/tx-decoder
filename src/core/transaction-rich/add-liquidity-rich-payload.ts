import { Token } from "../token";

export interface AddLiquidityRichPayload {
    tokenAmount: {token: Token, amount: string}[]
}
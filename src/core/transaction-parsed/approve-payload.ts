export interface ApproveTxPayload {
    toWhomAddress: string;
    tokenAddress: string;
    value: string;
    time?: number;
}

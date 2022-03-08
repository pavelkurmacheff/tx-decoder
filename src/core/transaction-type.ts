export enum TransactionType {
    Approve,

    // TODO: Rename to wrap/unwrap
    Deposit,
    Withdraw,

    Transfer,
    Unwrap,
    SwapExactInput,
    SwapExactOutput,
    LimitOrderFill,
    LimitOrderCancel,
    Multicall,
    AddLiquidity,
    RemoveLiquidity,
}

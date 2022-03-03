export interface UnoswapTxItemData {
    srcToken: string;
    amount: string;
    minReturn: string;
    pools: BigNumber[];
}

export class UnoswapTxDecoder implements TxDecoder<UnoswapTxItemData> {
    constructor(
        readonly resources: Web3Resources,
        readonly rpcCaller: BlockchainRpcCaller,
        readonly decodeInfo: DecodeInfo,
        readonly txData: UnoswapTxItemData,
        readonly chainId: NetworkEnum
    ) {}

    async decodeByConfig(txConfig: Transaction): Promise<SwapTxDecoded> {
        const {value: dstAmount, error} = await getDestAmountViaEstimation(
            this,
            txConfig
        );
        const {
            srcToken: srcTokenAddress,
            amount: srcAmount,
            minReturn: minReturnAmount,
            pools,
        } = this.txData;

        const dstTokenAddress = await getDestTokenAddressOfUnoSwap(
            pools[pools.length - 1],
            this.rpcCaller
        );

        return decodeSwapTx(
            {
                srcTokenAddress,
                dstTokenAddress,
                srcAmount,
                minReturnAmount,
                dstAmount,
                error,
            },
            this.resources
        );
    }

    async decodeByLogs(receipt: TransactionReceipt): Promise<SwapTxDecoded> {
        const dstAmount = getReturnAmountFromLogs(receipt);

        const {
            srcToken: srcTokenAddress,
            amount: srcAmount,
            minReturn: minReturnAmount,
            pools,
        } = this.txData;

        const dstTokenAddress = await getDestTokenAddressOfUnoSwap(
            pools[pools.length - 1],
            this.rpcCaller
        );

        return decodeSwapTx(
            {
                srcTokenAddress,
                dstTokenAddress,
                srcAmount,
                minReturnAmount,
                dstAmount,
            },
            this.resources
        );
    }
}

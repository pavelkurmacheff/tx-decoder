import {Transaction} from '../model/common.model';
import {TransactionReceipt} from '@ethersproject/abstract-provider';
import {BigNumber} from '@ethersproject/bignumber';
import {TxDecoder} from '../decoders/base-tx.decoder';

export function getDestAmountViaEstimation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {rpcCaller, decodeInfo}: TxDecoder<any>,
    txConfig: Transaction
): Promise<{ value: BigNumber, error?: Error }> {
    const { from, to, value, data } = txConfig;
    const request = {
        from, to, data,
        value: ['0', '0x', '0x0', '0x00'].includes(value)
            ? '0x0'
            : BigNumber.from(value).toHexString(),
    };

    return rpcCaller.call<string>('eth_call', [request, 'latest'])
        .then(response => {
            return {
                value: BigNumber.from(
                    decodeInfo.iface.decodeFunctionResult(decodeInfo.methodSelector, response)['returnAmount']
                ),
            };
        }).catch(error => {
            return { value: BigNumber.from(0), error };
        });
}

export function getReturnAmountFromLogs(receipt: TransactionReceipt): BigNumber {
    const walletAddress = receipt.from.toLowerCase();
    const transferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
    const withdrawalTopic = '0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65';

    const transferEvent = receipt.logs.find(log => {
        const eventTopic = log.topics[0];
        const receiverAddress = ('0x' + (log.topics[2] || '').slice(26));

        return eventTopic === transferTopic && receiverAddress.toLowerCase() === walletAddress;
    });

    const withdrawalEvent = receipt.logs.find(log => {
        const eventTopic = log.topics[0];

        return eventTopic === withdrawalTopic;
    });

    return BigNumber.from(
        transferEvent
            ? transferEvent.data
            : withdrawalEvent?.data || '0'
    );
}

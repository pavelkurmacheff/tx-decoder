import { BigNumber } from '@ethersproject/bignumber';
import { DecoderResult, MulticallParam, PermitTx, SwapTx, TxType, UnwrapTx } from '../../types';

import { normalizeEstimation } from './estimation';

export function getTxTypeByCallData(
    calldata: string,
    abiDecoder: unknown,
): (SwapTx | UnwrapTx | PermitTx)[] {
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const result: DecoderResult = abiDecoder.decodeMethod(calldata);
        if (result.name === 'multicall') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return parseMulticall(result.params, abiDecoder).map(normalizeDecoderResult).filter(data => !!data);
        }
        return [];
    } catch (e) {
        return [];
    }
}

export function parseMulticall(params: MulticallParam[], abiDecoder: unknown): DecoderResult[] {
    try {
        const dataInput = params.find((param) => param.name === 'data');
        if (!dataInput) {
            return [];
        }
        if (dataInput.type === 'bytes[]') {
            const result: DecoderResult[] = [];
            for (const v of dataInput.value) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const r: DecoderResult = abiDecoder.decodeMethod(v);
                result.push(r);
            }
            return result;
        }
        return [];
    } catch (e) {
        return [];
    }
}


export function normalizeDecoderResult(data: DecoderResult): SwapTx | PermitTx | UnwrapTx | undefined {
    switch (data.name) {
        case 'swapTokensForExactTokens':
            return normalizeSwapTokensForExactTokens(data);
        case 'swapExactTokensForTokens':
            return normalizeSwapExactTokensForTokens(data);
        case 'exactInputSingle':
            return normalizeExactInputSingle(data);
        case 'exactOutputSingle':
            return normalizeExactOutputSingle(data);
        case 'unwrapWETH9':
            return normailzeUnwrapWETH9(data);
        case 'selfPermitAllowed':
            return normalizeSelfPermitAllowed(data);
    }
    return undefined;
}

export function normalizeSwapExactTokensForTokens(data: DecoderResult): SwapTx | undefined {
    if (data.params && data.params.length > 3
        && data.params[2].value.length == 2) {
        return {
            name: data.name,
            type: TxType.SWAP_INPUT,
            params: {
                srcAmount: BigNumber.from(data.params[0].value),
                minReturnAmount: BigNumber.from(data.params[1].value),
                srcTokenAddress: data.params[2].value[0],
                dstTokenAddress: data.params[2].value[1],
            },
        };
    }
    return undefined;
}

export function normalizeSwapTokensForExactTokens(data: DecoderResult): SwapTx | undefined {
    if (data.params && data.params.length > 3
        && data.params[2].value.length == 2) {
        return {
            name: data.name,
            type: TxType.SWAP_OUTPUT,
            params: {
                dstAmount: BigNumber.from(data.params[0].value),
                amountInMaximum: BigNumber.from(data.params[1].value),
                srcTokenAddress: data.params[2].value[0],
                dstTokenAddress: data.params[2].value[1],
            },
        };
    }
    return undefined;
}

export function normailzeUnwrapWETH9(data: DecoderResult): UnwrapTx | undefined {
    if (data.params && data.params.length > 1) {
        return {
            name: data.name,
            type: TxType.UNWRAP,
            params: {
                minReturnAmount: BigNumber.from(data.params[0].value),
                recipient: data.params[1].value as string,
            },
        };
    }
    return undefined;
}

export function normalizeExactInputSingle(data: DecoderResult): SwapTx | undefined {
    if (data.params && data.params.length == 1 && data.params[0].value.length == 7) {
        return {
            name: data.name,
            type: TxType.SWAP_INPUT,
            params: {
                srcTokenAddress: data.params[0].value[0],
                dstTokenAddress: data.params[0].value[1],
                srcAmount: BigNumber.from(data.params[0].value[4]),
                minReturnAmount: BigNumber.from(data.params[0].value[5]),
            },
        };
    }
    return undefined;
}

export function normalizeExactOutputSingle(data: DecoderResult): SwapTx | undefined {
    if (data.params && data.params.length == 1 && data.params[0].value.length == 7) {
        return {
            name: data.name,
            type: TxType.SWAP_OUTPUT,
            params: {
                srcTokenAddress: data.params[0].value[0],
                dstTokenAddress: data.params[0].value[1],
                dstAmount: BigNumber.from(data.params[0].value[4]),
                amountInMaximum: BigNumber.from(data.params[0].value[5]),
            },
        };
    }
    return undefined;
}

export function normalizeSelfPermitAllowed(data: DecoderResult): PermitTx | undefined {
    try {
        return {
            name: 'selfPermitAllowed',
            type: TxType.PERMIT,
            params: {
                token: data.params[0].value as string,
                nonce: BigNumber.from(data.params[1].value),
                expiry: BigNumber.from(data.params[2].value),
            }
        };
    } catch (e) {
        return undefined;
    }

}

export function getEstimatedValue(estimated: { data: unknown, error?: Error }): string | undefined {
    const result = normalizeEstimation(estimated.error ? undefined : estimated.data);
    return result ? result : undefined;
}

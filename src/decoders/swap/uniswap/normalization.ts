import { BigNumber } from '@ethersproject/bignumber';
import { DecoderResult, MulticallParam, SwapTx, UnwrapTx } from './types';

export function getTxTypeByCallData(
    calldata: string,
    abiDecoder: unknown,
): (SwapTx | UnwrapTx | undefined)[] {
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const result: DecoderResult = abiDecoder.decodeMethod(calldata);
        if (result.name === 'multicall') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const multicallData = parseMulticall(result.params, abiDecoder);
            return  multicallData.map(normalizeDecoderResult);
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


export function normalizeDecoderResult(data: DecoderResult): SwapTx | UnwrapTx | undefined {
    switch (data.name) {
        case 'swapExactTokensForTokens':
            return normalizeSwapExactTokensForTokens(data);
        case 'unwrapWETH9':
            return normailzeUnwrapWETH9(data);
    }
    return undefined;
}

export function normalizeSwapExactTokensForTokens(data: DecoderResult): SwapTx | undefined {
    if (data.params && data.params.length > 3
        && data.params[2].value.length == 2) {
        return {
            name: data.name,
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

export function normailzeUnwrapWETH9(data: DecoderResult): UnwrapTx | undefined {
    if (data.params && data.params.length > 1) {
        return {
            name: data.name,
            params: {
                minReturnAmount: BigNumber.from(data.params[0].value),
                recipient: data.params[1].value as string,
            },
        };
    }
    return undefined;
}




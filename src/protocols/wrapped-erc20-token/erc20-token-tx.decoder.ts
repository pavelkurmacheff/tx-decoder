import {DecodeResult} from '../../core/decoder';
import {TransactionRaw} from '../../core/transaction-raw';
import {TransactionType} from '../../core/transaction-type';
import {abiDecoder, getParam} from '../../helpers/abi/abi-decoder.helper';
import {IAbiDecoderResult} from '../../helpers/abi/types';
import ERC20ABI from './ERC20_TOKEN.json';
import {decodeERC20Token} from '../erc20-token/erc20-token-tx.decoder';
import {ValueTxPayload} from '../../core/transaction-parsed/payloads/value-payload';

abiDecoder.addABI(ERC20ABI);

export function decodeWrappedERC20Token(
    contractAddr: string,
    rawTx: TransactionRaw
): DecodeResult {
    if (contractAddr.toUpperCase() != rawTx.to.toUpperCase()) {
        return {tag: 'AnotherContract'};
    }
    const methodData = abiDecoder.decodeMethod(rawTx.data);

    switch (methodData.name) {
        case 'deposit': {
            return parseWrap(rawTx, methodData);
        }
        case 'withdraw': {
            return parseUnwrap(rawTx, methodData);
        }
        default:
            return decodeERC20Token(rawTx, contractAddr);
    }
}

function parseWrap(
    rawTx: TransactionRaw,
    data: IAbiDecoderResult
): DecodeResult {
    const payload: ValueTxPayload = {
        tokenAddress: rawTx.to,
        value: rawTx.value.toString(),
    };

    return {
        tag: 'Success',
        tx: {
            tag: TransactionType.Wrap,
            functionInfo: {
                name: data.name,
                hash: rawTx.data.slice(0, 10).toLowerCase(),
                params: data.params,
                abi: ERC20ABI,
            },
            raw: rawTx,
            payload,
        },
    };
}

function parseUnwrap(
    rawTx: TransactionRaw,
    data: IAbiDecoderResult
): DecodeResult {
    const payload: ValueTxPayload = {
        tokenAddress: rawTx.to,
        value: getParam(data, 'wad') as string,
    };
    return {
        tag: 'Success',
        tx: {
            tag: TransactionType.Unwrap,
            functionInfo: {
                name: data.name,
                hash: rawTx.data.slice(0, 10).toLowerCase(),
                params: data.params,
                abi: ERC20ABI,
            },
            raw: rawTx,
            payload,
        },
    };
}

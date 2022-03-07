import {DecodeResult} from '../../core/decoder';
import {TransactionRaw} from '../../core/transaction-raw';
import {TransactionType} from '../../core/transaction-type';
import {abiDecoder, getParam} from '../../helpers/abi/abi-decoder.helper';
import {IAbiDecoderResult} from '../../helpers/abi/types';
import ERC20ABI from './ERC20_TOKEN.json';
import {ApproveTxPayload} from '../../core/transaction-parsed/approve-payload';
import {ValueTxPayload} from '../../core/transaction-parsed/value-payload';
import {TransferTxPayload} from 'src/core/transaction-parsed/transfer-payload';

abiDecoder.addABI(ERC20ABI);

export function decodeERC20Token(
    contractAddr: string,
    rawTx: TransactionRaw
): DecodeResult {
    if (contractAddr.toUpperCase() != rawTx.to.toUpperCase()) {
        return {tag: 'AnotherContract'};
    }
    const methodData = abiDecoder.decodeMethod(rawTx.data);

    switch (methodData.name) {
        case 'approve': {
            return parseApprove(rawTx, methodData);
        }
        case 'deposit': {
            return parseDeposit(rawTx, methodData);
        }
        case 'withdraw': {
            return parseWithdraw(rawTx, methodData);
        }
        case 'transfer': {
            return parseTransfer(rawTx, methodData);
        }
        case 'transferFrom': {
            return parseTransferFrom(rawTx, methodData);
        }
        default:
            return {tag: 'NotSupported', funcName: methodData.name};
    }
}

function parseApprove(
    rawTx: TransactionRaw,
    data: IAbiDecoderResult
): DecodeResult {
    const payload: ApproveTxPayload = {
        toWhomAddress: getParam(data, 'guy') as string,
        tokenAddress: rawTx.to,
        value: getParam(data, 'wad') as string,
    };

    return {
        tag: 'Success',
        tx: {
            tag: TransactionType.Approve,
            raw: rawTx,
            functionInfo: {
                name: data.name,
                hash: rawTx.data.slice(0, 10).toLowerCase(),
                params: data.params,
                abi: ERC20ABI,
            },
            payload,
        },
    };
}

function parseDeposit(
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
            tag: TransactionType.Deposit,
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

function parseWithdraw(
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
            tag: TransactionType.Withdraw,
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

function parseTransfer(
    rawTx: TransactionRaw,
    data: IAbiDecoderResult
): DecodeResult {
    const payload: TransferTxPayload = {
        srcAddress: rawTx.from,
        dstAddress: getParam(data, 'dst') as string,
        tokenAddress: rawTx.to,
        value: getParam(data, 'wad') as string,
    };
    return {
        tag: 'Success',
        tx: {
            tag: TransactionType.Transfer,
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

function parseTransferFrom(
    rawTx: TransactionRaw,
    data: IAbiDecoderResult
): DecodeResult {
    const payload: TransferTxPayload = {
        srcAddress: getParam(data, 'src') as string,
        dstAddress: getParam(data, 'dst') as string,
        tokenAddress: rawTx.to,
        value: getParam(data, 'wad') as string,
    };
    return {
        tag: 'Success',
        tx: {
            tag: TransactionType.Transfer,
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

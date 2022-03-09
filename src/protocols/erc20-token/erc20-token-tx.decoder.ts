import {DecodeResult} from '../../core/decoder';
import {TransactionRaw} from '../../core/transaction-raw';
import {TransactionType} from '../../core/transaction-type';
import {abiDecoder, getParam} from '../../helpers/abi/abi-decoder.helper';
import {IAbiDecoderResult} from '../../helpers/abi/types';
import ERC20ABI from './ERC20_TOKEN.json';
import {ApproveTxPayload} from '../../core/transaction-parsed/payloads/approve-payload'
import {TransferTxPayload} from '../../core/transaction-parsed/payloads/transfer-payload'


abiDecoder.addABI(ERC20ABI);

export function decodeERC20Token(
    rawTx: TransactionRaw,
    contractAddr?: string,
): DecodeResult {
    if (contractAddr && contractAddr.toUpperCase() != rawTx.to.toUpperCase()) {
        return {tag: 'AnotherContract'};
    }
    const methodData = abiDecoder.decodeMethod(rawTx.data);

    switch (methodData.name) {
        case 'approve': {
            return parseApprove(rawTx, methodData);
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

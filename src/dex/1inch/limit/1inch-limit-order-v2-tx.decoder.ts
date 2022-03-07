import {DecodeResult} from '../../../core/decoder';
import {TransactionRaw} from '../../../core/transaction-raw';
import {TransactionType} from '../../../core/transaction-type';
import {abiDecoder, getParam} from '../../../helpers/abi/abi-decoder.helper';
import {IAbiDecoderResult} from '../../../helpers/abi/types';
import oneInchLimitV2Abi from './1INCH_LIMIT_V2.json';

abiDecoder.addABI(oneInchLimitV2Abi);

export function decode1InchLimitOrderV2(
    contractAddr: string,
    rawTx: TransactionRaw
): DecodeResult {
    if (contractAddr.toUpperCase() != rawTx.to.toUpperCase()) {
        return {tag: 'AnotherContract'};
    }

    const methodData = abiDecoder.decodeMethod(rawTx.data);

    switch (methodData.name) {
        case 'fillOrderRFQ':
        case 'fillOrderRFQToWithPermit':
        case 'fillOrderRFQTo':
        case 'fillOrderToWithPermit':
        case 'fillOrderTo':
        case 'fillOrder': {
            return parseFillOrder(rawTx, methodData);
        }
        case 'cancelOrder': {
            return {
                tag: 'Success',
                tx: {
                    tag: TransactionType.LimitOrderCancel,
                    functionInfo: {
                        name: methodData.name,
                        hash: rawTx.data.slice(0, 10).toLowerCase(),
                        params: methodData.params,
                        abi: oneInchLimitV2Abi,
                    },
                    raw: rawTx,
                },
            };
        }
        default:
            return {tag: 'NotSupported', funcName: methodData.name};
    }
}

function parseFillOrder(
    rawTx: TransactionRaw,
    data: IAbiDecoderResult
): DecodeResult {
    const orderData = getParam(data, 'order') as any;
    if (orderData === null) {
        return {tag: 'WrongContractCall'};
    }

    const order = {
        maker: orderData['maker'],
        makerAsset: orderData['makerAsset'],
        takerAsset: orderData['takerAsset'],
    };
    const makingAmount = getParam(data, 'makingAmount') as string;
    const takingAmount = getParam(data, 'takingAmount') as string;
    const thresholdAmount = getParam(data, 'thresholdAmount') as string | null;

    const payload: any = {
        srcTokenAddress: order.takerAsset,
        dstTokenAddress: order.makerAsset,
    };

    updateAmounts(payload, takingAmount, makingAmount, thresholdAmount);

    return {
        tag: 'Success',
        tx: {
            tag: TransactionType.LimitOrderFill,
            functionInfo: {
                name: data.name,
                hash: rawTx.data.slice(0, 10).toLowerCase(),
                params: data.params,
                abi: oneInchLimitV2Abi,
            },
            raw: rawTx,
            payload,
        },
    };
}
function updateAmounts(
    payload: any,
    takingAmount: string,
    makingAmount: string,
    thresholdAmount: string | null
) {
    if (thresholdAmount === null) {
        payload.srcAmount = takingAmount;
        payload.dstAmount = makingAmount;
        return;
    }

    if (takingAmount !== '0') {
        payload.srcAmount = takingAmount;
    } else {
        payload.maxSrcAmount = thresholdAmount;
    }

    if (makingAmount !== '0') {
        payload.dstAmount = makingAmount;
    } else {
        payload.minDstAmount = thresholdAmount;
    }
}

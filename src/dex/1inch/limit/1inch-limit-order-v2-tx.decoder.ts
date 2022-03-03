import {BigNumber} from 'ethers';
import {DecodeResult} from '../../../core/decoder';
import {TransactionRaw} from '../../../core/transaction-raw';
import {TransactionType} from '../../../core/transaction-type';
import {abiDecoder, getParam} from '../../../helpers/abi/abi-decoder.helper';
import {IAbiDecoderResult} from '../../../helpers/abi/types';
import oneInchLimitV2Abi from './1INCH_LIMIT_V2.json';

abiDecoder.addABI(oneInchLimitV2Abi);

export function decode1InchLimitOrderV2(
    contractAddr: string,
    tx: TransactionRaw
): DecodeResult {
    if (contractAddr.toUpperCase() != tx.to.toUpperCase()) {
        return {tag: 'AnotherContract'};
    }

    const methodData = abiDecoder.decodeMethod(tx.data);

    switch (methodData.name) {
        case 'fillOrderRFQ':
        case 'fillOrderRFQToWithPermit':
        case 'fillOrderRFQTo':
        case 'fillOrderToWithPermit':
        case 'fillOrderTo':
        case 'fillOrder': {
            return parseFillOrder(methodData);
        }
        case 'cancelOrder': {
            return {
                tag: 'Success',
                tx: {tag: TransactionType.LimitOrderCancel},
            };
        }
        default:
            return {tag: 'NotSupported', funcName: methodData.name};
    }
}

function parseFillOrder(data: IAbiDecoderResult): DecodeResult {
    const orderData = getParam(data, 'order') as any;
    if (orderData === null) {
        return {tag: 'WrongContractCall'};
    }

    const order = {
        maker: orderData['maker'],
        makerAsset: orderData['makerAsset'],
        takerAsset: orderData['takerAsset'],
    };
    const makingAmount = BigNumber.from(getParam(data, 'makingAmount'));
    const takingAmount = BigNumber.from(getParam(data, 'takingAmount'));
    const thresholdAmountParam = getParam(data, 'thresholdAmount');
    const thresholdAmount =
        thresholdAmountParam !== null
            ? BigNumber.from(thresholdAmountParam)
            : null;

    const payload: any = {
        srcTokenAddress: order.takerAsset,
        dstTokenAddress: order.makerAsset,
    };

    updateAmounts(payload, takingAmount, makingAmount, thresholdAmount);

    return {
        tag: 'Success',
        tx: {
            tag: TransactionType.LimitOrderFill,
            payload,
        },
    };
}
function updateAmounts(
    payload: any,
    takingAmount: BigNumber,
    makingAmount: BigNumber,
    thresholdAmount: BigNumber | null
) {
    if (thresholdAmount === null) {
        payload.srcAmount = takingAmount;
        payload.dstAmount = makingAmount;
        return;
    }

    const bnZero = BigNumber.from('0');
    if (!takingAmount.eq(bnZero)) {
        payload.srcAmount = takingAmount;
    } else {
        payload.maxSrcAmount = thresholdAmount;
    }

    if (!makingAmount.eq(bnZero)) {
        payload.dstAmount = makingAmount;
    } else {
        payload.minDstAmount = thresholdAmount;
    }
}

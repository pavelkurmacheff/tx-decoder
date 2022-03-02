import {IAbiDecoderResult} from '../../../helpers/abi/types';
import {abiDecoder, getAbiParam} from '../../../helpers/abi/abi-decoder.helper';
import {ONE_INCH_LIMIT_ORDER_V2_ROUTER_ADDRESS} from './types';
import {BigNumber} from '@ethersproject/bignumber';
import { TransactionRaw } from 'src/core/transaction-raw';
import oneInchLimitV2Abi from './ONE_INCH_LIMIT_V2.json';
import { DecodeResult } from 'src/core/decoder';
import { TransactionType } from 'src/core/transaction-type';

abiDecoder.addABI(oneInchLimitV2Abi);

export function decodeOneInchLimitOrderV2(tx: TransactionRaw): DecodeResult {
    const runOnRouter =
        tx.to.toUpperCase() ===
        ONE_INCH_LIMIT_ORDER_V2_ROUTER_ADDRESS.toUpperCase();

    if (!runOnRouter) {
        return { tag: 'AnotherContract' };
    }

    const methodData = abiDecoder.decodeMethod(tx.data);

    switch (methodData.name) {
        case 'fillOrder': {
            return parseFillOrder(methodData);
        }
        case 'cancelOrder': {
            return { 
                tag: 'Success',
                tx: { tag: TransactionType.LimitOrderCancel }
            };
        }
        default:
            return { tag: 'NotSupported', funcName: methodData.name };
    }
}

function parseFillOrder(data: IAbiDecoderResult): DecodeResult {
    const orderData = getAbiParam<any>(data.params, 'order');
    const order = {
        maker: orderData['maker'],
        makerAsset: orderData['makerAsset'],
        takerAsset: orderData['takerAsset'],
    };
    const makingAmount = BigNumber.from(
        getAbiParam<string>(data.params, 'makingAmount')
    );
    const takingAmount = BigNumber.from(
        getAbiParam<string>(data.params, 'takingAmount')
    );
    const thresholdAmount = BigNumber.from(
        getAbiParam<string>(data.params, 'thresholdAmount')
    );

    const payload: any = {
        srcTokenAddress: order.takerAsset,
        dstTokenAddress: order.makerAsset,
    }; 

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

    return {
        tag: 'Success',
        tx: { 
            tag: TransactionType.LimitOrderFill, 
            payload
        }
    };
}

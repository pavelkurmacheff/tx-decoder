import {IAbiDecoderResult} from '../../../helpers/abi/types';
import {LimitOrderFillDecoded} from 'src/model/limit-order-fill.model';
import {abiDecoder, getAbiParam} from '../../../helpers/abi/abi-decoder.helper';
import {Transaction, Web3Resources} from '../../../model/common.model';
import {ONE_INCH_LIMIT_ORDER_V2_ROUTER_ADDRESS} from './types';
import {BigNumber} from '@ethersproject/bignumber';
import {tryToFindTokenByAddress} from '../../../helpers/tokens/tokens.helper';
import oneInchLimitV2Abi from '../../../abi/ONE_INCH_LIMIT_V2.json';
import {LimitOrderCancelDecoded} from 'src/model/limit-order-cancel.model';

abiDecoder.addABI(oneInchLimitV2Abi);

export async function decodeOneInchLimitOrderV2(
    resources: Web3Resources,
    tx: Transaction
): Promise<LimitOrderFillDecoded | LimitOrderCancelDecoded | null> {
    const runOnRouter =
        tx.to.toUpperCase() ===
        ONE_INCH_LIMIT_ORDER_V2_ROUTER_ADDRESS.toUpperCase();

    if (!runOnRouter) {
        return null;
    }

    const methodData = abiDecoder.decodeMethod(tx.data);

    switch (methodData.name) {
        case 'fillOrder': {
            return await parseFillOrder(resources, methodData);
        }
        case 'cancelOrder': {
            return {};
        }
    }

    return null;
}

async function parseFillOrder(
    resources: Web3Resources,
    data: IAbiDecoderResult
): Promise<LimitOrderFillDecoded> {
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

    const [srcToken, dstToken] = await Promise.all([
        tryToFindTokenByAddress(resources, order.takerAsset),
        tryToFindTokenByAddress(resources, order.makerAsset),
    ]);

    if (!srcToken) {
        throw new Error(
            'Src token is not found for decodeOneInchLimitOrderV2: ' +
                order.takerAsset
        );
    }

    if (!dstToken) {
        throw new Error(
            'Dst token is not found for decodeOneInchLimitOrderV2: ' +
                order.makerAsset
        );
    }

    const decoded: LimitOrderFillDecoded = {
        srcToken,
        dstToken,
    };

    const bnZero = BigNumber.from('0');
    if (!takingAmount.eq(bnZero)) {
        decoded.srcAmount = takingAmount;
    } else {
        decoded.maxSrcAmount = thresholdAmount;
    }

    if (!makingAmount.eq(bnZero)) {
        decoded.dstAmount = makingAmount;
    } else {
        decoded.minDstAmount = thresholdAmount;
    }

    return decoded;
}

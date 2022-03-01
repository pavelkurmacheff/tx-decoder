import {tryToFindTokenByAddress} from '../../../helpers/tokens/tokens.helper';
import {Web3Resources} from '../../../model/common.model';
import {LimitOrderFillDecoded} from '../../../model/limit-order-fill.model';
import {IOneInchLimitOrderFillTxData} from './types';
import {BigNumber} from '@ethersproject/bignumber';

export async function buildOneInchLimitOrderFillTxModel(
    resources: Web3Resources,
    data: IOneInchLimitOrderFillTxData
): Promise<LimitOrderFillDecoded> {
    const [srcToken, dstToken] = await Promise.all([
        tryToFindTokenByAddress(resources, data.params.order.takerAsset),
        tryToFindTokenByAddress(resources, data.params.order.makerAsset),
    ]);

    if (!srcToken) {
        throw new Error(
            'Src token is not found for OneInchLimitOrderFillTxDecoder: ' +
                data.params.order.takerAsset
        );
    }

    if (!dstToken) {
        throw new Error(
            'Dst token is not found for OneInchLimitOrderFillTxDecoder: ' +
                data.params.order.makerAsset
        );
    }

    const decoded: LimitOrderFillDecoded = {
        srcToken,
        dstToken,
    };

    const bnZero = BigNumber.from('0');
    if (!data.params.takingAmount.eq(bnZero)) {
        decoded.srcAmount = data.params.takingAmount;
    } else {
        decoded.maxSrcAmount = data.params.thresholdAmount;
    }

    if (!data.params.makingAmount.eq(bnZero)) {
        decoded.dstAmount = data.params.makingAmount;
    } else {
        decoded.minDstAmount = data.params.thresholdAmount;
    }

    return decoded;
}

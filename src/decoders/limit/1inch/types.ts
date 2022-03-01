import {BigNumber} from '@ethersproject/bignumber';

export interface IOneInchLimitOrderFillTxData {
    name: string;
    params: {
        order: {
            maker: string;
            makerAsset: string;
            takerAsset: string;
        };
        makingAmount: BigNumber;
        takingAmount: BigNumber;
        thresholdAmount: BigNumber;
    };
}

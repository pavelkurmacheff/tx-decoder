import {BuilderParams} from '../../model/common.model';

export function getDestAmountViaEstimation(params: BuilderParams<unknown>): Promise<string> {
    const {from, to, value, data} = params.txConfig;

    return params.rpcCaller.call<string>('eth_call', [{from, to, value, data}])
        .then(response => BigInt(response).toString(10));
}

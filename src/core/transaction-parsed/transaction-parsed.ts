import {BigNumber} from 'ethers';
import { JsonFragment, Fragment } from "@ethersproject/abi";
import {AddLiquidityPayload} from './add-liquidity-payload';
import {ApproveTxPayload} from './approve-payload';
import {LimitOrderFillPayload} from './limit-order-fill-payload';
import {RemoveLiquidityPayload} from './remove-liquidity-payload';
import {
    SwapExactInputPayload,
    SwapExactOutputPayload,
} from './swap-payload';
import {TransferTxPayload} from './transfer-payload';
import {ValueTxPayload} from './value-payload';
import {TransactionRaw} from '../transaction-raw';
import {TransactionType} from '../transaction-type';

export interface EstimationResp {
    returnAmount: BigNumber;
}

export interface FunctionInfo {
    name: string;
    hash: string;
    params: unknown;
    abi: ReadonlyArray<Fragment | JsonFragment | string>;
    responseParser?: (data: unknown) => EstimationResp;
}

export type TransactionParsed =
    | {
          raw: TransactionRaw;
          functionInfo: FunctionInfo;
          tag: TransactionType.Approve;
          payload?: ApproveTxPayload;
      }
    | {
          raw: TransactionRaw;
          tag: TransactionType.Deposit;
          functionInfo: FunctionInfo;
          payload: ValueTxPayload;
      }
    | {
          raw: TransactionRaw;
          tag: TransactionType.Withdraw;
          functionInfo: FunctionInfo;
          payload: ValueTxPayload;
      }
    | {
          raw: TransactionRaw;
          tag: TransactionType.Transfer;
          functionInfo: FunctionInfo;
          payload: TransferTxPayload;
      }
    | {
          raw: TransactionRaw;
          functionInfo: FunctionInfo;
          tag: TransactionType.Unwrap;
      }
    | {
          raw: TransactionRaw;
          functionInfo: FunctionInfo;
          tag: TransactionType.SwapExactInput;
          payload: SwapExactInputPayload;
      }
    | {
          raw: TransactionRaw;
          functionInfo: FunctionInfo;
          tag: TransactionType.SwapExactOutput;
          payload: SwapExactOutputPayload;
      }
    | {
          raw: TransactionRaw;
          functionInfo: FunctionInfo;
          tag: TransactionType.LimitOrderFill;
          payload: LimitOrderFillPayload;
      }
    | {
          raw: TransactionRaw;
          functionInfo: FunctionInfo;
          tag: TransactionType.LimitOrderCancel;
      }
    | {
          raw: TransactionRaw;
          functionInfo: FunctionInfo;
          tag: TransactionType.Multicall;
          payload: MulticallPayload;
      }
    | {
          raw: TransactionRaw;
          functionInfo: FunctionInfo;
          tag: TransactionType.AddLiquidity;
          payload: AddLiquidityPayload;
      }
    | {
          raw: TransactionRaw;
          functionInfo: FunctionInfo;
          tag: TransactionType.RemoveLiquidity;
          payload: RemoveLiquidityPayload;
      };

export type MulticallPayload = (
    | {tag: 'Error'; code: string; data: unknown}
    | TransactionParsed
)[];

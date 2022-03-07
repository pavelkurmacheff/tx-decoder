import {ApproveTxPayload} from './transaction-parsed/approve-payload';
import {LimitOrderFillPayload} from './transaction-parsed/limit-order-fill-payload';
import {
    SwapExactInputPayload,
    SwapExactOutputPayload,
    SwapThroughPoolPayload,
} from './transaction-parsed/swap-payload';
import {TransactionRaw} from './transaction-raw';
import {TransactionType} from './transaction-type';

export interface FunctionInfo {
    name: string,
    hash: string,
    params: any,
    abi: any,
}

export type MulticallItem =
    | {
          tag: TransactionType.Approve;
          functionInfo: FunctionInfo;
          payload?: ApproveTxPayload;
      }
    | {
          tag: TransactionType.Unwrap;
          functionInfo: FunctionInfo;
      }
    | {
          tag: TransactionType.SwapExactInput;
          functionInfo: FunctionInfo;
          payload: SwapExactInputPayload;
      }
    | {
          tag: TransactionType.SwapExactOutput;
          functionInfo: FunctionInfo;
          payload: SwapExactOutputPayload;
      }
    | {
          tag: TransactionType.LimitOrderFill;
          functionInfo: FunctionInfo;
          payload: LimitOrderFillPayload;
      }
    | {
          tag: TransactionType.LimitOrderCancel;
          functionInfo: FunctionInfo;
      }
    | {
          tag: TransactionType.Multicall;
          functionInfo: FunctionInfo;
          payload: MulticallPayload;
      };

export type MulticallPayload = (
    | {tag: 'Error'; code: string; data: any}
    | MulticallItem
)[];

export type TransactionParsed =
    | {
          raw: TransactionRaw;
          functionInfo: FunctionInfo;
          tag: TransactionType.Approve;
          payload?: ApproveTxPayload;
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
          tag: TransactionType.SwapThroughPool;
          payload: SwapThroughPoolPayload;
      };

import {TransactionRaw} from './transaction-raw';
import {ApproveRich} from './transaction-rich/approve-rich-payload';
import {LimitOrderFillRich} from '././transaction-rich/limit-order-fill';
import {
    SwapExactInputRich,
    SwapExactOutputRich,
} from './transaction-rich/swap-payload';
import {TransactionType} from './transaction-type';
import {FunctionInfo} from './transaction-parsed';

export type MulticallRichItem =
    | {
          tag: TransactionType.Approve;
          functionInfo: FunctionInfo;
          payload?: ApproveRich;
      }
    | {tag: TransactionType.Deposit}
    | {
          tag: TransactionType.Unwrap;
          functionInfo: FunctionInfo;
      }
    | {
          tag: TransactionType.SwapExactInput;
          functionInfo: FunctionInfo;
          payload: SwapExactInputRich;
      }
    | {
          tag: TransactionType.SwapExactOutput;
          functionInfo: FunctionInfo;
          payload: SwapExactOutputRich;
      }
    | {
          tag: TransactionType.LimitOrderFill;
          functionInfo: FunctionInfo;
          payload: LimitOrderFillRich;
      }
    | {
          tag: TransactionType.LimitOrderCancel;
          functionInfo: FunctionInfo;
      }
    | {
          tag: TransactionType.Multicall;
          functionInfo: FunctionInfo;
      };

export type MulticallPayloadRich = (
    | {tag: 'Error'; code: string; data: any}
    | MulticallRichItem
)[];

export type TransactionRich =
    | {
          raw: TransactionRaw;
          tag: TransactionType.Approve;
          functionInfo: FunctionInfo;
          payload?: ApproveRich;
      }
    | {
          raw: TransactionRaw;
          tag: TransactionType.Unwrap;
          functionInfo: FunctionInfo;
      }
    | {
          raw: TransactionRaw;
          tag: TransactionType.SwapExactInput;
          functionInfo: FunctionInfo;
          payload: SwapExactInputRich;
      }
    | {
          raw: TransactionRaw;
          tag: TransactionType.SwapExactOutput;
          functionInfo: FunctionInfo;
          payload: SwapExactOutputRich;
      }
    | {
          raw: TransactionRaw;
          tag: TransactionType.LimitOrderFill;
          functionInfo: FunctionInfo;
          payload: LimitOrderFillRich;
      }
    | {
          raw: TransactionRaw;
          tag: TransactionType.LimitOrderCancel;
          functionInfo: FunctionInfo;
      }
    | {
          raw: TransactionRaw;
          tag: TransactionType.Multicall;
          functionInfo: FunctionInfo;
          payload: MulticallPayloadRich;
      }
    | {
          raw: TransactionRaw;
          tag: TransactionType.SwapThroughPool;
          functionInfo: FunctionInfo;
          payload: SwapExactInputRich;
      };

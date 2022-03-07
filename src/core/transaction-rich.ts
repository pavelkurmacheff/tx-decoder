import {TransactionRaw} from './transaction-raw';
import {ApproveRichTxPayload} from './transaction-rich/approve-rich-payload';
import {LimitOrderFillRich} from '././transaction-rich/limit-order-fill';
import {
    SwapExactInputRich,
    SwapExactOutputRich,
} from './transaction-rich/swap-payload';
import {TransactionType} from './transaction-type';
import {FunctionInfo} from './transaction-parsed';
import {ValueRichTxPayload} from './transaction-rich/value-rich-payload';
import {TransferRichTxPayload} from './transaction-rich/transfer-rich-payload';

export type TransactionRich =
    | {
          raw: TransactionRaw;
          tag: TransactionType.Approve;
          functionInfo: FunctionInfo;
          payload?: ApproveRichTxPayload;
      }
    | {
          raw: TransactionRaw;
          tag: TransactionType.Deposit;
          functionInfo: FunctionInfo;
          payload?: ValueRichTxPayload;
      }
    | {
          raw: TransactionRaw;
          tag: TransactionType.Withdraw;
          functionInfo: FunctionInfo;
          payload?: ValueRichTxPayload;
      }
    | {
          raw: TransactionRaw;
          tag: TransactionType.Transfer;
          functionInfo: FunctionInfo;
          payload?: TransferRichTxPayload;
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

export type MulticallPayloadRich = (
    | {tag: 'Error'; code: string; data: any}
    | TransactionRich
)[];

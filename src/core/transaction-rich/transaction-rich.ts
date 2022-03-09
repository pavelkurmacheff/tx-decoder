import {TransactionRaw} from '../transaction-raw';
import {ApproveRichTxPayload} from './payloads/approve-rich-payload';
import {LimitOrderFillRichPayload} from './payloads/limit-order-fill-rich-payload';
import {
    SwapExactInputRichPayload,
    SwapExactOutputRichPayload,
} from './payloads/swap-payload';
import {TransactionType} from '../transaction-type';
import {FunctionInfo} from '../transaction-parsed/transaction-parsed';
import {ValueRichTxPayload} from './payloads/value-rich-payload';
import {TransferRichTxPayload} from './payloads/transfer-rich-payload';
import {AddLiquidityRichPayload} from './payloads/add-liquidity-rich-payload';
import {RemoveLiquidityRichPayload} from './payloads/remove-liquidity-rich-payload';

export type TransactionRich =
    | {
          raw: TransactionRaw;
          tag: TransactionType.Approve;
          functionInfo: FunctionInfo;
          payload?: ApproveRichTxPayload;
      }
    | {
          raw: TransactionRaw;
          tag: TransactionType.Wrap;
          functionInfo: FunctionInfo;
          payload?: ValueRichTxPayload;
      }
    | {
          raw: TransactionRaw;
          tag: TransactionType.Unwrap;
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
          payload: SwapExactInputRichPayload;
      }
    | {
          raw: TransactionRaw;
          tag: TransactionType.SwapExactOutput;
          functionInfo: FunctionInfo;
          payload: SwapExactOutputRichPayload;
      }
    | {
          raw: TransactionRaw;
          tag: TransactionType.LimitOrderFill;
          functionInfo: FunctionInfo;
          payload: LimitOrderFillRichPayload;
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
          functionInfo: FunctionInfo;
          tag: TransactionType.AddLiquidity;
          payload: AddLiquidityRichPayload;
      }
    | {
          raw: TransactionRaw;
          functionInfo: FunctionInfo;
          tag: TransactionType.RemoveLiquidity;
          payload: RemoveLiquidityRichPayload;
      };

export type MulticallPayloadRich = (
    | {tag: 'Error'; code: string; data: unknown}
    | TransactionRich
)[];

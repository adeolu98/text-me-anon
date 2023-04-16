import { Network } from "./network";
import {TransactionResponse } from "@ethersproject/abstract-provider"

export interface Discussion {
  from: string;
  to: string;
  text: string;
  timestamp: number;
  id: Network;
  hash: string;
}

export type DiscussionsState = Record<string, Record<string, Discussion[]>>;

export type TxResponse = TransactionResponse & {chainId: Network, gasUsed: string}

export enum ChatMode {
  WATCH = "watch",
  CHAT = "chat",
}

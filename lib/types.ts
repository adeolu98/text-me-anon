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

export enum FetchStatus {
  PENDING = "pending",
  FULFILLED = "fulfilled",
  REJECTED = "rejected"
}

export type DiscussionsState = Record<string, {discussions: Record<string, Discussion[]>, fetchStatus: FetchStatus, loaded: boolean} >;

export type TxResponse = TransactionResponse & {chainId: Network, gasUsed: string}

export enum ChatMode {
  WATCH = "watch",
  CHAT = "chat",
}

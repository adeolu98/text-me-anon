import { Network } from "./network";

export interface Discussion {
  from: string;
  to: string;
  text: string;
  timestamp: number;
  id: Network;
  hash: string;
}

export type DiscussionsState = Record<string, Record<string, Discussion[]>>;


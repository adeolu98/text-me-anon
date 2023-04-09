import { Network } from "./network";

export interface Discussion {
  from: string;
  to: string;
  text: string;
  timestamp: number;
  id: Network;
}

export type DiscussionsState = Record<string, Discussion[]>;


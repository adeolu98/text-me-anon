export interface Discussion {
  from: string;
  to: string;
  text: string;
  timestamp: number;
}

export type DiscussionsState = Record<string, Discussion[]>;


export interface Discussion {
  from: string;
  to: string;
  text: string;
  timestamp: number;
  id?:number;
}

export type DiscussionsState = Record<string, Discussion[]>;


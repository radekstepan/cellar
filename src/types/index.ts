export type Record = {
  id: string;
  target: string;
  status: string;
  research_data: string;
  draft_email: string;
  isLive: boolean;
  [key: string]: string | boolean;
};

export type Log = {
  id: number;
  type: 'agent' | 'user' | 'system';
  message: string;
  time: string;
};

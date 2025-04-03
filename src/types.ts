export interface LogEntry {
    time: string;
    level: string;
    msg: string;
    prefix: string;
    other: string;
    timestamp?: number;
  }
  
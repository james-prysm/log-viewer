import React from 'react';
import LogCard from './LogCard';
import { LogEntry } from '../types';

interface LogViewerProps {
  entries: LogEntry[];
  expandAccordions: boolean;
  timeMode: 'absolute' | 'seconds' | 'milliseconds';
  startTime?: number;
}

const LogViewer: React.FC<LogViewerProps> = ({ entries, expandAccordions, timeMode, startTime }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // centers each LogCard horizontally
        gap: 0, // no extra spacing between cards
        width: '100%',
      }}
    >
      {entries.map((entry, index) => (
        <LogCard
          key={index}
          log={entry}
          expandAccordions={expandAccordions}
          timeMode={timeMode}
          startTime={startTime}
        />
      ))}
    </div>
  );
};

export default LogViewer;

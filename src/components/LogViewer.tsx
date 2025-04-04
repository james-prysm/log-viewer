import React from 'react';
import LogCard from './LogCard';
import { LogEntry } from '../types';

interface LogViewerProps {
  entries: LogEntry[];
  expandAccordions: boolean;
  timeMode: 'absolute' | 'seconds' | 'milliseconds';
  startTime?: number;
  projectPath: string;
}

const LogViewer: React.FC<LogViewerProps> = ({ entries, expandAccordions, timeMode, startTime, projectPath }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
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
          projectPath={projectPath}
        />
      ))}
    </div>
  );
};

export default LogViewer;

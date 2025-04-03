// In App.tsx
import React, { useState, useMemo } from 'react';
import FiltersPanel from './components/FiltersPanel';
import LogViewer from './components/LogViewer';
import LinearProgress from '@mui/material/LinearProgress';
import { useLogStream } from './hooks/useLogStream';

const App: React.FC = () => {
  const {
    logs,
    progress,
    loading,
    processFile,
    uniqueLevels,
    selectedLevels,
    setSelectedLevels,
    uniquePrefixes,
    selectedPrefixes,
    setSelectedPrefixes,
    allTimeRange,
    timeFilter,
    setTimeFilter,
  } = useLogStream();

  // Maintain visibleColumns state (even if not used by FiltersPanel UI)
  const [visibleColumns, setVisibleColumns] = useState({ time: true, level: true, msg: true, prefix: true });
  const [expandAccordions, setExpandAccordions] = useState(false);
  const [timeMode, setTimeMode] = useState<'absolute' | 'seconds' | 'milliseconds'>('absolute');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      processFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const filteredEntries = useMemo(() => {
    let result = logs;
    if (selectedLevels.length > 0) {
      result = result.filter(log => selectedLevels.includes(log.level));
    }
    if (selectedPrefixes.length > 0) {
      result = result.filter(log => selectedPrefixes.includes(log.prefix));
    }
    if (timeFilter) {
      result = result.filter(
        log => log.timestamp !== undefined &&
          log.timestamp >= timeFilter[0] &&
          log.timestamp <= timeFilter[1]
      );
    }
    return result;
  }, [logs, selectedLevels, selectedPrefixes, timeFilter]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Main log viewer container */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        {loading ? (
          <div style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
            <LinearProgress variant="determinate" value={progress} />
            <p>Loading logs... {progress}%</p>
          </div>
        ) : (
          <LogViewer
            entries={filteredEntries}
            visibleColumns={visibleColumns}
            expandAccordions={expandAccordions}
            timeMode={timeMode}
            startTime={logs.length > 0 ? logs[0].timestamp : undefined}
          />
        )}
      </div>

      {/* Filters panel */}
      <div
        style={{
          width: '300px',
          borderLeft: '1px solid #ccc',
          padding: '20px',
          pointerEvents: loading ? 'none' : 'auto',
          opacity: loading ? 0.5 : 1,
        }}
      >
        <FiltersPanel
          visibleColumns={visibleColumns}  // <-- now passed in
          onFileChange={handleFileChange}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          uniqueLevels={uniqueLevels}
          selectedLevels={selectedLevels}
          setSelectedLevels={setSelectedLevels}
          uniquePrefixes={uniquePrefixes}
          selectedPrefixes={selectedPrefixes}
          setSelectedPrefixes={setSelectedPrefixes}
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          allTimeRange={allTimeRange}
          expandAccordions={expandAccordions}
          setExpandAccordions={setExpandAccordions}
          timeMode={timeMode}
          setTimeMode={setTimeMode}
        />
      </div>
    </div>
  );
};
export default App;

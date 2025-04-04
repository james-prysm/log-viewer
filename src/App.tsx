import React, { useState, useMemo, useEffect } from 'react';
import FiltersPanel from './components/FiltersPanel';
import LogViewer from './components/LogViewer';
import LinearProgress from '@mui/material/LinearProgress';
import { useLogStream } from './hooks/useLogStream';
import { filterLogs } from './utils/filterLogs';
import debounce from 'lodash.debounce';

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

  // No visibleColumns or toggleColumn since we're not using column toggles.
  const [expandAccordions, setExpandAccordions] = useState(false);
  const [timeMode, setTimeMode] = useState<'absolute' | 'seconds' | 'milliseconds'>('absolute');
  const [searchFilters, setSearchFilters] = useState<string[]>([]);
  const [debouncedSearchFilters, setDebouncedSearchFilters] = useState<string[]>([]);

  // Debounce searchFilters updates (300ms delay)
  const updateDebouncedSearchFilters = useMemo(
    () => debounce((filters: string[]) => setDebouncedSearchFilters(filters), 300),
    []
  );

  useEffect(() => {
    updateDebouncedSearchFilters(searchFilters);
  }, [searchFilters, updateDebouncedSearchFilters]);

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

  // Memoize filtering using our external filterLogs utility.
  const filteredEntries = useMemo(() => {
    return filterLogs(logs, {
      selectedLevels,
      selectedPrefixes,
      timeFilter,
      searchFilters: debouncedSearchFilters,
    });
  }, [logs, selectedLevels, selectedPrefixes, timeFilter, debouncedSearchFilters]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Main Log Viewer Container */}
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
            expandAccordions={expandAccordions}
            timeMode={timeMode}
            startTime={logs.length > 0 ? logs[0].timestamp : undefined}
          />
        )}
      </div>

      {/* Filters Panel */}
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
          searchFilters={searchFilters}
          setSearchFilters={setSearchFilters}
        />
      </div>
    </div>
  );
};

export default App;

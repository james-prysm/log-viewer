import React from 'react';
import FileUploadSection from './filters/FileUpload';
import LevelFilterSection from './filters/LevelFilter';
import PrefixFilterSection from './filters/PrefixFilter';
import AccordionControlSection from './filters/AccordionControl';
import TimeFilterWithMode from './filters/TimeFilterWithMode';

interface FiltersPanelProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  visibleColumns: Record<string, boolean>;
  uniqueLevels: string[];
  selectedLevels: string[];
  setSelectedLevels: (levels: string[]) => void;
  uniquePrefixes: string[];
  selectedPrefixes: string[];
  setSelectedPrefixes: (prefixes: string[]) => void;
  timeFilter: [number, number] | null;
  setTimeFilter: (range: [number, number]) => void;
  allTimeRange: [number, number] | null;
  expandAccordions: boolean;
  setExpandAccordions: (val: boolean) => void;
  timeMode: 'absolute' | 'seconds' | 'milliseconds';
  setTimeMode: (mode: 'absolute' | 'seconds' | 'milliseconds') => void;
}


const FiltersPanel: React.FC<FiltersPanelProps> = (props) => {
  return (
    <div>
      <h2>Controls</h2>
      <FileUploadSection
        onFileChange={props.onFileChange}
        onDragOver={props.onDragOver}
        onDrop={props.onDrop}
      />
      <TimeFilterWithMode
        visible={props.visibleColumns["time"]}
        allTimeRange={props.allTimeRange}
        timeFilter={props.timeFilter}
        setTimeFilter={props.setTimeFilter}
        timeMode={props.timeMode}
        setTimeMode={props.setTimeMode}
        startTime={props.allTimeRange ? props.allTimeRange[0] : undefined}
      />
      <LevelFilterSection
        visible={props.visibleColumns["level"]}
        uniqueLevels={props.uniqueLevels}
        selectedLevels={props.selectedLevels}
        setSelectedLevels={props.setSelectedLevels}
      />
      <PrefixFilterSection
        visible={props.visibleColumns["prefix"]}
        uniquePrefixes={props.uniquePrefixes}
        selectedPrefixes={props.selectedPrefixes}
        setSelectedPrefixes={props.setSelectedPrefixes}
      />
      <AccordionControlSection
        expandAccordions={props.expandAccordions}
        setExpandAccordions={props.setExpandAccordions}
      />
    </div>
  );
};

export default FiltersPanel;

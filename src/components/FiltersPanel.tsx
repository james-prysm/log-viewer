import React from 'react';
import FileUpload from './filters/FileUpload';
import TimeFilterWithMode from './filters/TimeFilterWithMode';
import LevelFilter from './filters/LevelFilter';
import PrefixFilter from './filters/PrefixFilter';
import AccordionControl from './filters/AccordionControl';
import SearchFilter from './filters/SearchFilter';
import ProjectPathInput from './filters/ProjectPathInput';

interface FiltersPanelProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
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
  searchFilters: string[];
  setSearchFilters: (filters: string[]) => void;
  projectPath: string;
  setProjectPath: (path: string) => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = (props) => {
  return (
    <div>
      <h2>Controls</h2>
      <ProjectPathInput
        projectPath={props.projectPath}
        setProjectPath={props.setProjectPath}
      />
      <FileUpload
        onFileChange={props.onFileChange}
        onDragOver={props.onDragOver}
        onDrop={props.onDrop}
      />
      <TimeFilterWithMode
        allTimeRange={props.allTimeRange}
        timeFilter={props.timeFilter}
        setTimeFilter={props.setTimeFilter}
        timeMode={props.timeMode}
        setTimeMode={props.setTimeMode}
        startTime={props.allTimeRange ? props.allTimeRange[0] : undefined}
      />
      <LevelFilter
        uniqueLevels={props.uniqueLevels}
        selectedLevels={props.selectedLevels}
        setSelectedLevels={props.setSelectedLevels}
      />
      <PrefixFilter
        uniquePrefixes={props.uniquePrefixes}
        selectedPrefixes={props.selectedPrefixes}
        setSelectedPrefixes={props.setSelectedPrefixes}
      />
      <SearchFilter
        searchFilters={props.searchFilters}
        setSearchFilters={props.setSearchFilters}
      />
      <AccordionControl
        expandAccordions={props.expandAccordions}
        setExpandAccordions={props.setExpandAccordions}
      />
    </div>
  );
};

export default FiltersPanel;

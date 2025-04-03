import React from 'react';
import Slider from '@mui/material/Slider';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

interface TimeFilterWithModeProps {
  visible: boolean;
  allTimeRange: [number, number] | null;
  timeFilter: [number, number] | null;
  setTimeFilter: (range: [number, number]) => void;
  timeMode: 'absolute' | 'seconds' | 'milliseconds';
  setTimeMode: (mode: 'absolute' | 'seconds' | 'milliseconds') => void;
  startTime?: number; // needed for relative time calculations
}

const TimeFilterWithMode: React.FC<TimeFilterWithModeProps> = ({
  visible,
  allTimeRange,
  timeFilter,
  setTimeFilter,
  timeMode,
  setTimeMode,
  startTime,
}) => {
  if (!visible || !allTimeRange || !timeFilter) return null;

  const formatTime = (ts: number): string => {
    if (timeMode === 'absolute') {
      return new Date(ts).toLocaleString();
    } else if (timeMode === 'seconds' && startTime !== undefined) {
      return ((ts - startTime) / 1000).toFixed(2) + ' s';
    } else if (timeMode === 'milliseconds' && startTime !== undefined) {
      return (ts - startTime) + ' ms';
    }
    return ts.toString();
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>Filter Time & Display Mode</h3>
      <Slider
        min={allTimeRange[0]}
        max={allTimeRange[1]}
        value={timeFilter}
        onChange={(event, newValue) => {
          if (Array.isArray(newValue) && newValue.length === 2) {
            setTimeFilter([newValue[0], newValue[1]]);
          }
        }}
        valueLabelDisplay="auto"
        valueLabelFormat={(value: number) => formatTime(value)}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
        }}
      >
        <span>Start: {formatTime(timeFilter[0])}</span>
        <span>End: {formatTime(timeFilter[1])}</span>
      </div>
      <RadioGroup
        row
        value={timeMode}
        onChange={(e) =>
          setTimeMode(e.target.value as 'absolute' | 'seconds' | 'milliseconds')
        }
        style={{ marginTop: '10px' }}
      >
        <FormControlLabel value="absolute" control={<Radio />} label="Absolute" />
        <FormControlLabel value="seconds" control={<Radio />} label="Seconds" />
        <FormControlLabel value="milliseconds" control={<Radio />} label="Milliseconds" />
      </RadioGroup>
    </div>
  );
};

export default TimeFilterWithMode;

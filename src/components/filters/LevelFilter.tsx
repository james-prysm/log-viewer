import React from 'react';
import Select from 'react-select';

interface LevelFilterProps {
  visible: boolean;
  uniqueLevels: string[];
  selectedLevels: string[];
  setSelectedLevels: (levels: string[]) => void;
}

const LevelFilter: React.FC<LevelFilterProps> = ({ visible, uniqueLevels, selectedLevels, setSelectedLevels }) => {
  if (!visible || uniqueLevels.length === 0) return null;
  const levelOptions = uniqueLevels.map(level => ({ value: level, label: level }));
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>Filter Levels</h3>
      <Select
        options={levelOptions}
        isMulti
        onChange={(selectedOptions) => {
          const levels = selectedOptions ? selectedOptions.map(option => option.value) : [];
          setSelectedLevels(levels);
        }}
        value={levelOptions.filter(option => selectedLevels.includes(option.value))}
      />
    </div>
  );
};

export default LevelFilter;

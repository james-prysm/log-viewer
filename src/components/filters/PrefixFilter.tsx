import React from 'react';
import Select from 'react-select';

interface PrefixFilterProps {
  visible: boolean;
  uniquePrefixes: string[];
  selectedPrefixes: string[];
  setSelectedPrefixes: (prefixes: string[]) => void;
}

const PrefixFilter: React.FC<PrefixFilterProps> = ({ visible, uniquePrefixes, selectedPrefixes, setSelectedPrefixes }) => {
  if (!visible) return null;
  const prefixOptions = [
    { value: '', label: 'No Prefix' },
    ...uniquePrefixes.map(prefix => ({ value: prefix, label: prefix })),
  ];
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>Filter Prefixes</h3>
      <Select
        options={prefixOptions}
        isMulti
        onChange={(selectedOptions) => {
          const prefixes = selectedOptions ? selectedOptions.map(option => option.value) : [];
          setSelectedPrefixes(prefixes);
        }}
        value={prefixOptions.filter(option => selectedPrefixes.includes(option.value))}
      />
    </div>
  );
};

export default PrefixFilter;

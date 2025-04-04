import React, { useState } from 'react';

interface SearchFilterProps {
  searchFilters: string[];
  setSearchFilters: (filters: string[]) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ searchFilters, setSearchFilters }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const addSearchTerm = () => {
    const term = searchTerm.trim();
    if (term !== '' && !searchFilters.includes(term)) {
      setSearchFilters([...searchFilters, term]);
      setSearchTerm('');
    }
  };

  const removeSearchTerm = (term: string) => {
    setSearchFilters(searchFilters.filter(t => t !== term));
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>Search Filter</h3>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter search term"
          style={{ flex: 1, padding: '4px' }}
        />
        <button onClick={addSearchTerm}>Search</button>
      </div>
      <div>
        {searchFilters.map(term => (
          <span
            key={term}
            style={{
              display: 'inline-block',
              backgroundColor: '#eee',
              padding: '4px 8px',
              borderRadius: '4px',
              marginRight: '4px',
              marginBottom: '4px',
            }}
          >
            {term}{' '}
            <button
              onClick={() => removeSearchTerm(term)}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              x
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default SearchFilter;

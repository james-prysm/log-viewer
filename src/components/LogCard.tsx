import React, { useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { searchProject, openFileInGoland } from '../utils/sourceSearch';
import { LogEntry } from '../types';

interface LogCardProps {
  log: LogEntry;
  expandAccordions: boolean;
  timeMode: 'absolute' | 'seconds' | 'milliseconds';
  startTime?: number;
  projectPath: string;
}

const LogCard: React.FC<LogCardProps> = ({ log, expandAccordions, timeMode, startTime, projectPath }) => {
  // Determine background and level text colors based on log level.
  let bgColor = 'white';
  let levelTextColor = 'black';
  const levelLower = log.level.toLowerCase();
  if (levelLower === 'error') {
    bgColor = '#ffcccc';
    levelTextColor = 'red';
  } else if (levelLower === 'warning') {
    bgColor = '#ffe5cc';
    levelTextColor = 'orange';
  } else if (levelLower === 'debug') {
    bgColor = '#f0f0f0';
    levelTextColor = 'gray';
  } else if (levelLower === 'info') {
    bgColor = 'white';
    levelTextColor = 'blue';
  }

  // Compute display time based on the selected time mode.
  let displayTime = log.time;
  if (log.timestamp !== undefined && startTime !== undefined) {
    if (timeMode === 'absolute') {
      displayTime = new Date(log.timestamp).toLocaleString();
    } else if (timeMode === 'seconds') {
      displayTime = ((log.timestamp - startTime) / 1000).toFixed(2) + ' s';
    } else if (timeMode === 'milliseconds') {
      displayTime = (log.timestamp - startTime) + ' ms';
    }
  }

  // Parse the "other" field into key/value pairs.
  const otherKeyValues = log.other
    .split(';')
    .map(item => item.trim())
    .filter(item => item !== '')
    .map(item => {
      const [key, value] = item.split('=');
      return { key, value };
    });

  // Always call hooks at the top.
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  useEffect(() => {
    setIsExpanded(expandAccordions);
  }, [expandAccordions]);

  // Handler to search for the originating file when the message is clicked.
  const handleMessageClick = async () => {
    // Use a heuristic search term: first 50 characters of the message.
    const searchTerm = log.msg.substring(0, 50);
    const result = await searchProject(searchTerm, projectPath);
    if (result) {
      openFileInGoland(projectPath, result.filePath, result.lineNumber);
    } else {
      alert('Source not found.');
    }
  };

  // Define header row with fixed column widths.
  const headerRow = (
    <div style={{ display: 'flex', alignItems: 'center', padding: '10px', boxSizing: 'border-box' }}>
      <div style={{ width: '200px', textAlign: 'left' }}>{displayTime}</div>
      <div style={{ width: '150px', textAlign: 'left', fontWeight: 'bold', color: levelTextColor }}>
        {log.level}
      </div>
      <div
        style={{ flex: 1, textAlign: 'left', cursor: 'pointer', textDecoration: 'underline' }}
        onClick={handleMessageClick}
      >
        {log.msg}
      </div>
      <div style={{ width: '150px', textAlign: 'right', paddingRight: '10px' }}>
        {log.prefix}
      </div>
    </div>
  );

  // Define details content for extra "other" data.
  const detailsContent = (
    <div style={{ padding: '0 10px 10px 10px', boxSizing: 'border-box' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {otherKeyValues.map((pair, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ddd', padding: '4px', fontWeight: 'bold', width: '40%' }}>
                {pair.key}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '4px' }}>
                {pair.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Define the card container style.
  const cardStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '1048px',
    margin: '10px auto', // centers the card horizontally with vertical spacing
    boxSizing: 'border-box',
  };

  // If there's no extra "other" data, render a simple card.
  if (otherKeyValues.length === 0) {
    return <div style={cardStyle}>{headerRow}</div>;
  }

  // Otherwise, render as an Accordion.
  return (
    <div style={cardStyle}>
      <Accordion
        expanded={isExpanded}
        onChange={() => setIsExpanded(prev => !prev)}
        elevation={0}
        style={{ backgroundColor: bgColor, boxSizing: 'border-box' }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          style={{ backgroundColor: bgColor, padding: 0, boxSizing: 'border-box' }}
        >
          {headerRow}
        </AccordionSummary>
        <AccordionDetails style={{ backgroundColor: bgColor, padding: 0, boxSizing: 'border-box' }}>
          {detailsContent}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default LogCard;

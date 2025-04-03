import React, { useState, useEffect } from 'react';
import { LogEntry } from '../types';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface LogCardProps {
  log: LogEntry;
  expandAccordions: boolean;
  timeMode: 'absolute' | 'seconds' | 'milliseconds';
  startTime?: number;
}

const LogCard: React.FC<LogCardProps> = ({ log, expandAccordions, timeMode, startTime }) => {
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

  // Define the header row (always visible).
  const headerRow = (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '10px' }}>
      <div style={{ textAlign: 'left', marginRight: '8px' }}>{displayTime}</div>
      <div style={{ textAlign: 'left', marginRight: '8px', fontWeight: 'bold', color: levelTextColor }}>
        {log.level}
      </div>
      <div style={{ textAlign: 'left', flex: 1 }}>{log.msg}</div>
      <div style={{ textAlign: 'right' }}>{log.prefix}</div>
    </div>
  );

  // Define details (only the extra data).
  const detailsContent = otherKeyValues.length > 0 && (
    <div style={{ padding: '0 10px 10px 10px' }}>
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

  // Define the card container style with no extra vertical margins.
  const cardStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '1048px',
    margin: '0', // centers the card horizontally; no extra vertical space.
  };

  // If there is no extra "other" data, render a simple card.
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
        style={{ backgroundColor: bgColor }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ backgroundColor: bgColor, padding: 0 }}>
          {headerRow}
        </AccordionSummary>
        <AccordionDetails style={{ backgroundColor: bgColor, padding: 0 }}>
          {detailsContent}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default LogCard;

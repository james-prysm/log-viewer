import React from 'react';

interface AccordionControlProps {
  expandAccordions: boolean;
  setExpandAccordions: (val: boolean) => void;
}

const AccordionControl: React.FC<AccordionControlProps> = ({ expandAccordions, setExpandAccordions }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>Accordion Control</h3>
      <label>
        <input
          type="checkbox"
          checked={expandAccordions}
          onChange={() => setExpandAccordions(!expandAccordions)}
        />
        Expand All Accordions
      </label>
    </div>
  );
};

export default AccordionControl;

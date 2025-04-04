import React from 'react';

interface ProjectPathInputProps {
  projectPath: string;
  setProjectPath: (path: string) => void;
}

const ProjectPathInput: React.FC<ProjectPathInputProps> = ({ projectPath, setProjectPath }) => (
  <div style={{ marginBottom: '20px' }}>
    <h3>Project Root Path</h3>
    <input
      type="text"
      value={projectPath ? projectPath : '/Users/james/git/prysm'}
      onChange={(e) => setProjectPath(e.target.value)}
      placeholder="Enter your project root path"
      style={{ width: '100%', padding: '4px', boxSizing: 'border-box' }}
    />
  </div>
);

export default ProjectPathInput;

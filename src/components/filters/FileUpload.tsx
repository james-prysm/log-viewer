import React from 'react';

interface FileUploadProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, onDrop, onDragOver }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ marginBottom: '10px' }}>
        <input type="file" accept=".log" onChange={onFileChange} />
      </div>
      <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        style={{
          border: '2px dashed #ccc',
          padding: '20px',
          textAlign: 'center'
        }}
      >
        Drag and drop your .log file here
      </div>
    </div>
  );
};

export default FileUpload;

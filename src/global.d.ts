// src/global.d.ts
export interface ElectronAPI {
    searchProject: (searchTerm: string, projectPath: string) => Promise<{ filePath: string; lineNumber: number } | null>;
    openFileInGoland: (projectPath: string, relativeFilePath: string, lineNumber: number) => Promise<any>;
  }
  
  declare global {
    interface Window {
      electronAPI: ElectronAPI;
    }
  }
  
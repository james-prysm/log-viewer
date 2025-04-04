// preload.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  searchProject: (searchTerm: string, projectPath: string) =>
    ipcRenderer.invoke('search-project', { searchTerm, projectPath }),
  openFileInGoland: (projectPath: string, relativeFilePath: string, lineNumber: number) =>
    ipcRenderer.invoke('open-file-in-goland', { projectPath, relativeFilePath, lineNumber }),
});

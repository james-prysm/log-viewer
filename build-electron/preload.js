"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// preload.ts
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    searchProject: (searchTerm, projectPath) => electron_1.ipcRenderer.invoke('search-project', { searchTerm, projectPath }),
    openFileInGoland: (projectPath, relativeFilePath, lineNumber) => electron_1.ipcRenderer.invoke('open-file-in-goland', { projectPath, relativeFilePath, lineNumber }),
});
//# sourceMappingURL=preload.js.map
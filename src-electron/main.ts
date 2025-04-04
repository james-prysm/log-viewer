// main.ts
import { app, BrowserWindow, ipcMain } from 'electron';
import { exec } from 'child_process';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,  // recommended for security
      nodeIntegration: true, // DO NOT USE IN PRODUCTION
    },
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('Loading development URL: http://localhost:3000');
    mainWindow.loadURL('http://localhost:3000')
      .then(() => console.log('loadURL promise resolved: Dev URL loaded successfully'))
      .catch((error) => console.error('loadURL promise rejected:', error));
  } else {
    const filePath = path.join(__dirname, '../build/index.html');
    console.log('Attempting to load file:', filePath);
    mainWindow.loadFile(filePath)
      .then(() => console.log('loadFile promise resolved: File loaded successfully'))
      .catch((error) => console.error('loadFile promise rejected:', error));
  }

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('WebContents: Finished loading the page.');
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error(`WebContents: Failed to load page: ${errorCode} - ${errorDescription}`);
  });

  // Open DevTools for debugging renderer logs.
  //mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC handler to search the project using ripgrep.
ipcMain.handle('search-project', async (event, { searchTerm, projectPath }) => {
  const command = `rg --max-count=1 --json "${searchTerm}" "${projectPath}"`;
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Search error:", error);
        return resolve(null);
      }
      try {
        // Split the output by newlines and filter out empty lines.
        const lines = stdout.split('\n').filter(line => line.trim() !== '');
        // Parse each line as JSON.
        const results = lines.map(line => JSON.parse(line));
        // Filter for objects that represent a match.
        const matches = results.filter(item => item.type === 'match');
        if (matches.length > 0) {
          const matchData = matches[0].data;
          const filePath = matchData.path.text;
          const lineNumber = matchData.line_number;
          resolve({ filePath, lineNumber });
        } else {
          resolve(null);
        }
      } catch (e) {
        console.error("Parsing error:", e);
        resolve(null);
      }
    });
  });
});

// IPC handler to open a file in Goland.
ipcMain.handle('open-file-in-goland', async (event, { projectPath, relativeFilePath, lineNumber }) => {
  const fullPath = relativeFilePath;
  const command = `goland --line ${lineNumber} "${fullPath}"`;
  console.log('Executing Goland command:', command);
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Error opening file:", error);
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// main.ts
const electron_1 = require("electron");
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
let mainWindow = null;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true, // recommended for security
            nodeIntegration: true, // DO NOT USE IN PRODUCTION
        },
    });
    if (process.env.NODE_ENV === 'development') {
        console.log('Loading development URL: http://localhost:3000');
        mainWindow.loadURL('http://localhost:3000')
            .then(() => console.log('loadURL promise resolved: Dev URL loaded successfully'))
            .catch((error) => console.error('loadURL promise rejected:', error));
    }
    else {
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
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
// IPC handler to search the project using ripgrep.
electron_1.ipcMain.handle('search-project', async (event, { searchTerm, projectPath }) => {
    const command = `rg --max-count=1 --json "${searchTerm}" "${projectPath}"`;
    return new Promise((resolve) => {
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
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
                }
                else {
                    resolve(null);
                }
            }
            catch (e) {
                console.error("Parsing error:", e);
                resolve(null);
            }
        });
    });
});
// IPC handler to open a file in Goland.
electron_1.ipcMain.handle('open-file-in-goland', async (event, { projectPath, relativeFilePath, lineNumber }) => {
    const fullPath = relativeFilePath;
    const command = `goland --line ${lineNumber} "${fullPath}"`;
    console.log('Executing Goland command:', command);
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
            if (error) {
                console.error("Error opening file:", error);
                reject(error);
            }
            else {
                resolve(stdout);
            }
        });
    });
});
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
//# sourceMappingURL=main.js.map
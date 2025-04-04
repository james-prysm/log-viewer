import { exec } from 'child_process';

export function searchProject(
  searchTerm: string,
  projectPath: string
): Promise<{ filePath: string; lineNumber: number } | null> {
  const command = `rg --max-count=1 --json "${searchTerm}" "${projectPath}"`;
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Search error:", error);
        return resolve(null);
      }
      try {
        const result = JSON.parse(stdout);
        if (result.length > 0) {
          // Extract file path and line number from the first match.
          const match = result[0].data;
          const filePath = match.path.text;
          const lineNumber = match.line_number;
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
}

export function openFileInGoland(
  projectPath: string,
  relativeFilePath: string,
  lineNumber: number
): void {
  // Combine the project path and relative file path.
  const fullPath = projectPath.endsWith('/')
    ? projectPath + relativeFilePath
    : projectPath + '/' + relativeFilePath;
  // Execute the Goland CLI command (assumes Goland's CLI launcher is set up)
  const command = `goland --line ${lineNumber} "${fullPath}"`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error opening file: ${error}`);
    } else {
      console.log(`File opened: ${stdout}`);
    }
  });
}

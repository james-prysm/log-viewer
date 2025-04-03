import { useState, useCallback } from 'react';
import { LogEntry } from '../types';

export const useLogStream = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [uniqueLevels, setUniqueLevels] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [uniquePrefixes, setUniquePrefixes] = useState<string[]>([]);
  const [selectedPrefixes, setSelectedPrefixes] = useState<string[]>([]);
  const [allTimeRange, setAllTimeRange] = useState<[number, number] | null>(null);
  const [timeFilter, setTimeFilter] = useState<[number, number] | null>(null);

  const processFile = useCallback(async (file: File) => {
    setLoading(true);
    const reader = file.stream().getReader();
    const decoder = new TextDecoder('utf-8');
    let { done, value } = await reader.read();
    let accumulated = "";
    const regex = /(\w+)=(".*?"|\S+)/g;
    const newLogs: LogEntry[] = [];

    while (!done) {
      accumulated += decoder.decode(value!, { stream: true });
      const lines = accumulated.split(/\r?\n/);
      accumulated = lines.pop() || "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        let entry: LogEntry = { time: "", level: "", msg: "", prefix: "", other: "" };
        let match: RegExpExecArray | null;
        while ((match = regex.exec(trimmed)) !== null) {
          const key = match[1];
          let val = match[2];
          if (val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1);
          }
          if (["time", "level", "msg", "prefix"].includes(key)) {
            (entry as any)[key] = val;
            if (key === "time") {
              const ts = new Date(val.replace(" ", "T")).getTime();
              if (!isNaN(ts)) {
                entry.timestamp = ts;
              }
            }
          } else {
            entry.other += entry.other ? `; ${key}=${val}` : `${key}=${val}`;
          }
        }
        newLogs.push(entry);
      }
      ({ done, value } = await reader.read());
    }
    // Process any remaining text:
    accumulated += decoder.decode();
    if (accumulated.trim().length > 0) {
      const lines = accumulated.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        let entry: LogEntry = { time: "", level: "", msg: "", prefix: "", other: "" };
        let match: RegExpExecArray | null;
        while ((match = regex.exec(trimmed)) !== null) {
          const key = match[1];
          let val = match[2];
          if (val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1);
          }
          if (["time", "level", "msg", "prefix"].includes(key)) {
            (entry as any)[key] = val;
            if (key === "time") {
              const ts = new Date(val.replace(" ", "T")).getTime();
              if (!isNaN(ts)) {
                entry.timestamp = ts;
              }
            }
          } else {
            entry.other += entry.other ? `; ${key}=${val}` : `${key}=${val}`;
          }
        }
        newLogs.push(entry);
      }
    }
    
    // Update logs state:
    setLogs(newLogs);

    // Compute unique levels:
    const levels = Array.from(new Set(newLogs.map(log => log.level))).sort();
    setUniqueLevels(levels);
    setSelectedLevels(levels);

    // Compute unique prefixes (ensure empty string is included for "No Prefix"):
    let prefixes = Array.from(new Set(newLogs.map(log => log.prefix))).sort();
    if (!prefixes.includes('')) {
      prefixes = ['', ...prefixes];
    }
    setUniquePrefixes(prefixes);
    setSelectedPrefixes(prefixes);

    // Compute overall time range:
    const timestamps = newLogs.filter(log => log.timestamp !== undefined).map(log => log.timestamp as number);
    if (timestamps.length > 0) {
      const minTime = Math.min(...timestamps);
      const maxTime = Math.max(...timestamps);
      setAllTimeRange([minTime, maxTime]);
      setTimeFilter([minTime, maxTime]);
    }
    
    console.log('Unique Levels:', levels);
    console.log('Unique Prefixes:', prefixes);
    console.log('Time Range:', allTimeRange, timeFilter);
    
    setLoading(false);
    setProgress(100);
  }, []);

  return { logs, progress, loading, processFile, uniqueLevels, selectedLevels, setSelectedLevels, uniquePrefixes, selectedPrefixes, setSelectedPrefixes, allTimeRange, timeFilter, setTimeFilter };
};

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
    setLogs([]);
    setProgress(0);
    const fileSize = file.size;
    const reader = file.stream().getReader();
    const decoder = new TextDecoder('utf-8');

    let bytesRead = 0;
    let accumulated = "";
    const regex = /(\w+)=(".*?"|\S+)/g;
    const newLogs: LogEntry[] = [];
    const levelSet = new Set<string>();
    const prefixSet = new Set<string>();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesRead += value!.length;
      const newProgress = Math.min((bytesRead / fileSize) * 100, 100);
      setProgress(newProgress);
      
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
            if (key === "level") {
              levelSet.add(val);
            }
            if (key === "prefix") {
              prefixSet.add(val);
            }
          } else {
            entry.other += entry.other ? `; ${key}=${val}` : `${key}=${val}`;
          }
        }
        newLogs.push(entry);
      }
      // Yield control so the UI can update
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    // Process any remaining text.
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
            if (key === "level") {
              levelSet.add(val);
            }
            if (key === "prefix") {
              prefixSet.add(val);
            }
          } else {
            entry.other += entry.other ? `; ${key}=${val}` : `${key}=${val}`;
          }
        }
        newLogs.push(entry);
      }
    }
    
    // Update states.
    setLogs(newLogs);
    const levels = Array.from(levelSet).sort();
    setUniqueLevels(levels);
    setSelectedLevels(levels);
    let prefixes = Array.from(prefixSet).sort();
    if (!prefixes.includes('')) {
      prefixes = ['', ...prefixes];
    }
    setUniquePrefixes(prefixes);
    setSelectedPrefixes(prefixes);
    const timestamps = newLogs.filter(log => log.timestamp !== undefined).map(log => log.timestamp as number);
    if (timestamps.length > 0) {
      const minTime = Math.min(...timestamps);
      const maxTime = Math.max(...timestamps);
      setAllTimeRange([minTime, maxTime]);
      setTimeFilter([minTime, maxTime]);
    }
    setLoading(false);
    setProgress(100);
  }, []);

  return {
    logs,
    progress,
    loading,
    processFile,
    uniqueLevels,
    selectedLevels,
    setSelectedLevels,
    uniquePrefixes,
    selectedPrefixes,
    setSelectedPrefixes,
    allTimeRange,
    timeFilter,
    setTimeFilter,
  };
};

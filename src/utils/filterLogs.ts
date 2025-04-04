// src/utils/filterLogs.ts
import { LogEntry } from "../types";

export interface FilterCriteria {
  selectedLevels: string[];
  selectedPrefixes: string[];
  timeFilter: [number, number] | null;
  searchFilters: string[];
}

export const filterLogs = (
  logs: LogEntry[],
  { selectedLevels, selectedPrefixes, timeFilter, searchFilters }: FilterCriteria
): LogEntry[] => {
  let result = logs;
  if (selectedLevels.length > 0) {
    result = result.filter(log => selectedLevels.includes(log.level));
  }
  if (selectedPrefixes.length > 0) {
    result = result.filter(log => selectedPrefixes.includes(log.prefix));
  }
  if (timeFilter) {
    result = result.filter(
      log =>
        log.timestamp !== undefined &&
        log.timestamp >= timeFilter[0] &&
        log.timestamp <= timeFilter[1]
    );
  }
  if (searchFilters.length > 0) {
    result = result.filter(log => {
      const searchText = `${log.time} ${log.level} ${log.msg} ${log.prefix} ${log.other}`.toLowerCase();
      return searchFilters.every(term => searchText.includes(term.toLowerCase()));
    });
  }
  return result;
};

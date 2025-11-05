export type ScanHistoryItem = {
  id: string;
  timestamp: string;
  preview: string;
  prediction: 'spam' | 'ham';
  confidence: number;
  model: string;
  text: string;
};

const HISTORY_KEY = 'scan_history';
const MAX_HISTORY = 50;

export function addToHistory(item: Omit<ScanHistoryItem, 'id' | 'timestamp' | 'preview'>): void {
  const history = getHistory();
  const newItem: ScanHistoryItem = {
    ...item,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    preview: item.text.slice(0, 80) + (item.text.length > 80 ? '...' : '')
  };
  
  history.unshift(newItem);
  
  if (history.length > MAX_HISTORY) {
    history.splice(MAX_HISTORY);
  }
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getHistory(): ScanHistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

export function exportHistoryCSV(): string {
  const history = getHistory();
  const headers = ['Timestamp', 'Prediction', 'Confidence', 'Model', 'Preview'];
  const rows = history.map(item => [
    item.timestamp,
    item.prediction,
    item.confidence.toFixed(4),
    item.model,
    `"${item.preview.replace(/"/g, '""')}"`
  ]);
  
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

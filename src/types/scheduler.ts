export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
}

export interface GanttBlock {
  processId: string | null; // null = idle
  start: number;
  end: number;
}

export interface ProcessResult {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  completionTime: number;
  turnaroundTime: number;
  waitingTime: number;
}

export interface SchedulingResult {
  gantt: GanttBlock[];
  results: ProcessResult[];
  avgWaitingTime: number;
  avgTurnaroundTime: number;
}

export type AlgorithmType = 'fcfs' | 'sjf-np' | 'sjf-p' | 'rr' | 'priority-np' | 'priority-p';

export const ALGORITHM_LABELS: Record<AlgorithmType, string> = {
  'fcfs': 'First Come First Serve',
  'sjf-np': 'SJF (Non-Preemptive)',
  'sjf-p': 'SJF (Preemptive / SRTF)',
  'rr': 'Round Robin',
  'priority-np': 'Priority (Non-Preemptive)',
  'priority-p': 'Priority (Preemptive)',
};

export const PROCESS_COLORS = [
  'hsl(210, 79%, 56%)',  // blue
  'hsl(142, 71%, 45%)',  // green
  'hsl(0, 84%, 60%)',    // red
  'hsl(38, 92%, 50%)',   // orange
  'hsl(270, 60%, 58%)',  // purple
  'hsl(190, 80%, 45%)',  // teal
  'hsl(330, 70%, 55%)',  // pink
  'hsl(55, 85%, 50%)',   // yellow
  'hsl(15, 75%, 55%)',   // coral
  'hsl(240, 55%, 60%)',  // indigo
  'hsl(160, 65%, 45%)',  // emerald
  'hsl(300, 50%, 55%)',  // magenta
];

export function getProcessColor(index: number): string {
  return PROCESS_COLORS[index % PROCESS_COLORS.length];
}

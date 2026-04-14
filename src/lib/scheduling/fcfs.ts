import { Process, SchedulingResult, GanttBlock, ProcessResult } from '@/types/scheduler';

export function fcfs(processes: Process[]): SchedulingResult {
  if (processes.length === 0) return { gantt: [], results: [], avgWaitingTime: 0, avgTurnaroundTime: 0 };

  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime || a.id.localeCompare(b.id));
  const gantt: GanttBlock[] = [];
  const resultMap = new Map<string, ProcessResult>();
  let currentTime = 0;

  for (const p of sorted) {
    if (p.burstTime === 0) {
      resultMap.set(p.id, {
        id: p.id, arrivalTime: p.arrivalTime, burstTime: p.burstTime, priority: p.priority,
        completionTime: Math.max(currentTime, p.arrivalTime),
        turnaroundTime: Math.max(currentTime, p.arrivalTime) - p.arrivalTime,
        waitingTime: Math.max(currentTime, p.arrivalTime) - p.arrivalTime,
      });
      continue;
    }

    if (currentTime < p.arrivalTime) {
      gantt.push({ processId: null, start: currentTime, end: p.arrivalTime });
      currentTime = p.arrivalTime;
    }

    const start = currentTime;
    const end = start + p.burstTime;
    gantt.push({ processId: p.id, start, end });
    currentTime = end;

    resultMap.set(p.id, {
      id: p.id, arrivalTime: p.arrivalTime, burstTime: p.burstTime, priority: p.priority,
      completionTime: end, turnaroundTime: end - p.arrivalTime, waitingTime: end - p.arrivalTime - p.burstTime,
    });
  }

  const results = processes.map(p => resultMap.get(p.id)!);
  const avgWaitingTime = results.reduce((s, r) => s + r.waitingTime, 0) / results.length;
  const avgTurnaroundTime = results.reduce((s, r) => s + r.turnaroundTime, 0) / results.length;

  return { gantt, results, avgWaitingTime, avgTurnaroundTime };
}

import { Process, SchedulingResult, GanttBlock, ProcessResult } from '@/types/scheduler';

export function roundRobin(processes: Process[], quantum: number): SchedulingResult {
  if (processes.length === 0 || quantum <= 0) return { gantt: [], results: [], avgWaitingTime: 0, avgTurnaroundTime: 0 };

  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime || a.id.localeCompare(b.id));
  const remainingBurst = new Map<string, number>();
  const resultMap = new Map<string, ProcessResult>();
  const gantt: GanttBlock[] = [];

  for (const p of sorted) {
    remainingBurst.set(p.id, p.burstTime);
    if (p.burstTime === 0) {
      resultMap.set(p.id, {
        id: p.id, arrivalTime: p.arrivalTime, burstTime: 0, priority: p.priority,
        completionTime: p.arrivalTime, turnaroundTime: 0, waitingTime: 0,
      });
    }
  }

  const queue: string[] = [];
  let currentTime = 0;
  const inQueue = new Set<string>();

  // Add initially arrived processes
  for (const p of sorted) {
    if (p.arrivalTime <= currentTime && remainingBurst.get(p.id)! > 0) {
      queue.push(p.id);
      inQueue.add(p.id);
    }
  }

  while (queue.length > 0 || [...remainingBurst.values()].some(v => v > 0)) {
    if (queue.length === 0) {
      const next = sorted.find(p => remainingBurst.get(p.id)! > 0 && p.arrivalTime > currentTime);
      if (!next) break;
      gantt.push({ processId: null, start: currentTime, end: next.arrivalTime });
      currentTime = next.arrivalTime;
      // Add newly arrived
      for (const p of sorted) {
        if (p.arrivalTime <= currentTime && remainingBurst.get(p.id)! > 0 && !inQueue.has(p.id)) {
          queue.push(p.id);
          inQueue.add(p.id);
        }
      }
      continue;
    }

    const pid = queue.shift()!;
    inQueue.delete(pid);
    const rem = remainingBurst.get(pid)!;
    const execTime = Math.min(rem, quantum);
    const start = currentTime;
    const end = start + execTime;

    gantt.push({ processId: pid, start, end });
    remainingBurst.set(pid, rem - execTime);
    currentTime = end;

    // Add newly arrived processes (before re-adding current if not done)
    for (const p of sorted) {
      if (p.arrivalTime > start && p.arrivalTime <= currentTime && remainingBurst.get(p.id)! > 0 && !inQueue.has(p.id) && p.id !== pid) {
        queue.push(p.id);
        inQueue.add(p.id);
      }
    }

    if (remainingBurst.get(pid)! > 0) {
      queue.push(pid);
      inQueue.add(pid);
    } else {
      const proc = processes.find(p => p.id === pid)!;
      resultMap.set(pid, {
        id: pid, arrivalTime: proc.arrivalTime, burstTime: proc.burstTime, priority: proc.priority,
        completionTime: currentTime, turnaroundTime: currentTime - proc.arrivalTime,
        waitingTime: currentTime - proc.arrivalTime - proc.burstTime,
      });
    }
  }

  const results = processes.map(p => resultMap.get(p.id)!);
  const avgWaitingTime = results.reduce((s, r) => s + r.waitingTime, 0) / results.length;
  const avgTurnaroundTime = results.reduce((s, r) => s + r.turnaroundTime, 0) / results.length;
  return { gantt, results, avgWaitingTime, avgTurnaroundTime };
}

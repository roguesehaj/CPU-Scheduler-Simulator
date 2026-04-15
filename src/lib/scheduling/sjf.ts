import { Process, SchedulingResult, GanttBlock, ProcessResult } from '@/types/scheduler';

export function sjfNonPreemptive(processes: Process[]): SchedulingResult {
  if (processes.length === 0) return { gantt: [], results: [], avgWaitingTime: 0, avgTurnaroundTime: 0 };

  const gantt: GanttBlock[] = [];
  const resultMap = new Map<string, ProcessResult>();
  const remaining = processes.map(p => ({ ...p }));
  const done = new Set<string>();
  let currentTime = 0;

  // Handle zero burst
  for (const p of remaining) {
    if (p.burstTime === 0) {
      resultMap.set(p.id, {
        id: p.id, arrivalTime: p.arrivalTime, burstTime: 0, priority: p.priority,
        completionTime: p.arrivalTime, turnaroundTime: 0, waitingTime: 0,
      });
      done.add(p.id);
    }
  }

  while (done.size < processes.length) {
    const available = remaining.filter(p => !done.has(p.id) && p.arrivalTime <= currentTime);

    if (available.length === 0) {
      const next = remaining.filter(p => !done.has(p.id)).sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
      gantt.push({ processId: null, start: currentTime, end: next.arrivalTime });
      currentTime = next.arrivalTime;
      continue;
    }

    available.sort((a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime || a.id.localeCompare(b.id));
    const p = available[0];
    const start = currentTime;
    const end = start + p.burstTime;
    gantt.push({ processId: p.id, start, end });
    currentTime = end;
    done.add(p.id);

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

export function sjfPreemptive(processes: Process[]): SchedulingResult {
  if (processes.length === 0) return { gantt: [], results: [], avgWaitingTime: 0, avgTurnaroundTime: 0 };

  const remainingBurst = new Map<string, number>();
  const resultMap = new Map<string, ProcessResult>();
  const gantt: GanttBlock[] = [];

  for (const p of processes) {
    remainingBurst.set(p.id, p.burstTime);
    if (p.burstTime === 0) {
      resultMap.set(p.id, {
        id: p.id, arrivalTime: p.arrivalTime, burstTime: 0, priority: p.priority,
        completionTime: p.arrivalTime, turnaroundTime: 0, waitingTime: 0,
      });
    }
  }

  const maxTime = Math.max(...processes.map(p => p.arrivalTime)) + processes.reduce((s, p) => s + p.burstTime, 0) + 1;
  let currentTime = 0;

  while (currentTime < maxTime) {
    const allDone = [...remainingBurst.values()].every(v => v === 0);
    if (allDone) break;

    const available = processes.filter(p => p.arrivalTime <= currentTime && remainingBurst.get(p.id)! > 0);

    if (available.length === 0) {
      const nextArrival = processes.filter(p => remainingBurst.get(p.id)! > 0).sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
      if (!nextArrival) break;
      gantt.push({ processId: null, start: currentTime, end: nextArrival.arrivalTime });
      currentTime = nextArrival.arrivalTime;
      continue;
    }

    available.sort((a, b) => remainingBurst.get(a.id)! - remainingBurst.get(b.id)! || a.arrivalTime - b.arrivalTime || a.id.localeCompare(b.id));
    const chosen = available[0];

    // Run for 1 unit
    const lastBlock = gantt[gantt.length - 1];
    if (lastBlock && lastBlock.processId === chosen.id && lastBlock.end === currentTime) {
      lastBlock.end = currentTime + 1;
    } else {
      gantt.push({ processId: chosen.id, start: currentTime, end: currentTime + 1 });
    }

    remainingBurst.set(chosen.id, remainingBurst.get(chosen.id)! - 1);
    currentTime++;

    if (remainingBurst.get(chosen.id) === 0) {
      const p = processes.find(pr => pr.id === chosen.id)!;
      resultMap.set(p.id, {
        id: p.id, arrivalTime: p.arrivalTime, burstTime: p.burstTime, priority: p.priority,
        completionTime: currentTime, turnaroundTime: currentTime - p.arrivalTime,
        waitingTime: currentTime - p.arrivalTime - p.burstTime,
      });
    }
  }

  const results = processes.map(p => resultMap.get(p.id)!);
  const avgWaitingTime = results.reduce((s, r) => s + r.waitingTime, 0) / results.length;
  const avgTurnaroundTime = results.reduce((s, r) => s + r.turnaroundTime, 0) / results.length;
  return { gantt, results, avgWaitingTime, avgTurnaroundTime };
}

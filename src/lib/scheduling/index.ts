import { Process, SchedulingResult, AlgorithmType } from '@/types/scheduler';
import { fcfs } from './fcfs';
import { sjfNonPreemptive, sjfPreemptive } from './sjf';
import { roundRobin } from './roundRobin';
import { priorityNonPreemptive, priorityPreemptive } from './priority';

export function runAlgorithm(
  algorithm: AlgorithmType,
  processes: Process[],
  quantum: number = 2
): SchedulingResult {
  switch (algorithm) {
    case 'fcfs': return fcfs(processes);
    case 'sjf-np': return sjfNonPreemptive(processes);
    case 'sjf-p': return sjfPreemptive(processes);
    case 'rr': return roundRobin(processes, quantum);
    case 'priority-np': return priorityNonPreemptive(processes);
    case 'priority-p': return priorityPreemptive(processes);
  }
}

export function runAllAlgorithms(processes: Process[], quantum: number = 2) {
  const algorithms: AlgorithmType[] = ['fcfs', 'sjf-np', 'sjf-p', 'rr', 'priority-np', 'priority-p'];
  return algorithms.map(algo => ({
    algorithm: algo,
    result: runAlgorithm(algo, processes, quantum),
  }));
}

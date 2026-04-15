import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const algorithms = [
  {
    id: 'fcfs',
    title: 'First Come First Serve (FCFS)',
    description: 'Processes are executed in the order they arrive in the ready queue. It is non-preemptive — once a process starts executing, it runs to completion. Simple but can cause the "convoy effect" where short processes wait behind long ones.',
  },
  {
    id: 'sjf',
    title: 'Shortest Job First (SJF)',
    description: 'Selects the process with the smallest burst time from the ready queue. Non-preemptive SJF waits for the current process to finish. Preemptive SJF (SRTF) can interrupt a running process if a new one arrives with a shorter remaining time. Optimal for minimizing average waiting time but requires knowing burst times in advance.',
  },
  {
    id: 'rr',
    title: 'Round Robin (RR)',
    description: 'Each process gets a fixed time slice (quantum) in a circular order. If a process doesn\'t finish within its quantum, it\'s moved to the back of the queue. Provides fair CPU distribution. Performance depends heavily on the quantum size — too small causes excessive context switching, too large degrades to FCFS.',
  },
  {
    id: 'priority',
    title: 'Priority Scheduling',
    description: 'Each process is assigned a priority (lower number = higher priority in this simulator). The CPU is allocated to the highest-priority process. Non-preemptive waits for the running process to finish; preemptive can interrupt. Can cause starvation of low-priority processes — solved by aging techniques.',
  },
];

export function AlgorithmExplainer() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {algorithms.map(algo => (
        <AccordionItem key={algo.id} value={algo.id}>
          <AccordionTrigger className="text-sm font-medium">{algo.title}</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{algo.description}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

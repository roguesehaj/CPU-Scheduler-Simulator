import { ProcessResult } from '@/types/scheduler';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getProcessColor, Process } from '@/types/scheduler';

interface ResultsTableProps {
  results: ProcessResult[];
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  processes: Process[];
}

function MetricHeader({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help border-b border-dashed border-muted-foreground/40">{label}</span>
      </TooltipTrigger>
      <TooltipContent><p className="text-xs max-w-48">{tooltip}</p></TooltipContent>
    </Tooltip>
  );
}

export function ResultsTable({ results, avgWaitingTime, avgTurnaroundTime, processes }: ResultsTableProps) {
  if (results.length === 0) return null;

  const processIndexMap = new Map(processes.map((p, i) => [p.id, i]));

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>ID</TableHead>
            <TableHead><MetricHeader label="AT" tooltip="Arrival Time — when process enters ready queue" /></TableHead>
            <TableHead><MetricHeader label="BT" tooltip="Burst Time — CPU time required" /></TableHead>
            <TableHead><MetricHeader label="Pri" tooltip="Priority — lower number = higher priority" /></TableHead>
            <TableHead><MetricHeader label="CT" tooltip="Completion Time — when process finishes execution" /></TableHead>
            <TableHead><MetricHeader label="TAT" tooltip="Turnaround Time = CT - AT" /></TableHead>
            <TableHead><MetricHeader label="WT" tooltip="Waiting Time = TAT - BT" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map(r => (
            <TableRow key={r.id}>
              <TableCell className="font-mono font-semibold">
                <span className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: getProcessColor(processIndexMap.get(r.id) ?? 0) }} />
                  {r.id}
                </span>
              </TableCell>
              <TableCell>{r.arrivalTime}</TableCell>
              <TableCell>{r.burstTime}</TableCell>
              <TableCell>{r.priority}</TableCell>
              <TableCell className="font-semibold">{r.completionTime}</TableCell>
              <TableCell>{r.turnaroundTime}</TableCell>
              <TableCell>{r.waitingTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="text-right font-medium">Averages</TableCell>
            <TableCell className="font-bold">{avgTurnaroundTime.toFixed(2)}</TableCell>
            <TableCell className="font-bold">{avgWaitingTime.toFixed(2)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

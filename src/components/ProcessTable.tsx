import { Process, getProcessColor } from '@/types/scheduler';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';

interface ProcessTableProps {
  processes: Process[];
  onEdit: (process: Process) => void;
  onDelete: (id: string) => void;
}

export function ProcessTable({ processes, onEdit, onDelete }: ProcessTableProps) {
  if (processes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No processes added yet. Add a process above to get started.
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-16">ID</TableHead>
            <TableHead>Arrival</TableHead>
            <TableHead>Burst</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processes.map((p, i) => (
            <TableRow key={p.id}>
              <TableCell className="font-mono font-semibold">
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: getProcessColor(i) }}
                  />
                  {p.id}
                </span>
              </TableCell>
              <TableCell>{p.arrivalTime}</TableCell>
              <TableCell>{p.burstTime}</TableCell>
              <TableCell>{p.priority}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(p)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(p.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

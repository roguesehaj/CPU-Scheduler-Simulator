import { useState } from 'react';
import { Process } from '@/types/scheduler';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface ProcessFormProps {
  processes: Process[];
  onAdd: (process: Process) => void;
  editingProcess: Process | null;
  onUpdate: (process: Process) => void;
  onCancelEdit: () => void;
}

export function ProcessForm({ processes, onAdd, editingProcess, onUpdate, onCancelEdit }: ProcessFormProps) {
  const [arrivalTime, setArrivalTime] = useState('');
  const [burstTime, setBurstTime] = useState('');
  const [priority, setPriority] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!editingProcess;

  // Populate fields when editing
  useState(() => {
    if (editingProcess) {
      setArrivalTime(String(editingProcess.arrivalTime));
      setBurstTime(String(editingProcess.burstTime));
      setPriority(String(editingProcess.priority));
    }
  });

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const at = Number(arrivalTime);
    const bt = Number(burstTime);
    const pr = Number(priority);

    if (arrivalTime === '' || isNaN(at) || at < 0) newErrors.arrivalTime = 'Must be ≥ 0';
    if (burstTime === '' || isNaN(bt) || bt < 0) newErrors.burstTime = 'Must be ≥ 0';
    if (priority === '' || isNaN(pr) || pr < 0) newErrors.priority = 'Must be ≥ 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing && editingProcess) {
      onUpdate({
        ...editingProcess,
        arrivalTime: Number(arrivalTime),
        burstTime: Number(burstTime),
        priority: Number(priority),
      });
    } else {
      const nextId = `P${processes.length + 1}`;
      onAdd({
        id: nextId,
        arrivalTime: Number(arrivalTime),
        burstTime: Number(burstTime),
        priority: Number(priority),
      });
    }

    setArrivalTime('');
    setBurstTime('');
    setPriority('');
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
      <div className="space-y-1.5">
        <Label htmlFor="arrivalTime" className="text-xs font-medium text-muted-foreground">Arrival Time</Label>
        <Input
          id="arrivalTime"
          type="number"
          min="0"
          placeholder="0"
          value={arrivalTime}
          onChange={e => setArrivalTime(e.target.value)}
          className={errors.arrivalTime ? 'border-destructive' : ''}
        />
        {errors.arrivalTime && <p className="text-xs text-destructive">{errors.arrivalTime}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="burstTime" className="text-xs font-medium text-muted-foreground">Burst Time</Label>
        <Input
          id="burstTime"
          type="number"
          min="0"
          placeholder="1"
          value={burstTime}
          onChange={e => setBurstTime(e.target.value)}
          className={errors.burstTime ? 'border-destructive' : ''}
        />
        {errors.burstTime && <p className="text-xs text-destructive">{errors.burstTime}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="priority" className="text-xs font-medium text-muted-foreground">Priority</Label>
        <Input
          id="priority"
          type="number"
          min="0"
          placeholder="0"
          value={priority}
          onChange={e => setPriority(e.target.value)}
          className={errors.priority ? 'border-destructive' : ''}
        />
        {errors.priority && <p className="text-xs text-destructive">{errors.priority}</p>}
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          <Plus className="h-4 w-4 mr-1" />
          {isEditing ? 'Update' : 'Add'}
        </Button>
        {isEditing && (
          <Button type="button" variant="outline" onClick={onCancelEdit}>Cancel</Button>
        )}
      </div>
    </form>
  );
}

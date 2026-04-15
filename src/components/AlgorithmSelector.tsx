import { AlgorithmType, ALGORITHM_LABELS } from '@/types/scheduler';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AlgorithmSelectorProps {
  algorithm: AlgorithmType;
  onAlgorithmChange: (algo: AlgorithmType) => void;
  quantum: number;
  onQuantumChange: (q: number) => void;
}

export function AlgorithmSelector({ algorithm, onAlgorithmChange, quantum, onQuantumChange }: AlgorithmSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end">
      <div className="flex-1 space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">Algorithm</Label>
        <Select value={algorithm} onValueChange={v => onAlgorithmChange(v as AlgorithmType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(ALGORITHM_LABELS) as [AlgorithmType, string][]).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {algorithm === 'rr' && (
        <div className="w-full sm:w-32 space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Time Quantum</Label>
          <Input
            type="number"
            min="1"
            value={quantum}
            onChange={e => onQuantumChange(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
      )}
    </div>
  );
}

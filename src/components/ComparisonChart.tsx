import { ALGORITHM_LABELS, AlgorithmType } from '@/types/scheduler';
import { SchedulingResult } from '@/types/scheduler';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ComparisonChartProps {
  comparisons: { algorithm: AlgorithmType; result: SchedulingResult }[];
}

export function ComparisonChart({ comparisons }: ComparisonChartProps) {
  if (comparisons.length === 0) return null;

  const data = comparisons.map(c => ({
    name: ALGORITHM_LABELS[c.algorithm].replace(' (Non-Preemptive)', ' NP').replace(' (Preemptive / SRTF)', ' P').replace(' (Preemptive)', ' P').replace(' (Non-Preemptive)', ' NP'),
    'Avg WT': Number(c.result.avgWaitingTime.toFixed(2)),
    'Avg TAT': Number(c.result.avgTurnaroundTime.toFixed(2)),
  }));

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--card-foreground))',
            }}
          />
          <Legend />
          <Bar dataKey="Avg WT" fill="hsl(210, 79%, 56%)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Avg TAT" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

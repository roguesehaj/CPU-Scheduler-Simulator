import { GanttBlock, Process, getProcessColor } from '@/types/scheduler';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface GanttChartProps {
  gantt: GanttBlock[];
  processes: Process[];
  animatedIndex: number; // -1 = show all, otherwise show up to this index
}

export function GanttChart({ gantt, processes, animatedIndex }: GanttChartProps) {
  if (gantt.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Run a simulation to see the Gantt chart.
      </div>
    );
  }

  const processIndexMap = new Map(processes.map((p, i) => [p.id, i]));
  const totalTime = gantt[gantt.length - 1].end;
  const visibleBlocks = animatedIndex >= 0 ? gantt.slice(0, animatedIndex + 1) : gantt;

  return (
    <div className="space-y-2">
      <div className="flex items-stretch rounded-lg overflow-hidden border h-14 bg-muted/30">
        {visibleBlocks.map((block, i) => {
          const widthPercent = ((block.end - block.start) / totalTime) * 100;
          const isIdle = block.processId === null;
          const colorIndex = isIdle ? -1 : processIndexMap.get(block.processId!) ?? 0;

          return (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div
                  className="flex items-center justify-center text-xs font-semibold transition-all duration-300 border-r last:border-r-0"
                  style={{
                    width: `${widthPercent}%`,
                    minWidth: '24px',
                    backgroundColor: isIdle ? 'hsl(var(--muted))' : getProcessColor(colorIndex),
                    color: isIdle ? 'hsl(var(--muted-foreground))' : '#fff',
                    opacity: animatedIndex >= 0 ? 1 : undefined,
                  }}
                >
                  {isIdle ? 'Idle' : block.processId}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-mono text-xs">
                  {isIdle ? 'CPU Idle' : block.processId}: {block.start} → {block.end}
                </p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
      {/* Time markers */}
      <div className="flex text-[10px] text-muted-foreground font-mono">
        {visibleBlocks.map((block, i) => {
          const widthPercent = ((block.end - block.start) / totalTime) * 100;
          return (
            <div key={i} className="relative" style={{ width: `${widthPercent}%`, minWidth: '24px' }}>
              <span className="absolute left-0 -translate-x-1/2">{block.start}</span>
              {i === visibleBlocks.length - 1 && (
                <span className="absolute right-0 translate-x-1/2">{block.end}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

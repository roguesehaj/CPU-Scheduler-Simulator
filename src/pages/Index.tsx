import { useState, useEffect, useCallback, useRef } from 'react';
import { Process, AlgorithmType, SchedulingResult, ALGORITHM_LABELS } from '@/types/scheduler';
import { runAlgorithm, runAllAlgorithms } from '@/lib/scheduling';
import { ProcessForm } from '@/components/ProcessForm';
import { ProcessTable } from '@/components/ProcessTable';
import { AlgorithmSelector } from '@/components/AlgorithmSelector';
import { GanttChart } from '@/components/GanttChart';
import { ResultsTable } from '@/components/ResultsTable';
import { ComparisonChart } from '@/components/ComparisonChart';
import { AlgorithmExplainer } from '@/components/AlgorithmExplainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, BarChart3, Moon, Sun, Download, Save, Upload } from 'lucide-react';

const STORAGE_KEY = 'cpu-scheduler-processes';

const Index = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('fcfs');
  const [quantum, setQuantum] = useState(2);
  const [result, setResult] = useState<SchedulingResult | null>(null);
  const [comparisons, setComparisons] = useState<{ algorithm: AlgorithmType; result: SchedulingResult }[]>([]);
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatedIndex, setAnimatedIndex] = useState(-1);
  const [speed, setSpeed] = useState(500);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleAddProcess = (p: Process) => {
    setProcesses(prev => [...prev, p]);
    setResult(null);
    setComparisons([]);
  };

  const handleUpdateProcess = (p: Process) => {
    setProcesses(prev => prev.map(proc => proc.id === p.id ? p : proc));
    setEditingProcess(null);
    setResult(null);
    setComparisons([]);
  };

  const handleDeleteProcess = (id: string) => {
    setProcesses(prev => prev.filter(p => p.id !== id));
    setResult(null);
    setComparisons([]);
  };

  const handleSimulate = () => {
    if (processes.length === 0) return;
    stopAnimation();
    const r = runAlgorithm(algorithm, processes, quantum);
    setResult(r);
    setAnimatedIndex(-1);
    setShowComparison(false);
  };

  const handleCompare = () => {
    if (processes.length === 0) return;
    stopAnimation();
    const all = runAllAlgorithms(processes, quantum);
    setComparisons(all);
    setShowComparison(true);
    // Also set current algorithm result
    const current = all.find(a => a.algorithm === algorithm);
    if (current) setResult(current.result);
  };

  const handleReset = () => {
    stopAnimation();
    setProcesses([]);
    setResult(null);
    setComparisons([]);
    setEditingProcess(null);
    setAnimatedIndex(-1);
  };

  // Animation controls
  const stopAnimation = useCallback(() => {
    if (animationRef.current) clearTimeout(animationRef.current);
    setIsAnimating(false);
  }, []);

  const startAnimation = useCallback(() => {
    if (!result || result.gantt.length === 0) return;
    setIsAnimating(true);
    setAnimatedIndex(0);
  }, [result]);

  useEffect(() => {
    if (!isAnimating || !result) return;
    if (animatedIndex >= result.gantt.length - 1) {
      setIsAnimating(false);
      return;
    }
    animationRef.current = setTimeout(() => {
      setAnimatedIndex(prev => prev + 1);
    }, speed);
    return () => { if (animationRef.current) clearTimeout(animationRef.current); };
  }, [isAnimating, animatedIndex, result, speed]);

  // Save / Load
  const saveProcesses = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(processes));
  };

  const loadProcesses = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProcesses(JSON.parse(saved));
        setResult(null);
        setComparisons([]);
      } catch { /* ignore */ }
    }
  };

  const exportPdf = () => window.print();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold tracking-tight">
            ⚙️ CPU Scheduler Simulator
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={saveProcesses} title="Save processes">
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={loadProcesses} title="Load processes">
              <Upload className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={exportPdf} title="Export as PDF">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)} title="Toggle dark mode">
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Process Input */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Add Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProcessForm
              processes={processes}
              onAdd={handleAddProcess}
              editingProcess={editingProcess}
              onUpdate={handleUpdateProcess}
              onCancelEdit={() => setEditingProcess(null)}
            />
            <ProcessTable
              processes={processes}
              onEdit={setEditingProcess}
              onDelete={handleDeleteProcess}
            />
          </CardContent>
        </Card>

        {/* Algorithm Selection & Controls */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AlgorithmSelector
              algorithm={algorithm}
              onAlgorithmChange={setAlgorithm}
              quantum={quantum}
              onQuantumChange={setQuantum}
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSimulate} disabled={processes.length === 0}>
                <Play className="h-4 w-4 mr-1" /> Simulate
              </Button>
              <Button variant="secondary" onClick={handleCompare} disabled={processes.length === 0}>
                <BarChart3 className="h-4 w-4 mr-1" /> Compare All
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-1" /> Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <>
            {/* Gantt Chart */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-base">
                    Gantt Chart — {ALGORITHM_LABELS[algorithm]}
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={isAnimating ? stopAnimation : startAnimation}
                    >
                      {isAnimating ? <Pause className="h-3.5 w-3.5 mr-1" /> : <Play className="h-3.5 w-3.5 mr-1" />}
                      {isAnimating ? 'Pause' : 'Animate'}
                    </Button>
                    <div className="flex items-center gap-2 w-32">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">Speed</span>
                      <Slider
                        min={100}
                        max={1500}
                        step={100}
                        value={[1600 - speed]}
                        onValueChange={v => setSpeed(1600 - v[0])}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <GanttChart gantt={result.gantt} processes={processes} animatedIndex={animatedIndex} />
              </CardContent>
            </Card>

            {/* Results Table */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Results</CardTitle>
              </CardHeader>
              <CardContent>
                <ResultsTable
                  results={result.results}
                  avgWaitingTime={result.avgWaitingTime}
                  avgTurnaroundTime={result.avgTurnaroundTime}
                  processes={processes}
                />
              </CardContent>
            </Card>
          </>
        )}

        {/* Comparison */}
        {showComparison && comparisons.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Algorithm Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ComparisonChart comparisons={comparisons} />
            </CardContent>
          </Card>
        )}

        {/* Algorithm Explainer */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Algorithm Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <AlgorithmExplainer />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;

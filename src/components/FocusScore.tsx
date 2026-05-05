import React from 'react';
import { Task } from '../types';
import { cn } from '@/lib/utils';

interface FocusScoreProps {
  tasks: Task[];
  className?: string;
}

export const FocusScore = ({ tasks, className }: FocusScoreProps) => {
  const priorityWeights: Record<string, number> = {
    high: 3,
    medium: 2,
    low: 1
  };

  const totalPoints = tasks.reduce((sum, task) => sum + (priorityWeights[task.priority] || 1), 0);
  const completedPoints = tasks.filter(t => t.completed).reduce((sum, task) => sum + (priorityWeights[task.priority] || 1), 0);
  
  const completionRate = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;
  
  // Simulated productivity diff based on completion rate
  const productivityDiff = completionRate > 50 ? 12 : -5;
  
  // Determine color based on completion rate
  const getBarColor = () => {
    if (completionRate < 33) return 'bg-red-500';
    if (completionRate < 66) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className={cn("bg-slate-50 border border-slate-100 rounded-2xl p-3 lg:p-5", className)}>
      <div className="hidden lg:flex items-baseline justify-between lg:block">
        <div className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-0 lg:mb-1">Focus Score</div>
        <div className="text-xl lg:text-3xl font-bold text-slate-900">{completionRate}%</div>
      </div>
      
      <div className="flex items-center gap-3 lg:block">
        <div className="lg:hidden text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] min-w-[60px]">Focus {completionRate}%</div>
        <div className="flex-1 h-1.5 lg:h-2 bg-slate-200 rounded-full overflow-hidden lg:mt-4">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              getBarColor()
            )} 
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      <p className="hidden lg:block text-[10px] lg:text-[11px] text-slate-500 mt-2 lg:mt-4 leading-relaxed">
        {productivityDiff >= 0 ? (
          <>Je bent <span className="text-primary font-bold">{productivityDiff}%</span> productiever.</>
        ) : (
          <>Je bent <span className="text-red-500 font-bold">{Math.abs(productivityDiff)}%</span> minder productief.</>
        )}
      </p>
    </div>
  );
};

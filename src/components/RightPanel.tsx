import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Task } from '../types';
import { FocusScore } from './FocusScore';

interface RightPanelProps {
  tasks: Task[];
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
}

export const RightPanel = React.memo(({ tasks, selectedDate, onDateSelect }: RightPanelProps) => {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentMonthName = today.toLocaleString('nl-NL', { month: 'long' });
  
  // Calculate full month grid
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  
  // Day of week for 1st day (0 is Sun, 1 is Mon...) -> adjust so Mon is 0
  const startingDayOfWeek = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
  const totalDaysInMonth = lastDayOfMonth.getDate();

  // Create an array for the month grid
  const calendarDays = [];
  
  // Fill in prefix days from previous month (to align with Monday)
  const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({ 
      day: prevMonthLastDay - i, 
      currentMonth: false,
      date: new Date(currentYear, currentMonth - 1, prevMonthLastDay - i)
    });
  }

  // Fill in actual days of current month
  for (let i = 1; i <= totalDaysInMonth; i++) {
    calendarDays.push({ 
      day: i, 
      currentMonth: true,
      date: new Date(currentYear, currentMonth, i)
    });
  }

  // Fill in suffix days to complete the last row (usually to 42 days for 6 rows)
  const remainingCells = 42 - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({ 
      day: i, 
      currentMonth: false,
      date: new Date(currentYear, currentMonth + 1, i)
    });
  }

  const daysOfWeek = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];

  const hasTasksOnDay = (date: Date) => {
    return tasks.some(task => {
      if (!task.dueDate) return false;
      const d = new Date(task.dueDate);
      return d.getDate() === date.getDate() && 
             d.getMonth() === date.getMonth() && 
             d.getFullYear() === date.getFullYear();
    });
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.getDate() === selectedDate.getDate() && 
           date.getMonth() === selectedDate.getMonth() && 
           date.getFullYear() === selectedDate.getFullYear();
  };

  return (
    <aside className="w-80 border-l bg-white h-screen flex flex-col p-6 shadow-sm overflow-hidden">
      <ScrollArea className="h-full">
        <div className="space-y-8">
          {/* Focus Score */}
          <FocusScore tasks={tasks} />

          {/* Calendar */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-slate-900">Kalender</h3>
              <button 
                onClick={() => onDateSelect(null)}
                className="text-[10px] font-bold text-primary bg-secondary px-2 py-0.5 rounded capitalize tracking-wider hover:bg-orange-100 transition-colors"
              >
                {currentMonthName} {currentYear}
              </button>
            </div>
            <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-2xl">
              <div className="grid grid-cols-7 gap-1 text-[10px] text-center font-bold text-slate-400 mb-3">
                {daysOfWeek.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-slate-700">
                {calendarDays.map((dateObj, idx) => {
                  const isToday = dateObj.currentMonth && dateObj.day === currentDay;
                  const dayHasTasks = hasTasksOnDay(dateObj.date);
                  const active = isSelected(dateObj.date);
                  
                  return (
                    <button 
                      key={idx}
                      onClick={() => onDateSelect(dateObj.date)}
                      className={cn(
                        "h-8 w-8 flex flex-col items-center justify-center mx-auto transition-all duration-200 rounded-lg relative overflow-hidden mb-0.5 group",
                        isToday 
                          ? "bg-slate-900 text-white font-bold" 
                          : active
                          ? "bg-primary text-white shadow-md shadow-primary/30 font-bold"
                          : dateObj.currentMonth
                          ? "text-slate-700 hover:bg-slate-100"
                          : "text-slate-300",
                        dayHasTasks && !isToday && !active && "bg-orange-50/80 text-primary font-semibold ring-1 ring-primary/10"
                      )}
                    >
                      <span>{dateObj.day}</span>
                      {dayHasTasks && !active && (
                        <span className={cn(
                          "absolute bottom-1 w-1 h-1 rounded-full",
                          isToday ? "bg-primary" : "bg-primary"
                        )}></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4">Snelle Statistieken</h3>
            <div className="space-y-1">
              <StatRow label="Openstaande taken" value={tasks.filter(t => !t.completed).length.toString()} />
              <StatRow 
                label="Vandaag voltooid" 
                value={tasks.filter(t => t.completed && t.dueDate && new Date(t.dueDate).toDateString() === today.toDateString()).length.toString()} 
              />
              <StatRow 
                label="Gemiddelde focus" 
                value={`${(tasks.filter(t => t.completed).length * 0.5).toFixed(1)}u`} 
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
});

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 -mx-2 px-2 rounded-lg transition-colors">
      <span className="text-xs text-slate-500 font-medium">{label}</span>
      <span className="text-xs font-bold text-slate-900">{value}</span>
    </div>
  );
}

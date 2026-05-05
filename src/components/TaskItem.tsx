import React, { useState } from 'react';
import { 
  Check, 
  Trash2, 
  MoreVertical, 
  Calendar as CalendarIcon,
  ChevronRight,
  X,
  Bell,
  Clock
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Task, TaskPriority, Project } from '../types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onAddSubtask?: (parentId: string, title: string) => void;
  projects?: Project[];
}

const priorityColors = {
  low: "bg-[#fdf2e9] text-[#C36322] border-[#fae6d6]",
  medium: "bg-amber-50 text-amber-700 border-amber-100",
  high: "bg-red-50 text-red-700 border-red-100",
};

export const TaskItem = React.memo<TaskItemProps & { onClick?: () => void }>(({ task, onToggle, onUpdate, onDelete, onAddSubtask, onClick, projects }) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isReminderPickerOpen, setIsReminderPickerOpen] = useState(false);
  
  const projectColor = projects?.find(p => p.name === task.category)?.color;
  const [selectedDate, setSelectedDate] = useState(
    task.dueDate ? task.dueDate.toISOString().split('T')[0] : ''
  );
  const [selectedReminderDate, setSelectedReminderDate] = useState(
    task.reminderDate ? new Date(task.reminderDate.getTime() - task.reminderDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''
  );


  const cyclePriority = () => {
    const priorities: TaskPriority[] = ['low', 'medium', 'high'];
    const currentIndex = priorities.indexOf(task.priority);
    const nextIndex = (currentIndex + 1) % priorities.length;
    onUpdate(task.id, { priority: priorities[nextIndex] });
  };

  const handleCustomDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const saveCustomDate = () => {
    if (selectedDate) {
      onUpdate(task.id, { dueDate: new Date(selectedDate) });
      setIsDatePickerOpen(false);
    }
  };

  const saveReminder = () => {
    if (selectedReminderDate) {
      onUpdate(task.id, { 
        reminderDate: new Date(selectedReminderDate),
        reminderSent: false 
      });
      setIsReminderPickerOpen(false);
    }
  };

  return (
    <>
      <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick?.()}
      className={cn(
        "group relative flex flex-col border border-slate-200 rounded-xl bg-white transition-all hover:border-primary/20 hover:shadow-md mb-3 cursor-pointer",
        task.completed && "opacity-60 bg-slate-50 border-dashed"
      )}
    >
      <div className="flex items-center gap-4 p-4">
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={task.completed}
            onCheckedChange={(checked) => {
              onToggle(task.id);
            }}
            className={cn(
              "w-5 h-5 rounded-md border-2 border-slate-300 transition-colors",
              task.completed && "bg-primary border-primary"
            )}
          />
        </div>
        
        <div className="flex-1 min-w-0 space-y-0.5">
          <h3 className={cn(
            "text-sm font-semibold text-slate-800 transition-all leading-tight truncate sm:whitespace-normal",
            task.completed && "line-through text-slate-400"
          )}>
            {task.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider truncate flex items-center gap-1.5">
              {projectColor && (
                <div 
                  className="w-2 h-2 rounded-full shrink-0" 
                  style={{ backgroundColor: projectColor }} 
                />
              )}
              {task.category}
              {task.dueDate && ` • ${task.dueDate.toLocaleDateString('nl-NL')}`}
              {task.reminderDate && (
                <span className={cn(
                  "flex items-center gap-1",
                  task.reminderSent ? "text-slate-300" : "text-primary"
                )}>
                  • <Bell className="w-2.5 h-2.5" /> 
                  {task.reminderDate.toLocaleString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Badge 
            variant="outline" 
            className={cn(
              "text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md border uppercase tracking-wider cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap", 
              priorityColors[task.priority]
            )}
            onClick={(e) => {
              e.stopPropagation();
              cyclePriority();
            }}
          >
            {task.priority === 'high' ? 'Hoog' : task.priority === 'medium' ? 'Medium' : 'Laag'}
          </Badge>
          
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger 
                className="h-8 w-8 text-slate-400 hover:text-slate-600 opacity-100 sm:opacity-40 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md hover:bg-slate-100 outline-none select-none"
              >
                <MoreVertical className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prioriteit</div>
                <DropdownMenuItem onClick={() => onUpdate(task.id, { priority: 'high' })} className="text-red-600">
                  Hoog
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdate(task.id, { priority: 'medium' })} className="text-amber-600">
                  Medium
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdate(task.id, { priority: 'low' })} className="text-primary">
                  Laag
                </DropdownMenuItem>
                
                <div className="h-px bg-slate-100 my-1" />
                <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Datum</div>
                <DropdownMenuItem onClick={() => onUpdate(task.id, { dueDate: new Date() })}>
                  Vandaag
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdate(task.id, { dueDate: new Date(Date.now() + 86400000) })}>
                  Morgen
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => setIsDatePickerOpen(true)}>
                  Kies datum...
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => onUpdate(task.id, { dueDate: undefined })}>
                  Geen datum
                </DropdownMenuItem>

                <div className="h-px bg-slate-100 my-1" />
                <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Herinnering</div>
                <DropdownMenuItem onClick={() => setIsReminderPickerOpen(true)}>
                  <Bell className="w-3.5 h-3.5 mr-2" />
                  {task.reminderDate ? 'Wijzig herinnering' : 'Herinnering instellen'}
                </DropdownMenuItem>
                
                {task.reminderDate && (
                  <DropdownMenuItem onClick={() => onUpdate(task.id, { reminderDate: undefined, reminderSent: false })} className="text-slate-400">
                    Verwijder herinnering
                  </DropdownMenuItem>
                )}

                <div className="h-px bg-slate-100 my-1" />
                <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-red-600 font-medium">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Verwijderen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.div>

      <Dialog open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deadline instellen</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-slate-500">Selecteer een datum voor "{task.title}"</p>
            <Input 
              type="date" 
              value={selectedDate}
              onChange={handleCustomDate}
              className="w-full h-12 text-base shadow-none border-slate-200 focus:border-[#C36322] focus:ring-1 focus:ring-[#C36322]/20"
              autoFocus
            />
          </div>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="ghost" onClick={() => setIsDatePickerOpen(false)} className="rounded-xl">Annuleren</Button>
            <Button onClick={saveCustomDate} className="bg-[#C36322] hover:bg-[#A5521C] text-white font-bold h-10 px-6 rounded-xl">Opslaan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReminderPickerOpen} onOpenChange={setIsReminderPickerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Herinnering instellen
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-slate-500">Wanneer wil je een melding ontvangen voor "{task.title}"?</p>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Datum & Tijd</label>
              <Input 
                type="datetime-local" 
                value={selectedReminderDate}
                onChange={(e) => setSelectedReminderDate(e.target.value)}
                className="w-full h-12 text-base shadow-none border-slate-200 focus:border-[#C36322] focus:ring-1 focus:ring-[#C36322]/20"
                autoFocus
              />
            </div>
            <p className="text-[10px] text-slate-400 italic px-1">
              Zorg ervoor dat meldingen zijn ingeschakeld in de Algemene Instellingen.
            </p>
          </div>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="ghost" onClick={() => setIsReminderPickerOpen(false)} className="rounded-xl">Annuleren</Button>
            <Button onClick={saveReminder} className="bg-[#C36322] hover:bg-[#A5521C] text-white font-bold h-10 px-6 rounded-xl">Herinnering Opslaan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

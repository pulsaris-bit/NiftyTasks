import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Plus, 
  Calendar, 
  Flag, 
  Tag, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  MessageSquare,
  Clock
} from 'lucide-react';
import { Task, TaskPriority, Project } from '../types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TaskDetailModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  projects: Project[];
  addProject: (name: string, color?: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  projects,
  addProject
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [category, setCategory] = useState(task.category || 'Algemeen');
  const [isAddingNewProject, setIsAddingNewProject] = useState(false);
  const [newProjectValue, setNewProjectValue] = useState('');
  const [dueDate, setDueDate] = useState<string>(
    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || '');
    setPriority(task.priority);
    setCategory(task.category || 'Algemeen');
    setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
  }, [task]);

  const handleSave = () => {
    onUpdate(task.id, {
      title,
      description,
      priority,
      category,
      dueDate: dueDate ? new Date(dueDate) : undefined
    });
  };

  const handleAddProject = () => {
    if (newProjectValue.trim()) {
      addProject(newProjectValue.trim());
      setCategory(newProjectValue.trim());
      onUpdate(task.id, { category: newProjectValue.trim() });
      setNewProjectValue('');
      setIsAddingNewProject(false);
    }
  };

  const toggleStatus = () => {
    onUpdate(task.id, { completed: !task.completed, completedAt: !task.completed ? new Date() : undefined });
  };

  const getPriorityColor = (p: TaskPriority) => {
    switch (p) {
      case 'high': return 'text-red-500 bg-red-50';
      case 'medium': return 'text-amber-500 bg-amber-50';
      case 'low': return 'text-emerald-500 bg-emerald-50';
      default: return 'text-slate-400 bg-slate-50';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: '100%', scale: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: '100%', scale: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:max-w-lg bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl z-[60] overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]"
          >
            {/* Mobile Drag Handle */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0" />
            
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button 
                  onClick={toggleStatus}
                  className="group transition-transform active:scale-90"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-300 group-hover:text-primary transition-colors" />
                  )}
                </button>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Taak Details
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Title */}
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleSave}
                  className="w-full text-xl sm:text-2xl font-bold text-slate-900 border-none p-0 focus:ring-0 placeholder:text-slate-300"
                  placeholder="Naam van de taak..."
                />
              </div>

              {/* Metadata / Category */}
              <div className="space-y-3 pt-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 ml-1">
                  <Tag className="w-3 h-3" /> Project / Label
                </div>
                
                <div className="flex gap-2">
                  {!isAddingNewProject ? (
                    <>
                      <select
                        value={category}
                        onChange={(e) => {
                          if (e.target.value === 'ADD_NEW') {
                            setIsAddingNewProject(true);
                          } else {
                            setCategory(e.target.value);
                            onUpdate(task.id, { category: e.target.value });
                          }
                        }}
                        className="flex-1 rounded-xl border-slate-100 text-sm font-medium focus:ring-primary focus:border-primary py-2.5 px-3 bg-slate-50 text-slate-700 transition-all appearance-none cursor-pointer"
                      >
                        {projects.map(p => (
                          <option key={p.name} value={p.name}>{p.name}</option>
                        ))}
                        <option value="Algemeen">Algemeen</option>
                        <option value="ADD_NEW" className="font-bold text-primary">+ Nieuw label...</option>
                      </select>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsAddingNewProject(true)}
                        className="h-10 w-10 p-0 rounded-xl bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5"
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </>
                  ) : (
                    <div className="flex-1 flex gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                      <input
                        autoFocus
                        type="text"
                        value={newProjectValue}
                        onChange={(e) => setNewProjectValue(e.target.value)}
                        placeholder="Nieuw labelnaam..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddProject();
                          if (e.key === 'Escape') setIsAddingNewProject(false);
                        }}
                        className="flex-1 rounded-xl border-slate-100 text-sm font-medium focus:ring-primary focus:border-primary py-2 px-3 bg-slate-50 text-slate-700"
                      />
                      <Button size="sm" onClick={handleAddProject} className="rounded-xl px-4">
                        Voeg toe
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setIsAddingNewProject(false)} className="rounded-xl w-10 p-0">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Grid Props */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Flag className="w-3 h-3" /> Prioriteit
                  </div>
                  <select
                    value={priority}
                    onChange={(e) => {
                      const newP = e.target.value as TaskPriority;
                      setPriority(newP);
                      onUpdate(task.id, { priority: newP });
                    }}
                    className={cn(
                      "w-full rounded-xl border-slate-100 text-sm font-medium focus:ring-primary focus:border-primary py-2 px-3",
                      getPriorityColor(priority)
                    )}
                  >
                    <option value="low">Laag</option>
                    <option value="medium">Medium</option>
                    <option value="high">Hoog</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" /> Vervaldatum
                  </div>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => {
                      setDueDate(e.target.value);
                      onUpdate(task.id, { dueDate: e.target.value ? new Date(e.target.value) : undefined });
                    }}
                    className="w-full rounded-xl border-slate-100 text-sm font-medium focus:ring-primary focus:border-primary py-2 px-3 bg-slate-50 text-slate-600"
                  />
                </div>
              </div>

              {/* Description / Notes */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3" /> Beschrijving & Notities
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handleSave}
                  rows={4}
                  className="w-full rounded-2xl border-slate-100 text-sm focus:ring-primary focus:border-primary p-4 bg-slate-50 text-slate-700 resize-none"
                  placeholder="Voeg hier meer context of notities toe..."
                />
              </div>

              {/* Metadata */}
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Gemaakt: {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 sm:p-6 bg-slate-50 flex items-center justify-between shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (window.confirm('Weet je zeker dat je deze taak wilt verwijderen?')) {
                    onDelete(task.id);
                    onClose();
                  }
                }}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Verwijder taak
              </Button>
              <Button onClick={onClose} size="sm" className="px-8 shadow-md">
                Sluiten
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

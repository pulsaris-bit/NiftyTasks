/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Plus, Search, Filter, Menu, PanelRightClose, PanelRightOpen, Tag } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TaskItem } from './components/TaskItem';
import { AuthScreen } from './components/AuthScreen';
import { RightPanel } from './components/RightPanel';
import { FocusScore } from './components/FocusScore';
import { TaskDetailModal } from './components/TaskDetailModal';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Task, Project } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeCategory, setActiveCategory] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTaskInput, setNewTaskInput] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('nifty_sidebar_collapsed');
    return saved === 'true';
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isMobileAddOpen, setIsMobileAddOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    { name: 'Persoonlijk', color: '#2563eb' },
    { name: 'Werk', color: '#C36322' },
    { name: 'Gezondheid', color: '#059669' }
  ]);
  const [newTaskProject, setNewTaskProject] = useState<string>('Algemeen');
  const [currentTheme, setCurrentTheme] = useState('orange');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(() => {
    const saved = localStorage.getItem('nifty_right_panel');
    return saved === null ? true : saved === 'true';
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<string | null>(() => localStorage.getItem('nifty_user'));

  // Persistence Effects (User only)
  useEffect(() => {
    if (user) {
      localStorage.setItem('nifty_user', user);
    } else {
      localStorage.removeItem('nifty_user');
    }
  }, [user]);

  // Fetch initial data
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [tasksRes, projectsRes, settingsRes] = await Promise.all([
          fetch(`/api/tasks?email=${user}`).then(res => res.json()),
          fetch(`/api/projects?email=${user}`).then(res => res.json()),
          fetch(`/api/settings?email=${user}`).then(res => res.json())
        ]);

        setTasks(tasksRes.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
          dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
          reminderDate: t.reminderDate ? new Date(t.reminderDate) : undefined
        })));
        setProjects(projectsRes);
        setCurrentTheme(settingsRes.theme);
        setNotificationsEnabled(settingsRes.notificationsEnabled);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, [user]);

  // Save Settings
  useEffect(() => {
    if (!user) return;
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user, theme: currentTheme, notificationsEnabled })
    });
  }, [currentTheme, notificationsEnabled, user]);

  // Theme effect
  useEffect(() => {
    const root = document.documentElement;
    if (currentTheme === 'orange') {
      root.style.setProperty('--primary', '#C36322');
      root.style.setProperty('--primary-dark', '#A5521C');
      root.style.setProperty('--secondary', '#fdf2e9');
      root.style.setProperty('--secondary-foreground', '#C36322');
      root.style.setProperty('--accent', '#fdf2e9');
      root.style.setProperty('--accent-foreground', '#C36322');
      root.style.setProperty('--ring', '#C36322');
    } else if (currentTheme === 'blue') {
      root.style.setProperty('--primary', '#2563eb');
      root.style.setProperty('--primary-dark', '#1e40af');
      root.style.setProperty('--secondary', '#eff6ff');
      root.style.setProperty('--secondary-foreground', '#2563eb');
      root.style.setProperty('--accent', '#eff6ff');
      root.style.setProperty('--accent-foreground', '#2563eb');
      root.style.setProperty('--ring', '#2563eb');
    } else if (currentTheme === 'emerald') {
      root.style.setProperty('--primary', '#059669');
      root.style.setProperty('--primary-dark', '#047857');
      root.style.setProperty('--secondary', '#ecfdf5');
      root.style.setProperty('--secondary-foreground', '#059669');
      root.style.setProperty('--accent', '#ecfdf5');
      root.style.setProperty('--accent-foreground', '#059669');
      root.style.setProperty('--ring', '#059669');
    }
  }, [currentTheme]);

  // Initial dummy data (only if empty)
  useEffect(() => {
    if (tasks.length === 0 && !localStorage.getItem('nifty_tasks')) {
      const initialTasks: Task[] = [
        {
          id: '1',
          title: 'Boodschappen doen',
          description: 'Melk, eieren, brood',
          completed: false,
          priority: 'medium',
          category: 'Persoonlijk',
          createdAt: new Date(),
        },
        {
          id: '2',
          title: 'Project NiftyTasks afronden',
          completed: false,
          priority: 'high',
          category: 'Werk',
          createdAt: new Date(),
          dueDate: new Date(Date.now() + 86400000),
        },
        {
          id: '3',
          title: 'Sporten',
          completed: true,
          priority: 'low',
          category: 'Gezondheid',
          createdAt: new Date(),
        }
      ];
      setTasks(initialTasks);
    }
  }, []);

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => a.name.localeCompare(b.name));
  }, [projects]);

  const categories = useMemo(() => {
    const catsMap = tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + (task.completed ? 0 : 1);
      return acc;
    }, {} as Record<string, number>);

    // Ensure all defined projects are present
    projects.forEach(project => {
      if (!(project.name in catsMap)) {
        catsMap[project.name] = 0;
      }
    });

    return Object.entries(catsMap)
      .map(([name, count]) => {
        const project = projects.find(p => p.name === name);
        return {
          id: name,
          name,
          color: project?.color || '#94a3b8',
          icon: null,
          count
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [tasks, projects]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // If a date is selected in the calendar, filter by that specific date
      if (selectedDate) {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        const isSameDate = 
          taskDate.getDate() === selectedDate.getDate() &&
          taskDate.getMonth() === selectedDate.getMonth() &&
          taskDate.getFullYear() === selectedDate.getFullYear();
        
        return matchesSearch && isSameDate;
      }

      const matchesCategory = 
        (activeCategory === 'all' && !task.completed) || 
        (activeCategory === 'today' && task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString()) ||
        (activeCategory === 'planned' && task.dueDate) ||
        (activeCategory === 'important' && task.priority === 'high') ||
        (activeCategory === 'completed' && task.completed) ||
        (task.category === activeCategory);

      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

      if (activeCategory !== 'completed' && task.completed) return false;

      return matchesSearch && matchesCategory && matchesPriority;
    }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [tasks, activeCategory, searchQuery, priorityFilter, selectedDate]);

  const sendNotification = React.useCallback((title: string, body: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  }, []);

  const requestNotificationPermission = React.useCallback(async () => {
    if (!('Notification' in window)) {
      alert('Deze browser ondersteunt geen meldingen.');
      return;
    }

    if (Notification.permission === 'denied') {
      alert('Meldingen zijn geblokkeerd in je browserinstellingen. Ontgrendel ze via het hangslot-icoontje in de adresbalk en probeer het opnieuw.');
      return;
    }

    if (Notification.permission === 'granted') {
      setNotificationsEnabled(true);
      sendNotification('Meldingen Actief', 'Je ontvangt nu meldingen van NiftyTasks!');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        sendNotification('Meldingen Actief', 'Je ontvangt nu meldingen van NiftyTasks!');
      } else if (permission === 'denied') {
        alert('Je hebt meldingen geweigerd. Om dit te herstellen, moet je de toestemming handmatig resetten in de browserinstellingen.');
      }
    } catch (error) {
      console.error("Fout bij aanvragen notificatie permissie:", error);
      alert('Het aanvragen van meldingen is mislukt. Tip: Open de app in een NIEUW TABBLAD (icoontje rechtsboven) om browser-restricties in de preview te omzeilen.');
    }
  }, [notificationsEnabled, sendNotification]);

  const addTask = React.useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newTaskInput.trim()) {
      inputRef.current?.focus();
      return;
    }
    if (isAddingTask) return;

    setIsAddingTask(true);
    try {
      const taskId = typeof crypto.randomUUID === 'function' 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2) + Date.now().toString(36);

      const newTask: Task = {
        id: taskId,
        title: newTaskInput.trim(), // Sanitize: trim whitespace
        completed: false,
        priority: 'low',
        category: newTaskProject,
        createdAt: new Date(),
        dueDate: undefined,
      };

      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: newTask, email: user })
      });

      setTasks(prev => [newTask, ...prev]);
      setNewTaskInput('');
      // We keep the current newTaskProject so adding multiple tasks to the same label is easier
    } catch (error) {
      console.error("Fout bij toevoegen taak:", error);
    } finally {
      setIsAddingTask(false);
    }
  }, [newTaskInput, isAddingTask, activeCategory, user, newTaskProject]);

  const toggleTask = React.useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newStatus = !task.completed;
    const updatedTask: Task = { 
      ...task, 
      completed: newStatus,
      completedAt: newStatus ? new Date() : undefined
    };

    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: updatedTask })
      });
      
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));

      if (newStatus && notificationsEnabled) {
        sendNotification('Taak Voltooid!', `Top! Je hebt "${task.title}" afgerond.`);
      }
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  }, [tasks, notificationsEnabled, sendNotification]);

  const updateTask = React.useCallback(async (id: string, updates: Partial<Task>) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updatedTask = { ...task, ...updates };

    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: updatedTask })
      });
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  }, [tasks]);

  const deleteTask = React.useCallback(async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  }, []);

  const addSubtask = React.useCallback(async (parentId: string, title: string) => {
    const parent = tasks.find(t => t.id === parentId);
    if (!parent) return;

    const newSubtask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      priority: parent.priority,
      category: parent.category,
      createdAt: new Date(),
      parentId
    };

    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: newSubtask, email: user })
      });
      setTasks(prev => [newSubtask, ...prev]);
    } catch (err) {
      console.error("Failed to add subtask:", err);
    }
  }, [tasks, user]);

  const addProject = React.useCallback(async (name: string, color?: string) => {
    if (name.trim()) {
      const trimmedName = name.trim();
      const projectColor = color || '#C36322';
      if (projects.some(p => p.name === trimmedName)) return;

      try {
        await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: trimmedName, color: projectColor, email: user })
        });
        setProjects(prev => [...prev, { name: trimmedName, color: projectColor }]);
      } catch (err) {
        console.error("Failed to add project:", err);
      }
    }
  }, [projects, user]);

  const updateProject = React.useCallback(async (oldName: string, newName: string, color?: string) => {
    const trimmedNewName = newName.trim();
    if (!trimmedNewName) return;
    
    const projectColor = color || projects.find(p => p.name === oldName)?.color || '#C36322';

    try {
      await fetch(`/api/projects/${encodeURIComponent(oldName)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedNewName, color: projectColor, email: user })
      });

      setProjects(prev => {
        return prev.map(p => p.name === oldName ? { name: trimmedNewName, color: projectColor } : p);
      });

      setTasks(prev => prev.map(t => t.category === oldName ? { ...t, category: trimmedNewName } : t));
      
      setActiveCategory(prev => prev === oldName ? trimmedNewName : prev);
    } catch (err) {
      console.error("Failed to update project:", err);
    }
  }, [projects, user]);

  const removeProject = React.useCallback(async (name: string) => {
    try {
      await fetch(`/api/projects/${encodeURIComponent(name)}?email=${user}`, {
        method: 'DELETE'
      });
      setProjects(prev => prev.filter(p => p.name !== name));
      setTasks(prev => prev.map(t => t.category === name ? { ...t, category: 'Persoonlijk' } : t));
      setActiveCategory(prev => prev === name ? 'today' : prev);
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('nifty_right_panel', String(isRightPanelOpen));
  }, [isRightPanelOpen]);

  useEffect(() => {
    localStorage.setItem('nifty_sidebar_collapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Sync notifications state initially
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

  // Reminder Checker Effect
  useEffect(() => {
    const checkReminders = () => {
      const now = Date.now();
      
      setTasks(currentTasks => {
        // Optimization: check if any tasks even need checking
        const hasDueReminders = currentTasks.some(task => 
          task.reminderDate && 
          !task.reminderSent && 
          !task.completed && 
          new Date(task.reminderDate).getTime() <= now
        );

        if (!hasDueReminders) return currentTasks;

        return currentTasks.map(task => {
          if (
            task.reminderDate && 
            !task.reminderSent && 
            !task.completed &&
            new Date(task.reminderDate).getTime() <= now
          ) {
            if (notificationsEnabled) {
              sendNotification('Herinnering!', `Tijd voor: ${task.title}`);
            }
            return { ...task, reminderSent: true };
          }
          return task;
        });
      });
    };

    const intervalId = setInterval(checkReminders, 60000); // Check every minute instead of 30s to save battery
    return () => clearInterval(intervalId);
  }, [notificationsEnabled, sendNotification]);

  // Automatic Cleanup Effect (30 days)
  useEffect(() => {
    if (tasks.length === 0) return;

    const cleanupOldCompletedTasks = async () => {
      const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
      const now = Date.now();
      
      const tasksToDelete = tasks.filter(task => 
        task.completed && 
        task.completedAt && 
        (now - new Date(task.completedAt).getTime()) > THIRTY_DAYS_MS
      );

      if (tasksToDelete.length === 0) return;

      console.log(`Cleaning up ${tasksToDelete.length} old completed tasks...`);

      // Delete from local state first
      const taskIdsToDelete = tasksToDelete.map(t => t.id);
      setTasks(prev => prev.filter(t => !taskIdsToDelete.includes(t.id)));

      // Delete from server
      for (const task of tasksToDelete) {
        try {
          await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' });
        } catch (err) {
          console.error(`Failed to cleanup task ${task.id}:`, err);
        }
      }
    };

    // Run cleanup once after tasks are loaded
    cleanupOldCompletedTasks();
  }, [tasks.length > 0]); // Run when tasks are loaded

  const logout = React.useCallback(() => {
    setUser(null);
  }, []);

  if (!user) {
    return <AuthScreen onLogin={(email) => setUser(email)} />;
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 overflow-hidden font-sans">
      <Sidebar 
        userName={user}
        onLogout={logout}
        activeCategory={activeCategory} 
        setActiveCategory={(cat) => {
          setActiveCategory(cat);
          const specialViews = ['all', 'today', 'important', 'completed', 'planned'];
          setNewTaskProject(specialViews.includes(cat) ? 'Algemeen' : cat);
          setSelectedDate(null);
        }} 
        categories={categories} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        addProject={addProject}
        updateProject={updateProject}
        removeProject={removeProject}
        projects={sortedProjects}
        currentTheme={currentTheme}
        setTheme={setCurrentTheme}
        notificationsEnabled={notificationsEnabled}
        requestNotificationPermission={requestNotificationPermission}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] relative h-screen lg:h-auto overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-10 border-b border-slate-100 bg-white/50 backdrop-blur-md sticky top-0 z-10 gap-2 shrink-0">
          <div className="flex items-center gap-2 lg:gap-4 flex-1 max-w-xl">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden h-9 w-9 text-slate-500"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="relative w-full max-w-[200px] lg:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Zoeken..." 
                className="pl-10 h-9 bg-slate-100 border-none focus-visible:ring-2 focus-visible:ring-[#fdf2e9] text-sm placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger 
                className={cn(
                  "rounded-xl transition-all h-9 px-3 flex items-center gap-1.5 lg:gap-2 text-sm font-medium outline-none select-none focus-visible:ring-2 focus-visible:ring-primary/20 border border-transparent",
                  priorityFilter !== 'all' ? "text-primary bg-secondary hover:bg-secondary/80" : "text-slate-500 hover:text-slate-900 border-slate-200"
                )}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden lg:inline">{priorityFilter === 'all' ? 'Filter' : `Filter: ${priorityFilter}`}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 overflow-hidden">
                <DropdownMenuItem 
                  onClick={() => setPriorityFilter('all')} 
                  className={cn("cursor-pointer", priorityFilter === 'all' && "bg-slate-100 font-bold")}
                >
                  Alle prioriteiten
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setPriorityFilter('high')} 
                  className={cn("cursor-pointer text-red-600", priorityFilter === 'high' && "bg-red-50 font-bold")}
                >
                  Alleen Hoog
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setPriorityFilter('medium')} 
                  className={cn("cursor-pointer text-amber-600", priorityFilter === 'medium' && "bg-amber-50 font-bold")}
                >
                  Alleen Medium
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setPriorityFilter('low')} 
                  className={cn("cursor-pointer text-[#C36322]", priorityFilter === 'low' && "bg-[#fdf2e9] font-bold")}
                >
                  Alleen Laag
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setIsMobileAddOpen(!isMobileAddOpen);
                } else {
                  addTask();
                }
              }}
              className="bg-[#C36322] hover:bg-[#A5521C] text-white font-bold h-9 px-3 lg:px-4 rounded-xl shadow-md shadow-[#fae6d6] text-[10px] lg:text-xs uppercase tracking-wider"
            >
              <Plus className={cn("w-4 h-4 lg:hidden transition-transform", isMobileAddOpen && "rotate-45")} />
              <span className="hidden lg:inline">+ Nieuwe Taak</span>
              <span className="lg:hidden ml-1">{isMobileAddOpen ? 'Sluit' : 'Taak'}</span>
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden lg:flex rounded-xl transition-all h-9 text-slate-500 hover:text-slate-900"
              onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
            >
              {isRightPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide lg:scrollbar-default">
          <div className="max-w-4xl mx-auto w-full px-4 lg:px-10 py-4 lg:py-12 min-h-full flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeCategory + priorityFilter}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex-1 flex flex-col"
              >
                <div className="mb-8 lg:mb-12 flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3">
                  <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 capitalize">
                    {selectedDate ? (
                      <span className="flex items-center gap-3">
                        {selectedDate.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' })}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedDate(null)}
                          className="h-7 px-2 text-[10px] font-bold text-slate-400 hover:text-primary uppercase tracking-wider bg-slate-100/50"
                        >
                          Reset filter
                        </Button>
                      </span>
                    ) : (
                      activeCategory === 'all' ? 'Alle Taken' : 
                      activeCategory === 'today' ? 'Vandaag' : 
                      activeCategory === 'planned' ? 'Gepland' : 
                      activeCategory === 'important' ? 'Belangrijk' : 
                      activeCategory === 'completed' ? 'Voltooid' : 
                      activeCategory
                    )}
                  </h2>
                  <span className="text-lg lg:text-xl font-medium text-slate-400 capitalize">
                    {new Date().toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </span>
                </div>

                {/* Focus Score (Mobile only) */}
                <FocusScore tasks={tasks} className="lg:hidden mb-6 shadow-sm" />

                {/* Quick Add */}
                <div className={cn(
                  "lg:block",
                  isMobileAddOpen ? "block" : "hidden"
                )}>
                  <form onSubmit={(e) => {
                    addTask(e);
                    if (window.innerWidth < 1024) setIsMobileAddOpen(false);
                  }} className="mb-10 group">
                    <div className="relative group/input">
                      <Input 
                        ref={inputRef}
                        placeholder="Wat wil je doen?" 
                        autoFocus={isMobileAddOpen}
                        className="pl-6 pr-44 h-14 bg-white shadow-sm border border-slate-200 focus-visible:border-primary focus-visible:ring-0 transition-all rounded-2xl text-base font-medium placeholder:text-slate-300"
                        value={newTaskInput}
                        onChange={(e) => setNewTaskInput(e.target.value)}
                        disabled={isAddingTask}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-9 px-2 text-[10px] font-bold text-slate-400 hover:text-primary uppercase tracking-wider bg-slate-100/50 rounded-xl inline-flex items-center border border-transparent transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
                            <Tag className="w-3 h-3 mr-1.5" />
                            <span className="max-w-[70px] truncate">
                              {newTaskProject}
                            </span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 overflow-hidden">
                            <DropdownMenuItem onClick={() => setNewTaskProject('Algemeen')}>
                              Algemeen
                            </DropdownMenuItem>
                            {sortedProjects.map(project => (
                              <DropdownMenuItem key={project.name} onClick={() => setNewTaskProject(project.name)} className="flex items-center gap-2">
                                <div 
                                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                                  style={{ backgroundColor: project.color }} 
                                />
                                {project.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>

                         <Button 
                           type="submit" 
                           size="sm" 
                           disabled={!newTaskInput.trim() || isAddingTask}
                           className={cn(
                             "rounded-xl px-4 h-9 font-bold text-xs uppercase tracking-wider transition-all",
                             newTaskInput ? "bg-primary text-white opacity-100" : "bg-slate-100 text-slate-400 opacity-50"
                           )}
                         >
                            {isAddingTask ? (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Bezig...
                              </div>
                            ) : "Plan"}
                         </Button>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="space-y-10 flex-1 flex flex-col">
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-5 px-1 shrink-0">Taken</h3>
                    <div className="relative flex-1 flex flex-col">
                      <AnimatePresence mode="popLayout" initial={false}>
                        {filteredTasks.length > 0 ? (
                          <div className="space-y-3">
                            {filteredTasks.map((task) => (
                              <TaskItem 
                                key={task.id} 
                                task={task} 
                                onToggle={toggleTask} 
                                onUpdate={updateTask}
                                onDelete={deleteTask}
                                onAddSubtask={addSubtask}
                                onClick={() => setSelectedTask(task)}
                                projects={sortedProjects}
                              />
                            ))}
                          </div>
                        ) : (
                          <motion.div 
                            key="empty-state"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1 flex flex-col items-center justify-center py-6 lg:py-12 text-center w-full"
                          >
                            <div className="w-20 h-20 bg-white border border-slate-100 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                              <Search className="w-8 h-8 text-slate-200" />
                            </div>
                            <h3 className="font-bold text-xl text-slate-900">Helemaal bij!</h3>
                            <p className="text-slate-400 mt-2 text-sm max-w-[240px]">
                              Geen taken gevonden in deze categorie.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {isRightPanelOpen && (
        <div className="hidden lg:block border-l border-slate-100 shrink-0">
          <RightPanel 
            tasks={tasks} 
            selectedDate={selectedDate} 
            onDateSelect={setSelectedDate} 
          />
        </div>
      )}
      {/* Details Modal */}
      {selectedTask && (
        <TaskDetailModal
          isOpen={!!selectedTask}
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={updateTask}
          onDelete={deleteTask}
          projects={sortedProjects}
          addProject={addProject}
        />
      )}
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

import React from 'react';
import { 
  Inbox, 
  Calendar, 
  CheckCircle2, 
  Star, 
  Hash, 
  X,
  Settings,
  Plus,
  ListTodo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { SettingsDialog } from './SettingsDialog';

interface SidebarProps {
  userName: string;
  onLogout: () => void;
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  categories: { id: string; name: string; icon: React.ReactNode; count: number }[];
  isOpen: boolean;
  onClose: () => void;
  addProject: (name: string) => void;
  updateProject: (oldName: string, newName: string) => void;
  removeProject: (name: string) => void;
  projects: string[];
  currentTheme: string;
  setTheme: (theme: string) => void;
  notificationsEnabled: boolean;
  requestNotificationPermission: () => void;
}

const mainNav = [
  { id: 'all', name: 'Alle Taken', icon: <Inbox className="w-4 h-4 text-slate-400" /> },
  { id: 'today', name: 'Vandaag', icon: <Calendar className="w-4 h-4 text-orange-500" /> },
  { id: 'planned', name: 'Gepland', icon: <Calendar className="w-4 h-4 text-blue-500" /> },
  { id: 'important', name: 'Belangrijk', icon: <Star className="w-4 h-4 text-purple-500" /> },
  { id: 'completed', name: 'Voltooid', icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
];

export const Sidebar = React.memo(({ 
  userName,
  onLogout,
  activeCategory, 
  setActiveCategory, 
  categories, 
  isOpen, 
  onClose, 
  addProject,
  updateProject,
  removeProject,
  projects,
  currentTheme,
  setTheme,
  notificationsEnabled,
  requestNotificationPermission
}: SidebarProps) => {
  const handleCategorySelect = React.useCallback((id: string) => {
    setActiveCategory(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  }, [setActiveCategory, onClose]);

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div className={cn(
        "w-[85vw] max-w-[280px] lg:w-64 border-r border-white/5 bg-[hsl(30,10%,12%)] h-[100dvh] flex flex-col shadow-xl fixed lg:static z-50 top-0 left-0 transition-transform duration-300 transform",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-4 lg:p-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm rotate-[5deg]">
              <ListTodo className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              NiftyTasks
            </h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-4 min-h-0">
          <nav className="space-y-1">
            {mainNav.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 px-3 h-10 text-sm font-medium transition-all duration-200",
                  activeCategory === item.id 
                    ? "bg-primary text-white hover:bg-primary-dark hover:text-white shadow-lg shadow-primary/20" 
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                )}
                onClick={() => handleCategorySelect(item.id)}
              >
                <span className={cn(activeCategory === item.id && "brightness-200")}>{item.icon}</span>
                {item.name}
              </Button>
            ))}
          </nav>

          <div className="mt-8 mb-4 px-3 flex items-center justify-between">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 border-b border-white/10 pb-2 flex-1">
              Projecten
            </h2>
            <SettingsDialog 
              addProject={addProject} 
              updateProject={updateProject}
              removeProject={removeProject}
              projects={projects}
              currentTheme={currentTheme}
              setTheme={setTheme}
              notificationsEnabled={notificationsEnabled}
              requestNotificationPermission={requestNotificationPermission}
              onLogout={onLogout}
              trigger={
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              }
            />
          </div>

          <div className="space-y-1 mb-6">
            {categories.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 px-3 h-10 text-sm font-medium transition-all",
                  activeCategory === item.id 
                    ? "bg-primary text-white hover:bg-primary-dark" 
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                )}
                onClick={() => handleCategorySelect(item.id)}
              >
                <Hash className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                <span className="flex-1 text-left truncate">{item.name}</span>
                {item.count > 0 && (
                  <span className={cn(
                    "ml-auto text-xs font-semibold",
                    activeCategory === item.id ? "text-white/80" : "text-slate-400"
                  )}>
                    {item.count}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-auto p-3 lg:p-4 mx-4 mb-4 lg:mb-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm shrink-0 flex items-center justify-between group">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-0.5">Ingelogd als</div>
            <div className="text-sm font-bold text-slate-200 truncate leading-tight">{userName.split('@')[0]}</div>
          </div>
          <SettingsDialog 
            addProject={addProject} 
            updateProject={updateProject}
            removeProject={removeProject}
            projects={projects}
            currentTheme={currentTheme}
            setTheme={setTheme}
            notificationsEnabled={notificationsEnabled}
            requestNotificationPermission={requestNotificationPermission}
            onLogout={onLogout}
            trigger={
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white transition-all">
                <Settings className="w-4 h-4" />
              </Button>
            }
          />
        </div>
      </div>
    </>
  );
});

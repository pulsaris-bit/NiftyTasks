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
  ListTodo,
  PanelRightClose,
  PanelRightOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Task, Project } from '../types';
import { SettingsDialog } from './SettingsDialog';

interface SidebarProps {
  userName: string;
  onLogout: () => void;
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  categories: { id: string; name: string; icon: React.ReactNode; count: number; color?: string }[];
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  addProject: (name: string, color?: string) => void;
  updateProject: (oldName: string, newName: string, color?: string) => void;
  removeProject: (name: string) => void;
  projects: Project[];
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
  isCollapsed,
  setIsCollapsed,
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

  // Only collapse if we are not in mobile drawer mode (isOpen is mobile drawer state)
  const effectiveCollapsed = isCollapsed && !isOpen;

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
        "bg-[hsl(30,10%,12%)] h-[100dvh] flex flex-col shadow-xl fixed lg:static z-50 top-0 left-0 transition-all duration-300 transform",
        isOpen ? "translate-x-0 w-[85vw] max-w-[280px]" : "-translate-x-full lg:translate-x-0",
        !isOpen && (effectiveCollapsed ? "lg:w-[72px]" : "lg:w-64")
      )}>
        <div className={cn(
          "p-4 lg:p-6 flex items-center shrink-0",
          effectiveCollapsed ? "lg:flex-col lg:gap-4 lg:p-4" : "justify-between"
        )}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm rotate-[5deg] shrink-0">
              <ListTodo className="w-4 h-4" />
            </div>
            {!effectiveCollapsed && (
              <h1 className="text-xl font-bold tracking-tight text-white truncate">
                NiftyTasks
              </h1>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-slate-400 hover:text-white"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden lg:flex text-slate-500 hover:text-white h-8 w-8"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <PanelRightOpen className="w-4 h-4" /> : <PanelRightClose className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 px-3 lg:px-4 min-h-0">
          <nav className="space-y-1">
            {mainNav.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-10 text-sm font-medium transition-all duration-200 overflow-hidden",
                  activeCategory === item.id 
                    ? "bg-primary text-white hover:bg-primary-dark hover:text-white shadow-lg shadow-primary/20" 
                    : "text-slate-300 hover:bg-white/10 hover:text-white",
                  effectiveCollapsed ? "px-0 justify-center h-11" : "px-3"
                )}
                onClick={() => handleCategorySelect(item.id)}
                title={effectiveCollapsed ? item.name : undefined}
              >
                <span className={cn(activeCategory === item.id && "brightness-200", "shrink-0")}>{item.icon}</span>
                {!effectiveCollapsed && <span className="truncate">{item.name}</span>}
              </Button>
            ))}
          </nav>

          <div className={cn(
            "mt-8 mb-4 px-3 flex items-center justify-between",
            effectiveCollapsed && "flex-col gap-2 mt-6 px-0"
          )}>
            {!effectiveCollapsed ? (
              <h2 className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 border-b border-white/10 pb-2 flex-1">
                Labels
              </h2>
            ) : (
              <div className="w-full h-px bg-white/10" />
            )}
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
                <Button variant="ghost" size="icon" className={cn("h-6 w-6 text-slate-500 hover:text-white transition-colors", effectiveCollapsed && "h-8 w-8")}>
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
                  "w-full justify-start gap-3 h-10 text-sm font-medium transition-all overflow-hidden",
                  activeCategory === item.id 
                    ? "bg-primary text-white hover:bg-primary-dark" 
                    : "text-slate-300 hover:bg-white/10 hover:text-white",
                  effectiveCollapsed ? "px-0 justify-center h-11" : "px-3"
                )}
                onClick={() => handleCategorySelect(item.id)}
                title={effectiveCollapsed ? item.name : undefined}
              >
                {item.color ? (
                  <div 
                    className="w-3 h-3 rounded-full shrink-0 shadow-sm" 
                    style={{ backgroundColor: item.color }} 
                  />
                ) : (
                  <Hash className="w-4 h-4 opacity-70 group-hover:opacity-100 shrink-0" />
                )}
                {!effectiveCollapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{item.name}</span>
                    {item.count > 0 && (
                      <span className={cn(
                        "ml-auto text-xs font-semibold",
                        activeCategory === item.id ? "text-white/80" : "text-slate-400"
                      )}>
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </Button>
            ))}
          </div>
        </ScrollArea>

        <div className={cn(
          "mt-auto p-2 lg:p-3 mb-4 lg:mb-6 bg-white/5 border border-white/10 backdrop-blur-sm shrink-0 flex items-center group overflow-hidden transition-all duration-300",
          effectiveCollapsed ? "mx-2 rounded-xl flex-col p-2 gap-2" : "mx-4 rounded-2xl justify-between"
        )}>
          <div className={cn(
            "flex items-center gap-3 min-w-0",
            effectiveCollapsed && "justify-center"
          )}>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            {!effectiveCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-200 truncate leading-none">{userName.split('@')[0]}</div>
              </div>
            )}
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
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white transition-all shrink-0">
                <Settings className="w-4 h-4" />
              </Button>
            }
          />
        </div>
      </div>
    </>
  );
});

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Settings, Plus, FolderPlus, Palette, Bell, Info, ListTodo, Shield, X, Edit2, Trash2, CheckCircle2, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Project } from '../types';

interface SettingsDialogProps {
  projects: Project[];
  addProject: (name: string, color?: string) => void;
  updateProject: (oldName: string, newName: string, color?: string) => void;
  removeProject: (name: string) => void;
  currentTheme: string;
  setTheme: (theme: string) => void;
  notificationsEnabled: boolean;
  requestNotificationPermission: () => void;
  onLogout: () => void;
  trigger?: React.ReactNode;
}

const PRESET_COLORS = [
  '#C36322', // Orange
  '#2563eb', // Blue
  '#059669', // Emerald
  '#7c3aed', // Violet
  '#db2777', // Pink
  '#dc2626', // Red
  '#ca8a04', // Yellow
  '#0891b2', // Cyan
];

export function SettingsDialog({ 
  projects, 
  addProject, 
  updateProject, 
  removeProject, 
  currentTheme,
  setTheme,
  notificationsEnabled,
  requestNotificationPermission,
  onLogout,
  trigger 
}: SettingsDialogProps) {
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState(PRESET_COLORS[0]);
  const [activeTab, setActiveTab] = useState<'general' | 'projects' | 'notifications' | 'version'>('general');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editColor, setEditColor] = useState('');

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      addProject(newProjectName.trim(), newProjectColor);
      setNewProjectName('');
      setNewProjectColor(PRESET_COLORS[0]);
    }
  };

  const startEditing = (project: Project) => {
    setEditingProject(project);
    setEditValue(project.name);
    setEditColor(project.color);
  };

  const handleUpdate = () => {
    if (editingProject && editValue.trim()) {
      updateProject(editingProject.name, editValue.trim(), editColor);
    }
    setEditingProject(null);
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          trigger || (
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <Settings className="w-5 h-5" />
            </Button>
          )
        }
      />
      <DialogContent showCloseButton={false} className="w-[95vw] sm:w-[96vw] sm:max-w-[1000px] p-0 border-none bg-[hsl(30,10%,7%)] text-white overflow-hidden rounded-[24px] sm:rounded-3xl shadow-2xl ring-1 ring-white/10 max-h-[90vh] sm:max-h-[85vh]">
        <div className="flex flex-col sm:flex-row h-full sm:h-[700px] overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r border-white/5 bg-black/40 p-4 sm:p-8 flex flex-col shrink-0">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-2 mb-4 sm:mb-8 shrink-0">Instellingen</h2>
            <div className="flex flex-col gap-1 sm:gap-2 flex-1 items-stretch">
              <button 
                onClick={() => setActiveTab('general')}
                className={cn(
                  "w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all",
                  activeTab === 'general' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Palette className="w-3.5 h-3.5" />
                Algemeen
              </button>
              <button 
                onClick={() => setActiveTab('projects')}
                className={cn(
                  "w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all",
                  activeTab === 'projects' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <FolderPlus className="w-3.5 h-3.5" />
                Projecten
              </button>
              <button 
                onClick={() => setActiveTab('notifications')}
                className={cn(
                  "w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all",
                  activeTab === 'notifications' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Bell className="w-3.5 h-3.5" />
                Meldingen
              </button>
              <button 
                onClick={() => setActiveTab('version')}
                className={cn(
                  "w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all",
                  activeTab === 'version' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Info className="w-3.5 h-3.5" />
                Versie
              </button>

              <div className="hidden sm:block w-px sm:w-full h-px sm:h-px bg-white/5 my-2" />
              
              <button 
                onClick={onLogout}
                className="sm:mt-2 w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log uit
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 sm:p-10 flex flex-col min-w-0 overflow-y-auto">
            <DialogHeader className="mb-4 sm:mb-10 shrink-0">
              <DialogTitle className="text-lg sm:text-2xl font-bold tracking-tight text-white mb-1 sm:mb-2">
                {activeTab === 'general' ? 'Algemene Instellingen' : 
                 activeTab === 'projects' ? 'Project Management' :
                 activeTab === 'notifications' ? 'Meldingen & Desktop' :
                 'Informatie & Versie'}
              </DialogTitle>
              <p className="text-[10px] sm:text-xs text-slate-400">
                {activeTab === 'general' ? 'Pas de interface van NiftyTasks aan naar jouw wensen.' : 
                 activeTab === 'projects' ? 'Beheer je projecten en categorieën hier.' :
                 activeTab === 'notifications' ? 'Blijf op de hoogte van je taken met desktop meldingen.' :
                 'Details over de huidige versie van de applicatie.'}
              </p>
            </DialogHeader>


            <div className="flex-1 flex flex-col">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Themakleur</label>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setTheme('orange')}
                        className={cn(
                          "w-8 h-8 rounded-full bg-[#C36322] border-2 transition-all cursor-pointer",
                          currentTheme === 'orange' ? "border-white scale-110 shadow-lg shadow-orange-500/40" : "border-transparent opacity-60 hover:opacity-100"
                        )} 
                      />
                      <button 
                        onClick={() => setTheme('blue')}
                        className={cn(
                          "w-8 h-8 rounded-full bg-[#2563eb] border-2 transition-all cursor-pointer",
                          currentTheme === 'blue' ? "border-white scale-110 shadow-lg shadow-blue-500/40" : "border-transparent opacity-60 hover:opacity-100"
                        )}
                      />
                      <button 
                        onClick={() => setTheme('emerald')}
                        className={cn(
                          "w-8 h-8 rounded-full bg-[#059669] border-2 transition-all cursor-pointer",
                          currentTheme === 'emerald' ? "border-white scale-110 shadow-lg shadow-emerald-500/40" : "border-transparent opacity-60 hover:opacity-100"
                        )}
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Kies een kleur die bij je past. Het hele dashboard past zich direct aan naar de gekozen kleur.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="space-y-6 flex-1 flex flex-col min-h-0">
                  <div className="space-y-4 shrink-0">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Nieuw Project</label>
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Projectnaam..." 
                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-11 sm:h-10 rounded-xl focus-visible:ring-primary focus-visible:ring-offset-0"
                          value={newProjectName}
                          onChange={(e) => setNewProjectName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddProject()}
                        />
                        <Button 
                          onClick={handleAddProject}
                          disabled={!newProjectName.trim()}
                          className="bg-primary hover:bg-primary-dark text-white rounded-xl h-11 w-11 sm:h-10 sm:w-10 flex-shrink-0"
                        >
                          <Plus className="w-5 h-5" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 px-1">
                        {PRESET_COLORS.map(color => (
                          <button
                            key={color}
                            onClick={() => setNewProjectColor(color)}
                            className={cn(
                              "w-6 h-6 rounded-full border-2 transition-all",
                              newProjectColor === color ? "border-white scale-110 shadow-lg shadow-white/20" : "border-transparent opacity-50 hover:opacity-100"
                            )}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col min-h-0">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 block shrink-0">Bestaande Projecten</label>
                    <ScrollArea className="flex-1 pr-2">
                      <div className="space-y-2 pb-4">
                        {projects.map((project) => (
                          <div key={project.name} className="group/item flex flex-col gap-2 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                            {editingProject?.name === project.name ? (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <Input 
                                    autoFocus
                                    className="h-9 bg-black/20 border-white/10 text-sm rounded-lg px-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleUpdate();
                                      if (e.key === 'Escape') setEditingProject(null);
                                    }}
                                  />
                                  <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-500" onClick={handleUpdate}>
                                    <CheckCircle2 className="w-4 h-4" />
                                  </Button>
                                  <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400" onClick={() => setEditingProject(null)}>
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 px-1">
                                  {PRESET_COLORS.map(color => (
                                    <button
                                      key={color}
                                      onClick={() => setEditColor(color)}
                                      className={cn(
                                        "w-5 h-5 rounded-full border-2 transition-all",
                                        editColor === color ? "border-white scale-110 shadow-lg" : "border-transparent opacity-50 hover:opacity-100"
                                      )}
                                      style={{ backgroundColor: color }}
                                    />
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-3 h-3 rounded-full shrink-0" 
                                  style={{ backgroundColor: project.color }} 
                                />
                                <span className="flex-1 text-xs font-semibold truncate text-slate-200">{project.name}</span>
                                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover/item:opacity-100 transition-opacity flex-shrink-0">
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-7 w-7 text-slate-400 hover:text-white"
                                    onClick={() => startEditing(project)}
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-7 w-7 text-slate-400 hover:text-red-500"
                                    onClick={() => removeProject(project.name)}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 bg-white/5 rounded-2xl border border-white/5 gap-4">
                        <div className="space-y-1.5 flex-1 pr-0 sm:pr-4">
                          <h4 className="text-sm font-bold text-white leading-tight">Browser Meldingen</h4>
                          <p className="text-[10px] text-slate-400 leading-relaxed">Ontvang een notificatie wanneer een taak nadert of voltooid wordt.</p>
                        </div>
                        <div className={cn(
                          "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0",
                          notificationsEnabled ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                        )}>
                          {notificationsEnabled ? 'Ingeschakeld' : 'Uitgeschakeld'}
                        </div>
                      </div>

                    {!notificationsEnabled && (
                      <div className="space-y-4">
                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                          <p className="text-[10px] text-amber-500 leading-relaxed font-medium">
                            <span className="font-bold">Let op:</span> Browsers blokkeren vaak melding-aanvragen binnen een "venster in venster" (iframe). 
                            Klik rechtsboven op het <span className="underline">icoontje met het pijltje</span> om de app in een nieuw tabblad te openen en daar de meldingen te activeren.
                          </p>
                        </div>
                        <Button 
                          onClick={requestNotificationPermission}
                          className="w-full bg-primary hover:bg-primary-dark text-white font-bold rounded-xl h-12"
                        >
                          Activeer Meldingen
                        </Button>
                      </div>
                    )}

                    {notificationsEnabled && (
                      <div className="space-y-4">
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                          <p className="text-xs text-emerald-400 leading-relaxed italic text-center">
                            Je browser is nu gekoppeld aan NiftyTasks. Je ontvangt belangrijke updates direct op je desktop.
                          </p>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            if ('Notification' in window && Notification.permission === 'granted') {
                              new Notification('Test Melding', { body: 'Dit is een testbericht van NiftyTasks.', icon: '/favicon.ico' });
                            }
                          }}
                          className="w-full border-white/10 hover:bg-white/5 text-slate-300 rounded-xl"
                        >
                          Stuur Test Melding
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'version' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 p-8">
                  <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary rotate-[5deg] border border-primary/20 shadow-xl shadow-primary/5">
                    <ListTodo className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-white tracking-tight">NiftyTasks Desktop</h4>
                    <p className="text-sm font-medium text-slate-500 font-mono">Versie 0.9.5</p>
                  </div>
                  <div className="max-w-xs p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Status: Release Candidate
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      NiftyTasks is momenteel in actieve ontwikkeling. Bedankt voor het gebruiken van onze applicatie!
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto flex justify-end pt-3 border-t border-white/5 shrink-0">
              <DialogClose
                render={
                  <Button
                    variant="ghost"
                    className="text-slate-400 hover:text-white hover:bg-white/5 font-bold rounded-xl h-10 px-6"
                  >
                    Sluiten
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

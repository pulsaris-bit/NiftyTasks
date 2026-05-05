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
import { Settings, Plus, FolderPlus, Palette, Bell, Shield, X, Edit2, Trash2, CheckCircle2, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsDialogProps {
  projects: string[];
  addProject: (name: string) => void;
  updateProject: (oldName: string, newName: string) => void;
  removeProject: (name: string) => void;
  currentTheme: string;
  setTheme: (theme: string) => void;
  notificationsEnabled: boolean;
  requestNotificationPermission: () => void;
  onLogout: () => void;
  trigger?: React.ReactNode;
}

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
  const [activeTab, setActiveTab] = useState<'general' | 'projects' | 'notifications' | 'privacy'>('general');
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      addProject(newProjectName.trim());
      setNewProjectName('');
    }
  };

  const startEditing = (name: string) => {
    setEditingProject(name);
    setEditValue(name);
  };

  const handleUpdate = () => {
    if (editingProject && editValue.trim() && editValue !== editingProject) {
      updateProject(editingProject, editValue.trim());
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
      <DialogContent showCloseButton={false} className="w-[95vw] max-w-[500px] sm:w-full p-0 border-none bg-[#0f172a] text-white overflow-hidden rounded-[32px] sm:rounded-3xl shadow-2xl ring-1 ring-white/10 max-h-[90vh] sm:max-h-none">
        <div className="flex flex-col sm:flex-row h-full min-h-[500px] sm:h-[500px]">
          {/* Sidebar Tabs */}
          <div className="w-full sm:w-40 border-b sm:border-b-0 sm:border-r border-white/5 bg-black/20 p-3 sm:p-4 flex flex-col shrink-0">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-2 mb-3 sm:mb-4 shrink-0">Instellingen</h2>
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 no-scrollbar flex-1">
              <button 
                onClick={() => setActiveTab('general')}
                className={cn(
                  "flex-shrink-0 sm:w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                  activeTab === 'general' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Palette className="w-3.5 h-3.5" />
                Algemeen
              </button>
              <button 
                onClick={() => setActiveTab('projects')}
                className={cn(
                  "flex-shrink-0 sm:w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                  activeTab === 'projects' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <FolderPlus className="w-3.5 h-3.5" />
                Projecten
              </button>
              <button 
                onClick={() => setActiveTab('notifications')}
                className={cn(
                  "flex-shrink-0 sm:w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                  activeTab === 'notifications' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Bell className="w-3.5 h-3.5" />
                Meldingen
              </button>
              <button 
                onClick={() => setActiveTab('privacy')}
                className={cn(
                  "flex-shrink-0 sm:w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                  activeTab === 'privacy' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Shield className="w-3.5 h-3.5" />
                Privacy
              </button>

              <div className="sm:hidden w-px h-6 bg-white/5 mx-1 self-center" />
              
              <button 
                onClick={onLogout}
                className="sm:mt-4 flex-shrink-0 sm:w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all shrink-0 whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5" />
                {/* On mobile maybe hide text or just keep it */}
                Log uit
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-5 sm:p-8 flex flex-col min-w-0 overflow-y-auto">
            <DialogHeader className="mb-4 sm:mb-6 shrink-0">
              <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-white mb-1">
                {activeTab === 'general' ? 'Algemene Instellingen' : 
                 activeTab === 'projects' ? 'Project Management' :
                 activeTab === 'notifications' ? 'Meldingen & Desktop' :
                 'Privacy & Veiligheid'}
              </DialogTitle>
              <p className="text-[10px] sm:text-xs text-slate-400">
                {activeTab === 'general' ? 'Pas de interface van NiftyTasks aan naar jouw wensen.' : 
                 activeTab === 'projects' ? 'Beheer je projecten en categorieën hier.' :
                 activeTab === 'notifications' ? 'Blijf op de hoogte van je taken met desktop meldingen.' :
                 'Beheer hoe we met je gegevens omgaan.'}
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
                  <div className="space-y-3 shrink-0">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Nieuw Project</label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Projectnaam..." 
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-10 rounded-xl focus-visible:ring-primary focus-visible:ring-offset-0"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddProject()}
                      />
                      <Button 
                        onClick={handleAddProject}
                        disabled={!newProjectName.trim()}
                        className="bg-primary hover:bg-primary-dark text-white rounded-xl h-10 w-10 flex-shrink-0"
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col min-h-0">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 block shrink-0">Bestaande Projecten</label>
                    <ScrollArea className="flex-1 pr-2">
                      <div className="space-y-2 pb-4">
                        {projects.map((project) => (
                          <div key={project} className="group/item flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                            {editingProject === project ? (
                              <div className="flex-1 flex items-center gap-2">
                                <Input 
                                  autoFocus
                                  className="h-8 bg-black/20 border-white/10 text-xs rounded-lg px-2 focus-visible:ring-primary focus-visible:ring-offset-0"
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
                              </div>
                            ) : (
                              <>
                                <span className="flex-1 text-xs font-medium truncate">{project}</span>
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
                                    onClick={() => removeProject(project)}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </>
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
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 gap-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">Browser Meldingen</h4>
                        <p className="text-[10px] text-slate-400">Ontvang een notificatie wanneer een taak nadert of voltooid wordt.</p>
                      </div>
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0",
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

              {activeTab === 'privacy' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 p-8">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-slate-600" />
                  </div>
                  <div className="space-y-2 max-w-[240px]">
                    <h4 className="text-sm font-bold text-white">Privacy bij NiftyTasks</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Al je taken, projecten en instellingen worden uitsluitend lokaal in je browser opgeslagen. We verzamelen geen persoonsgegevens.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto flex justify-end pt-4 border-t border-white/5 shrink-0">
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

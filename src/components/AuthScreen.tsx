import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Lock, Mail, ArrowRight, CheckCircle2, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AuthScreenProps {
  onLogin: (email: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) throw new Error('Inloggen mislukt');
      
      const userData = await response.json();
      setIsLoading(false);
      onLogin(userData.email);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      alert('Er is een fout opgetreden bij het inloggen.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 font-sans relative overflow-hidden text-slate-200">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[420px] w-full z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 mx-auto mb-4 rotate-[5deg]"
          >
            <ListTodo className="w-6 h-6" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Welkom bij NiftyTasks</h1>
          <p className="text-slate-400 text-sm mt-1">Organiseer je dag met stijl en eenvoud.</p>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-black/50 p-8 lg:p-10 border border-white/5 relative overflow-hidden">
          <div className="flex gap-1 p-1 bg-slate-800/50 rounded-2xl mb-8 border border-white/5">
            <button 
              onClick={() => setIsLogin(true)}
              className={cn(
                "flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300",
                isLogin ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
              )}
            >
              Inloggen
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={cn(
                "flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300",
                !isLogin ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
              )}
            >
              Registreren
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form 
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1 block">Volledige Naam</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="name"
                      type="text" 
                      placeholder="Thomas de Vries" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="pl-11 h-12 bg-slate-800/40 border-transparent focus:bg-slate-800 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-white placeholder:text-slate-600"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1 block">E-mailadres</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="naam@voorraad.nl" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-11 h-12 bg-slate-800/40 border-transparent focus:bg-slate-800 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-white placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label htmlFor="pass" className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Wachtwoord</label>
                  {isLogin && (
                    <button type="button" className="text-[11px] font-bold text-primary hover:underline">Vergeten?</button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="pass"
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-11 h-12 bg-slate-800/40 border-transparent focus:bg-slate-800 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-white placeholder:text-slate-600"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group transition-all"
              >
                {isLoading ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    {isLogin ? 'Inloggen' : 'Account aanmaken'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </motion.form>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {[
            { icon: <CheckCircle2 className="w-3 h-3" />, label: 'Privacy First' },
            { icon: <CheckCircle2 className="w-3 h-3" />, label: 'Lokale Opslag' },
            { icon: <CheckCircle2 className="w-3 h-3" />, label: 'Geen Tracker' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <span className="text-primary">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

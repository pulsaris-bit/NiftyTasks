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
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-5xl bg-slate-900/50 backdrop-blur-3xl rounded-[32px] sm:rounded-[40px] border border-white/5 shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[600px] z-10"
      >
        {/* Left Column: Brand Info */}
        <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-between bg-black/20 border-b md:border-b-0 md:border-r border-white/5 relative group">
          <div className="relative z-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white mb-8 shadow-xl shadow-primary/20 rotate-[5deg]"
            >
              <ListTodo className="w-8 h-8" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
                NiftyTasks
              </h1>
              <p className="text-slate-400 text-lg max-w-sm leading-relaxed">
                Organiseer je dag met stijl en eenvoud. De slimme manier om je doelen te bereiken.
              </p>
            </motion.div>
          </div>

          <div className="mt-12 md:mt-0 relative z-10">
            <div className="flex items-center gap-4 text-slate-500">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 14}`} 
                      alt="User avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium">Vertrouwd door hardwerkende professionals</span>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>

        {/* Right Column: Auth Forms */}
        <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isLogin ? 'Welkom terug' : 'Maak een account'}
              </h2>
              <p className="text-slate-400 text-sm">
                {isLogin ? 'Log in om verder te gaan naar je taken.' : 'Begin vandaag nog met slimmer organiseren.'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.form 
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {!isLogin && (
                  <div className="space-y-1.5 focus-within:text-primary transition-colors">
                    <label className="text-[10px] font-bold uppercase tracking-widest ml-1 opacity-70">
                      Volledige Naam
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input 
                        type="text" 
                        placeholder="Thomas de Vries" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="pl-11 h-12 bg-white/5 border-white/10 focus:bg-white/10 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-white placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5 focus-within:text-primary transition-colors">
                  <label className="text-[10px] font-bold uppercase tracking-widest ml-1 opacity-70">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input 
                      type="email" 
                      placeholder="naam@voorbeeld.nl" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-11 h-12 bg-white/5 border-white/10 focus:bg-white/10 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-white placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 focus-within:text-primary transition-colors">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                      Wachtwoord
                    </label>
                    {isLogin && (
                      <button type="button" className="text-[10px] font-bold text-primary hover:underline">Vergeten?</button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-11 h-12 bg-white/5 border-white/10 focus:bg-white/10 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all text-white placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group transition-all"
                >
                  {isLoading ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      {isLogin ? 'Log in' : 'Account aanmaken'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </motion.form>
            </AnimatePresence>

            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                }}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                {isLogin ? 'Nog geen account? ' : 'Al een account? '}
                <span className="text-primary font-bold">
                  {isLogin ? 'Meld je aan' : 'Log in'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

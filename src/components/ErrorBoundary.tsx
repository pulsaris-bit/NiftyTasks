import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    (this as any).state = {
      hasError: false
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if ((this as any).state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 text-center">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Oeps! Er ging iets mis.</h1>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed">
              Er is een onverwachte fout opgetreden. Mogelijk is de lokale data beschadigd.
              Probeer de pagina te herladen of de opslag te wissen.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Pagina Herladen
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }} 
                className="w-full text-[10px] uppercase font-bold tracking-widest text-slate-400 hover:text-red-500"
              >
                Wis alle lokale data
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

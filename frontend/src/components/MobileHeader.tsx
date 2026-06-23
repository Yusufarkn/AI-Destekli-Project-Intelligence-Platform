'use client';

import React from 'react';
import { Menu, X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const MobileHeader = ({ isOpen, setIsOpen }: MobileHeaderProps) => {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-[60] px-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <AlertTriangle className="text-primary-foreground w-5 h-5" />
        </div>
        <span className="font-black text-foreground tracking-tight">RISK AI</span>
      </div>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-secondary rounded-lg transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  );
};

export default MobileHeader;

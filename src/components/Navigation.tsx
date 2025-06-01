
import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  onBackToHome: () => void;
  currentSection: string;
}

const Navigation: React.FC<NavigationProps> = ({ onBackToHome, currentSection }) => {
  if (currentSection === 'welcome' || currentSection === 'options') {
    return null;
  }

  return (
    <div className="fixed top-6 left-6 z-50">
      <Button
        onClick={onBackToHome}
        variant="outline"
        size="sm"
        className="glass-card hover:bg-white/40 transition-all duration-300"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        <Home className="w-4 h-4 mr-2" />
        Home
      </Button>
    </div>
  );
};

export default Navigation;

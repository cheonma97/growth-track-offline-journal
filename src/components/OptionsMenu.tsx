
import React from 'react';
import { PenTool, BookOpen, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface OptionsMenuProps {
  onSelectOption: (option: string) => void;
  show: boolean;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({ onSelectOption, show }) => {
  const options = [
    {
      id: 'write',
      title: 'Write Today\'s Entry',
      description: 'Capture your thoughts and reflections',
      icon: PenTool,
      gradient: 'from-green-400 to-blue-500'
    },
    {
      id: 'past',
      title: 'View Past Entries',
      description: 'Review your journey and growth',
      icon: BookOpen,
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      id: 'websites',
      title: 'Check Our New Website',
      description: 'Explore new resources and tools',
      icon: Globe,
      gradient: 'from-orange-400 to-red-500'
    }
  ];

  if (!show) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {options.map((option, index) => {
          const IconComponent = option.icon;
          return (
            <Card
              key={option.id}
              className={`option-card glass-card cursor-pointer border-white/20 hover:border-white/40 animate-slide-up`}
              style={{ animationDelay: `${index * 200}ms` }}
              onClick={() => onSelectOption(option.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${option.gradient} flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {option.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default OptionsMenu;

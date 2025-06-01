
import React, { useState, useEffect } from 'react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    // Start welcome animation immediately
    setShowWelcome(true);
    
    // Show options after welcome animation completes
    const timer = setTimeout(() => {
      setShowOptions(true);
      setTimeout(onComplete, 800); // Small delay before allowing interactions
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-4xl mx-auto">
        {showWelcome && (
          <h1 
            className={`text-5xl md:text-7xl font-bold gradient-text mb-8 ${
              showWelcome ? 'typing-text' : 'opacity-0'
            }`}
          >
            Welcome To My Growth Tracker
          </h1>
        )}
        
        {showOptions && (
          <div className="space-y-6 animate-fade-in">
            <p className="text-xl text-muted-foreground mb-12">
              Choose your path to personal growth
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;

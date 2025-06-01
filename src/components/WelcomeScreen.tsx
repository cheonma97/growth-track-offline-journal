
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center max-w-6xl mx-auto w-full">
        {showWelcome && (
          <h1 
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold gradient-text mb-4 sm:mb-6 md:mb-8 leading-tight ${
              showWelcome ? 'typing-text' : 'opacity-0'
            }`}
          >
            Welcome To My Growth Tracker
          </h1>
        )}
        
        {showOptions && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 md:mb-12 px-2">
              Choose your path to personal growth
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;

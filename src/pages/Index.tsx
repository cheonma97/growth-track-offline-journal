
import React, { useState, useEffect } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import OptionsMenu from '@/components/OptionsMenu';
import Navigation from '@/components/Navigation';
import WriteEntry from '@/components/WriteEntry';
import PastEntries from '@/components/PastEntries';
import WebsiteList from '@/components/WebsiteList';

type Section = 'welcome' | 'options' | 'write' | 'past' | 'websites';

const Index = () => {
  const [currentSection, setCurrentSection] = useState<Section>('welcome');
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Skip welcome animation for users who prefer reduced motion
      setTimeout(() => setCurrentSection('options'), 100);
    }
  }, []);

  const handleWelcomeComplete = () => {
    setCurrentSection('options');
  };

  const handleOptionSelect = (option: string) => {
    setShowContent(false);
    setTimeout(() => {
      setEditingEntry(null);
      setCurrentSection(option as Section);
      setShowContent(true);
    }, 300);
  };

  const handleBackToHome = () => {
    setShowContent(false);
    setTimeout(() => {
      setCurrentSection('options');
      setEditingEntry(null);
      setShowContent(true);
    }, 300);
  };

  const handleEditEntry = (entry: any) => {
    setEditingEntry(entry);
    setShowContent(false);
    setTimeout(() => {
      setCurrentSection('write');
      setShowContent(true);
    }, 300);
  };

  const handleSaveComplete = () => {
    setShowContent(false);
    setTimeout(() => {
      setCurrentSection('past');
      setEditingEntry(null);
      setShowContent(true);
    }, 300);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation
        onBackToHome={handleBackToHome}
        currentSection={currentSection}
      />
      
      <div className={`transition-all duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        {currentSection === 'welcome' && (
          <WelcomeScreen onComplete={handleWelcomeComplete} />
        )}
        
        {currentSection === 'options' && (
          <OptionsMenu onSelectOption={handleOptionSelect} show={true} />
        )}
        
        {currentSection === 'write' && (
          <WriteEntry
            editEntry={editingEntry}
            onSave={handleSaveComplete}
          />
        )}
        
        {currentSection === 'past' && (
          <PastEntries onEditEntry={handleEditEntry} />
        )}
        
        {currentSection === 'websites' && (
          <WebsiteList />
        )}
      </div>
    </div>
  );
};

export default Index;

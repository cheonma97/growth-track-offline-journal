
import { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    // Redirect to the improved offline tracker
    window.location.href = '/improved-offline-tracker.html';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Growth Tracker</h1>
        <p className="text-xl">Redirecting to your growth tracker...</p>
      </div>
    </div>
  );
};

export default Index;

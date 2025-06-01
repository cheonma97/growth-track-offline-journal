
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Edit, Trash2, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { getAllEntries, deleteEntry } from '@/lib/storage';
import { toast } from 'sonner';

interface PastEntriesProps {
  onEditEntry: (entry: any) => void;
}

const PastEntries: React.FC<PastEntriesProps> = ({ onEditEntry }) => {
  const [entries, setEntries] = useState<any[]>([]);
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const allEntries = await getAllEntries();
      // Sort by date descending (newest first)
      const sortedEntries = allEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setEntries(sortedEntries);
    } catch (error) {
      toast.error('Failed to load entries');
      console.error('Load entries error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteEntry(entryId);
      setEntries(entries.filter(entry => entry.id !== entryId));
      setExpandedEntries(prev => {
        const newSet = new Set(prev);
        newSet.delete(entryId);
        return newSet;
      });
      toast.success('Entry deleted successfully');
    } catch (error) {
      toast.error('Failed to delete entry');
      console.error('Delete error:', error);
    }
  };

  const toggleExpanded = (entryId: string) => {
    setExpandedEntries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your entries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold gradient-text mb-2 flex items-center justify-center">
            <BookOpen className="w-8 h-8 mr-3" />
            Your Growth Journey
          </h1>
          <p className="text-muted-foreground">
            {entries.length > 0 ? `You have ${entries.length} entries in your journal` : 'Your journey begins here'}
          </p>
        </div>

        {entries.length === 0 ? (
          <Card className="glass-card border-white/20 animate-scale-in">
            <CardContent className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No entries yet</h3>
              <p className="text-muted-foreground mb-6">
                Let's write your first entry and start your growth journey!
              </p>
              <Button
                onClick={() => onEditEntry(null)}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
              >
                Write Your First Entry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {entries.map((entry, index) => {
              const isExpanded = expandedEntries.has(entry.id);
              return (
                <Card
                  key={entry.id}
                  className="glass-card border-white/20 animate-slide-up hover:border-white/40 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => toggleExpanded(entry.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-primary" />
                          {entry.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {formatDate(entry.date)}
                          </Badge>
                          {entry.updatedAt !== entry.createdAt && (
                            <Badge variant="secondary" className="text-xs">
                              Updated
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditEntry(entry);
                          }}
                          className="hover:bg-white/20"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEntry(entry.id);
                          }}
                          className="hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  {isExpanded && (
                    <CardContent className="pt-0 animate-fade-in">
                      <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                          {entry.body}
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PastEntries;

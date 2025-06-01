
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { saveEntry, getEntryByDate } from '@/lib/storage';

interface WriteEntryProps {
  editEntry?: any;
  onSave: () => void;
}

const WriteEntry: React.FC<WriteEntryProps> = ({ editEntry, onSave }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editEntry) {
      setDate(editEntry.date);
      setTitle(editEntry.title);
      setBody(editEntry.body);
    }
  }, [editEntry]);

  const handleSave = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    setIsLoading(true);
    
    try {
      const entry = {
        id: editEntry?.id || crypto.randomUUID(),
        date,
        title: title.trim(),
        body: body.trim(),
        createdAt: editEntry?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await saveEntry(entry);
      
      toast.success(editEntry ? 'Entry updated successfully!' : 'Entry saved successfully!');
      
      // Reset form if creating new entry
      if (!editEntry) {
        setTitle('');
        setBody('');
      }
      
      setTimeout(() => {
        onSave();
      }, 1000);
      
    } catch (error) {
      toast.error('Failed to save entry. Please try again.');
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="glass-card border-white/20 animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-2xl gradient-text">
              <Calendar className="w-6 h-6" />
              <span>{editEntry ? 'Edit Entry' : 'Write Today\'s Entry'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-white/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="What's on your mind today?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="body">Your thoughts</Label>
              <Textarea
                id="body"
                placeholder="Pour your heart out here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[300px] bg-white/50 resize-none"
              />
            </div>
            
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : editEntry ? 'Update Entry' : 'Save Entry'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WriteEntry;

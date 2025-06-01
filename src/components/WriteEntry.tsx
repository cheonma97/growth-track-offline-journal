
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, Calendar, BookOpen } from 'lucide-react';
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
  const [dailyGoals, setDailyGoals] = useState(['', '', '', '']);
  const [studyToday, setStudyToday] = useState(['', '', '', '']);
  const [mustDo, setMustDo] = useState(['', '', '', '']);
  const [dailyGoalsChecked, setDailyGoalsChecked] = useState([false, false, false, false]);
  const [studyTodayChecked, setStudyTodayChecked] = useState([false, false, false, false]);
  const [mustDoChecked, setMustDoChecked] = useState([false, false, false, false]);
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editEntry) {
      setDate(editEntry.date);
      setTitle(editEntry.title);
      setBody(editEntry.body);
      setDailyGoals(editEntry.dailyGoals || ['', '', '', '']);
      setStudyToday(editEntry.studyToday || ['', '', '', '']);
      setMustDo(editEntry.mustDo || ['', '', '', '']);
      setDailyGoalsChecked(editEntry.dailyGoalsChecked || [false, false, false, false]);
      setStudyTodayChecked(editEntry.studyTodayChecked || [false, false, false, false]);
      setMustDoChecked(editEntry.mustDoChecked || [false, false, false, false]);
      setMotivationalQuote(editEntry.motivationalQuote || '');
    }
  }, [editEntry]);

  const handleGoalChange = (index: number, value: string, type: 'daily' | 'study' | 'must') => {
    if (type === 'daily') {
      const newGoals = [...dailyGoals];
      newGoals[index] = value;
      setDailyGoals(newGoals);
    } else if (type === 'study') {
      const newGoals = [...studyToday];
      newGoals[index] = value;
      setStudyToday(newGoals);
    } else {
      const newGoals = [...mustDo];
      newGoals[index] = value;
      setMustDo(newGoals);
    }
  };

  const handleCheckboxChange = (index: number, checked: boolean, type: 'daily' | 'study' | 'must') => {
    if (type === 'daily') {
      const newChecked = [...dailyGoalsChecked];
      newChecked[index] = checked;
      setDailyGoalsChecked(newChecked);
    } else if (type === 'study') {
      const newChecked = [...studyTodayChecked];
      newChecked[index] = checked;
      setStudyTodayChecked(newChecked);
    } else {
      const newChecked = [...mustDoChecked];
      newChecked[index] = checked;
      setMustDoChecked(newChecked);
    }
  };

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
        dailyGoals,
        studyToday,
        mustDo,
        dailyGoalsChecked,
        studyTodayChecked,
        mustDoChecked,
        motivationalQuote: motivationalQuote.trim(),
        createdAt: editEntry?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await saveEntry(entry);
      
      toast.success(editEntry ? 'Entry updated successfully!' : 'Entry saved successfully!');
      
      // Reset form if creating new entry
      if (!editEntry) {
        setTitle('');
        setBody('');
        setDailyGoals(['', '', '', '']);
        setStudyToday(['', '', '', '']);
        setMustDo(['', '', '', '']);
        setDailyGoalsChecked([false, false, false, false]);
        setStudyTodayChecked([false, false, false, false]);
        setMustDoChecked([false, false, false, false]);
        setMotivationalQuote('');
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

  const renderGoalSection = (
    title: string, 
    goals: string[], 
    checked: boolean[], 
    type: 'daily' | 'study' | 'must'
  ) => (
    <div className="space-y-3">
      <h4 className="font-semibold text-sm text-foreground">{title}</h4>
      {goals.map((goal, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground w-4">{index + 1})</span>
          <Checkbox
            checked={checked[index]}
            onCheckedChange={(checkedState) => handleCheckboxChange(index, !!checkedState, type)}
          />
          <Input
            value={goal}
            onChange={(e) => handleGoalChange(index, e.target.value, type)}
            placeholder={`Goal ${index + 1}`}
            className="text-sm bg-white/50"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="glass-card border-white/20 animate-scale-in">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center space-x-2 text-2xl gradient-text">
                <Calendar className="w-6 h-6" />
                <span>My Growth Tracker</span>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/50 hover:bg-white/70"
                onClick={onSave}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Past entries
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date and Title Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            
            {/* Main Writing Area */}
            <div className="space-y-2">
              <Label htmlFor="body">Write here what happened today</Label>
              <Textarea
                id="body"
                placeholder="Pour your heart out here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[200px] bg-white/50 resize-none"
              />
            </div>
            
            {/* Three Goal Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/30 border-white/40">
                <CardContent className="p-4">
                  {renderGoalSection('Daily goals', dailyGoals, dailyGoalsChecked, 'daily')}
                </CardContent>
              </Card>
              
              <Card className="bg-white/30 border-white/40">
                <CardContent className="p-4">
                  {renderGoalSection('Study today', studyToday, studyTodayChecked, 'study')}
                </CardContent>
              </Card>
              
              <Card className="bg-white/30 border-white/40">
                <CardContent className="p-4">
                  {renderGoalSection('Must do today', mustDo, mustDoChecked, 'must')}
                </CardContent>
              </Card>
            </div>
            
            {/* Motivational Quote */}
            <div className="space-y-2">
              <Label htmlFor="quote">A motivational quote</Label>
              <Textarea
                id="quote"
                placeholder="Share an inspiring quote that motivated you today..."
                value={motivationalQuote}
                onChange={(e) => setMotivationalQuote(e.target.value)}
                className="min-h-[80px] bg-white/50 resize-none"
              />
            </div>
            
            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : editEntry ? 'Update Entry' : 'Save'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WriteEntry;

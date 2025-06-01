
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, Calendar, BookOpen, Plus, Trash2 } from 'lucide-react';
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
  const [dailyGoals, setDailyGoals] = useState([{ text: '', checked: false }]);
  const [studyToday, setStudyToday] = useState([{ text: '', checked: false }]);
  const [mustDo, setMustDo] = useState([{ text: '', checked: false }]);
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editEntry) {
      setDate(editEntry.date);
      setTitle(editEntry.title);
      setBody(editEntry.body);
      setDailyGoals(editEntry.dailyGoals || [{ text: '', checked: false }]);
      setStudyToday(editEntry.studyToday || [{ text: '', checked: false }]);
      setMustDo(editEntry.mustDo || [{ text: '', checked: false }]);
      setMotivationalQuote(editEntry.motivationalQuote || '');
    }
  }, [editEntry]);

  const addGoal = (type: 'daily' | 'study' | 'must') => {
    if (type === 'daily') {
      setDailyGoals([...dailyGoals, { text: '', checked: false }]);
    } else if (type === 'study') {
      setStudyToday([...studyToday, { text: '', checked: false }]);
    } else {
      setMustDo([...mustDo, { text: '', checked: false }]);
    }
  };

  const removeGoal = (index: number, type: 'daily' | 'study' | 'must') => {
    if (type === 'daily') {
      const newGoals = dailyGoals.filter((_, i) => i !== index);
      setDailyGoals(newGoals.length ? newGoals : [{ text: '', checked: false }]);
    } else if (type === 'study') {
      const newGoals = studyToday.filter((_, i) => i !== index);
      setStudyToday(newGoals.length ? newGoals : [{ text: '', checked: false }]);
    } else {
      const newGoals = mustDo.filter((_, i) => i !== index);
      setMustDo(newGoals.length ? newGoals : [{ text: '', checked: false }]);
    }
  };

  const handleGoalChange = (index: number, value: string, type: 'daily' | 'study' | 'must') => {
    if (type === 'daily') {
      const newGoals = [...dailyGoals];
      newGoals[index].text = value;
      setDailyGoals(newGoals);
    } else if (type === 'study') {
      const newGoals = [...studyToday];
      newGoals[index].text = value;
      setStudyToday(newGoals);
    } else {
      const newGoals = [...mustDo];
      newGoals[index].text = value;
      setMustDo(newGoals);
    }
  };

  const handleCheckboxChange = (index: number, checked: boolean, type: 'daily' | 'study' | 'must') => {
    if (type === 'daily') {
      const newGoals = [...dailyGoals];
      newGoals[index].checked = checked;
      setDailyGoals(newGoals);
    } else if (type === 'study') {
      const newGoals = [...studyToday];
      newGoals[index].checked = checked;
      setStudyToday(newGoals);
    } else {
      const newGoals = [...mustDo];
      newGoals[index].checked = checked;
      setMustDo(newGoals);
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
        setDailyGoals([{ text: '', checked: false }]);
        setStudyToday([{ text: '', checked: false }]);
        setMustDo([{ text: '', checked: false }]);
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
    goals: { text: string; checked: boolean }[], 
    type: 'daily' | 'study' | 'must'
  ) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm text-foreground">{title}</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addGoal(type)}
          className="h-6 w-6 p-0 bg-white/50 hover:bg-white/70"
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
      {goals.map((goal, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground w-4">{index + 1})</span>
          <Checkbox
            checked={goal.checked}
            onCheckedChange={(checkedState) => handleCheckboxChange(index, !!checkedState, type)}
          />
          <Input
            value={goal.text}
            onChange={(e) => handleGoalChange(index, e.target.value, type)}
            placeholder={`Goal ${index + 1}`}
            className="text-sm bg-white/50 flex-1"
          />
          {goals.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeGoal(index, type)}
              className="h-6 w-6 p-0 bg-white/50 hover:bg-red-100 border-red-200"
            >
              <Trash2 className="w-3 h-3 text-red-500" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="glass-card border-white/20 animate-scale-in">
          <CardHeader className="pb-4 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
              <CardTitle className="flex items-center space-x-2 text-xl sm:text-2xl gradient-text">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>My Growth Tracker</span>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/50 hover:bg-white/70 self-start sm:self-auto"
                onClick={onSave}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Past entries
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
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
                className="min-h-[150px] sm:min-h-[200px] bg-white/50 resize-none"
              />
            </div>
            
            {/* Three Goal Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="bg-white/30 border-white/40">
                <CardContent className="p-3 sm:p-4">
                  {renderGoalSection('Daily goals', dailyGoals, 'daily')}
                </CardContent>
              </Card>
              
              <Card className="bg-white/30 border-white/40">
                <CardContent className="p-3 sm:p-4">
                  {renderGoalSection('Study today', studyToday, 'study')}
                </CardContent>
              </Card>
              
              <Card className="bg-white/30 border-white/40">
                <CardContent className="p-3 sm:p-4">
                  {renderGoalSection('Must do today', mustDo, 'must')}
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
                className="min-h-[60px] sm:min-h-[80px] bg-white/50 resize-none"
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

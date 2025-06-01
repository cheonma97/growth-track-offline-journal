
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, ExternalLink, Clock } from 'lucide-react';

const WebsiteList: React.FC = () => {
  const websites = [
    {
      name: 'MindfulGrowth Hub',
      description: 'A comprehensive platform for mindfulness and personal development',
      status: 'Coming Soon',
      category: 'Wellness'
    },
    {
      name: 'Daily Reflection Space',
      description: 'Interactive tools for daily reflection and goal tracking',
      status: 'In Development',
      category: 'Productivity'
    },
    {
      name: 'Community Growth Network',
      description: 'Connect with like-minded individuals on their growth journey',
      status: 'Planning',
      category: 'Community'
    },
    {
      name: 'Wisdom Library',
      description: 'Curated collection of books, articles, and resources',
      status: 'Coming Soon',
      category: 'Learning'
    },
    {
      name: 'Progress Analytics',
      description: 'Advanced analytics and insights for your personal growth',
      status: 'Beta Testing',
      category: 'Analytics'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Coming Soon':
        return 'bg-blue-100 text-blue-800';
      case 'In Development':
        return 'bg-yellow-100 text-yellow-800';
      case 'Planning':
        return 'bg-gray-100 text-gray-800';
      case 'Beta Testing':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Wellness':
        return 'bg-purple-100 text-purple-800';
      case 'Productivity':
        return 'bg-orange-100 text-orange-800';
      case 'Community':
        return 'bg-pink-100 text-pink-800';
      case 'Learning':
        return 'bg-indigo-100 text-indigo-800';
      case 'Analytics':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold gradient-text mb-2 flex items-center justify-center">
            <Globe className="w-8 h-8 mr-3" />
            Our New Websites
          </h1>
          <p className="text-muted-foreground">
            Exciting new platforms and tools coming your way
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {websites.map((website, index) => (
            <Card
              key={website.name}
              className="glass-card border-white/20 animate-slide-up hover:border-white/40 transition-all duration-300 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                      {website.name}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className={getCategoryColor(website.category)}>
                        {website.category}
                      </Badge>
                      <Badge className={getStatusColor(website.status)}>
                        <Clock className="w-3 h-3 mr-1" />
                        {website.status}
                      </Badge>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {website.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="glass-card border-white/20 mt-8 animate-scale-in">
          <CardContent className="text-center py-8">
            <Globe className="w-12 h-12 mx-auto text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Stay Tuned!</h3>
            <p className="text-muted-foreground">
              We're working hard to bring you these amazing new platforms. 
              Each one is designed to support different aspects of your personal growth journey.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebsiteList;

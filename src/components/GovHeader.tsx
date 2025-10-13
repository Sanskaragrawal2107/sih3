import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const GovHeader: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="w-full">
      {/* Top Bar - Government Identity */}
      <div className="bg-gradient-to-r from-orange-600 via-white to-green-600 h-2"></div>
      
      {/* Main Header */}
      <div className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Government Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
                  alt="Government of India"
                  className="w-12 h-12"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-wide">
                  {t('appTitle')}
                </h1>
                <p className="text-sm text-blue-200 mt-1">
                  {t('appSubtitle')}
                </p>
              </div>
            </div>

            {/* Right: Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                >
                  <Languages className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'English' : 'অসমীয়া'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  <Globe className="w-4 h-4 mr-2" />
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('as')}>
                  <Globe className="w-4 h-4 mr-2" />
                  অসমীয়া (Assamese)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Subtitle Bar */}
      <div className="bg-blue-800 text-white py-2">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-medium">
            {t('tagline')}
          </p>
        </div>
      </div>
    </div>
  );
};

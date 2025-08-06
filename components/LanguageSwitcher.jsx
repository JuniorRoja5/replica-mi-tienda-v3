import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from './LanguageProvider';

export default function LanguageSwitcher({ isMobile = false }) {
  const { language, setLanguage, t } = useLanguage();

  const getLanguageCode = (lang) => {
    switch(lang) {
      case 'es': return 'ES';
      case 'en': return 'EN';
      case 'fr': return 'FR';
      default: return 'ES';
    }
  };

  const buttonClasses = isMobile
    ? "text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-gray-200 border rounded-full h-8 px-2.5"
    : "lg:text-gray-700 lg:hover:text-indigo-600 lg:hover:bg-indigo-50/50 text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-gray-200";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={buttonClasses}>
          <Globe className="w-3.5 h-3.5 mr-1" />
          <span className="text-xs">{getLanguageCode(language)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="lg:bg-white bg-white border-gray-200">
        <DropdownMenuItem 
          onClick={() => setLanguage('es')}
          className="lg:text-gray-800 lg:hover:bg-gray-100 text-gray-800 hover:bg-gray-100 cursor-pointer"
        >
          🇪🇸 {t('spanish')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage('en')}
          className="lg:text-gray-800 lg:hover:bg-gray-100 text-gray-800 hover:bg-gray-100 cursor-pointer"
        >
          🇺🇸 {t('english')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage('fr')}
          className="lg:text-gray-800 lg:hover:bg-gray-100 text-gray-800 hover:bg-gray-100 cursor-pointer"
        >
          🇫🇷 {t('french')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, ChevronLeft, ChevronRight, Type, Check, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { PREDEFINED_THEMES } from "./themes";

const ColorPicker = ({ color, onChange, label }) => {
  // Helper to check if a color string is a gradient
  const isGradient = (c) => typeof c === 'string' && c.includes('gradient');
  
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="flex items-center gap-3">
        <div 
          className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-gray-300 transition-colors"
          style={{ background: color }}
        />
        <div className="flex-1">
          {isGradient(color) ? (
            <input
              type="text"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm"
              placeholder="CSS Gradient"
            />
          ) : (
            <input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-10 border-none rounded-lg cursor-pointer bg-transparent p-0"
              style={{'--color': color}}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default function DesignCustomizer({ designSettings, onDesignChange }) {
  // The component is now "controlled". It derives its state from props.
  const effectiveSettings = designSettings || PREDEFINED_THEMES[0].colors;

  const currentTheme = PREDEFINED_THEMES.find(t => t.id === (effectiveSettings?.theme_id || 'dark')) || PREDEFINED_THEMES[0];
  const currentThemeIndex = PREDEFINED_THEMES.findIndex(t => t.id === currentTheme.id);

  const handleThemeSelect = (theme) => {
    const newDesign = {
      theme_id: theme.id,
      theme_name: theme.name,
      background: theme.colors.background,
      background_type: 'solid', // Default to solid when a new theme is selected
      text_color: theme.colors.text_color,
      text_secondary_color: theme.colors.text_secondary_color,
      font_family: theme.fonts[0],
      button_color: theme.colors.button_color,
      button_font_color: theme.colors.button_font_color,
      button_hover_color: theme.colors.button_hover_color,
    };
    onDesignChange(newDesign);
  };

  const handleColorChange = (colorType, color) => {
    onDesignChange({
      ...effectiveSettings,
      [colorType]: color,
      // If the background color is changed, set its type to 'solid'
      background_type: colorType === 'background' ? 'solid' : effectiveSettings.background_type,
    });
  };

  const handleFontChange = (font) => {
    onDesignChange({
      ...effectiveSettings,
      font_family: font,
    });
  };
  
  const handleBackgroundTypeChange = (type) => {
    const theme = PREDEFINED_THEMES.find(t => t.id === effectiveSettings.theme_id) || PREDEFINED_THEMES[0];
    const newBackground = type === 'gradient' ? theme.colors.gradient : theme.colors.background;
    
    onDesignChange({
        ...effectiveSettings,
        background_type: type,
        background: newBackground,
    });
  };

  const nextTheme = () => {
    const nextIndex = (currentThemeIndex + 1) % PREDEFINED_THEMES.length;
    handleThemeSelect(PREDEFINED_THEMES[nextIndex]);
  };

  const prevTheme = () => {
    const prevIndex = currentThemeIndex === 0 ? PREDEFINED_THEMES.length - 1 : currentThemeIndex - 1;
    handleThemeSelect(PREDEFINED_THEMES[prevIndex]);
  };

  return (
    <div className="space-y-8">
      {/* Selector de Temas - Carrusel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="w-5 h-5 text-blue-600" />
            Selecciona tu Tema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Carrusel de temas */}
            <div className="flex items-center justify-center mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevTheme}
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <motion.div
                key={currentTheme.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center space-y-4"
              >
                {/* Vista previa del tema */}
                <div className="relative">
                  <div 
                    className="w-32 h-48 rounded-2xl border-4 border-white shadow-2xl overflow-hidden"
                    style={{ 
                      background: currentTheme.preview,
                      borderColor: currentTheme.id === 'light' || currentTheme.id === 'sand' || currentTheme.id === 'rose' ? '#e5e7eb' : 'white'
                    }}
                  >
                    {/* Simulación de contenido */}
                    <div className="p-4 h-full flex flex-col">
                      <div className="w-8 h-8 rounded-full mx-auto mb-3" style={{ 
                        backgroundColor: currentTheme.colors.text_color, 
                        opacity: 0.2 
                      }} />
                      <div className="space-y-2 flex-1">
                        <div className="h-2 rounded" style={{ 
                          backgroundColor: currentTheme.colors.text_color, 
                          opacity: 0.6 
                        }} />
                        <div className="h-1 rounded w-3/4" style={{ 
                          backgroundColor: currentTheme.colors.text_color, 
                          opacity: 0.4 
                        }} />
                        <div className="mt-4 space-y-1">
                          <div className="h-6 rounded-lg" style={{ 
                            backgroundColor: currentTheme.colors.button_color || 'rgba(255, 255, 255, 0.1)',
                          }} />
                          <div className="h-6 rounded-lg" style={{ 
                            backgroundColor: currentTheme.colors.button_color || 'rgba(255, 255, 255, 0.1)',
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Información del tema */}
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 text-lg">{currentTheme.name}</h3>
                  <p className="text-sm text-gray-600">{currentTheme.description}</p>
                </div>
              </motion.div>

              <Button
                variant="ghost"
                size="sm"
                onClick={nextTheme}
                className="ml-4 text-gray-500 hover:text-gray-700"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Indicadores de posición */}
            <div className="flex justify-center space-x-2">
              {PREDEFINED_THEMES.map((theme, index) => (
                <button
                  key={index}
                  onClick={() => handleThemeSelect(theme)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentThemeIndex 
                      ? 'bg-blue-600 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalización de Fondo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            Personalizar Fondo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Opción Sólido */}
            <div
              onClick={() => handleBackgroundTypeChange('solid')}
              className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="relative">
                <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                  effectiveSettings.background_type === 'solid' || !effectiveSettings.background_type 
                    ? 'border-blue-600 bg-blue-600' 
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}>
                  {(effectiveSettings.background_type === 'solid' || !effectiveSettings.background_type) && (
                    <div className="absolute inset-1 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">Color sólido</h4>
                <p className="text-sm text-gray-600">Fondo uniforme con un solo color</p>
              </div>
              <div 
                className="w-12 h-8 rounded-md border border-gray-200 flex-shrink-0"
                style={{ background: currentTheme.colors.background }}
              />
            </div>

            {/* Opción Degradado */}
            <div
              onClick={() => handleBackgroundTypeChange('gradient')}
              className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="relative">
                <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                  effectiveSettings.background_type === 'gradient'
                    ? 'border-blue-600 bg-blue-600' 
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}>
                  {effectiveSettings.background_type === 'gradient' && (
                    <div className="absolute inset-1 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">Degradado</h4>
                <p className="text-sm text-gray-600">Transición suave entre colores</p>
              </div>
              <div 
                className="w-12 h-8 rounded-md border border-gray-200 flex-shrink-0"
                style={{ background: currentTheme.colors.gradient }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalización de Colores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personalizar Colores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ColorPicker
              color={effectiveSettings.background}
              onChange={(color) => handleColorChange('background', color)}
              label="Color de Fondo"
            />
            <ColorPicker
              color={effectiveSettings.text_color}
              onChange={(color) => handleColorChange('text_color', color)}
              label="Color del Texto"
            />
          </div>
        </CardContent>
      </Card>

      {/* Selector de Tipografía */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Type className="w-5 h-5 text-blue-600" />
            Tipografía
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={effectiveSettings.font_family} onValueChange={handleFontChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una fuente" />
            </SelectTrigger>
            <SelectContent>
              {currentTheme.fonts.map((font) => (
                <SelectItem key={font} value={font} className="font-medium">
                  <span style={{ fontFamily: font }}>{font}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
}

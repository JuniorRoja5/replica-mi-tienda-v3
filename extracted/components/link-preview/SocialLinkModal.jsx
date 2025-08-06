import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function SocialLinkModal({ link, platforms, onSave, onClose }) {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [username, setUsername] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (link) {
      const platform = platforms.find(p => 
        p.id === link.platform.toLowerCase() || 
        p.name.toLowerCase() === link.platform.toLowerCase()
      );
      setSelectedPlatform(platform || platforms.find(p => p.id === 'website'));
      
      // Extract username from URL if possible
      if (platform && platform.baseUrl && link.url.includes(platform.baseUrl)) {
        const extractedUsername = link.url.replace(platform.baseUrl, '');
        setUsername(extractedUsername);
      } else {
        setCustomUrl(link.url);
      }
    }
  }, [link, platforms]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlatform) return;

    setIsLoading(true);
    
    try {
      let finalUrl = "";
      
      if (selectedPlatform.id === 'website') {
        finalUrl = customUrl.startsWith('http') ? customUrl : `https://${customUrl}`;
      } else {
        finalUrl = selectedPlatform.baseUrl + username;
      }

      await onSave({
        platform: selectedPlatform.id,
        url: finalUrl
      });
    } catch (error) {
      console.error("Error saving link:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPreviewUrl = () => {
    if (!selectedPlatform) return "";
    
    if (selectedPlatform.id === 'website') {
      return customUrl.startsWith('http') ? customUrl : `https://${customUrl}`;
    } else {
      return selectedPlatform.baseUrl + username;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="bg-white shadow-2xl">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-900">
                {link ? 'Editar Red Social' : 'Agregar Red Social'}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Platform Selection */}
              <div className="space-y-3">
                <Label className="text-gray-900 font-medium">Selecciona la plataforma</Label>
                <div className="grid grid-cols-4 gap-3">
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    const isSelected = selectedPlatform?.id === platform.id;
                    
                    return (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => setSelectedPlatform(platform)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg ${platform.color} flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs font-medium text-gray-700 text-center">
                          {platform.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* URL Input */}
              {selectedPlatform && (
                <div className="space-y-3">
                  <Label className="text-gray-900 font-medium">
                    {selectedPlatform.id === 'website' ? 'URL del sitio web' : `Usuario de ${selectedPlatform.name}`}
                  </Label>
                  
                  {selectedPlatform.id === 'website' ? (
                    <Input
                      type="url"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://misitioweb.com"
                      className="w-full"
                      required
                    />
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="bg-gray-100 px-3 py-2 text-sm text-gray-600 border border-r-0 border-gray-300 rounded-l-lg">
                          {selectedPlatform.baseUrl}
                        </span>
                        <Input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="usuario"
                          className="rounded-l-none flex-1"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Preview */}
                  {(username || customUrl) && (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 text-sm">
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Vista previa:</span>
                        <span className="font-mono text-gray-900 truncate">{getPreviewUrl()}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={!selectedPlatform || (!username && !customUrl) || isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? 'Guardando...' : (link ? 'Actualizar' : 'Agregar')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
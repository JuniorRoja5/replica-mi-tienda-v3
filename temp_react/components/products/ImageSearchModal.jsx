import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Search, Loader2, Image } from 'lucide-react';
import { InvokeLLM } from "@/api/integrations";

export default function ImageSearchModal({ onClose, onSelectImage }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const searchImages = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      console.log('Buscando imágenes para:', searchTerm); // Debug log
      
      const prompt = `Find 12 high-quality, professional stock photos related to "${searchTerm}". 
      Return a JSON array with image URLs from free stock photo websites like Unsplash, Pexels, or Pixabay.
      Each image should be at least 800x600 pixels and suitable for commercial use.
      
      Return this exact JSON structure:
      {
        "images": [
          {
            "url": "direct_image_url_here",
            "title": "descriptive_title",
            "source": "website_name"
          }
        ]
      }
      
      Make sure all URLs are direct links to actual images (ending in .jpg, .png, etc.) and are publicly accessible.`;

      const response = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            images: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  url: { type: "string" },
                  title: { type: "string" },
                  source: { type: "string" }
                },
                required: ["url", "title"]
              }
            }
          },
          required: ["images"]
        }
      });

      console.log('Respuesta de la API:', response); // Debug log

      if (response && response.images && Array.isArray(response.images)) {
        // Filtrar imágenes con URLs válidas
        const validImages = response.images.filter(img => {
          return img.url && 
                 typeof img.url === 'string' && 
                 (img.url.startsWith('http://') || img.url.startsWith('https://'));
        });
        
        console.log('Imágenes válidas encontradas:', validImages.length); // Debug log
        setImages(validImages);
        
        if (validImages.length === 0) {
          setError('No se encontraron imágenes válidas para tu búsqueda.');
        }
      } else {
        console.error('Respuesta inválida:', response);
        setError('No se pudieron cargar las imágenes. Intenta con otros términos de búsqueda.');
      }
    } catch (error) {
      console.error('Error en búsqueda de imágenes:', error);
      setError('Ocurrió un error al buscar imágenes. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchImages();
    }
  };

  const handleImageSelect = (imageUrl) => {
    console.log('Imagen seleccionada:', imageUrl); // Debug log
    onSelectImage(imageUrl);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-white text-xl">Buscar Imágenes</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Barra de búsqueda */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Buscar imágenes (ej. 'coaching', 'negocios', 'trading')..."
                  className="bg-white/10 border-white/20 text-white placeholder-purple-300 pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-4 h-4" />
              </div>
              <Button
                onClick={searchImages}
                disabled={isLoading || !searchTerm.trim()}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </>
                )}
              </Button>
            </div>

            {/* Área de resultados */}
            <div className="max-h-96 overflow-y-auto">
              {!hasSearched && (
                <div className="text-center py-12">
                  <Image className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Encuentra la imagen perfecta</h3>
                  <p className="text-purple-200">Busca imágenes profesionales para tu producto</p>
                </div>
              )}

              {isLoading && (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 text-purple-300 mx-auto mb-4 animate-spin" />
                  <p className="text-white">Buscando imágenes...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-4 mb-4">
                    <p className="text-red-200">{error}</p>
                  </div>
                  <Button
                    onClick={searchImages}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Intentar de nuevo
                  </Button>
                </div>
              )}

              {!isLoading && !error && hasSearched && images.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-purple-200">No se encontraron imágenes para "{searchTerm}"</p>
                  <p className="text-sm text-purple-300 mt-2">Intenta con otros términos de búsqueda</p>
                </div>
              )}

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative group cursor-pointer"
                      onClick={() => handleImageSelect(image.url)}
                    >
                      <div className="aspect-square bg-white/10 rounded-lg overflow-hidden border border-white/20 hover:border-purple-300 transition-all duration-200">
                        <img
                          src={image.url}
                          alt={image.title || 'Imagen'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            console.log('Error cargando imagen:', image.url);
                            e.target.style.display = 'none';
                          }}
                          onLoad={() => {
                            console.log('Imagen cargada correctamente:', image.url);
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end">
                          <div className="p-3 w-full">
                            <p className="text-white text-sm font-medium truncate">
                              {image.title || 'Seleccionar imagen'}
                            </p>
                            {image.source && (
                              <p className="text-purple-200 text-xs">
                                {image.source}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
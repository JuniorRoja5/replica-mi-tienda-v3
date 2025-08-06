import React, { useState, useCallback, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { X, Upload, Library, Package, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadFile, InvokeLLM } from "@/api/integrations";
import ImageSearchModal from "./ImageSearchModal";

export default function LinkForm({ link, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    type: 'link',
    title: link?.title || "",
    external_url: link?.external_url || "",
    image_url: link?.image_url || "",
    is_active: link?.is_active ?? true,
    price: 0,
    show_price_on_button: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showImageSearch, setShowImageSearch] = useState(false);
  const [isExtractingImage, setIsExtractingImage] = useState(false);
  const [imageValidationFailed, setImageValidationFailed] = useState(false);

  // Ref para el timeout de la extracción de imagen
  const extractTimeoutRef = useRef(null);

  // Función para validar si una imagen existe y es accesible
  const validateImageURL = useCallback((imageUrl) => {
    return new Promise((resolve) => {
      if (!imageUrl) {
        resolve(false);
        return;
      }

      const img = new Image();
      const timeout = setTimeout(() => {
        resolve(false);
      }, 8000); // 8 segundos de timeout

      img.onload = () => {
        clearTimeout(timeout);
        resolve(true);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };

      // Configurar CORS para evitar problemas
      img.crossOrigin = "anonymous";
      img.src = imageUrl;
    });
  }, []);

  // Función avanzada para extraer metadatos como Beacons/Linktree
  const extractImageFromURL = useCallback(async (url) => {
    if (!url || !url.startsWith('http')) return;
    
    setIsExtractingImage(true);
    setImageValidationFailed(false);
    
    try {
      const prompt = `You are an advanced web scraper that extracts metadata from websites exactly like Beacons.ai and Linktree do. Your mission is to crawl the URL and extract the best possible image representation.

URL to analyze: ${url}

STEP-BY-STEP PROCESS:
1. Fetch the complete HTML content of the URL
2. Parse the HTML head section for meta tags
3. Extract images in this EXACT priority order:
   - og:image (Open Graph image)
   - twitter:image (Twitter card image)  
   - twitter:image:src
   - article:image
   - image (generic meta image)
   - apple-touch-icon-precomposed
   - apple-touch-icon
   - favicon with highest resolution

4. For each image found:
   - Convert relative URLs to absolute URLs
   - Ensure the URL starts with http:// or https://
   - Prefer images larger than 200x200 pixels
   - Avoid SVG icons unless no other option exists

5. Also extract:
   - Page title from <title> tag
   - Description from og:description or meta description
   - Site name from og:site_name

VALIDATION REQUIREMENTS:
- Image URLs must be complete and absolute
- No base64 encoded images
- No placeholder or generic icons unless it's the only option
- Prefer high-quality, representative images

Return this JSON structure:
{
  "image_url": "best image URL found (absolute URL)",
  "title": "clean page title",
  "description": "page description",
  "site_name": "site name if available",
  "fallback_images": ["array of alternative image URLs"],
  "favicon_url": "favicon URL as last resort"
}

If no suitable image is found, set image_url to null. Be thorough and precise like professional link preview services.`;

      const response = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            image_url: { type: ["string", "null"] },
            title: { type: "string" },
            description: { type: "string" },
            site_name: { type: "string" },
            fallback_images: { 
              type: "array", 
              items: { type: "string" }
            },
            favicon_url: { type: ["string", "null"] }
          },
          required: ["image_url", "title"]
        }
      });

      if (response) {
        let validImageUrl = null;
        let allImageOptions = [];
        
        // Crear lista de todas las opciones de imagen
        if (response.image_url) allImageOptions.push(response.image_url);
        if (response.fallback_images) allImageOptions.push(...response.fallback_images);
        if (response.favicon_url) allImageOptions.push(response.favicon_url);
        
        // Validar cada imagen hasta encontrar una que funcione
        for (const imageUrl of allImageOptions) {
          if (imageUrl && imageUrl.startsWith('http')) {
            const isValid = await validateImageURL(imageUrl);
            if (isValid) {
              validImageUrl = imageUrl;
              break;
            }
          }
        }

        // Actualizar el formulario con los datos extraídos
        setFormData(prev => ({
          ...prev,
          image_url: validImageUrl || "", // Si no hay imagen válida, dejar vacío
          title: prev.title || response.title || prev.title, // Solo actualizar si está vacío
        }));

        // Mostrar indicador si no se pudo cargar ninguna imagen
        if (!validImageUrl) {
          setImageValidationFailed(true);
        }
      }
    } catch (error) {
      console.error("Error extracting metadata from URL:", error);
      setImageValidationFailed(true);
    } finally {
      setIsExtractingImage(false);
    }
  }, [validateImageURL]);

  // Detectar cambios en el URL y extraer imagen automáticamente
  const handleURLChange = useCallback((e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, external_url: url }));
    
    // Limpiar el timeout anterior para evitar extracciones redundantes
    if (extractTimeoutRef.current) {
      clearTimeout(extractTimeoutRef.current);
    }

    // Extraer imagen automáticamente después de un breve delay
    if (url && url.startsWith('http')) {
      extractTimeoutRef.current = setTimeout(() => {
        extractImageFromURL(url);
      }, 1500); // Esperar 1.5 segundos para dar tiempo a escribir la URL completa
    }
  }, [extractImageFromURL]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, image_url: file_url }));
      setImageValidationFailed(false);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Asegurar que el tipo sea link
      const dataToSave = {
        ...formData,
        type: 'link'
      };
      
      await onSave(dataToSave);
    } catch (error) {
      console.error("Error saving link:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (extractTimeoutRef.current) {
        clearTimeout(extractTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white text-xl">
                {link ? 'Editar Link' : 'Crear Nuevo Link'}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onCancel} className="text-white">
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* URL - Movido al principio para extraer imagen primero */}
                <div className="space-y-2">
                  <Label htmlFor="external_url" className="text-white">URL del Link</Label>
                  <div className="relative">
                    <Input
                      id="external_url"
                      type="url"
                      value={formData.external_url}
                      onChange={handleURLChange}
                      className="bg-white/10 border-white/20 text-white placeholder-purple-300"
                      placeholder="https://ejemplo.com/..."
                      required
                    />
                    {isExtractingImage && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="w-4 h-4 text-purple-300 animate-spin" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-purple-200">
                    💡 La imagen y título se extraerán automáticamente del enlace
                  </p>
                </div>

                {/* Imagen del Link */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Imagen del Link</Label>
                    {formData.external_url && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => extractImageFromURL(formData.external_url)}
                        disabled={isExtractingImage}
                        className="text-purple-300 hover:text-white"
                      >
                        <RefreshCw className={`w-4 h-4 mr-1 ${isExtractingImage ? 'animate-spin' : ''}`} />
                        Recargar imagen
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Vista previa de la imagen con manejo de errores */}
                    {formData.image_url ? (
                      <div className="relative">
                        <img 
                          src={formData.image_url} 
                          alt="Link preview"
                          className="w-20 h-20 object-cover rounded-lg border border-white/20"
                          onError={() => {
                            setFormData(prev => ({ ...prev, image_url: "" }));
                            setImageValidationFailed(true);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-purple-300" />
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="link-image-upload"
                      />
                      <label htmlFor="link-image-upload">
                        <Button type="button" variant="outline" className="bg-white/10 border-white/20 text-white w-full" disabled={isUploading}>
                          <Upload className="w-4 h-4 mr-2" />
                          {isUploading ? 'Subiendo...' : 'Subir Imagen'}
                        </Button>
                      </label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="bg-white/10 border-white/20 text-white w-full" 
                        onClick={() => setShowImageSearch(true)}
                      >
                        <Library className="w-4 h-4 mr-2" />
                        Buscar en Biblioteca
                      </Button>
                    </div>
                  </div>
                  
                  {/* Mensaje de información cuando no se puede cargar imagen */}
                  {imageValidationFailed && (
                    <div className="bg-amber-500/20 border border-amber-500/40 rounded-lg p-3">
                      <p className="text-amber-200 text-sm">
                        ℹ️ No se pudo extraer una imagen automáticamente desde este enlace. Puedes subir una imagen manualmente o buscar en la biblioteca.
                      </p>
                    </div>
                  )}
                </div>

                {/* Título del Link */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Título del Link</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder-purple-300"
                    placeholder="Se extraerá automáticamente del enlace"
                    required
                  />
                </div>

                {/* Toggle Activo */}
                <div className="flex items-center space-x-2 pt-4 border-t border-white/10">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active" className="text-white">Link está activo</Label>
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={onCancel} className="bg-white/10 border-white/20 text-white">
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSaving}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    {isSaving ? 'Guardando...' : (link ? 'Actualizar Link' : 'Crear Link')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showImageSearch && (
          <ImageSearchModal
            onClose={() => setShowImageSearch(false)}
            onSelectImage={(url) => {
              setFormData(prev => ({ ...prev, image_url: url }));
              setShowImageSearch(false);
              setImageValidationFailed(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
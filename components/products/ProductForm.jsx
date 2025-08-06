
import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { X, Upload, Package, Library, Link, Phone, GraduationCap, Crown, Plus, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadFile, InvokeLLM } from "@/api/integrations";
import { useLanguage } from "../LanguageProvider";
import ImageSearchModal from "./ImageSearchModal";
import RichTextEditor from "./RichTextEditor";

export default function ProductForm({ product, onSave, onCancel, productType, isInline = false }) {
  const { t } = useLanguage();

  const getDefaultCategory = (type) => {
    switch (type) {
      case 'digital_product': return 'digital-product';
      case 'consultation': return 'consultation';
      case 'course': return 'course';
      case 'membership': return 'membership';
      default: return 'digital-product';
    }
  };

  const [formData, setFormData] = useState({
    title: product?.title || "",
    subtitle: product?.subtitle || "",
    description: product?.description || "",
    price: product?.price || 0,
    category: product?.category || getDefaultCategory(productType),
    image_url: product?.image_url || "",
    file_url: product?.file_url || "",
    is_active: product?.is_active ?? true,
    button_title: product?.button_title || "",
    show_price_on_button: product?.show_price_on_button ?? true,
    // Campos específicos por tipo de producto
    consultation_config: product?.consultation_config || {
      duration: 60,
      calendar_link: '',
      timezone: 'America/New_York'
    },
    course_config: product?.course_config || {
      chapters: [],
      total_duration: 0
    },
    membership_config: product?.membership_config || {
      billing_frequency: 'monthly',
      custom_date: null
    }
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showImageSearch, setShowImageSearch] = useState(false);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(
    product?.file_url ? decodeURIComponent(product.file_url.split('/').pop().split('?')[0]) : ''
  );

  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, image_url: file_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadedFileName(file.name);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, file_url }));
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateAIDescription = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGeneratingAI(true);
    try {
      const prompt = `Eres un experto en marketing digital. Crea una descripción atractiva y persuasiva para un producto digital basándote en estas ideas clave: "${aiPrompt}".

La descripción DEBE seguir esta estructura estrictamente:
1.  Un párrafo inicial con un resumen general del producto.
2.  Varias frases o subtítulos clave en **negrita** para resaltar los beneficios principales.
3.  Una lista con viñetas (bullet points) de al menos 3 puntos, detallando ventajas o aprendizajes clave. Usa un guion (-) para cada punto.
4.  Un cierre breve con una llamada a la acción (ejemplo: "Empiece hoy mismo.").

Usa un tono profesional pero cercano y escribe en español.
Solo devuelve el contenido de la descripción, sin explicaciones adicionales.`;

      const response = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false
      });

      setFormData(prev => ({ ...prev, description: response }));
      setShowAIPrompt(false);
      setAiPrompt("");
    } catch (error) {
      console.error("Error generating AI description:", error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const dataToSave = {
        ...formData,
        type: 'product',
        product_type: productType
      };
      
      await onSave(dataToSave);
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderConsultationFields = () => (
    <div className="space-y-4 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
        <Phone className="w-5 h-5 text-gray-700" />
        Configuración de Consultoría
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-700">Duración (minutos)</Label>
          <Input
            type="number"
            value={formData.consultation_config.duration}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              consultation_config: {
                ...prev.consultation_config,
                duration: parseInt(e.target.value) || 60
              }
            }))}
            className="border-gray-300"
            min="15"
            max="240"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-700">Zona Horaria</Label>
          <select
            value={formData.consultation_config.timezone}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              consultation_config: {
                ...prev.consultation_config,
                timezone: e.target.value
              }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700"
          >
            <option value="America/New_York">Este (Nueva York)</option>
            <option value="America/Chicago">Central (Chicago)</option>
            <option value="America/Denver">Montaña (Denver)</option>
            <option value="America/Los_Angeles">Pacífico (Los Ángeles)</option>
            <option value="Europe/Madrid">Madrid</option>
            <option value="Europe/London">Londres</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="text-gray-700">Enlace de Google Calendar</Label>
        <Input
          value={formData.consultation_config.calendar_link}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            consultation_config: {
              ...prev.consultation_config,
              calendar_link: e.target.value
            }
          }))}
          className="border-gray-300 placeholder-gray-400"
          placeholder="https://calendar.google.com/calendar/appointments/..."
        />
        <p className="text-xs text-gray-500">
          Conecta tu Google Calendar para permitir reservas automáticas
        </p>
      </div>
    </div>
  );

  const renderCourseFields = () => (
    <div className="space-y-4 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-gray-700" />
        Estructura del Curso
      </h3>
      
      <div className="space-y-3">
        {formData.course_config.chapters.map((chapter, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-gray-700 font-medium">{index + 1}.</span>
            <Input
              value={chapter.title}
              onChange={(e) => {
                const newChapters = [...formData.course_config.chapters];
                newChapters[index] = { ...chapter, title: e.target.value };
                setFormData(prev => ({
                  ...prev,
                  course_config: { ...prev.course_config, chapters: newChapters }
                }));
              }}
              className="flex-1 border-gray-300 placeholder-gray-400"
              placeholder="Título del capítulo"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const newChapters = formData.course_config.chapters.filter((_, i) => i !== index);
                setFormData(prev => ({
                  ...prev,
                  course_config: { ...prev.course_config, chapters: newChapters }
                }));
              }}
              className="text-red-500 hover:text-red-400"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const newChapter = { title: '', duration: 0, file_url: '' };
            setFormData(prev => ({
              ...prev,
              course_config: {
                ...prev.course_config,
                chapters: [...prev.course_config.chapters, newChapter]
              }
            }));
          }}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Añadir Capítulo
        </Button>
      </div>
    </div>
  );

  const renderMembershipFields = () => (
    <div className="space-y-4 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
        <Crown className="w-5 h-5 text-gray-700" />
        Configuración de Membresía
      </h3>
      
      <div className="space-y-2">
        <Label className="text-gray-700">Frecuencia de Facturación</Label>
        <select
          value={formData.membership_config.billing_frequency}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            membership_config: {
              ...prev.membership_config,
              billing_frequency: e.target.value
            }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700"
        >
          <option value="monthly">Mensual</option>
          <option value="bimonthly">Bimensual</option>
          <option value="quarterly">Trimestral</option>
          <option value="semiannual">Semestral</option>
          <option value="annual">Anual</option>
          <option value="custom">Fecha específica personalizada</option>
        </select>
      </div>
      
      {formData.membership_config.billing_frequency === 'custom' && (
        <div className="space-y-2">
          <Label className="text-gray-700">Fecha personalizada</Label>
          <Input
            type="date"
            value={formData.membership_config.custom_date || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              membership_config: {
                ...prev.membership_config,
                custom_date: e.target.value
              }
            }))}
            className="border-gray-300 text-gray-700"
          />
        </div>
      )}
    </div>
  );

  // Si no es inline, mantener el modal
  if (!isInline) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white text-xl">
                {product ? t('editProduct') : t('addNewProduct')}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onCancel} className="text-white">
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            
            <CardContent>
              {/* Render form content here */}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  const descriptionPlaceholder = `Este curso/template/ebook le enseñará todo lo que necesita saber para alcanzar sus metas. Es la guía ideal si usted está buscando:
- Alcanzar sus sueños
- Encontrar propósito en su trabajo
- Mejorar sus finanzas
- Ser más feliz`;

  // Versión inline (sin modal)
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Image */}
        <div className="space-y-2">
          <Label className="text-gray-700">Imagen del Producto</Label>
          <div className="flex items-center gap-4">
            {formData.image_url ? (
              <img 
                src={formData.image_url} 
                alt="Product preview"
                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Button 
                type="button" 
                variant="outline" 
                disabled={isUploading}
                onClick={() => imageInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Subiendo...' : 'Subir Imagen'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setShowImageSearch(true)}
              >
                <Library className="w-4 h-4 mr-2" />
                Buscar Imagen
              </Button>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="title" className="text-gray-700">Título del Producto</Label>
            <span className="text-xs text-gray-500">{formData.title.length}/50</span>
          </div>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => {
              if (e.target.value.length <= 50) {
                setFormData(prev => ({ ...prev, title: e.target.value }))
              }
            }}
            className="border-gray-300"
            placeholder="Ingresa el título del producto"
            required
            maxLength={50}
          />
        </div>

        {/* Subtitle */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="subtitle" className="text-gray-700">Subtítulo del Producto</Label>
            <span className="text-xs text-gray-500">{formData.subtitle.length}/100</span>
          </div>
          <Textarea
            id="subtitle"
            value={formData.subtitle}
            onChange={(e) => {
              if (e.target.value.length <= 100) {
                setFormData(prev => ({ ...prev, subtitle: e.target.value }))
              }
            }}
            className="border-gray-300 h-20"
            placeholder="Un subtítulo breve y atractivo para tu producto."
            maxLength={100}
          />
        </div>

        {/* Description with Rich Text Editor and AI */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="description" className="text-gray-700">Descripción</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAIPrompt(true)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generar con IA
            </Button>
          </div>
          
          <RichTextEditor
            value={formData.description}
            onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
            placeholder={descriptionPlaceholder}
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price" className="text-gray-700">Precio ($)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
            className="border-gray-300"
            required
          />
        </div>

        {/* Product File (only for digital products) */}
        {productType === 'digital_product' && (
          <div className="space-y-2">
            <Label className="text-gray-700">Archivo del Producto (Descarga)</Label>
            <div className="flex items-center gap-4">
              {uploadedFileName ? (
                <div className="flex-1 flex items-center justify-between p-2 bg-gray-100 border border-gray-200 rounded-lg text-sm">
                  <span className="text-gray-700 truncate" title={uploadedFileName}>{uploadedFileName}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setFormData(prev => ({ ...prev, file_url: ''}));
                      setUploadedFileName('');
                      if (fileInputRef.current) {
                        fileInputRef.current.value = null; // Clear file input
                      }
                    }}
                    className="text-red-500 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? 'Subiendo...' : 'Subir Archivo'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Specific fields by product type */}
        {productType === 'consultation' && renderConsultationFields()}
        {productType === 'course' && renderCourseFields()}
        {productType === 'membership' && renderMembershipFields()}

        {/* Active Toggle */}
        <div className="flex items-center space-x-2 pt-6 border-t border-gray-200">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
          />
          <Label htmlFor="is_active" className="text-gray-700">Producto está activo</Label>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSaving}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? 'Guardando...' : (product ? 'Actualizar Producto' : 'Crear Producto')}
          </Button>
        </div>
      </form>

      {/* AI Prompt Modal */}
      <AnimatePresence>
        {showAIPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Generar descripción con IA</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAIPrompt(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700">Describe brevemente tu producto:</Label>
                  <Textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ej: Un curso online de marketing digital para principiantes, incluye 10 lecciones en video, plantillas y ejercicios prácticos..."
                    className="mt-2 h-24"
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowAIPrompt(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleGenerateAIDescription}
                    disabled={!aiPrompt.trim() || isGeneratingAI}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isGeneratingAI ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showImageSearch && (
          <ImageSearchModal
            onClose={() => setShowImageSearch(false)}
            onSelectImage={(url) => {
              setFormData(prev => ({ ...prev, image_url: url }));
              setShowImageSearch(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

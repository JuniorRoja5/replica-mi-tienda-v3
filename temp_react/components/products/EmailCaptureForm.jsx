import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Plus, 
  X, 
  Download, 
  ExternalLink, 
  MessageSquare,
  Upload,
  Library,
  Settings,
  User,
  AtSign,
  Heart,
  Image as ImageIcon
} from 'lucide-react';
import { UploadFile } from '@/api/integrations';
import ImageSearchModal from './ImageSearchModal';

const FIELD_TYPES = [
  { id: 'name', label: 'Nombre', icon: User, placeholder: 'Ej: Tu nombre completo' },
  { id: 'instagram', label: 'Instagram', icon: AtSign, placeholder: 'Ej: @tu_usuario' },
  { id: 'interests', label: 'Intereses', icon: Heart, placeholder: 'Ej: Fitness, Tecnología' },
  { id: 'custom', label: 'Campo personalizado', icon: Settings, placeholder: 'Escribe aquí...' }
];

const ACTION_TYPES = [
  { id: 'download', title: 'Descargar archivo', icon: Download },
  { id: 'redirect', title: 'Ir a enlace externo', icon: ExternalLink },
  { id: 'message', title: 'Mostrar mensaje', icon: MessageSquare }
];

export default function EmailCaptureForm({ onSave, onCancel }) {
  const [isUploading, setIsUploading] = useState(false);
  const [showImageSearch, setShowImageSearch] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '¡Consigue Mi Guía GRATIS!',
    description: '¡Únete a mi lista de correo y nunca te pierdas una actualización!',
    button_title: 'ENVIAR Y DESCARGAR',
    image_url: '',
    form_fields: [
      { id: 'name', type: 'name', label: 'Ingresa tu nombre', required: true, enabled: true },
      { id: 'email', type: 'email', label: 'Ingresa tu email', required: true, enabled: true }
    ],
    action_type: 'download',
    download_file_url: '',
    redirect_url: '',
    success_message: '¡Gracias! Hemos recibido tu información.',
    send_confirmation: false,
    confirmation_subject: '',
    confirmation_message: '',
    is_active: true
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, image_url: file_url }));
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, download_file_url: file_url }));
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const addFormField = (fieldType) => {
    const newField = {
      id: Date.now().toString(),
      type: fieldType.id,
      label: fieldType.label,
      required: false,
      enabled: true,
      placeholder: fieldType.placeholder
    };
    setFormData(prev => ({ ...prev, form_fields: [...prev.form_fields, newField] }));
  };

  const removeFormField = (fieldId) => {
    setFormData(prev => ({ ...prev, form_fields: prev.form_fields.filter(field => field.id !== fieldId) }));
  };

  const updateFormField = (fieldId, updates) => {
    setFormData(prev => ({
      ...prev,
      form_fields: prev.form_fields.map(field => field.id === fieldId ? { ...field, ...updates } : field)
    }));
  };

  const handleSave = () => {
    const productData = {
      type: 'email_capture',
      title: formData.title,
      description: formData.description,
      image_url: formData.image_url,
      button_title: formData.button_title,
      price: 0,
      category: 'email-capture',
      is_active: formData.is_active,
      email_capture_config: {
        form_fields: formData.form_fields,
        action_type: formData.action_type,
        download_file_url: formData.download_file_url,
        redirect_url: formData.redirect_url,
        success_message: formData.success_message,
        send_confirmation: formData.send_confirmation,
        confirmation_subject: formData.confirmation_subject,
        confirmation_message: formData.confirmation_message
      }
    };
    onSave(productData);
  };

  const renderFormPreview = () => (
    <div className="w-full h-full bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-xs mx-auto">
        <div className="text-center text-white space-y-4">
          {formData.image_url && (
            <div className="w-20 h-20 mx-auto rounded-lg overflow-hidden">
              <img src={formData.image_url} alt="Vista previa del formulario" className="w-full h-full object-cover"/>
            </div>
          )}
          <h2 className="text-xl font-bold">{formData.title}</h2>
          <p className="text-gray-300 text-sm">{formData.description}</p>
          
          <div className="space-y-3 pt-2">
            {formData.form_fields.filter(f => f.enabled).map(field => (
              <Input
                key={field.id}
                placeholder={field.label}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                disabled
              />
            ))}
            <Button className="w-full bg-white text-black font-bold hover:bg-gray-200">
              {formData.button_title}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col">
      {/* Header con navegación */}
      <div className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Mi Tienda / Recolectar E-mails</h1>
          <p className="text-gray-600 text-sm">Crea un formulario para capturar correos electrónicos</p>
        </div>
      </div>

      {/* Contenido principal - DOS PANELES SIN RESTRICCIONES */}
      <div className="flex-1 flex w-full">
        {/* PANEL IZQUIERDO - Formulario de configuración */}
        <div className="flex-1 bg-white p-8 overflow-y-auto">
          <div className="space-y-12">
            {/* SECCIÓN 1: Seleccionar imagen */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-gray-800 text-white font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Seleccionar imagen</h2>
              </div>
              
              <div className="space-y-4">
                <div 
                  className="w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => document.getElementById('image-upload').click()}
                >
                  {formData.image_url ? (
                    <img src={formData.image_url} alt="Imagen seleccionada" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="text-center text-gray-500">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">Miniatura</p>
                      <p className="text-xs">400x400</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <input 
                    type="file" 
                    id="image-upload" 
                    className="hidden" 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                  />
                  <Button 
                    variant="outline" 
                    disabled={isUploading}
                    onClick={() => document.getElementById('image-upload').click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? "Subiendo..." : "Elegir Imagen"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowImageSearch(true)}
                  >
                    <Library className="w-4 h-4 mr-2" />
                    Buscar Imagen
                  </Button>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: Añadir texto */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-gray-800 text-white font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Añadir texto</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Título</Label>
                  <Input 
                    value={formData.title} 
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ej: ¡Consigue Mi Guía GRATIS!"
                    className="w-96"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.title.length}/50</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Subtítulo</Label>
                  <Textarea 
                    value={formData.description} 
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="¡Únete a mi lista de correo y nunca te pierdas una actualización!"
                    className="w-96 h-20 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.description.length}/100</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Texto del Botón*</Label>
                  <Input 
                    value={formData.button_title} 
                    onChange={(e) => setFormData(prev => ({ ...prev, button_title: e.target.value }))}
                    placeholder="ENVIAR Y DESCARGAR"
                    className="w-96"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.button_title.length}/30</p>
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: Recolectar información */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-gray-800 text-white font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Recolectar información</h2>
              </div>
              
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700">Campos del formulario</Label>
                <div className="space-y-3">
                  {formData.form_fields.map((field) => (
                    <div key={field.id} className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 w-96">
                      <Input 
                        value={field.label} 
                        onChange={(e) => updateFormField(field.id, { label: e.target.value })}
                        className="flex-1 bg-white"
                      />
                      {field.type !== 'email' && (
                        <Button variant="ghost" size="icon" onClick={() => removeFormField(field.id)}>
                          <X className="w-4 h-4 text-gray-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {FIELD_TYPES.map((type) => (
                    <Button key={type.id} variant="outline" size="sm" onClick={() => addFormField(type)}>
                      <Plus className="w-4 h-4 mr-2" />
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECCIÓN 4: Acción después del envío */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-gray-800 text-white font-bold flex items-center justify-center text-sm">
                  4
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Acción después del envío</h2>
              </div>
              
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700">¿Qué sucede después de enviar?</Label>
                <div className="space-y-2 w-96">
                  {ACTION_TYPES.map(action => (
                    <Button 
                      key={action.id} 
                      variant={formData.action_type === action.id ? 'default' : 'outline'} 
                      onClick={() => setFormData(prev => ({ ...prev, action_type: action.id}))}
                      className="w-full justify-start"
                    >
                      <action.icon className="w-4 h-4 mr-2" />
                      {action.title}
                    </Button>
                  ))}
                </div>
                
                {formData.action_type === 'download' && (
                  <div className="pt-4 space-y-3 w-96">
                    <Label className="text-sm font-medium text-gray-700">Archivo para descargar</Label>
                    <input type="file" id="file-upload" className="hidden" onChange={handleFileUpload} />
                    <Button 
                      variant="outline" 
                      disabled={isUploading}
                      onClick={() => document.getElementById('file-upload').click()}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? 'Subiendo...' : 'Subir Archivo'}
                    </Button>
                    {formData.download_file_url && (
                      <p className="text-xs text-green-600">✓ Archivo subido correctamente</p>
                    )}
                  </div>
                )}
                
                {formData.action_type === 'redirect' && (
                  <div className="pt-4 space-y-3 w-96">
                    <Label className="text-sm font-medium text-gray-700">URL de redirección</Label>
                    <Input 
                      value={formData.redirect_url} 
                      onChange={(e) => setFormData(prev => ({...prev, redirect_url: e.target.value}))} 
                      placeholder="https://tu-sitio-web.com" 
                    />
                  </div>
                )}
                
                {formData.action_type === 'message' && (
                  <div className="pt-4 space-y-3 w-96">
                    <Label className="text-sm font-medium text-gray-700">Mensaje de agradecimiento</Label>
                    <Textarea 
                      value={formData.success_message} 
                      onChange={(e) => setFormData(prev => ({...prev, success_message: e.target.value}))}
                      placeholder="¡Gracias! Hemos recibido tu información."
                      className="h-20 resize-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-start gap-3 pt-8 border-t">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                Guardar Producto
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>

        {/* PANEL DERECHO - Vista previa del móvil */}
        <div className="w-80 bg-gray-100 flex items-center justify-center p-6 border-l">
          <div className="relative bg-black rounded-[3rem] h-[600px] w-[300px] shadow-2xl p-[3px]">
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-800 rounded-full z-10"></div>
            <div className="relative w-full h-full bg-white rounded-[2.8rem] overflow-hidden mt-2">
              {renderFormPreview()}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de búsqueda de imágenes */}
      {showImageSearch && (
        <ImageSearchModal
          onClose={() => setShowImageSearch(false)}
          onSelectImage={(url) => {
            setFormData(prev => ({ ...prev, image_url: url }));
            setShowImageSearch(false);
          }}
        />
      )}
    </div>
  );
}
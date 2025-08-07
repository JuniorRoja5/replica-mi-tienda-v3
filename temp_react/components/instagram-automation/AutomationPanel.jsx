import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Image as ImageIcon, MessageSquare, CornerDownRight, Zap, Clock, Save, X } from 'lucide-react';

const MOCK_POSTS = [
  { id: '123', thumbnail_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', caption: 'Mi nuevo ebook de fitness...' },
  { id: '456', thumbnail_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80', caption: 'Clase gratuita de marketing...' },
  { id: '789', thumbnail_url: 'https://images.unsplash.com/photo-1517694712202-1428bc3835b6?w=400&q=80', caption: 'Cómo programar una app...' },
  { id: '101', thumbnail_url: 'https://images.unsplash.com/photo-1506126613408-4e05960270e3?w=400&q=80', caption: 'Meditación y mindfulness...' },
];

export default function AutomationPanel({ automation, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: automation?.name || '',
    instagram_post_id: automation?.instagram_post_id || null,
    instagram_post_thumbnail_url: automation?.instagram_post_thumbnail_url || null,
    keywords: automation?.keywords?.join(', ') || '',
    public_reply: automation?.public_reply || '',
    direct_message: automation?.direct_message || '',
    delay_seconds: automation?.delay_seconds || 60,
    status: automation?.status || 'active',
  });

  const handleSubmit = () => {
    const dataToSave = {
      ...formData,
      keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
    };
    onSave(dataToSave);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">
            {automation ? 'Editar Automatización' : 'Crear Nueva Automatización'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div>
            <label className="font-medium text-gray-700">Nombre de la Automatización</label>
            <Input 
              placeholder="Ej: Promo Ebook Fitness"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="font-medium text-gray-700">1. Selecciona una publicación</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {MOCK_POSTS.map(post => (
                <button
                  key={post.id}
                  onClick={() => setFormData({ ...formData, instagram_post_id: post.id, instagram_post_thumbnail_url: post.thumbnail_url })}
                  className={`relative rounded-md overflow-hidden border-2 ${formData.instagram_post_id === post.id ? 'border-blue-500' : 'border-transparent'}`}
                >
                  <img src={post.thumbnail_url} alt="Post" className="aspect-square object-cover" />
                  <div className="absolute inset-0 bg-black/40"></div>
                </button>
              ))}
            </div>
             <p className="text-xs text-gray-500 mt-2">// TODO: Conectar con la API de Instagram para mostrar los posts reales del usuario.</p>
          </div>

          <div>
            <label className="font-medium text-gray-700">2. Define las palabras clave</label>
            <Input 
              placeholder="info, ebook, quiero (separadas por comas)"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">Cualquiera de estas palabras activará la automatización.</p>
          </div>
          
          <div>
            <label className="font-medium text-gray-700">3. Configura la respuesta pública</label>
            <Textarea
              placeholder="¡Claro! Te acabo de enviar la info por DM. 💪"
              value={formData.public_reply}
              onChange={(e) => setFormData({ ...formData, public_reply: e.target.value })}
            />
             <p className="text-xs text-gray-500 mt-1">Esta respuesta se publicará como un comentario al comentario del usuario.</p>
          </div>
          
          <div>
            <label className="font-medium text-gray-700">4. Configura el mensaje directo</label>
            <Textarea
              placeholder="¡Hola! Aquí tienes el link a mi nuevo Ebook de Fitness: [tu-link-aqui]"
              value={formData.direct_message}
              onChange={(e) => setFormData({ ...formData, direct_message: e.target.value })}
              rows={4}
            />
             <p className="text-xs text-gray-500 mt-1">Este mensaje se enviará al DM del usuario.</p>
          </div>
          
          <div>
            <label className="font-medium text-gray-700">5. Define el tiempo de espera</label>
            <div className="flex items-center gap-2">
                <Input
                    type="number"
                    className="w-24"
                    value={formData.delay_seconds}
                    onChange={(e) => setFormData({ ...formData, delay_seconds: parseInt(e.target.value) || 0 })}
                />
                <span className="text-gray-700">segundos</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Tiempo a esperar después del comentario antes de enviar el DM.</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Guardar Automatización
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
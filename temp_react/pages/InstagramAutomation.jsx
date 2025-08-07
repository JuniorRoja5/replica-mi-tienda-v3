import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquareReply, History } from 'lucide-react';
import { InstagramAutomation as InstagramAutomationEntity, AutomationLog as AutomationLogEntity, User } from '@/api/entities';

import AutomationPanel from '../components/instagram-automation/AutomationPanel';
import AutomationsList from '../components/instagram-automation/AutomationsList';
import AutomationHistory from '../components/instagram-automation/AutomationHistory';
import ConnectInstagram from '../components/instagram-automation/ConnectInstagram';

// Mock Data
const MOCK_AUTOMATIONS = [
  { id: 'auto_1', name: 'Promo Ebook Fitness', instagram_post_id: '123', instagram_post_thumbnail_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', keywords: ['info', 'ebook', 'quiero'], public_reply: '¡Claro! Te acabo de enviar toda la info por DM. 💪', direct_message: '¡Hola! Aquí tienes el link a mi nuevo Ebook de Fitness para que transformes tu físico: [tu-link-aqui]', delay_seconds: 60, status: 'active', trigger_count: 128 },
  { id: 'auto_2', name: 'Clase Gratuita Marketing', instagram_post_id: '456', instagram_post_thumbnail_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80', keywords: ['clase', 'gratis'], public_reply: '¡Perfecto! Revisa tu DM para acceder a la clase gratuita. 🚀', direct_message: '¡Genial que te interese! Aquí tienes el acceso a la clase gratuita de marketing digital: [tu-link-aqui]', delay_seconds: 10, status: 'paused', trigger_count: 54 },
];

const MOCK_LOGS = [
    { id: 'log_1', automation_id: 'auto_1', commenter_username: '@ana_fit', comment_text: 'quiero el ebook', created_date: '2023-11-01T10:00:00Z', status: 'processed' },
    { id: 'log_2', automation_id: 'auto_2', commenter_username: '@pedro_marketing', comment_text: 'clase por favor', created_date: '2023-11-01T09:30:00Z', status: 'processed' },
    { id: 'log_3', automation_id: 'auto_1', commenter_username: '@carlos_runner', comment_text: 'Info!!', created_date: '2023-10-31T18:00:00Z', status: 'processed' },
];

export default function InstagramAutomationPage() {
  const [automations, setAutomations] = useState([]);
  const [logs, setLogs] = useState([]);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'editor', 'history'
  const [selectedAutomation, setSelectedAutomation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Reemplazar con llamadas a la API
    setIsLoading(true);
    setTimeout(() => {
      setAutomations(MOCK_AUTOMATIONS);
      setLogs(MOCK_LOGS);
      setIsLoading(false);
    }, 500);
  }, []);
  
  const handleCreateNew = () => {
    setSelectedAutomation(null);
    setCurrentView('editor');
  };

  const handleEdit = (automation) => {
    setSelectedAutomation(automation);
    setCurrentView('editor');
  };
  
  const handleSave = (data) => {
    // TODO: Implementar llamada a API para guardar
    if (selectedAutomation) {
      setAutomations(automations.map(a => a.id === data.id ? data : a));
    } else {
      const newAutomation = { ...data, id: `auto_${Date.now()}` };
      setAutomations([newAutomation, ...automations]);
    }
    setCurrentView('list');
    setSelectedAutomation(null);
  };
  
  const handleDelete = (id) => {
    // TODO: Implementar llamada a API para borrar
    setAutomations(automations.filter(a => a.id !== id));
  };
  
  const handleToggleStatus = (id, status) => {
    // TODO: Implementar llamada a API para cambiar estado
    setAutomations(automations.map(a => a.id === id ? { ...a, status } : a));
  };

  const renderContent = () => {
    switch (currentView) {
      case 'editor':
        return (
          <AutomationPanel
            automation={selectedAutomation}
            onSave={handleSave}
            onCancel={() => setCurrentView('list')}
          />
        );
      case 'history':
        return <AutomationHistory logs={logs} />;
      case 'list':
      default:
        return (
          <AutomationsList
            automations={automations}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        );
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-4"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Auto-respuestas IG</h1>
          <p className="text-gray-600 text-lg">Automatiza tus comentarios y DMs de Instagram.</p>
        </div>
        <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Crear Automatización
        </Button>
      </motion.div>
      
      <ConnectInstagram />

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setCurrentView('list')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              currentView === 'list' || currentView === 'editor'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MessageSquareReply className="w-4 h-4" />
            Mis Automatizaciones
          </button>
          <button
            onClick={() => setCurrentView('history')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              currentView === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <History className="w-4 h-4" />
            Historial
          </button>
        </nav>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {isLoading ? <p>Cargando...</p> : renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
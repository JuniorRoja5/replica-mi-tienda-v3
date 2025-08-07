import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Sparkles, 
  MessageCircle, 
  HelpCircle, 
  ThumbsUp, 
  ThumbsDown,
  ExternalLink,
  RefreshCw,
  User,
  Bot
} from 'lucide-react';
import { User as UserEntity } from '@/api/entities';
import { InvokeLLM } from '@/api/integrations';

const SUGGESTED_QUESTIONS = [
  "¿Cómo creo mi primer producto digital?",
  "¿Cómo conecto mi Instagram con ClickMyLink?",
  "¿Qué comisiones cobra ClickMyLink por cada venta?",
  "¿Cómo cambio el diseño de mi página?",
  "¿Cómo puedo retirar mis ganancias?"
];

const KNOWLEDGE_BASE = `
ClickMyLink es una plataforma todo-en-uno para creadores de contenido que permite:

PRODUCTOS Y VENTAS:
- Crear productos digitales: cursos, ebooks, templates, consultas 1-a-1
- Vender productos físicos y digitales desde un solo enlace
- Gestionar inventario y entregas automáticas
- Aceptar pagos con Stripe y PayPal
- Comisión del 5% por cada venta exitosa

DISEÑO Y PERSONALIZACIÓN:
- Más de 10 temas profesionales disponibles
- Personalización completa de colores, fuentes y diseño
- Páginas móviles optimizadas automáticamente
- Subir logo y fotos personalizadas

FUNCIONALIDADES AVANZADAS:
- Sistema de calendario integrado tipo Calendly
- Automatización de emails y secuencias de marketing
- Auto-respuestas de Instagram y comentarios
- Sistema de afiliados con 25% de comisión recurrente
- Analytics y métricas detalladas

SOPORTE Y AYUDA:
- Soporte 24/7 por chat y email
- Centro de ayuda con tutoriales paso a paso
- Comunidad de creadores activa
- Webinars gratuitos semanales

PRECIOS:
- Plan básico: $19/mes
- Plan Pro: $39/mes (incluye funciones avanzadas)
- Sin comisiones adicionales por transacciones
- Prueba gratuita de 14 días

INTEGRACIONES:
- Instagram, TikTok, YouTube, Twitter
- Google Calendar, Outlook, Apple Calendar
- Zoom, Google Meet, Microsoft Teams
- Mailchimp, ConvertKit, ActiveCampaign
- Stripe, PayPal, mercado Pago

CONFIGURACIÓN INICIAL:
1. Crear cuenta y verificar email
2. Configurar perfil y bio
3. Subir foto de perfil
4. Crear primer producto
5. Personalizar diseño de página
6. Compartir enlace en redes sociales
`;

export default function AskLink() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadUser();
    // Mensaje inicial del asistente
    setMessages([{
      id: 'welcome',
      type: 'assistant',
      content: '¡Hola! Soy Link, tu asistente personal para crecer como creador. Estoy aquí para ayudarte con cualquier pregunta sobre ClickMyLink, consejos para monetizar tu contenido, o cualquier duda que tengas. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date().toISOString()
    }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadUser = async () => {
    try {
      const currentUser = await UserEntity.me();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSuggestedQuestion = (question) => {
    setInputValue(question);
    handleSendMessage(question);
  };

  const handleSendMessage = async (messageText = inputValue) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Crear el prompt con contexto
      const prompt = `
Eres Link, el asistente de ClickMyLink. Tu trabajo es ayudar a creadores de contenido con preguntas sobre la plataforma y consejos para monetizar.

CONTEXTO DE LA PLATAFORMA:
${KNOWLEDGE_BASE}

INSTRUCCIONES:
- Responde de forma amigable, directa y útil
- Si la pregunta es sobre funcionalidades de ClickMyLink, usa la información del contexto
- Si es sobre consejos generales para creadores, da consejos prácticos y motivadores
- Mantén las respuestas concisas pero completas
- Si no sabes algo específico, sugiere contactar soporte
- Usa emojis ocasionalmente para ser más amigable

PREGUNTA DEL USUARIO: ${messageText}

Responde como Link, el asistente de ClickMyLink:`;

      const response = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false
      });

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Lo siento, tengo problemas técnicos en este momento. Por favor, intenta de nuevo o contacta a nuestro equipo de soporte para ayuda inmediata.',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      type: 'assistant',
      content: '¡Hola! Soy Link, tu asistente personal para crecer como creador. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date().toISOString()
    }]);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Pregúntale a Link</h1>
            <p className="text-sm text-gray-600">Tu asistente personal para crecer como creador</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={clearChat}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Nueva conversación
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 justify-start"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <p className="text-sm text-gray-600 font-medium">Preguntas frecuentes:</p>
            <div className="grid gap-2">
              {SUGGESTED_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-left text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg px-3 py-2 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu pregunta aquí..."
              className="min-h-[44px] resize-none"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 h-[44px]"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Help Links */}
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
          <button className="hover:text-gray-700 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            Centro de Ayuda
          </button>
          <span>•</span>
          <button className="hover:text-gray-700 flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            Contactar Soporte
          </button>
        </div>
      </div>
    </div>
  );
}
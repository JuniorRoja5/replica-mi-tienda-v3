import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Calendar,
  Video,
  Globe,
  Settings,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Zap,
  Shield,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";

const IntegrationCard = ({ 
  title, 
  description, 
  icon: Icon, 
  color, 
  isConnected, 
  isAvailable = false,
  onConnect,
  features = []
}) => (
  <Card className="bg-white border border-gray-200 hover:shadow-md transition-all duration-200">
    <CardContent className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Conectado
            </Badge>
          ) : (
            <Badge variant="secondary">
              No conectado
            </Badge>
          )}
        </div>
      </div>

      {features.length > 0 && (
        <div className="mb-4">
          <ul className="text-sm text-gray-600 space-y-1">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end">
        {isAvailable ? (
          <Button
            onClick={onConnect}
            variant={isConnected ? "outline" : "default"}
            className={isConnected ? "" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            {isConnected ? "Configurar" : "Conectar"}
          </Button>
        ) : (
          <Button disabled variant="outline">
            Próximamente
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

export default function IntegrationsPanel({ creator, onUpdate }) {
  const [integrations, setIntegrations] = useState({
    google_calendar: false,
    outlook_calendar: false,
    apple_calendar: false,
    zoom: false,
    google_meet: false,
    teams: false
  });

  const calendarIntegrations = [
    {
      id: 'google_calendar',
      title: 'Google Calendar',
      description: 'Sincroniza automáticamente con tu Google Calendar',
      icon: Calendar,
      color: 'bg-blue-500',
      isConnected: integrations.google_calendar,
      isAvailable: false, // Will be true when OAuth is implemented
      features: [
        'Sincronización bidireccional en tiempo real',
        'Prevención automática de dobles reservas',
        'Múltiples calendarios compatibles'
      ]
    },
    {
      id: 'outlook_calendar',
      title: 'Microsoft Outlook',
      description: 'Conecta con tu calendario de Outlook/Office 365',
      icon: Calendar,
      color: 'bg-blue-600',
      isConnected: integrations.outlook_calendar,
      isAvailable: false,
      features: [
        'Compatible con Office 365',
        'Sincronización completa',
        'Gestión de disponibilidad'
      ]
    },
    {
      id: 'apple_calendar',
      title: 'Apple Calendar',
      description: 'Integración con iCloud Calendar',
      icon: Calendar,
      color: 'bg-gray-800',
      isConnected: integrations.apple_calendar,
      isAvailable: false,
      features: [
        'Sincronización con iCloud',
        'Compatible con todos los dispositivos Apple',
        'Actualización automática'
      ]
    }
  ];

  const videoIntegrations = [
    {
      id: 'zoom',
      title: 'Zoom',
      description: 'Genera automáticamente enlaces de Zoom para tus reuniones',
      icon: Video,
      color: 'bg-blue-500',
      isConnected: integrations.zoom,
      isAvailable: false,
      features: [
        'Generación automática de enlaces',
        'Configuración de salas de espera',
        'Grabación automática opcional'
      ]
    },
    {
      id: 'google_meet',
      title: 'Google Meet',
      description: 'Crea enlaces de Google Meet automáticamente',
      icon: Video,
      color: 'bg-green-500',
      isConnected: integrations.google_meet,
      isAvailable: false,
      features: [
        'Integración con Google Workspace',
        'Enlaces únicos por reunión',
        'Acceso directo desde Gmail'
      ]
    },
    {
      id: 'teams',
      title: 'Microsoft Teams',
      description: 'Genera reuniones de Teams automáticamente',
      icon: Video,
      color: 'bg-purple-600',
      isConnected: integrations.teams,
      isAvailable: false,
      features: [
        'Compatible con Office 365',
        'Salas virtuales automáticas',
        'Integración completa con Teams'
      ]
    }
  ];

  const handleConnect = (integrationId) => {
    // This would typically open OAuth flow
    console.log(`Connecting to ${integrationId}...`);
    // For now, just simulate connection
    setIntegrations(prev => ({
      ...prev,
      [integrationId]: !prev[integrationId]
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Integraciones</h2>
        <p className="text-gray-600">
          Conecta tu calendario y herramientas de videoconferencia para automatizar completamente tu flujo de trabajo.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">Calendarios</h3>
                <p className="text-blue-700 text-sm">Sincronización automática</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {calendarIntegrations.filter(i => i.isConnected).length}/3
            </div>
            <p className="text-blue-700 text-sm">conectados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Video className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-900">Videoconferencia</h3>
                <p className="text-purple-700 text-sm">Enlaces automáticos</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {videoIntegrations.filter(i => i.isConnected).length}/3
            </div>
            <p className="text-purple-700 text-sm">conectados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Automatización</h3>
                <p className="text-green-700 text-sm">Flujo completo</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-900">
              {Math.round(((calendarIntegrations.filter(i => i.isConnected).length + videoIntegrations.filter(i => i.isConnected).length) / 6) * 100)}%
            </div>
            <p className="text-green-700 text-sm">completado</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Integrations */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Integraciones de Calendario
        </h3>
        <p className="text-gray-600 mb-6">
          Conecta tu calendario para evitar dobles reservas y mantener tu agenda sincronizada automáticamente.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {calendarIntegrations.map((integration, index) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <IntegrationCard
                {...integration}
                onConnect={() => handleConnect(integration.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Integrations */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Video className="w-5 h-5" />
          Integraciones de Videoconferencia
        </h3>
        <p className="text-gray-600 mb-6">
          Genera automáticamente enlaces de videollamada para todas tus reuniones programadas.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {videoIntegrations.map((integration, index) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <IntegrationCard
                {...integration}
                onConnect={() => handleConnect(integration.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuración General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Zona Horaria</h4>
              <p className="text-sm text-gray-600">Tu zona horaria para mostrar disponibilidad</p>
            </div>
            <div className="text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded">
              <Clock className="w-4 h-4 inline mr-2" />
              America/Mexico_City (GMT-6)
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Notificaciones por Email</h4>
              <p className="text-sm text-gray-600">Recibir confirmaciones y recordatorios</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Sincronización Automática</h4>
              <p className="text-sm text-gray-600">Mantener calendarios sincronizados en tiempo real</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Generar Enlaces Automáticamente</h4>
              <p className="text-sm text-gray-600">Crear enlaces de videollamada al confirmar reservas</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Próximamente: Integraciones Completas</h3>
              <p className="text-blue-800 mb-4">
                Estamos trabajando en implementar todas estas integraciones con OAuth 2.0 y webhooks 
                para una sincronización perfecta y segura con tus herramientas favoritas.
              </p>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Autenticación segura OAuth 2.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Sincronización en tiempo real</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Webhooks para actualizaciones automáticas</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
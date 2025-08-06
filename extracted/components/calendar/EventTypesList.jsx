import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock,
  DollarSign,
  Copy,
  Check,
  Edit,
  Trash2,
  ExternalLink,
  Play,
  Pause,
  Plus,
  Calendar,
  Users,
  Settings
} from "lucide-react";
import { motion } from "framer-motion";

export default function EventTypesList({ 
  eventTypes, 
  creator, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  onCreate 
}) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyLink = async (eventType) => {
    const publicUrl = `${window.location.origin}/book/${creator.username}/${eventType.slug}`;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopiedId(eventType.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const getLocationIcon = (locationType) => {
    switch (locationType) {
      case 'zoom':
        return '📹';
      case 'google_meet':
        return '🎥';
      case 'teams':
        return '👥';
      case 'phone':
        return '📞';
      case 'in_person':
        return '📍';
      default:
        return '🔗';
    }
  };

  const getLocationLabel = (locationType) => {
    switch (locationType) {
      case 'zoom':
        return 'Zoom';
      case 'google_meet':
        return 'Google Meet';
      case 'teams':
        return 'Microsoft Teams';
      case 'phone':
        return 'Llamada telefónica';
      case 'in_person':
        return 'Presencial';
      default:
        return 'Personalizado';
    }
  };

  if (eventTypes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Crea tu primer evento
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Configura tipos de reuniones para que tus clientes puedan agendar contigo fácilmente.
            </p>
            <Button onClick={onCreate} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Evento
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mis Tipos de Eventos</h2>
          <p className="text-gray-600">Gestiona tus enlaces de reserva y configuraciones</p>
        </div>
        <Button onClick={onCreate} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Evento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {eventTypes.map((eventType, index) => (
          <motion.div
            key={eventType.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`bg-white border-2 transition-all duration-200 hover:shadow-lg ${
              eventType.is_active ? 'border-green-200 hover:border-green-300' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: eventType.color || '#3B82F6' }}
                      ></div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {eventType.title}
                      </CardTitle>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {eventType.description || 'Sin descripción'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={eventType.is_active ? "default" : "secondary"}>
                      {eventType.is_active ? 'Activo' : 'Pausado'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Información del evento */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{eventType.duration} min</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>{getLocationIcon(eventType.location_type)}</span>
                      <span>{getLocationLabel(eventType.location_type)}</span>
                    </div>
                    {eventType.price > 0 && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>${eventType.price}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>0 reservas</span>
                    </div>
                  </div>

                  {/* URL del evento */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-gray-600 truncate">
                        /{creator.username}/{eventType.slug}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyLink(eventType)}
                        className="flex-shrink-0"
                      >
                        {copiedId === eventType.id ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(eventType)}
                        className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/book/${creator.username}/${eventType.slug}`, '_blank')}
                        className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleStatus(eventType.id, eventType.is_active)}
                        className={eventType.is_active ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
                      >
                        {eventType.is_active ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(eventType.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
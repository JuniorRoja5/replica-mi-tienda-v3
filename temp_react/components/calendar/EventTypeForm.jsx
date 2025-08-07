import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Save,
  Clock,
  Video,
  MapPin,
  DollarSign,
  Settings,
  Calendar,
  Plus,
  Trash2,
  Users
} from "lucide-react";
import { motion } from "framer-motion";

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];
const LOCATION_TYPES = [
  { value: 'zoom', label: 'Zoom', icon: '📹' },
  { value: 'google_meet', label: 'Google Meet', icon: '🎥' },
  { value: 'teams', label: 'Microsoft Teams', icon: '👥' },
  { value: 'phone', label: 'Llamada telefónica', icon: '📞' },
  { value: 'in_person', label: 'Presencial', icon: '📍' },
  { value: 'custom', label: 'Enlace personalizado', icon: '🔗' }
];

const WEEKDAYS = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' }
];

export default function EventTypeForm({ eventType, onSave, onCancel, creator }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 30,
    price: 0,
    slug: '',
    color: '#3B82F6',
    location_type: 'zoom',
    location_details: '',
    is_active: true,
    availability_schedule: {
      timezone: 'America/Mexico_City',
      weekly_hours: WEEKDAYS.map(day => ({
        day: day.key,
        enabled: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day.key),
        intervals: day.key !== 'saturday' && day.key !== 'sunday' 
          ? [{ start: '09:00', end: '17:00' }] 
          : []
      }))
    },
    booking_settings: {
      buffer_before: 0,
      buffer_after: 0,
      min_notice: 60,
      max_advance_days: 30,
      max_bookings_per_day: null,
      requires_confirmation: false
    },
    form_fields: [
      { id: 'name', label: 'Nombre completo', type: 'text', required: true },
      { id: 'email', label: 'Email', type: 'email', required: true }
    ],
    notification_settings: {
      email_confirmation: true,
      email_reminder_24h: true,
      email_reminder_1h: false,
      host_notifications: true
    },
    integration_settings: {
      calendar_integration: 'none',
      video_integration: 'none',
      auto_generate_meeting_link: false
    }
  });

  const [activeSection, setActiveSection] = useState('basic');

  useEffect(() => {
    if (eventType) {
      setFormData({
        ...formData,
        ...eventType
      });
    }
  }, [eventType]);

  const handleSave = () => {
    // Generate slug from title if not provided
    if (!formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      formData.slug = slug;
    }

    onSave(formData);
  };

  const updateAvailability = (dayKey, field, value) => {
    const newWeeklyHours = formData.availability_schedule.weekly_hours.map(day => {
      if (day.day === dayKey) {
        return { ...day, [field]: value };
      }
      return day;
    });

    setFormData({
      ...formData,
      availability_schedule: {
        ...formData.availability_schedule,
        weekly_hours: newWeeklyHours
      }
    });
  };

  const addTimeInterval = (dayKey) => {
    const newWeeklyHours = formData.availability_schedule.weekly_hours.map(day => {
      if (day.day === dayKey) {
        return {
          ...day,
          intervals: [...day.intervals, { start: '09:00', end: '17:00' }]
        };
      }
      return day;
    });

    setFormData({
      ...formData,
      availability_schedule: {
        ...formData.availability_schedule,
        weekly_hours: newWeeklyHours
      }
    });
  };

  const removeTimeInterval = (dayKey, intervalIndex) => {
    const newWeeklyHours = formData.availability_schedule.weekly_hours.map(day => {
      if (day.day === dayKey) {
        return {
          ...day,
          intervals: day.intervals.filter((_, index) => index !== intervalIndex)
        };
      }
      return day;
    });

    setFormData({
      ...formData,
      availability_schedule: {
        ...formData.availability_schedule,
        weekly_hours: newWeeklyHours
      }
    });
  };

  const updateTimeInterval = (dayKey, intervalIndex, field, value) => {
    const newWeeklyHours = formData.availability_schedule.weekly_hours.map(day => {
      if (day.day === dayKey) {
        return {
          ...day,
          intervals: day.intervals.map((interval, index) => {
            if (index === intervalIndex) {
              return { ...interval, [field]: value };
            }
            return interval;
          })
        };
      }
      return day;
    });

    setFormData({
      ...formData,
      availability_schedule: {
        ...formData.availability_schedule,
        weekly_hours: newWeeklyHours
      }
    });
  };

  const sections = [
    { key: 'basic', label: 'Información Básica', icon: Calendar },
    { key: 'availability', label: 'Disponibilidad', icon: Clock },
    { key: 'booking', label: 'Configuración de Reservas', icon: Settings },
    { key: 'notifications', label: 'Notificaciones', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {eventType ? 'Editar Evento' : 'Crear Nuevo Evento'}
              </h1>
              <p className="text-gray-600">Configura tu tipo de evento y disponibilidad</p>
            </div>
          </div>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Guardar Evento
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Configuración</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.key}
                        onClick={() => setActiveSection(section.key)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          activeSection === section.key
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{section.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                {/* Basic Information Section */}
                {activeSection === 'basic' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
                      
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <Label htmlFor="title">Título del evento *</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="Ej: Consultoría de Marketing"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="description">Descripción</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Describe qué incluye esta reunión..."
                            className="mt-1 h-24"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Duración</Label>
                            <Select
                              value={formData.duration.toString()}
                              onValueChange={(value) => setFormData({...formData, duration: parseInt(value)})}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {DURATION_OPTIONS.map(duration => (
                                  <SelectItem key={duration} value={duration.toString()}>
                                    {duration} minutos
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Precio (USD)</Label>
                            <Input
                              type="number"
                              value={formData.price}
                              onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                              placeholder="0"
                              className="mt-1"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Tipo de ubicación</Label>
                          <Select
                            value={formData.location_type}
                            onValueChange={(value) => setFormData({...formData, location_type: value})}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {LOCATION_TYPES.map(location => (
                                <SelectItem key={location.value} value={location.value}>
                                  <span className="flex items-center gap-2">
                                    <span>{location.icon}</span>
                                    {location.label}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {formData.location_type === 'custom' && (
                          <div>
                            <Label>Enlace personalizado</Label>
                            <Input
                              value={formData.location_details}
                              onChange={(e) => setFormData({...formData, location_details: e.target.value})}
                              placeholder="https://..."
                              className="mt-1"
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Color del evento</Label>
                            <Input
                              type="color"
                              value={formData.color}
                              onChange={(e) => setFormData({...formData, color: e.target.value})}
                              className="mt-1 h-10"
                            />
                          </div>

                          <div>
                            <Label>URL personalizada</Label>
                            <Input
                              value={formData.slug}
                              onChange={(e) => setFormData({...formData, slug: e.target.value})}
                              placeholder="consulta-marketing"
                              className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              /{creator?.username}/{formData.slug || 'url-del-evento'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Availability Section */}
                {activeSection === 'availability' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Disponibilidad Semanal</h3>
                      
                      <div className="space-y-4">
                        {formData.availability_schedule.weekly_hours.map((day) => {
                          const dayInfo = WEEKDAYS.find(d => d.key === day.day);
                          return (
                            <div key={day.day} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <Switch
                                    checked={day.enabled}
                                    onCheckedChange={(checked) => updateAvailability(day.day, 'enabled', checked)}
                                  />
                                  <span className="font-medium text-gray-900">{dayInfo?.label}</span>
                                </div>
                                {day.enabled && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addTimeInterval(day.day)}
                                  >
                                    <Plus className="w-3 h-3 mr-1" />
                                    Agregar horario
                                  </Button>
                                )}
                              </div>

                              {day.enabled && (
                                <div className="space-y-2">
                                  {day.intervals.map((interval, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <Input
                                        type="time"
                                        value={interval.start}
                                        onChange={(e) => updateTimeInterval(day.day, index, 'start', e.target.value)}
                                        className="w-32"
                                      />
                                      <span className="text-gray-500">a</span>
                                      <Input
                                        type="time"
                                        value={interval.end}
                                        onChange={(e) => updateTimeInterval(day.day, index, 'end', e.target.value)}
                                        className="w-32"
                                      />
                                      {day.intervals.length > 1 && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeTimeInterval(day.day, index)}
                                          className="text-red-600 hover:text-red-700"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Booking Settings Section */}
                {activeSection === 'booking' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Reservas</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label>Buffer antes (minutos)</Label>
                          <Input
                            type="number"
                            value={formData.booking_settings.buffer_before}
                            onChange={(e) => setFormData({
                              ...formData,
                              booking_settings: {
                                ...formData.booking_settings,
                                buffer_before: parseInt(e.target.value) || 0
                              }
                            })}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label>Buffer después (minutos)</Label>
                          <Input
                            type="number"
                            value={formData.booking_settings.buffer_after}
                            onChange={(e) => setFormData({
                              ...formData,
                              booking_settings: {
                                ...formData.booking_settings,
                                buffer_after: parseInt(e.target.value) || 0
                              }
                            })}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label>Aviso mínimo (minutos)</Label>
                          <Input
                            type="number"
                            value={formData.booking_settings.min_notice}
                            onChange={(e) => setFormData({
                              ...formData,
                              booking_settings: {
                                ...formData.booking_settings,
                                min_notice: parseInt(e.target.value) || 60
                              }
                            })}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label>Máximo días anticipación</Label>
                          <Input
                            type="number"
                            value={formData.booking_settings.max_advance_days}
                            onChange={(e) => setFormData({
                              ...formData,
                              booking_settings: {
                                ...formData.booking_settings,
                                max_advance_days: parseInt(e.target.value) || 30
                              }
                            })}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label>Máximo reservas por día</Label>
                          <Input
                            type="number"
                            value={formData.booking_settings.max_bookings_per_day || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              booking_settings: {
                                ...formData.booking_settings,
                                max_bookings_per_day: e.target.value ? parseInt(e.target.value) : null
                              }
                            })}
                            placeholder="Ilimitado"
                            className="mt-1"
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={formData.booking_settings.requires_confirmation}
                            onCheckedChange={(checked) => setFormData({
                              ...formData,
                              booking_settings: {
                                ...formData.booking_settings,
                                requires_confirmation: checked
                              }
                            })}
                          />
                          <Label>Requiere confirmación manual</Label>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Notifications Section */}
                {activeSection === 'notifications' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Notificaciones</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">Confirmación por email</h4>
                            <p className="text-sm text-gray-600">Enviar confirmación automática al reservar</p>
                          </div>
                          <Switch
                            checked={formData.notification_settings.email_confirmation}
                            onCheckedChange={(checked) => setFormData({
                              ...formData,
                              notification_settings: {
                                ...formData.notification_settings,
                                email_confirmation: checked
                              }
                            })}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">Recordatorio 24 horas</h4>
                            <p className="text-sm text-gray-600">Enviar recordatorio 1 día antes</p>
                          </div>
                          <Switch
                            checked={formData.notification_settings.email_reminder_24h}
                            onCheckedChange={(checked) => setFormData({
                              ...formData,
                              notification_settings: {
                                ...formData.notification_settings,
                                email_reminder_24h: checked
                              }
                            })}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">Recordatorio 1 hora</h4>
                            <p className="text-sm text-gray-600">Enviar recordatorio 1 hora antes</p>
                          </div>
                          <Switch
                            checked={formData.notification_settings.email_reminder_1h}
                            onCheckedChange={(checked) => setFormData({
                              ...formData,
                              notification_settings: {
                                ...formData.notification_settings,
                                email_reminder_1h: checked
                              }
                            })}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">Notificaciones al host</h4>
                            <p className="text-sm text-gray-600">Recibir notificaciones de nuevas reservas</p>
                          </div>
                          <Switch
                            checked={formData.notification_settings.host_notifications}
                            onCheckedChange={(checked) => setFormData({
                              ...formData,
                              notification_settings: {
                                ...formData.notification_settings,
                                host_notifications: checked
                              }
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  Video,
  MapPin,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { es } from "date-fns/locale";

export default function CalendarView({ eventTypes, bookings, creator }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getBookingsForDate = (date) => {
    return bookings.filter(booking => 
      isSameDay(new Date(booking.scheduled_at), date)
    );
  };

  const getEventTypeById = (eventTypeId) => {
    return eventTypes.find(et => et.id === eventTypeId);
  };

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Vista de Calendario</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={previousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-lg font-semibold min-w-[200px] text-center">
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </h3>
          <Button variant="outline" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              {/* Calendar Header */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {/* Padding for first week */}
                {Array(monthStart.getDay()).fill(null).map((_, index) => (
                  <div key={index} className="p-2 h-24"></div>
                ))}
                
                {/* Month days */}
                {monthDays.map(day => {
                  const dayBookings = getBookingsForDate(day);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isToday = isSameDay(day, new Date());
                  
                  return (
                    <motion.div
                      key={day.toISOString()}
                      whileHover={{ scale: 1.02 }}
                      className={`p-2 h-24 border border-gray-200 rounded-lg cursor-pointer transition-all ${
                        isSelected ? 'bg-blue-50 border-blue-300' : 
                        isToday ? 'bg-yellow-50 border-yellow-300' : 
                        'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {format(day, 'd')}
                      </div>
                      <div className="space-y-1">
                        {dayBookings.slice(0, 2).map(booking => {
                          const eventType = getEventTypeById(booking.event_type_id);
                          return (
                            <div
                              key={booking.id}
                              className="text-xs p-1 rounded truncate"
                              style={{ 
                                backgroundColor: eventType?.color + '20',
                                color: eventType?.color || '#3B82F6'
                              }}
                            >
                              {format(new Date(booking.scheduled_at), 'HH:mm')} - {booking.attendee_name}
                            </div>
                          );
                        })}
                        {dayBookings.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayBookings.length - 2} más
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Details */}
          {selectedDate && (
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  {format(selectedDate, 'EEEE, d MMMM', { locale: es })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDateBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No hay reuniones programadas</p>
                    <p className="text-gray-500 text-sm">para este día</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDateBookings.map(booking => {
                      const eventType = getEventTypeById(booking.event_type_id);
                      return (
                        <div
                          key={booking.id}
                          className="p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {booking.attendee_name}
                              </h4>
                              <p className="text-sm text-gray-600">{eventType?.title}</p>
                            </div>
                            <Badge
                              variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                            >
                              {booking.status === 'confirmed' ? 'Confirmada' : booking.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              <span>
                                {format(new Date(booking.scheduled_at), 'HH:mm')} - 
                                {format(new Date(new Date(booking.scheduled_at).getTime() + booking.duration * 60000), 'HH:mm')}
                              </span>
                            </div>
                            
                            {eventType?.location_type && (
                              <div className="flex items-center gap-2">
                                {eventType.location_type === 'zoom' && <Video className="w-3 h-3" />}
                                {eventType.location_type === 'in_person' && <MapPin className="w-3 h-3" />}
                                <span className="capitalize">
                                  {eventType.location_type === 'zoom' ? 'Zoom' :
                                   eventType.location_type === 'google_meet' ? 'Google Meet' :
                                   eventType.location_type === 'teams' ? 'Teams' :
                                   eventType.location_type === 'phone' ? 'Teléfono' :
                                   eventType.location_type === 'in_person' ? 'Presencial' :
                                   'Personalizado'}
                                </span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2">
                              <Users className="w-3 h-3" />
                              <span>{booking.attendee_email}</span>
                            </div>
                          </div>

                          {booking.meeting_link && (
                            <div className="mt-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(booking.meeting_link, '_blank')}
                                className="w-full"
                              >
                                <Video className="w-3 h-3 mr-2" />
                                Unirse a la reunión
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Event Types Summary */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Tipos de Eventos Activos</CardTitle>
            </CardHeader>
            <CardContent>
              {eventTypes.filter(et => et.is_active).length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-600">No hay eventos activos</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {eventTypes.filter(et => et.is_active).map(eventType => (
                    <div key={eventType.id} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: eventType.color || '#3B82F6' }}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {eventType.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {eventType.duration} min
                          {eventType.price > 0 && ` • $${eventType.price}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Resumen del Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total de reuniones</span>
                  <span className="font-semibold text-gray-900">
                    {bookings.filter(b => 
                      isSameMonth(new Date(b.scheduled_at), currentDate)
                    ).length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Confirmadas</span>
                  <span className="font-semibold text-green-600">
                    {bookings.filter(b => 
                      isSameMonth(new Date(b.scheduled_at), currentDate) && 
                      b.status === 'confirmed'
                    ).length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completadas</span>
                  <span className="font-semibold text-blue-600">
                    {bookings.filter(b => 
                      isSameMonth(new Date(b.scheduled_at), currentDate) && 
                      b.status === 'completed'
                    ).length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Horas programadas</span>
                  <span className="font-semibold text-gray-900">
                    {Math.round(
                      bookings
                        .filter(b => isSameMonth(new Date(b.scheduled_at), currentDate))
                        .reduce((total, b) => total + b.duration, 0) / 60
                    )}h
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
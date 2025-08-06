import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, isWithinInterval, addDays } from "date-fns";
import { es } from "date-fns/locale";

const StatCard = ({ title, value, subtitle, icon: Icon, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function CalendarStats({ eventTypes, bookings, creator }) {
  const activeEventTypes = eventTypes.filter(et => et.is_active);
  
  // Calcular estadísticas del mes actual
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const monthlyBookings = bookings.filter(booking => 
    isWithinInterval(new Date(booking.scheduled_at), { start: monthStart, end: monthEnd })
  );

  const confirmedBookings = monthlyBookings.filter(b => b.status === 'confirmed');
  const completedBookings = monthlyBookings.filter(b => b.status === 'completed');
  const cancelledBookings = monthlyBookings.filter(b => b.status === 'cancelled');

  // Próximas reuniones (próximos 7 días)
  const upcomingBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.scheduled_at);
    const nextWeek = addDays(new Date(), 7);
    return booking.status === 'confirmed' && 
           bookingDate >= new Date() && 
           bookingDate <= nextWeek;
  }).sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));

  return (
    <div className="space-y-8">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tipos de Eventos"
          value={activeEventTypes.length}
          subtitle={`${eventTypes.length - activeEventTypes.length} pausados`}
          icon={CalendarIcon}
          color="from-blue-500 to-blue-600"
          delay={0.1}
        />
        
        <StatCard
          title="Reuniones este mes"
          value={monthlyBookings.length}
          subtitle={`${confirmedBookings.length} confirmadas`}
          icon={Users}
          color="from-green-500 to-green-600"
          delay={0.2}
        />
        
        <StatCard
          title="Horas programadas"
          value={Math.round(monthlyBookings.reduce((total, booking) => total + booking.duration, 0) / 60)}
          subtitle="Este mes"
          icon={Clock}
          color="from-purple-500 to-purple-600"
          delay={0.3}
        />
        
        <StatCard
          title="Tasa de asistencia"
          value={monthlyBookings.length > 0 ? `${Math.round((completedBookings.length / monthlyBookings.length) * 100)}%` : '0%'}
          subtitle={`${completedBookings.length} completadas`}
          icon={TrendingUp}
          color="from-orange-500 to-orange-600"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Próximas reuniones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Próximas Reuniones
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No hay reuniones programadas</p>
                  <p className="text-gray-500 text-sm">Las próximas aparecerán aquí</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.slice(0, 5).map((booking, index) => {
                    const eventType = eventTypes.find(et => et.id === booking.event_type_id);
                    return (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: eventType?.color || '#3B82F6' }}
                          ></div>
                          <div>
                            <p className="font-medium text-gray-900">{booking.attendee_name}</p>
                            <p className="text-sm text-gray-600">{eventType?.title}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {format(new Date(booking.scheduled_at), 'MMM d', { locale: es })}
                          </p>
                          <p className="text-xs text-gray-600">
                            {format(new Date(booking.scheduled_at), 'HH:mm')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Estado de reuniones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Estado de Reuniones - {format(currentMonth, 'MMMM yyyy', { locale: es })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Completadas</p>
                      <p className="text-sm text-green-700">Reuniones exitosas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-900">{completedBookings.length}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Confirmadas</p>
                      <p className="text-sm text-blue-700">Pendientes de realizar</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-900">{confirmedBookings.length}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-900">Canceladas</p>
                      <p className="text-sm text-red-700">No se realizaron</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-900">{cancelledBookings.length}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
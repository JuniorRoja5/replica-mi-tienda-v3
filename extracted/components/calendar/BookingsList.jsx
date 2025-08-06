import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users,
  Search,
  Filter,
  Calendar,
  Clock,
  Video,
  MapPin,
  Mail,
  Phone,
  MoreVertical,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function BookingsList({ bookings, eventTypes, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");

  const getEventTypeById = (eventTypeId) => {
    return eventTypes.find(et => et.id === eventTypeId);
  };

  const getStatusBadgeProps = (status) => {
    switch (status) {
      case 'confirmed':
        return { variant: 'default', className: 'bg-blue-100 text-blue-800' };
      case 'completed':
        return { variant: 'default', className: 'bg-green-100 text-green-800' };
      case 'cancelled':
        return { variant: 'destructive' };
      case 'no_show':
        return { variant: 'secondary', className: 'bg-orange-100 text-orange-800' };
      default:
        return { variant: 'secondary' };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      case 'no_show': return 'No asistió';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  const getLocationIcon = (locationType) => {
    switch (locationType) {
      case 'zoom':
      case 'google_meet':
      case 'teams':
        return <Video className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'in_person':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Video className="w-4 h-4" />;
    }
  };

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter(booking => {
      const matchesSearch = 
        booking.attendee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.attendee_email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.scheduled_at) - new Date(a.scheduled_at);
        case 'date_asc':
          return new Date(a.scheduled_at) - new Date(b.scheduled_at);
        case 'name_asc':
          return a.attendee_name.localeCompare(b.attendee_name);
        case 'name_desc':
          return b.attendee_name.localeCompare(a.attendee_name);
        default:
          return 0;
      }
    });

  if (bookings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No hay reservas aún
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Cuando alguien reserve una reunión contigo, aparecerán aquí todas las citas programadas.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reservas</h2>
          <p className="text-gray-600">Gestiona todas tus citas programadas</p>
        </div>
        <Button onClick={onRefresh} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="confirmed">Confirmadas</SelectItem>
                  <SelectItem value="completed">Completadas</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                  <SelectItem value="no_show">No asistió</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_desc">Fecha (más reciente)</SelectItem>
                  <SelectItem value="date_asc">Fecha (más antigua)</SelectItem>
                  <SelectItem value="name_asc">Nombre (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Nombre (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking, index) => {
          const eventType = getEventTypeById(booking.event_type_id);
          const statusProps = getStatusBadgeProps(booking.status);
          
          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-white border border-gray-200 hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: eventType?.color || '#3B82F6' }}
                          ></div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {booking.attendee_name}
                            </h3>
                            <p className="text-gray-600">{eventType?.title}</p>
                          </div>
                        </div>
                        <Badge {...statusProps}>
                          {getStatusLabel(booking.status)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(new Date(booking.scheduled_at), 'PPP', { locale: es })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>
                            {format(new Date(booking.scheduled_at), 'HH:mm')} 
                            ({booking.duration} min)
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          {getLocationIcon(eventType?.location_type)}
                          <span className="capitalize">
                            {eventType?.location_type === 'zoom' ? 'Zoom' :
                             eventType?.location_type === 'google_meet' ? 'Google Meet' :
                             eventType?.location_type === 'teams' ? 'Teams' :
                             eventType?.location_type === 'phone' ? 'Teléfono' :
                             eventType?.location_type === 'in_person' ? 'Presencial' :
                             'Personalizado'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{booking.attendee_email}</span>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Notas:</strong> {booking.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {booking.meeting_link && booking.status === 'confirmed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(booking.meeting_link, '_blank')}
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Unirse
                        </Button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {booking.status === 'confirmed' && (
                            <DropdownMenuItem>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Marcar como completada
                            </DropdownMenuItem>
                          )}
                          {booking.status === 'confirmed' && (
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancelar reunión
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            Enviar recordatorio
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredBookings.length === 0 && bookings.length > 0 && (
        <Card className="bg-white shadow-sm">
          <CardContent className="p-12 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No se encontraron reservas que coincidan con los filtros.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
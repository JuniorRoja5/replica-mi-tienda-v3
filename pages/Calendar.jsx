import React, { useState, useEffect } from "react";
import { Creator, EventType, Booking, User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon,
  Plus,
  Settings,
  Clock,
  Users,
  Video,
  Link as LinkIcon,
  BarChart3,
  Globe,
  Copy,
  Check,
  Edit,
  Trash2,
  ExternalLink,
  Play,
  Pause
} from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";
import EventTypesList from "../components/calendar/EventTypesList";
import EventTypeForm from "../components/calendar/EventTypeForm";
import CalendarView from "../components/calendar/CalendarView";
import IntegrationsPanel from "../components/calendar/IntegrationsPanel";
import BookingsList from "../components/calendar/BookingsList";
import CalendarStats from "../components/calendar/CalendarStats";

export default function Calendar() {
  const [creator, setCreator] = useState(null);
  const [eventTypes, setEventTypes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await User.me();
      const creators = await Creator.filter({ created_by: user.email });
      
      if (creators.length > 0) {
        const currentCreator = creators[0];
        setCreator(currentCreator);
        
        const [userEventTypes, userBookings] = await Promise.all([
          EventType.filter({ creator_id: currentCreator.id }),
          Booking.filter({ creator_id: currentCreator.id })
        ]);
        
        setEventTypes(userEventTypes);
        setBookings(userBookings);
      }
    } catch (error) {
      console.error("Error loading calendar data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (eventType) => {
    setEditingEvent(eventType);
    setShowEventForm(true);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      if (editingEvent) {
        await EventType.update(editingEvent.id, eventData);
      } else {
        const dataWithCreator = {
          ...eventData,
          creator_id: creator.id
        };
        await EventType.create(dataWithCreator);
      }
      
      setShowEventForm(false);
      setEditingEvent(null);
      loadData();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await EventType.delete(eventId);
      loadData();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleToggleEventStatus = async (eventId, isActive) => {
    try {
      await EventType.update(eventId, { is_active: !isActive });
      loadData();
    } catch (error) {
      console.error("Error toggling event status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-2xl animate-pulse shadow-sm" />
          ))}
        </div>
      </div>
    );
  }

  if (showEventForm) {
    return (
      <EventTypeForm
        eventType={editingEvent}
        onSave={handleSaveEvent}
        onCancel={() => {
          setShowEventForm(false);
          setEditingEvent(null);
        }}
        creator={creator}
      />
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Calendario</h1>
          <p className="text-gray-600 text-lg">Gestiona tus eventos, disponibilidad y reservas</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setActiveTab("integrations")}
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurar
          </Button>
          <Button onClick={handleCreateEvent} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Evento
          </Button>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-gray-100 p-1 rounded-xl">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Resumen</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Mis Eventos</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Calendario</span>
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Reservas</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Integraciones</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <CalendarStats 
            eventTypes={eventTypes}
            bookings={bookings}
            creator={creator}
          />
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <EventTypesList
            eventTypes={eventTypes}
            creator={creator}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
            onToggleStatus={handleToggleEventStatus}
            onCreate={handleCreateEvent}
          />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <CalendarView
            eventTypes={eventTypes}
            bookings={bookings}
            creator={creator}
          />
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <BookingsList
            bookings={bookings}
            eventTypes={eventTypes}
            onRefresh={loadData}
          />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <IntegrationsPanel
            creator={creator}
            onUpdate={loadData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
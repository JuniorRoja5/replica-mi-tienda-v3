import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Mail, BarChart2, Users, Edit, MoreVertical, Clock, Play, Pause, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SequenceCard = ({ sequence, onEdit, onViewStats, onToggleStatus, index }) => {
  const getTriggerText = (seq) => {
    switch (seq.trigger_type) {
      case 'product_purchase':
        return `Compra de producto`;
      case 'list_signup':
        return 'Suscripción a lista';
      case 'manual':
        return 'Activación manual';
      default:
        return 'Desconocido';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            {/* Main Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{sequence.name}</h3>
                   <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    <span>Activador: {getTriggerText(sequence)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-6 text-center">
              <div>
                <p className="text-xl font-bold text-gray-800">{sequence.email_count}</p>
                <p className="text-xs text-gray-500">Emails</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">{sequence.subscriber_count}</p>
                <p className="text-xs text-gray-500">Inscritos</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Badge variant={sequence.status === 'active' ? 'default' : 'secondary'} className={sequence.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {sequence.status === 'active' ? 'Activa' : sequence.status === 'paused' ? 'Pausada' : 'Borrador'}
                </Badge>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2 justify-end">
               <Switch
                checked={sequence.status === 'active'}
                onCheckedChange={(checked) => onToggleStatus(sequence.id, checked)}
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-200"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(sequence)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Editar Secuencia</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onViewStats(sequence)}>
                    <BarChart2 className="mr-2 h-4 w-4" />
                    <span>Ver Estadísticas</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Ver Inscritos</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
            Última modificación: {formatDistanceToNow(new Date(sequence.updated_date), { addSuffix: true, locale: es })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function SequencesList({ sequences, onEdit, onViewStats }) {

  const handleToggleStatus = (sequenceId, isActive) => {
    // Lógica para cambiar el estado (mock)
    console.log(`Toggling sequence ${sequenceId} to ${isActive ? 'active' : 'paused'}`);
  };

  if (sequences.length === 0) {
    return (
      <div className="text-center py-20">
        <Mail className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-xl font-semibold text-gray-900">No tienes secuencias</h3>
        <p className="mt-1 text-sm text-gray-500">Crea tu primera secuencia de emails para empezar a automatizar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sequences.map((sequence, index) => (
        <SequenceCard 
          key={sequence.id} 
          sequence={sequence} 
          onEdit={onEdit} 
          onViewStats={onViewStats}
          onToggleStatus={handleToggleStatus}
          index={index}
        />
      ))}
    </div>
  );
}
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import { Edit, Trash2, MoreVertical, Play, Pause, Zap } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AutomationsList({ automations, onEdit, onDelete, onToggleStatus }) {
  if (automations.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
        <Zap className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-2 text-xl font-semibold text-gray-900">Aún no tienes automatizaciones</h3>
        <p className="mt-1 text-sm text-gray-500">Crea tu primera automatización para empezar a responder comentarios.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {automations.map((auto, index) => (
        <motion.div
          key={auto.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <img src={auto.instagram_post_thumbnail_url} alt="Post" className="w-16 h-16 rounded-md object-cover" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{auto.name}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {auto.keywords.map(kw => (
                      <Badge key={kw} variant="secondary">{kw}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div>
                    <p className="font-medium text-center">{auto.trigger_count}</p>
                    <p className="text-xs">Activaciones</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                 <Switch
                  checked={auto.status === 'active'}
                  onCheckedChange={(checked) => onToggleStatus(auto.id, checked ? 'active' : 'paused')}
                  className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-200"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(auto)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(auto.id)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Eliminar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
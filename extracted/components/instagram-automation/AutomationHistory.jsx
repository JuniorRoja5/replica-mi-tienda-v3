import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AutomationHistory({ logs }) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Comentario</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan="4" className="text-center h-24">
                  No hay historial de activaciones todavía.
                </TableCell>
              </TableRow>
            ) : (
              logs.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.commenter_username}</TableCell>
                  <TableCell>"{log.comment_text}"</TableCell>
                  <TableCell>{format(new Date(log.created_date), "d MMM yyyy, HH:mm", { locale: es })}</TableCell>
                  <TableCell className="text-right">
                    <Badge className={log.status === 'processed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {log.status === 'processed' ? 'Procesado' : 'Fallido'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
         <p className="text-xs text-gray-500 p-4">// TODO: Implementar paginación y filtros para el historial.</p>
      </CardContent>
    </Card>
  );
}
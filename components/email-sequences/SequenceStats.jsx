import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart2, Users, Send, CheckCircle, MousePointer, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card className="shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 text-muted-foreground ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

// Mock data para el gráfico
const MOCK_EMAIL_STATS = [
  { name: 'Email 1', open_rate: 85.2, click_rate: 25.4 },
  { name: 'Email 2', open_rate: 72.1, click_rate: 18.9 },
  { name: 'Email 3', open_rate: 65.8, click_rate: 15.2 },
  { name: 'Email 4', open_rate: 58.3, click_rate: 12.1 },
  { name: 'Email 5', open_rate: 52.0, click_rate: 9.8 },
];

export default function SequenceStats({ sequence, onBack }) {
  // Mock data para las tarjetas
  const totalSubscribers = 1258;
  const totalSent = 4820;
  const avgOpenRate = '70.2%';
  const avgClickRate = '18.5%';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Estadísticas de: {sequence.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Inscritos" value={totalSubscribers} icon={Users} color="text-blue-500" />
            <StatCard title="Correos Enviados" value={totalSent} icon={Send} color="text-purple-500" />
            <StatCard title="Tasa de Apertura Prom." value={avgOpenRate} icon={CheckCircle} color="text-green-500" />
            <StatCard title="Tasa de Clics Prom." value={avgClickRate} icon={MousePointer} color="text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rendimiento por Email</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_EMAIL_STATS}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="%" />
                <Tooltip 
                  formatter={(value) => `${value}%`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend />
                <Bar dataKey="open_rate" name="Tasa de Apertura" fill="#3B82F6" />
                <Bar dataKey="click_rate" name="Tasa de Clics" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Destinatarios</CardTitle>
        </CardHeader>
        <CardContent>
            {/* Aquí iría una tabla con la lista de suscriptores, su estado, etc. */}
            <div className="text-center py-10 border-dashed border-2 border-gray-200 rounded-lg">
                <Users className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Lista de destinatarios aparecerá aquí.</p>
            </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
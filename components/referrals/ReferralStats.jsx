import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Target,
  Zap
} from "lucide-react";

const StatCard = ({ title, value, subtitle, icon: Icon, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-200">
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

export default function ReferralStats({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      <StatCard
        title="Este Mes"
        value={stats.thisMonthReferrals}
        subtitle="Nuevos referidos"
        icon={Calendar}
        color="from-blue-500 to-blue-600"
        delay={0.1}
      />
      
      <StatCard
        title="Total Referidos"
        value={stats.totalReferrals}
        subtitle="Desde el inicio"
        icon={Users}
        color="from-purple-500 to-purple-600"
        delay={0.2}
      />
      
      <StatCard
        title="Referidos Activos"
        value={stats.activeReferrals}
        subtitle="Pagando actualmente"
        icon={Zap}
        color="from-green-500 to-green-600"
        delay={0.3}
      />
      
      <StatCard
        title="Ingresos Mensuales"
        value={`$${stats.monthlyProjected.toFixed(0)}`}
        subtitle="Proyectados"
        icon={TrendingUp}
        color="from-yellow-500 to-orange-500"
        delay={0.4}
      />
      
      <StatCard
        title="Total Ganado"
        value={`$${stats.totalEarned.toFixed(0)}`}
        subtitle="Acumulado"
        icon={DollarSign}
        color="from-emerald-500 to-teal-500"
        delay={0.5}
      />
      
      <StatCard
        title="Próximo Nivel"
        value={`${Math.max(0, 15 - stats.activeReferrals)}`}
        subtitle="Referidos faltantes"
        icon={Target}
        color="from-pink-500 to-rose-500"
        delay={0.6}
      />
    </div>
  );
}
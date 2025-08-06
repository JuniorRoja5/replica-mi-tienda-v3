import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users,
  Search,
  Calendar,
  DollarSign,
  TrendingUp,
  Mail,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Filter
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

export default function ReferralsList({ referrals }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'inactive': return <XCircle className="w-4 h-4 text-gray-600" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'pending': return 'Pendiente';
      case 'inactive': return 'Inactivo';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusBadgeProps = (status) => {
    switch (status) {
      case 'active':
        return { className: 'bg-green-100 text-green-800' };
      case 'pending':
        return { className: 'bg-yellow-100 text-yellow-800' };
      case 'inactive':
        return { className: 'bg-gray-100 text-gray-800' };
      case 'cancelled':
        return { variant: 'destructive' };
      default:
        return { variant: 'secondary' };
    }
  };

  // Filter and sort referrals
  const filteredReferrals = referrals
    .filter(referral => {
      const matchesSearch = 
        (referral.referred_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        referral.referred_email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || referral.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.registration_date) - new Date(a.registration_date);
        case 'date_asc':
          return new Date(a.registration_date) - new Date(b.registration_date);
        case 'earnings_desc':
          return (b.total_commission_earned || 0) - (a.total_commission_earned || 0);
        case 'name_asc':
          return (a.referred_name || a.referred_email).localeCompare(b.referred_name || b.referred_email);
        default:
          return 0;
      }
    });

  if (referrals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              ¡Comienza a referir amigos!
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Comparte tu enlace de referidos y comienza a ganar comisiones por cada persona que se una a ClickMyLink.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="bg-white shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Users className="w-5 h-5 text-blue-600" />
            Todos tus Referidos ({referrals.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
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
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_desc">Más reciente</SelectItem>
                  <SelectItem value="date_asc">Más antiguo</SelectItem>
                  <SelectItem value="earnings_desc">Mayor ingreso</SelectItem>
                  <SelectItem value="name_asc">Nombre A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Referrals List */}
          <div className="space-y-4">
            {filteredReferrals.map((referral, index) => (
              <motion.div
                key={referral.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {(referral.referred_name || referral.referred_email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {referral.referred_name || referral.referred_email}
                        </h4>
                        <Badge {...getStatusBadgeProps(referral.status)}>
                          {getStatusLabel(referral.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(new Date(referral.registration_date), 'dd MMM yyyy', { locale: es })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{referral.referred_email}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>
                            ${(referral.total_commission_earned || 0).toFixed(2)} ganados
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {referral.status === 'active' && (
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-600">
                          ${(referral.monthly_commission || 0).toFixed(2)}/mes
                        </p>
                        <p className="text-xs text-gray-500">Comisión mensual</p>
                      </div>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Enviar mensaje
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Ver historial
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredReferrals.length === 0 && referrals.length > 0 && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron referidos que coincidan con los filtros.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
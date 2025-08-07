
import React, { useState, useEffect } from "react";
import { Creator, Order, Product } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  Search, 
  Filter, 
  Calendar,
  Mail,
  Package,
  ExternalLink,
  Copy,
  Check,
  Download,
  CreditCard,
  Settings,
  TrendingUp,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  Wallet
} from "lucide-react";
import { motion } from "framer-motion";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';
import { useLanguage } from "../components/LanguageProvider";
import { createPageUrl } from "@/utils";

export default function Orders() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [creator, setCreator] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const ordersPerPage = 15;

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
        
        const [userOrders, userProducts] = await Promise.all([
          Order.filter({ creator_id: currentCreator.id }),
          Product.filter({ creator_id: currentCreator.id })
        ]);
        
        setOrders(userOrders);
        setProducts(userProducts);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductTitle = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.title : "Producto eliminado";
  };

  // Calcular métricas financieras
  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const availableForWithdraw = totalRevenue * 0.8; // 80% disponible inmediatamente
  const availableSoon = totalRevenue * 0.2; // 20% en proceso

  // Generar datos para gráfico de ingresos acumulados con datos de ejemplo
  const generateRevenueChart = () => {
    // Si no hay órdenes reales, generar datos de ejemplo
    if (orders.length === 0) {
      const exampleData = [];
      const startDate = subDays(new Date(), 7);
      
      let accumulated = 0;
      for (let i = 0; i <= 7; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        // Agregar ingresos simulados aleatorios, garantizando un aumento
        accumulated += Math.floor(Math.random() * 50) + 10; // Smaller increments for more realistic growth
        
        exampleData.push({
          date: format(date, 'MMM dd', { locale: es }),
          revenue: accumulated
        });
      }
      
      return exampleData;
    }
    
    // Lógica original para órdenes reales
    const sortedOrders = [...orders].sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
    let accumulated = 0;
    const data = [];
    
    if (sortedOrders.length > 0) {
      // Add a starting point for the chart before the first order
      const firstOrderDate = new Date(sortedOrders[0].created_date);
      data.push({ date: format(subDays(firstOrderDate, 1), 'MMM dd', { locale: es }), revenue: 0 });
    }
    
    sortedOrders.forEach(order => {
      accumulated += order.amount;
      data.push({
        date: format(new Date(order.created_date), 'MMM dd', { locale: es }),
        revenue: accumulated
      });
    });
    
    return data;
  };

  const revenueChartData = generateRevenueChart();

  // Filtrado de órdenes
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getProductTitle(order.product_id).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    
    const orderDate = new Date(order.created_date);
    let matchesDate = true;
    if (filterDate === "today") {
      matchesDate = format(orderDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    } else if (filterDate === "week") {
      matchesDate = orderDate >= subDays(new Date(), 7);
    } else if (filterDate === "month") {
      matchesDate = orderDate >= startOfMonth(new Date());
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Paginación
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);

  const handleCopyUrl = async () => {
    if (!creator) return;
    const publicUrl = `${window.location.origin}/u/${creator.username}`;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Fecha', 'Cliente', 'Email', 'Producto', 'Monto', 'Estado'];
    const csvData = [
      headers.join(','),
      ...orders.map(order => [
        format(new Date(order.created_date), 'yyyy-MM-dd'),
        `"${order.customer_name.replace(/"/g, '""')}"`, // Handle quotes in names
        order.customer_email,
        `"${getProductTitle(order.product_id).replace(/"/g, '""')}"`, // Handle quotes in product titles
        order.amount,
        order.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ingresos-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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

  return (
    <div className="min-h-screen">
      {/* Mobile Layout - OPTIMIZED */}
      <div className="lg:hidden p-3 space-y-3 max-w-md mx-auto">
        {/* SECCIÓN 1: Header Compacto - TÍTULO ALINEADO A LA IZQUIERDA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2"
        >
          <h1 className="text-lg font-bold text-gray-900 text-left mb-1">Ingresos</h1>
          <p className="text-gray-600 text-xs text-left">Gestiona tus ganancias y retiros</p>
        </motion.div>

        {/* SECCIÓN 2: Total de Ingresos Generados - CON SOMBRA EN GRÁFICA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm">
            <CardHeader className="border-b border-gray-200 pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-gray-900">
                <TrendingUp className="w-4 h-4" />
                Total de Ingresos Generados
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-3">
                <div className="text-2xl font-bold text-gray-900">
                  ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    {orders.length} ventas totales
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Desde el inicio
                  </div>
                </div>
                
                {/* Gráfico compacto CON SOMBRA */}
                <div className="h-32 bg-slate-50 rounded-lg p-2">
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Evolución de Ingresos</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueChartData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 10 }}
                      />
                      <YAxis hide />
                      <Tooltip
                        formatter={(value) => [`$${value.toFixed(2)}`, 'Ingresos']}
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '12px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        fill="url(#colorRevenue)"
                        dot={{ fill: '#3b82f6', strokeWidth: 1, r: 3 }}
                        activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 1 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* SECCIÓN 3: Disponibilidad de Fondos */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          {/* Disponible para Retirar */}
          <Card className="bg-slate-50/80 backdrop-blur-sm border border-gray-200/50 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-xs">Disponible</h3>
                  <p className="text-xs text-gray-600">Para retirar</p>
                </div>
              </div>
              <div className="text-lg font-bold text-gray-900 mb-2">
                ${availableForWithdraw.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 h-8">
                <DollarSign className="w-3 h-3 mr-1" />
                Retirar
              </Button>
            </CardContent>
          </Card>

          {/* Disponible Pronto */}
          <Card className="bg-gray-50/80 backdrop-blur-sm border border-gray-200/50 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-xs">Disponible</h3>
                  <p className="text-xs text-gray-600">Pronto</p>
                </div>
              </div>
              <div className="text-lg font-bold text-gray-900 mb-2">
                ${availableSoon.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <Button variant="outline" className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50 text-xs py-1 h-8">
                <Settings className="w-3 h-3 mr-1" />
                Ver detalles
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* SECCIÓN 4: Historial de Órdenes (existing card, copy as-is) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
            <CardHeader className="border-b border-gray-200 pb-3">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <CardTitle className="text-lg font-bold text-gray-900">Historial de Órdenes</CardTitle>
                <Button
                  onClick={handleExportCSV}
                  variant="outline"
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-4">
              {/* Filtros */}
              <div className="flex flex-col lg:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por cliente, email o producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-gray-200 text-gray-900 text-sm"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm"
                >
                  <option value="all">Todos los Estados</option>
                  <option value="completed">Completado</option>
                  <option value="pending">Pendiente</option>
                  <option value="refunded">Reembolsado</option>
                </select>

                <select
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm"
                >
                  <option value="all">Todas las Fechas</option>
                  <option value="today">Hoy</option>
                  <option value="week">Última Semana</option>
                  <option value="month">Este Mes</option>
                </select>
              </div>

              {/* Tabla de Órdenes */}
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {orders.length === 0 ? "No hay órdenes aún" : "No se encontraron órdenes"}
                  </h3>
                  <p className="text-gray-600">
                    {orders.length === 0 
                      ? "Tus primeras ventas aparecerán aquí" 
                      : "Intenta ajustar los filtros de búsqueda"
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Header de tabla (solo desktop) */}
                  <div className="hidden lg:grid lg:grid-cols-7 gap-4 py-3 px-4 bg-slate-50 rounded-lg text-sm font-medium text-gray-700">
                    <div>Fecha</div>
                    <div>Cliente</div>
                    <div>Producto</div>
                    <div>Email</div>
                    <div>Monto</div>
                    <div>Estado</div>
                    <div>Acciones</div>
                  </div>

                  {/* Filas de órdenes */}
                  {paginatedOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="lg:grid lg:grid-cols-7 gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200"
                    >
                      {/* Mobile Layout */}
                      <div className="lg:hidden space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">{order.customer_name}</h4>
                            <p className="text-gray-600 text-sm">{order.customer_email}</p>
                          </div>
                          <Badge 
                            className={
                              order.status === "completed" 
                                ? "bg-green-100 text-green-800 border-green-200"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            }
                          >
                            {order.status === "completed" && "Completado"}
                            {order.status === "pending" && "Pendiente"}
                            {order.status === "refunded" && "Reembolsado"}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600">{getProductTitle(order.product_id)}</p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(order.created_date), "dd/MM/yyyy HH:mm")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900 text-lg">${order.amount.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden lg:contents">
                        <div className="text-sm text-gray-600">
                          {format(new Date(order.created_date), "dd/MM/yyyy")}
                        </div>
                        <div className="font-medium text-gray-900">{order.customer_name}</div>
                        <div className="text-sm text-gray-600 truncate">{getProductTitle(order.product_id)}</div>
                        <div className="text-sm text-gray-600">{order.customer_email}</div>
                        <div className="font-bold text-gray-900">${order.amount.toFixed(2)}</div>
                        <div>
                          <Badge 
                            className={
                              order.status === "completed" 
                                ? "bg-green-100 text-green-800 border-green-200"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            }
                          >
                            {order.status === "completed" && "Completado"}
                            {order.status === "pending" && "Pendiente"}
                            {order.status === "refunded" && "Reembolsado"}
                          </Badge>
                        </div>
                        <div>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Mostrando {startIndex + 1} a {Math.min(startIndex + ordersPerPage, filteredOrders.length)} de {filteredOrders.length} órdenes
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                      Página {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Desktop Layout - CON SOMBRA EN GRÁFICA, TÍTULO SIN CAMBIOS */}
      <div className="hidden lg:block p-4 lg:p-6 space-y-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* SECCIÓN 1: Header y Resumen de Ingresos */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            {/* Header con Logo y Acciones */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Ingresos</h1>
                <p className="text-gray-600">Gestiona tus ganancias y retiros</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(createPageUrl('PublicProfile'), '_blank')}
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver Perfil Público
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyUrl}
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "¡Copiado!" : "Copiar URL"}
                </Button>
              </div>
            </div>

            {/* Total de Ingresos y Gráfico CON SOMBRA */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
              <CardHeader className="border-b border-gray-200 pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                  <TrendingUp className="w-5 h-5" />
                  Total de Ingresos Generados
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="text-3xl lg:text-4xl font-bold text-gray-900">
                      ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {orders.length} ventas totales
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Desde el inicio
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-48 bg-slate-50 rounded-xl p-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Evolución de Ingresos Acumulados</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueChartData}>
                        <defs>
                          <linearGradient id="colorRevenueDesktop" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="date" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <YAxis hide />
                        <Tooltip
                          formatter={(value) => [`$${value.toFixed(2)}`, 'Ingresos']}
                          labelStyle={{ color: '#374151' }}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          fill="url(#colorRevenueDesktop)"
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* SECCIÓN 2: Disponibilidad de Fondos */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Disponible para Retirar */}
              <Card className="bg-slate-50/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">Disponible para Retirar</h3>
                        <p className="text-xs text-gray-600">Listo para transferir</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-3">
                    ${availableForWithdraw.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Retirar Dinero
                  </Button>
                </CardContent>
              </Card>

              {/* Disponible Pronto */}
              <Card className="bg-gray-50/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">Disponible Pronto</h3>
                        <p className="text-xs text-gray-600">En proceso de liberación</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-3">
                    ${availableSoon.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <Button variant="outline" className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50 text-sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configuración
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* SECCIÓN 3: Historial de Órdenes */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
              <CardHeader className="border-b border-gray-200 pb-3">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <CardTitle className="text-lg font-bold text-gray-900">Historial de Órdenes</CardTitle>
                  <Button
                    onClick={handleExportCSV}
                    variant="outline"
                    className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                {/* Filtros */}
                <div className="flex flex-col lg:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por cliente, email o producto..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white border-gray-200 text-gray-900 text-sm"
                    />
                  </div>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm"
                  >
                    <option value="all">Todos los Estados</option>
                    <option value="completed">Completado</option>
                    <option value="pending">Pendiente</option>
                    <option value="refunded">Reembolsado</option>
                  </select>

                  <select
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm"
                  >
                    <option value="all">Todas las Fechas</option>
                    <option value="today">Hoy</option>
                    <option value="week">Última Semana</option>
                    <option value="month">Este Mes</option>
                  </select>
                </div>

                {/* Tabla de Órdenes */}
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {orders.length === 0 ? "No hay órdenes aún" : "No se encontraron órdenes"}
                    </h3>
                    <p className="text-gray-600">
                      {orders.length === 0 
                        ? "Tus primeras ventas aparecerán aquí" 
                        : "Intenta ajustar los filtros de búsqueda"
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Header de tabla (solo desktop) */}
                    <div className="hidden lg:grid lg:grid-cols-7 gap-4 py-3 px-4 bg-slate-50 rounded-lg text-sm font-medium text-gray-700">
                      <div>Fecha</div>
                      <div>Cliente</div>
                      <div>Producto</div>
                      <div>Email</div>
                      <div>Monto</div>
                      <div>Estado</div>
                      <div>Acciones</div>
                    </div>

                    {/* Filas de órdenes */}
                    {paginatedOrders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="lg:grid lg:grid-cols-7 gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200"
                      >
                        {/* Mobile Layout */}
                        <div className="lg:hidden space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">{order.customer_name}</h4>
                              <p className="text-gray-600 text-sm">{order.customer_email}</p>
                            </div>
                            <Badge 
                              className={
                                order.status === "completed" 
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                  : "bg-red-100 text-red-800 border-red-200"
                              }
                            >
                              {order.status === "completed" && "Completado"}
                              {order.status === "pending" && "Pendiente"}
                              {order.status === "refunded" && "Reembolsado"}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-gray-600">{getProductTitle(order.product_id)}</p>
                              <p className="text-xs text-gray-500">
                                {format(new Date(order.created_date), "dd/MM/yyyy HH:mm")}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900 text-lg">${order.amount.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden lg:contents">
                          <div className="text-sm text-gray-600">
                            {format(new Date(order.created_date), "dd/MM/yyyy")}
                          </div>
                          <div className="font-medium text-gray-900">{order.customer_name}</div>
                          <div className="text-sm text-gray-600 truncate">{getProductTitle(order.product_id)}</div>
                          <div className="text-sm text-gray-600">{order.customer_email}</div>
                          <div className="font-bold text-gray-900">${order.amount.toFixed(2)}</div>
                          <div>
                            <Badge 
                              className={
                                order.status === "completed" 
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                  : "bg-red-100 text-red-800 border-red-200"
                              }
                            >
                              {order.status === "completed" && "Completado"}
                              {order.status === "pending" && "Pendiente"}
                              {order.status === "refunded" && "Reembolsado"}
                            </Badge>
                          </div>
                          <div>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Mostrando {startIndex + 1} a {Math.min(startIndex + ordersPerPage, filteredOrders.length)} de {filteredOrders.length} órdenes
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="px-4 py-2 text-sm text-gray-700">
                        Página {currentPage} de {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


import React, { useState, useEffect } from "react";
import { Creator, Product, Order, User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  MousePointer, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Download,
  ChevronDown,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ExternalLink,
  Package,
  Link as LinkIcon,
  BarChart3,
  Users,
  MapPin,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Statistics() {
  const [creator, setCreator] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7D');
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 7),
    to: new Date()
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [tempDateRange, setTempDateRange] = useState(undefined);

  // Mock data - en una aplicación real vendría de analytics
  const [analyticsData, setAnalyticsData] = useState({
    views: 0,
    clicks: 0,
    sales: 0,
    conversionRate: 0,
    dailyData: [],
    productStats: [],
    trafficSources: [],
    geoData: [],
    deviceData: []
  });

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    try {
      const user = await User.me();
      const creators = await Creator.filter({ created_by: user.email });

      if (creators.length > 0) {
        const currentCreator = creators[0];
        setCreator(currentCreator);

        const [userProducts, userOrders] = await Promise.all([
          Product.filter({ creator_id: currentCreator.id }),
          Order.filter({ creator_id: currentCreator.id })
        ]);

        setProducts(userProducts);
        setOrders(userOrders);

        // Generar datos de analytics simulados
        generateMockAnalytics(userProducts, userOrders);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockAnalytics = (products, orders) => {
    // Generar datos diarios
    const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
    const dailyData = days.map(day => {
      const dayStr = format(day, 'MMM dd', { locale: es });
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.created_date);
        return format(orderDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
      });

      const views = Math.floor(Math.random() * 200) + 50;
      const clicks = Math.floor(Math.random() * 80) + 20;
      const sales = dayOrders.length;

      return {
        date: dayStr,
        views,
        clicks,
        sales
      };
    });

    // Estadísticas por producto con datos más detallados
    const productStats = products.map(product => {
      const productOrders = orders.filter(o => o.product_id === product.id);
      const views = Math.floor(Math.random() * 500) + 100; // Simulated views for the product page
      const clicks = Math.floor(views * (0.3 + Math.random() * 0.2)); // Simulated clicks on the product link/image
      const sales = productOrders.length;
      // Note: Assuming order.amount exists and is a number for revenue calculation
      const revenue = productOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
      const conversionRateForExistingCard = clicks > 0 ? ((sales / clicks) * 100).toFixed(1) : '0.0'; // Based on clicks for existing 'Rendimiento por Contenido'
      const conversionRateForNewTable = views > 0 ? ((sales / views) * 100).toFixed(1) : '0.0'; // Based on views for new table

      return {
        id: product.id,
        title: product.title,
        type: product.type,
        image_url: product.image_url,
        price: product.price || 0, // Keeping this if product entity has it
        views: views,
        clicks: clicks,
        sales: sales,
        revenue: revenue,
        conversionRate: conversionRateForExistingCard, // Used by the existing "Rendimiento por Contenido" card
        conversionRateFromViews: conversionRateForNewTable // Used by the new "Resumen de Productos" table
      };
    }).sort((a, b) => b.revenue - a.revenue); // Order by revenue

    // Fuentes de tráfico
    const trafficSources = [
      { name: 'Instagram', clicks: Math.floor(Math.random() * 500) + 200, conversions: Math.floor(Math.random() * 20) + 5, color: '#E1306C' },
      { name: 'TikTok', clicks: Math.floor(Math.random() * 400) + 150, conversions: Math.floor(Math.random() * 15) + 3, color: '#000000' },
      { name: 'Directo', clicks: Math.floor(Math.random() * 300) + 100, conversions: Math.floor(Math.random() * 12) + 2, color: '#6B7280' },
      { name: 'Google', clicks: Math.floor(Math.random() * 200) + 80, conversions: Math.floor(Math.random() * 8) + 1, color: '#4285F4' },
      { name: 'YouTube', clicks: Math.floor(Math.random() * 150) + 50, conversions: Math.floor(Math.random() * 5) + 1, color: '#FF0000' },
    ].map(source => ({
      ...source,
      conversionRate: ((source.conversions / source.clicks) * 100).toFixed(1)
    })).sort((a, b) => b.clicks - a.clicks);

    // Datos geográficos
    const geoData = [
      { country: 'México', clicks: Math.floor(Math.random() * 400) + 200, conversions: Math.floor(Math.random() * 15) + 5 },
      { country: 'España', clicks: Math.floor(Math.random() * 300) + 150, conversions: Math.floor(Math.random() * 12) + 3 },
      { country: 'Argentina', clicks: Math.floor(Math.random() * 250) + 100, conversions: Math.floor(Math.random() * 10) + 2 },
      { country: 'Colombia', clicks: Math.floor(Math.random() * 200) + 80, conversions: Math.floor(Math.random() * 8) + 1 },
      { country: 'Chile', clicks: Math.floor(Math.random() * 150) + 60, conversions: Math.floor(Math.random() * 6) + 1 },
    ].map(geo => ({
      ...geo,
      conversionRate: ((geo.conversions / geo.clicks) * 100).toFixed(1)
    })).sort((a, b) => b.clicks - a.clicks);

    // Datos de dispositivos
    const allClicks = dailyData.reduce((sum, day) => sum + day.clicks, 0); // Renamed to allClicks
    const deviceData = [
      { device: 'Móvil', clicks: Math.floor(allClicks * 0.7), icon: Smartphone, color: '#10B981' },
      { device: 'Escritorio', clicks: Math.floor(allClicks * 0.25), icon: Monitor, color: '#3B82F6' },
      { device: 'Tablet', clicks: Math.floor(allClicks * 0.05), icon: Tablet, color: '#8B5CF6' },
    ].map(device => ({
      ...device,
      percentage: ((device.clicks / allClicks) * 100).toFixed(1),
      conversions: Math.floor(device.clicks * 0.05),
      conversionRate: '5.0'
    }));

    const totalViews = dailyData.reduce((sum, day) => sum + day.views, 0);
    const totalClicks = dailyData.reduce((sum, day) => sum + day.clicks, 0);
    const totalSales = orders.length;
    const conversionRate = totalClicks > 0 ? ((totalSales / totalClicks) * 100).toFixed(1) : 0;

    setAnalyticsData({
      views: totalViews,
      clicks: totalClicks,
      sales: totalSales,
      conversionRate,
      dailyData,
      productStats,
      trafficSources,
      geoData,
      deviceData
    });
  };

  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
    const now = new Date();

    switch(period) {
      case '7D':
        setDateRange({ from: subDays(now, 7), to: now });
        break;
      case '14D':
        setDateRange({ from: subDays(now, 14), to: now });
        break;
      case 'month':
        setDateRange({ from: startOfMonth(now), to: now });
        break;
    }
    setShowCalendar(false);
  };

  const handleOpenCalendar = () => {
    setTempDateRange({ from: dateRange.from, to: dateRange.to });
    setShowCalendar(true);
  };

  const handleCalendarSelect = (range) => {
    setTempDateRange(range);
  };

  const handleApplyDateRange = () => {
    if (tempDateRange?.from && tempDateRange?.to) {
      setDateRange(tempDateRange);
      setSelectedPeriod('custom');
      setShowCalendar(false);
      setTempDateRange(undefined);
    }
  };

  const handleCancelCalendar = () => {
    setShowCalendar(false);
    setTempDateRange(undefined);
  };

  const getCustomRangeLabel = () => {
    if (selectedPeriod === 'custom' && dateRange.from && dateRange.to) {
      const fromStr = format(dateRange.from, 'd MMM', { locale: es });
      const toStr = format(dateRange.to, 'd MMM', { locale: es });
      return `${fromStr} – ${toStr}`;
    }
    return 'Personalizado';
  };

  const exportToCSV = () => {
    const csvData = [
      ['Fecha', 'Visualizaciones', 'Clics', 'Ventas'],
      ...analyticsData.dailyData.map(day => [day.date, day.views, day.clicks, day.sales])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estadisticas-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Calendar Modal */}
      <AnimatePresence>
        {showCalendar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCancelCalendar}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Seleccionar rango de fechas</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancelCalendar}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-4">
                <CalendarComponent
                  mode="range"
                  selected={tempDateRange}
                  onSelect={handleCalendarSelect}
                  numberOfMonths={1}
                  className="w-full"
                  locale={es}
                  classNames={{
                    months: "space-y-4",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center text-gray-900",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-md hover:bg-gray-200 transition-colors",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-gray-600 rounded-md w-8 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: "text-center text-sm relative p-0 focus-within:relative focus-within:z-20",
                    day: "h-8 w-8 p-0 font-normal text-gray-700 hover:bg-blue-100 rounded-md transition-colors cursor-pointer",
                    day_selected: "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-600 focus:text-white rounded-md font-medium",
                    day_today: "bg-blue-100 text-blue-800 font-medium rounded-md",
                    day_outside: "text-gray-400 opacity-50",
                    day_disabled: "text-gray-300 opacity-30 cursor-not-allowed",
                    day_range_middle: "bg-blue-100 text-blue-800 hover:bg-blue-200 focus:bg-blue-100 focus:text-blue-800 rounded-none",
                    day_range_start: "bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium",
                    day_range_end: "bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium",
                    day_hidden: "invisible",
                  }}
                />
              </div>
              
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancelCalendar}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleApplyDateRange}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  disabled={!tempDateRange?.from || !tempDateRange?.to}
                >
                  Aplicar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Estadísticas</h1>
          <p className="text-gray-600">Analiza el rendimiento de tu perfil y contenido</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={exportToCSV}
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </motion.div>

      {/* Period Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3"
      >
        {['7D', '14D', 'month'].map((period) => (
          <Button
            key={period}
            onClick={() => handlePeriodSelect(period)}
            variant={selectedPeriod === period ? "default" : "outline"}
            className={selectedPeriod === period ? "bg-blue-600 text-white" : ""}
          >
            {period === '7D' && 'Últimos 7 días'}
            {period === '14D' && 'Últimos 14 días'}
            {period === 'month' && 'Este mes'}
          </Button>
        ))}
        <Button
          onClick={handleOpenCalendar}
          variant={selectedPeriod === 'custom' ? "default" : "outline"}
          className={selectedPeriod === 'custom' ? "bg-blue-600 text-white" : ""}
        >
          {getCustomRangeLabel()}
        </Button>
      </motion.div>

      {/* Resumen General */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visualizaciones</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.views.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clics</CardTitle>
            <MousePointer className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.clicks.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.conversionRate}%</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +2.3% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.sales}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +15% vs período anterior
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Gráfico de Actividad */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Actividad Diaria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.dailyData}>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Clics"
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Ventas"
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Rendimiento por Producto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Rendimiento por Contenido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.productStats.slice(0, 5).map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.title} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        product.type === 'link' ?
                          <LinkIcon className="w-5 h-5 text-blue-600" /> :
                          <Package className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{product.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{product.clicks} clics</span>
                        <span>{product.sales} ventas</span>
                        <span>{product.conversionRate}% conversión</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fuentes de Tráfico */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Fuentes de Tráfico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.trafficSources.map((source, index) => {
                  const maxClicks = Math.max(...analyticsData.trafficSources.map(s => s.clicks));
                  const percentage = (source.clicks / maxClicks) * 100;

                  return (
                    <div key={source.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: source.color }}
                          ></div>
                          <span className="font-medium text-gray-900">{source.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{source.clicks}</div>
                          <div className="text-xs text-gray-500">{source.conversionRate}% conv.</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: source.color
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Ubicación Geográfica */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Ubicación Geográfica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.geoData.map((geo, index) => (
                  <div key={geo.country} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {geo.country === 'México' && '🇲🇽'}
                        {geo.country === 'España' && '🇪🇸'}
                        {geo.country === 'Argentina' && '🇦🇷'}
                        {geo.country === 'Colombia' && '🇨🇴'}
                        {geo.country === 'Chile' && '🇨🇱'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{geo.country}</div>
                        <div className="text-sm text-gray-600">{geo.conversionRate}% conversión</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{geo.clicks}</div>
                      <div className="text-sm text-gray-500">{geo.conversions} ventas</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dispositivos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Dispositivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.deviceData.map((device, index) => {
                  const Icon = device.icon;
                  return (
                    <div key={device.device} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: device.color + '20' }}
                      >
                        <Icon className="w-5 h-5" style={{ color: device.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{device.device}</span>
                          <span className="text-sm font-medium">{device.percentage}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{device.clicks} clics</span>
                          <span>{device.conversionRate}% conversión</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${device.percentage}%`,
                              backgroundColor: device.color
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabla de Resumen de Productos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Resumen de Productos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsData.productStats.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">No hay productos aún</h3>
                <p className="text-gray-600">Crea tu primer producto para ver las estadísticas</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Producto</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Vistas</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Órdenes</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Conversión (%)</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.productStats.map((product, index) => (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              {product.image_url ? (
                                <img src={product.image_url} alt={product.title} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                product.type === 'link' ?
                                  <LinkIcon className="w-5 h-5 text-blue-600" /> :
                                  <Package className="w-5 h-5 text-blue-600" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{product.title}</div>
                              <div className="text-sm text-gray-500 capitalize">{product.type}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center font-medium text-gray-900">
                          {product.views.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {product.sales > 0 ? (
                            <span className="font-medium text-gray-900">{product.sales}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {product.sales > 0 ? (
                            <span className="font-medium text-gray-900">{product.conversionRateFromViews}%</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          {product.revenue > 0 ? (
                            <span className="font-bold text-green-600">
                              ${product.revenue.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

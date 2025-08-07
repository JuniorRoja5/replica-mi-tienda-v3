
import React, { useState, useEffect } from "react";
import { Creator, Product, Order } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Eye,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  ChevronDown,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../components/LanguageProvider";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { es } from "date-fns/locale";

export default function Dashboard() {
  const [creator, setCreator] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    revenueChange: 0,
    storeVisits: 0,
    visitsChange: 0,
    leads: 0,
    leadsChange: 0
  });
  const [chartData, setChartData] = useState([]);
  const [animatedDesktopData, setAnimatedDesktopData] = useState([]); // State for desktop chart animation
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7D');
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 7),
    to: new Date()
  });
  const [tempDateRange, setTempDateRange] = useState(undefined); // Cambiado a undefined
  const [showCalendar, setShowCalendar] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    loadData();
  }, [dateRange]);

  // New useEffect for desktop chart animation
  useEffect(() => {
    if (chartData.length > 0) {
      // 1. Set initial state for animation (all bars at zero height)
      const zeroData = chartData.map(d => ({ ...d, visits: 0 }));
      setAnimatedDesktopData(zeroData);

      // 2. After a short delay, set the actual data to trigger the animation
      const timer = setTimeout(() => {
        setAnimatedDesktopData(chartData);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [chartData]);


  const loadData = async () => {
    try {
      const user = await User.me();

      const creators = await Creator.filter({ created_by: user.email });
      let currentCreator = creators[0];

      if (!currentCreator) {
        currentCreator = await Creator.create({
          username: user.email.split('@')[0],
          display_name: user.full_name || 'Creator',
          bio: 'Bienvenido a mi tienda!'
        });
      }

      setCreator(currentCreator);

      const userOrders = await Order.filter({ creator_id: currentCreator.id });
      setOrders(userOrders);

      // Calculate stats for current period
      const currentPeriodOrders = userOrders.filter(order => {
        const orderDate = new Date(order.created_date);
        return orderDate >= dateRange.from && orderDate <= dateRange.to;
      });

      // Calculate previous period for comparison
      const periodLength = Math.ceil((dateRange.to - dateRange.from) / (1000 * 60 * 60 * 24));
      const previousPeriodStart = subDays(dateRange.from, periodLength);
      const previousPeriodEnd = subDays(dateRange.to, periodLength);

      const previousPeriodOrders = userOrders.filter(order => {
        const orderDate = new Date(order.created_date);
        return orderDate >= previousPeriodStart && orderDate <= previousPeriodEnd;
      });

      const currentRevenue = currentPeriodOrders.reduce((sum, order) => sum + order.amount, 0);
      const previousRevenue = previousPeriodOrders.reduce((sum, order) => sum + order.amount, 0);
      const revenueChange = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

      // Generate mock data for visits and leads (in a real app, this would come from analytics)
      const currentVisits = Math.floor(Math.random() * 500) + 100;
      const previousVisits = Math.floor(Math.random() * 400) + 80;
      const visitsChange = previousVisits > 0 ? ((currentVisits - previousVisits) / previousVisits) * 100 : 0;

      const currentLeads = Math.floor(Math.random() * 50) + 10;
      const previousLeads = Math.floor(Math.random() * 40) + 8;
      const leadsChange = previousLeads > 0 ? ((currentLeads - previousLeads) / previousLeads) * 100 : 0;

      setStats({
        totalRevenue: currentRevenue,
        revenueChange,
        storeVisits: currentVisits,
        visitsChange,
        leads: currentLeads,
        leadsChange
      });

      // Generate chart data
      const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
      const chartData = days.map(day => {
        const dayStr = format(day, 'MMM dd', { locale: es });
        const dayOrders = currentPeriodOrders.filter(order => {
          const orderDate = new Date(order.created_date);
          return format(orderDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
        });

        // Mock visits data based on orders (in real app, this would be actual analytics)
        const visits = dayOrders.length > 0 ? dayOrders.length * (Math.floor(Math.random() * 20) + 10) : Math.floor(Math.random() * 30) + 5;

        return {
          day: dayStr,
          visits: visits,
          orders: dayOrders.length
        };
      });

      setChartData(chartData);

    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
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
    setTempDateRange(undefined); // Reset completamente la selección temporal
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
    return 'Rango personalizado';
  };

  const formatChange = (change) => {
    const isPositive = change >= 0;
    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        <span className="text-xs font-medium">{Math.abs(change).toFixed(0)}%</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto lg:max-w-6xl space-y-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200/50">
          <p className="label font-bold text-gray-900">{`${label}`}</p>
          <p className="intro text-green-600 font-medium">{`Visitas: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen">
      {/* Custom Calendar Modal */}
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

      {/* Mobile Layout - OPTIMIZED LAYOUT */}
      <div className="lg:hidden p-3 space-y-3 max-w-md mx-auto">
        {/* Welcome Header - Adjusted for single line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3"
        >
          <h1 className="text-base font-bold text-gray-900 mb-1 leading-tight whitespace-nowrap">
            Hola {creator?.display_name} – ¡bienvenido de vuelta!
          </h1>
          <p className="text-gray-600 text-sm">Así está funcionando tu tienda</p>
        </motion.div>

        {/* Period Selector - COMPACTED */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-3 overflow-x-auto pb-2"
        >
          <Button
            onClick={() => handlePeriodSelect('7D')}
            size="sm"
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap shadow-sm ${
              selectedPeriod === '7D'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            7D
          </Button>

          <Button
            onClick={() => handlePeriodSelect('14D')}
            size="sm"
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap shadow-sm ${
              selectedPeriod === '14D'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            14D
          </Button>

          <Button
            onClick={() => handlePeriodSelect('month')}
            size="sm"
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap shadow-sm ${
              selectedPeriod === 'month'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Este mes
          </Button>

          <Button
            onClick={handleOpenCalendar}
            size="sm"
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap shadow-sm ${
              selectedPeriod === 'custom'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {getCustomRangeLabel()}
          </Button>
        </motion.div>

        {/* Stats Cards - COMPACTED */}
        <div className="space-y-3">
          {/* Total Revenue - COMPACTED */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                    <DollarSign className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-gray-600 text-xs font-medium">Ingresos totales</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-xl font-bold text-gray-900">
                    ${stats.totalRevenue.toFixed(0)}
                  </span>
                  {formatChange(stats.revenueChange)}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Store Visits and Leads - COMPACTED */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-3"
          >
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                    <Eye className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-600 text-xs font-medium">Visitas</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {stats.storeVisits}
                  </span>
                  {formatChange(stats.visitsChange)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                    <Users className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-600 text-xs font-medium">Leads</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {stats.leads}
                  </span>
                  {formatChange(stats.leadsChange)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Chart - COMPACTED WITH GREEN BARS AND TOOLTIP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm">
            <CardContent className="p-3">
              <h3 className="text-gray-900 font-semibold mb-3 text-sm">Visitas por día</h3>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 10 }}
                    />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: 'rgba(34, 197, 94, 0.1)' }}
                      content={<CustomTooltip />} 
                    />
                    <Bar
                      dataKey="visits"
                      fill="#22c55e"
                      radius={[3, 3, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Desktop Layout - NO CHANGES */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Hola {creator?.display_name} – ¡bienvenido de vuelta!
            </h1>
            <p className="text-gray-500">Así está funcionando tu tienda</p>
          </motion.div>

          {/* Period Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 mb-6"
          >
            <Button
              onClick={() => handlePeriodSelect('7D')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
                selectedPeriod === '7D'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Últimos 7 días
            </Button>

            <Button
              onClick={() => handlePeriodSelect('14D')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
                selectedPeriod === '14D'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Últimos 14 días
            </Button>

            <Button
              onClick={handleOpenCalendar}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
                selectedPeriod === 'custom'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {getCustomRangeLabel()}
            </Button>
          </motion.div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Store Visits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-600 text-sm font-medium">Visitas a la tienda</span>
                    </div>
                    {formatChange(stats.visitsChange)}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.storeVisits}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Total Revenue */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                        <DollarSign className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-600 text-sm font-medium">Ingresos totales</span>
                    </div>
                    {formatChange(stats.revenueChange)}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${stats.totalRevenue.toFixed(0)}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Leads */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-600 text-sm font-medium">Leads</span>
                    </div>
                    {formatChange(stats.leadsChange)}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.leads}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Chart - WITH TOOLTIP */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm">
              <CardContent className="p-5">
                <h3 className="text-gray-900 font-semibold mb-4 text-base">Visitas por día</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={animatedDesktopData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                      />
                      <YAxis hide />
                      <Tooltip 
                        cursor={{ fill: 'rgba(34, 197, 94, 0.1)' }}
                        content={<CustomTooltip />}
                      />
                      <Bar
                        dataKey="visits"
                        fill="#22c55e"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1000}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

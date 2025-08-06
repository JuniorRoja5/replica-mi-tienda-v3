import React, { useState, useEffect } from "react";
import { Creator, User, Referral, ReferralEarning, ReferralSettings } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users,
  DollarSign,
  TrendingUp,
  Copy,
  Check,
  Share2,
  Gift,
  Crown,
  Zap,
  Calendar,
  Star,
  Target,
  Trophy,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Mail,
  Send
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts';

import ReferralStats from "../components/referrals/ReferralStats";
import ReferralLink from "../components/referrals/ReferralLink";
import ReferralTiers from "../components/referrals/ReferralTiers";
import ReferralsList from "../components/referrals/ReferralsList";
import ShareModal from "../components/referrals/ShareModal";

export default function Referrals() {
  const [user, setUser] = useState(null);
  const [creator, setCreator] = useState(null);
  const [referralSettings, setReferralSettings] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      const creators = await Creator.filter({ created_by: currentUser.email });
      if (creators.length > 0) {
        const currentCreator = creators[0];
        setCreator(currentCreator);
        
        // Load or create referral settings
        let userReferralSettings = await ReferralSettings.filter({ user_id: currentUser.id });
        if (userReferralSettings.length === 0) {
          // Create new referral settings with unique code
          const referralCode = generateReferralCode(currentCreator.username || currentUser.email);
          const newSettings = await ReferralSettings.create({
            user_id: currentUser.id,
            referral_code: referralCode,
            total_referrals: 0,
            active_referrals: 0,
            total_earnings: 0,
            monthly_projected_earnings: 0,
            free_months_earned: 0,
            current_tier: 'bronze',
            next_tier_requirements: 5,
            last_updated: new Date().toISOString()
          });
          setReferralSettings(newSettings);
        } else {
          setReferralSettings(userReferralSettings[0]);
        }
        
        // Load referrals and earnings
        const userReferrals = await Referral.filter({ referrer_id: currentUser.id });
        const userEarnings = await ReferralEarning.filter({ referrer_id: currentUser.id });
        
        setReferrals(userReferrals);
        setEarnings(userEarnings);
      }
    } catch (error) {
      console.error("Error loading referrals data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateReferralCode = (username) => {
    const base = username.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 8);
    const random = Math.random().toString(36).substring(2, 6);
    return `${base}${random}`;
  };

  const getReferralUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/register?ref=${referralSettings?.referral_code}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getReferralUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const calculateStats = () => {
    const thisMonth = startOfMonth(new Date());
    const thisMonthReferrals = referrals.filter(r => 
      new Date(r.registration_date) >= thisMonth
    );
    
    const activeReferrals = referrals.filter(r => r.status === 'active');
    const monthlyProjected = activeReferrals.reduce((sum, r) => sum + (r.monthly_commission || 0), 0);
    const totalEarned = earnings.reduce((sum, e) => sum + e.commission_amount, 0);
    
    return {
      thisMonthReferrals: thisMonthReferrals.length,
      totalReferrals: referrals.length,
      activeReferrals: activeReferrals.length,
      monthlyProjected,
      totalEarned,
      recentReferrals: referrals.slice(-5).reverse()
    };
  };

  const getTierInfo = (activeCount) => {
    if (activeCount >= 50) return { name: 'Diamond', color: 'from-cyan-400 to-blue-500', icon: Crown, next: null };
    if (activeCount >= 25) return { name: 'Platinum', color: 'from-gray-400 to-gray-600', icon: Trophy, next: 50 };
    if (activeCount >= 10) return { name: 'Gold', color: 'from-yellow-400 to-yellow-600', icon: Star, next: 25 };
    if (activeCount >= 5) return { name: 'Silver', color: 'from-gray-300 to-gray-400', icon: Target, next: 10 };
    return { name: 'Bronze', color: 'from-orange-400 to-orange-600', icon: Zap, next: 5 };
  };

  const generateEarningsChart = () => {
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const month = subMonths(new Date(), i);
      const monthStr = format(month, 'yyyy-MM');
      const monthEarnings = earnings.filter(e => e.earning_month === monthStr);
      const total = monthEarnings.reduce((sum, e) => sum + e.commission_amount, 0);
      
      last6Months.push({
        month: format(month, 'MMM', { locale: es }),
        earnings: total
      });
    }
    return last6Months;
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-2xl animate-pulse shadow-sm" />
          ))}
        </div>
      </div>
    );
  }

  const stats = calculateStats();
  const tierInfo = getTierInfo(stats.activeReferrals);
  const earningsChartData = generateEarningsChart();

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Programa de Referidos
          </h1>
          <p className="text-gray-600 text-lg">
            Gana el <span className="font-bold text-green-600">25% de por vida</span> por cada suscripción que generes
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => setShowShareModal(true)}
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartir
          </Button>
          <Button 
            onClick={handleCopyLink}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copiado!' : 'Copiar Link'}
          </Button>
        </div>
      </motion.div>

      {/* Referral Link Section */}
      <ReferralLink 
        referralUrl={getReferralUrl()}
        onCopy={handleCopyLink}
        copied={copied}
        onShare={() => setShowShareModal(true)}
      />

      {/* Stats Cards */}
      <ReferralStats stats={stats} />

      {/* Tier Progress */}
      <ReferralTiers 
        currentTier={tierInfo}
        activeReferrals={stats.activeReferrals}
        nextTierRequirement={tierInfo.next}
      />

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Earnings Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Ingresos por Referidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={earningsChartData}>
                    <defs>
                      <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                      formatter={(value) => [`$${value.toFixed(2)}`, 'Ingresos']}
                      labelStyle={{ color: '#374151' }}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="earnings"
                      stroke="#10B981"
                      strokeWidth={2}
                      fill="url(#earningsGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Referrals */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Users className="w-5 h-5 text-blue-600" />
                Últimos Referidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentReferrals.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Aún no tienes referidos</p>
                  <p className="text-gray-500 text-sm">¡Comparte tu enlace para empezar!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.recentReferrals.map((referral, index) => (
                    <motion.div
                      key={referral.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {referral.referred_name?.charAt(0) || referral.referred_email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {referral.referred_name || referral.referred_email}
                          </p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(referral.registration_date), 'dd MMM yyyy', { locale: es })}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={referral.status === 'active' ? 'default' : 'secondary'}
                        className={referral.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {referral.status === 'active' ? 'Activo' : 
                         referral.status === 'pending' ? 'Pendiente' : 
                         referral.status === 'inactive' ? 'Inactivo' : 'Cancelado'}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Incentives Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl border-0">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Gift className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">¡Incentivos Especiales!</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🎉</span>
                    </div>
                    <div>
                      <p className="font-semibold">15 Referidos Activos = 1 Mes Gratis</p>
                      <p className="text-purple-100 text-sm">Obtén un mes gratis de ClickMyLink</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div>
                      <p className="font-semibold">Ingresos Pasivos Mensuales</p>
                      <p className="text-purple-100 text-sm">25% de cada suscripción, de por vida</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center lg:text-right">
                <div className="inline-block p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <h4 className="text-lg font-semibold mb-2">Tu Potencial Mensual</h4>
                  <div className="text-4xl font-bold mb-2">
                    ${(stats.activeReferrals * 7.5).toFixed(0)}
                  </div>
                  <p className="text-purple-100 text-sm">
                    Con {stats.activeReferrals} referidos activos
                  </p>
                  <div className="mt-4 p-3 bg-white/10 rounded-lg">
                    <p className="text-xs text-purple-100">
                      * Basado en suscripción promedio de $30/mes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Referrals List */}
      <ReferralsList referrals={referrals} />

      {/* Share Modal */}
      <ShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        referralUrl={getReferralUrl()}
        referralCode={referralSettings?.referral_code}
      />
    </div>
  );
}
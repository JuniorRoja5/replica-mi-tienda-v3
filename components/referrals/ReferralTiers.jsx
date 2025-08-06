import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Crown, 
  Trophy, 
  Star, 
  Target, 
  Zap,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

const tiers = [
  { name: 'Bronze', min: 0, max: 4, icon: Zap, color: 'from-orange-400 to-orange-600', bgColor: 'bg-orange-50', textColor: 'text-orange-800' },
  { name: 'Silver', min: 5, max: 9, icon: Target, color: 'from-gray-300 to-gray-500', bgColor: 'bg-gray-50', textColor: 'text-gray-800' },
  { name: 'Gold', min: 10, max: 24, icon: Star, color: 'from-yellow-400 to-yellow-600', bgColor: 'bg-yellow-50', textColor: 'text-yellow-800' },
  { name: 'Platinum', min: 25, max: 49, icon: Trophy, color: 'from-gray-400 to-gray-600', bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
  { name: 'Diamond', min: 50, max: 999, icon: Crown, color: 'from-cyan-400 to-blue-500', bgColor: 'bg-cyan-50', textColor: 'text-cyan-800' }
];

export default function ReferralTiers({ currentTier, activeReferrals, nextTierRequirement }) {
  const currentTierIndex = tiers.findIndex(tier => 
    activeReferrals >= tier.min && activeReferrals <= tier.max
  );
  
  const progress = nextTierRequirement ? 
    (activeReferrals / nextTierRequirement) * 100 : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="bg-white shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Trophy className="w-5 h-5 text-purple-600" />
            Tu Nivel de Referidos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Tier Status */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentTier.color} flex items-center justify-center`}>
                <currentTier.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <Badge className={`${currentTier.bgColor} ${currentTier.textColor} mb-2`}>
                  Nivel {currentTier.name}
                </Badge>
                <p className="font-bold text-lg text-gray-900">
                  {activeReferrals} referidos activos
                </p>
                <p className="text-sm text-gray-600">
                  {nextTierRequirement ? 
                    `${nextTierRequirement - activeReferrals} más para el siguiente nivel` :
                    '¡Nivel máximo alcanzado!'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Progress to Next Tier */}
          {nextTierRequirement && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progreso al siguiente nivel</span>
                <span className="font-semibold text-gray-900">
                  {activeReferrals}/{nextTierRequirement}
                </span>
              </div>
              <Progress value={Math.min(progress, 100)} className="h-3" />
            </div>
          )}

          {/* All Tiers Overview */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 mb-3">Todos los Niveles</h4>
            <div className="grid grid-cols-1 gap-3">
              {tiers.map((tier, index) => {
                const Icon = tier.icon;
                const isActive = index === currentTierIndex;
                const isCompleted = index < currentTierIndex;
                
                return (
                  <motion.div
                    key={tier.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                      isActive ? 
                        'border-purple-300 bg-purple-50' : 
                        isCompleted ? 
                          'border-green-200 bg-green-50' : 
                          'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{tier.name}</p>
                        <p className="text-sm text-gray-600">
                          {tier.min === 0 ? `0-${tier.max}` : 
                           tier.max === 999 ? `${tier.min}+` : 
                           `${tier.min}-${tier.max}`} referidos
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isCompleted && (
                        <Badge className="bg-green-100 text-green-800">
                          Completado
                        </Badge>
                      )}
                      {isActive && (
                        <Badge className="bg-purple-100 text-purple-800">
                          Actual
                        </Badge>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Tier Benefits */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">🎁 Beneficios por Nivel</h4>
            <div className="space-y-2 text-sm text-green-800">
              <p>• <strong>Silver (5+):</strong> Badge especial en tu perfil</p>
              <p>• <strong>Gold (10+):</strong> Acceso a webinars exclusivos</p>
              <p>• <strong>Platinum (25+):</strong> Sesión 1-on-1 con el equipo</p>
              <p>• <strong>Diamond (50+):</strong> Comisión premium del 30%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
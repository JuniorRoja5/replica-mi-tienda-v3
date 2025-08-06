import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Copy, 
  Check, 
  Share2, 
  Link as LinkIcon,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

export default function ReferralLink({ referralUrl, onCopy, copied, onShare }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <LinkIcon className="w-5 h-5 text-indigo-600" />
            Tu Enlace de Referidos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Input
                value={referralUrl}
                readOnly
                className="pr-20 bg-white border-gray-300 text-gray-700 font-mono text-sm"
              />
              <Button
                onClick={onCopy}
                size="sm"
                className="absolute right-1 top-1 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <Button
              onClick={onShare}
              variant="outline"
              className="bg-white border-indigo-300 text-indigo-700 hover:bg-indigo-50"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-white/70 rounded-lg border border-indigo-200">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">
                🎉 Gana el 25% de cada suscripción mensual de por vida
              </p>
              <p className="text-sm text-gray-600">
                Por cada persona que invites a ClickMyLink y se suscriba, obtendrás el 25% de su pago mensual mientras mantenga su suscripción activa. ¡Es así de simple!
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-white/50 rounded-lg">
              <p className="text-2xl font-bold text-indigo-600">25%</p>
              <p className="text-xs text-gray-600">Comisión de por vida</p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">∞</p>
              <p className="text-xs text-gray-600">Ingresos pasivos</p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <p className="text-2xl font-bold text-pink-600">15</p>
              <p className="text-xs text-gray-600">Referidos = 1 mes gratis</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  X,
  Copy,
  Check,
  MessageCircle,
  Mail,
  Send,
  Share2,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const shareOptions = [
  {
    name: 'WhatsApp',
    icon: '📱',
    color: 'bg-green-500 hover:bg-green-600',
    action: (url, message) => {
      const text = encodeURIComponent(`${message}\n\n${url}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  },
  {
    name: 'Telegram',
    icon: '✈️',
    color: 'bg-blue-500 hover:bg-blue-600',
    action: (url, message) => {
      const text = encodeURIComponent(`${message}\n\n${url}`);
      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`, '_blank');
    }
  },
  {
    name: 'Email',
    icon: '📧',
    color: 'bg-gray-500 hover:bg-gray-600',
    action: (url, message) => {
      const subject = encodeURIComponent('¡Únete a ClickMyLink!');
      const body = encodeURIComponent(`${message}\n\n${url}`);
      window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    }
  },
  {
    name: 'X (Twitter)',
    icon: '🐦',
    color: 'bg-black hover:bg-gray-800',
    action: (url, message) => {
      const text = encodeURIComponent(`${message} ${url}`);
      window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    }
  }
];

export default function ShareModal({ isOpen, onClose, referralUrl, referralCode }) {
  const [customMessage, setCustomMessage] = useState(
    "¡Hola! Te invito a unirte a ClickMyLink, la plataforma perfecta para monetizar tu presencia en redes sociales. ¡Es increíble lo fácil que es crear tu tienda online!"
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const handleShare = (shareOption) => {
    shareOption.action(referralUrl, customMessage);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Compartir tu enlace</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Custom Message */}
              <div>
                <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                  Personaliza tu mensaje
                </Label>
                <Textarea
                  id="message"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="mt-2 h-24"
                  placeholder="Escribe un mensaje personalizado..."
                />
              </div>

              {/* Referral URL */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Tu enlace de referidos
                </Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    value={referralUrl}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    onClick={() => handleCopy(referralUrl)}
                    size="sm"
                    variant="outline"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Share Options */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Compartir en
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {shareOptions.map((option, index) => (
                    <motion.button
                      key={option.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleShare(option)}
                      className={`${option.color} text-white p-4 rounded-lg flex flex-col items-center gap-2 transition-all duration-200 hover:shadow-md`}
                    >
                      <span className="text-2xl">{option.icon}</span>
                      <span className="text-sm font-medium">{option.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quick Copy Templates */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Plantillas rápidas
                </Label>
                
                <div className="space-y-2">
                  <button
                    onClick={() => handleCopy(`${customMessage}\n\n${referralUrl}`)}
                    className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Mensaje + Enlace</p>
                        <p className="text-xs text-gray-600">Mensaje personalizado con tu enlace</p>
                      </div>
                      <Copy className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleCopy(`Código de referido: ${referralCode}`)}
                    className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Solo código</p>
                        <p className="text-xs text-gray-600">Tu código de referido: {referralCode}</p>
                      </div>
                      <Copy className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Stats Preview */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">💰 Potencial de ingresos</h4>
                <div className="space-y-1 text-sm text-purple-800">
                  <p>• 1 referido activo = ~$7.50/mes</p>
                  <p>• 10 referidos activos = ~$75/mes</p>
                  <p>• 50 referidos activos = ~$375/mes</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
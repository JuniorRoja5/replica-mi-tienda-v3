import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  X, 
  Copy, 
  Check, 
  Twitter, 
  Instagram, 
  MessageCircle,
  Mail,
  Link as LinkIcon
} from "lucide-react";
import { motion } from "framer-motion";

export default function ShareModal({ creator, onClose }) {
  const [copied, setCopied] = useState(false);
  
  // In a real app, this would be the actual public profile URL
  const profileUrl = `https://creatorstore.com/${creator.username}`;
  
  const shareText = `¡Descubre los increíbles productos de ${creator.display_name}! 🚀`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const shareOptions = [
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(profileUrl)}`, '_blank');
      }
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500 hover:bg-green-600",
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + profileUrl)}`, '_blank');
      }
    },
    {
      name: "Telegram",
      icon: Mail,
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
      }
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-gray-900">Compartir Perfil</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Profile Preview */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                {creator.avatar_url ? (
                  <img 
                    src={creator.avatar_url} 
                    alt={creator.display_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-white">
                    {creator.display_name[0]}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{creator.display_name}</h3>
              <p className="text-sm text-gray-600">@{creator.username}</p>
            </div>

            {/* Copy Link */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Enlace del perfil</label>
              <div className="flex gap-2">
                <Input
                  value={profileUrl}
                  readOnly
                  className="flex-1 bg-gray-50 border-gray-200"
                />
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="px-3"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {copied && (
                <p className="text-xs text-green-600">¡Enlace copiado!</p>
              )}
            </div>

            {/* Share Options */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Compartir en redes sociales</label>
              <div className="grid grid-cols-3 gap-3">
                {shareOptions.map((option) => (
                  <motion.button
                    key={option.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={option.action}
                    className={`${option.color} text-white p-4 rounded-xl flex flex-col items-center gap-2 transition-all duration-200`}
                  >
                    <option.icon className="w-6 h-6" />
                    <span className="text-xs font-medium">{option.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Cerrar
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, CreditCard, Lock, Package, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Order } from "@/api/entities";
import { useLanguage } from "../LanguageProvider";

export default function PurchaseModal({ product, creator, onClose }) {
  const { t } = useLanguage();
  const [customerData, setCustomerData] = useState({
    name: "",
    email: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);

  const handlePurchase = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order
      await Order.create({
        creator_id: creator.id,
        product_id: product.id,
        customer_email: customerData.email,
        customer_name: customerData.name,
        amount: product.price,
        status: "completed"
      });

      setIsPurchased(true);
    } catch (error) {
      console.error("Error processing purchase:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const categoryColors = {
    "digital-product": "bg-blue-500/20 text-blue-300",
    "course": "bg-green-500/20 text-green-300",
    "template": "bg-purple-500/20 text-purple-300",
    "ebook": "bg-orange-500/20 text-orange-300",
    "preset": "bg-pink-500/20 text-pink-300",
    "other": "bg-gray-500/20 text-gray-300"
  };

  if (isPurchased) {
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
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">{t('purchaseComplete')}</h3>
              <p className="text-purple-200 mb-6">{t('downloadSent')}</p>
              
              <Button onClick={onClose} className="w-full bg-gradient-to-r from-purple-500 to-blue-500">
                {t('close')}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white text-xl">{t('completePurchase')}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Product Summary */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Package className="w-8 h-8 text-purple-300" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white">{product.title}</h4>
                    <Badge className={categoryColors[product.category] || categoryColors.other}>
                      {product.category?.replace('-', ' ')}
                    </Badge>
                  </div>
                  <p className="text-purple-200 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="text-2xl font-bold text-white">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Form */}
            <form onSubmit={handlePurchase} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">{t('fullName')}</Label>
                <Input
                  id="name"
                  value={customerData.name}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder-purple-300"
                  placeholder={t('enterFullName')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder-purple-300"
                  placeholder={t('enterEmail')}
                  required
                />
              </div>

              {/* Payment Info */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-purple-300" />
                  <h4 className="font-semibold text-white">{t('paymentMethod')}</h4>
                </div>
                <div className="text-purple-200 text-sm">
                  {t('securePayment')}
                </div>
              </div>

              {/* Security Notice */}
              <div className="flex items-center gap-2 text-sm text-purple-300">
                <Lock className="w-4 h-4" />
                <span>{t('secureCheckout')}</span>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 py-3"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('processing')}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    {t('payNow')} ${product.price.toFixed(2)}
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
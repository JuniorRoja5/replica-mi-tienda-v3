import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../LanguageProvider";

export default function ProductGrid({ products, onPurchase }) {
  const { t } = useLanguage();
  
  const categoryColors = {
    "digital-product": "bg-blue-500/20 text-blue-300",
    "course": "bg-green-500/20 text-green-300",
    "template": "bg-purple-500/20 text-purple-300",
    "ebook": "bg-orange-500/20 text-orange-300",
    "preset": "bg-pink-500/20 text-pink-300",
    "other": "bg-gray-500/20 text-gray-300"
  };

  const getCategoryName = (category) => {
    const categories = {
      "digital-product": t('digitalProduct'),
      "course": t('course'),
      "template": t('template'),
      "ebook": t('ebook'),
      "preset": t('preset'),
      "other": t('other')
    };
    return categories[category] || category;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <Card className="group bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-200 overflow-hidden h-full">
            <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20 relative overflow-hidden">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-12 h-12 text-purple-300" />
                </div>
              )}
              
              <div className="absolute top-4 left-4">
                <Badge className={categoryColors[product.category] || categoryColors.other}>
                  {getCategoryName(product.category)}
                </Badge>
              </div>

              {product.sales_count > 10 && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-yellow-500/20 text-yellow-300 flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {t('popular')}
                  </Badge>
                </div>
              )}
            </div>
            
            <CardContent className="p-6 flex flex-col justify-between flex-1">
              <div className="mb-4">
                <h3 className="font-bold text-white text-lg mb-2 line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-purple-200 text-sm line-clamp-3 mb-4">
                  {product.description}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-white">
                    ${product.price.toFixed(2)}
                  </div>
                  <div className="text-purple-300 text-sm">
                    {product.sales_count || 0} {t('sales')}
                  </div>
                </div>
                
                <Button 
                  onClick={() => onPurchase(product)}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {t('buyNow')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
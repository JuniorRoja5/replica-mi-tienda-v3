import React, { useState, useEffect } from "react";
import { Creator, Product } from "@/api/entities";
import { ArrowLeft, Package, Star, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// Página Pública Individual del Producto
export default function PublicProduct() {
  const [creator, setCreator] = useState(null);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProductData();
  }, []);

  const loadProductData = async () => {
    try {
      // Extraer parámetros de la URL
      const urlParams = new URLSearchParams(window.location.search);
      const username = urlParams.get('u');
      const productHandle = urlParams.get('p');
      
      if (!username || !productHandle) {
        setError("Parámetros de URL inválidos");
        setIsLoading(false);
        return;
      }

      // Buscar creador
      const creators = await Creator.filter({ username: username });
      
      if (creators.length === 0) {
        setError("Creador no encontrado");
        setIsLoading(false);
        return;
      }

      const currentCreator = creators[0];
      setCreator(currentCreator);

      // Buscar producto
      const products = await Product.filter({ 
        creator_id: currentCreator.id,
        handle: productHandle,
        is_active: true 
      });
      
      if (products.length === 0) {
        setError("Producto no encontrado");
        setIsLoading(false);
        return;
      }

      setProduct(products[0]);
    } catch (error) {
      console.error("Error cargando producto:", error);
      setError("Error cargando producto");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToProfile = () => {
    window.location.href = `/PublicStorefront?u=${creator.username}`;
  };

  const handlePurchase = () => {
    // Aquí iría la lógica de compra
    alert("Funcionalidad de compra por implementar");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !creator || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-xl font-bold mb-3">
            {error === "Producto no encontrado" ? "Producto no encontrado" : "Error"}
          </h2>
          <p className="text-gray-400">
            {error === "Producto no encontrado" 
              ? "Este producto no existe o no está disponible." 
              : "Hubo un problema cargando este producto."
            }
          </p>
          <Button 
            onClick={() => window.history.back()} 
            className="mt-4 bg-purple-600 hover:bg-purple-700"
          >
            Volver
          </Button>
        </div>
      </div>
    );
  }

  // Configuración de diseño
  const design = creator.design_settings || {
    background: '#000000',
    text_color: '#ffffff',
    text_secondary_color: '#A0A0A0',
    font_family: 'Inter'
  };

  const displayPrice = product.has_discount && product.discount_price > 0 
    ? product.discount_price 
    : product.price;

  const originalPrice = product.has_discount && product.discount_price > 0 
    ? product.price 
    : null;

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: design.background,
        color: design.text_color,
        fontFamily: design.font_family 
      }}
    >
      {/* Header con botón de regreso */}
      <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <button 
            onClick={handleBackToProfile}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al perfil</span>
          </button>
        </div>
      </div>

      {/* Contenido del producto */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Imagen del producto */}
          {product.image_url && (
            <div className="w-full h-64 rounded-2xl overflow-hidden">
              <img 
                src={product.image_url} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Información del producto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: design.text_color }}>
                {product.title}
              </h1>
              
              {product.subtitle && (
                <p className="text-xl" style={{ color: design.text_secondary_color }}>
                  {product.subtitle}
                </p>
              )}
            </div>

            {/* Precio */}
            {product.price > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-green-400">
                  ${displayPrice}
                </span>
                {originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${originalPrice}
                  </span>
                )}
              </div>
            )}

            {/* Descripción */}
            {product.description && (
              <div 
                className="prose prose-invert max-w-none text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            {/* Botón de compra */}
            <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur-sm p-4 -mx-4 border-t border-gray-800">
              <Button 
                onClick={handlePurchase}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 text-lg font-semibold rounded-xl"
              >
                <DollarSign className="w-5 h-5 mr-2" />
                {product.price > 0 ? `Comprar por $${displayPrice}` : 'Obtener Gratis'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
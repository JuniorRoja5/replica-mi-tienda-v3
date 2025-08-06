import React, { useState, useEffect } from "react";
import { Creator, Product } from "@/api/entities";
import { Globe, ExternalLink, Package, Mail, Phone, GraduationCap, Crown } from "lucide-react";
import { motion } from "framer-motion";

// Storefront Público Completamente Independiente
export default function PublicStorefront() {
  const [creator, setCreator] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCreatorData();
  }, []);

  const loadCreatorData = async () => {
    try {
      setIsLoading(true);
      console.log("Iniciando carga de datos del creador...");
      
      // Extraer username de la URL
      const urlParams = new URLSearchParams(window.location.search);
      const username = urlParams.get('u');
      
      console.log("Username extraído de URL:", username);
      
      if (!username) {
        console.error("No se encontró username en la URL");
        setError("Username no encontrado en la URL");
        setIsLoading(false);
        return;
      }

      // Buscar creador por username
      console.log("Buscando creador con username:", username);
      const creators = await Creator.list();
      console.log("Todos los creadores:", creators);
      
      const currentCreator = creators.find(c => c.username === username);
      console.log("Creador encontrado:", currentCreator);
      
      if (!currentCreator) {
        console.error("Creador no encontrado");
        setError("Creador no encontrado");
        setIsLoading(false);
        return;
      }

      setCreator(currentCreator);
      
      // Cargar productos del creador
      console.log("Cargando productos para creador ID:", currentCreator.id);
      const allProducts = await Product.list();
      console.log("Todos los productos:", allProducts);
      
      const creatorProducts = allProducts.filter(p => 
        p.creator_id === currentCreator.id && p.is_active === true
      );
      console.log("Productos del creador filtrados:", creatorProducts);
      
      // Ordenar productos
      const sortedProducts = creatorProducts.sort((a, b) => 
        (a.sort_order || 0) - (b.sort_order || 0)
      );
      
      setProducts(sortedProducts);
      console.log("Productos finales:", sortedProducts);
      
    } catch (error) {
      console.error("Error completo cargando datos:", error);
      setError("Error cargando perfil: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar clic en productos
  const handleProductClick = (product) => {
    console.log("Clic en producto:", product);
    if (product.type === 'link') {
      window.open(product.external_url, '_blank');
    } else {
      // Navegar a página individual del producto
      window.location.href = `/PublicProduct?u=${creator.username}&p=${product.handle}`;
    }
  };

  // Función para obtener ícono de producto
  const getProductIcon = (productType) => {
    switch(productType) {
      case 'consultation': return Phone;
      case 'course': return GraduationCap;
      case 'membership': return Crown;
      default: return Package;
    }
  };

  // Estado de carga
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="text-center max-w-md">
          <Package className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-xl font-bold mb-3 text-red-400">Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Si no hay creador
  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-xl font-bold mb-3">Perfil no encontrado</h2>
          <p className="text-gray-400">Este perfil no existe o no está disponible.</p>
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

  // Combinar enlaces sociales
  const allSocialLinks = [
    ...(creator.social_links || []),
    ...(creator.custom_social_links || []).map(custom => ({ 
      ...custom, 
      platform: custom.id, 
      isCustom: true 
    }))
  ];

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: design.background,
        color: design.text_color,
        fontFamily: design.font_family 
      }}
    >
      {/* Contenedor Principal */}
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header del Perfil */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {/* Avatar */}
          <div className="mb-6">
            {creator.avatar_url ? (
              <img 
                src={creator.avatar_url} 
                alt={creator.display_name}
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-gray-700"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {creator.display_name ? creator.display_name[0] : '?'}
                </span>
              </div>
            )}
          </div>

          {/* Nombre y Bio */}
          <h1 className="text-2xl font-bold mb-2" style={{ color: design.text_color }}>
            {creator.display_name}
          </h1>
          
          {creator.bio && (
            <p className="text-sm leading-relaxed mb-6" style={{ color: design.text_secondary_color }}>
              {creator.bio}
            </p>
          )}

          {/* Redes Sociales */}
          {allSocialLinks.length > 0 && (
            <div className="flex justify-center gap-4 mb-8">
              {allSocialLinks.map((link, index) => (
                <a 
                  key={index} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  {link.isCustom && link.icon_url ? (
                    <img src={link.icon_url} alt={link.name} className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <Globe className="w-5 h-5 text-white" />
                  )}
                </a>
              ))}
            </div>
          )}
        </motion.div>

        {/* Lista de Productos y Enlaces */}
        <div className="space-y-4">
          {products.map((product, index) => {
            const ProductIcon = getProductIcon(product.product_type);
            
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleProductClick(product)}
                className="bg-gray-800 rounded-2xl p-4 cursor-pointer hover:bg-gray-700 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4">
                  {/* Imagen o Ícono */}
                  <div className="flex-shrink-0">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.title}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <ProductIcon className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white mb-1 truncate">
                      {product.title}
                    </h3>
                    
                    {product.subtitle && (
                      <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                        {product.subtitle}
                      </p>
                    )}

                    {/* Precio para productos */}
                    {product.type === 'product' && product.price > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 font-semibold">
                          ${product.price}
                        </span>
                        {product.has_discount && product.discount_price && (
                          <span className="text-gray-500 line-through text-sm">
                            ${product.discount_price}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Indicador de enlace externo */}
                  {product.type === 'link' && (
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mensaje si no hay productos */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No hay productos disponibles</p>
          </div>
        )}

        {/* Info de Debug (solo para desarrollo) */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg text-xs text-gray-400">
          <p>Debug Info:</p>
          <p>Creador: {creator?.display_name} (@{creator?.username})</p>
          <p>Productos: {products.length}</p>
          <p>URL: {window.location.href}</p>
        </div>
      </div>
    </div>
  );
}
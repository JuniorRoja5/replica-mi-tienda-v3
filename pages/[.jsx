import React, { useState, useEffect } from "react";
import { Creator, Product } from "@/api/entities";
import { Package } from "lucide-react";
import ProfileView from "../components/public/ProfileView";
import ProductPagePreview from "../components/public/ProductPagePreview";

export default function PublicPage() {
  const [creator, setCreator] = useState(null);
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageType, setPageType] = useState('profile'); // 'profile' or 'product'

  useEffect(() => {
    loadPublicContent();
  }, []);

  const loadPublicContent = async () => {
    setIsLoading(true);
    try {
      // Extract path segments from URL
      const pathParts = window.location.pathname.split('/').filter(part => part !== '');
      
      // Check if it's a user profile URL (u/username) or product URL (u/username/product-handle)
      if (pathParts.length === 0 || pathParts[0] !== 'u') {
        setError("Invalid URL format");
        setIsLoading(false);
        return;
      }

      const username = pathParts[1];
      const productHandle = pathParts[2];
      
      if (!username) {
        setError("Username not found in URL");
        setIsLoading(false);
        return;
      }

      // Find creator by username
      const creators = await Creator.filter({ username: username });
      
      if (creators.length === 0) {
        setError("Creator not found");
        setIsLoading(false);
        return;
      }

      const currentCreator = creators[0];
      setCreator(currentCreator);

      if (productHandle) {
        // Load specific product
        setPageType('product');
        const productResults = await Product.filter({ 
          creator_id: currentCreator.id,
          handle: productHandle,
          is_active: true 
        });
        
        if (productResults.length === 0) {
          setError("Product not found");
          setIsLoading(false);
          return;
        }
        
        setProduct(productResults[0]);
      } else {
        // Load creator profile with all active products
        setPageType('profile');
        const activeProducts = await Product.filter({ 
          creator_id: currentCreator.id,
          is_active: true 
        });
        
        // Sort products by sort_order
        const sortedProducts = activeProducts.sort((a, b) => 
          (a.sort_order || 0) - (b.sort_order || 0)
        );
        
        setProducts(sortedProducts);
      }
    } catch (error) {
      console.error("Error loading public content:", error);
      setError("Error loading content");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToProfile = () => {
    const pathParts = window.location.pathname.split('/').filter(part => part !== '');
    const username = pathParts[1];
    window.location.href = `/u/${username}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 flex items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 flex items-center justify-center p-4">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            {error === "Creator not found" ? "Creador no encontrado" : 
             error === "Product not found" ? "Producto no encontrado" : 
             "Error cargando contenido"}
          </h2>
          <p className="text-gray-600">
            {error === "Creator not found" 
              ? "El perfil que buscas no existe o no está disponible." 
              : error === "Product not found"
              ? "El producto que buscas no existe o no está disponible."
              : "Hubo un problema cargando este contenido."
            }
          </p>
        </div>
      </div>
    );
  }

  // Use the creator's design settings or default to dark theme
  const design = creator.design_settings || {
    theme_id: 'dark',
    theme_name: 'Tema Oscuro', 
    background: '#000000',
    text_color: '#ffffff',
    font_family: 'Inter'
  };

  if (pageType === 'product' && product) {
    return (
      <div 
        className="min-h-screen"
        style={{ 
          background: design.background,
          fontFamily: design.font_family 
        }}
      >
        <ProductPagePreview 
          productData={product} 
          creator={creator} 
          onBack={handleBackToProfile}
        />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: design.background,
        fontFamily: design.font_family 
      }}
    >
      <ProfileView 
        creator={creator} 
        products={products} 
        isPreview={false}
      />
    </div>
  );
}
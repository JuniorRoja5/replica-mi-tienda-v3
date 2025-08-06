
import React, { useState, memo } from "react";
import { Package, Globe } from "lucide-react";
import { motion } from "framer-motion";
import ProductButton from "./ProductButton";
import PurchaseModal from "../storefront/PurchaseModal";
import { SOCIAL_PLATFORMS_MAP } from '../profile/socialPlatforms';

const constructFinalUrl = (platformId, value) => {
  if (!value) return "";
  const platform = SOCIAL_PLATFORMS_MAP.get(platformId);
  if (!platform) return value; // Return value as-is if platform is unknown

  const { baseUrl } = platform;
  
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("mailto:") || value.startsWith("tel:")) {
    return value;
  }
  
  if (!baseUrl && !value.startsWith("http")) {
    return `https://${value}`;
  }

  if (baseUrl) {
    // Handle cases where user might include '@'
    const cleanValue = value.startsWith('@') ? value.substring(1) : value;
    return baseUrl + cleanValue;
  }
  
  return value;
};

const ProfileView = memo(({ creator, products, isPreview = false, onProductClick }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const handleProductClick = (product) => {
    if (isPreview) {
      // In preview mode, use the callback to navigate to product page
      if (onProductClick) {
        onProductClick(product);
      }
      return;
    }

    // In public mode, navigate to the product page
    if (product.type === 'link') {
      // For external links, open in new tab
      window.open(product.external_url, '_blank');
    } else if (product.type === 'product' && product.handle) {
      // For products, navigate to the product page
      const pathParts = window.location.pathname.split('/');
      const uIndex = pathParts.indexOf('u');
      let username = '';
      if (uIndex !== -1 && uIndex + 1 < pathParts.length) {
        username = pathParts[uIndex + 1];
      }
      window.location.href = `/u/${username}/${product.handle}`;
    } else {
      // Fallback: show purchase modal for products without handle
      setSelectedProduct(product);
      setShowPurchaseModal(true);
    }
  };
  
  const design = creator?.design_settings || {
      theme_id: 'dark',
      theme_name: 'Tema Oscuro', 
      background: '#000000',
      text_color: '#ffffff',
      font_family: 'Inter'
  };

  if (!creator) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-xl font-bold text-gray-800 mb-3">Creator Not Found</h2>
        </div>
      </div>
    );
  }

  // Combine standard and custom links for rendering, respecting order of standard links
  const allSocialLinks = [
    ...(creator.social_links || []),
    ...(creator.custom_social_links || []).map(custom => ({ ...custom, platform: custom.id, isCustom: true }))
  ];

  const containerStyle = {
    background: design.background,
    fontFamily: design.font_family || 'Inter',
    color: design.text_color
  };

  // Estilo específico para el texto del tema arcoíris
  const getTextStyle = (isSecondary = false) => {
    if (design.theme_id === 'rainbow') {
      return {
        color: isSecondary ? design.text_secondary_color : design.text_color,
        textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
        fontWeight: isSecondary ? '500' : '600'
      };
    }
    return {
      color: design.text_color,
      opacity: isSecondary ? 0.7 : 1
    };
  };

  return (
    <div className="w-full min-h-full" style={containerStyle}>
      <div className={`w-full mx-auto ${isPreview ? 'px-4 py-6' : 'px-4 py-8 max-w-md'}`}>
        <div className={`text-center ${isPreview ? 'mb-6' : 'mb-8'}`}>
          <div className={`${isPreview ? 'mb-3' : 'mb-4'}`}>
            {creator.avatar_url ? (
              <img src={creator.avatar_url} alt={creator.display_name} className={`${isPreview ? 'w-20 h-20' : 'w-24 h-24'} rounded-full mx-auto object-cover shadow-lg border-4`} style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
            ) : (
              <div className={`${isPreview ? 'w-20 h-20' : 'w-24 h-24'} bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center mx-auto shadow-lg border-4`} style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                <span className={`${isPreview ? 'text-2xl' : 'text-3xl'} font-bold`} style={{ color: design.text_color }}>
                  {creator.display_name ? creator.display_name[0] : ''}
                </span>
              </div>
            )}
          </div>
          {creator.display_name && <h1 className={`${isPreview ? 'text-xl' : 'text-2xl'} font-bold leading-tight mb-2`} style={getTextStyle()}>{creator.display_name}</h1>}
          {!isPreview && creator.username && <h2 className={`${isPreview ? 'text-sm' : 'text-base'} font-medium leading-tight mb-3`} style={getTextStyle(true)}>@{creator.username}</h2>}
          {creator.bio && <p className={`leading-relaxed max-w-sm mx-auto whitespace-pre-line ${isPreview ? 'text-sm mb-4' : 'text-base mb-6'}`} style={getTextStyle(true)}>{creator.bio}</p>}

          {allSocialLinks && Array.isArray(allSocialLinks) && allSocialLinks.length > 0 && (
            <div className={`flex justify-center flex-wrap gap-0.5 ${isPreview ? 'mb-6' : 'mb-8'}`}>
              {allSocialLinks.map((link, index) => {
                if (link.isCustom) {
                  return (
                     <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="transition-colors p-2 hover:bg-black/10 rounded-full" title={link.name} style={getTextStyle(true)}>
                       {link.icon_url ? 
                         <img src={link.icon_url} alt={link.name} className={`${isPreview ? 'w-5 h-5' : 'w-6 h-6'} rounded-full object-cover`} /> :
                         <Globe className={`${isPreview ? 'w-5 h-5' : 'w-6 h-6'}`} />
                       }
                     </a>
                  );
                }

                const platform = SOCIAL_PLATFORMS_MAP.get(link.platform);
                if (!platform || !link.url) return null;
                
                const IconComponent = platform.logoComponent;
                const finalUrl = constructFinalUrl(link.platform, link.url);

                return (
                  <a key={index} href={finalUrl} target="_blank" rel="noopener noreferrer" className="transition-colors p-2 hover:bg-black/10 rounded-full" title={platform.name} style={getTextStyle(true)}>
                    {React.cloneElement(IconComponent, { className: `${isPreview ? 'w-5 h-5' : 'w-6 h-6'}` })}
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div className={`max-w-sm mx-auto ${isPreview ? 'space-y-2' : 'space-y-3'}`}>
          {(!products || products.length === 0) && (
            <div className={`text-center rounded-xl ${isPreview ? 'py-8' : 'py-12'}`}>
              <Package className={`mx-auto mb-3 opacity-40 ${isPreview ? 'w-8 h-8' : 'w-10 h-10'}`} style={{ color: design.text_color, opacity: 0.6 }} />
              <h3 className={`font-medium mb-1 ${isPreview ? 'text-sm' : 'text-base'}`} style={getTextStyle()}>No hay links todavía</h3>
              <p className={`opacity-60 ${isPreview ? 'text-xs' : 'text-sm'}`} style={getTextStyle(true)}>Agregue links para comenzar.</p>
            </div>
          )}
          {products && products.map((product, index) => (
            <ProductButton 
              key={product.id || index} 
              product={product} 
              design={design} 
              onClick={() => handleProductClick(product)} 
              delay={index * 0.05} 
              isPreview={isPreview} 
            />
          ))}
        </div>

        {!isPreview && (
          <div className="text-center mt-12">
            <a href="https://clickmy.link" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors" style={{ color: design.text_color, opacity: 0.5 }}>
              <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/8fa694163_Screenshot_20250624_183832_AdobeAcrobat.jpg" alt="ClickMyLink" className="h-4 w-auto object-contain opacity-70" />
            </a>
          </div>
        )}
      </div>

      {!isPreview && showPurchaseModal && selectedProduct && (
        <PurchaseModal product={selectedProduct} creator={creator} onClose={() => { setShowPurchaseModal(false); setSelectedProduct(null); }} />
      )}
    </div>
  );
});

ProfileView.displayName = 'ProfileView';

export default ProfileView;

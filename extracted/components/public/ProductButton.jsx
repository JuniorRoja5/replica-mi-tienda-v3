import React from "react";
import { motion } from "framer-motion";

export default function ProductButton({ product, design, onClick, delay = 0, isPreview = false }) {
  const isLink = product.type === 'link';
  const displayTitle = product.title;

  // Estilos específicos para temas con glassmorphism
  const isDesertTitanium = design.theme_id === 'desert_titanium';
  const isTitanioNatural = design.theme_id === 'titanio_natural';
  const isCuarzoRosa = design.theme_id === 'cuarzo_rosa';
  const isDark = design.theme_id === 'dark';
  const isLight = design.theme_id === 'light';
  const isPurpleElegant = design.theme_id === 'purple_elegant';
  const isBlueNight = design.theme_id === 'blue_night';
  const isSand = design.theme_id === 'sand';
  const isNeon = design.theme_id === 'neon';
  const isRainbow = design.theme_id === 'rainbow';
  const isAzulMarino = design.theme_id === 'azul_marino';
  const isAmarilloPolito = design.theme_id === 'amarillo_polito';
  const isTitanioEsmeralda = design.theme_id === 'titanio_esmeralda';
  const isBoraPurpura = design.theme_id === 'bora_purpura';
  const isGrafito = design.theme_id === 'grafito';
  const isMandarinaSoft = design.theme_id === 'mandarina_soft';
  const isTitanioCielo = design.theme_id === 'titanio_cielo';
  
  // Configuración de glassmorphism por tema con efecto 3D
  const getGlassConfig = () => {
    if (isCuarzoRosa) {
      return {
        background: 'rgba(245, 225, 220, 0.25)',
        border: '1px solid rgba(216, 169, 164, 0.3)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
        borderRadius: '16px'
      };
    }
    if (isDesertTitanium) {
      return {
        background: 'rgba(245, 241, 236, 0.3)',
        border: '1px solid rgba(211, 187, 163, 0.4)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)',
        borderRadius: '16px'
      };
    }
    if (isTitanioNatural) {
      return {
        background: 'rgba(255, 255, 255, 0.2)',
        border: '1px solid rgba(181, 181, 181, 0.3)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
        borderRadius: '14px'
      };
    }
    if (isDark) {
      return {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)',
        borderRadius: '12px'
      };
    }
    if (isLight) {
      return {
        background: 'rgba(255, 255, 255, 0.6)',
        border: '1px solid rgba(31, 41, 55, 0.1)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)',
        borderRadius: '12px'
      };
    }
    if (isPurpleElegant) {
      return {
        background: 'rgba(224, 231, 255, 0.08)',
        border: '1px solid rgba(224, 231, 255, 0.15)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)',
        borderRadius: '12px'
      };
    }
    if (isBlueNight) {
      return {
        background: 'rgba(224, 231, 255, 0.08)',
        border: '1px solid rgba(224, 231, 255, 0.15)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)',
        borderRadius: '12px'
      };
    }
    if (isSand) {
      return {
        background: 'rgba(255, 255, 255, 0.4)',
        border: '1px solid rgba(67, 58, 63, 0.15)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)',
        borderRadius: '12px'
      };
    }
    if (isNeon) {
      return {
        background: 'rgba(224, 255, 255, 0.08)',
        border: '1px solid rgba(224, 255, 255, 0.15)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)',
        borderRadius: '12px'
      };
    }
    if (isRainbow) {
      return {
        background: 'rgba(255, 255, 255, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
        borderRadius: '16px'
      };
    }
    if (isAzulMarino) {
      return {
        background: 'rgba(74, 144, 226, 0.1)',
        border: '1px solid rgba(74, 144, 226, 0.2)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)',
        borderRadius: '12px'
      };
    }
    if (isAmarilloPolito) {
      return {
        background: 'rgba(246, 196, 83, 0.2)',
        border: '1px solid rgba(246, 196, 83, 0.3)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
        borderRadius: '14px'
      };
    }
    if (isTitanioEsmeralda) {
      return {
        background: 'rgba(46, 125, 96, 0.1)',
        border: '1px solid rgba(46, 125, 96, 0.2)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)',
        borderRadius: '12px'
      };
    }
    if (isBoraPurpura) {
      return {
        background: 'rgba(138, 99, 210, 0.1)',
        border: '1px solid rgba(138, 99, 210, 0.2)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
        borderRadius: '14px'
      };
    }
    if (isGrafito) {
      return {
        background: 'rgba(179, 179, 179, 0.1)',
        border: '1px solid rgba(179, 179, 179, 0.2)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4)',
        borderRadius: '12px'
      };
    }
    if (isMandarinaSoft) {
      return {
        background: 'rgba(248, 116, 85, 0.15)',
        border: '1px solid rgba(248, 116, 85, 0.25)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '16px'
      };
    }
    if (isTitanioCielo) {
      return {
        background: 'rgba(191, 212, 231, 0.2)',
        border: '1px solid rgba(191, 212, 231, 0.3)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)',
        borderRadius: '12px'
      };
    }
    // Fallback para temas no específicos
    return {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
      borderRadius: '12px'
    };
  };

  const glassConfig = getGlassConfig();
  
  const buttonStyle = {
    width: '100%',
    padding: isPreview ? '14px 18px' : '20px 24px',
    borderRadius: glassConfig.borderRadius,
    background: glassConfig.background,
    backdropFilter: glassConfig.backdropFilter,
    border: glassConfig.border,
    boxShadow: glassConfig.boxShadow,
    color: design.button_font_color || design.text_color,
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: isPreview ? '14px' : '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minHeight: isPreview ? 'auto' : '76px',
    position: 'relative',
    overflow: 'hidden',
    transform: 'translateY(0px)' // Preparar para efecto hover
  };

  // Configuración del ícono/thumbnail por tema
  const getIconConfig = () => {
    if (isCuarzoRosa) {
      return {
        backgroundColor: 'rgba(207, 175, 158, 0.2)',
        borderRadius: '12px'
      };
    }
    if (isDesertTitanium) {
      return {
        backgroundColor: 'rgba(211, 187, 163, 0.25)',
        borderRadius: '12px'
      };
    }
    if (isTitanioNatural) {
      return {
        backgroundColor: 'rgba(181, 181, 181, 0.2)',
        borderRadius: '10px'
      };
    }
    if (isDark) {
      return {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '10px'
      };
    }
    if (isLight) {
      return {
        backgroundColor: 'rgba(31, 41, 55, 0.08)',
        borderRadius: '10px'
      };
    }
    // Configuraciones para otros temas
    if (isRainbow) {
      return {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '12px'
      };
    }
    if (isAzulMarino || isBlueNight || isPurpleElegant || isNeon || isGrafito) {
      return {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '10px'
      };
    }
    if (isAmarilloPolito || isTitanioEsmeralda || isBoraPurpura || isMandarinaSoft || isTitanioCielo || isSand) {
      return {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '10px'
      };
    }
    return {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: '10px'
    };
  };

  const iconConfig = getIconConfig();

  const ButtonContent = () => (
    <>
      {/* Thumbnail/Icon */}
      <div 
        className="flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center"
        style={{
          width: isPreview ? '48px' : '56px',
          height: isPreview ? '48px' : '56px',
          backgroundColor: iconConfig.backgroundColor,
          borderRadius: iconConfig.borderRadius,
        }}
      >
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={displayTitle} 
            className="w-full h-full object-cover"
            style={{ borderRadius: iconConfig.borderRadius }}
          />
        ) : isLink ? (
          <span style={{ fontSize: isPreview ? '22px' : '26px', color: design.button_font_color || design.text_color }}>
            {product.icon || '🔗'}
          </span>
        ) : (
          <span style={{ fontSize: isPreview ? '22px' : '26px', color: design.button_font_color || design.text_color }}>
            📦
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 
          className="font-semibold leading-tight"
          style={{ 
            fontSize: isPreview ? '15px' : '18px',
            color: design.button_font_color || design.text_color,
            marginBottom: product.subtitle ? '6px' : '0',
            fontWeight: '600',
            textShadow: (isDark || isPurpleElegant || isBlueNight || isNeon || isRainbow || isAzulMarino || isGrafito || isMandarinaSoft) ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none'
          }}
        >
          {displayTitle}
        </h3>
        
        {/* Subtitle */}
        {product.subtitle && (
          <p 
            className="leading-tight"
            style={{ 
              fontSize: isPreview ? '13px' : '15px',
              color: design.text_secondary_color || design.button_font_color || design.text_color,
              opacity: 0.85,
              fontWeight: '400',
              textShadow: (isDark || isPurpleElegant || isBlueNight || isNeon || isRainbow || isAzulMarino || isGrafito || isMandarinaSoft) ? '0 1px 2px rgba(0, 0, 0, 0.2)' : 'none'
            }}
          >
            {product.subtitle}
          </p>
        )}
      </div>
    </>
  );

  // Efectos hover específicos por tema con mayor elevación 3D
  const getHoverEffect = () => {
    if (isCuarzoRosa) {
      return {
        background: 'rgba(245, 225, 220, 0.35)',
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(0, 0, 0, 0.12)'
      };
    }
    if (isDesertTitanium) {
      return {
        background: 'rgba(245, 241, 236, 0.4)',
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)'
      };
    }
    if (isTitanioNatural) {
      return {
        background: 'rgba(255, 255, 255, 0.3)',
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(0, 0, 0, 0.12)'
      };
    }
    // Efectos para temas oscuros
    if (isDark || isPurpleElegant || isBlueNight || isNeon || isGrafito) {
      return {
        background: design.theme_id === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 
                   design.theme_id === 'grafito' ? 'rgba(179, 179, 179, 0.15)' :
                   'rgba(224, 231, 255, 0.12)',
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6), 0 4px 12px rgba(0, 0, 0, 0.4)'
      };
    }
    if (isRainbow) {
      return {
        background: 'rgba(255, 255, 255, 0.3)',
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(0, 0, 0, 0.12)'
      };
    }
    if (isAzulMarino) {
      return {
        background: 'rgba(74, 144, 226, 0.15)',
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)'
      };
    }
    if (isMandarinaSoft) {
      return {
        background: 'rgba(248, 116, 85, 0.2)',
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15)'
      };
    }
    // Efectos para temas claros
    return {
      background: 'rgba(255, 255, 255, 0.8)',
      transform: 'translateY(-3px)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)'
    };
  };

  const motionProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.4 },
    whileHover: isPreview ? {} : getHoverEffect(),
    whileTap: isPreview ? {} : { scale: 0.98 },
    style: buttonStyle,
  };

  if (isLink) {
    return (
      <motion.a 
        href={product.external_url} 
        target="_blank" 
        rel="noopener noreferrer" 
        {...motionProps}
      >
        <ButtonContent />
      </motion.a>
    );
  }

  return (
    <motion.button onClick={onClick} {...motionProps}>
      <ButtonContent />
    </motion.button>
  );
}
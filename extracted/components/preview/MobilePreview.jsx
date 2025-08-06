import React from 'react';
import ProfileView from '../public/ProfileView';

export default function MobilePreview({ creator, products, className = "" }) {
  return (
    <div className={`sticky top-8 ${className}`}>
      {/* Dispositivo móvil moderno y estilizado - Tamaño optimizado */}
      <div className="relative mx-auto bg-black rounded-[2.2rem] h-[580px] w-[280px] shadow-2xl p-[2px]">
        {/* Notch superior moderno */}
        <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-14 h-0.5 bg-gray-800 rounded-full z-10"></div>
        
        {/* Pantalla principal */}
        <div className="relative w-full h-full bg-white rounded-[2rem] overflow-hidden">
          {creator ? (
            <div className="w-full h-full overflow-y-auto" style={{ background: creator.design_settings?.background || '#1a1a1a' }}>
              <div className="w-full h-full">
                <ProfileView creator={creator} products={products} isPreview={true} />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-slate-50">
              <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Preview Label */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600 font-medium">Vista Previa en Tiempo Real</p>
        <p className="text-xs text-gray-500">Cómo ven tus visitantes tu página</p>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Creator, Product, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Eye, Save, Check } from "lucide-react";
import { motion } from "framer-motion";
import ProfileView from "../components/public/ProfileView";
import DesignCustomizer from "../components/preview/DesignCustomizer";
import { PREDEFINED_THEMES } from "../components/preview/themes";

export default function Design() {
  const [creator, setCreator] = useState(null);
  const [editableCreator, setEditableCreator] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [changesSaved, setChangesSaved] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      const creators = await Creator.filter({ created_by: user.email });
      if (creators.length > 0) {
        const currentCreator = creators[0];
        setCreator(currentCreator);

        // Al entrar, la vista editable siempre empieza con el tema oscuro
        const darkTheme = PREDEFINED_THEMES.find(t => t.id === 'dark');
        const initialDesignSettings = {
          theme_id: darkTheme.id,
          theme_name: darkTheme.name,
          background: darkTheme.colors.background,
          background_type: 'solid', // Added
          text_color: darkTheme.colors.text_color,
          text_secondary_color: darkTheme.colors.text_secondary_color, // Added
          font_family: darkTheme.fonts[0],
          button_color: darkTheme.colors.button_color, // Added
          button_font_color: darkTheme.colors.button_font_color, // Added
          button_hover_color: darkTheme.colors.button_hover_color, // Added
        };
        
        setEditableCreator({
          ...currentCreator,
          design_settings: { ...initialDesignSettings, ...currentCreator.design_settings }
        });

        const activeProducts = await Product.filter({ 
          creator_id: currentCreator.id,
          is_active: true 
        });
        const sortedProducts = activeProducts.sort((a, b) => 
          (a.sort_order || 0) - (b.sort_order || 0)
        );
        setProducts(sortedProducts);
      }
    } catch (error) {
      console.error("Error loading design data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDesignChange = (newDesignSettings) => {
      setEditableCreator(prev => ({
          ...prev,
          design_settings: newDesignSettings
      }));
      setChangesSaved(false);
  };

  const handleSaveChanges = async () => {
      if (!editableCreator) return;
      setIsSaving(true);
      try {
          await Creator.update(creator.id, { design_settings: editableCreator.design_settings });
          setCreator(editableCreator);
          setChangesSaved(true);
          setTimeout(() => setChangesSaved(false), 3000);
      } catch (error) {
          console.error("Error saving changes:", error);
      } finally {
          setIsSaving(false);
      }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden p-4 mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Diseño</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(true)}
              className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Left Panel - Design Controls */}
        <div className="w-1/2 bg-white overflow-y-auto">
          <div className="p-8 max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Personaliza tu Diseño</h1>
              <p className="text-gray-600">Modifica la apariencia de tu página y ve los cambios en tiempo real</p>
            </motion.div>

            {editableCreator && (
              <DesignCustomizer
                designSettings={editableCreator.design_settings}
                onDesignChange={handleDesignChange}
              />
            )}

            <div className="pt-8 border-t border-gray-100 mt-8">
              <Button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className={`w-full h-12 text-base font-semibold transition-all ${
                  changesSaved 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } ${isSaving ? 'opacity-50' : ''}`}
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Guardando...
                  </>
                ) : changesSaved ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    ¡Cambios Guardados!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Guardar Tema
                  </>
                )}
              </Button>
              {changesSaved && (
                <p className="text-center text-sm text-green-600 mt-2">
                  Tu diseño se ha aplicado exitosamente a toda tu cuenta
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="w-1/2 bg-gray-100 flex items-start justify-center p-8">
          <div className="flex flex-col items-center pt-4">
            <div className="relative bg-black rounded-[2.8rem] h-[680px] w-[340px] shadow-2xl p-[2px] mb-6">
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gray-800 rounded-full z-10"></div>
              <div className="relative w-full h-full bg-white rounded-[2.6rem] overflow-hidden">
                {editableCreator ? (
                  <div className="w-full h-full overflow-y-auto" style={{ 
                    background: editableCreator.design_settings?.background || '#000000',
                    fontFamily: editableCreator.design_settings?.font_family || 'Inter'
                  }}>
                    <ProfileView creator={editableCreator} products={products} isPreview={true} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full bg-slate-50">
                    <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 font-medium">Vista Previa en Tiempo Real</p>
              <p className="text-xs text-gray-500 mt-1">Ve tus cambios al instante</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden p-4 space-y-6">
        {editableCreator && (
          <DesignCustomizer
            designSettings={editableCreator.design_settings}
            onDesignChange={handleDesignChange}
          />
        )}
        <div className="pt-6 border-t border-gray-200">
          <Button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className={`w-full h-12 text-base font-semibold transition-all ${
              changesSaved 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } ${isSaving ? 'opacity-50' : ''}`}
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Guardando...
              </>
            ) : changesSaved ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                ¡Cambios Guardados!
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Guardar Tema
              </>
            )}
          </Button>
          {changesSaved && (
            <p className="text-center text-sm text-green-600 mt-2">
              Tu diseño se ha aplicado exitosamente a toda tu cuenta
            </p>
          )}
        </div>
      </div>

      {/* Mobile Preview Modal */}
      {showPreview && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="w-full max-w-sm relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(false)}
              className="absolute -top-12 right-0 text-white hover:bg-white/10"
            >
              Cerrar
            </Button>
            <div className="relative mx-auto bg-black rounded-[2.5rem] h-[600px] w-[320px] shadow-xl p-[2px]">
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-800 rounded-full z-10"></div>
              <div className="relative w-full h-full bg-white rounded-[2.3rem] overflow-hidden">
                {editableCreator ? (
                  <div className="w-full h-full overflow-y-auto" style={{ 
                    background: editableCreator.design_settings?.background || '#000000',
                    fontFamily: editableCreator.design_settings?.font_family || 'Inter'
                  }}>
                    <ProfileView creator={editableCreator} products={products} isPreview={true} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full bg-slate-800">
                    <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

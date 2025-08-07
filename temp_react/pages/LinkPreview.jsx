
import React, { useState, useEffect, Suspense, useMemo, useCallback, useRef } from "react";
import { Creator, Product, User } from "@/api/entities";
import { useLanguage } from "../components/LanguageProvider";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Copy, Check, Edit, Eye, Plus, ArrowLeft, Mail, Package, Phone, GraduationCap, Crown, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProductsSection from "../components/link-preview/ProductsSection";
import ProfileView from "../components/public/ProfileView";
import CreateSelectionModal from "../components/products/CreateSelectionModal";
import LinkForm from "../components/products/LinkForm";
import ProductButton from "../components/public/ProductButton";
import { SOCIAL_PLATFORMS_MAP } from '../components/profile/socialPlatforms';

const PRODUCT_TYPES = [
  {
    id: 'digital_product',
    title: 'Producto Digital',
    description: 'Vende archivos digitales como PDFs, guías, plantillas, e-books o contenido exclusivo',
    icon: Package,
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-200'
  },
  {
    id: 'consultation',
    title: 'Llamada de Consultoría',
    description: 'Ofrece sesiones 1 a 1 de coaching, mentoría o consultoría con agendamiento automático',
    icon: Phone,
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    borderColor: 'border-green-200'
  },
  {
    id: 'course',
    title: 'Curso Digital',
    description: 'Crea y vende un curso digital con lecciones, material descargable y seguimiento',
    icon: GraduationCap,
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-200'
  },
  {
    id: 'membership',
    title: 'Membresía Recurrente',
    description: 'Ofrece acceso exclusivo con pagos mensuales, semestrales o anuales recurrentes',
    icon: Crown,
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    borderColor: 'border-indigo-200'
  }
];

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


export default function LinkPreview() {
  const { t } = useLanguage();
  const [creator, setCreator] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Estados para controlar las vistas
  const [currentView, setCurrentView] = useState('main');
  const [selectedProductType, setSelectedProductType] = useState(null);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [wizardStep, setWizardStep] = useState(1); // Estado para el paso del wizard
  const wizardRef = useRef(null);

  // Usar un callback estable para evitar re-renders innecesarios
  const handlePreviewDataChange = useCallback((newData) => {
    setPreviewData(newData);
  }, []);

  const handleWizardStepChange = useCallback((step) => {
    setWizardStep(step);
  }, []);

  const handleWizardBack = () => {
    if (wizardRef.current) {
      wizardRef.current.goBack();
    }
  };

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
        // Fetch all products, not just active ones
        const allProducts = await Product.filter({ 
          creator_id: currentCreator.id 
        });
        const sortedProducts = allProducts.sort((a, b) => 
          (a.sort_order || 0) - (b.sort_order || 0)
        );
        setProducts(sortedProducts);
      } else {
        setCreator(null);
      }
    } catch (error) {
      console.error("Error loading preview data:", error);
      setCreator(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const publicUrl = creator ? `${window.location.origin}/u/${creator.username}` : '';

  const handleCopyUrl = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateSelection = (type) => {
    setShowSelectionModal(false);
    setEditingProduct(null); // Ensure editingProduct is null when creating
    if (type === 'link') {
      setShowLinkForm(true);
    } else if (type === 'product') {
      setCurrentView('product-types');
    } else if (type === 'show-modal') {
      setShowSelectionModal(true);
    }
  };

  const handleProductTypeSelect = (productType) => {
    setSelectedProductType(productType);
    setPreviewData({
      title: 'Título del producto',
      subtitle: 'Subtítulo del producto',
      image_url: '',
      price: 0,
      type: 'product',
      product_type: productType,
      is_active: true // New products are active by default for preview
    });
    setCurrentView('product-form');
    handleWizardStepChange(1); // Ensure wizard starts from step 1
  };

  const handleBackToProductTypes = () => {
    setCurrentView('product-types');
    setSelectedProductType(null);
    setPreviewData(null);
    handleWizardStepChange(1); // Reset wizard step when going back to product types
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedProductType(null);
    setPreviewData(null);
    setEditingProduct(null);
    handleWizardStepChange(1); // Resetear el paso del wizard
  };

  const handleSaveItem = async (itemData) => {
    try {
      const generateHandle = (title) => {
        if (!title) return `item-${Date.now().toString(36).slice(-4)}`;
        return title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .slice(0, 50); // Limit handle length
      };

      let finalData = { ...itemData };
      if (!finalData.handle) {
          finalData.handle = `${generateHandle(finalData.title)}-${Date.now().toString(36).slice(-4)}`;
      }

      if (editingProduct) {
        await Product.update(editingProduct.id, finalData);
      } else {
        const dataWithCreator = {
          ...finalData,
          creator_id: creator.id,
          sort_order: products.length
        };
        await Product.create(dataWithCreator);
      }
      
      // Reset all relevant states after saving
      setCurrentView('main');
      setShowLinkForm(false); // Close link form if it was open
      setEditingProduct(null);
      setSelectedProductType(null);
      setPreviewData(null);
      handleWizardStepChange(1); // Reset wizard step
      loadData(); // Reload data to reflect changes
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleEditItem = (productToEdit) => {
    setEditingProduct(productToEdit); // Establecer el producto que se está editando

    if (productToEdit.type === 'link') {
      // Si es un enlace, mostrar el formulario de enlaces
      setShowLinkForm(true);
    } else {
      // Si es un producto, abrir el asistente de creación/edición
      setSelectedProductType(productToEdit.product_type || 'digital_product');
      setPreviewData(productToEdit); // Cargar datos existentes para la vista previa
      setCurrentView('product-form'); // Cambiar a la vista del formulario
      handleWizardStepChange(1); // Asegurarse de que el asistente comience en el paso 1
    }
  };

  // Memoize preview products to prevent unnecessary re-renders
  const previewProducts = useMemo(() => {
    if (!previewData && !editingProduct) {
      return products;
    }

    let updatedProducts = [...products];

    if (editingProduct) {
      const index = updatedProducts.findIndex(p => p.id === editingProduct.id);
      if (index !== -1) {
        // If editing an existing product and have preview data, update it
        // Otherwise, if just editing without live preview, keep the original until saved
        updatedProducts[index] = previewData ? { ...updatedProducts[index], ...previewData } : updatedProducts[index];
      } else {
        // This case should ideally not happen if editing, but for safety
        if (previewData) updatedProducts.push(previewData);
      }
    } else if (previewData) {
      // If creating a new product and have preview data
      updatedProducts.push(previewData);
    }
    return updatedProducts;
  }, [products, previewData, editingProduct]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Vista de formulario de producto específico con wizard
  if (currentView === 'product-form') {
    const productTypeData = PRODUCT_TYPES.find(p => p.id === selectedProductType);
    const ProductFormWizard = React.lazy(() => import('../components/products/ProductFormWizard'));
    const ProductPagePreview = React.lazy(() => import('../components/public/ProductPagePreview'));
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Layout */}
        <div className="lg:hidden p-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={wizardStep === 1 ? handleBackToMain : handleWizardBack}
                className="text-gray-600 hover:text-gray-900 p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{editingProduct ? 'Editar' : 'Crear'} {productTypeData?.title}</h1>
                <p className="text-gray-600">Completa la información del producto</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Suspense fallback={<div className="text-center py-8">Cargando...</div>}>
                <ProductFormWizard
                  ref={wizardRef}
                  product={editingProduct}
                  onSave={handleSaveItem}
                  onCancel={handleBackToMain}
                  productType={selectedProductType}
                  isInline={true}
                  onDataChange={handlePreviewDataChange}
                  onStepChange={handleWizardStepChange}
                />
              </Suspense>
            </div>
          </motion.div>
        </div>

        {/* Desktop Layout - Integrado en la vista principal */}
        <div className="hidden lg:flex">
          {/* Left Panel - Formulario */}
          <div className="w-1/2 p-8 bg-white overflow-y-auto max-h-screen">
            <div className="max-w-2xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  {wizardStep > 1 ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleWizardBack}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Atrás
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBackToMain}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver a mi tienda
                    </Button>
                  )}
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {editingProduct ? 'Editar' : 'Crear'} {productTypeData?.title}
                </h1>
                <p className="text-gray-600">
                  {productTypeData?.description}
                </p>
              </motion.div>

              <Suspense fallback={<div className="text-center py-8">Cargando...</div>}>
                <ProductFormWizard
                  ref={wizardRef}
                  product={editingProduct}
                  onSave={handleSaveItem}
                  onCancel={handleBackToMain}
                  productType={selectedProductType}
                  isInline={true}
                  onDataChange={handlePreviewDataChange}
                  onStepChange={handleWizardStepChange}
                />
              </Suspense>
            </div>
          </div>

          {/* Right Panel - Vista Previa */}
          <div className="w-1/2 bg-gray-100 flex items-center justify-center p-8">
            <div className="flex flex-col items-center">
              <div className="relative bg-black rounded-[2.8rem] h-[680px] w-[340px] shadow-2xl p-[2px] mb-6">
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gray-800 rounded-full z-10"></div>
                <div 
                  className="relative w-full h-full bg-white rounded-[2.6rem] overflow-hidden"
                >
                  {wizardStep >= 2 && previewData ? (
                    <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>}>
                      <ProductPagePreview productData={previewData} creator={creator} />
                    </Suspense>
                  ) : creator ? (
                    <div className="w-full h-full overflow-y-auto" style={{ background: creator.design_settings?.background || '#1a1a1a' }}>
                      <ProfileView 
                        creator={creator} 
                        products={previewProducts.filter(p => p.is_active)} 
                        isPreview={true} 
                      />
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 flex items-center justify-center h-full">
                      <p>Cargando previsualización...</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-center max-w-sm">
                <p className="text-sm text-gray-600 mb-2">Vista previa en tiempo real</p>
                <p className="text-xs text-gray-500">Los cambios en el formulario se reflejarán aquí</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de tipos de productos
  if (currentView === 'product-types') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Layout */}
        <div className="lg:hidden p-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToMain}
                className="text-gray-600 hover:text-gray-900 p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Elige el tipo de producto</h1>
                <p className="text-gray-600">Selecciona qué tipo de producto digital quieres crear</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {PRODUCT_TYPES.map((productType, index) => {
                const Icon = productType.icon;
                return (
                  <motion.div
                    key={productType.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-white border-2 ${productType.borderColor} rounded-xl p-6 group`}
                    onClick={() => handleProductTypeSelect(productType.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-2xl ${productType.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-8 h-8 ${productType.textColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-800">
                          {productType.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {productType.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="w-full p-8 bg-white min-h-screen">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-6xl mx-auto space-y-8"
            >
              <div className="flex items-center gap-4 mb-8">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToMain}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a mi tienda
                </Button>
              </div>
              
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Elige el tipo de producto</h1>
                <p className="text-gray-600 text-xl">Selecciona qué tipo de producto digital quieres crear</p>
              </div>

              <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
                {PRODUCT_TYPES.map((productType, index) => {
                  const Icon = productType.icon;
                  return (
                    <motion.div
                      key={productType.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.03] bg-white border-2 ${productType.borderColor} rounded-2xl p-8 group relative overflow-hidden`}
                      onClick={() => handleProductTypeSelect(productType.id)}
                    >
                      <div className={`absolute inset-0 ${productType.bgColor} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                      
                      <div className="relative z-10">
                        <div className={`w-20 h-20 rounded-2xl ${productType.bgColor} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-10 h-10 ${productType.textColor}`} />
                        </div>
                        
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800">
                            {productType.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {productType.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }
  
  const allSocialLinks = creator ? [
    ...(creator.social_links || []),
    ...(creator.custom_social_links || []).map(custom => ({ ...custom, platform: custom.id, isCustom: true }))
  ] : [];

  // Vista principal de Mi Tienda
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header - REDUCED SPACING */}
      <div className="lg:hidden p-4 pb-1">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-lg font-bold text-gray-900 text-left mb-1">Mi Tienda</h1>
          <p className="text-gray-600 text-xs text-left">Gestiona tu perfil público y contenido</p>
        </motion.div>
      </div>

      {/* Desktop Layout - NO CHANGES */}
      <div className="hidden lg:flex">
        {/* Left Panel - Content */}
        <div className="w-1/2 p-8 bg-white">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Mi Tienda</h1>
              <p className="text-gray-600">Gestiona tu perfil público y contenido</p>
            </motion.div>

            {creator && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    {creator.avatar_url ? (
                      <img 
                        src={creator.avatar_url} 
                        alt={creator.display_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xl">
                          {creator.display_name ? creator.display_name[0] : ''}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{creator.display_name}</h3>
                      <p className="text-gray-600">@{creator.username}</p>
                    </div>
                    <Link to={createPageUrl("Profile")}>
                      <Button variant="outline" size="sm" className="bg-white">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </Link>
                  </div>
                  
                  {creator.bio && (
                    <p className="text-gray-700 mb-4">{creator.bio}</p>
                  )}
                  
                  <div className="flex items-center gap-4">
                    {allSocialLinks.map((link, index) => {
                      if (link.isCustom) {
                        return (
                           <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800 transition-colors" title={link.name}>
                             {link.icon_url ? 
                               <img src={link.icon_url} alt={link.name} className="w-5 h-5 rounded-full object-cover" /> :
                               <Globe className="w-5 h-5" />
                             }
                           </a>
                        );
                      }

                      const platform = SOCIAL_PLATFORMS_MAP.get(link.platform);
                      if (!platform || !link.url) return null;
                      
                      const IconComponent = platform.logoComponent;
                      const finalUrl = constructFinalUrl(link.platform, link.url);

                      return (
                        <a key={index} href={finalUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800 transition-colors" title={platform.name}>
                          {React.cloneElement(IconComponent, { className: 'w-5 h-5' })}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {creator && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ProductsSection 
                  products={products} 
                  onUpdate={loadData}
                  creator={creator}
                  onCreateSelection={handleCreateSelection}
                  onEdit={handleEditItem}
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Panel - Vista Previa */}
        <div className="w-1/2 bg-gray-100 flex items-center justify-center p-8">
          <div className="flex flex-col items-center">
            <div className="relative bg-black rounded-[2.8rem] h-[680px] w-[340px] shadow-2xl p-[2px] mb-6">
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gray-800 rounded-full z-10"></div>
              <div className="relative w-full h-full bg-white rounded-[2.6rem] overflow-hidden">
                {creator ? (
                  <div className="w-full h-full overflow-y-auto" style={{ background: creator.design_settings?.background || '#1a1a1a' }}>
                    <ProfileView creator={creator} products={products.filter(p => p.is_active)} isPreview={true} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full bg-slate-50">
                    <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-center max-w-sm">
              <p className="text-sm text-gray-600 mb-2">Tu enlace público:</p>
              <div className="flex items-center gap-2 bg-white rounded-lg p-3 border">
                <input
                  type="text"
                  value={publicUrl}
                  readOnly
                  className="flex-1 text-sm text-gray-700 bg-transparent border-none outline-none"
                />
                <Button
                  onClick={handleCopyUrl}
                  size="sm"
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-700"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - OPTIMIZED */}
      <div className="lg:hidden px-4 space-y-2">
        {creator && (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="space-y-4">
                  {/* Información principal del perfil */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {creator.avatar_url ? (
                        <img 
                          src={creator.avatar_url} 
                          alt={creator.display_name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xl">
                            {creator.display_name ? creator.display_name[0] : ''}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">{creator.display_name}</h3>
                        <Link to={createPageUrl("Profile")}>
                          <Button variant="ghost" size="icon" className="h-6 w-6 p-1 text-gray-500 hover:bg-gray-100">
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                      <p className="text-gray-600 text-sm">@{creator.username}</p>
                      
                      {creator.bio && (
                        <p className="text-gray-700 leading-relaxed mt-2 text-sm">{creator.bio}</p>
                      )}
                    </div>
                  </div>

                  {/* Redes sociales en fila horizontal */}
                  {allSocialLinks && Array.isArray(allSocialLinks) && allSocialLinks.length > 0 && (
                    <div className="flex items-center justify-start gap-3 flex-wrap">
                      {allSocialLinks.map((link, index) => {
                        if (link.isCustom) {
                          return (
                            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800 transition-colors" title={link.name}>
                              {link.icon_url ? (
                                <img src={link.icon_url} alt={link.name} className="w-5 h-5 rounded-full object-cover" />
                              ) : (
                                <Globe className="w-5 h-5" />
                              )}
                            </a>
                          );
                        }

                        const platform = SOCIAL_PLATFORMS_MAP.get(link.platform);
                        if (!platform || !link.url) return null;
                        
                        const IconComponent = platform.logoComponent;
                        const finalUrl = constructFinalUrl(link.platform, link.url);

                        return (
                          <a key={index} href={finalUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800 transition-colors" title={platform.name}>
                            {React.cloneElement(IconComponent, { className: 'w-5 h-5' })}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ProductsSection 
                products={products} 
                onUpdate={loadData}
                creator={creator}
                onCreateSelection={handleCreateSelection}
                onEdit={handleEditItem}
              />
            </motion.div>
          </>
        )}
      </div>

      {showSelectionModal && (
        <CreateSelectionModal
          onSelect={handleCreateSelection}
          onClose={() => setShowSelectionModal(false)}
        />
      )}

      {showLinkForm && (
        <LinkForm
          link={editingProduct}
          onSave={handleSaveItem}
          onCancel={() => {
            setShowLinkForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  User,
  Sparkles,
  Menu,
  X,
  Link as LinkIcon,
  Palette,
  MoreHorizontal,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
  Copy,
  Check,
  Users,
  Calendar,
  Mail,
  MessageSquareReply,
  ChevronDown,
  Plus,
  Eye,
  ExternalLink,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { User as UserEntity, Creator, Product } from "@/api/entities";
import HomePage from "./Home";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProfileView from "../components/public/ProfileView";
import ProductPagePreview from "../components/public/ProductPagePreview";
// 👇 SE RESTAURAN LAS IMPORTACIONES DEL IDIOMA CON LA RUTA CORRECTA
import { useLanguage } from "../components/LanguageProvider";
import LanguageSwitcher from "../components/LanguageSwitcher";

function LayoutContent({ children, currentPageName }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [user, setUser] = React.useState({ fake: true });
  const [creator, setCreator] = React.useState({ display_name: "Usuario Demo", username: "demouser" });
  const [products, setProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [copied, setCopied] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [previewMode, setPreviewMode] = useState('profile');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { t } = useLanguage(); // <-- SE RESTAURA LA FUNCIÓN DE TRADUCCIÓN

  const handleLogout = () => {
    console.log("Logout simulado.");
  };

  const publicUrl = creator ? `${window.location.origin}/PublicStorefront?u=${creator.username}` : '';

  const handleCopyUrl = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenPublicUrl = () => {
    if (!publicUrl) return;
    window.open(publicUrl, '_blank');
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setPreviewMode('product');
  };

  const handleBackToProfile = () => {
    setPreviewMode('profile');
    setSelectedProduct(null);
  };

  const shouldShowPreviewButton = currentPageName === 'LinkPreview' || currentPageName === 'Design';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-[#6366f1] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Eliminamos la redirección a HomePage para poder ver el Layout
  // if (!user) {
  //  return <HomePage />;
  // }

  const mainNavigationItems = [
    { title: t('dashboard'), url: createPageUrl("Dashboard"), icon: LayoutDashboard },
    { title: t('orders'), url: createPageUrl("orders"), icon: TrendingUp },
    { title: "Mi Tienda", url: createPageUrl("LinkPreview"), icon: LinkIcon },
    { title: "Diseño", url: createPageUrl("Design"), icon: Palette },
    { title: "Clientes", url: createPageUrl("Customers"), icon: Users },
    { title: "Estadísticas", url: createPageUrl("Statistics"), icon: BarChart3 },
    { title: "Referidos", url: createPageUrl("Referrals"), icon: Users },
    { title: "Calendario", url: createPageUrl("Calendar"), icon: Calendar },
    { title: "Secuencias de Email", url: createPageUrl("EmailSequences"), icon: Mail },
    { title: "Auto-respuestas IG", url: createPageUrl("InstagramAutomation"), icon: MessageSquareReply },
    { title: "Pregúntale a Link", url: createPageUrl("AskLink"), icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <style>{`
        :root { --clickmy-primary: #6366f1; --clickmy-secondary: #4f46e5; --clickmy-accent: #7c3aed; }
        .w-4\\.5 { width: 1.125rem; } .h-4\\.5 { height: 1.125rem; }
        .bottom-nav { position: fixed !important; bottom: 0 !important; left: 0 !important; right: 0 !important; z-index: 50 !important; }
        .main-content-mobile { padding-bottom: 80px !important; }
        .sidebar-glass { background-color: #E4F0FE; border-right: 1px solid #e5e7eb; }
        .mobile-nav-glass { background: rgba(228, 240, 254, 0.75); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-top: 1px solid rgba(99, 102, 241, 0.1); }
        .glass-card { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3); }
        .sidebar-nav-item { transition: all 0.15s ease-in-out; }
        .sidebar-nav-item:hover { transform: translateX(2px); }
      `}</style>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        <div className="w-64 sidebar-glass shadow-2xl flex flex-col">
          <div className="px-4 pt-4 pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/98cc1bfb6_Screenshot_20250703_182921_Chrome.jpg" alt="ClickMyLink" className="h-10 w-auto object-contain desktop-logo" />
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-between overflow-y-auto">
            <nav className="px-3 py-3">
              <div className="space-y-1.5">
                {mainNavigationItems.map((item) => (
                  <Link key={item.title} to={item.url} className={`sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${location.pathname === item.url ? 'bg-indigo-100 text-indigo-600 font-semibold' : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50'}`}>
                    <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                    <span className="truncate text-sm">{item.title}</span>
                  </Link>
                ))}
              </div>
            </nav>
            <div className="p-3 border-t border-gray-200 space-y-3 flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-800 hover:bg-black/5 transition-all duration-150 group">
                    <div className="relative">
                      {creator?.avatar_url ? (<img src={creator.avatar_url} alt={creator.display_name} className="w-9 h-9 rounded-full object-cover border-2 border-transparent" />) : (<div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center border-2 border-transparent"><User className="w-4.5 h-4.5 text-gray-600" /></div>)}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#E4F0FE]"></div>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-gray-900 truncate">{creator?.display_name || 'Usuario Demo'}</div>
                      <div className="text-xs text-gray-500 truncate">@{creator?.username || 'demouser'}</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="top" className="w-56 bg-white border-gray-200 shadow-xl rounded-xl p-2" sideOffset={8}>
                  <div className="px-3 py-2 border-b border-gray-100 mb-2">
                    <div className="text-sm font-medium text-gray-900 truncate">{creator?.display_name || 'Usuario Demo'}</div>
                    <div className="text-xs text-gray-500 truncate">{user?.email || 'demo@email.com'}</div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl("Profile")} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"><User className="w-4 h-4" /> Editar Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"><Plus className="w-4 h-4" /> Agregar otra cuenta</DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2 bg-gray-200" />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex justify-center">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="h-12 glass-card border-b border-gray-200/50 flex items-center justify-between px-6 shadow-sm">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {currentPageName}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {publicUrl && (
                <div className="relative flex items-center gap-2 bg-white/50 rounded-full px-3 py-1.5 border border-gray-200 shadow-sm">
                    <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium text-sm truncate max-w-[180px]">{publicUrl.replace('https://','').replace('http://','')}</a>
                  <Button onClick={handleCopyUrl} size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700 p-1 h-auto rounded-full">
                    {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                  </Button>
                  <AnimatePresence>
                  {copied && (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="absolute right-1/2 translate-x-1/2 -top-8 text-xs font-semibold px-2 py-1 bg-gray-800 text-white rounded-md shadow-lg whitespace-nowrap">
                        Link copiado
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
          <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-50/50 via-white/30 to-blue-50/20">{children}</main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200/50 p-3 flex items-center justify-between">
          <div className="flex items-center">
            <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/98cc1bfb6_Screenshot_20250703_182921_Chrome.jpg" alt="ClickMyLink" className="h-9 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-1">
            {publicUrl && (
              <div className="relative">
                <Button onClick={handleCopyUrl} size="icon" variant="ghost" className="text-gray-600 hover:bg-gray-100 h-8 w-8 rounded-full">
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
                <AnimatePresence>
                  {copied && (
                      <motion.div initial={{ opacity: 0, y: 10, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 10, x: '-50%' }} className="absolute left-1/2 -bottom-10 text-xs font-semibold px-2 py-1 bg-gray-800 text-white rounded-md shadow-lg whitespace-nowrap">
                        Link copiado
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
            )}
            {publicUrl && (
              <Button variant="ghost" size="icon" onClick={handleOpenPublicUrl} className="text-gray-600 hover:bg-gray-100 h-8 w-8 rounded-full">
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
            {shouldShowPreviewButton && (
              <button onClick={() => { setPreviewMode('profile'); setSelectedProduct(null); setShowMobilePreview(true); }} className="flex items-center gap-1 px-2 py-1 h-8 bg-white border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors">
                <Smartphone className="w-3 h-3 flex-shrink-0" />
                <div className="text-[10px] leading-[10px] font-medium">
                  <div>Vista</div>
                  <div>Previa</div>
                </div>
              </button>
            )}
            <LanguageSwitcher isMobile={true} />
          </div>
        </div>
        <main className="min-h-screen bg-gradient-to-br from-slate-50/50 via-white/30 to-blue-50/20">
          <div className="main-content-mobile">
            {children}
          </div>
        </main>
        <div className="bottom-nav mobile-nav-glass shadow-2xl">
          <div className="flex items-center justify-around px-1 py-1.5">
            {mainNavigationItems.slice(0, 4).map((item) => (
              <Link key={item.title} to={item.url} className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all duration-200 ${location.pathname === item.url ? 'text-indigo-600 bg-white/50' : 'text-gray-700 hover:text-indigo-600'}`}>
                <item.icon className="w-4 h-4" />
                <span className="text-xs font-medium">{item.title}</span>
              </Link>
            ))}
            <Sheet>
              <SheetTrigger asChild>
                <button className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-gray-700 hover:text-indigo-600 transition-all duration-200">
                  <MoreHorizontal className="w-4 h-4" />
                  <span className="text-xs font-medium">Más</span>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="bg-[#E4F0FE]/95 backdrop-blur-lg border-t border-gray-200/50 rounded-t-2xl">
                <div className="space-y-4 py-6">
                  <h3 className="text-gray-900 font-semibold text-lg mb-6">Más opciones</h3>
                  {mainNavigationItems.slice(4).map((item) => (
                    <Link key={item.title} to={item.url} className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/40 text-gray-800 hover:bg-white/60 transition-all duration-200">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  ))}
                  <div className="border-t border-gray-900/10 pt-4 mt-6">
                    <Link to={createPageUrl("Profile")} className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/40 text-gray-800 hover:bg-white/60 transition-all duration-200">
                      {creator?.avatar_url ? (<img src={creator.avatar_url} alt={creator.display_name} className="w-5 h-5 rounded-full object-cover" />) : (<User className="w-5 h-5" />)}
                      <span className="font-medium">Mi Perfil</span>
                    </Link>
                    <Button variant="outline" onClick={handleLogout} className="w-full mt-3 bg-transparent border-red-500 text-red-500 hover:bg-red-50">
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('logout') || 'Cerrar Sesión'}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <Dialog open={showMobilePreview} onOpenChange={setShowMobilePreview}>
          <DialogContent className="w-[95vw] h-[85vh] max-w-md mx-auto p-0 bg-transparent border-none shadow-none">
            <div className="relative bg-black rounded-[2.8rem] h-full w-full shadow-2xl p-[2px]">
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gray-800 rounded-full z-10"></div>
              <div className="relative w-full h-full bg-white rounded-[2.6rem] overflow-hidden">
                {creator ? (<div className="w-full h-full overflow-y-auto overflow-x-hidden" style={{ background: creator.design_settings?.background || '#000000', scrollbarWidth: 'none', msOverflowStyle: 'none' }}><style>{`.w-full.h-full.overflow-y-auto::-webkit-scrollbar { display: none; }`}</style>{previewMode === 'profile' ? (<ProfileView creator={creator} products={products} isPreview={true} onProductClick={handleProductClick} />) : (<div className="w-full h-full"><ProductPagePreview productData={selectedProduct} creator={creator} onBack={handleBackToProfile} /></div>)}</div>) : (<div className="flex items-center justify-center h-full bg-slate-50"><div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>)}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <LayoutContent children={children} currentPageName={currentPageName} />
  );
}


import React, { useState, useEffect } from "react";
import { Creator, User, Product } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Save, ChevronUp, ChevronDown, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadFile } from "@/api/integrations";
import ProfileView from "../components/public/ProfileView";
import { SOCIAL_PLATFORMS } from '../components/profile/socialPlatforms';

export default function Profile() {
  const [creator, setCreator] = useState(null);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    display_name: "",
    bio: "",
    username: "",
    avatar_url: "",
    social_links: [],
    custom_social_links: [] // Added custom social links
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showAllSocials, setShowAllSocials] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      const creators = await Creator.filter({ created_by: user.email });
      
      if (creators.length > 0) {
        const currentCreator = creators[0];
        setCreator(currentCreator);
        setFormData({
          display_name: currentCreator.display_name || "",
          bio: currentCreator.bio || "",
          username: currentCreator.username || "",
          avatar_url: currentCreator.avatar_url || "",
          social_links: currentCreator.social_links || [],
          custom_social_links: currentCreator.custom_social_links || [] // Initialize custom social links
        });
        
        const creatorProducts = await Product.filter({ creator_id: currentCreator.id });
        const sortedProducts = creatorProducts.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        setProducts(sortedProducts);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, avatar_url: file_url }));
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleBioChange = (e) => {
    const value = e.target.value;
    if (value.length <= 160) {
      setFormData(prev => ({ ...prev, bio: value }));
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value.replace(/\s/g, '');
    setUsernameError("");
    setFormData(prev => ({ ...prev, username: value }));
  };

  const updateSocialLink = (platformId, value) => {
    setFormData(prev => {
      // Ensure social_links is always an array
      const links = [...(prev.social_links || [])];
      const index = links.findIndex(link => link.platform === platformId);
      const trimmedValue = value.trim();

      if (trimmedValue) {
        if (index > -1) {
          // Update existing link
          links[index].url = trimmedValue;
        } else {
          // Add new link
          links.push({ platform: platformId, url: trimmedValue });
        }
      } else {
        if (index > -1) {
          // Remove link if value is empty
          links.splice(index, 1);
        }
      }
      
      return { ...prev, social_links: links };
    });
  };

  const getSocialValue = (platformId) => {
    // Ensure social_links is an array before finding
    const link = (formData.social_links || []).find(l => l.platform === platformId);
    return link ? link.url : "";
  };
  
  // Handlers for custom social links
  const addCustomSocial = () => {
    setFormData(prev => ({
      ...prev,
      custom_social_links: [
        ...(prev.custom_social_links || []), // Ensure custom_social_links is an array
        { id: Date.now().toString(), name: '', url: '', icon_url: '' } // Generate a unique ID
      ]
    }));
  };

  const updateCustomSocial = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      custom_social_links: (prev.custom_social_links || []).map(link => // Ensure custom_social_links is an array
        link.id === id ? { ...link, [field]: value } : link
      )
    }));
  };

  const handleCustomIconUpload = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Potentially show a loader for this specific item if needed in UI
    try {
      const { file_url } = await UploadFile({ file });
      updateCustomSocial(id, 'icon_url', file_url);
    } catch (error) {
      console.error("Error uploading custom icon:", error);
    }
  };

  const removeCustomSocial = (id) => {
    setFormData(prev => ({
      ...prev,
      custom_social_links: (prev.custom_social_links || []).filter(link => link.id !== id) // Ensure custom_social_links is an array
    }));
  };

  const handleSave = async () => {
    if (usernameError) return;
    setIsSaving(true);
    try {
      // Ensure social_links and custom_social_links are not null/undefined
      const dataToSave = {
        ...formData,
        social_links: formData.social_links || [],
        custom_social_links: formData.custom_social_links || []
      };

      if (creator) {
        await Creator.update(creator.id, dataToSave);
      } else {
        await Creator.create(dataToSave);
      }
      window.dispatchEvent(new Event('creatorProfileUpdated'));
    } catch (error) {
      console.error("Error saving profile:", error);
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

  const previewCreator = {
    ...creator,
    ...formData,
    design_settings: creator?.design_settings || {}
  };

  const defaultSocials = SOCIAL_PLATFORMS.filter(p => ['instagram', 'tiktok'].includes(p.id));
  const additionalSocials = SOCIAL_PLATFORMS.filter(p => !['instagram', 'tiktok'].includes(p.id));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Left Panel - Formulario */}
        <div className="w-1/2 p-8 bg-white overflow-y-auto max-h-screen">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Header */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
                <p className="text-gray-600">Configura tu información pública</p>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  {formData.avatar_url ? (
                    <img src={formData.avatar_url} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" />
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-4xl text-gray-500">{formData.display_name ? formData.display_name[0] : '👤'}</span>
                    </div>
                  )}
                </div>
                <div>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" id="avatar-upload" />
                  <label htmlFor="avatar-upload">
                    <Button type="button" variant="outline" disabled={isUploading} asChild>
                      <span><Upload className="w-4 h-4 mr-2" />{isUploading ? 'Subiendo...' : 'Cambiar Avatar'}</span>
                    </Button>
                  </label>
                  <p className="text-sm text-gray-500 mt-2">Recomendado: 400x400px</p>
                </div>
              </div>

              {/* Campos del perfil */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="display_name" className="text-gray-700 font-medium">Nombre para mostrar</Label>
                  <Input id="display_name" value={formData.display_name} onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))} placeholder="Ej: Trading Sharks" className="mt-2" />
                  <p className="text-gray-500 text-sm mt-1">Este es el nombre que verán tus visitantes</p>
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="bio" className="text-gray-700 font-medium">Bio</Label>
                    <span className="text-sm text-gray-500">{formData.bio.length} / 160</span>
                  </div>
                  <Textarea id="bio" value={formData.bio} onChange={handleBioChange} placeholder="Cuéntanos sobre ti..." className="mt-2 h-24" maxLength={160}/>
                  <p className="text-gray-500 text-sm mt-1">Una breve descripción sobre ti o tu negocio</p>
                </div>

                <div>
                  <Label htmlFor="username" className="text-gray-700 font-medium">Nombre de usuario</Label>
                  <Input id="username" value={formData.username} onChange={handleUsernameChange} placeholder="tradingsharks" className="mt-2" />
                  {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
                  <p className="text-gray-500 text-sm mt-1">Sin espacios. Este será tu URL público.</p>
                </div>
              </div>

              {/* Redes sociales */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Redes Sociales</h3>
                <div className="space-y-4">
                  {defaultSocials.map((platform) => (
                    <div key={platform.id} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: platform.color }}>
                        {React.cloneElement(platform.logoComponent, { className: 'w-6 h-6' })}
                      </div>
                      <div className="flex-1">
                        <Label className="text-gray-700 font-medium">{platform.name}</Label>
                        <Input value={getSocialValue(platform.id)} onChange={(e) => updateSocialLink(platform.id, e.target.value)} placeholder={platform.placeholder} className="mt-1" />
                      </div>
                    </div>
                  ))}
                </div>

                <Button type="button" variant="outline" onClick={() => setShowAllSocials(!showAllSocials)} className="w-full flex items-center justify-center gap-2 py-3">
                  {showAllSocials ? <ChevronUp className="w-5 h-5" /> : <span><ChevronDown className="w-5 h-5 inline-block mr-2" />Agregar más redes sociales</span>}
                </Button>

                <AnimatePresence>
                  {showAllSocials && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 pt-4 border-t">
                      {additionalSocials.map((platform) => (
                        <div key={platform.id} className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: platform.color }}>
                            {React.cloneElement(platform.logoComponent, { className: 'w-6 h-6' })}
                          </div>
                          <div className="flex-1">
                            <Label className="text-gray-700 font-medium">{platform.name}</Label>
                            <Input value={getSocialValue(platform.id)} onChange={(e) => updateSocialLink(platform.id, e.target.value)} placeholder={platform.placeholder} className="mt-1" />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Custom Social Links */}
              <div className="space-y-4 pt-4 border-t">
                 <h3 className="text-lg font-semibold text-gray-900">Enlaces Personalizados</h3>
                 {(formData.custom_social_links || []).map((link, index) => (
                   <div key={link.id} className="p-4 border rounded-lg space-y-3 bg-gray-50">
                     <div className="flex justify-between items-center">
                       <Label className="font-medium">Enlace Personalizado #{index + 1}</Label>
                       <Button variant="ghost" size="icon" onClick={() => removeCustomSocial(link.id)} className="text-red-500 hover:bg-red-50">
                         <Trash2 className="w-4 h-4" />
                       </Button>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                         {link.icon_url ? <img src={link.icon_url} alt="Custom Icon" className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 text-gray-500" />}
                       </div>
                       {/* Using htmlFor to link label to input for accessibility */}
                       <input type="file" accept="image/*" onChange={(e) => handleCustomIconUpload(e, link.id)} id={`custom-icon-${link.id}`} className="hidden" />
                       <Button asChild variant="outline">
                         <label htmlFor={`custom-icon-${link.id}`}>Subir Ícono</label>
                       </Button>
                     </div>
                     <div>
                       <Label>Nombre de la red</Label>
                       <Input value={link.name} onChange={(e) => updateCustomSocial(link.id, 'name', e.target.value)} placeholder="Ej: Mi Blog" className="mt-1" />
                     </div>
                     <div>
                       <Label>URL</Label>
                       <Input value={link.url} onChange={(e) => updateCustomSocial(link.id, 'url', e.target.value)} placeholder="https://..." className="mt-1" />
                     </div>
                   </div>
                 ))}
                 <Button variant="outline" onClick={addCustomSocial} className="w-full">
                   <Plus className="w-4 h-4 mr-2"/>
                   Añadir enlace personalizado
                 </Button>
              </div>

              <Button onClick={handleSave} disabled={isSaving || !!usernameError} size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />{isSaving ? 'Guardando...' : 'Guardar Perfil'}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Right Panel - Vista Previa */}
        <div className="w-1/2 bg-gray-100 flex items-center justify-center p-8">
          <div className="flex flex-col items-center">
            <div className="relative bg-black rounded-[2.8rem] h-[680px] w-[340px] shadow-2xl p-[2px] mb-6">
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gray-800 rounded-full z-10"></div>
              <div className="relative w-full h-full bg-white rounded-[2.6rem] overflow-hidden">
                <div className="w-full h-full overflow-y-auto" style={{ background: previewCreator.design_settings?.background || '#1a1a1a' }}>
                  <ProfileView creator={previewCreator} products={products} isPreview={true} />
                </div>
              </div>
            </div>
            <div className="text-center max-w-sm">
              <p className="text-sm text-gray-600 mb-2">Vista previa en tiempo real</p>
              <p className="text-xs text-gray-500">Los cambios se reflejan automáticamente</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Layout (simplified for brevity, but follows same logic) */}
      <div className="lg:hidden p-4">
        {/* The mobile layout should ideally mirror the desktop layout's form structure and functionality. 
            For this implementation, we assume the provided outline focuses on the desktop view.
            If a full mobile rendering is needed, the structure from the desktop can be adapted here. */}
        <div className="max-w-md mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
              <p className="text-gray-600">Configura tu información pública</p>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative">
                {formData.avatar_url ? (
                  <img src={formData.avatar_url} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-gray-200" />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-3xl text-gray-500">{formData.display_name ? formData.display_name[0] : '👤'}</span>
                  </div>
                )}
              </div>
              <div>
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" id="avatar-upload-mobile" />
                <label htmlFor="avatar-upload-mobile">
                  <Button type="button" variant="outline" disabled={isUploading} asChild>
                    <span><Upload className="w-4 h-4 mr-2" />{isUploading ? 'Subiendo...' : 'Cambiar Avatar'}</span>
                  </Button>
                </label>
                <p className="text-sm text-gray-500 mt-2">Recomendado: 400x400px</p>
              </div>
            </div>

            {/* Campos del perfil */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="display_name_mobile" className="text-gray-700 font-medium">Nombre para mostrar</Label>
                <Input id="display_name_mobile" value={formData.display_name} onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))} placeholder="Ej: Trading Sharks" className="mt-2" />
                <p className="text-gray-500 text-sm mt-1">Este es el nombre que verán tus visitantes</p>
              </div>

              <div>
                <div className="flex justify-between">
                  <Label htmlFor="bio_mobile" className="text-gray-700 font-medium">Bio</Label>
                  <span className="text-sm text-gray-500">{formData.bio.length} / 160</span>
                </div>
                <Textarea id="bio_mobile" value={formData.bio} onChange={handleBioChange} placeholder="Cuéntanos sobre ti..." className="mt-2 h-24" maxLength={160}/>
                <p className="text-gray-500 text-sm mt-1">Una breve descripción sobre ti o tu negocio</p>
              </div>

              <div>
                <Label htmlFor="username_mobile" className="text-gray-700 font-medium">Nombre de usuario</Label>
                <Input id="username_mobile" value={formData.username} onChange={handleUsernameChange} placeholder="tradingsharks" className="mt-2" />
                {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
                <p className="text-gray-500 text-sm mt-1">Sin espacios. Este será tu URL público.</p>
              </div>
            </div>

            {/* Redes sociales */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Redes Sociales</h3>
              <div className="space-y-4">
                {defaultSocials.map((platform) => (
                  <div key={platform.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: platform.color }}>
                      {React.cloneElement(platform.logoComponent, { className: 'w-6 h-6' })}
                    </div>
                    <div className="flex-1">
                      <Label className="text-gray-700 font-medium">{platform.name}</Label>
                      <Input value={getSocialValue(platform.id)} onChange={(e) => updateSocialLink(platform.id, e.target.value)} placeholder={platform.placeholder} className="mt-1" />
                    </div>
                  </div>
                ))}
              </div>

              <Button type="button" variant="outline" onClick={() => setShowAllSocials(!showAllSocials)} className="w-full flex items-center justify-center gap-2 py-3">
                {showAllSocials ? <ChevronUp className="w-5 h-5" /> : <span><ChevronDown className="w-5 h-5 inline-block mr-2" />Agregar más redes sociales</span>}
              </Button>

              <AnimatePresence>
                {showAllSocials && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 pt-4 border-t">
                    {additionalSocials.map((platform) => (
                      <div key={platform.id} className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: platform.color }}>
                          {React.cloneElement(platform.logoComponent, { className: 'w-6 h-6' })}
                        </div>
                        <div className="flex-1">
                          <Label className="text-gray-700 font-medium">{platform.name}</Label>
                          <Input value={getSocialValue(platform.id)} onChange={(e) => updateSocialLink(platform.id, e.target.value)} placeholder={platform.placeholder} className="mt-1" />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Custom Social Links */}
            <div className="space-y-4 pt-4 border-t">
               <h3 className="text-lg font-semibold text-gray-900">Enlaces Personalizados</h3>
               {(formData.custom_social_links || []).map((link, index) => (
                 <div key={link.id} className="p-4 border rounded-lg space-y-3 bg-gray-50">
                   <div className="flex justify-between items-center">
                     <Label className="font-medium">Enlace Personalizado #{index + 1}</Label>
                     <Button variant="ghost" size="icon" onClick={() => removeCustomSocial(link.id)} className="text-red-500 hover:bg-red-50">
                       <Trash2 className="w-4 h-4" />
                     </Button>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                       {link.icon_url ? <img src={link.icon_url} alt="Custom Icon" className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 text-gray-500" />}
                     </div>
                     <input type="file" accept="image/*" onChange={(e) => handleCustomIconUpload(e, link.id)} id={`custom-icon-mobile-${link.id}`} className="hidden" />
                     <Button asChild variant="outline">
                       <label htmlFor={`custom-icon-mobile-${link.id}`}>Subir Ícono</label>
                     </Button>
                   </div>
                   <div>
                     <Label>Nombre de la red</Label>
                     <Input value={link.name} onChange={(e) => updateCustomSocial(link.id, 'name', e.target.value)} placeholder="Ej: Mi Blog" className="mt-1" />
                   </div>
                   <div>
                     <Label>URL</Label>
                     <Input value={link.url} onChange={(e) => updateCustomSocial(link.id, 'url', e.target.value)} placeholder="https://..." className="mt-1" />
                   </div>
                 </div>
               ))}
               <Button variant="outline" onClick={addCustomSocial} className="w-full">
                 <Plus className="w-4 h-4 mr-2"/>
                 Añadir enlace personalizado
               </Button>
            </div>

            <Button onClick={handleSave} disabled={isSaving || !!usernameError} size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />{isSaving ? 'Guardando...' : 'Guardar Perfil'}
            </Button>
          </div>
      </div>
    </div>
  );
}

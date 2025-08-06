import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit,
  ExternalLink, 
  Instagram, 
  Twitter, 
  Youtube, 
  Facebook,
  Linkedin,
  Globe,
  MessageCircle,
  Music,
  Video,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SocialLinkModal from "./SocialLinkModal";

const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500', baseUrl: 'https://instagram.com/' },
  { id: 'tiktok', name: 'TikTok', icon: Music, color: 'bg-gradient-to-r from-black to-gray-800', baseUrl: 'https://tiktok.com/@' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-gradient-to-r from-red-500 to-red-600', baseUrl: 'https://youtube.com/@' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-gradient-to-r from-blue-400 to-blue-500', baseUrl: 'https://twitter.com/' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-gradient-to-r from-blue-600 to-blue-700', baseUrl: 'https://facebook.com/' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-gradient-to-r from-blue-700 to-blue-800', baseUrl: 'https://linkedin.com/in/' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'bg-gradient-to-r from-green-500 to-green-600', baseUrl: 'https://wa.me/' },
  { id: 'website', name: 'Website', icon: Globe, color: 'bg-gradient-to-r from-gray-500 to-gray-600', baseUrl: '' },
];

export default function SocialLinksSection({ creator, onUpdate }) {
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  const socialLinks = creator?.social_links || [];

  const getPlatformInfo = (platformName) => {
    return SOCIAL_PLATFORMS.find(p => p.id === platformName.toLowerCase() || p.name.toLowerCase() === platformName.toLowerCase()) || 
           SOCIAL_PLATFORMS.find(p => p.id === 'website');
  };

  const handleAddNew = () => {
    setEditingLink(null);
    setShowModal(true);
  };

  const handleEdit = (link, index) => {
    setEditingLink({ ...link, index });
    setShowModal(true);
  };

  const handleSave = async (linkData) => {
    try {
      const { Creator } = await import("@/api/entities");
      
      let updatedLinks = [...socialLinks];
      
      if (editingLink && editingLink.index !== undefined) {
        // Editing existing link
        updatedLinks[editingLink.index] = {
          platform: linkData.platform,
          url: linkData.url
        };
      } else {
        // Adding new link
        updatedLinks.push({
          platform: linkData.platform,
          url: linkData.url
        });
      }

      await Creator.update(creator.id, { 
        social_links: updatedLinks 
      });
      
      setShowModal(false);
      setEditingLink(null);
      onUpdate();
    } catch (error) {
      console.error("Error saving social link:", error);
    }
  };

  const handleDelete = async (index) => {
    try {
      const { Creator } = await import("@/api/entities");
      
      const updatedLinks = socialLinks.filter((_, i) => i !== index);
      
      await Creator.update(creator.id, { 
        social_links: updatedLinks 
      });
      
      onUpdate();
    } catch (error) {
      console.error("Error deleting social link:", error);
    }
  };

  return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900">Redes Sociales</CardTitle>
            <Button
              onClick={handleAddNew}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Red
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {socialLinks.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No hay redes sociales</h3>
              <p className="text-gray-600 text-sm mb-4">Conecta tus redes sociales para que tus seguidores te encuentren</p>
              <Button
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Primera Red
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {socialLinks.map((link, index) => {
                  const platform = getPlatformInfo(link.platform);
                  const Icon = platform.icon;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group"
                    >
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-200">
                        <div className={`w-12 h-12 rounded-xl ${platform.color} flex items-center justify-center shadow-sm`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900">{platform.name}</h4>
                          <p className="text-gray-600 text-sm truncate">{link.url}</p>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(link, index)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {socialLinks.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {socialLinks.length} redes conectadas
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddNew}
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Más
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {showModal && (
          <SocialLinkModal
            link={editingLink}
            platforms={SOCIAL_PLATFORMS}
            onSave={handleSave}
            onClose={() => {
              setShowModal(false);
              setEditingLink(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
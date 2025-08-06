import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  X, 
  ExternalLink, 
  Instagram, 
  Twitter, 
  Youtube, 
  Facebook,
  Linkedin,
  Globe
} from "lucide-react";

export default function SocialLinksManager({ socialLinks, onChange }) {
  // Clean existing data on component mount
  useEffect(() => {
    if (socialLinks && Array.isArray(socialLinks)) {
      const cleanedLinks = socialLinks
        .filter(link => link && typeof link === 'object')
        .map(link => ({
          platform: link.platform || link.name || link.icon || 'Website',
          url: link.url || ''
        }))
        .filter(link => link.platform && link.url);
      
      if (JSON.stringify(cleanedLinks) !== JSON.stringify(socialLinks)) {
        onChange(cleanedLinks);
      }
    }
  }, []);

  const links = socialLinks || [];
  const [newPlatform, setNewPlatform] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const addLink = () => {
    if (newPlatform.trim() && newUrl.trim()) {
      const newLink = {
        platform: newPlatform.trim(),
        url: newUrl.trim()
      };
      onChange([...links, newLink]);
      setNewPlatform("");
      setNewUrl("");
    }
  };

  const removeLink = (index) => {
    onChange(links.filter((_, i) => i !== index));
  };

  const getIcon = (platform) => {
    if (!platform || typeof platform !== 'string') {
      return <Globe className="w-4 h-4" />;
    }
    switch(platform.toLowerCase()) {
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      case 'facebook': return <Facebook className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'tiktok': return <Youtube className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <ExternalLink className="w-5 h-5" />
          Redes Sociales
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Lista de enlaces */}
        {links.map((link, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            {getIcon(link.platform)}
            <div className="flex-1">
              <p className="text-white font-medium">{link.platform}</p>
              <p className="text-purple-300 text-sm truncate">{link.url}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeLink(index)}
              className="text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}

        {/* Formulario para agregar */}
        <div className="border-t border-white/10 pt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-white text-sm">Plataforma</Label>
              <Input
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value)}
                placeholder="Instagram"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label className="text-white text-sm">URL</Label>
              <Input
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://instagram.com/usuario"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>
          <Button
            onClick={addLink}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Red Social
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
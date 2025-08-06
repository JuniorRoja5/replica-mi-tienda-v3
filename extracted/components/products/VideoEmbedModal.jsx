import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Link, Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function VideoEmbedModal({ isOpen, onClose, onEmbed, onUpload }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const fileInputRef = useRef(null);

  const handleEmbedClick = () => {
    if (videoUrl.trim()) {
      onEmbed(videoUrl.trim());
      setVideoUrl('');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setUploadStatus('error');
      setTimeout(() => setUploadStatus(null), 3000);
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const success = await onUpload(file);
      if (success) {
        setUploadStatus('success');
        setTimeout(() => {
          onClose(); // Cierra el modal en éxito
        }, 1000);
      } else {
        throw new Error("Upload callback returned false");
      }
    } catch (error) {
      console.error("Error in upload process:", error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    if (isUploading) return;
    setVideoUrl('');
    setUploadStatus(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-white text-xl">Insertar Video</CardTitle>
                <Button variant="ghost" size="icon" onClick={handleClose} className="text-white hover:bg-white/10" disabled={isUploading}>
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6 pt-2">
                <div className="space-y-3">
                  <Label htmlFor="video-url" className="text-white/90">Insertar desde un enlace</Label>
                  <div className="flex gap-2">
                    <Input
                      id="video-url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="Pega un link de YouTube, Vimeo..."
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      disabled={isUploading}
                    />
                    <Button onClick={handleEmbedClick} disabled={!videoUrl.trim() || isUploading} className="bg-blue-500 hover:bg-blue-600 text-white flex-shrink-0">
                      <Link className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/20" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-clip-text text-transparent bg-gradient-to-r from-white/60 to-white/60 px-2">O</span></div>
                </div>

                <div className="space-y-3">
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />
                  <Button onClick={handleUploadClick} disabled={isUploading} className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20">
                    {isUploading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Subiendo...</>
                    ) : (
                      <><Upload className="w-4 h-4 mr-2" />Subir Video Propio</>
                    )}
                  </Button>

                  {uploadStatus === 'success' && (
                    <div className="flex items-center gap-2 text-green-400 text-sm"><CheckCircle className="w-4 h-4" />Video insertado</div>
                  )}
                  {uploadStatus === 'error' && (
                    <div className="flex items-center gap-2 text-red-400 text-sm"><AlertCircle className="w-4 h-4" />Error al subir. Inténtalo de nuevo.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
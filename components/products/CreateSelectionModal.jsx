import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Link, ShoppingCart } from 'lucide-react';

export default function CreateSelectionModal({ onSelect, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-white text-xl">¿Qué quieres crear?</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <button
              onClick={() => onSelect('link')}
              className="w-full text-left p-6 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all flex items-center gap-4 group backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Link className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg mb-1">Un link externo</h3>
                <p className="text-blue-100">Dirige a tus seguidores a cualquier sitio web.</p>
              </div>
            </button>
            
            <button
              onClick={() => onSelect('product')}
              className="w-full text-left p-6 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all flex items-center gap-4 group backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg mb-1">Un producto digital</h3>
                <p className="text-purple-100">Vende tus creaciones y recibe pagos directos.</p>
              </div>
            </button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
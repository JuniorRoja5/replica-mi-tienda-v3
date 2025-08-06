import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Mail, Package, Phone, GraduationCap, Crown, ArrowRight } from 'lucide-react';

const PRODUCT_TYPES = [
  {
    id: 'email_capture',
    title: 'Recolectar E-mails',
    description: 'Crea un formulario para capturar correos electrónicos y hacer crecer tu lista de suscriptores',
    icon: Mail,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-300'
  },
  {
    id: 'digital_product',
    title: 'Producto Digital',
    description: 'Vende archivos digitales como PDFs, guías, plantillas, e-books o contenido exclusivo',
    icon: Package,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/20',
    textColor: 'text-purple-300'
  },
  {
    id: 'consultation',
    title: 'Llamada de Consultoría',
    description: 'Ofrece sesiones 1 a 1 de coaching, mentoría o consultoría con agendamiento automático',
    icon: Phone,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-300'
  },
  {
    id: 'course',
    title: 'Curso Digital',
    description: 'Crea y vende un curso digital con lecciones, material descargable y seguimiento',
    icon: GraduationCap,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/20',
    textColor: 'text-orange-300'
  },
  {
    id: 'membership',
    title: 'Membresía Recurrente',
    description: 'Ofrece acceso exclusivo con pagos mensuales, semestrales o anuales recurrentes',
    icon: Crown,
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-500/20',
    textColor: 'text-indigo-300'
  }
];

export default function ProductTypeSelector({ onSelect, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl"
      >
        <div className="sticky top-0 bg-white/10 backdrop-blur-xl border-b border-white/20 p-6 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-white">Elige el tipo de producto</h2>
            <p className="text-blue-100 mt-1">Selecciona qué tipo de producto digital quieres crear</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRODUCT_TYPES.map((productType, index) => {
              const Icon = productType.icon;
              return (
                <motion.div
                  key={productType.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 group"
                    onClick={() => onSelect(productType.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-xl ${productType.bgColor} backdrop-blur-sm flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-6 h-6 ${productType.textColor}`} />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-white group-hover:text-blue-100">
                              {productType.title}
                            </h3>
                            <ArrowRight className="w-4 h-4 text-blue-200 group-hover:text-white transition-colors" />
                          </div>
                          <p className="text-blue-100 text-sm leading-relaxed">
                            {productType.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="flex items-center gap-3 text-sm text-blue-100">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Cada tipo de producto te permitirá personalizar completamente la experiencia de tus clientes</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
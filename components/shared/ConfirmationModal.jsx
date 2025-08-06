import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "¿Está seguro?",
  itemNameToConfirm,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: -20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: -20, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="w-full max-w-md mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl text-gray-900 lg:bg-white/10 lg:text-white lg:border-white/20">
            <CardHeader className="text-center flex flex-col items-center pt-6 lg:pt-8">
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-3 lg:mb-4 border border-red-500/30">
                <AlertTriangle className="w-6 h-6 lg:w-8 lg:h-8 text-red-500 lg:text-red-400" />
              </div>
              <CardTitle className="text-xl lg:text-2xl font-bold">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-700 lg:text-red-100/80 px-6 pb-4">
              <p className="text-sm lg:text-base leading-relaxed">
                Solo queremos confirmar que está seguro de eliminar
                {itemNameToConfirm && (
                  <strong className="font-semibold text-gray-900 lg:text-white block my-2 break-words">
                    "{itemNameToConfirm}"
                  </strong>
                )}
                Esta acción no se puede deshacer.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 px-6 pb-6 lg:pb-8">
              <Button
                onClick={onConfirm}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 text-base"
              >
                {confirmText}
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full bg-transparent border-gray-300 hover:bg-gray-100 text-gray-700 py-3 text-base lg:border-white/20 lg:hover:bg-white/10 lg:text-white"
              >
                {cancelText}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
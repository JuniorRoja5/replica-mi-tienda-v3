import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ConnectInstagram() {
  const [isConnected, setIsConnected] = useState(false);
  
  const handleConnect = () => {
    // TODO: Implementar flujo de OAuth 2.0 para conectar con la API de Meta
    // Esto abriría un popup de Facebook para la autenticación y permisos.
    // Por ahora, solo simula el cambio de estado.
    setIsConnected(!isConnected);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-0.5 shadow-lg">
        <CardContent className="bg-white rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Instagram className="w-8 h-8 text-pink-500" />
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                {isConnected ? "Cuenta de Instagram Conectada" : "Conecta tu cuenta de Instagram"}
              </h3>
              <p className="text-gray-600 text-sm">
                {isConnected ? "¡Todo listo para crear automatizaciones!" : "Necesitas una cuenta de empresa para empezar."}
              </p>
            </div>
          </div>
          <Button
            onClick={handleConnect}
            variant={isConnected ? 'outline' : 'default'}
            className={!isConnected ? "bg-pink-500 hover:bg-pink-600 text-white" : ""}
          >
            {isConnected ? (
              <>
                <XCircle className="w-4 h-4 mr-2" />
                Desconectar
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Conectar ahora
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
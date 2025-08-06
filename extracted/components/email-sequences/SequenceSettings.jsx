import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, Save } from 'lucide-react';

export default function SequenceSettings() {
  const [settings, setSettings] = useState({
    fromName: 'Tu Nombre',
    fromEmail: 'tu@email.com',
    businessName: 'Nombre de tu Empresa',
    businessAddress: 'Calle Falsa 123, Ciudad, País',
    globalSignature: '<p>Saludos,<br>Tu Nombre</p>',
    gdprCompliance: true
  });

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Envío</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fromName">Nombre del Remitente</Label>
              <Input 
                id="fromName"
                value={settings.fromName}
                onChange={(e) => handleInputChange('fromName', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Este nombre aparecerá en la bandeja de entrada.</p>
            </div>
            <div>
              <Label htmlFor="fromEmail">Email del Remitente</Label>
              <Input 
                id="fromEmail"
                type="email"
                value={settings.fromEmail}
                onChange={(e) => handleInputChange('fromEmail', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Debe ser un email verificado.</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Información Legal y de Cumplimiento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="businessName">Nombre de la Empresa</Label>
            <Input 
              id="businessName"
              value={settings.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="businessAddress">Dirección Física</Label>
            <Textarea 
              id="businessAddress"
              value={settings.businessAddress}
              onChange={(e) => handleInputChange('businessAddress', e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Requerido por leyes anti-spam (CAN-SPAM).</p>
          </div>
           <div className="flex items-center space-x-2">
            <Switch
              id="gdprCompliance"
              checked={settings.gdprCompliance}
              onCheckedChange={(checked) => handleInputChange('gdprCompliance', checked)}
            />
            <Label htmlFor="gdprCompliance">Incluir enlace para cancelar suscripción</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Firma Global</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="globalSignature">Firma de Correo</Label>
           <Textarea 
              id="globalSignature"
              value={settings.globalSignature}
              onChange={(e) => handleInputChange('globalSignature', e.target.value)}
              className="mt-2 h-24"
            />
          <p className="text-xs text-gray-500 mt-1">Esta firma se añadirá al final de todos tus correos. Puedes usar HTML básico.</p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
}
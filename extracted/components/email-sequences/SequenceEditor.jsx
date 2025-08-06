import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, GripVertical, Trash2, Edit, Save, Clock, Send, Eye } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import RichTextEditor from '../products/RichTextEditor'; // Reutilizamos el editor

const EmailDelaySelector = ({ delayValue, delayUnit, onChange }) => {
  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
      <Clock className="w-5 h-5 text-gray-500" />
      <span className="text-sm">Enviar</span>
      <Input
        type="number"
        min="0"
        value={delayValue}
        onChange={(e) => onChange('delay_value', parseInt(e.target.value))}
        className="w-16 h-8 text-center"
      />
      <Select value={delayUnit} onValueChange={(value) => onChange('delay_unit', value)}>
        <SelectTrigger className="w-28 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="minutes">Minutos</SelectItem>
          <SelectItem value="hours">Horas</SelectItem>
          <SelectItem value="days">Días</SelectItem>
        </SelectContent>
      </Select>
      <span className="text-sm">después del anterior.</span>
    </div>
  );
};

const EmailEditorModal = ({ email, onSave, onClose }) => {
  const [subject, setSubject] = useState(email?.subject || '');
  const [body, setBody] = useState(email?.body || '');
  const editorRef = React.useRef(null);

  const handleInsertVariable = (variable) => {
    if(editorRef.current) {
      editorRef.current.insertTextAtCursor(`{{${variable}}}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-3xl h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold">Editar Correo</h3>
        </div>
        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          <div>
            <label className="font-medium">Asunto</label>
            <Input 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Asunto del correo"
            />
          </div>
          <div>
            <label className="font-medium mb-2 block">Cuerpo del Mensaje</label>
            <div className="flex gap-2 mb-2">
                <Button variant="outline" size="sm" onClick={() => handleInsertVariable('nombre_cliente')}>&#123;&#123;nombre_cliente&#125;&#125;</Button>
                <Button variant="outline" size="sm" onClick={() => handleInsertVariable('nombre_producto')}>&#123;&#123;nombre_producto&#125;&#125;</Button>
            </div>
            <RichTextEditor
              ref={editorRef}
              value={body}
              onChange={setBody}
              placeholder="Escribe tu correo aquí..."
            />
          </div>
        </div>
        <div className="p-6 border-t flex justify-between">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <div className="flex gap-2">
            <Button variant="secondary">Guardar Borrador</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => onSave({ ...email, subject, body })}>Guardar y Publicar</Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};


export default function SequenceEditor({ sequence, emails: initialEmails, products, onSave, onBack }) {
  const [name, setName] = useState(sequence.name);
  const [triggerType, setTriggerType] = useState(sequence.trigger_type);
  const [triggerProductId, setTriggerProductId] = useState(sequence.trigger_product_id);
  const [emails, setEmails] = useState(initialEmails);
  const [editingEmail, setEditingEmail] = useState(null);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(emails);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setEmails(items.map((item, index) => ({ ...item, order: index + 1 })));
  };
  
  const handleAddEmail = () => {
    const newEmail = {
      id: `mail_new_${Date.now()}`,
      sequence_id: sequence.id,
      subject: 'Nuevo correo (Borrador)',
      body: '<p>Contenido del correo...</p>',
      delay_value: 1,
      delay_unit: 'days',
      order: emails.length + 1,
      status: 'draft'
    };
    setEmails([...emails, newEmail]);
    setEditingEmail(newEmail);
  };

  const handleSaveEmail = (updatedEmail) => {
    setEmails(emails.map(e => e.id === updatedEmail.id ? { ...updatedEmail, status: 'published' } : e));
    setEditingEmail(null);
  };
  
  const handleUpdateEmailDelay = (emailId, field, value) => {
    setEmails(emails.map(e => e.id === emailId ? { ...e, [field]: value } : e));
  };

  const handleRemoveEmail = (emailId) => {
    setEmails(emails.filter(e => e.id !== emailId));
  };
  
  const handleSaveSequence = () => {
    onSave({ ...sequence, name, trigger_type: triggerType, trigger_product_id: triggerProductId });
  };

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {editingEmail && (
          <EmailEditorModal 
            email={editingEmail}
            onSave={handleSaveEmail}
            onClose={() => setEditingEmail(null)}
          />
        )}
      </AnimatePresence>

      {/* Configuración de la Secuencia */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de la Secuencia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre de la secuencia"
            className="text-lg font-semibold p-4"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-sm">Activador</label>
              <Select value={triggerType} onValueChange={setTriggerType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product_purchase">Compra de Producto</SelectItem>
                  <SelectItem value="list_signup">Suscripción a Lista</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {triggerType === 'product_purchase' && (
              <div>
                <label className="font-medium text-sm">Producto</label>
                <Select value={triggerProductId} onValueChange={setTriggerProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="flex justify-end">
              <Button onClick={handleSaveSequence}><Save className="w-4 h-4 mr-2" />Guardar Configuración</Button>
          </div>
        </CardContent>
      </Card>

      {/* Editor de Emails de la Secuencia */}
      <Card>
        <CardHeader>
          <CardTitle>Emails de la Secuencia</CardTitle>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="emails">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {emails.map((email, index) => (
                    <Draggable key={email.id} draggableId={email.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`p-4 rounded-lg border bg-white ${snapshot.isDragging ? 'shadow-2xl' : 'shadow-sm'}`}
                        >
                          <div className="flex items-center gap-3">
                             <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                              <GripVertical className="text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold">{email.subject}</span>
                                <Badge variant={email.status === 'published' ? 'default' : 'secondary'} className={email.status === 'published' ? 'bg-green-100 text-green-800' : ''}>
                                  {email.status === 'published' ? 'Publicado' : 'Borrador'}
                                </Badge>
                              </div>
                              <EmailDelaySelector
                                delayValue={email.delay_value}
                                delayUnit={email.delay_unit}
                                onChange={(field, value) => handleUpdateEmailDelay(email.id, field, value)}
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setEditingEmail(email)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleRemoveEmail(email.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Button variant="outline" onClick={handleAddEmail} className="mt-6 w-full">
            <Plus className="w-4 h-4 mr-2" />
            Añadir Email
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
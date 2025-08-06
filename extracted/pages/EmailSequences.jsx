import React, { useState, useEffect } from "react";
import { Creator, User, Product, EmailSequence, SequenceEmail } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Plus, Mail, BarChart2, Settings, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Importar los nuevos componentes
import SequencesList from "../components/email-sequences/SequencesList";
import SequenceEditor from "../components/email-sequences/SequenceEditor";
import SequenceStats from "../components/email-sequences/SequenceStats";
import SequenceSettings from "../components/email-sequences/SequenceSettings";

// Mock Data para simular la funcionalidad
const MOCK_SEQUENCES = [
  { id: 'seq_1', name: 'Bienvenida al Newsletter', trigger_type: 'list_signup', subscriber_count: 125, email_count: 3, status: 'active', updated_date: '2023-10-26T10:00:00Z' },
  { id: 'seq_2', name: 'Post-compra: Ebook de Marketing', trigger_type: 'product_purchase', trigger_product_id: 'prod_1', subscriber_count: 42, email_count: 5, status: 'active', updated_date: '2023-10-25T15:30:00Z' },
  { id: 'seq_3', name: 'Recuperación de Carrito (Borrador)', trigger_type: 'manual', subscriber_count: 0, email_count: 2, status: 'draft', updated_date: '2023-10-22T09:00:00Z' },
];

const MOCK_EMAILS = {
  'seq_1': [
    { id: 'mail_1a', sequence_id: 'seq_1', subject: '¡Gracias por unirte!', delay_value: 10, delay_unit: 'minutes', order: 1, status: 'published' },
    { id: 'mail_1b', sequence_id: 'seq_1', subject: 'Tu primer recurso gratuito', delay_value: 1, delay_unit: 'days', order: 2, status: 'published' },
    { id: 'mail_1c', sequence_id: 'seq_1', subject: '¿Qué te pareció?', delay_value: 3, delay_unit: 'days', order: 3, status: 'published' },
  ],
  'seq_2': [
    { id: 'mail_2a', sequence_id: 'seq_2', subject: '✅ Tu Ebook de Marketing está aquí', delay_value: 1, delay_unit: 'minutes', order: 1, status: 'published' },
    { id: 'mail_2b', sequence_id: 'seq_2', subject: 'Capítulo 1: Lo que no te han contado', delay_value: 2, delay_unit: 'days', order: 2, status: 'published' },
    { id: 'mail_2c', sequence_id: 'seq_2', subject: '¿Listo para el siguiente nivel?', delay_value: 5, delay_unit: 'days', order: 3, status: 'published' },
    { id: 'mail_2d', sequence_id: 'seq_2', subject: 'Un bonus especial para ti', delay_value: 7, delay_unit: 'days', order: 4, status: 'published' },
    { id: 'mail_2e', sequence_id: 'seq_2', subject: 'Tu opinión es importante', delay_value: 10, delay_unit: 'days', order: 5, status: 'published' },
  ],
  'seq_3': [
    { id: 'mail_3a', sequence_id: 'seq_3', subject: '¿Olvidaste algo?', delay_value: 1, delay_unit: 'hours', order: 1, status: 'draft' },
    { id: 'mail_3b', sequence_id: 'seq_3', subject: 'Un descuento para que termines tu compra', delay_value: 1, delay_unit: 'days', order: 2, status: 'draft' },
  ]
};

export default function EmailSequencesPage() {
  const [user, setUser] = useState(null);
  const [creator, setCreator] = useState(null);
  const [products, setProducts] = useState([]);
  const [sequences, setSequences] = useState([]);
  const [currentView, setCurrentView] = useState('list'); // list, editor, stats, settings
  const [selectedSequence, setSelectedSequence] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      // En un futuro, esto vendría de la base de datos
      // const currentUser = await User.me();
      // setUser(currentUser);
      // const creatorData = await Creator.filter({ created_by: currentUser.email });
      // setCreator(creatorData[0]);
      // const productData = await Product.list();
      // setProducts(productData);
      
      // Usando Mocks por ahora
      setSequences(MOCK_SEQUENCES.map(seq => ({...seq, email_count: MOCK_EMAILS[seq.id]?.length || 0})));

    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSequence = () => {
    // Lógica para crear una nueva secuencia (mock)
    const newSequence = {
      id: `seq_${Date.now()}`,
      name: 'Nueva Secuencia (Borrador)',
      trigger_type: 'manual',
      subscriber_count: 0,
      email_count: 0,
      status: 'draft',
      updated_date: new Date().toISOString()
    };
    setSequences([newSequence, ...sequences]);
    setSelectedSequence(newSequence);
    setCurrentView('editor');
  };

  const handleEditSequence = (sequence) => {
    setSelectedSequence(sequence);
    setCurrentView('editor');
  };

  const handleSaveSequence = (updatedSequence) => {
    setSequences(sequences.map(s => s.id === updatedSequence.id ? updatedSequence : s));
    setCurrentView('list');
    setSelectedSequence(null);
  };
  
  const handleViewStats = (sequence) => {
    setSelectedSequence(sequence);
    setCurrentView('stats');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'editor':
        return <SequenceEditor 
                  sequence={selectedSequence} 
                  emails={MOCK_EMAILS[selectedSequence.id] || []}
                  products={products}
                  onSave={handleSaveSequence}
                  onBack={() => setCurrentView('list')} 
               />;
      case 'stats':
         return <SequenceStats 
                  sequence={selectedSequence}
                  onBack={() => setCurrentView('list')}
                />;
      case 'settings':
        return <SequenceSettings />;
      case 'list':
      default:
        return <SequencesList 
                  sequences={sequences} 
                  onEdit={handleEditSequence}
                  onViewStats={handleViewStats}
               />;
    }
  };
  
  const TABS = [
    { id: 'list', label: 'Mis Secuencias', icon: Mail },
    { id: 'stats', label: 'Estadísticas', icon: BarChart2 },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  if (isLoading) {
    return <div className="p-8 text-center">Cargando...</div>;
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div>
              {currentView === 'list' ? (
                <>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Secuencias de Email</h1>
                  <p className="text-gray-600 text-lg">Automatiza tu comunicación y nutre a tu audiencia.</p>
                </>
              ) : (
                 <Button variant="ghost" onClick={() => setCurrentView('list')} className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a secuencias
                </Button>
              )}
            </div>
            {currentView === 'list' && (
              <Button onClick={handleCreateSequence} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Crear Secuencia
              </Button>
            )}
          </div>
          
          {/* Tabs */}
          {currentView !== 'editor' && (
            <div className="mb-8 border-b border-gray-200">
              <nav className="-mb-px flex space-x-6">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentView(tab.id)}
                    className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      currentView === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          )}

          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
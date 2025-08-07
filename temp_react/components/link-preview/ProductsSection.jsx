
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Package,
  Link as LinkIcon,
  Edit,
  Eye,
  BarChart3,
  DollarSign,
  ExternalLink,
  Trash2,
  MoreVertical,
  GripVertical,
  Copy, // Added Copy icon
  Check // Added Check icon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Product } from "@/api/entities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ConfirmationModal from "../shared/ConfirmationModal";

export default function ProductsSection({ products, onUpdate, creator, onCreateSelection, onEdit }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [copiedProductId, setCopiedProductId] = useState(null); // New state for copy feedback

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await Product.delete(productToDelete.id);
      onUpdate();
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(products);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updates = items.map((item, index) => ({
      ...item,
      sort_order: index
    }));

    try {
      for (const item of updates) {
        await Product.update(item.id, { sort_order: item.sort_order });
      }
      onUpdate();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleToggleActive = async (product, isActive) => {
    try {
      await Product.update(product.id, { is_active: isActive });
      onUpdate();
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  // New function to handle copying the unique link
  const handleCopyLink = (product) => {
    if (!creator || !creator.username || !product.handle) return;
    // Construct the unique URL using window.location.origin, creator's username, and product handle
    const url = `${window.location.origin}/${creator.username}/${product.handle}`;
    navigator.clipboard.writeText(url);
    setCopiedProductId(product.id);
    setTimeout(() => setCopiedProductId(null), 2000); // Reset copied state after 2 seconds
  };

  return (
    <>
      <div className="bg-white rounded-lg p-3 shadow-sm"> {/* Removed mx-1 as per outline implied change */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">Mis Enlaces / Productos</h2>
          <Button
            onClick={() => onCreateSelection('show-modal')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 h-8"
          >
            <Plus className="w-3 h-3 mr-1" />
            Crear Nuevo
          </Button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-2">No tienes productos aún</h3>
            <p className="text-sm text-gray-600 mb-4">Crea tu primer enlace o producto digital para comenzar a monetizar</p>
            <Button
              onClick={() => onCreateSelection('show-modal')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Crear tu primer elemento
            </Button>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="products">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  <AnimatePresence>
                    {products.map((product, index) => (
                      <Draggable key={product.id} draggableId={product.id} index={index}>
                        {(provided, snapshot) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`bg-gray-50 rounded-lg p-2 border border-gray-200 transition-all ${ /* Changed p-2.5 to p-2 */
                              snapshot.isDragging ? 'shadow-lg scale-[1.02]' : 'hover:shadow-sm'
                            }`}
                          >
                            <div className="flex items-center gap-2"> {/* Changed gap-2.5 to gap-2 */}
                              <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing p-1 flex items-center">
                                <GripVertical className="w-6 h-6 text-gray-400" />
                              </div>

                              <div className="w-8 h-8 bg-white rounded-md border border-gray-200 flex items-center justify-center flex-shrink-0">
                                {product.image_url ? (
                                  <img
                                    src={product.image_url}
                                    alt={product.title}
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                ) : (
                                  product.type === 'link' ?
                                    <LinkIcon className="w-4 h-4 text-blue-600" /> :
                                    <Package className="w-4 h-4 text-purple-600" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-0.5">
                                  <div className="flex items-center gap-1.5">
                                    {product.type === 'link' && <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">Link</Badge>}
                                    {product.type === 'product' && <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 bg-purple-50 text-purple-600 border-purple-200">Producto</Badge>}
                                  </div>
                                  <div className="flex flex-col items-end gap-0.5">
                                    <div className="flex items-center gap-1.5">
                                      <Switch
                                        checked={product.is_active}
                                        onCheckedChange={(checked) => handleToggleActive(product, checked)}
                                        className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-200 relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                                      />
                                      <span className={`text-[10px] font-medium ${product.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                                        {product.is_active ? 'Activo' : 'Inactivo'}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <h3 className="font-medium text-xs text-gray-800 mb-1 line-clamp-1">{product.title}</h3>

                                {product.type === 'link' && product.external_url && (
                                  <div className="flex items-center text-[10px] text-gray-600 mb-0.5">
                                    <ExternalLink className="w-2.5 h-2.5 mr-1" />
                                    <span className="truncate">{product.external_url}</span>
                                  </div>
                                )}

                                {product.price > 0 && (
                                  <div className="flex items-center text-[10px] text-green-600 font-medium mb-0.5">
                                    <DollarSign className="w-2.5 h-2.5 mr-1" />
                                    <span>${product.price}</span>
                                    {product.type === 'product' && (
                                      <span className="text-gray-500 ml-1.5">• 0 ventas</span>
                                    )}
                                  </div>
                                )}
                              </div>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-gray-400 h-7 w-7 p-0">
                                    <MoreVertical className="w-3.5 h-3.5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => onEdit(product)}>
                                    <Edit className="w-3.5 h-3.5 mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                                  {/* New DropdownMenuItem for Copy Link */}
                                  <DropdownMenuItem onClick={() => handleCopyLink(product)}>
                                    {copiedProductId === product.id ? (
                                      <Check className="w-3.5 h-3.5 mr-2 text-green-600" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5 mr-2" />
                                    )}
                                    {copiedProductId === product.id ? "Copiado!" : "Copiar Vínculo"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      // Updated "Ver" functionality to use username for unique URL
                                      if (!creator || !creator.username || !product.handle) return;
                                      const url = `${window.location.origin}/${creator.username}/${product.handle}`;
                                      window.open(url, '_blank');
                                    }}
                                  >
                                    <Eye className="w-3.5 h-3.5 mr-2" />
                                    Ver
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteClick(product)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 mr-2" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                  </AnimatePresence>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="¿Está seguro?"
        itemNameToConfirm={productToDelete?.title}
        confirmText="Borrar producto"
        cancelText="Cancelar"
      />
    </>
  );
}

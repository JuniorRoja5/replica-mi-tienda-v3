import React, { useState, useEffect } from "react";
import { Customer, Creator, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Users,
  Plus,
  Search,
  Download,
  Upload,
  MoreHorizontal,
  Trash2,
  Edit,
  FileText,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ExtractDataFromUploadedFile, UploadFile } from "@/api/integrations";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [creator, setCreator] = useState(null);
  const [importFile, setImportFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState(null);

  const customersPerPage = 30;
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const startIndex = (currentPage - 1) * customersPerPage;
  const endIndex = startIndex + customersPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm]);

  const loadData = async () => {
    try {
      const user = await User.me();
      const creators = await Creator.filter({ created_by: user.email });
      if (creators.length > 0) {
        setCreator(creators[0]);
        const customersList = await Customer.filter({ creator_id: creators[0].id });
        setCustomers(customersList);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCustomers = () => {
    if (!searchTerm) {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
    setCurrentPage(1);
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email || !creator) return;
    
    try {
      const customerData = {
        creator_id: creator.id,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        notes: newCustomer.notes,
        source: "manual",
        first_purchase_date: new Date().toISOString()
      };

      await Customer.create(customerData);
      setNewCustomer({ name: "", email: "", phone: "", notes: "" });
      setShowAddDialog(false);
      loadData();
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;
    
    try {
      await Customer.delete(customerToDelete.id);
      setCustomerToDelete(null);
      setShowDeleteDialog(false);
      loadData();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const handleImportCSV = async () => {
    if (!importFile || !creator) return;
    
    setIsImporting(true);
    try {
      const { file_url } = await UploadFile({ file: importFile });
      
      const csvSchema = {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" }
          }
        }
      };

      const result = await ExtractDataFromUploadedFile({
        file_url,
        json_schema: csvSchema
      });

      if (result.status === "success" && result.output) {
        const importedCustomers = [];
        const errors = [];

        for (const row of result.output) {
          if (row.name && row.email) {
            try {
              const customerData = {
                creator_id: creator.id,
                name: row.name,
                email: row.email,
                phone: row.phone || "",
                source: "csv_import",
                first_purchase_date: new Date().toISOString()
              };
              
              await Customer.create(customerData);
              importedCustomers.push(row);
            } catch (error) {
              errors.push(`${row.name} (${row.email}): ${error.message}`);
            }
          } else {
            errors.push(`Fila inválida: falta nombre o email`);
          }
        }

        setImportResults({
          success: importedCustomers.length,
          errors: errors.length,
          errorDetails: errors
        });

        if (importedCustomers.length > 0) {
          loadData();
        }
      }
    } catch (error) {
      console.error("Error importing CSV:", error);
      setImportResults({
        success: 0,
        errors: 1,
        errorDetails: ["Error al procesar el archivo CSV"]
      });
    } finally {
      setIsImporting(false);
    }
  };

  const exportToCSV = () => {
    const csvData = customers.map(customer => ({
      Nombre: customer.name,
      Email: customer.email,
      Teléfono: customer.phone || "",
      "Fecha de Cliente": customer.first_purchase_date ? format(new Date(customer.first_purchase_date), 'dd/MM/yyyy', { locale: es }) : "",
      "Total Compras": customer.total_purchases || 0,
      "Total Gastado": `$${(customer.total_spent || 0).toFixed(2)}`,
      Notas: customer.notes || ""
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `clientes_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Clientes</h1>
            <p className="text-gray-600">Gestiona tu base de clientes y contactos</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={exportToCSV}
              disabled={customers.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar contacto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Agregar nuevo contacto</DialogTitle>
                  <DialogDescription>
                    Ingresa los datos del contacto o importa desde CSV
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAddDialog(false);
                        setShowImportDialog(true);
                      }}
                      className="h-20 flex-col"
                    >
                      <Upload className="w-6 h-6 mb-2" />
                      Importar CSV
                    </Button>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="name">Nombre *</Label>
                        <Input
                          id="name"
                          value={newCustomer.name}
                          onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                          placeholder="Nombre completo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newCustomer.email}
                          onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                          placeholder="email@ejemplo.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          value={newCustomer.phone}
                          onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                          placeholder="+1234567890"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notas</Label>
                    <Textarea
                      id="notes"
                      value={newCustomer.notes}
                      onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                      placeholder="Notas adicionales..."
                      className="h-20"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleAddCustomer}
                      disabled={!newCustomer.name || !newCustomer.email}
                    >
                      Agregar contacto
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${customers.reduce((sum, customer) => sum + (customer.total_spent || 0), 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compras Totales</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.reduce((sum, customer) => sum + (customer.total_purchases || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Customers List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {currentCustomers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {customers.length === 0 ? "No tienes clientes aún" : "No se encontraron clientes"}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {customers.length === 0 
                  ? "Agrega tu primer contacto o espera a que alguien compre tus productos" 
                  : "Intenta con otros términos de búsqueda"}
              </p>
              {customers.length === 0 && (
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar primer contacto
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {currentCustomers.map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {customer.email}
                            </span>
                            {customer.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {customer.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-sm text-gray-500">Cliente desde</div>
                          <div className="font-medium">
                            {customer.first_purchase_date 
                              ? format(new Date(customer.first_purchase_date), 'dd MMM yyyy', { locale: es })
                              : 'N/A'}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-gray-500">Compras</div>
                          <div className="font-medium">{customer.total_purchases || 0}</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-gray-500">Total gastado</div>
                          <div className="font-bold text-green-600">
                            ${(customer.total_spent || 0).toFixed(2)}
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setCustomerToDelete(customer);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    {customer.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{customer.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end items-center gap-2 mt-8"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}

      {/* Import CSV Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Importar contactos desde CSV</DialogTitle>
            <DialogDescription>
              Sube un archivo CSV con las columnas: nombre, email, teléfono
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="csv-file">Archivo CSV</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={(e) => setImportFile(e.target.files[0])}
              />
              <p className="text-xs text-gray-500 mt-1">
                El archivo debe tener columnas: nombre, email, teléfono
              </p>
            </div>
            
            {importResults && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Resultados de importación:</h4>
                <p className="text-sm text-green-600">✓ {importResults.success} contactos importados</p>
                {importResults.errors > 0 && (
                  <p className="text-sm text-red-600">✗ {importResults.errors} errores</p>
                )}
              </div>
            )}
            
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowImportDialog(false);
                  setImportFile(null);
                  setImportResults(null);
                }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleImportCSV}
                disabled={!importFile || isImporting}
              >
                {isImporting ? "Importando..." : "Importar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar contacto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el contacto de {customerToDelete?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCustomer} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
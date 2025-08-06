import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  es: {
    // Navigation
    dashboard: "Home",
    products: "Productos",
    orders: "Pedidos",
    link: "Link",
    storefront: "Tienda",
    profile: "Perfil",
    
    // Dashboard
    welcomeBack: "Bienvenido de vuelta",
    storePerforming: "Así está funcionando tu tienda",
    viewStore: "Ver Tienda",
    addProduct: "Añadir Producto",
    totalRevenue: "Ingresos Totales",
    totalProducts: "Total Productos",
    totalOrders: "Total Pedidos",
    conversion: "Conversión",
    trendRevenue: "+12% del último mes",
    trendProducts: "{count} activos",
    trendOrders: "+5% de la última semana",
    trendConversion: "Por encima del promedio",
    recentOrders: "Pedidos Recientes",
    topProducts: "Productos Destacados",
    noOrdersYet: "Aún no hay pedidos",
    firstSale: "Tu primera venta aparecerá aquí",
    noProductsYet: "Aún no hay productos",
    addFirstProduct: "Añade Tu Primer Producto",
    quickActions: "Acciones Rápidas",
    manageProducts: "Gestionar Productos",
    addEditOrganize: "Añadir, editar u organizar tus productos",
    goToProducts: "Ir a Productos",
    customizeStore: "Personalizar Tienda",
    updateBranding: "Actualiza tu marca y perfil",
    editProfile: "Editar Perfil",
    viewAllOrders: "Ver Todos los Pedidos",
    trackSales: "Rastrea tus ventas y clientes",
    
    // Products
    manageDigitalProducts: "Gestiona tus productos digitales y ofertas",
    searchProducts: "Buscar productos...",
    allCategories: "Todas las Categorías",
    digitalProduct: "Producto Digital",
    course: "Curso",
    template: "Plantilla",
    ebook: "Libro Electrónico",
    preset: "Preset",
    other: "Otro",
    createFirst: "Crea tu primer producto para empezar a vender",
    sales: "ventas",
    active: "Activo",
    inactive: "Inactivo",
    edit: "Editar",
    
    // Product Form
    editProduct: "Editar Producto",
    addNewProduct: "Añadir Nuevo Producto",
    productImage: "Imagen del Producto",
    uploadImage: "Subir Imagen",
    searchLibrary: "Buscar en Biblioteca",
    uploading: "Subiendo...",
    productTitle: "Título del Producto",
    enterTitle: "Ingresa el título del producto",
    description: "Descripción",
    describeProduct: "Describe tu producto...",
    price: "Precio",
    category: "Categoría",
    productFile: "Archivo del Producto (Descarga)",
    fileUploaded: "Archivo subido ✓",
    uploadFile: "Subir Archivo",
    productActive: "El producto está activo",
    cancel: "Cancelar",
    saving: "Guardando...",
    updateProduct: "Actualizar Producto",
    createProduct: "Crear Producto",
    searchImageLibrary: "Buscar en la Biblioteca de Imágenes",
    searchImagesPlaceholder: "Buscar imágenes (ej. 'naturaleza', 'negocios')...",
    noImagesFound: "No se encontraron imágenes para tu búsqueda.",
    errorFetchingImages: "Ocurrió un error al buscar imágenes.",
    findPerfectImage: "Encuentra la imagen perfecta",
    startBySearching: "Comienza buscando arriba.",
    selectImage: "Seleccionar Imagen",

    // Storefront
    noStoreFound: "Tienda no encontrada",
    createProfileFirst: "Crea tu perfil primero",
    totalSales: "Ventas Totales",
    // "orders" key was duplicated, removed from here
    myProducts: "Mis Productos",
    browseCollection: "Explora mi colección de productos digitales",
    checkBackSoon: "Vuelve pronto para ver nuevos productos",
    popular: "Popular",
    buyNow: "Comprar Ahora",
    
    // Purchase Modal
    completePurchase: "Completar Compra",
    fullName: "Nombre Completo",
    enterFullName: "Ingresa tu nombre completo",
    email: "Correo Electrónico",
    enterEmail: "Ingresa tu correo electrónico",
    paymentMethod: "Método de Pago",
    securePayment: "Pago seguro procesado con encriptación SSL",
    secureCheckout: "Checkout 100% seguro y encriptado",
    processing: "Procesando...",
    payNow: "Pagar Ahora",
    purchaseComplete: "¡Compra Completada!",
    downloadSent: "El enlace de descarga ha sido enviado a tu correo",
    close: "Cerrar",
    
    // Link Preview
    linkPreviewTitle: "Vista Previa de tu Link",
    linkPreviewDescription: "Así es como otros verán tu página pública. Edita tu perfil para ver los cambios aquí en tiempo real.",
    copyLink: "Copiar Link",
    copied: "¡Copiado!",

    // Layout
    buildEmpire: "Construye tu imperio",
    goPro: "Hazte Pro",
    unlockFeatures: "Desbloquea funciones avanzadas",
    upgradeNow: "Actualizar Ahora",
    
    // Common
    search: "Buscar",
    filter: "Filtrar",
    loading: "Cargando...",
    save: "Guardar",
    delete: "Eliminar",
    confirm: "Confirm",
    
    // Language switcher
    language: "Idioma",
    spanish: "Español",
    english: "English"
  },
  en: {
    // Navigation
    dashboard: "Home",
    products: "Products",
    orders: "Orders",
    link: "Link",
    storefront: "Storefront",
    profile: "Profile",
    
    // Dashboard
    welcomeBack: "Welcome back",
    storePerforming: "Here's how your store is performing",
    viewStore: "View Store",
    addProduct: "Add Product",
    totalRevenue: "Total Revenue",
    totalProducts: "Products",
    totalOrders: "Orders",
    conversion: "Conversion",
    trendRevenue: "+12% from last month",
    trendProducts: "{count} active",
    trendOrders: "+5% from last week",
    trendConversion: "Above average",
    recentOrders: "Recent Orders",
    topProducts: "Top Products",
    noOrdersYet: "No orders yet",
    firstSale: "Your first sale will appear here",
    noProductsYet: "No products yet",
    addFirstProduct: "Add Your First Product",
    quickActions: "Quick Actions",
    manageProducts: "Manage Products",
    addEditOrganize: "Add, edit, or organize your products",
    goToProducts: "Go to Products",
    customizeStore: "Customize Store",
    updateBranding: "Update your branding and profile",
    editProfile: "Edit Profile",
    viewAllOrders: "View All Orders",
    trackSales: "Track your sales and customers",
    
    // Products
    manageDigitalProducts: "Manage your digital products and offerings",
    searchProducts: "Search products...",
    allCategories: "All Categories",
    digitalProduct: "Digital Product",
    course: "Course",
    template: "Template",
    ebook: "E-book",
    preset: "Preset",
    other: "Other",
    createFirst: "Create your first product to start selling",
    sales: "sales",
    active: "Active",
    inactive: "Inactive",
    edit: "Edit",
    
    // Product Form
    editProduct: "Edit Product",
    addNewProduct: "Add New Product",
    productImage: "Product Image",
    uploadImage: "Upload Image",
    searchLibrary: "Search Library",
    uploading: "Uploading...",
    productTitle: "Product Title",
    enterTitle: "Enter product title",
    description: "Description",
    describeProduct: "Describe your product...",
    price: "Price",
    category: "Category",
    productFile: "Product File (Download)",
    fileUploaded: "File uploaded ✓",
    uploadFile: "Upload File",
    productActive: "Product is active",
    cancel: "Cancel",
    saving: "Saving...",
    updateProduct: "Update Product",
    createProduct: "Create Product",
    searchImageLibrary: "Search Image Library",
    searchImagesPlaceholder: "Search for images (e.g., 'nature', 'business')...",
    noImagesFound: "No images found for your search.",
    errorFetchingImages: "An error occurred while fetching images.",
    findPerfectImage: "Find the perfect image",
    startBySearching: "Start by searching above.",
    selectImage: "Select Image",
    
    // Storefront
    noStoreFound: "No store found",
    createProfileFirst: "Create your profile first",
    totalSales: "Total Sales",
    // "orders" key was duplicated, removed from here
    myProducts: "My Products",
    browseCollection: "Browse my collection of digital products",
    checkBackSoon: "Check back soon for new products",
    popular: "Popular",
    buyNow: "Buy Now",
    
    // Purchase Modal
    completePurchase: "Complete Purchase",
    fullName: "Full Name",
    enterFullName: "Enter your full name",
    email: "Email",
    enterEmail: "Enter your email",
    paymentMethod: "Payment Method",
    securePayment: "Secure payment processed with SSL encryption",
    secureCheckout: "100% secure and encrypted checkout",
    processing: "Processing...",
    payNow: "Pay Now",
    purchaseComplete: "Purchase Complete!",
    downloadSent: "Download link has been sent to your email",
    close: "Close",
    
    // Link Preview
    linkPreviewTitle: "Your Link Preview",
    linkPreviewDescription: "This is how others will see your public page. Edit your profile to see the changes here in real-time.",
    copyLink: "Copy Link",
    copied: "Copied!",

    // Layout
    buildEmpire: "Build your empire",
    goPro: "Go Pro",
    unlockFeatures: "Unlock advanced features",
    upgradeNow: "Upgrade Now",
    
    // Common
    search: "Search",
    filter: "Filter",
    loading: "Loading...",
    save: "Save",
    delete: "Delete",
    confirm: "Confirm",
    
    // Language switcher
    language: "Language",
    spanish: "Español",
    english: "English"
  },
  fr: {
    // Navigation
    dashboard: "Accueil",
    products: "Produits",
    orders: "Commandes",
    link: "Lien",
    storefront: "Boutique",
    profile: "Profil",
    
    // Dashboard
    welcomeBack: "Bon retour",
    storePerforming: "Voici les performances de votre boutique",
    viewStore: "Voir la Boutique",
    addProduct: "Ajouter un Produit",
    totalRevenue: "Revenus Totaux",
    totalProducts: "Produits",
    totalOrders: "Commandes",
    conversion: "Conversion",
    trendRevenue: "+12% du mois dernier",
    trendProducts: "{count} actifs",
    trendOrders: "+5% de la semaine dernière",
    trendConversion: "Au-dessus de la moyenne",
    recentOrders: "Commandes Récentes",
    topProducts: "Produits Populaires",
    noOrdersYet: "Aucune commande pour le moment",
    firstSale: "Votre première vente apparaîtra ici",
    noProductsYet: "Aucun produit pour le moment",
    addFirstProduct: "Ajoutez Votre Premier Produit",
    quickActions: "Actions Rapides",
    manageProducts: "Gérer les Produits",
    addEditOrganize: "Ajouter, modifier ou organiser vos produits",
    goToProducts: "Aller aux Produits",
    customizeStore: "Personnaliser la Boutique",
    updateBranding: "Mettez à jour votre image de marque et profil",
    editProfile: "Modifier le Profil",
    viewAllOrders: "Voir Toutes les Commandes",
    trackSales: "Suivez vos ventes et clients",

    // Products
    manageDigitalProducts: "Gérer vos produits numériques et offres",
    searchProducts: "Rechercher des produits...",
    allCategories: "Toutes catégories",
    digitalProduct: "Produit numérique",
    course: "Cours",
    template: "Modèle",
    ebook: "E-book",
    preset: "Préréglage",
    other: "Autre",
    createFirst: "Créez votre premier produit pour commencer à vendre",
    sales: "ventes",
    active: "Actif",
    inactive: "Inactif",
    edit: "Modifier",

    // Product Form
    editProduct: "Modifier le produit",
    addNewProduct: "Ajouter un nouveau produit",
    productImage: "Image du produit",
    uploadImage: "Télécharger une image",
    searchLibrary: "Rechercher dans la bibliothèque",
    uploading: "Téléchargement...",
    productTitle: "Titre du produit",
    enterTitle: "Saisir le titre du produit",
    description: "Description",
    describeProduct: "Décrivez votre produit...",
    price: "Prix",
    category: "Catégorie",
    productFile: "Fichier produit (Téléchargement)",
    fileUploaded: "Fichier téléchargé ✓",
    uploadFile: "Télécharger un fichier",
    productActive: "Le produit est actif",
    cancel: "Annuler",
    saving: "Enregistrement...",
    updateProduct: "Mettre à jour le produit",
    createProduct: "Créer un produit",
    searchImageLibrary: "Rechercher dans la bibliothèque d'images",
    searchImagesPlaceholder: "Rechercher des images (ex. 'nature', 'affaires')...",
    noImagesFound: "Aucune image trouvée pour votre recherche.",
    errorFetchingImages: "Une erreur est survenue lors de la récupération des images.",
    findPerfectImage: "Trouver l'image parfaite",
    startBySearching: "Commencez par rechercher ci-dessus.",
    selectImage: "Sélectionner l'image",

    // Storefront
    noStoreFound: "Aucune boutique trouvée",
    createProfileFirst: "Créez d'abord votre profil",
    totalSales: "Ventes totales",
    // "orders" key was duplicated, removed from here
    myProducts: "Mes produits",
    browseCollection: "Parcourir ma collection de produits numériques",
    checkBackSoon: "Revenez bientôt pour de nouveaux produits",
    popular: "Populaire",
    buyNow: "Acheter maintenant",

    // Purchase Modal
    completePurchase: "Finaliser l'achat",
    fullName: "Nom complet",
    enterFullName: "Saisissez votre nom complet",
    email: "E-mail",
    enterEmail: "Saisissez votre e-mail",
    paymentMethod: "Méthode de paiement",
    securePayment: "Paiement sécurisé traité avec cryptage SSL",
    secureCheckout: "Paiement 100% sécurisé et crypté",
    processing: "Traitement...",
    payNow: "Payer maintenant",
    purchaseComplete: "Achat terminé !",
    downloadSent: "Le lien de téléchargement a été envoyé à votre e-mail",
    close: "Fermer",

    // Link Preview
    linkPreviewTitle: "Aperçu de votre lien",
    linkPreviewDescription: "C'est ainsi que les autres verront votre page publique. Modifiez votre profil pour voir les changements ici en temps réel.",
    copyLink: "Copier le lien",
    copied: "Copié !",
    
    // Layout
    buildEmpire: "Construisez votre empire",
    goPro: "Passer Pro",
    unlockFeatures: "Débloquez des fonctionnalités avancées",
    upgradeNow: "Mettre à niveau maintenant",

    // Common
    search: "Rechercher",
    filter: "Filtrer",
    loading: "Chargement...",
    save: "Sauvegarder",
    delete: "Supprimer",
    confirm: "Confirmer",
    
    // Language switcher
    language: "Langue",
    spanish: "Español",
    english: "English",
    french: "Français"
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('es'); // Spanish as default

  const t = (key) => {
    return translations[language][key] || key;
  };

  const switchLanguage = (lang) => {
    setLanguage(lang);
  };

  const value = {
    language,
    setLanguage: switchLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

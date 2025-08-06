
import React, { useState, useRef, useEffect, useCallback, useMemo, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Library,
  Package,
  X,
  DollarSign,
  Star,
  Mail,
  Sparkles,
  Loader2,
  Save,
  Plus,
  ChevronDown,
  GripVertical,
  Users,
  Copy,
  Check,
  TrendingUp,
  Eye,
  ShoppingCart,
  Video,
  Globe,
  Clock,
  Calendar,
  Trash2,
  BookOpen, // New Icon for Course
  File as FileIcon // New Icon for attachments
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { UploadFile, InvokeLLM } from "@/api/integrations";
import ImageSearchModal from "./ImageSearchModal";
import RichTextEditor from "./RichTextEditor";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Affiliate, AffiliateEarning, User } from "@/api/entities";

// Hook personalizado para debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// --- Helper Components & Data ---
const commonTimezones = [
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "Europe/London", "Europe/Paris", "Europe/Berlin", "Asia/Tokyo", "Australia/Sydney",
  "America/Mexico_City", "America/Bogota", "America/Buenos_Aires", "Europe/Madrid"
];

const ProductFormWizard = forwardRef(({ product, onSave, onCancel, productType, isInline = true, onDataChange, onStepChange }, ref) => {
  const isConsultation = productType === 'consultation';
  const isCourse = productType === 'course';
  const isMembership = productType === 'membership';

  const WIZARD_STEPS = useMemo(() => {
    let steps = [
      { id: 1, title: "1. Datos", shortTitle: "1. Datos" },
      { id: 2, title: "2. Contenido y Precio", shortTitle: "2. Contenido" },
    ];
    
    if (isCourse) {
        steps.push({ id: 3, title: "3. Curso", shortTitle: "3. Curso", icon: BookOpen });
    }
    
    if (isConsultation) {
      steps.push({ id: (isCourse ? 4 : 3), title: "3. Disponibilidad", shortTitle: "3. Disp." });
    }

    const optionsStepNumber = steps.length + 1; // Dynamically calculate the next step number
    steps.push({ id: optionsStepNumber, title: `${optionsStepNumber}. Opciones`, shortTitle: "Opciones" });

    // Re-assign IDs to ensure they are sequential
    return steps.map((step, index) => ({ ...step, id: index + 1 }));

  }, [isConsultation, isCourse]);

  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showImageSearch, setShowImageSearch] = useState(false);
  const [showHeaderImageSearch, setShowHeaderImageSearch] = useState(false);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [affiliates, setAffiliates] = useState([]);
  const [affiliateSettings, setAffiliateSettings] = useState({
    enabled: product?.affiliate_settings?.enabled || false,
    commission_percentage: product?.affiliate_settings?.commission_percentage || 10
  });
  const [newAffiliateUsername, setNewAffiliateUsername] = useState("");
  const [copiedLink, setCopiedLink] = useState("");

  const getPlaceholders = useCallback((type) => {
    switch (type) {
      case 'consultation':
        return {
          title: "Ejemplo: Agenda una llamada personalizada conmigo",
          subtitle: "Ejemplo: Reserva una sesión privada de coaching 1 a 1",
          description: "Ejemplo: Esta sesión de coaching personalizada está diseñada para ayudarle a desbloquear su máximo potencial. Durante 60 minutos trabajaremos juntos en sus objetivos personales o profesionales y definiremos una hoja de ruta clara para alcanzarlos."
        };
      case 'course':
        return {
          title: "Ej: Curso Completo de Marketing Digital",
          subtitle: "Un curso completo que te enseñará todo lo que necesitas saber",
          description: "Este curso le enseñará todo lo que necesita saber para alcanzar sus metas. Es la guía ideal si usted está buscando:\n- Alcanzar sus sueños\n- Encontrar propósito en su trabajo\n- Mejorar sus finanzas\n- Ser más feliz",
          courseTitle: "Ejemplo: Domine el arte del trading desde cero",
          courseDescription: "Ejemplo: En este curso aprenderá paso a paso los fundamentos, estrategias y herramientas necesarias para convertirse en un trader rentable. Ideal para principiantes y también útil para quienes ya tienen experiencia.",
          lessonTitle: "Ejemplo: Bienvenida al curso",
          lessonDescription: "Ejemplo: En esta lección le damos la bienvenida y explicamos cómo navegar el curso."
        };
      case 'membership':
        return {
          title: "Ej: Membresía Exclusiva Premium",
          subtitle: "Acceso completo a contenido exclusivo y comunidad privada",
          description: "Únete a nuestra comunidad exclusiva y obtén acceso a contenido premium, eventos privados y mucho más."
        };
      default: // digital_product
        return {
          title: "Ej: Guía Completa de Marketing Digital",
          subtitle: "Un subtítulo breve y atractivo que describa el valor de tu producto",
          description: "Este template le enseñará todo lo que necesita saber para alcanzar sus metas. Es la guía ideal si usted está buscando:\n- Alcanzar sus sueños\n- Encontrar propósito en su trabajo\n- Mejorar sus finanzas\n- Ser más feliz"
        };
    }
  }, []);

  const placeholders = useMemo(() => getPlaceholders(productType), [productType, getPlaceholders]);

  // Helper function to convert price string to number for internal use
  const convertPriceForSave = useCallback((priceString) => {
    const num = parseFloat(priceString);
    return isNaN(num) ? 0 : num;
  }, []);

  // Estado interno para campos de texto
  const [formData, setFormData] = useState({
    title: product?.title || "",
    subtitle: product?.subtitle || "",
    image_url: product?.image_url || "",
    description: product?.description || "",
    price: product?.price !== undefined && product.price !== null ? String(product.price) : "",
    has_discount: product?.has_discount || false,
    discount_price: product?.discount_price !== undefined && product.discount_price !== null ? String(product.discount_price) : "",
    file_url: product?.file_url || "",
    header_image_url: product?.header_image_url || "",
    reviews: product?.reviews || [],
    course_content: product?.course_content || {
        header_image_url: '',
        title: '',
        description: '',
        modules: [
            { id: `m_${Date.now()}_1`, title: 'Introducción', lessons: [
                { id: `l_${Date.now()}_1`, title: 'Bienvenida al curso', description: 'En esta lección te damos la bienvenida y explicamos cómo navegar el curso.', video_url: '', attachments: [] }
            ] },
            { id: `m_${Date.now()}_2`, title: 'Capítulo 1', lessons: [] },
            { id: `m_${Date.now()}_3`, title: 'Capítulo 2', lessons: [] }
        ]
    },
    confirmation_email: product?.confirmation_email || {
      subject: "¡Gracias por tu compra, {customer_name}!",
      message: "<p>Hola, <span class='email-variable' data-variable='customer_name'>{customer_name}</span></p><p><br></p><p>Gracias por comprar <span class='email-variable' data-variable='product_title'>{product_title}</span>. Tu descarga está disponible en el enlace de abajo:</p><p><span class='email-variable' data-variable='download_link'>{download_link}</span></p><p><br></p><p>¡Disfruta tu compra!</p><p><br></p><p>Saludos,</p><p><span class='email-variable' data-variable='creator_name'>{creator_name}</span></p>"
    },
    collect_info_fields: product?.collect_info_fields || [
      { id: 'name', label: 'Nombre completo', type: 'text', required: true },
      { id: 'email', label: 'Correo electrónico', type: 'email', required: true }
    ],
    action_button_text: product?.action_button_text || "Comprar ahora",
    category: 'digital-product',
    is_active: product?.is_active ?? true,
    type: 'product',
    product_type: productType,
    affiliate_settings: product?.affiliate_settings || {
      enabled: false,
      commission_percentage: 10
    },
    availability_settings: product?.availability_settings || {
        call_method: 'google_meet',
        custom_call_link: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        duration: 30,
        notice_period: { value: 12, unit: 'hours' },
        buffer_time: { before: 15, after: 15 },
        booking_window: 60,
        weekly_availability: [
            { day: 'sunday', name: 'Domingo', enabled: false, intervals: [] },
            { day: 'monday', name: 'Lunes', enabled: true, intervals: [{ from: '09:00', to: '17:00' }] },
            { day: 'tuesday', name: 'Martes', enabled: true, intervals: [{ from: '09:00', to: '17:00' }] },
            { day: 'wednesday', name: 'Miércoles', enabled: true, intervals: [{ from: '09:00', to: '17:00' }] },
            { day: 'thursday', name: 'Jueves', enabled: true, intervals: [{ from: '09:00', to: '17:00' }] },
            { day: 'friday', name: 'Viernes', enabled: true, intervals: [{ from: '09:00', to: '17:00' }] },
            { day: 'saturday', name: 'Sábado', enabled: false, intervals: [] },
        ]
    },
    billing_settings: product?.billing_settings || {
        frequency: 'monthly',
        has_end_date: false,
        end_after_months: 12,
    }
  });

  const [uploadedFileName, setUploadedFileName] = useState(
    product?.file_url ? decodeURIComponent(product.file_url.split('/').pop().split('?')[0]) : ''
  );

  // Efecto para sincronizar el estado del formulario con el producto que se está editando
  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      title: product?.title || "",
      subtitle: product?.subtitle || "",
      image_url: product?.image_url || "",
      description: product?.description || "",
      price: product?.price !== undefined && product.price !== null ? String(product.price) : "",
      has_discount: product?.has_discount || false,
      discount_price: product?.discount_price !== undefined && product.discount_price !== null ? String(product.discount_price) : "",
      file_url: product?.file_url || "",
      header_image_url: product?.header_image_url || "",
      reviews: product?.reviews || [],
      course_content: product?.course_content || {
          header_image_url: '',
          title: '',
          description: '',
          modules: [
              { id: `m_${Date.now()}_1`, title: 'Introducción', lessons: [
                  { id: `l_${Date.now()}_1`, title: 'Bienvenida al curso', description: 'En esta lección te damos la bienvenida y explicamos cómo navegar el curso.', video_url: '', attachments: [] }
              ] },
              { id: `m_${Date.now()}_2`, title: 'Capítulo 1', lessons: [] },
              { id: `m_${Date.now()}_3`, title: 'Capítulo 2', lessons: [] }
          ]
      },
      confirmation_email: product?.confirmation_email || {
        subject: "¡Gracias por tu compra, {customer_name}!",
        message: "<p>Hola, <span class='email-variable' data-variable='customer_name'>{customer_name}</span></p><p><br></p><p>Gracias por comprar <span class='email-variable' data-variable='product_title'>{product_title}</span>. Tu descarga está disponible en el enlace de abajo:</p><p><span class='email-variable' data-variable='download_link'>{download_link}</span></p><p><br></p><p>¡Disfruta tu compra!</p><p><br></p><p>Saludos,</p><p><span class='email-variable' data-variable='creator_name'>{creator_name}</span></p>"
      },
      collect_info_fields: product?.collect_info_fields || [
        { id: 'name', label: 'Nombre completo', type: 'text', required: true },
        { id: 'email', label: 'Correo electrónico', type: 'email', required: true }
      ],
      action_button_text: product?.action_button_text || "Comprar ahora",
      category: product?.category || 'digital-product',
      is_active: product?.is_active ?? true,
      type: 'product',
      product_type: productType,
      affiliate_settings: product?.affiliate_settings || {
        enabled: false,
        commission_percentage: 10
      },
      availability_settings: product?.availability_settings || {
        call_method: 'google_meet',
        custom_call_link: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        duration: 30,
        notice_period: { value: 12, unit: 'hours' },
        buffer_time: { before: 15, after: 15 },
        booking_window: 60,
        weekly_availability: [
            { day: 'sunday', name: 'Domingo', enabled: false, intervals: [] },
            { day: 'monday', name: 'Lunes', enabled: true, intervals: [{ from: '09:00', to: '17:00' }] },
            { day: 'tuesday', name: 'Martes', enabled: true, intervals: [{ from: '09:00', to: '17:00' }] },
            { day: 'wednesday', name: 'Miércoles', enabled: true, intervals: [{ from: '09:00', to: '17:00' }] },
            { day: 'thursday', name: 'Jueves', enabled: true, intervals: [{ from: '09:00', to: '17:00' }] },
            { day: 'friday', name: 'Viernes', enabled: true, intervals: [{ from: '09:00', to: '17:00' }] },
            { day: 'saturday', name: 'Sábado', enabled: false, intervals: [] },
        ]
      },
      billing_settings: product?.billing_settings || {
        frequency: 'monthly',
        has_end_date: false,
        end_after_months: 12,
      },
    }));
    
    setAffiliateSettings({
      enabled: product?.affiliate_settings?.enabled || false,
      commission_percentage: product?.affiliate_settings?.commission_percentage || 10
    });
    
    setUploadedFileName(product?.file_url ? decodeURIComponent(product.file_url.split('/').pop().split('?')[0]) : '');
    
    // Cargar afiliados existentes si estamos editando un producto
    if (product?.id) {
      loadAffiliates();
    }
  }, [product, productType]);

  // Aplicar debounce a TODOS los campos de texto por igual
  const debouncedTitle = useDebounce(formData.title, 300);
  const debouncedSubtitle = useDebounce(formData.subtitle, 300);
  const debouncedDescription = useDebounce(formData.description, 300);
  const debouncedPrice = useDebounce(formData.price, 300);
  const debouncedDiscountPrice = useDebounce(formData.discount_price, 300);

  // Estado estable para la vista previa
  const previewData = useMemo(() => ({
    ...formData,
    title: debouncedTitle || placeholders.title,
    subtitle: debouncedSubtitle || placeholders.subtitle,
    description: debouncedDescription || placeholders.description,
    price: debouncedPrice,
    discount_price: debouncedDiscountPrice
  }), [formData, debouncedTitle, debouncedSubtitle, debouncedDescription, debouncedPrice, debouncedDiscountPrice, placeholders]);

  // Callback estable para onDataChange
  const handleDataChangeStable = useCallback((data) => {
    if (onDataChange && typeof onDataChange === 'function') {
      onDataChange(data);
    }
  }, [onDataChange]);

  // Solo actualizar vista previa cuando cambien los valores debounced
  useEffect(() => {
    handleDataChangeStable(previewData);
  }, [previewData, handleDataChangeStable]);

  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);

  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const headerImageInputRef = useRef(null);
  const emailEditorRef = useRef(null);
  const lessonVideoInputRefs = useRef({});
  const lessonAttachmentInputRefs = useRef({});

  // Handlers optimizados
  const handleTitleChange = useCallback((e) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setFormData(prev => ({ ...prev, title: value }));
    }
  }, []);

  const handleSubtitleChange = useCallback((e) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setFormData(prev => ({ ...prev, subtitle: value }));
    }
  }, []);

  const handleDescriptionChange = useCallback((value) => {
    setFormData(prev => ({ ...prev, description: value }));
  }, []);

  const handlePriceChange = useCallback((e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, price: value }));
    }
  }, []);

  const handleDiscountPriceChange = useCallback((e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, discount_price: value }));
    }
  }, []);

  const handleDiscountToggle = useCallback((checked) => {
    setFormData(prev => ({ ...prev, has_discount: checked }));
  }, []);

  // Handlers para subida de archivos
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, image_url: file_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleHeaderImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, header_image_url: file_url }));
    } catch (error) {
      console.error("Error uploading header image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    setUploadedFileName(file.name);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, file_url }));
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handler para generar descripción con IA
  const handleGenerateAIDescription = async () => {
    if (!aiPrompt.trim()) return;

    setIsGeneratingAI(true);
    try {
      const prompt = `Eres un experto en marketing digital. Crea una descripción atractiva y persuasiva para un producto digital basándose en estas ideas clave: "${aiPrompt}".

La descripción DEBE seguir esta estructura estrictamente:
1. Un párrafo inicial con un resumen general del producto.
2. Varias frases o subtítulos clave en **negrita** para resaltar los beneficios principales.
3. Una lista con viñetas (bullet points) de al menos 3 puntos, detallando ventajas o aprendizajes clave. Usa un guion (-) para cada punto.
4. Un cierre breve con una llamada a la acción (ejemplo: "Empiece hoy mismo.").

Usa un tono profesional pero cercano y escribe en español.
Solo devuelve el contenido de la descripción, sin explicaciones adicionales.`;

      const response = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false
      });

      setFormData(prev => ({ ...prev, description: response }));
      setShowAIPrompt(false);
      setAiPrompt("");
    } catch (error) {
      console.error("Error generating AI description:", error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Navegación entre pasos
  const handleNextStep = () => {
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  useImperativeHandle(ref, () => ({
    goBack: handlePrevStep,
  }));

  // Guardar como borrador
  const handleSaveAsDraft = async () => {
    setIsSaving(true);
    try {
      const draftData = {
        ...previewData,
        price: convertPriceForSave(previewData.price),
        discount_price: convertPriceForSave(previewData.discount_price),
        header_image_url: formData.header_image_url,
        is_active: false,
        ...(isCourse && { course_content: formData.course_content }),
        ...(isConsultation && { availability_settings: formData.availability_settings }),
        ...(isMembership && { billing_settings: formData.billing_settings })
      };
      await onSave(draftData);
    } catch (error) {
      console.error("Error saving draft:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Crear producto final
  const handleCreateProduct = async () => {
    setIsSaving(true);
    try {
      const finalData = {
        ...previewData,
        price: convertPriceForSave(previewData.price),
        discount_price: convertPriceForSave(previewData.discount_price),
        header_image_url: formData.header_image_url,
        affiliate_settings: formData.affiliate_settings,
        ...(isConsultation && { availability_settings: formData.availability_settings }), // Add availability settings if consultation
        ...(isCourse && { course_content: formData.course_content }), // Add course content if course
        ...(isMembership && { billing_settings: formData.billing_settings })
      };
      await onSave(finalData);
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Funciones para reviews
  const addReview = useCallback(() => {
    const newReview = {
      id: Date.now().toString(),
      customer_name: "",
      rating: 5,
      comment: "",
      avatar_url: ""
    };
    setFormData(prev => ({ ...prev, reviews: [...prev.reviews, newReview] }));
  }, []);

  const removeReview = useCallback((reviewId) => {
    setFormData(prev => ({ 
      ...prev, 
      reviews: prev.reviews.filter(review => review.id !== reviewId) 
    }));
  }, []);

  const updateReview = useCallback((reviewId, updates) => {
    setFormData(prev => ({
      ...prev,
      reviews: prev.reviews.map(review =>
        review.id === reviewId ? { ...review, ...updates } : review
      )
    }));
  }, []);
  
  const handleReviewDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(formData.reviews);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setFormData(prev => ({ ...prev, reviews: items }));
  };

  // Funciones para campos personalizados
  const addCustomField = useCallback(() => {
    const newField = {
      id: Date.now().toString(),
      label: '',
      type: 'text',
      required: false
    };
    setFormData(prev => ({
      ...prev,
      collect_info_fields: [...prev.collect_info_fields, newField]
    }));
  }, []);

  const removeCustomField = useCallback((fieldId) => {
    setFormData(prev => ({
      ...prev,
      collect_info_fields: prev.collect_info_fields.filter(field => field.id !== fieldId)
    }));
  }, []);

  const updateCustomField = useCallback((fieldId, updates) => {
    setFormData(prev => ({
      ...prev,
      collect_info_fields: prev.collect_info_fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  }, []);

  // Función para insertar variables en el campo de asunto
  const handleInsertSubjectVariable = (variable) => {
    const subjectInput = document.querySelector('input[placeholder="¡Gracias por tu compra!"]');
    if (subjectInput) {
      const currentValue = formData.confirmation_email.subject;
      const start = subjectInput.selectionStart || 0;
      const end = subjectInput.selectionEnd || 0;
      const newValue = currentValue.substring(0, start) + variable + currentValue.substring(end, currentValue.length);
      
      setFormData(prev => ({
        ...prev,
        confirmation_email: {
          ...prev.confirmation_email,
          subject: newValue
        }
      }));
      
      setTimeout(() => {
        if (subjectInput) {
          const newCursorPos = start + variable.length;
          subjectInput.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
  };

  // Función mejorada para insertar variables en el editor de texto enriquecido
  const handleInsertEmailVariable = (variable) => {
    if (emailEditorRef.current) {
      const wrappedVariable = `<span class="email-variable" data-variable="${variable.replace(/[{}]/g, '')}">${variable}</span>`;
      emailEditorRef.current.insertHTMLAtCursor(wrappedVariable);
    }
  };

  // Cargar afiliados para el producto
  const loadAffiliates = async () => {
    if (!product?.id) return;
    try {
      const productAffiliates = await Affiliate.filter({ product_id: product.id });
      setAffiliates(productAffiliates);
    } catch (error) {
      console.error("Error loading affiliates:", error);
    }
  };

  // Agregar nuevo afiliado
  const handleAddAffiliate = async () => {
    if (!newAffiliateUsername.trim() || !product?.id || !product?.creator_id) return;
    
    try {
      const users = await User.filter({ email: `${newAffiliateUsername}@*` });
      let affiliateUser = users.find(u => u.email.startsWith(newAffiliateUsername + '@'));

      if (!affiliateUser) {
        alert("Usuario no encontrado. El afiliado debe estar registrado en ClickMyLink.");
        setNewAffiliateUsername("");
        return;
      }

      const existingAffiliate = affiliates.find(aff => aff.affiliate_username === newAffiliateUsername);
      if (existingAffiliate) {
        alert("Este usuario ya es un afiliado para este producto.");
        setNewAffiliateUsername("");
        return;
      }

      const productSlug = product.slug || product.id;
      const affiliateLink = `${window.location.origin}/${product.creator_username || 'creator'}/${productSlug}?ref=${newAffiliateUsername}`;
      
      const newAffiliate = await Affiliate.create({
        product_id: product.id,
        creator_id: product.creator_id,
        affiliate_username: newAffiliateUsername,
        affiliate_email: affiliateUser.email,
        commission_percentage: affiliateSettings.commission_percentage,
        affiliate_link: affiliateLink,
        total_clicks: 0,
        total_sales: 0,
        total_commission: 0,
        is_active: true
      });

      setAffiliates(prev => [...prev, newAffiliate]);
      setNewAffiliateUsername("");
    } catch (error) {
      console.error("Error adding affiliate:", error);
      alert("Error al agregar afiliado. Verifica que el usuario existe y que tienes permisos.");
    }
  };

  // Copiar enlace de afiliado
  const handleCopyAffiliateLink = (link) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(""), 2000);
  };

  // Actualizar configuración de afiliados
  const updateAffiliateSettings = (updates) => {
    setAffiliateSettings(prev => ({ ...prev, ...updates }));
    setFormData(prev => ({
      ...prev,
      affiliate_settings: { ...prev.affiliate_settings, ...updates }
    }));
  };

  // Handlers for Availability Settings (Consultation)
  const handleAvailabilityChange = useCallback((field, value) => {
    setFormData(prev => ({
        ...prev,
        availability_settings: {
            ...prev.availability_settings,
            [field]: value
        }
    }));
  }, []);

  const handleWeeklyDayChange = useCallback((dayIndex, updates) => {
    setFormData(prev => {
        const newWeeklyAvailability = [...prev.availability_settings.weekly_availability];
        newWeeklyAvailability[dayIndex] = { ...newWeeklyAvailability[dayIndex], ...updates };
        // If disabling a day, clear its intervals
        if (!updates.enabled) {
            newWeeklyAvailability[dayIndex].intervals = [];
        } else if (updates.enabled && newWeeklyAvailability[dayIndex].intervals.length === 0) {
            // If enabling a day and it has no intervals, add a default one
            newWeeklyAvailability[dayIndex].intervals = [{ from: '09:00', to: '17:00' }];
        }
        return {
            ...prev,
            availability_settings: {
                ...prev.availability_settings,
                weekly_availability: newWeeklyAvailability
            }
        };
    });
  }, []);

  const addInterval = useCallback((dayIndex) => {
      setFormData(prev => {
          const newWeeklyAvailability = [...prev.availability_settings.weekly_availability];
          newWeeklyAvailability[dayIndex].intervals.push({ from: '09:00', to: '17:00' });
          return { ...prev, availability_settings: { ...prev.availability_settings, weekly_availability: newWeeklyAvailability } };
      });
  }, []);

  const removeInterval = useCallback((dayIndex, intervalIndex) => {
      setFormData(prev => {
          const newWeeklyAvailability = [...prev.availability_settings.weekly_availability];
          newWeeklyAvailability[dayIndex].intervals.splice(intervalIndex, 1);
          return { ...prev, availability_settings: { ...prev.availability_settings, weekly_availability: newWeeklyAvailability } };
      });
  }, []);

  const updateInterval = useCallback((dayIndex, intervalIndex, fromOrTo, value) => {
      setFormData(prev => {
          const newWeeklyAvailability = [...prev.availability_settings.weekly_availability];
          newWeeklyAvailability[dayIndex].intervals[intervalIndex][fromOrTo] = value;
          return { ...prev, availability_settings: { ...prev.availability_settings, weekly_availability: newWeeklyAvailability } };
      });
  }, []);

  // Handlers for Billing Settings (Membership)
  const handleBillingSettingsChange = useCallback((field, value) => {
    setFormData(prev => ({
        ...prev,
        billing_settings: {
            ...prev.billing_settings,
            [field]: value
        }
    }));
  }, []);

  // Handlers for Course Content (Course Builder)
  const handleCourseContentChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      course_content: {
        ...prev.course_content,
        [field]: value
      }
    }));
  }, []);

  const handleCourseHeaderImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      handleCourseContentChange('header_image_url', file_url);
    } catch (error) {
      console.error("Error uploading course header image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddModule = useCallback(() => {
    setFormData(prev => {
      const newModule = {
        id: `m_${Date.now()}`,
        title: `Nuevo Módulo ${prev.course_content.modules.length + 1}`,
        lessons: []
      };
      return {
        ...prev,
        course_content: {
          ...prev.course_content,
          modules: [...prev.course_content.modules, newModule]
        }
      };
    });
  }, []);
  
  const handleUpdateModule = useCallback((moduleId, newTitle) => {
    setFormData(prev => ({
      ...prev,
      course_content: {
        ...prev.course_content,
        modules: prev.course_content.modules.map(m => 
          m.id === moduleId ? { ...m, title: newTitle } : m
        )
      }
    }));
  }, []);

  const handleRemoveModule = useCallback((moduleIdToRemove) => {
    setFormData(prev => ({
        ...prev,
        course_content: {
            ...prev.course_content,
            modules: prev.course_content.modules.filter(m => m.id !== moduleIdToRemove)
        }
    }));
  }, []);

  const handleAddLesson = useCallback((moduleId) => {
    setFormData(prev => ({
      ...prev,
      course_content: {
        ...prev.course_content,
        modules: prev.course_content.modules.map(m => {
          if (m.id === moduleId) {
            const newLesson = {
              id: `l_${Date.now()}`,
              title: 'Nueva Lección',
              description: '',
              video_url: '',
              attachments: []
            };
            return { ...m, lessons: [...m.lessons, newLesson] };
          }
          return m;
        })
      }
    }));
  }, []);

  const handleUpdateLesson = useCallback((moduleId, lessonId, field, value) => {
    setFormData(prev => ({
        ...prev,
        course_content: {
            ...prev.course_content,
            modules: prev.course_content.modules.map(m => {
                if (m.id === moduleId) {
                    return {
                        ...m,
                        lessons: m.lessons.map(l => 
                            l.id === lessonId ? { ...l, [field]: value } : l
                        )
                    };
                }
                return m;
            })
        }
    }));
  }, []);

  const handleRemoveLesson = useCallback((moduleId, lessonIdToRemove) => {
      setFormData(prev => ({
          ...prev,
          course_content: {
              ...prev.course_content,
              modules: prev.course_content.modules.map(m => {
                  if (m.id === moduleId) {
                      return { ...m, lessons: m.lessons.filter(l => l.id !== lessonIdToRemove) };
                  }
                  return m;
              })
          }
      }));
  }, []);

  const handleUploadLessonFile = async (moduleId, lessonId, file, type) => {
      if (!file) return;
      setIsUploading(true);
      try {
          const { file_url } = await UploadFile({ file });
          setFormData(prev => ({
              ...prev,
              course_content: {
                  ...prev.course_content,
                  modules: prev.course_content.modules.map(m => {
                      if (m.id === moduleId) {
                          return {
                              ...m,
                              lessons: m.lessons.map(l => {
                                  if (l.id === lessonId) {
                                      if (type === 'video') {
                                          return { ...l, video_url: file_url };
                                      }
                                      if (type === 'attachment') {
                                          const newAttachment = { name: file.name, url: file_url };
                                          return { ...l, attachments: [...l.attachments, newAttachment] };
                                      }
                                  }
                                  return l;
                              })
                          };
                      }
                      return m;
                  })
              }
          }));
      } catch (error) {
          console.error("Error uploading lesson file:", error);
      } finally {
          setIsUploading(false);
      }
  };

  const handleRemoveAttachment = useCallback((moduleId, lessonId, attachmentUrl) => {
      setFormData(prev => ({
          ...prev,
          course_content: {
              ...prev.course_content,
              modules: prev.course_content.modules.map(m => {
                  if (m.id === moduleId) {
                      return {
                          ...m,
                          lessons: m.lessons.map(l => {
                              if (l.id === lessonId) {
                                  return { ...l, attachments: l.attachments.filter(att => att.url !== attachmentUrl) };
                              }
                              return l;
                          })
                      };
                  }
                  return m;
              })
          }
      }));
  }, []);

  const onDragEnd = (result) => {
      const { source, destination, type } = result;
      if (!destination) return;

      if (type === 'MODULES') {
          const reorderedModules = Array.from(formData.course_content.modules);
          const [removed] = reorderedModules.splice(source.index, 1);
          reorderedModules.splice(destination.index, 0, removed);
          handleCourseContentChange('modules', reorderedModules);
      } else { // type is 'LESSONS'
          const sourceModuleId = source.droppableId;
          const destModuleId = destination.droppableId;

          const sourceModule = formData.course_content.modules.find(m => m.id === sourceModuleId);
          const destModule = formData.course_content.modules.find(m => m.id === destModuleId);

          if (!sourceModule || !destModule) return; // Should not happen

          const newModules = [...formData.course_content.modules];

          if (sourceModuleId === destModuleId) {
              // Reordering within the same module
              const newLessons = Array.from(sourceModule.lessons);
              const [removed] = newLessons.splice(source.index, 1);
              newLessons.splice(destination.index, 0, removed);
              
              const moduleIndex = newModules.findIndex(m => m.id === sourceModuleId);
              newModules[moduleIndex] = { ...newModules[moduleIndex], lessons: newLessons };
          } else {
              // Moving between modules
              const sourceLessons = Array.from(sourceModule.lessons);
              const [movedLesson] = sourceLessons.splice(source.index, 1);

              const destLessons = Array.from(destModule.lessons);
              destLessons.splice(destination.index, 0, movedLesson);

              const sourceModuleIndex = newModules.findIndex(m => m.id === sourceModuleId);
              newModules[sourceModuleIndex] = { ...newModules[sourceModuleIndex], lessons: sourceLessons };
              
              const destModuleIndex = newModules.findIndex(m => m.id === destModuleId);
              newModules[destModuleIndex] = { ...newModules[destModuleIndex], lessons: destLessons };
          }
          handleCourseContentChange('modules', newModules);
      }
  };

  const [courseSection, setCourseSection] = useState('page');

  // Renderizar Página 1: Datos básicos
  const renderStep1 = () => {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Datos básicos del producto</h2>
          <p className="text-gray-600">Información principal que verán tus clientes</p>
        </div>

        <div className="space-y-6">
          {/* Imagen del Producto */}
          <div className="space-y-3">
            <Label className="text-gray-700 font-medium">Imagen del Producto</Label>
            <div className="flex items-center gap-6">
              {formData.image_url ? (
                <img
                  src={formData.image_url}
                  alt="Product preview"
                  className="w-32 h-32 object-cover rounded-xl border border-gray-200 shadow-sm"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="flex flex-col gap-3">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploading}
                  onClick={() => imageInputRef.current?.click()}
                  className="w-48"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? 'Subiendo...' : 'Subir Imagen'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowImageSearch(true)}
                  className="w-48"
                >
                  <Library className="w-4 h-4 mr-2" />
                  Buscar Imagen
                </Button>
              </div>
            </div>
          </div>

          {/* Título */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="title" className="text-gray-700 font-medium">Título del Producto</Label>
              <span className="text-xs text-gray-500">{formData.title.length}/50</span>
            </div>
            <Input
              id="title"
              value={formData.title}
              onChange={handleTitleChange}
              className="text-lg border-gray-300"
              placeholder={placeholders.title}
              required
              maxLength={50}
            />
          </div>

          {/* Subtítulo */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="subtitle" className="text-gray-700 font-medium">Subtítulo del Producto</Label>
              <span className="text-xs text-gray-500">{formData.subtitle.length}/100</span>
            </div>
            <Textarea
              id="subtitle"
              value={formData.subtitle}
              onChange={handleSubtitleChange}
              className="border-gray-300 h-24 resize-none"
              placeholder={placeholders.subtitle}
              maxLength={100}
            />
          </div>
        </div>
      </div>
    );
  };

  // Renderizar Página 2: Contenido y precio
  const renderStep2 = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contenido y precio</h2>
        <p className="text-gray-600">Descripción detallada, archivos y configuración de precios</p>
      </div>

      <div className="space-y-6">
        {/* Imagen de Cabecera para Página del Producto */}
        <div className="space-y-3">
          <Label className="text-gray-700 font-medium">Imagen de Cabecera (Página del Producto)</Label>
          <p className="text-sm text-gray-500">Esta imagen se mostrará en la parte superior de la página individual del producto</p>
          <div className="flex items-center gap-6">
            {formData.header_image_url ? (
              <img
                src={formData.header_image_url}
                alt="Header preview"
                className="w-40 h-24 object-cover rounded-xl border border-gray-200 shadow-sm"
              />
            ) : (
              <div className="w-40 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div className="flex flex-col gap-3">
              <input
                ref={headerImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleHeaderImageUpload}
                className="hidden"
                id="header-image-upload"
              />
              <Button
                type="button"
                variant="outline"
                disabled={isUploading}
                onClick={() => headerImageInputRef.current?.click()}
                className="w-48"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Subiendo...' : 'Subir Imagen'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowHeaderImageSearch(true)}
                className="w-48"
              >
                <Library className="w-4 h-4 mr-2" />
                Buscar en Unsplash
              </Button>
            </div>
          </div>
        </div>
        {/* Descripción */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-gray-700 font-medium">Descripción del Producto</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAIPrompt(true)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generar con IA
            </Button>
          </div>

          <RichTextEditor
            value={formData.description}
            onChange={handleDescriptionChange}
            placeholder={placeholders.description}
          />
        </div>

        {/* Precio */}
        <div className="space-y-4">
          <Label className="text-gray-700 font-medium">Configuración de Precio</Label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Precio Principal */}
            <div className="space-y-2">
              <Label className="text-gray-600">Precio ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="price"
                  type="text"
                  value={formData.price}
                  onChange={handlePriceChange}
                  className="pl-10 border-gray-300"
                  placeholder="9.99"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">Ingresa el precio sin el símbolo $</p>
            </div>

            {/* Precio con Descuento */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-gray-600">Precio con Descuento</Label>
                <Switch
                  checked={formData.has_discount}
                  onCheckedChange={handleDiscountToggle}
                />
              </div>
              {formData.has_discount && (
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    value={formData.discount_price}
                    onChange={handleDiscountPriceChange}
                    className="pl-10 border-gray-300"
                    placeholder="6.99"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Vista previa del precio */}
          {formData.has_discount && debouncedDiscountPrice !== "" && debouncedPrice !== "" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700 mb-2">Vista previa del precio:</p>
              <div className="flex items-center gap-3">
                <span className="text-lg text-gray-500 line-through">
                  ${convertPriceForSave(debouncedPrice).toFixed(2)}
                </span>
                <span className="text-2xl font-bold text-green-600">
                  ${convertPriceForSave(debouncedDiscountPrice).toFixed(2)}
                </span>
                {convertPriceForSave(debouncedPrice) > 0 && convertPriceForSave(debouncedDiscountPrice) > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {Math.round(((convertPriceForSave(debouncedPrice) - convertPriceForSave(debouncedDiscountPrice)) / convertPriceForSave(debouncedPrice)) * 100)}% OFF
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Frecuencia de Cobro para Membresías */}
        {isMembership && (
            <div className="space-y-4 pt-6 border-t border-gray-200">
                <Label className="text-gray-700 font-medium">Frecuencia de Cobro</Label>
                <p className="text-sm text-gray-600">Personaliza la duración y el ciclo de facturación de tu membresía.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Frecuencia de Cobro */}
                    <div className="space-y-2">
                        <Label className="text-gray-600">Recurrencia</Label>
                        <Select 
                            value={formData.billing_settings.frequency} 
                            onValueChange={(value) => handleBillingSettingsChange('frequency', value)}
                        >
                            <SelectTrigger className="border-gray-300">
                                <SelectValue placeholder="Selecciona una frecuencia" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daily">Diario</SelectItem>
                                <SelectItem value="weekly">Semanal</SelectItem>
                                <SelectItem value="monthly">Mensual</SelectItem>
                                <SelectItem value="quarterly">Trimestral</SelectItem>
                                <SelectItem value="semi_annually">Semestral</SelectItem>
                                <SelectItem value="annually">Anual</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Duración de Suscripción */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="has_end_date" className="text-gray-600 flex-1 pr-4">Finalizar automáticamente después de:</Label>
                            <Switch
                                id="has_end_date"
                                checked={formData.billing_settings.has_end_date}
                                onCheckedChange={(checked) => handleBillingSettingsChange('has_end_date', checked)}
                            />
                        </div>
                        {formData.billing_settings.has_end_date && (
                            <div className="flex items-center gap-2 pt-2">
                                <Input
                                    type="number"
                                    min="1"
                                    max="24"
                                    value={formData.billing_settings.end_after_months}
                                    onChange={(e) => {
                                        const val = Math.max(1, Math.min(24, parseInt(e.target.value) || 1));
                                        handleBillingSettingsChange('end_after_months', val)
                                    }}
                                    className="w-24 border-gray-300"
                                />
                                <span className="text-sm text-gray-600">meses</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* Archivo del Producto - Only for non-consultation and non-course products */}
        {!isConsultation && !isCourse && (
            <div className="space-y-3">
            <Label className="text-gray-700 font-medium">Archivo del Producto (Descarga)</Label>
            <div className="space-y-3">
                {uploadedFileName ? (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-medium text-green-800">Archivo subido correctamente</p>
                        <p className="text-sm text-green-600 truncate max-w-xs" title={uploadedFileName}>
                        {uploadedFileName}
                        </p>
                    </div>
                    </div>
                    <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        setFormData(prev => ({ ...prev, file_url: '' }));
                        setUploadedFileName('');
                        if (fileInputRef.current) {
                        fileInputRef.current.value = null;
                        }
                    }}
                    className="text-red-500 hover:text-red-400"
                    >
                    <X className="w-4 h-4" />
                    </Button>
                </div>
                ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Sube el archivo que recibirán tus clientes</p>
                    <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    />
                    <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    >
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? 'Subiendo...' : 'Seleccionar Archivo'}
                    </Button>
                </div>
                )}
            </div>
            </div>
        )}


        {/* Campos de Información del Cliente */}
        <div className="space-y-4">
          <Label className="text-gray-700 font-medium">Información del cliente</Label>
          <p className="text-sm text-gray-600">Configura qué información necesitas recopilar de tus clientes</p>

          <div className="space-y-3">
            {formData.collect_info_fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Input
                  value={field.label}
                  onChange={(e) => updateCustomField(field.id, { label: e.target.value })}
                  className="flex-1 border-gray-300"
                  placeholder="Etiqueta del campo"
                  disabled={field.id === 'name' || field.id === 'email'}
                />
                <select
                  value={field.type}
                  onChange={(e) => updateCustomField(field.id, { type: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700"
                  disabled={field.id === 'name' || field.id === 'email'}
                >
                  <option value="text">Texto</option>
                  <option value="email">Email</option>
                  <option value="phone">Teléfono</option>
                  <option value="url">URL</option>
                </select>
                {field.id !== 'name' && field.id !== 'email' && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomField(field.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addCustomField}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Campo
            </Button>
          </div>
        </div>

        {/* Texto del Botón de Acción */}
        <div className="space-y-3">
          <Label className="text-gray-700 font-medium">Texto del Botón de Acción</Label>
          <Input
            value={formData.action_button_text}
            onChange={(e) => setFormData(prev => ({ ...prev, action_button_text: e.target.value }))}
            className="border-gray-300"
            placeholder="Comprar ahora"
          />
        </div>
      </div>
    </div>
  );

  // Renderizar Página 3: Disponibilidad (NUEVO para consultas)
  const renderStep3 = () => (
    <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Configura tu Disponibilidad</h2>
            <p className="text-gray-600">Define cuándo y cómo tus clientes pueden agendar una llamada contigo.</p>
        </div>

        {/* Configuración de la Llamada */}
        <Card className="bg-white">
            <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                    <Label className="font-semibold text-gray-700">Método de llamada</Label>
                    <RadioGroup value={formData.availability_settings.call_method} onValueChange={(value) => handleAvailabilityChange('call_method', value)} className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="google_meet" id="google_meet" />
                            <Label htmlFor="google_meet" className="flex items-center gap-1">
                                <Video className="w-4 h-4" /> Google Meet (Automático)
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="zoom" id="zoom" />
                            <Label htmlFor="zoom" className="flex items-center gap-1">
                                <Video className="w-4 h-4" /> Zoom (Automático)
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="custom" id="custom" />
                            <Label htmlFor="custom" className="flex items-center gap-1">
                                <Globe className="w-4 h-4" /> Enlace personalizado
                            </Label>
                        </div>
                    </RadioGroup>
                    {formData.availability_settings.call_method === 'custom' && (
                        <Input 
                            placeholder="https://tu-enlace.com/llamada" 
                            className="mt-2"
                            value={formData.availability_settings.custom_call_link}
                            onChange={(e) => handleAvailabilityChange('custom_call_link', e.target.value)}
                        />
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="font-semibold text-gray-700 flex items-center gap-1">
                            <Globe className="w-4 h-4" /> Tu zona horaria
                        </Label>
                        <Select value={formData.availability_settings.timezone} onValueChange={(value) => handleAvailabilityChange('timezone', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona tu zona horaria" />
                            </SelectTrigger>
                            <SelectContent>
                                {commonTimezones.map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="font-semibold text-gray-700 flex items-center gap-1">
                            <Clock className="w-4 h-4" /> Duración de la llamada (minutos)
                        </Label>
                         <Input 
                            type="number"
                            min="1"
                            value={formData.availability_settings.duration}
                            onChange={(e) => handleAvailabilityChange('duration', parseInt(e.target.value) || 30)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="space-y-2">
                        <Label className="font-semibold text-gray-700 flex items-center gap-1">
                            <Calendar className="w-4 h-4" /> Antelación mínima
                        </Label>
                        <Select 
                            value={`${formData.availability_settings.notice_period.value}-${formData.availability_settings.notice_period.unit}`}
                            onValueChange={(val) => {
                                const [value, unit] = val.split('-');
                                handleAvailabilityChange('notice_period', { value: parseInt(value), unit });
                            }}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0-hours">Sin antelación</SelectItem>
                                <SelectItem value="1-hours">1 hora</SelectItem>
                                <SelectItem value="3-hours">3 horas</SelectItem>
                                <SelectItem value="6-hours">6 horas</SelectItem>
                                <SelectItem value="12-hours">12 horas</SelectItem>
                                <SelectItem value="24-hours">24 horas</SelectItem>
                                <SelectItem value="2-days">2 días</SelectItem>
                                <SelectItem value="3-days">3 días</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label className="font-semibold text-gray-700 flex items-center gap-1">
                            <Clock className="w-4 h-4" /> Tiempo de gracia (buffer)
                        </Label>
                         <Select 
                            value={formData.availability_settings.buffer_time.before.toString()} // Convert to string for Select
                            onValueChange={(val) => handleAvailabilityChange('buffer_time', { before: parseInt(val), after: parseInt(val) })}
                         >
                            <SelectTrigger><SelectValue placeholder="Sin tiempo de gracia" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Sin tiempo</SelectItem>
                                <SelectItem value="10">10 minutos</SelectItem>
                                <SelectItem value="15">15 minutos</SelectItem>
                                <SelectItem value="30">30 minutos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="font-semibold text-gray-700 flex items-center gap-1">
                            <Calendar className="w-4 h-4" /> Periodo de disponibilidad
                        </Label>
                         <Select 
                            value={formData.availability_settings.booking_window.toString()} // Convert to string for Select
                            onValueChange={(val) => handleAvailabilityChange('booking_window', parseInt(val))}
                         >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7">Próximos 7 días</SelectItem>
                                <SelectItem value="14">Próximos 14 días</SelectItem>
                                <SelectItem value="30">Próximos 30 días</SelectItem>
                                <SelectItem value="60">Próximos 60 días</SelectItem>
                                <SelectItem value="90">Próximos 90 días</SelectItem>
                                <SelectItem value="180">Próximos 180 días</SelectItem>
                                <SelectItem value="365">Próximos 365 días</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Horarios Disponibles */}
        <Card className="bg-white">
            <CardContent className="p-6">
                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Define tus horarios semanales
                 </h3>
                 <div className="space-y-4">
                    {formData.availability_settings.weekly_availability.map((day, dayIndex) => (
                        <div key={day.day} className="border-b pb-4 last:border-b-0">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Switch 
                                        checked={day.enabled}
                                        onCheckedChange={(checked) => handleWeeklyDayChange(dayIndex, { enabled: checked })}
                                        id={`day-${day.day}`}
                                    />
                                    <Label htmlFor={`day-${day.day}`} className="font-medium text-gray-700 text-base">{day.name}</Label>
                                </div>
                                
                                {day.enabled && (
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => addInterval(dayIndex)} 
                                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                    >
                                        <Plus className="w-4 h-4 mr-1" /> Intervalo
                                    </Button>
                                )}
                            </div>
                            
                            <div className="ml-6">
                                {day.enabled ? (
                                    day.intervals.length > 0 ? (
                                        <div className="space-y-2">
                                            {day.intervals.map((interval, intervalIndex) => (
                                                <div key={intervalIndex} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                                    <Input 
                                                        type="time" 
                                                        value={interval.from} 
                                                        onChange={(e) => updateInterval(dayIndex, intervalIndex, 'from', e.target.value)} 
                                                        className="w-32" 
                                                    />
                                                    <span className="text-gray-500">hasta</span>
                                                    <Input 
                                                        type="time" 
                                                        value={interval.to} 
                                                        onChange={(e) => updateInterval(dayIndex, intervalIndex, 'to', e.target.value)} 
                                                        className="w-32" 
                                                    />
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        onClick={() => removeInterval(dayIndex, intervalIndex)} 
                                                        className="text-red-500 hover:text-red-400 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4"/>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm py-2">Haz clic en "+ Intervalo" para agregar horarios disponibles.</p>
                                    )
                                ) : (
                                    <p className="text-gray-500 text-sm py-2">No disponible este día</p>
                                )}
                            </div>
                        </div>
                    ))}
                 </div>
            </CardContent>
        </Card>

    </div>
  );

  const renderStep3_Course = () => {
    const courseContent = formData.course_content;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="2xl font-bold text-gray-900 mb-2">Contenido del Curso</h2>
                <p className="text-gray-600">Define la página de ventas y estructura los módulos y lecciones de tu curso.</p>
            </div>

            <div className="space-y-4">
                {/* Accordion Toggle */}
                <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
                    <button type="button" onClick={() => setCourseSection('page')} className={`flex-1 p-2 rounded-md text-sm font-medium transition-colors ${courseSection === 'page' ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>Página del Curso</button>
                    <button type="button" onClick={() => setCourseSection('modules')} className={`flex-1 p-2 rounded-md text-sm font-medium transition-colors ${courseSection === 'modules' ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>Módulos y Lecciones</button>
                </div>

                {/* Página del Curso Section */}
                <AnimatePresence>
                {courseSection === 'page' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 pt-4">
                        <div className="space-y-3">
                          <Label className="text-gray-700 font-medium">Imagen de Cabecera del Curso</Label>
                          <p className="text-sm text-gray-500">Esta imagen se mostrará en la parte superior de la página del curso.</p>
                          <div className="flex items-center gap-6">
                            {courseContent.header_image_url ? ( <img src={courseContent.header_image_url} alt="Header" className="w-40 h-24 object-cover rounded-xl border"/> ) : ( <div className="w-40 h-24 bg-gray-100 border-2 border-dashed rounded-xl flex items-center justify-center"> <BookOpen className="w-8 h-8 text-gray-400" /> </div> )}
                            <input
                                ref={headerImageInputRef} // Reusing the main header image ref, could create a new one for clarity if needed.
                                type="file"
                                accept="image/*"
                                onChange={handleCourseHeaderImageUpload}
                                className="hidden"
                                id="course-header-image-upload"
                            />
                            <Button type="button" variant="outline" disabled={isUploading} onClick={() => headerImageInputRef.current?.click()}> <Upload className="w-4 h-4 mr-2"/> {isUploading ? 'Subiendo...' : 'Subir Imagen'} </Button>
                          </div>
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="courseTitle" className="text-gray-700 font-medium">Título del Curso</Label>
                            <Input id="courseTitle" value={courseContent.title} onChange={(e) => handleCourseContentChange('title', e.target.value)} placeholder={placeholders.courseTitle} maxLength={100} />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-gray-700 font-medium">Descripción del Curso</Label>
                            <RichTextEditor value={courseContent.description} onChange={(value) => handleCourseContentChange('description', value)} placeholder={placeholders.courseDescription} />
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>
                
                {/* Módulos y Lecciones Section */}
                <AnimatePresence>
                {courseSection === 'modules' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 pt-4">
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="course-modules" type="MODULES">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                {courseContent.modules.map((module, moduleIndex) => (
                                    <Draggable key={module.id} draggableId={module.id} index={moduleIndex}>
                                    {(provided, snapshot) => (
                                    <div 
                                        ref={provided.innerRef} 
                                        {...provided.draggableProps} 
                                        className={`bg-white border rounded-lg p-4 space-y-4 transition-all ${snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div {...provided.dragHandleProps} className="cursor-grab text-gray-400"><GripVertical size={20}/></div>
                                            <Input value={module.title} onChange={(e) => handleUpdateModule(module.id, e.target.value)} className="font-semibold text-lg border-transparent focus:border-gray-300"/>
                                            {courseContent.modules.length > 1 && <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => handleRemoveModule(module.id)}><Trash2 size={16}/></Button>}
                                        </div>
                                        
                                        <Droppable droppableId={module.id} type="LESSONS">
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3 pl-8">
                                            {module.lessons.map((lesson, lessonIndex) => (
                                                <Draggable key={lesson.id} draggableId={lesson.id} index={lessonIndex}>
                                                {(provided, snapshot) => (
                                                <div 
                                                    ref={provided.innerRef} 
                                                    {...provided.draggableProps} 
                                                    className={`bg-gray-50 border rounded-md p-3 space-y-3 transition-all ${snapshot.isDragging ? 'shadow-md' : 'shadow-sm'}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div {...provided.dragHandleProps} className="cursor-grab text-gray-400"><GripVertical size={18}/></div>
                                                        <Input value={lesson.title} onChange={(e) => handleUpdateLesson(module.id, lesson.id, 'title', e.target.value)} placeholder={placeholders.lessonTitle}/>
                                                        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => handleRemoveLesson(module.id, lesson.id)}><Trash2 size={14}/></Button>
                                                    </div>
                                                    <Textarea value={lesson.description} onChange={(e) => handleUpdateLesson(module.id, lesson.id, 'description', e.target.value)} placeholder={placeholders.lessonDescription} className="h-20"/>
                                                    
                                                    {/* Video Upload */}
                                                    <div className="space-y-2">
                                                      <Label className="text-sm text-gray-700">Video de la lección</Label>
                                                      <input type="file" accept="video/*" ref={el => lessonVideoInputRefs.current[`${module.id}-${lesson.id}`] = el} onChange={(e) => handleUploadLessonFile(module.id, lesson.id, e.target.files[0], 'video')} className="hidden"/>
                                                      {lesson.video_url ? (
                                                        <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-md p-2">
                                                          <Video size={16}/> 
                                                          <span className="text-sm truncate">{decodeURIComponent(lesson.video_url.split('/').pop().split('?')[0])} cargado.</span> 
                                                          <Button variant="ghost" size="sm" onClick={() => handleUpdateLesson(module.id, lesson.id, 'video_url', '')} className="text-red-500 hover:bg-red-100"><X size={14}/></Button>
                                                        </div>
                                                      ) : (
                                                        <Button variant="outline" size="sm" onClick={() => lessonVideoInputRefs.current[`${module.id}-${lesson.id}`]?.click()} disabled={isUploading}>
                                                          {isUploading ? "Subiendo..." : <><Upload size={14} className="mr-2"/>Subir Video</>}
                                                        </Button>
                                                      )}
                                                    </div>

                                                    {/* Attachments Upload */}
                                                    <div className="space-y-2">
                                                        <Label className="text-sm text-gray-700">Archivos Adjuntos</Label>
                                                        <div className="space-y-1">
                                                          {lesson.attachments.length === 0 && <p className="text-sm text-gray-500">No hay archivos adjuntos.</p>}
                                                          {lesson.attachments.map(att => (
                                                            <div key={att.url} className="flex items-center justify-between text-sm bg-white border border-gray-200 rounded-md p-2">
                                                              <span className="flex items-center gap-1 text-gray-700"><FileIcon size={14}/> {att.name}</span>
                                                              <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:bg-red-100" onClick={() => handleRemoveAttachment(module.id, lesson.id, att.url)}><X size={12}/></Button>
                                                            </div>
                                                          ))}
                                                        </div>
                                                        <input type="file" ref={el => lessonAttachmentInputRefs.current[`${module.id}-${lesson.id}`] = el} onChange={(e) => handleUploadLessonFile(module.id, lesson.id, e.target.files[0], 'attachment')} className="hidden"/>
                                                        <Button variant="outline" size="sm" onClick={() => lessonAttachmentInputRefs.current[`${module.id}-${lesson.id}`]?.click()} disabled={isUploading}>
                                                          {isUploading ? "Subiendo..." : <><Plus size={14} className="mr-2"/>Agregar archivo</>}
                                                        </Button>
                                                    </div>
                                                </div>
                                                )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                            </div>
                                        )}
                                        </Droppable>
                                        <Button variant="outline" onClick={() => handleAddLesson(module.id)} className="ml-8 text-blue-600 border-blue-200 hover:bg-blue-50"><Plus size={16} className="mr-2"/>Agregar Lección</Button>
                                    </div>
                                    )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                                </div>
                            )}
                            </Droppable>
                            <Button onClick={handleAddModule} className="text-blue-600 border-blue-200 hover:bg-blue-50"><Plus size={16} className="mr-2"/>Agregar Módulo</Button>
                        </DragDropContext>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
    );
  }

  // Renderizar Página 4: Opciones avanzadas (era la 3)
  const renderStep4 = () => (
    <div className="space-y-8">
      <div>
        <h2 className="2xl font-bold text-gray-900 mb-2">Opciones avanzadas</h2>
        <p className="text-gray-600">Reviews, afiliados, confirmaciones y configuraciones adicionales</p>
      </div>

      <div className="space-y-4">
        {/* Sección de Reseñas */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenSection(openSection === 'reviews' ? null : 'reviews')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-800 text-lg">Agregar Reseñas</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-600 transform transition-transform ${openSection === 'reviews' ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {openSection === 'reviews' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  {formData.reviews.length === 0 ? (
                    <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-300">
                      <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No hay reseñas aún</p>
                      <p className="text-sm text-gray-500">Agrega testimonios para generar más confianza</p>
                    </div>
                  ) : (
                    <DragDropContext onDragEnd={handleReviewDragEnd}>
                      <Droppable droppableId="reviews">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                            {formData.reviews.map((review, index) => (
                              <Draggable key={review.id} draggableId={review.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`bg-white rounded-lg border transition-shadow ${snapshot.isDragging ? 'shadow-lg' : 'border-gray-200'}`}
                                  >
                                    <div className="p-4">
                                      <div className="flex items-start gap-3">
                                        <div {...provided.dragHandleProps} className="mt-2 cursor-grab active:cursor-grabbing text-gray-400">
                                          <GripVertical className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                              <Input
                                                value={review.customer_name}
                                                onChange={(e) => updateReview(review.id, { customer_name: e.target.value })}
                                                placeholder="Nombre del cliente"
                                                maxLength={50}
                                              />
                                              <p className="text-xs text-gray-500 text-right">{50 - (review.customer_name?.length || 0)} caracteres</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <Label className="text-sm">Rating:</Label>
                                              <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                  <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => updateReview(review.id, { rating: star })}
                                                    className={`w-6 h-6 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                  >
                                                    <Star className="w-full h-full fill-current" />
                                                  </button>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="space-y-2">
                                            <Textarea
                                              value={review.comment}
                                              onChange={(e) => updateReview(review.id, { comment: e.target.value })}
                                              placeholder="Comentario del cliente..."
                                              className="h-20"
                                              maxLength={260}
                                            />
                                            <p className="text-xs text-gray-500 text-right">{260 - (review.comment?.length || 0)} caracteres</p>
                                          </div>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => removeReview(review.id)}
                                          className="text-red-500 hover:text-red-400"
                                        >
                                          <X className="w-4 h-4" />
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
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addReview}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar nueva reseña
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sección de Programa de Afiliados */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenSection(openSection === 'affiliates' ? null : 'affiliates')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-800 text-lg">Programa de Afiliados</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-600 transform transition-transform ${openSection === 'affiliates' ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {openSection === 'affiliates' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 space-y-6">
                  {/* Toggle para activar/desactivar afiliados */}
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <h4 className="font-semibold text-gray-900">Activar Sistema de Afiliados</h4>
                      <p className="text-sm text-gray-600">Permite que otros usuarios promocionen tu producto y ganen comisiones</p>
                    </div>
                    <Switch
                      checked={affiliateSettings.enabled}
                      onCheckedChange={(checked) => updateAffiliateSettings({ enabled: checked })}
                    />
                  </div>

                  {affiliateSettings.enabled && (
                    <>
                      {/* Configuración de comisión */}
                      <div className="space-y-3">
                        <Label className="text-gray-700 font-medium">Porcentaje de Comisión</Label>
                        <div className="flex items-center gap-4">
                          <Input
                            type="number"
                            min="1"
                            max="90"
                            value={affiliateSettings.commission_percentage}
                            onChange={(e) => updateAffiliateSettings({ commission_percentage: parseInt(e.target.value) || 10 })}
                            className="w-24"
                          />
                          <span className="text-gray-600">% por cada venta</span>
                        </div>
                        <p className="text-sm text-gray-500">Los afiliados ganarán este porcentaje por cada venta que generen</p>
                      </div>

                      {/* Agregar nuevo afiliado */}
                      <div className="space-y-3 border-t pt-4">
                        <Label className="text-gray-700 font-medium">Agregar Nuevo Afiliado</Label>
                        <div className="flex gap-3">
                          <Input
                            value={newAffiliateUsername}
                            onChange={(e) => setNewAffiliateUsername(e.target.value)}
                            placeholder="Nombre de usuario del afiliado"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={handleAddAffiliate}
                            disabled={!newAffiliateUsername.trim() || !product?.id || !product?.creator_id}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar
                          </Button>
                        </div>
                      </div>

                      {/* Lista de afiliados activos */}
                      {affiliates.length > 0 && (
                        <div className="space-y-3 border-t pt-4">
                          <h4 className="font-semibold text-gray-900">Afiliados Activos</h4>
                          <div className="space-y-3">
                            {affiliates.map((affiliate) => (
                              <div key={affiliate.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <h5 className="font-medium text-gray-900">@{affiliate.affiliate_username}</h5>
                                    <p className="text-sm text-gray-600">{affiliate.commission_percentage}% de comisión</p>
                                  </div>
                                  <Badge variant={affiliate.is_active ? "default" : "secondary"}>
                                    {affiliate.is_active ? "Activo" : "Inactivo"}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-3">
                                  <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                                      <Eye className="w-4 h-4" />
                                      <span className="text-sm">Visitas</span>
                                    </div>
                                    <p className="font-semibold">{affiliate.total_clicks || 0}</p>
                                  </div>
                                  <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                                      <ShoppingCart className="w-4 h-4" />
                                      <span className="text-sm">Ventas</span>
                                    </div>
                                    <p className="font-semibold">{affiliate.total_sales || 0}</p>
                                  </div>
                                  <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                                      <TrendingUp className="w-4 h-4" />
                                      <span className="text-sm">Comisiones</span>
                                    </div>
                                    <p className="font-semibold">${(affiliate.total_commission || 0).toFixed(2)}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 bg-gray-50 rounded-md p-2">
                                  <Input
                                    value={affiliate.affiliate_link}
                                    readOnly
                                    className="text-xs bg-transparent border-none"
                                  />
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleCopyAffiliateLink(affiliate.affiliate_link)}
                                    className="text-blue-600 hover:text-blue-700"
                                  >
                                    {copiedLink === affiliate.affiliate_link ? (
                                      <Check className="w-4 h-4" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {affiliates.length === 0 && (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h4 className="font-medium text-gray-800 mb-2">Sin afiliados aún</h4>
                          <p className="text-sm text-gray-600">Agrega usuarios para que promocionen tu producto</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sección de Correo de Confirmación */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
           <button
            type="button"
            onClick={() => setOpenSection(openSection === 'email' ? null : 'email')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-800 text-lg">Correo de Confirmación</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-600 transform transition-transform ${openSection === 'email' ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {openSection === 'email' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  <p className="text-sm text-gray-600">Personaliza el mensaje que recibirán tus clientes después de comprar.</p>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-gray-700">Asunto del correo</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="w-3 h-3 mr-1.5" />
                            Insertar variable
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onSelect={() => handleInsertSubjectVariable('{customer_name}')}>Nombre del cliente</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleInsertSubjectVariable('{product_title}')}>Nombre del producto</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleInsertSubjectVariable('{creator_name}')}>Nombre del creador</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <Input
                      value={formData.confirmation_email.subject}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        confirmation_email: {
                          ...prev.confirmation_email,
                          subject: e.target.value
                        }
                      }))}
                      placeholder="¡Gracias por tu compra!"
                      className="border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-gray-700">Cuerpo del correo</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="w-3 h-3 mr-1.5" />
                            Insertar variable
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onSelect={() => handleInsertEmailVariable('{customer_name}')}>Nombre del cliente</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleInsertEmailVariable('{product_title}')}>Nombre del producto</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleInsertEmailVariable('{creator_name}')}>Nombre del creador</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleInsertEmailVariable('{download_link}')}>Enlace de descarga</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <RichTextEditor
                      ref={emailEditorRef}
                      value={formData.confirmation_email.message}
                      onChange={(value) => setFormData(prev => ({
                        ...prev,
                        confirmation_email: {
                          ...prev.confirmation_email,
                          message: value
                        }
                      }))}
                      placeholder="Escribe el cuerpo del correo aquí..."
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Progress Steps - Estilo Spotify */}
      <div className="w-full">
        {/* Desktop Version */}
        <div className="hidden sm:flex items-center justify-center flex-wrap gap-3 p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm">
          {WIZARD_STEPS.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setCurrentStep(step.id)}
              className={`relative px-4 py-3 rounded-full font-medium text-sm transition-all duration-300 ease-out transform hover:scale-105 whitespace-nowrap ${
                currentStep === step.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border-2 border-blue-500'
                  : 'bg-white/80 text-gray-600 hover:text-gray-800 hover:bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <span className="relative z-10">{step.title}</span>
              {currentStep === step.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur opacity-30 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {/* Mobile Version */}
        <div className="sm:hidden">
          <div className="flex items-center justify-center flex-wrap gap-2 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 shadow-sm">
            {WIZARD_STEPS.map((step) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className={`relative px-3 py-2.5 rounded-full font-medium text-xs transition-all duration-300 ease-out whitespace-nowrap ${
                  currentStep === step.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/70 text-gray-600 hover:text-gray-800 hover:bg-white/90 border border-gray-200'
                }`}
              >
                <span className="relative z-10">{step.shortTitle}</span>
                {currentStep === step.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-sm opacity-25 animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
          
          {/* Mobile Step Description */}
          <div className="mt-4 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {WIZARD_STEPS.find(s => s.id === currentStep)?.title}
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / WIZARD_STEPS.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {isCourse && currentStep === 3 && renderStep3_Course()}
        {isConsultation && currentStep === (isCourse ? 4 : 3) && renderStep3()}
        {currentStep === WIZARD_STEPS.length && renderStep4()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end items-center gap-3 pt-8 border-t border-gray-200">
        {currentStep > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevStep}
            className="text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
        )}

        <Button
          type="button"
          variant="ghost"
          onClick={handleSaveAsDraft}
          disabled={isSaving}
          className="text-gray-600 hover:bg-gray-100"
        >
          <Save className="w-4 h-4 mr-2" />
          Guardar como borrador
        </Button>

        {currentStep < WIZARD_STEPS.length && (
          <Button
            type="button"
            onClick={handleNextStep}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
          >
            Siguiente
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}

        {currentStep === WIZARD_STEPS.length && (
          <Button
            type="button"
            onClick={handleCreateProduct}
            size="lg"
            disabled={isSaving}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25"
          >
            {isSaving ? 'Guardando...' : (product ? 'Actualizar Producto' : 'Crear Producto')}
          </Button>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showImageSearch && (
          <ImageSearchModal
            onClose={() => setShowImageSearch(false)}
            onSelectImage={(url) => {
              setFormData(prev => ({ ...prev, image_url: url }));
              setShowImageSearch(false);
            }}
          />
        )}

        {showHeaderImageSearch && (
          <ImageSearchModal
            onClose={() => setShowHeaderImageSearch(false)}
            onSelectImage={(url) => {
              setFormData(prev => ({ ...prev, header_image_url: url }));
              setShowHeaderImageSearch(false);
            }}
          />
        )}

        {showAIPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Generar descripción con IA</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAIPrompt(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700">Describe brevemente tu producto:</Label>
                  <Textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ej: Un curso online de marketing digital para principiantes, incluye 10 lecciones en video, plantillas y ejercicios prácticos..."
                    className="mt-2 h-24"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowAIPrompt(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleGenerateAIDescription}
                    disabled={!aiPrompt.trim() || isGeneratingAI}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isGeneratingAI ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default ProductFormWizard;

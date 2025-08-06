
import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, Star, Mail, User, Calendar, Clock, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isAfter, isBefore, addMinutes, parse, subMonths, addMonths } from "date-fns";
import { es } from "date-fns/locale";

// Componente de Calendario de Reserva para Consultorías
const BookingCalendar = ({ availabilitySettings }) => {
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedTime, setSelectedTime] = React.useState(null);
  const [currentMonth, setCurrentMonth] = React.useState(startOfMonth(new Date()));

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const firstDayOfMonth = getDay(startOfMonth(currentMonth)); // 0 = Domingo, 1 = Lunes, etc.

  // Verificar si un día está disponible
  const isDayAvailable = (date) => {
    const dayName = format(date, 'EEEE', { locale: es }).toLowerCase();
    const dayMap = {
      'lunes': 'monday',
      'martes': 'tuesday',
      'miércoles': 'wednesday',
      'jueves': 'thursday',
      'viernes': 'friday',
      'sábado': 'saturday',
      'domingo': 'sunday'
    };
    const mappedDay = dayMap[dayName];
    // Ensure availabilitySettings and weekly_availability exist
    if (!availabilitySettings || !availabilitySettings.weekly_availability) {
      return false;
    }
    const availability = availabilitySettings.weekly_availability.find(d => d.day === mappedDay);
    return availability ? availability.enabled && availability.intervals.length > 0 : false;
  };

  // Obtener horarios disponibles para un día específico
  const getAvailableTimesForDay = (date) => {
    const dayName = format(date, 'EEEE', { locale: es }).toLowerCase();
    const dayMap = {
      'lunes': 'monday',
      'martes': 'tuesday',
      'miércoles': 'wednesday',
      'jueves': 'thursday',
      'viernes': 'friday',
      'sábado': 'saturday',
      'domingo': 'sunday'
    };
    const mappedDay = dayMap[dayName];
    
    if (!availabilitySettings || !availabilitySettings.weekly_availability) {
        return [];
    }

    const availability = availabilitySettings.weekly_availability.find(d => d.day === mappedDay);
    
    if (!availability || !availability.enabled) return [];

    const times = [];
    const duration = availabilitySettings.duration || 30; // Default duration to 30 minutes

    availability.intervals.forEach(interval => {
      // Parse start and end times, using a dummy date (today) for context
      const startTime = parse(interval.from, 'HH:mm', new Date());
      const endTime = parse(interval.to, 'HH:mm', new Date());
      
      let currentTime = startTime;
      // Loop while adding the duration to current time doesn't exceed the end time
      // Check if current time + duration is before or same as end time
      while (isBefore(addMinutes(currentTime, duration - 1), endTime) || isSameDay(addMinutes(currentTime, duration - 1), endTime)) { // subtract 1ms to ensure last slot fits
        times.push(format(currentTime, 'HH:mm'));
        currentTime = addMinutes(currentTime, duration);
      }
    });

    // Filter out past times for the current day
    const now = new Date();
    if (isSameDay(date, now)) {
      return times.filter(timeStr => {
        const [hour, minute] = timeStr.split(':').map(Number);
        const slotTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
        return isAfter(slotTime, now);
      });
    }

    return times;
  };

  const availableTimes = selectedDate ? getAvailableTimesForDay(selectedDate) : [];

  return (
    <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
      <h3 className="font-semibold mb-4 text-white flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        Selecciona fecha y hora
      </h3>
      
      {/* Selector de Mes */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h4 className="text-white text-base font-semibold capitalize text-center">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h4>
        <button 
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Días de la Semana */}
      <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs text-gray-400">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="py-1">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Padding days */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {/* Actual days */}
        {daysInMonth.map(day => {
          const isAvailable = isDayAvailable(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isPast = isBefore(day, new Date()) && !isSameDay(day, new Date());
          
          return (
            <button
              key={day.toString()}
              onClick={() => {
                if (isAvailable && !isPast) {
                  setSelectedDate(day);
                  setSelectedTime(null); // Reset selected time when date changes
                }
              }}
              disabled={!isAvailable || isPast}
              className={`
                p-1 text-sm rounded-lg transition-colors aspect-square flex items-center justify-center relative
                ${isSelected ? 'bg-blue-600 text-white font-bold' : ''}
                ${isAvailable && !isPast && !isSelected ? 'bg-gray-700 text-white hover:bg-gray-600' : ''}
                ${!isAvailable || isPast ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : ''}
              `}
            >
              {format(day, 'd')}
              {isAvailable && !isPast && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-400 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Horarios Disponibles */}
      {selectedDate && availableTimes.length > 0 && (
        <div>
          <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Horarios para {format(selectedDate, 'dd MMM', { locale: es })}
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
            {availableTimes.map(time => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`
                  px-2 py-2 text-xs rounded-md transition-colors text-center
                  ${selectedTime === time 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }
                `}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedDate && availableTimes.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-4">
          No hay horarios disponibles para este día.
        </p>
      )}

      {selectedDate && selectedTime && (
        <div className="mt-4 p-3 bg-blue-900/50 rounded-lg border border-blue-700">
          <p className="text-blue-200 text-sm">
            📅 {format(selectedDate, 'EEEE, dd MMMM yyyy', { locale: es })} a las {selectedTime}
          </p>
          <p className="text-blue-300 text-xs mt-1">
            Duración: {availabilitySettings.duration || 30} minutos
          </p>
        </div>
      )}
    </div>
  );
};

export default function ProductPagePreview({ productData, creator, onBack, isPublic = false }) {

  const design = creator?.design_settings || {
      theme_id: 'dark',
      theme_name: 'Tema Oscuro', 
      background: '#000000',
      text_color: '#ffffff',
      font_family: 'Inter'
  };

  if (!productData) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4 bg-gray-900">
        <div className="text-center text-gray-400">
          <p>Cargando vista previa...</p>
        </div>
      </div>
    );
  }

  // Helper function to safely convert price to number
  const safePrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string' && price.trim() !== '') {
      const num = parseFloat(price);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  const priceNum = safePrice(productData.price);
  const discountPriceNum = safePrice(productData.discount_price);

  const displayPrice = productData.has_discount && discountPriceNum > 0 
    ? discountPriceNum 
    : priceNum;

  const originalPrice = productData.has_discount && discountPriceNum > 0 
    ? priceNum 
    : null;

  // Función para renderizar las estrellas
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < rating 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-500'
        }`}
      />
    ));
  };

  const isConsultation = productData.product_type === 'consultation';
  const isMembership = productData.product_type === 'membership';

  const billingFrequencyText = {
    daily: 'Día',
    weekly: 'Semana',
    monthly: 'Mes',
    quarterly: 'Trimestre',
    semi_annually: 'Semestre',
    annually: 'Año'
  };
  
  const frequency = productData.billing_settings?.frequency || 'monthly';
  
  return (
    <div 
      className={`w-full h-full ${isPublic ? 'min-h-screen' : 'flex flex-col'}`}
      style={{ 
        background: design.background, 
        color: design.text_color, 
        fontFamily: design.font_family 
      }}
    >
      <style jsx>{`
        .product-description, .product-description p, .product-description li {
          color: ${design.text_color};
          opacity: 0.8;
          line-height: 1.6;
        }
        
        .product-description h1,
        .product-description h2,
        .product-description h3,
        .product-description h4,
        .product-description h5,
        .product-description h6,
        .product-description strong,
        .product-description b {
          color: ${design.text_color};
          opacity: 1;
          font-weight: bold;
          margin: 1.5em 0 0.75em 0;
        }
        
        .product-description h1 { font-size: 1.5em; }
        .product-description h2 { font-size: 1.3em; }
        .product-description h3 { font-size: 1.1em; }
        
        .product-description em,
        .product-description i {
          font-style: italic;
          color: #e5e7eb;
        }
        
        .product-description ul,
        .product-description ol {
          margin: 1em 0;
          padding-left: 1.5em;
        }
        
        .product-description ul li {
          list-style-type: disc;
          margin: 0.5em 0;
          color: ${design.text_color};
          opacity: 0.8;
        }
        
        .product-description ol li {
          list-style-type: decimal;
          margin: 0.5em 0;
          color: ${design.text_color};
          opacity: 0.8;
        }
        
        .product-description li::marker {
          color: #9ca3af;
        }
        
        .product-description br {
          display: block;
          margin: 0.5em 0;
          content: "";
        }
        
        .product-description blockquote {
          border-left: 3px solid #6366f1;
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          color: #e5e7eb;
        }
        
        .product-description a {
          color: #60a5fa;
          text-decoration: underline;
        }
        
        .product-description a:hover {
          color: #93c5fd;
        }

        .product-description iframe,
        .product-description video {
          display: block;
          width: 100%;
          max-width: 100%;
          height: auto;
          aspect-ratio: 16 / 9;
          border-radius: 8px;
          margin: 1em 0;
          border: 1px solid #374151;
          background-color: #000;
        }

        .reviews-scroll {
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .reviews-scroll::-webkit-scrollbar {
          display: none;
        }

        /* Custom Scrollbar for Available Times */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937; /* gray-800 */
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4b5563; /* gray-600 */
          border-radius: 4px;
          border: 2px solid #1f2937; /* padding around thumb */
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #6b7280; /* gray-500 */
        }
      `}</style>

      {/* Header con botón de regreso */}
      <div className="flex-shrink-0 p-4 border-b border-gray-700">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm hover:opacity-75 transition-opacity"
          style={{ color: design.text_color }}
        >
          <ArrowLeft className="w-4 h-4" />
          {isPublic ? 'Volver al perfil' : 'Volver'}
        </button>
      </div>

      {/* Contenido principal con scroll */}
      <div className={`flex-1 overflow-y-auto ${isPublic ? 'pb-8' : ''}`}>
        <div className="w-full max-w-full">
          {/* Imagen de cabecera */}
          {productData.header_image_url && (
            <div className="relative w-full">
              <img 
                src={productData.header_image_url} 
                alt="Product header"
                className="w-full h-40 object-cover"
                style={{ maxWidth: '100%' }}
              />
              <div 
                className="absolute bottom-0 left-0 right-0 h-20" 
                style={{ 
                  background: `linear-gradient(to top, ${design.background}, transparent)` 
                }}
              ></div>
            </div>
          )}

          {/* Contenido principal */}
          <div className="px-4 py-4 space-y-4" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
            {/* Título */}
            <h1 
              className="text-2xl font-bold leading-tight break-words" 
              style={{ 
                color: design.text_color,
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              {productData.title || 'Título del producto'}
            </h1>

            {/* Precio */}
            <div className="flex items-baseline gap-2 flex-wrap">
              {originalPrice !== null && originalPrice > 0 && (
                <span 
                  className="text-lg line-through" 
                  style={{ color: design.text_color, opacity: 0.6 }}
                >
                  ${originalPrice.toFixed(2)}
                </span>
              )}
              <span 
                className="text-2xl font-bold" 
                style={{ color: design.text_color }}
              >
                {displayPrice > 0 ? `$${displayPrice.toFixed(2)}` : 'Gratis'}
              </span>
              {isMembership && displayPrice > 0 && (
                <span 
                  className="text-base font-medium" 
                  style={{ color: design.text_color, opacity: 0.8 }}
                >
                  / {billingFrequencyText[frequency]}
                </span>
              )}
              {originalPrice !== null && originalPrice > 0 && displayPrice > 0 && (
                <Badge className="bg-red-500 text-white text-xs">
                  {`${Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}% OFF`}
                </Badge>
              )}
            </div>

            {/* Subtítulo */}
            {productData.subtitle && (
              <p 
                className="text-base leading-relaxed break-words" 
                style={{ 
                  color: design.text_color, 
                  opacity: 0.9,
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                {productData.subtitle}
              </p>
            )}

            {/* Descripción */}
            {productData.description && (
              <div 
                className="product-description break-words"
                style={{ 
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  maxWidth: '100%'
                }}
                dangerouslySetInnerHTML={{
                  __html: productData.description
                }}
              ></div>
            )}

            {/* Calendario de Reserva - Solo para Consultorías */}
            {isConsultation && productData.availability_settings && (
              <BookingCalendar availabilitySettings={productData.availability_settings} />
            )}

            {/* Sección de Reviews */}
            {productData.reviews && productData.reviews.length > 0 && (
              <div className="pt-2">
                <h3 className="text-lg font-semibold text-white mb-3">Lo que dicen nuestros clientes</h3>
                
                <div className="reviews-scroll">
                  <div className="flex gap-3 pb-2">
                    {productData.reviews.map((review, index) => (
                      <div
                        key={review.id || index}
                        className={`bg-gray-800 rounded-lg p-3 border border-gray-700 flex-shrink-0 ${
                          productData.reviews.length > 1 ? 'w-64' : 'w-full'
                        }`}
                        style={{ minWidth: productData.reviews.length > 1 ? '250px' : 'auto' }}
                      >
                        {/* Header del review con avatar y nombre */}
                        <div className="flex items-center gap-2 mb-2">
                          {review.avatar_url ? (
                            <img
                              src={review.avatar_url}
                              alt={review.customer_name}
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-xs">
                                {review.customer_name ? review.customer_name[0].toUpperCase() : '?'}
                              </span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white text-sm truncate">
                              {review.customer_name || 'Cliente verificado'}
                            </p>
                            <div className="flex items-center gap-1">
                              {renderStars(review.rating || 5)}
                            </div>
                          </div>
                        </div>

                        {/* Comentario del review */}
                        {review.comment && (
                          <p className="text-gray-300 text-sm leading-relaxed break-words">
                            "{review.comment}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Indicador de scroll si hay múltiples reviews */}
                {productData.reviews.length > 1 && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Desliza para ver más testimonios →
                  </p>
                )}
              </div>
            )}

            {/* Formulario de compra */}
            <div className="space-y-3 pt-2">
              <div className="space-y-2">
                {productData.collect_info_fields && productData.collect_info_fields.map((field) => (
                  <div key={field.id} className="space-y-1">
                    <label className="text-sm font-medium text-gray-300">
                      {field.label}
                      {field.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    <Input
                      type={field.type}
                      placeholder={`Ingresa tu ${field.label.toLowerCase()}`}
                      className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                      disabled
                      style={{ maxWidth: '100%' }}
                    />
                  </div>
                ))}
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-base border-0 shadow-lg hover:shadow-blue-500/30 transform hover:scale-[1.02] transition-all"
                disabled
                style={{ maxWidth: '100%' }}
              >
                {productData.action_button_text || (isConsultation ? 'Reservar llamada' : 'Comprar ahora')}
              </Button>
            </div>

            {/* Espaciado inferior para scroll completo */}
            <div className="h-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

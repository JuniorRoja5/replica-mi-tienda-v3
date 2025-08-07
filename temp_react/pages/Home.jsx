
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Store, 
  DollarSign, 
  Users, 
  Zap, 
  Shield, 
  Smartphone, 
  BarChart3,
  Star,
  ArrowRight,
  Check,
  Play,
  Globe,
  Heart,
  TrendingUp,
  Package,
  Share2
} from "lucide-react";
import { motion } from "framer-motion";
import { User } from "@/api/entities";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async () => {
    setIsLoading(true);
    try {
      await User.login();
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Store,
      title: "Tu tienda en minutos",
      description: "Crea tu perfil y comienza a vender sin código ni complicaciones"
    },
    {
      icon: Smartphone,
      title: "Diseño móvil perfecto",
      description: "Tu tienda se ve increíble en cualquier dispositivo"
    },
    {
      icon: Share2,
      title: "Comparte en un clic",
      description: "Un solo enlace para todas tus redes sociales"
    },
    {
      icon: BarChart3,
      title: "Analytics en tiempo real",
      description: "Ve tus ventas y estadísticas al instante"
    },
    {
      icon: Shield,
      title: "Pagos seguros",
      description: "Procesamiento seguro con encriptación SSL"
    },
    {
      icon: Zap,
      title: "Entrega automática",
      description: "Los productos se entregan automáticamente tras la compra"
    }
  ];

  const testimonials = [
    {
      name: "María González",
      role: "Diseñadora Digital",
      avatar: "MG",
      content: "En solo 10 minutos ya tenía mi tienda lista. He vendido más de $5,000 en mi primer mes.",
      rating: 5
    },
    {
      name: "Carlos Ruiz",
      role: "Coach Online",
      avatar: "CR",
      content: "La mejor plataforma para creadores. Mis cursos se venden solos con este diseño tan profesional.",
      rating: 5
    },
    {
      name: "Ana López",
      role: "Fotógrafa",
      avatar: "AL",
      content: "Perfecto para vender mis presets. Mis seguidores compran directamente desde Instagram.",
      rating: 5
    }
  ];

  const stats = [
    { number: "10K+", label: "Creadores activos" },
    { number: "$2M+", label: "Vendido en la plataforma" },
    { number: "50K+", label: "Productos vendidos" },
    { number: "99.9%", label: "Tiempo de actividad" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/8fa694163_Screenshot_20250624_183832_AdobeAcrobat.jpg" 
                alt="ClickMyLink"
                className="h-8 w-auto object-contain"
              />
            </div>
            
            <Button 
              onClick={handleGetStarted}
              disabled={isLoading}
              className="bg-gradient-to-r from-[#6366f1] to-[#4f46e5] hover:from-[#4f46e5] hover:to-[#6366f1]"
            >
              {isLoading ? "Cargando..." : "Comenzar Gratis"}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/20 to-[#4f46e5]/20" />
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#6366f1]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#4f46e5]/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Badge className="mb-6 bg-white/10 text-blue-200 border-white/20">
              🚀 Únete a más de 10,000 creadores exitosos
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Tu tienda digital
              <span className="block bg-gradient-to-r from-[#6366f1] to-[#4f46e5] bg-clip-text text-transparent">
                en minutos
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Crea tu tienda profesional, vende tus productos digitales y construye tu imperio online. 
              Sin código, sin complicaciones.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="lg"
                onClick={handleGetStarted}
                disabled={isLoading}
                className="bg-gradient-to-r from-[#6366f1] to-[#4f46e5] hover:from-[#4f46e5] hover:to-[#6366f1] text-lg px-8 py-4 h-auto"
              >
                {isLoading ? "Cargando..." : "Crear Mi Tienda Gratis"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-lg px-8 py-4 h-auto"
              >
                <Play className="mr-2 w-5 h-5" />
                Ver Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-purple-300 text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Todo lo que necesitas para
              <span className="block text-purple-400">vender online</span>
            </h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto">
              Una plataforma completa diseñada específicamente para creadores de contenido digital
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 h-full">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-purple-200 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Tan fácil como
              <span className="block text-purple-400">1, 2, 3</span>
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Crea tu perfil",
                description: "Regístrate y personaliza tu tienda con tu marca personal",
                icon: Users
              },
              {
                step: "2", 
                title: "Sube tus productos",
                description: "Añade tus cursos, plantillas, presets o cualquier producto digital",
                icon: Package
              },
              {
                step: "3",
                title: "Comparte y vende",
                description: "Comparte tu enlace único y comienza a generar ingresos",
                icon: TrendingUp
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-purple-200 text-lg leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Historias de
              <span className="block text-purple-400">éxito real</span>
            </h2>
            <p className="text-xl text-purple-200">
              Más de 10,000 creadores ya están construyendo su imperio digital
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-full">
                  <CardContent className="p-8">
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <p className="text-purple-100 mb-6 text-lg leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{testimonial.avatar}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-purple-300 text-sm">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
              ¿Listo para construir
              <span className="block text-purple-400">tu imperio digital?</span>
            </h2>
            
            <p className="text-xl text-purple-200 mb-12 max-w-2xl mx-auto">
              Únete a miles de creadores que ya están generando ingresos pasivos con CreatorStore
            </p>
            
            <div className="space-y-6">
              <Button 
                size="lg"
                onClick={handleGetStarted}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-xl px-12 py-6 h-auto"
              >
                {isLoading ? "Cargando..." : "Crear Mi Tienda Ahora"}
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
              
              <div className="flex items-center justify-center gap-6 text-purple-300">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Gratis para siempre</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Setup en 5 minutos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Sin tarjeta requerida</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">CreatorStore</span>
            </div>
            
            <div className="text-purple-300 text-sm">
              © 2024 CreatorStore. Todos los derechos reservados.
            </div>
            
            <div className="flex gap-6 text-purple-300">
              <a href="#" className="hover:text-white transition-colors">Términos</a>
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Soporte</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

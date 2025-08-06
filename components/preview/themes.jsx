
export const PREDEFINED_THEMES = [
  {
    id: "dark",
    name: "Tema Oscuro",
    description: "Moderno y elegante",
    preview: "#000000",
    colors: {
      background: "#000000",
      gradient: "linear-gradient(135deg, #000000 0%, #2D2D2D 100%)",
      text_color: "#FFFFFF",
      text_secondary_color: "#A0A0A0",
      button_color: "rgba(255, 255, 255, 0.1)",
      button_font_color: "#FFFFFF",
      button_hover_color: "rgba(255, 255, 255, 0.15)",
    },
    fonts: ["Inter", "Roboto", "Poppins"]
  },
  {
    id: "light",
    name: "Tema Claro",
    description: "Limpio y profesional",
    preview: "#F8FAFC",
    colors: {
      background: "#F8FAFC",
      gradient: "linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)",
      text_color: "#1F2937",
      text_secondary_color: "#6B7280",
      button_color: "rgba(0, 0, 0, 0.05)",
      button_font_color: "#1F2937",
      button_hover_color: "rgba(0, 0, 0, 0.1)",
    },
    fonts: ["Inter", "Open Sans", "Lato"]
  },
  {
    id: "cuarzo_rosa",
    name: "Cuarzo Rosa",
    description: "Elegante y sofisticado",
    preview: "linear-gradient(135deg, #F5EDE7 0%, #FAF6F4 100%)",
    colors: {
      background: "#F5EDE7",
      gradient: "linear-gradient(135deg, #F5EDE7 0%, #E8D5CC 100%)",
      text_color: "#4E4039",
      text_secondary_color: "#6B5B52",
      button_color: "#CFAF9E",
      button_font_color: "#4E4039",
      button_hover_color: "#C5A394",
    },
    fonts: ["Inter", "Poppins", "Montserrat"]
  },
  {
    id: "desert_titanium",
    name: "Desert Titanium",
    description: "Elegante y sofisticado",
    preview: "linear-gradient(135deg, #F5F1EC 0%, #EFEAE4 100%)",
    colors: {
      background: "#F5F1EC",
      gradient: "linear-gradient(135deg, #F5F1EC 0%, #DCC7B0 100%)",
      text_color: "#3C3C3C",
      text_secondary_color: "#6B5B5B",
      button_color: "#D3BBA3",
      button_font_color: "#3C3C3C",
      button_hover_color: "#C9AE95",
    },
    fonts: ["Inter", "SF Pro Display", "Helvetica Neue"]
  },
  {
    id: "titanio_natural",
    name: "Titanio Natural",
    description: "Minimalista y tecnológico",
    preview: "linear-gradient(135deg, #F2F2F2 0%, #EDEDED 100%)",
    colors: {
      background: "#F2F2F2",
      gradient: "linear-gradient(135deg, #F2F2F2 0%, #CCCCCC 100%)",
      text_color: "#2D2D2D",
      text_secondary_color: "#5A5A5A",
      button_color: "#B5B5B5",
      button_font_color: "#2D2D2D",
      button_hover_color: "#AFAFAF",
    },
    fonts: ["SF Pro Display", "Helvetica Neue", "Inter"]
  },
  {
    id: "purple_elegant",
    name: "Tema Púrpura Elegante",
    description: "Sofisticado y vibrante",
    preview: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    colors: {
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      gradient: "linear-gradient(135deg, #1a1a2e 0%, #0f051d 100%)",
      text_color: "#E0E7FF",
      text_secondary_color: "#A5B4FC",
      button_color: "rgba(224, 231, 255, 0.1)",
      button_font_color: "#E0E7FF",
      button_hover_color: "rgba(224, 231, 255, 0.15)",
    },
    fonts: ["Inter", "Poppins", "Roboto"]
  },
  {
    id: "blue_night",
    name: "Noche Azul Profundo",
    description: "Elegante y corporativo",
    preview: "#0C1445",
    colors: {
      background: "#0C1445",
      gradient: "linear-gradient(135deg, #0C1445 0%, #051025 100%)",
      text_color: "#E0E7FF",
      text_secondary_color: "#A5B4FC",
      button_color: "rgba(224, 231, 255, 0.1)",
      button_font_color: "#E0E7FF",
      button_hover_color: "rgba(224, 231, 255, 0.15)",
    },
    fonts: ["Lato", "Inter", "Source Sans Pro"]
  },
  {
    id: "sand",
    name: "Arena Suave",
    description: "Cálido y minimalista",
    preview: "#F7F3E9",
    colors: {
      background: "#F7F3E9",
      gradient: "linear-gradient(135deg, #F7F3E9 0%, #EFDCC7 100%)",
      text_color: "#433A3F",
      text_secondary_color: "#695F64",
      button_color: "rgba(67, 58, 63, 0.08)",
      button_font_color: "#433A3F",
      button_hover_color: "rgba(67, 58, 63, 0.12)",
    },
    fonts: ["Quicksand", "Montserrat", "Inter"]
  },
  {
    id: "neon",
    name: "Neón Moderno",
    description: "Vibrante y atrevido",
    preview: "#1A1A2E",
    colors: {
      background: "#1A1A2E",
      gradient: "linear-gradient(135deg, #1A1A2E 0%, #0A0A1A 100%)",
      text_color: "#E0FFFF",
      text_secondary_color: "#AFEEEE",
      button_color: "rgba(224, 255, 255, 0.1)",
      button_font_color: "#E0FFFF",
      button_hover_color: "rgba(224, 255, 255, 0.15)",
    },
    fonts: ["Poppins", "Roboto Mono", "Inter"]
  },
  {
    id: "azul_marino",
    name: "Azul Marino",
    description: "Intenso y profesional",
    preview: "#1A3E8B",
    colors: {
      background: "#1A3E8B",
      gradient: "linear-gradient(135deg, #1A3E8B 0%, #0D2759 100%)",
      text_color: "#FFFFFF",
      text_secondary_color: "#A9C4E8",
      button_color: "#4A90E2",
      button_font_color: "#FFFFFF",
      button_hover_color: "#5A99E5",
    },
    fonts: ["Lato", "Inter", "Source Sans Pro"]
  },
  {
    id: "amarillo_polito",
    name: "Amarillo Polito",
    description: "Cálido y amigable",
    preview: "#FDE68A",
    colors: {
      background: "#FDE68A",
      gradient: "linear-gradient(135deg, #FDE68A 0%, #F4C430 100%)",
      text_color: "#5A4215",
      text_secondary_color: "#856321",
      button_color: "#F6C453",
      button_font_color: "#5A4215",
      button_hover_color: "#F7CA66",
    },
    fonts: ["Quicksand", "Montserrat", "Inter"]
  },
  {
    id: "titanio_esmeralda",
    name: "Titanio Esmeralda",
    description: "Fresco y natural",
    preview: "#D7E7DC",
    colors: {
      background: "#D7E7DC",
      gradient: "linear-gradient(135deg, #D7E7DC 0%, #B0D4BE 100%)",
      text_color: "#333333",
      text_secondary_color: "#555555",
      button_color: "#2E7D60",
      button_font_color: "#333333",
      button_hover_color: "#3E8D70",
    },
    fonts: ["Inter", "Poppins", "Montserrat"]
  },
  {
    id: "bora_purpura",
    name: "Bora Púrpura",
    description: "Delicado y moderno",
    preview: "#E2D5F5",
    colors: {
      background: "#E2D5F5",
      gradient: "linear-gradient(135deg, #E2D5F5 0%, #CAAEE0 100%)",
      text_color: "#3E3E3E",
      text_secondary_color: "#5E5E5E",
      button_color: "#8A63D2",
      button_font_color: "#3E3E3E",
      button_hover_color: "#9A73E2",
    },
    fonts: ["Poppins", "Quicksand", "Nunito"]
  },
  {
    id: "grafito",
    name: "Grafito",
    description: "Sobrio y elegante",
    preview: "#1F1F1F",
    colors: {
      background: "#1F1F1F",
      gradient: "linear-gradient(135deg, #1F1F1F 0%, #0A0A0A 100%)",
      text_color: "#FFFFFF",
      text_secondary_color: "#B3B3B3",
      button_color: "#B3B3B3",
      button_font_color: "#FFFFFF",
      button_hover_color: "#C3C3C3",
    },
    fonts: ["Inter", "Roboto", "Poppins"]
  },
  {
    id: "mandarina_soft",
    name: "Mandarina Soft",
    description: "Vibrante y suave",
    preview: "#FCA88D",
    colors: {
      background: "#FCA88D",
      gradient: "linear-gradient(135deg, #FCA88D 0%, #F56B3B 100%)",
      text_color: "#FFFFFF",
      text_secondary_color: "#FFE5D9",
      button_color: "#F87455",
      button_font_color: "#FFFFFF",
      button_hover_color: "#F98465",
    },
    fonts: ["Poppins", "Quicksand", "Nunito"]
  },
  {
    id: "titanio_cielo",
    name: "Titanio Cielo",
    description: "Limpio y tecnológico",
    preview: "#E6EAEE",
    colors: {
      background: "#E6EAEE",
      gradient: "linear-gradient(135deg, #E6EAEE 0%, #C4D4E0 100%)",
      text_color: "#333333",
      text_secondary_color: "#555555",
      button_color: "#BFD4E7",
      button_font_color: "#333333",
      button_hover_color: "#CFDAE9",
    },
    fonts: ["SF Pro Display", "Helvetica Neue", "Inter"]
  },
  {
    id: "rainbow",
    name: "Tema Arcoíris",
    description: "Vibrante y creativo",
    preview: "linear-gradient(135deg, #b3e5fc, #d1c4e9, #c8e6c9, #fff9c4, #ffe0b2, #f8bbd0)",
    colors: {
      background: "linear-gradient(45deg, #ffb3d9 0%, #b3e5fc 16.66%, #d1c4e9 33.33%, #c8e6c9 50%, #fff9c4 66.66%, #ffe0b2 83.33%, #f8bbd0 100%)",
      gradient: "linear-gradient(135deg, #b3e5fc 0%, #d1c4e9 20%, #c8e6c9 40%, #fff9c4 60%, #ffe0b2 80%, #f8bbd0 100%)",
      text_color: "#FFFFFF",
      text_secondary_color: "#F0F0F0",
      button_color: "rgba(255, 255, 255, 0.2)",
      button_font_color: "#FFFFFF",
      button_hover_color: "rgba(255, 255, 255, 0.3)",
    },
    fonts: ["Poppins", "Quicksand", "Nunito"]
  }
];

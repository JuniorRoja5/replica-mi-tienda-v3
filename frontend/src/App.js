import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    // Check if we're trying to access dashboard.html
    if (window.location.pathname === '/dashboard.html') {
      // Don't redirect, let the dashboard.html load
      return;
    }
    
    // Redirect to the Mi Tienda application for other paths
    window.location.href = '/index.html';
  }, []);

  // If we're on dashboard path, don't render anything and let the HTML file load
  if (window.location.pathname === '/dashboard.html') {
    return null;
  }

  return (
    <div style={{ 
      backgroundColor: '#0f0f10', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Mi Tienda - Cargando...</h1>
        <p>Redirigiendo a la aplicación...</p>
      </div>
    </div>
  );
};

function App() {
  return <Home />;
}

export default App;

import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    // Redirect to the Mi Tienda application
    window.location.href = '/index.html';
  }, []);

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

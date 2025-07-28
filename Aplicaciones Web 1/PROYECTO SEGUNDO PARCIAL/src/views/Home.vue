<template>
  <div class="home-container">
    <!-- Header Principal -->
    <header class="home-header">
      <div class="header-content">
        <img src="/images/logo-uleam.jpeg" alt="Logo ULEAM" class="home-logo">
        <div class="header-text">
          <h1>Sistema de Parqueaderos</h1>
          <h2>Universidad Laica Eloy Alfaro de Manabí</h2>
        </div>
      </div>
    </header>

    <!-- Contenido Principal -->
    <main class="home-main">
      <div class="welcome-card">
        <h3>Bienvenido al Sistema de Gestión de Parqueaderos</h3>
        <p>Administra y reserva espacios de parqueo de manera fácil y eficiente</p>
      </div>

      <!-- Botones de Acceso -->
      <div class="access-buttons">
        <div class="button-group">
          <h4>¿Ya tienes cuenta?</h4>
          <button @click="$router.push('/login')" class="btn-primary btn-large">
            Iniciar Sesión
          </button>
        </div>
        
        <div class="button-group">
          <h4>¿Eres nuevo?</h4>
          <button @click="$router.push('/register')" class="btn-secondary btn-large">
            Registrarse
          </button>
        </div>
      </div>

      <!-- Información del Sistema -->
      <div class="info-section">
        <h4>Características del Sistema</h4>
        <div class="features-grid">
          <div class="feature-card">
            <h5>🚗 Reserva de Espacios</h5>
            <p>Reserva tu espacio de parqueo con anticipación</p>
          </div>
          <div class="feature-card">
            <h5>📱 Fácil de Usar</h5>
            <p>Interface simple e intuitiva para todos los usuarios</p>
          </div>
          <div class="feature-card">
            <h5>⏰ Disponibilidad en Tiempo Real</h5>
            <p>Consulta espacios disponibles al instante</p>
          </div>
          <div class="feature-card">
            <h5>🔒 Seguro y Confiable</h5>
            <p>Sistema seguro para la comunidad universitaria</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer Simple -->
    <footer class="home-footer">
      <p>&copy; 2024 Universidad Laica Eloy Alfaro de Manabí - Sistema de Parqueaderos</p>
    </footer>
  </div>
</template>

<script setup>
// No additional logic needed for home page
</script>

<style scoped>
/* Estilos específicos para la página de inicio */
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, rgba(45, 90, 39, 0.8), rgba(76, 175, 80, 0.6)),
    url("https://www.epmmop.gob.ec/wp-content/uploads/2024/04/FOTO_5-2-1024x683.jpg") center / cover;
  background-attachment: fixed;
}

.home-header {
  background: linear-gradient(135deg, var(--primary-color), #3d7c47);
  color: white;
  padding: 30px 20px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.home-logo {
  max-height: 120px;
  width: auto;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.header-text h1 {
  font-size: 2.5rem;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.header-text h2 {
  font-size: 1.2rem;
  margin: 10px 0 0 0;
  font-weight: 300;
  opacity: 0.9;
}

.home-main {
  flex: 1;
  padding: 40px 20px;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
}

.welcome-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 15px;
  text-align: center;
  margin-bottom: 40px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.welcome-card h3 {
  color: var(--primary-color);
  font-size: 2rem;
  margin-bottom: 15px;
}

.welcome-card p {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.access-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

.button-group {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.button-group h4 {
  color: var(--primary-color);
  margin-bottom: 20px;
  font-size: 1.3rem;
}

/* Estilos para botones */
.btn-primary {
  background-color: var(--success-color);
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  margin-bottom: 15px;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin: 5px;
}

.btn-secondary:hover {
  background-color: var(--secondary-hover);
}

.btn-large {
  padding: 15px 30px;
  font-size: 1.1rem;
  min-width: 200px;
  border-radius: 8px;
}

.info-section {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.info-section h4 {
  color: var(--primary-color);
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 30px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 25px;
}

.feature-card {
  background: rgba(248, 249, 250, 0.8);
  padding: 25px;
  border-radius: 10px;
  text-align: center;
  border: 2px solid rgba(76, 175, 80, 0.1);
}

.feature-card:hover {
  border-color: var(--success-color);
}

.feature-card h5 {
  color: var(--primary-color);
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.feature-card p {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
}

.home-footer {
  background: var(--primary-color);
  color: white;
  text-align: center;
  padding: 20px;
  margin-top: auto;
}

.home-footer p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 20px;
  }

  .home-logo {
    max-height: 80px;
  }

  .header-text h1 {
    font-size: 1.8rem;
  }

  .header-text h2 {
    font-size: 1rem;
  }

  .welcome-card {
    padding: 25px;
  }

  .welcome-card h3 {
    font-size: 1.5rem;
  }

  .button-group {
    padding: 20px;
  }

  .info-section {
    padding: 25px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .home-main {
    padding: 20px 15px;
  }

  .access-buttons {
    grid-template-columns: 1fr;
  }

  .btn-large {
    min-width: 180px;
    padding: 12px 25px;
  }
}
</style>

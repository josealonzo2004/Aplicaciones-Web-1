<template>
  <div class="page-container">
    <div class="header">
      <div class="header-with-logo">
        <img src="/images/logo-uleam.jpeg" alt="Logo ULEAM" class="logo-header">
        <h1>Sistema de Parqueaderos ULEAM</h1>
      </div>
      <div class="user-info">
        <span>Bienvenido, {{ userName }}</span>
        <button @click="logout" class="btn-danger">Cerrar Sesión</button>
      </div>
    </div>
    
    <div class="main-content">
      <div class="welcome-section">
        <h2>Panel de Administrador</h2>
      </div>
      
      <div class="navigation-menu">
        <button @click="$router.push('/admin/users')" class="btn-primary">Gestión de Usuarios</button>
        <button @click="$router.push('/admin/parking')" class="btn-primary">Gestión de Parqueaderos</button>
        <button @click="$router.push('/admin/exits')" class="btn-primary">Gestión de Salidas</button>
      </div>
      
      <div class="summary-section">
        <h3>Resumen del Sistema</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <h4>Espacios Totales</h4>
            <span class="stat-number">{{ stats.totalSpaces }}</span>
          </div>
          <div class="stat-card">
            <h4>Espacios Disponibles</h4>
            <span class="stat-number green">{{ stats.availableSpaces }}</span>
          </div>
          <div class="stat-card">
            <h4>Usuarios Registrados</h4>
            <span class="stat-number">{{ stats.totalUsers }}</span>
          </div>
          <div class="stat-card">
            <h4>Reservas Activas</h4>
            <span class="stat-number" style="color: #007bff;">{{ stats.activeReservations }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer Simple -->
    <footer class="home-footer">
      <p>&copy; 2024 Universidad Laica Eloy Alfaro de Manabí - Sistema de Parqueaderos</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userName = ref(localStorage.getItem('userName') || 'Administrador')

const stats = ref({
  totalSpaces: 0,
  availableSpaces: 0,
  totalUsers: 2,
  activeReservations: 0
})

const logout = () => {
  if (confirm('¿Está seguro que desea cerrar sesión?')) {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userName')
    router.push('/login')
  }
}

const loadStats = () => {
  // Cargar estadísticas de espacios
  const parkingSpaces = JSON.parse(localStorage.getItem('parkingSpaces') || '[]')
  stats.value.totalSpaces = parkingSpaces.length
  stats.value.availableSpaces = parkingSpaces.filter(s => s.status === 'available').length

  // Cargar estadísticas de usuarios registrados
  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
  stats.value.totalUsers = registeredUsers.length

  // Cargar estadísticas de reservas
  const reservations = JSON.parse(localStorage.getItem('userReservations') || '[]')
  stats.value.activeReservations = reservations.filter(r => r.status === 'active').length
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(135deg, var(--primary-color), #3d7c47);
  color: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header h1 {
  font-size: 24px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-with-logo {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-header {
  max-height: 50px;
  width: auto;
  margin-right: 15px;
}

.main-content {
  flex: 1;
  padding: 30px;
  max-width: 1300px;
  margin: 0 auto;
  width: 95%;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.welcome-section h2 {
  color: var(--primary-color);
  margin-bottom: 20px;
  text-align: center;
  font-size: 32px;
}

.navigation-menu {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin: 30px 0;
  flex-wrap: wrap;
}

.navigation-menu .btn-primary {
  width: auto;
  min-width: 200px;
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

.btn-danger {
  background-color: var(--danger-color);
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin: 5px;
}

.btn-danger:hover {
  background-color: var(--danger-hover);
}

.summary-section {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 8px;
  box-shadow: var(--shadow);
  margin-top: 30px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.summary-section h3 {
  color: var(--primary-color);
  margin-bottom: 20px;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background-color: rgba(248, 249, 250, 0.9);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  border: 2px solid var(--border-color);
  backdrop-filter: blur(5px);
}

.stat-card h4 {
  color: #666;
  margin-bottom: 10px;
  font-size: 14px;
  text-transform: uppercase;
}

.stat-number {
  font-size: 36px;
  font-weight: bold;
  color: #333;
}

.stat-number.green {
  color: var(--success-color);
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
  .header {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }

  .navigation-menu {
    flex-direction: column;
    align-items: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .main-content {
    padding: 15px;
  }

  .logo-header {
    max-height: 40px;
  }

  .header-with-logo {
    flex-direction: column;
    gap: 10px;
  }

  .header h1 {
    font-size: 20px;
  }

  .welcome-section h2 {
    font-size: 24px;
  }

  .navigation-menu .btn-primary {
    min-width: 150px;
  }
}
</style>

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
        <h2>Panel de Usuario</h2>
      </div>
      
      <div class="navigation-menu">
        <button @click="$router.push('/user/reserve')" class="btn-primary">
          Ver Disponibilidad y Reservar Espacio
        </button>
        <button @click="$router.push('/user/reservations')" class="btn-primary">
          Mis Reservas
        </button>
      </div>
      
      <!-- Resumen de Reservas -->
      <div class="summary-section">
        <h3>Resumen de Reservas</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <h4>Reservas Activas</h4>
            <span class="stat-number green">{{ activeReservationsCount }}</span>
          </div>
          <div class="stat-card">
            <h4>Total de Reservas</h4>
            <span class="stat-number">{{ totalReservationsCount }}</span>
          </div>
          <div class="stat-card">
            <h4>Reservas Canceladas</h4>
            <span class="stat-number" style="color: #dc3545;">{{ cancelledReservationsCount }}</span>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userName = ref(localStorage.getItem('userName') || 'Usuario')

const reservations = ref([])

// Computed properties para estadísticas
const activeReservationsCount = computed(() => {
  return reservations.value.filter(r => r.status === 'active').length
})

const totalReservationsCount = computed(() => {
  return reservations.value.length
})

const cancelledReservationsCount = computed(() => {
  return reservations.value.filter(r => r.status === 'cancelled').length
})

const loadReservations = () => {
  const savedReservations = localStorage.getItem('userReservations')
  if (savedReservations) {
    const allReservations = JSON.parse(savedReservations)
    // Filtrar solo las reservas del usuario actual
    const currentUserId = localStorage.getItem('userId')
    reservations.value = allReservations.filter(r => r.userId === currentUserId)
    
    // Actualizar automáticamente reservas pasadas
    const now = new Date()
    let updated = false
    
    reservations.value.forEach(reservation => {
      if (reservation.status === 'active') {
        const reservationDate = new Date(reservation.date)
        const [hours, minutes] = reservation.startTime.split(':')
        reservationDate.setHours(parseInt(hours), parseInt(minutes))
        
        // Si la fecha y hora de la reserva ya pasó, marcarla como completada
        if (reservationDate < now) {
          reservation.status = 'completed'
          updated = true
        }
      }
    })
    
    // Si se actualizó alguna reserva, guardar los cambios en el sistema global
    if (updated) {
      const allReservations = JSON.parse(localStorage.getItem('userReservations') || '[]')
      reservations.value.forEach(userReservation => {
        const globalIndex = allReservations.findIndex(r => r.id === userReservation.id)
        if (globalIndex !== -1) {
          allReservations[globalIndex] = userReservation
        }
      })
      localStorage.setItem('userReservations', JSON.stringify(allReservations))
    }
  } else {
    reservations.value = []
  }
}

onMounted(() => {
  loadReservations()
  
  // Actualizar reservas cada minuto
  setInterval(loadReservations, 60000)
})

const logout = () => {
  if (confirm('¿Está seguro que desea cerrar sesión?')) {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userName')
    router.push('/login')
  }
}
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
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
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
  letter-spacing: 0.5px;
}

.stat-number {
  font-size: 36px;
  font-weight: bold;
  color: #333;
}

.stat-number.green {
  color: var(--success-color);
}

/* Estilos para estados y badges */
.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status.active {
  background-color: #d1ecf1;
  color: #0c5460;
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

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>

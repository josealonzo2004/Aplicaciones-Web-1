<template>
  <div>
    <div class="header">
      <div class="header-with-logo">
        <img src="/images/logo-uleam.jpeg" alt="Logo ULEAM" class="logo-header">
        <h1>Mis Reservas</h1>
      </div>
      <button @click="$router.push('/user')" class="btn-secondary">Volver al Panel</button>
    </div>
    
    <div class="main-content">
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

      <!-- Filtros -->
      <div class="search-filters">
        <h2>Filtrar Reservas</h2>
        <div class="filter-row">
          <div class="input-group">
            <label for="statusFilter">Estado:</label>
            <select id="statusFilter" v-model="statusFilter">
              <option value="">Todas las reservas</option>
              <option value="active">Activas</option>
              <option value="completed">Completadas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>
          <div class="input-group">
            <label for="searchSpace">Buscar por Zona:</label>
            <input 
              type="text" 
              id="searchSpace"
              v-model="searchTerm"
              placeholder="Ej: Zona A"
              class="search-input"
            >
          </div>
        </div>
      </div>
      
      <!-- Tabla de Reservas -->
      <div class="section">
        <h2>Historial de Reservas</h2>
        
        <div v-if="filteredReservations.length === 0" style="text-align: center; padding: 40px; color: #666;">
          <h3>No tienes reservas</h3>
          <p>Aún no has realizado ninguna reserva de espacio de parqueo.</p>
          <button @click="$router.push('/user/reserve')" class="btn-primary" style="width: auto; margin-top: 15px;">
            Hacer Primera Reserva
          </button>
        </div>

        <table v-else class="data-table">
          <thead>
            <tr>
              <th>Espacio</th>
              <th>Zona</th>
              <th>Tipo de Vehículo</th>
              <th>Fecha</th>
              <th>Hora Inicio</th>
              <th>Estado</th>
              <th>Fecha de Reserva</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reservation in filteredReservations" :key="reservation.id">
              <td><strong>{{ reservation.spaceId }}</strong></td>
              <td>{{ reservation.zone }}</td>
              <td>{{ reservation.vehicleType }}</td>
              <td>{{ formatDate(reservation.date) }}</td>
              <td>{{ reservation.startTime }}</td>
              <td>
                <span :class="['status', reservation.status]">
                  {{ getStatusText(reservation.status) }}
                </span>
              </td>
              <td>{{ formatDateTime(reservation.createdAt) }}</td>
              <td>
                <button 
                  v-if="reservation.status === 'active'"
                  @click="cancelReservation(reservation)" 
                  class="btn-danger"
                  style="font-size: 12px; padding: 8px 12px;"
                >
                  Cancelar
                </button>
                <span v-else style="color: #999;">-</span>
              </td>
            </tr>
          </tbody>
        </table>
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

const reservations = ref([])
const statusFilter = ref('')
const searchTerm = ref('')

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

// Computed property para filtrar reservas
const filteredReservations = computed(() => {
  let filtered = reservations.value

  // Filtrar por estado
  if (statusFilter.value) {
    filtered = filtered.filter(r => r.status === statusFilter.value)
  }

  // Filtrar por término de búsqueda
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(r => 
      r.spaceId.toLowerCase().includes(term) ||
      r.zone.toLowerCase().includes(term)
    )
  }

  // Ordenar por fecha de creación (más recientes primero)
  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const getStatusText = (status) => {
  const statusMap = {
    active: 'Activa',
    completed: 'Completada',
    cancelled: 'Cancelada'
  }
  return statusMap[status] || status
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString)
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const cancelReservation = (reservation) => {
  if (confirm(`¿Está seguro que desea cancelar la reserva del espacio ${reservation.spaceId}?`)) {
    // Actualizar el estado de la reserva
    reservation.status = 'cancelled'
    reservation.cancelledAt = new Date().toISOString()
    
    // Actualizar en el sistema global
    const allReservations = JSON.parse(localStorage.getItem('userReservations') || '[]')
    const globalIndex = allReservations.findIndex(r => r.id === reservation.id)
    if (globalIndex !== -1) {
      allReservations[globalIndex] = reservation
      localStorage.setItem('userReservations', JSON.stringify(allReservations))
    }
    
    // Liberar el espacio (marcarlo como disponible)
    const parkingSpaces = JSON.parse(localStorage.getItem('parkingSpaces') || '[]')
    const spaceIndex = parkingSpaces.findIndex(s => s.identifier === reservation.spaceId)
    if (spaceIndex !== -1) {
      parkingSpaces[spaceIndex].status = 'available'
      parkingSpaces[spaceIndex].updatedAt = new Date().toISOString()
      localStorage.setItem('parkingSpaces', JSON.stringify(parkingSpaces))
    }
    
    alert('Reserva cancelada exitosamente')
  }
}

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
</script>

<style scoped>
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
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.section {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 8px;
  box-shadow: var(--shadow);
  margin-bottom: 30px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.section h2 {
  color: var(--primary-color);
  margin-bottom: 20px;
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

/* Estilos para tablas */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow);
  backdrop-filter: blur(5px);
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.data-table th {
  background-color: rgba(248, 249, 250, 0.9);
  font-weight: bold;
  color: var(--primary-color);
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 0.5px;
}

.data-table tr:hover {
  background-color: rgba(245, 245, 245, 0.9);
}

.data-table tr:last-child td {
  border-bottom: none;
}

/* Estilos para formularios */
.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: bold;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 10px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  font-size: 16px;
  background-color: rgba(255, 255, 255, 0.9);
}

.input-group input:focus,
.input-group select:focus {
  border-color: var(--success-color);
  outline: none;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
}

.search-input {
  flex: 1;
  padding: 10px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  font-size: 16px;
  min-width: 200px;
  background-color: rgba(255, 255, 255, 0.9);
}

.search-input:focus {
  border-color: var(--success-color);
  outline: none;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
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

.status.available {
  background-color: #d4edda;
  color: #155724;
}

.status.occupied {
  background-color: #f8d7d9;
  color: #721c24;
}

.status.active {
  background-color: #d1ecf1;
  color: #0c5460;
}

.status.completed {
  background-color: #d4edda;
  color: #155724;
}

.status.cancelled {
  background-color: #f8d7d9;
  color: #721c24;
}

.status.pending {
  background-color: #fff3cd;
  color: #856404;
}

.search-filters {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 8px;
  box-shadow: var(--shadow);
  margin-bottom: 30px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.search-filters h2 {
  color: var(--primary-color);
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-row .input-group {
  flex: 1;
  min-width: 200px;
}

.summary-section {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 8px;
  box-shadow: var(--shadow);
  margin-bottom: 30px;
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

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }

  .filter-row {
    flex-direction: column;
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
}
</style>

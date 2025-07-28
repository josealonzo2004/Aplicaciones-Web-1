<template>
  <div>
    <div class="header">
      <div class="header-with-logo">
        <img src="/images/logo-uleam.jpeg" alt="Logo ULEAM" class="logo-header">
        <h1>Gestión de Salidas</h1>
      </div>
      <button @click="$router.push('/admin')" class="btn-secondary">Volver al Panel</button>
    </div>
    
    <div class="main-content">
      <!-- Resumen de Salidas -->
      <div class="summary-section">
        <h3>Resumen de Salidas del Día</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <h4>Salidas Hoy</h4>
            <span class="stat-number green">{{ todayExits }}</span>
          </div>
          <div class="stat-card">
            <h4>Reservas Activas</h4>
            <span class="stat-number">{{ activeReservationsCount }}</span>
          </div>
          <div class="stat-card">
            <h4>Total de Salidas</h4>
            <span class="stat-number">{{ totalExits }}</span>
          </div>
        </div>
      </div>

      <!-- Reservas Activas para Marcar Salida -->
      <div class="section">
        <h2>Reservas Activas - Marcar Salida</h2>
        
        <div class="search-section">
          <input 
            type="text" 
            v-model="searchTerm"
            placeholder="Buscar por Ej:Zona A" 
            class="search-input"
          >
        </div>

        <div v-if="filteredActiveReservations.length === 0" style="text-align: center; padding: 40px; color: #666;">
          <h3>No hay reservas activas</h3>
          <p>No hay usuarios con reservas activas para marcar salida.</p>
        </div>

        <table v-else class="data-table">
          <thead>
            <tr>
              <th>Espacio</th>
              <th>Zona</th>
              <th>Tipo de Vehículo</th>
              <th>Fecha Reserva</th>
              <th>Hora Inicio</th>
              <th>Tiempo Transcurrido</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reservation in filteredActiveReservations" :key="reservation.id">
              <td><strong>{{ reservation.spaceId }}</strong></td>
              <td>{{ reservation.zone }}</td>
              <td>{{ reservation.vehicleType }}</td>
              <td>{{ formatDate(reservation.date) }}</td>
              <td>{{ reservation.startTime }}</td>
              <td>{{ getElapsedTime(reservation) }}</td>
              <td>
                <button 
                  @click="markExit(reservation)" 
                  class="btn-primary"
                  style="font-size: 12px; padding: 8px 12px;"
                >
                  Marcar Salida
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Historial de Salidas -->
      <div class="section">
        <h2>Historial de Salidas</h2>
        
        <div class="search-filters">
          <h2>Filtrar Historial</h2>
          <div class="filter-row">
            <div class="input-group">
              <label for="spaceFilter">Filtrar por Zona:</label>
              <input 
                type="text" 
                id="spaceFilter"
                v-model="spaceFilter"
                placeholder="Ej: Zona A"
              >
            </div>
          </div>
        </div>

        <div v-if="filteredExits.length === 0" style="text-align: center; padding: 40px; color: #666;">
          <h3>No hay registros de salidas</h3>
          <p>Aún no se han registrado salidas en el sistema.</p>
        </div>

        <table v-else class="data-table">
          <thead>
            <tr>
              <th>Espacio</th>
              <th>Zona</th>
              <th>Fecha Reserva</th>
              <th>Hora Entrada</th>
              <th>Hora Salida</th>
              <th>Tiempo Total</th>
              <th>Fecha de Registro</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="exit in filteredExits" :key="exit.id">
              <td><strong>{{ exit.spaceId }}</strong></td>
              <td>{{ exit.zone }}</td>
              <td>{{ formatDate(exit.reservationDate) }}</td>
              <td>{{ exit.entryTime }}</td>
              <td>{{ exit.exitTime }}</td>
              <td>{{ exit.totalTime }}</td>
              <td>{{ formatDateTime(exit.exitRegisteredAt) }}</td>
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

const activeReservations = ref([])
const exits = ref([])
const searchTerm = ref('')
const spaceFilter = ref('')

// Computed properties para estadísticas
const activeReservationsCount = computed(() => activeReservations.value.length)
const totalExits = computed(() => exits.value.length)
const todayExits = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return exits.value.filter(exit => 
    exit.exitRegisteredAt.split('T')[0] === today
  ).length
})

// Computed property para filtrar reservas activas
const filteredActiveReservations = computed(() => {
  if (!searchTerm.value) return activeReservations.value
  
  const term = searchTerm.value.toLowerCase()
  return activeReservations.value.filter(reservation => 
    reservation.spaceId.toLowerCase().includes(term) ||
    reservation.zone.toLowerCase().includes(term)
  )
})

// Computed property para filtrar salidas
const filteredExits = computed(() => {
  let filtered = exits.value

  // Filtrar por espacio
  if (spaceFilter.value) {
    const term = spaceFilter.value.toLowerCase()
    filtered = filtered.filter(exit => 
      exit.spaceId.toLowerCase().includes(term) ||
      exit.zone.toLowerCase().includes(term)
    )
  }

  // Ordenar por fecha de salida (más recientes primero)
  return filtered.sort((a, b) => new Date(b.exitRegisteredAt) - new Date(a.exitRegisteredAt))
})

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

const getElapsedTime = (reservation) => {
  const now = new Date()
  const reservationDateTime = new Date(`${reservation.date}T${reservation.startTime}`)
  
  if (reservationDateTime > now) {
    return 'Aún no inicia'
  }
  
  const diffMs = now - reservationDateTime
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${diffHours}h ${diffMinutes}m`
}

const calculateTotalTime = (entryTime, exitTime) => {
  const entry = new Date(`2000-01-01T${entryTime}`)
  const exit = new Date(`2000-01-01T${exitTime}`)
  
  const diffMs = exit - entry
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${diffHours}h ${diffMinutes}m`
}

const markExit = (reservation) => {
  if (confirm(`¿Confirmar salida del espacio ${reservation.spaceId}?`)) {
    const now = new Date()
    const exitTime = now.toTimeString().slice(0, 5) // HH:MM format
    
    // Crear registro de salida
    const exitRecord = {
      id: Date.now(),
      spaceId: reservation.spaceId,
      zone: reservation.zone,
      vehicleType: reservation.vehicleType,
      reservationDate: reservation.date,
      entryTime: reservation.startTime,
      exitTime: exitTime,
      totalTime: calculateTotalTime(reservation.startTime, exitTime),
      exitRegisteredAt: now.toISOString(),
      reservationId: reservation.id
    }
    
    // Agregar a la lista de salidas
    exits.value.push(exitRecord)
    
    // Actualizar estado de la reserva a completada
    const userReservations = JSON.parse(localStorage.getItem('userReservations') || '[]')
    const reservationIndex = userReservations.findIndex(r => r.id === reservation.id)
    if (reservationIndex !== -1) {
      userReservations[reservationIndex].status = 'completed'
      userReservations[reservationIndex].exitTime = exitTime
      userReservations[reservationIndex].completedAt = now.toISOString()
      localStorage.setItem('userReservations', JSON.stringify(userReservations))
    }
    
    // Liberar el espacio (marcarlo como disponible)
    const parkingSpaces = JSON.parse(localStorage.getItem('parkingSpaces') || '[]')
    const spaceIndex = parkingSpaces.findIndex(s => s.identifier === reservation.spaceId)
    if (spaceIndex !== -1) {
      parkingSpaces[spaceIndex].status = 'available'
      parkingSpaces[spaceIndex].updatedAt = now.toISOString()
      localStorage.setItem('parkingSpaces', JSON.stringify(parkingSpaces))
    }
    
    // Guardar registro de salidas
    localStorage.setItem('exitRecords', JSON.stringify(exits.value))
    
    // Recargar datos
    loadData()
    
    alert(`Salida registrada exitosamente para el espacio ${reservation.spaceId}`)
  }
}

const loadData = () => {
  // Cargar reservas activas
  const userReservations = JSON.parse(localStorage.getItem('userReservations') || '[]')
  activeReservations.value = userReservations.filter(r => r.status === 'active')
  
  // Cargar registros de salidas
  const savedExits = localStorage.getItem('exitRecords')
  if (savedExits) {
    exits.value = JSON.parse(savedExits)
  }
}

onMounted(() => {
  loadData()
  
  // Actualizar datos cada 30 segundos
  setInterval(loadData, 30000)
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

.search-section {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
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

.search-filters {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 8px;
  box-shadow: var(--shadow);
  margin-bottom: 30px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
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
  
  .search-section {
    flex-direction: column;
    align-items: stretch;
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

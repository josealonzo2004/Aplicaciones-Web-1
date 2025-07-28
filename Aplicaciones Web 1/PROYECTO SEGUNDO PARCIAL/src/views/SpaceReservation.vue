<template>
  <div>
    <div class="header">
      <div class="header-with-logo">
        <img src="/images/logo-uleam.jpeg" alt="Logo ULEAM" class="logo-header">
        <h1>Reserva de Espacios de Parqueo</h1>
      </div>
      <button @click="$router.push('/user')" class="btn-secondary">Volver al Panel</button>
    </div>
    
    <div class="main-content">
      <!-- Sección de Espacios Disponibles -->
      <div class="section">
        <h2>Espacios de Parqueo Disponibles</h2>
        <p style="text-align: center; margin-bottom: 20px; color: #666;">
          Selecciona un espacio disponible para hacer tu reserva
        </p>
        
        <!-- Filtros de Espacios -->
        <div class="space-filters">
          <div class="filter-row">
            <div class="input-group">
              <label for="vehicleTypeFilter">Filtrar por Tipo de Vehículo:</label>
              <select id="vehicleTypeFilter" v-model="vehicleTypeFilter">
                <option value="">Todos los tipos</option>
                <option value="Auto">Auto</option>
                <option value="Motocicleta">Motocicleta</option>
                <option value="Vehículo Pesado">Vehículo Pesado</option>
              </select>
            </div>
            <div class="input-group">
              <label for="zoneFilter">Filtrar por Zona:</label>
              <select id="zoneFilter" v-model="zoneFilter">
                <option value="">Todas las zonas</option>
                <option v-for="zone in availableZones" :key="zone" :value="zone">{{ zone }}</option>
              </select>
            </div>
          </div>
          <div style="text-align: center; margin-top: 15px;">
            <button @click="clearFilters" class="btn-secondary" style="width: auto; min-width: 120px;">
              Limpiar Filtros
            </button>
          </div>
        </div>
        
        <!-- Mensaje si no hay espacios -->
        <div v-if="allSpaces.length === 0" style="text-align: center; padding: 40px; color: #666;">
          <h3>No hay espacios de parqueo configurados</h3>
          <p>El administrador aún no ha creado espacios de parqueo.</p>
        </div>
        
        <!-- Grid de Espacios -->
        <div v-else class="spaces-grid">
          <div 
            v-for="space in filteredSpaces" 
            :key="space.id"
            :class="['space', space.status, { selected: selectedSpace?.id === space.id }]"
            @click="selectSpace(space)"
          >
            <span>{{ space.identifier }}</span>
            <div :class="['status-indicator', space.status]"></div>
          </div>
        </div>
        
        <!-- Leyenda -->
        <div v-if="allSpaces.length > 0" class="legend">
          <div class="legend-item">
            <div class="status-indicator available"></div>
            <span>Disponible</span>
          </div>
          <div class="legend-item">
            <div class="status-indicator occupied"></div>
            <span>Ocupado</span>
          </div>
          <div class="legend-item">
            <div class="status-indicator maintenance"></div>
            <span>En Mantenimiento</span>
          </div>
        </div>
      </div>
      
      <!-- Formulario de Reserva (solo se muestra cuando se selecciona un espacio) -->
      <div v-if="selectedSpace && selectedSpace.status === 'available'" class="form-section">
        <h3>Confirmar Reserva - Espacio {{ selectedSpace.identifier }}</h3>
        <div class="reservation-details">
          <p><strong>Usuario:</strong> {{ currentUser.nombres }}</p>
          <p><strong>Email:</strong> {{ currentUser.email }}</p>
          <p><strong>Espacio Seleccionado:</strong> {{ selectedSpace.identifier }}</p>
          <p><strong>Zona:</strong> {{ selectedSpace.zone }}</p>
          <p><strong>Tipo:</strong> {{ selectedSpace.vehicleType }}</p>
        </div>
        
        <form @submit.prevent="confirmReservation">
          <div class="filter-row">
            <div class="input-group">
              <label for="reserveDate">Fecha de Reserva:</label>
              <input 
                type="date" 
                id="reserveDate" 
                v-model="reservationForm.date" 
                :min="minDate"
                :max="maxDate"
                required
              >
            </div>
            <div class="input-group">
              <label for="startTime">Hora de Inicio:</label>
              <input 
                type="time" 
                id="startTime" 
                v-model="reservationForm.startTime" 
                required
              >
            </div>
          </div>
          
          <div style="display: flex; gap: 15px; justify-content: center; margin-top: 20px;">
            <button type="submit" class="btn-primary" style="width: auto; min-width: 150px;">
              Confirmar Reserva
            </button>
            <button type="button" @click="cancelSelection" class="btn-secondary" style="width: auto; min-width: 150px;">
              Cancelar
            </button>
          </div>
        </form>
      </div>
      
      <!-- Mensaje cuando se selecciona un espacio no disponible -->
      <div v-if="selectedSpace && selectedSpace.status !== 'available'" class="form-section" style="text-align: center;">
        <h3>Espacio No Disponible</h3>
        <p style="color: #dc3545; font-size: 18px; margin: 20px 0;">
          <strong>El espacio {{ selectedSpace.identifier }} no está disponible para reserva.</strong>
        </p>
        <p style="color: #666;">
          Estado actual: 
          <span :class="['status', selectedSpace.status]">
            {{ getStatusText(selectedSpace.status) }}
          </span>
        </p>
        <button @click="cancelSelection" class="btn-secondary" style="margin-top: 15px;">
          Seleccionar Otro Espacio
        </button>
      </div>
    </div>
    
    <!-- Footer Simple -->
    <footer class="home-footer">
      <p>&copy; 2024 Universidad Laica Eloy Alfaro de Manabí - Sistema de Parqueaderos</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const selectedSpace = ref(null)
const allSpaces = ref([])
const vehicleTypeFilter = ref('')
const zoneFilter = ref('')

// Información del usuario actual
const currentUser = reactive({
  id: localStorage.getItem('userId'),
  nombres: localStorage.getItem('userName'),
  email: localStorage.getItem('userEmail')
})

// Computed property para obtener zonas disponibles
const availableZones = computed(() => {
  const zones = [...new Set(allSpaces.value.map(space => space.zone))]
  return zones.sort()
})

// Computed property para filtrar espacios
const filteredSpaces = computed(() => {
  let filtered = allSpaces.value

  // Filtrar por tipo de vehículo
  if (vehicleTypeFilter.value) {
    filtered = filtered.filter(space => space.vehicleType === vehicleTypeFilter.value)
  }

  // Filtrar por zona
  if (zoneFilter.value) {
    filtered = filtered.filter(space => space.zone === zoneFilter.value)
  }

  return filtered.sort((a, b) => a.identifier.localeCompare(b.identifier))
})

const reservationForm = reactive({
  date: '',
  startTime: ''
})

// Fechas mínima y máxima para la reserva
const minDate = computed(() => {
  const today = new Date()
  const tomorrow = new Date(today.getTime() + (1 * 24 * 60 * 60 * 1000)) // mañana
  return tomorrow.toISOString().split('T')[0]
})
const maxDate = computed(() => {
  const today = new Date()
  const maxDate = new Date(today.getTime() + (5 * 24 * 60 * 60 * 1000)) // 5 días desde hoy
  return maxDate.toISOString().split('T')[0]
})

const clearFilters = () => {
  vehicleTypeFilter.value = ''
  zoneFilter.value = ''
}

const selectSpace = (space) => {
  selectedSpace.value = space
  // Limpiar formulario cuando se selecciona un nuevo espacio
  reservationForm.date = ''
  reservationForm.startTime = ''
}

const cancelSelection = () => {
  selectedSpace.value = null
  reservationForm.date = ''
  reservationForm.startTime = ''
}

const getStatusText = (status) => {
  const statusMap = {
    available: 'Disponible',
    occupied: 'Ocupado',
    maintenance: 'En Mantenimiento'
  }
  return statusMap[status] || status
}

const validateReservation = () => {
  if (!reservationForm.date || !reservationForm.startTime) {
    alert('Por favor complete la fecha y hora de inicio')
    return false
  }

  const selectedDate = new Date(reservationForm.date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (selectedDate < today) {
    alert('No puede seleccionar una fecha anterior a la de hoy')
    return false
  }

  // Si es hoy, verificar que la hora no sea menor que la actual
  if (selectedDate.getTime() === today.getTime()) {
    const now = new Date()
    const [hours, minutes] = reservationForm.startTime.split(':')
    const selectedTime = parseInt(hours) * 60 + parseInt(minutes)
    const currentTime = now.getHours() * 60 + now.getMinutes()

    if (selectedTime < currentTime) {
      alert('La hora de inicio no puede ser menor que la hora actual')
      return false
    }
  }

  return true
}

const confirmReservation = () => {
  if (!validateReservation()) {
    return
  }

  // Crear la reserva
  const newReservation = {
    id: Date.now(),
    userId: currentUser.id,
    userName: currentUser.nombres,
    userEmail: currentUser.email,
    spaceId: selectedSpace.value.identifier,
    zone: selectedSpace.value.zone,
    vehicleType: selectedSpace.value.vehicleType,
    date: reservationForm.date,
    startTime: reservationForm.startTime,
    status: 'active',
    createdAt: new Date().toISOString()
  }

  // Guardar en el sistema global de reservas (para que aparezca en Mis Reservas y Gestión de Salidas)
  const allReservations = JSON.parse(localStorage.getItem('userReservations') || '[]')
  allReservations.push(newReservation)
  localStorage.setItem('userReservations', JSON.stringify(allReservations))

  // Cambiar el estado del espacio a ocupado
  const adminSpaces = JSON.parse(localStorage.getItem('parkingSpaces') || '[]')
  const adminSpaceIndex = adminSpaces.findIndex(s => s.identifier === selectedSpace.value.identifier)
  if (adminSpaceIndex !== -1) {
    adminSpaces[adminSpaceIndex].status = 'occupied'
    adminSpaces[adminSpaceIndex].updatedAt = new Date().toISOString()
    localStorage.setItem('parkingSpaces', JSON.stringify(adminSpaces))
  }

  // Actualizar también en la lista local
  const spaceIndex = allSpaces.value.findIndex(s => s.identifier === selectedSpace.value.identifier)
  if (spaceIndex !== -1) {
    allSpaces.value[spaceIndex].status = 'occupied'
  }

  // Mostrar mensaje de éxito
  alert(`¡Reserva confirmada exitosamente!

Detalles de tu reserva:
• Usuario: ${currentUser.nombres}
• Espacio: ${selectedSpace.value.identifier}
• Zona: ${selectedSpace.value.zone}
• Fecha: ${reservationForm.date}
• Hora: ${reservationForm.startTime}

Puedes ver tus reservas en "Mis Reservas"`)

  // Limpiar selección
  cancelSelection()
}

const loadSpaces = () => {
  // Cargar espacios creados por el admin
  const adminSpaces = JSON.parse(localStorage.getItem('parkingSpaces') || '[]')
  allSpaces.value = adminSpaces
}

onMounted(() => {
  loadSpaces()
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

.form-section {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 8px;
  box-shadow: var(--shadow);
  margin-top: 20px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.form-section h3 {
  color: var(--primary-color);
  margin-bottom: 20px;
}

/* Estilos específicos para reservas */
.spaces-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.space {
  width: 100px;
  height: 80px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
}

.space.available {
  background-color: rgba(212, 237, 218, 0.9);
  border-color: var(--success-color);
}

.space.occupied {
  background-color: rgba(248, 215, 218, 0.9);
  border-color: var(--danger-color);
  cursor: not-allowed;
}

.space.selected {
  background-color: rgba(179, 217, 255, 0.9);
  border-color: #007bff;
  transform: scale(1.1);
}

.space.maintenance {
  background-color: rgba(255, 243, 205, 0.9);
  border-color: #ffc107;
  cursor: not-allowed;
}

.space span {
  font-weight: bold;
  margin-bottom: 5px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-indicator.available {
  background-color: var(--success-color);
}

.status-indicator.occupied {
  background-color: var(--danger-color);
}

.status-indicator.maintenance {
  background-color: #ffc107;
}

.legend {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.reservation-details {
  background-color: rgba(248, 249, 250, 0.9);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid var(--success-color);
  backdrop-filter: blur(5px);
}

.reservation-details p {
  margin-bottom: 10px;
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

.status.maintenance {
  background-color: #fff3cd;
  color: #856404;
}

.space:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

.space.occupied:hover,
.space.maintenance:hover {
  transform: none;
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

.space-filters {
  background-color: rgba(248, 249, 250, 0.9);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 25px;
  border: 2px solid rgba(76, 175, 80, 0.2);
  backdrop-filter: blur(5px);
}

.space-filters .filter-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.space-filters .input-group {
  flex: 1;
  min-width: 250px;
}

.space-filters label {
  color: var(--primary-color);
  font-weight: bold;
  font-size: 14px;
}

.space-filters select {
  border: 2px solid var(--border-color);
  border-radius: 6px;
  padding: 10px;
  font-size: 14px;
  background-color: white;
  transition: border-color 0.3s ease;
}

.space-filters select:focus {
  border-color: var(--success-color);
  outline: none;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
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

  .spaces-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }

  .space {
    width: 80px;
    height: 60px;
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

  .space-filters .filter-row {
    flex-direction: column;
  }
  
  .space-filters .input-group {
    min-width: 100%;
  }
}
</style>

<template>
  <div>
    <div class="header">
      <div class="header-with-logo">
        <img src="/images/logo-uleam.jpeg" alt="Logo ULEAM" class="logo-header">
        <h1>Gestión de Parqueaderos</h1>
      </div>
      <button @click="$router.push('/admin')" class="btn-secondary">Volver al Panel</button>
    </div>
    
    <div class="main-content">
      <!-- Resumen de Espacios -->
      <div class="summary-section">
        <h3>Resumen de Espacios</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <h4>Total de Espacios</h4>
            <span class="stat-number">{{ totalSpaces }}</span>
          </div>
          <div class="stat-card">
            <h4>Espacios Disponibles</h4>
            <span class="stat-number green">{{ availableSpaces }}</span>
          </div>
          <div class="stat-card">
            <h4>Espacios Ocupados</h4>
            <span class="stat-number" style="color: #dc3545;">{{ occupiedSpaces }}</span>
          </div>
          <div class="stat-card">
            <h4>En Mantenimiento</h4>
            <span class="stat-number" style="color: #ffc107;">{{ maintenanceSpaces }}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Zonas de Parqueo</h2>
        <button @click="showZoneModal = true" class="btn-primary">Agregar Nueva Zona</button>
        
        <table class="data-table">
          <thead>
            <tr>
              <th>Nombre de la Zona</th>
              <th>Tipo de Espacio</th>
              <th>Número de Espacios</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="zone in zones" :key="zone.id">
              <td>{{ zone.name }}</td>
              <td>{{ zone.type }}</td>
              <td>{{ zone.spaces }}</td>
              <td>
                <button @click="editZone(zone)" class="btn-secondary">Editar</button>
                <button @click="deleteZone(zone.id)" class="btn-danger">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="section">
        <h2>Espacios de Parqueo</h2>
        <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
          <button @click="showSpaceModal = true" class="btn-primary" style="width: auto;">
            Agregar Nuevo Espacio
          </button>
          <select v-model="statusFilter" style="padding: 10px; border-radius: 4px; border: 2px solid #ddd;">
            <option value="">Todos los estados</option>
            <option value="available">Disponibles</option>
            <option value="occupied">Ocupados</option>
            <option value="maintenance">En Mantenimiento</option>
          </select>
          <select v-model="zoneFilterAdmin" style="padding: 10px; border-radius: 4px; border: 2px solid #ddd;">
            <option value="">Todas las zonas</option>
            <option v-for="zone in zones" :key="zone.id" :value="zone.name">{{ zone.name }}</option>
          </select>
        </div>
        
        <table class="data-table">
          <thead>
            <tr>
              <th>Identificador</th>
              <th>Zona</th>
              <th>Tipo de Vehículo</th>
              <th>Estado</th>
              <th>Última Actualización</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="space in filteredParkingSpaces" :key="space.id">
              <td><strong>{{ space.identifier }}</strong></td>
              <td>{{ space.zone }}</td>
              <td>{{ space.vehicleType }}</td>
              <td>
                <span :class="['status', space.status]">
                  {{ getStatusText(space.status) }}
                </span>
              </td>
              <td>{{ formatDateTime(space.updatedAt) }}</td>
              <td>
                <button @click="editSpace(space)" class="btn-secondary">Editar</button>
                <button @click="toggleSpaceStatus(space)" class="btn-secondary" 
                        :style="{ backgroundColor: getToggleButtonColor(space.status) }">
                  {{ getToggleButtonText(space.status) }}
                </button>
                <button @click="deleteSpace(space.id)" class="btn-danger">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para formulario de zona -->
    <div v-if="showZoneModal" class="modal" style="display: block;">
      <div class="modal-content">
        <span class="close" @click="closeZoneModal">&times;</span>
        <h3>{{ editingZone ? 'Editar' : 'Agregar' }} Zona</h3>
        <form @submit.prevent="saveZone">
          <div class="input-group">
            <label for="zoneName">Nombre de la Zona:</label>
            <input type="text" id="zoneName" v-model="zoneForm.name" required placeholder="Ejemplo: Zona A" maxlength="7">
          </div>
          <div class="input-group">
            <label for="zoneType">Tipo de Espacio:</label>
            <select id="zoneType" v-model="zoneForm.type">
              <option value="Auto">Auto</option>
              <option value="Motocicleta">Motocicleta</option>
              <option value="Vehículo Pesado">Vehículo Pesado</option>
            </select>
          </div>
          <div class="input-group">
            <label for="zoneSpaces">Número de Espacios:</label>
            <input type="number" id="zoneSpaces" v-model="zoneForm.spaces">
          </div>
          <button type="submit" class="btn-primary">Guardar Zona</button>
          <button type="button" @click="closeZoneModal" class="btn-secondary">Cancelar</button>
        </form>
      </div>
    </div>

    <!-- Modal para formulario de espacio -->
    <div v-if="showSpaceModal" class="modal" style="display: block;">
      <div class="modal-content">
        <span class="close" @click="closeSpaceModal">&times;</span>
        <h3>{{ editingSpace ? 'Editar' : 'Agregar' }} Espacio</h3>
        <form @submit.prevent="saveSpace">
          <div class="input-group">
            <label for="spaceId">Identificador del Espacio:</label>
            <input type="text" id="spaceId" v-model="spaceForm.identifier" placeholder="Ej: A-01, B-23" required maxlength="5">
          </div>
          <div class="input-group">
            <label for="spaceZone">Seleccionar Zona:</label>
            <select id="spaceZone" v-model="spaceForm.zone" required>
              <option value="">Seleccione una zona</option>
              <option v-for="zone in zones" :key="zone.id" :value="zone.name">
                {{ zone.name }}
              </option>
            </select>
          </div>
          <div class="input-group">
            <label for="vehicleType">Tipo de Vehículo:</label>
            <select id="vehicleType" v-model="spaceForm.vehicleType">
              <option value="Auto">Auto</option>
              <option value="Motocicleta">Motocicleta</option>
              <option value="Vehículo Pesado">Vehículo Pesado</option>
            </select>
          </div>
          <div class="input-group">
            <label for="spaceStatus">Estado:</label>
            <select id="spaceStatus" v-model="spaceForm.status">
              <option value="available">Disponible</option>
              <option value="occupied">Ocupado</option>
              <option value="maintenance">En Mantenimiento</option>
            </select>
          </div>
          <button type="submit" class="btn-primary">Guardar Espacio</button>
          <button type="button" @click="closeSpaceModal" class="btn-secondary">Cancelar</button>
        </form>
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

const showZoneModal = ref(false)
const showSpaceModal = ref(false)
const editingZone = ref(null)
const editingSpace = ref(null)
const statusFilter = ref('')
const zoneFilterAdmin = ref('')

const zones = ref([
  { id: 1, name: 'Zona A', type: 'Auto', spaces: 12 },
  { id: 2, name: 'Zona B', type: 'Motocicleta', spaces: 8 },
  { id: 3, name: 'Zona C', type: 'Vehículo Pesado', spaces: 4 }
])

const parkingSpaces = ref([])

const zoneForm = reactive({
  name: '',
  type: 'Auto',
  spaces: 1
})

const spaceForm = reactive({
  identifier: '',
  zone: '',
  vehicleType: 'Auto',
  status: 'available'
})

// Computed properties para estadísticas
const totalSpaces = computed(() => parkingSpaces.value.length)
const availableSpaces = computed(() => parkingSpaces.value.filter(s => s.status === 'available').length)
const occupiedSpaces = computed(() => parkingSpaces.value.filter(s => s.status === 'occupied').length)
const maintenanceSpaces = computed(() => parkingSpaces.value.filter(s => s.status === 'maintenance').length)

const filteredParkingSpaces = computed(() => {
  let filtered = parkingSpaces.value

  if (statusFilter.value) {
    filtered = filtered.filter(space => space.status === statusFilter.value)
  }

  if (zoneFilterAdmin.value) {
    filtered = filtered.filter(space => space.zone === zoneFilterAdmin.value)
  }

  return filtered.sort((a, b) => a.identifier.localeCompare(b.identifier))
})

const getStatusText = (status) => {
  const statusMap = {
    available: 'Disponible',
    occupied: 'Ocupado',
    maintenance: 'En Mantenimiento'
  }
  return statusMap[status] || status
}

const getToggleButtonText = (status) => {
  const textMap = {
    available: 'Marcar Ocupado',
    occupied: 'Marcar Disponible',
    maintenance: 'Marcar Disponible'
  }
  return textMap[status] || 'Cambiar Estado'
}

const getToggleButtonColor = (status) => {
  const colorMap = {
    available: '#dc3545',
    occupied: '#28a745',
    maintenance: '#28a745'
  }
  return colorMap[status] || '#6c757d'
}

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A'
  const date = new Date(dateTimeString)
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const toggleSpaceStatus = (space) => {
  const newStatus = space.status === 'available' ? 'occupied' : 'available'
  space.status = newStatus
  space.updatedAt = new Date().toISOString()
  saveParkingSpaces()
  alert(`Estado del espacio ${space.identifier} cambiado a: ${getStatusText(newStatus)}`)
}

const editZone = (zone) => {
  editingZone.value = zone
  Object.assign(zoneForm, zone)
  showZoneModal.value = true
}

const saveZone = () => {
  // Validación del nombre de la zona
  const zoneNamePattern = /^Zona [A-Za-z]$/
  if (!zoneNamePattern.test(zoneForm.name)) {
    alert('El nombre de la zona debe tener el formato "Zona X" donde X es una sola letra (ejemplo: Zona A, Zona B)')
    return
  }

  // Validación para evitar zonas duplicadas
  const duplicateZone = zones.value.find(z => 
    z.name.toLowerCase() === zoneForm.name.toLowerCase() &&
    (!editingZone.value || z.id !== editingZone.value.id)
  )

  if (duplicateZone) {
    alert('Ya existe una zona con este nombre. Por favor elija un nombre diferente.')
    return
  }

  // Validación del número máximo de espacios
  if (zoneForm.spaces > 75) {
    alert('El número máximo de espacios por zona es 75')
    return
  }

  if (zoneForm.spaces < 1) {
    alert('El número mínimo de espacios por zona es 1')
    return
  }

  if (editingZone.value) {
    const index = zones.value.findIndex(z => z.id === editingZone.value.id)
    if (index !== -1) {
      zones.value[index] = { ...zones.value[index], ...zoneForm }
    }
    alert('Zona actualizada exitosamente')
  } else {
    const newZone = {
      id: Date.now(),
      ...zoneForm
    }
    zones.value.push(newZone)
    alert('Zona creada exitosamente')
  }
  saveZones()
  closeZoneModal()
}

const deleteZone = (zoneId) => {
  if (confirm('¿Está seguro que desea eliminar esta zona?')) {
    const index = zones.value.findIndex(z => z.id === zoneId)
    if (index !== -1) {
      zones.value.splice(index, 1)
      saveZones()
      alert('Zona eliminada exitosamente')
    }
  }
}

const closeZoneModal = () => {
  showZoneModal.value = false
  editingZone.value = null
  Object.assign(zoneForm, { name: '', type: 'Auto', spaces: 1 })
}

const editSpace = (space) => {
  editingSpace.value = space
  Object.assign(spaceForm, space)
  showSpaceModal.value = true
}

const saveSpace = () => {
  // Validación del identificador del espacio - formato: Letra mayúscula - dos números (ej: A-01, B-23)
  const spaceIdPattern = /^[A-Z]-\d{2}$/
  if (!spaceIdPattern.test(spaceForm.identifier)) {
    alert('El identificador del espacio debe tener el formato: Letra mayúscula seguida de guión y dos números (ejemplo: A-01, B-23, C-15)')
    return
  }

  // Verificar que no exista otro espacio con el mismo identificador (excluyendo el actual si está editando)
  const duplicateSpace = parkingSpaces.value.find(s => 
    s.identifier === spaceForm.identifier &&
    (!editingSpace.value || s.id !== editingSpace.value.id)
  )

  if (duplicateSpace) {
    alert('Ya existe un espacio con este identificador')
    return
  }

  if (editingSpace.value) {
    const index = parkingSpaces.value.findIndex(s => s.id === editingSpace.value.id)
    if (index !== -1) {
      parkingSpaces.value[index] = { 
        ...parkingSpaces.value[index], 
        ...spaceForm,
        updatedAt: new Date().toISOString()
      }
    }
    alert('Espacio actualizado exitosamente')
  } else {
    const newSpace = {
      id: Date.now(),
      ...spaceForm,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    parkingSpaces.value.push(newSpace)
    alert('Espacio creado exitosamente')
  }
  saveParkingSpaces()
  closeSpaceModal()
}

const deleteSpace = (spaceId) => {
  if (confirm('¿Está seguro que desea eliminar este espacio?')) {
    const index = parkingSpaces.value.findIndex(s => s.id === spaceId)
    if (index !== -1) {
      parkingSpaces.value.splice(index, 1)
      saveParkingSpaces()
      alert('Espacio eliminado exitosamente')
    }
  }
}

const closeSpaceModal = () => {
  showSpaceModal.value = false
  editingSpace.value = null
  Object.assign(spaceForm, { identifier: '', zone: '', vehicleType: 'Auto', status: 'available' })
}

const saveZones = () => {
  localStorage.setItem('parkingZones', JSON.stringify(zones.value))
}

const saveParkingSpaces = () => {
  localStorage.setItem('parkingSpaces', JSON.stringify(parkingSpaces.value))
}

const loadData = () => {
  // Cargar zonas
  const savedZones = localStorage.getItem('parkingZones')
  if (savedZones) {
    zones.value = JSON.parse(savedZones)
  }

  // Cargar espacios
  const savedSpaces = localStorage.getItem('parkingSpaces')
  if (savedSpaces) {
    parkingSpaces.value = JSON.parse(savedSpaces)
  } else {
    // Datos iniciales si no hay espacios guardados
    parkingSpaces.value = [
      { id: 1, identifier: 'A-01', zone: 'Zona A', vehicleType: 'Auto', status: 'available', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 2, identifier: 'A-02', zone: 'Zona A', vehicleType: 'Auto', status: 'occupied', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 3, identifier: 'B-01', zone: 'Zona B', vehicleType: 'Motocicleta', status: 'available', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 4, identifier: 'C-01', zone: 'Zona C', vehicleType: 'Vehículo Pesado', status: 'maintenance', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ]
    saveParkingSpaces()
  }
}

onMounted(() => {
  loadData()
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

.status.active {
  background-color: #d1ecf1;
  color: #0c5460;
}

.status.completed {
  background-color: #d4edda;
  color: #155724;
}

.status.cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.status.pending {
  background-color: #fff3cd;
  color: #856404;
}

/* Estilos simples para modal con scroll */
.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  overflow-y: auto;
  backdrop-filter: blur(3px);
}

.modal-content {
  background-color: rgba(255, 255, 255, 0.95);
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  min-height: 200px;
  max-height: 90vh;
  overflow-y: auto;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  position: sticky;
  top: 0;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 1001;
}

.close:hover {
  color: black;
}

.modal-content form {
  margin-top: 10px;
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

  .modal-content {
    margin: 10px;
    width: calc(100% - 20px);
    max-height: 95vh;
  }
}
</style>

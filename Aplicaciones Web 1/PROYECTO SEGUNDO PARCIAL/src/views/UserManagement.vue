<template>
  <div>
    <div class="header">
      <div class="header-with-logo">
        <img src="/images/logo-uleam.jpeg" alt="Logo ULEAM" class="logo-header">
        <h1>Gestión de Usuarios</h1>
      </div>
      <button @click="$router.push('/admin')" class="btn-secondary">Volver al Panel</button>
    </div>
    
    <div class="main-content">
      <!-- Resumen de Usuarios -->
      <div class="summary-section">
        <h3>Resumen de Usuarios</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <h4>Total de Usuarios</h4>
            <span class="stat-number">{{ totalUsers }}</span>
          </div>
          <div class="stat-card">
            <h4>Usuarios Activos</h4>
            <span class="stat-number green">{{ activeUsers }}</span>
          </div>
          <div class="stat-card">
            <h4>Usuarios Inactivos</h4>
            <span class="stat-number" style="color: #dc3545;">{{ inactiveUsers }}</span>
          </div>
        </div>
      </div>

      <div class="search-section">
        <input 
          type="text" 
          v-model="searchTerm"
          placeholder="Buscar usuarios..." 
          class="search-input"
        >
        <button @click="showUserModal = true" class="btn-primary">
          Registrar Nuevo Usuario
        </button>
      </div>
      
      <div class="section">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Cédula</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>{{ user.nombres }}</td>
              <td>{{ user.cedula }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span :class="['status', user.isActive ? 'active' : 'cancelled']">
                  {{ user.isActive ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>{{ formatDate(user.registeredAt) }}</td>
              <td>
                <button @click="editUser(user)" class="btn-secondary">Editar</button>
                <button 
                  @click="toggleUserStatus(user)" 
                  :class="user.isActive ? 'btn-danger' : 'btn-primary'"
                  style="font-size: 12px; padding: 8px 12px;"
                >
                  {{ user.isActive ? 'Desactivar' : 'Activar' }}
                </button>
                <button @click="deleteUser(user.id)" class="btn-danger">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para formulario de usuario -->
    <div v-if="showUserModal" class="modal" style="display: block;">
      <div class="modal-content">
        <span class="close" @click="closeUserModal">&times;</span>
        <h3>{{ editingUser ? 'Editar' : 'Registrar' }} Usuario</h3>
        <form @submit.prevent="saveUser">
          <div class="input-group">
            <label for="userNames">Nombres y Apellidos:</label>
            <input type="text" id="userNames" v-model="userForm.nombres" required>
          </div>
          <div class="input-group">
            <label for="userCedula">Cédula:</label>
            <input type="text" id="userCedula" v-model="userForm.cedula" required>
          </div>
          <div class="input-group">
            <label for="userEmail">Email:</label>
            <input type="email" id="userEmail" v-model="userForm.email" required>
          </div>
          <div class="input-group">
            <label for="userPassword">Contraseña:</label>
            <input type="text" id="userPassword" v-model="userForm.password" required placeholder="Ingrese la contraseña">
          </div>
          <div class="input-group">
            <label for="userConfirmPassword">Confirmar Contraseña:</label>
            <input type="text" id="userConfirmPassword" v-model="userForm.confirmPassword" required placeholder="Confirme la contraseña">
          </div>
          <div class="input-group">
            <label for="userStatus">Estado:</label>
            <select id="userStatus" v-model="userForm.isActive">
              <option :value="true">Activo</option>
              <option :value="false">Inactivo</option>
            </select>
          </div>
          <button type="submit" class="btn-primary">Guardar Usuario</button>
          <button type="button" @click="closeUserModal" class="btn-secondary">Cancelar</button>
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
import { useValidation } from '../composables/useValidation'

const { validateUser } = useValidation()

const searchTerm = ref('')
const showUserModal = ref(false)
const editingUser = ref(null)
const users = ref([])

const userForm = reactive({
  nombres: '',
  cedula: '',
  email: '',
  password: '',
  confirmPassword: '',
  isActive: true
})

// Computed properties para estadísticas
const totalUsers = computed(() => users.value.length)
const activeUsers = computed(() => users.value.filter(u => u.isActive).length)
const inactiveUsers = computed(() => users.value.filter(u => !u.isActive).length)

const filteredUsers = computed(() => {
  if (!searchTerm.value) return users.value
  
  const term = searchTerm.value.toLowerCase()
  return users.value.filter(user => 
    user.nombres.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term) ||
    user.cedula.includes(term)
  )
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const toggleUserStatus = (user) => {
  const action = user.isActive ? 'desactivar' : 'activar'
  if (confirm(`¿Está seguro que desea ${action} al usuario ${user.nombres}?`)) {
    user.isActive = !user.isActive
    saveUsers()
    alert(`Usuario ${user.isActive ? 'activado' : 'desactivado'} exitosamente`)
  }
}

const editUser = (user) => {
  editingUser.value = user
  Object.assign(userForm, {
    nombres: user.nombres,
    cedula: user.cedula,
    email: user.email,
    password: user.password, // Ahora se muestra la contraseña actual
    confirmPassword: user.password, // Se pre-llena con la contraseña actual
    isActive: user.isActive
  })
  showUserModal.value = true
}

const saveUser = () => {
  // Debug: Verificar que todos los campos tengan valores
  console.log('Datos del formulario:', userForm)
  
  if (!validateUser(userForm)) {
    return
  }

  // Verificar duplicados (excluyendo el usuario actual si está editando)
  const duplicateUser = users.value.find(u => 
    (u.email === userForm.email || u.cedula === userForm.cedula) &&
    (!editingUser.value || u.id !== editingUser.value.id)
  )

  if (duplicateUser) {
    alert('Ya existe un usuario con este email o cédula')
    return
  }

  if (editingUser.value) {
    // Editar usuario existente
    const index = users.value.findIndex(u => u.id === editingUser.value.id)
    if (index !== -1) {
      users.value[index] = {
        ...users.value[index],
        nombres: userForm.nombres,
        cedula: userForm.cedula,
        email: userForm.email,
        password: userForm.password,
        isActive: userForm.isActive,
        updatedAt: new Date().toISOString()
      }
    }
    alert('Usuario actualizado exitosamente')
  } else {
    // Crear nuevo usuario
    const newUser = {
      id: Date.now(),
      nombres: userForm.nombres,
      cedula: userForm.cedula,
      email: userForm.email,
      password: userForm.password,
      role: 'user',
      isActive: userForm.isActive,
      registeredAt: new Date().toISOString()
    }
    users.value.push(newUser)
    
    // Crear estructura de datos personal para el usuario
    const userDataKey = `userData_${newUser.id}`
    const userData = {
      reservations: [],
      profile: {
        nombres: newUser.nombres,
        cedula: newUser.cedula,
        email: newUser.email
      }
    }
    localStorage.setItem(userDataKey, JSON.stringify(userData))
    
    alert('Usuario creado exitosamente')
  }

  saveUsers()
  closeUserModal()
}

const deleteUser = (userId) => {
  if (confirm('¿Está seguro que desea eliminar este usuario? Esta acción no se puede deshacer.')) {
    const index = users.value.findIndex(u => u.id === userId)
    if (index !== -1) {
      // Eliminar datos personales del usuario
      localStorage.removeItem(`userData_${userId}`)
      
      users.value.splice(index, 1)
      saveUsers()
      alert('Usuario eliminado exitosamente')
    }
  }
}

const closeUserModal = () => {
  showUserModal.value = false
  editingUser.value = null
  Object.assign(userForm, {
    nombres: '',
    cedula: '',
    email: '',
    password: '',
    confirmPassword: '',
    isActive: true
  })
}

const saveUsers = () => {
  localStorage.setItem('registeredUsers', JSON.stringify(users.value))
}

const loadUsers = () => {
  const savedUsers = localStorage.getItem('registeredUsers')
  if (savedUsers) {
    users.value = JSON.parse(savedUsers)
  }
}

onMounted(() => {
  loadUsers()
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

  .modal-content {
    margin: 10px;
    width: calc(100% - 20px);
    max-height: 95vh;
  }
}
</style>

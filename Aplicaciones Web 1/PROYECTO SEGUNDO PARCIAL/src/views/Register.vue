<template>
  <div class="container">
    <div class="register-box">
      <img src="/images/logo-uleam.jpeg" alt="Logo ULEAM" class="login-logo">
      <h1>Sistema de Parqueaderos ULEAM</h1>
      <h2>Registro de Usuario</h2>
      <form @submit.prevent="handleRegister">
        <div class="input-group">
          <label for="nombres">Nombres y Apellidos:</label>
          <input 
            type="text" 
            id="nombres" 
            v-model="registerForm.nombres" 
            required
          >
        </div>
        <div class="input-group">
          <label for="cedula">Cédula:</label>
          <input 
            type="text" 
            id="cedula" 
            v-model="registerForm.cedula" 
            required
          >
        </div>
        <div class="input-group">
          <label for="email">Email Institucional:</label>
          <input 
            type="email" 
            id="email" 
            v-model="registerForm.email" 
            required
          >
        </div>
        <div class="input-group">
          <label for="password">Contraseña:</label>
          <input 
            type="password" 
            id="password" 
            v-model="registerForm.password" 
            required
          >
        </div>
        <div class="input-group">
          <label for="confirmPassword">Confirmar Contraseña:</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="registerForm.confirmPassword" 
            required
          >
        </div>
        <button type="submit" class="btn-primary">Registrarse</button>
      </form>
      <div class="links">
        <router-link to="/login">¿Ya tienes cuenta? Inicia Sesión</router-link>
      </div>
    </div>
  </div>
<!-- Footer Simple -->
    <footer class="home-footer">
      <p>&copy; 2024 Universidad Laica Eloy Alfaro de Manabí - Sistema de Parqueaderos</p>
    </footer>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useValidation } from '../composables/useValidation'

const router = useRouter()
const { validateRegister } = useValidation()

const registerForm = reactive({
  nombres: '',
  cedula: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const handleRegister = () => {
  if (!validateRegister(registerForm)) {
    return
  }

  // Verificar si el usuario ya existe
  const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
  
  const userExists = existingUsers.some(user => 
    user.email === registerForm.email || user.cedula === registerForm.cedula
  )

  if (userExists) {
    alert('Ya existe un usuario registrado con este email o cédula')
    return
  }

  // Crear nuevo usuario
  const newUser = {
    id: Date.now(),
    nombres: registerForm.nombres,
    cedula: registerForm.cedula,
    email: registerForm.email,
    password: registerForm.password,
    role: 'user',
    registeredAt: new Date().toISOString(),
    isActive: true
  }

  // Agregar usuario a la lista
  existingUsers.push(newUser)
  localStorage.setItem('registeredUsers', JSON.stringify(existingUsers))

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

  alert('¡Registro exitoso! Ahora puedes iniciar sesión con tus credenciales.')
  router.push('/login')
}
</script>

<style scoped>
/* Estilos específicos para login y registro */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, rgba(45, 90, 39, 0.8), rgba(76, 175, 80, 0.6)),
    url("https://www.epmmop.gob.ec/wp-content/uploads/2024/04/FOTO_5-2-1024x683.jpg") center / cover;
  position: relative;
}

.container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.register-box {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.register-box h1 {
  text-align: center;
  color: #2d5a27;
  margin-bottom: 10px;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.register-box h2 {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  font-size: 18px;
}

.login-logo {
  display: block;
  margin: 0 auto 20px auto;
  max-height: 100px;
  width: auto;
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

.input-group input {
  width: 100%;
  padding: 10px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  font-size: 16px;
  background-color: rgba(255, 255, 255, 0.9);
}

.input-group input:focus {
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

.links {
  text-align: center;
}

.links a {
  color: #4caf50;
  text-decoration: none;
  display: block;
  margin: 10px 0;
  font-weight: 500;
}

.links a:hover {
  text-decoration: underline;
  color: var(--primary-color);
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
  .login-logo {
    max-height: 80px;
  }

  .register-box {
    padding: 30px 20px;
    margin: 10px;
  }
}
</style>

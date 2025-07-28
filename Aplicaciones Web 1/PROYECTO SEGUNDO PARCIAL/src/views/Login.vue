<template>
  <div class="container">
    <div class="login-box">
      <img src="/images/logo-uleam.jpeg" alt="Logo ULEAM" class="login-logo">
      <h1>Sistema de Parqueaderos ULEAM</h1>
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            v-model="loginForm.email" 
            required 
            placeholder="Ingrese su email"
          >
        </div>
        <div class="input-group">
          <label for="password">Contraseña:</label>
          <input 
            type="password" 
            id="password" 
            v-model="loginForm.password" 
            required 
            placeholder="Ingrese su contraseña"
          >
        </div>
        <button type="submit" class="btn-primary">Iniciar Sesión</button>
      </form>
      <div class="links">
        <router-link to="/register">¿No tienes cuenta? Regístrate</router-link>
        <router-link to="/">Volver al Inicio</router-link>
      </div>
      
      <!-- Credenciales de prueba -->
      <div style="margin-top: 20px; padding: 10px; background-color: #f8f9fa; border-radius: 5px; text-align: center;">
        <p style="font-weight: bold; margin-bottom: 5px;">Credenciales de administrador:</p>
        <p><strong>Admin:</strong> admin@live.uleam.edu.ec / admin123</p>
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
const { validateLogin } = useValidation()

const loginForm = reactive({
  email: '',
  password: ''
})

const handleLogin = () => {
  // Verificar credenciales de administrador (hardcoded)
  if (loginForm.email === 'admin@live.uleam.edu.ec' && loginForm.password === 'admin123') {
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('userRole', 'admin')
    localStorage.setItem('userName', 'Administrador')
    localStorage.setItem('userEmail', 'admin@live.uleam.edu.ec')
    alert('Login exitoso como Administrador')
    router.push('/admin')
    return
  }

  // Verificar usuarios registrados
  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
  const user = registeredUsers.find(u => 
    u.email === loginForm.email && 
    u.password === loginForm.password && 
    u.isActive
  )

  if (user) {
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('userRole', 'user')
    localStorage.setItem('userName', user.nombres)
    localStorage.setItem('userEmail', user.email)
    localStorage.setItem('userId', user.id.toString())
    alert(`¡Bienvenido ${user.nombres}!`)
    router.push('/user')
  } else {
    alert('Credenciales incorrectas o usuario inactivo. Por favor intente nuevamente.')
  }
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

.login-box {
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

.login-box h1 {
  text-align: center;
  color: #2d5a27;
  margin-bottom: 10px;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-box h2 {
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

  .login-box {
    padding: 30px 20px;
    margin: 10px;
  }
}
</style>

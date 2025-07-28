import { ref } from 'vue'

export function useAuthStore() {
  const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')
  const userRole = ref(localStorage.getItem('userRole') || '')
  const userName = ref(localStorage.getItem('userName') || '')

  const login = (email, password, role, name) => {
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('userRole', role)
    localStorage.setItem('userName', name)
    
    isAuthenticated.value = true
    userRole.value = role
    userName.value = name
  }

  const logout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userName')
    
    isAuthenticated.value = false
    userRole.value = ''
    userName.value = ''
  }

  return {
    isAuthenticated,
    userRole,
    userName,
    login,
    logout
  }
}
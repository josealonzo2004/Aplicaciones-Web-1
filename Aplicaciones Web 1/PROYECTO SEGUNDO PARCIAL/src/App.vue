<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { provide } from 'vue'
import { useAuthStore } from './composables/useAuth'

const authStore = useAuthStore()
provide('authStore', authStore)
</script>

<style>
/* Estilos base y reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

/* Variables CSS para colores consistentes */
:root {
  --primary-color: #2d5a27;
  --primary-hover: #45a049;
  --secondary-color: #6c757d;
  --secondary-hover: #5a6268;
  --danger-color: #dc3545;
  --danger-hover: #c82333;
  --success-color: #4caf50;
  --light-bg: #f8f9fa;
  --border-color: #ddd;
  --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Estilos para layout general */
body {
  background: linear-gradient(135deg, rgba(45, 90, 39, 0.8), rgba(76, 175, 80, 0.6)),
    url("https://www.epmmop.gob.ec/wp-content/uploads/2024/04/FOTO_5-2-1024x683.jpg") center / cover;
  background-attachment: fixed;
  min-height: 100vh;
}
</style>

// Archivo principal simplificado
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar el formulario de login
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  // Inicializar el formulario de búsqueda de espacios
  const searchForm = document.getElementById("searchForm")
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault()
      showAvailability()
    })
  }

  // Event listener para búsqueda en tiempo real
  const searchInput = document.getElementById("searchUser")
  if (searchInput) {
    searchInput.addEventListener("input", searchUsers)
  }
})

// Función simple de login
function handleLogin(e) {
  e.preventDefault()

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  // Validar credenciales específicas
  if (email === "admin@live.uleam.edu.ec" && password === "admin123") {
    alert("Login exitoso como Administrador")
    window.location.href = "panel-admin.html"
  } else if (email === "user@live.uleam.edu.ec" && password === "user123") {
    alert("Login exitoso como Usuario")
    window.location.href = "panel-usuario.html"
  } else {
    alert("Credenciales incorrectas. Por favor intente nuevamente.")
  }
}

// Función simple para cerrar sesión
function logout() {
  if (confirm("¿Está seguro que desea cerrar sesión?")) {
    window.location.href = "index.html"
  }
}

// Funciones para gestión de zonas - MODAL
function showAddZoneForm() {
  document.getElementById("zoneModal").style.display = "block"
}

function hideAddZoneForm() {
  document.getElementById("zoneModal").style.display = "none"
}

// Funciones para gestión de espacios - MODAL
function showAddSpaceForm() {
  document.getElementById("spaceModal").style.display = "block"
}

function hideAddSpaceForm() {
  document.getElementById("spaceModal").style.display = "none"
}

// Funciones para gestión de usuarios - MODAL
function showAddUserForm() {
  document.getElementById("userModal").style.display = "block"
}

function hideAddUserForm() {
  document.getElementById("userModal").style.display = "none"
}

// Funciones para reserva de espacios
function showAvailability() {
  // Simplemente mostrar la sección que ya existe en el HTML
  const availabilitySection = document.getElementById("availabilitySection")
  if (availabilitySection) {
    availabilitySection.style.display = "block"
    availabilitySection.scrollIntoView({ behavior: "smooth" })
  }
}

// Variables y funciones para selección de espacios
let selectedSpaceId = null

function selectSpace(spaceId) {
  // Remover selección anterior
  const previousSelected = document.querySelector(".space.selected")
  if (previousSelected) {
    previousSelected.classList.remove("selected")
  }

  // Seleccionar nuevo espacio
  const spaceElement = document.querySelector(`[onclick="selectSpace('${spaceId}')"]`)
  if (spaceElement) {
    spaceElement.classList.add("selected")
    selectedSpaceId = spaceId

    // Actualizar detalles de confirmación
    const selectedSpaceElement = document.getElementById("selectedSpace")
    const selectedDateElement = document.getElementById("selectedDate")
    const selectedStartTimeElement = document.getElementById("selectedStartTime")
    const selectedEndTimeElement = document.getElementById("selectedEndTime")
    const confirmationSection = document.getElementById("confirmationSection")

    if (
      selectedSpaceElement &&
      selectedDateElement &&
      selectedStartTimeElement &&
      selectedEndTimeElement &&
      confirmationSection
    ) {
      selectedSpaceElement.textContent = spaceId

      const reserveDate = document.getElementById("reserveDate")
      const startTime = document.getElementById("startTime")
      const endTime = document.getElementById("endTime")

      if (reserveDate) selectedDateElement.textContent = reserveDate.value
      if (startTime) selectedStartTimeElement.textContent = startTime.value
      if (endTime) selectedEndTimeElement.textContent = endTime.value

      confirmationSection.style.display = "block"
      confirmationSection.scrollIntoView({ behavior: "smooth" })
    }
  }
}

function confirmReservation() {
  if (selectedSpaceId) {
    alert(`Reserva confirmada para el espacio ${selectedSpaceId}`)
    window.location.href = "panel-usuario.html"
  }
}

function cancelSelection() {
  const selectedSpace = document.querySelector(".space.selected")
  if (selectedSpace) {
    selectedSpace.classList.remove("selected")
  }
  selectedSpaceId = null

  const confirmationSection = document.getElementById("confirmationSection")
  if (confirmationSection) {
    confirmationSection.style.display = "none"
  }
}

// Función para cancelar reservas
function cancelReservation() {
  if (confirm("¿Está seguro que desea cancelar esta reserva?")) {
    alert("Reserva cancelada exitosamente")
  }
}

// Funciones de búsqueda simple
function searchUsers() {
  const searchTerm = document.getElementById("searchUser").value.toLowerCase()
  const rows = document.querySelectorAll("#usersTable tr")

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase()
    if (text.includes(searchTerm)) {
      row.style.display = ""
    } else {
      row.style.display = "none"
    }
  })
}

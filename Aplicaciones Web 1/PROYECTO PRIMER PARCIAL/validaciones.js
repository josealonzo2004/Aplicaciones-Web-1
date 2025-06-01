// Función para validar el formulario de login
function validarLogin() {
  var email = document.getElementById("email").value
  var password = document.getElementById("password").value

  // Verificar que no estén vacíos
  if (email == "" || email == null) {
    alert("Por favor ingrese su email")
    return false
  }

  if (password == "" || password == null) {
    alert("Por favor ingrese su contraseña")
    return false
  }

  // Verificar que el email termine con @live.uleam.edu.ec
  if (!email.endsWith("@live.uleam.edu.ec")) {
    alert("Por favor ingrese un email válido con dominio @live.uleam.edu.ec")
    return false
  }

  return true
}

// Función para validar el formulario de registro
function validarRegistro() {
  var nombres = document.getElementById("nombres").value
  var cedula = document.getElementById("cedula").value
  var email = document.getElementById("email").value
  var password = document.getElementById("password").value
  var confirmPassword = document.getElementById("confirmPassword").value

  // Verificar que no estén vacíos
  if (nombres == "" || nombres == null) {
    alert("Por favor ingrese sus nombres y apellidos")
    return false
  }

  if (cedula == "" || cedula == null) {
    alert("Por favor ingrese su cédula")
    return false
  }

  if (email == "" || email == null) {
    alert("Por favor ingrese su email")
    return false
  }

  if (password == "" || password == null) {
    alert("Por favor ingrese su contraseña")
    return false
  }

  if (confirmPassword == "" || confirmPassword == null) {
    alert("Por favor confirme su contraseña")
    return false
  }

  // Verificar que la cédula tenga 10 dígitos
  if (cedula.length != 10) {
    alert("La cédula debe tener 10 dígitos")
    return false
  }

  // Verificar que la cédula solo tenga números
  if (isNaN(cedula)) {
    alert("La cédula solo debe contener números")
    return false
  }

  // Verificar que el email termine con @live.uleam.edu.ec
  if (!email.endsWith("@live.uleam.edu.ec")) {
    alert("Por favor ingrese un email válido con dominio @live.uleam.edu.ec")
    return false
  }

  // Verificar que las contraseñas coincidan
  if (password != confirmPassword) {
    alert("Las contraseñas no coinciden")
    return false
  }

  // Verificar que la contraseña tenga al menos 6 caracteres
  if (password.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres")
    return false
  }

  return true
}

// Función para validar el formulario de usuario (gestión de usuarios)
function validarUsuario() {
  var userNames = document.getElementById("userNames").value
  var userCedula = document.getElementById("userCedula").value
  var userEmail = document.getElementById("userEmail").value
  var userPassword = document.getElementById("userPassword").value
  var userConfirmPassword = document.getElementById("userConfirmPassword").value

  // Verificar que no estén vacíos
  if (userNames == "" || userNames == null) {
    alert("Por favor ingrese los nombres y apellidos")
    return false
  }

  if (userCedula == "" || userCedula == null) {
    alert("Por favor ingrese la cédula")
    return false
  }

  if (userEmail == "" || userEmail == null) {
    alert("Por favor ingrese el email")
    return false
  }

  if (userPassword == "" || userPassword == null) {
    alert("Por favor ingrese la contraseña")
    return false
  }

  if (userConfirmPassword == "" || userConfirmPassword == null) {
    alert("Por favor confirme la contraseña")
    return false
  }

  // Verificar que la cédula tenga 10 dígitos
  if (userCedula.length != 10) {
    alert("La cédula debe tener 10 dígitos")
    return false
  }

  // Verificar que la cédula solo tenga números
  if (isNaN(userCedula)) {
    alert("La cédula solo debe contener números")
    return false
  }

  // Verificar que el email termine con @live.uleam.edu.ec
  if (!userEmail.endsWith("@live.uleam.edu.ec")) {
    alert("Por favor ingrese un email válido con dominio @live.uleam.edu.ec")
    return false
  }

  // Verificar que las contraseñas coincidan
  if (userPassword != userConfirmPassword) {
    alert("Las contraseñas no coinciden")
    return false
  }

  // Verificar que la contraseña tenga al menos 6 caracteres
  if (userPassword.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres")
    return false
  }

  return true
}

// Función para validar el formulario de zona
function validarZona() {
  var zoneName = document.getElementById("zoneName").value
  var zoneSpaces = document.getElementById("zoneSpaces").value

  // Verificar que no estén vacíos
  if (zoneName == "" || zoneName == null) {
    alert("Por favor ingrese el nombre de la zona")
    return false
  }

  if (zoneSpaces == "" || zoneSpaces == null) {
    alert("Por favor ingrese el número de espacios")
    return false
  }

  // Verificar que el número de espacios sea un número
  if (isNaN(zoneSpaces)) {
    alert("El número de espacios debe ser un número")
    return false
  }

  // Verificar que el número de espacios sea mayor a 0
  if (zoneSpaces <= 0) {
    alert("El número de espacios debe ser mayor a 0")
    return false
  }

  return true
}

// Función para validar el formulario de espacio
function validarEspacio() {
  var spaceId = document.getElementById("spaceId").value

  // Verificar que no esté vacío
  if (spaceId == "" || spaceId == null) {
    alert("Por favor ingrese el identificador del espacio")
    return false
  }

  // Verificar que tenga el formato correcto (letra-número)
  if (spaceId.length < 3) {
    alert("El identificador debe tener al menos 3 caracteres (ejemplo: A-01)")
    return false
  }

  if (!spaceId.includes("-")) {
    alert("El identificador debe tener el formato: Letra-Número (ejemplo: A-01)")
    return false
  }

  return true
}

// Función para validar el formulario de reserva
function validarReserva() {
  var selectZone = document.getElementById("selectZone").value
  var reserveDate = document.getElementById("reserveDate").value
  var startTime = document.getElementById("startTime").value
  var endTime = document.getElementById("endTime").value

  // Verificar que no estén vacíos
  if (selectZone == "" || selectZone == null) {
    alert("Por favor seleccione una zona")
    return false
  }

  if (reserveDate == "" || reserveDate == null) {
    alert("Por favor seleccione una fecha")
    return false
  }

  if (startTime == "" || startTime == null) {
    alert("Por favor seleccione una hora de inicio")
    return false
  }

  if (endTime == "" || endTime == null) {
    alert("Por favor seleccione una hora de fin")
    return false
  }

  // Parsear la fecha para evitar desfase por zona horaria
  var partesFecha = reserveDate.split("-")
  var fechaSeleccionada = new Date(partesFecha[0], partesFecha[1] - 1, partesFecha[2])

  var fechaHoy = new Date()
  fechaHoy.setHours(0, 0, 0, 0)

  var fechaMaxima = new Date(fechaHoy)
  fechaMaxima.setDate(fechaHoy.getDate() + 5)

  // Validar fecha: puede ser hoy o mayor, pero no mayor a 5 días desde hoy
  if (fechaSeleccionada < fechaHoy) {
    alert("No puede seleccionar una fecha anterior a la de hoy")
    return false
  }

  if (fechaSeleccionada > fechaMaxima) {
    alert("No puede seleccionar una fecha mayor a 5 días desde hoy")
    return false
  }

  // Validar horas
  var horaInicio = startTime.split(":")
  var horaFin = endTime.split(":")
  var horaInicioMinutos = Number.parseInt(horaInicio[0]) * 60 + Number.parseInt(horaInicio[1])
  var horaFinMinutos = Number.parseInt(horaFin[0]) * 60 + Number.parseInt(horaFin[1])

  // Verificar que la hora de fin sea mayor que la de inicio
  if (horaFinMinutos <= horaInicioMinutos) {
    alert("La hora de fin debe ser mayor que la hora de inicio")
    return false
  }

  // Si es hoy, verificar que la hora de inicio no sea menor que la actual
  var fechaHoyCompleta = new Date()
  if (fechaSeleccionada.getTime() === fechaHoy.getTime()) {
    var horaActual = fechaHoyCompleta.getHours() * 60 + fechaHoyCompleta.getMinutes()
    if (horaInicioMinutos < horaActual) {
      alert("La hora de inicio no puede ser menor que la hora actual")
      return false
    }
  }

  return true
}


// Función para agregar las validaciones a los formularios cuando la página carga
document.addEventListener("DOMContentLoaded", () => {
  // Validación para el formulario de login
  var loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      if (!validarLogin()) {
        e.preventDefault()
      }
    })
  }

  // Validación para el formulario de registro
  var registerForm = document.getElementById("registerForm")
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      if (!validarRegistro()) {
        e.preventDefault()
      }
    })
  }

  // Validación para el formulario de usuario en el modal
  var userModal = document.getElementById("userModal")
  if (userModal) {
    var userForm = userModal.querySelector("form")
    if (userForm) {
      userForm.addEventListener("submit", (e) => {
        if (!validarUsuario()) {
          e.preventDefault()
        }
      })
    }
  }

  // Validación para el formulario de zona en el modal
  var zoneModal = document.getElementById("zoneModal")
  if (zoneModal) {
    var zoneForm = zoneModal.querySelector("form")
    if (zoneForm) {
      zoneForm.addEventListener("submit", (e) => {
        if (!validarZona()) {
          e.preventDefault()
        }
      })
    }
  }

  // Validación para el formulario de espacio en el modal
  var spaceModal = document.getElementById("spaceModal")
  if (spaceModal) {
    var spaceForm = spaceModal.querySelector("form")
    if (spaceForm) {
      spaceForm.addEventListener("submit", (e) => {
        if (!validarEspacio()) {
          e.preventDefault()
        }
      })
    }
  }

  // Validación para el formulario de búsqueda de reserva
  var searchForm = document.getElementById("searchForm")
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      if (!validarReserva()) {
        e.preventDefault()
      }
    })
  }
})

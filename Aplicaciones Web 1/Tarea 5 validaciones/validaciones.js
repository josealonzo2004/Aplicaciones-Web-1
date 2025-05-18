document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector("form")

  formulario.addEventListener("submit", (event) => {
    const errores = []

    // Obtener valores de los campos
    const nombre = document.querySelector('input[placeholder="Ingrese nombre"]').value.trim()
    const apellido = document.querySelector('input[placeholder="Ingrese apellido"]').value.trim()
    const fechaNacimiento = document.querySelector('input[type="date"]').value
    const genero = document.querySelector("#genero").value
    const email = document.querySelector('input[type="email"]').value.trim()
    const telefono = document.querySelector('input[placeholder="Ingrese teléfono"]').value.trim()
    const direccion = document.querySelector('input[placeholder="Calle, número, piso, etc."]').value.trim()
    const ciudad = document.querySelector('input[placeholder="Ingrese ciudad"]').value.trim()
    const pais = document.querySelector('input[placeholder="Ingrese país"]').value.trim()

    // Validar Nombre y Apellido (solo letras y espacios)
    if (nombre === "" || !/^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]+$/.test(nombre)) {
      errores.push("El nombre solo debe contener letras y espacios")
    }

    if (apellido === "" || !/^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]+$/.test(apellido)) {
      errores.push("El apellido solo debe contener letras y espacios")
    }

    // Validar Fecha de Nacimiento (mayor de 18 años)
    if (fechaNacimiento === "") {
      errores.push("La fecha de nacimiento es obligatoria")
    } else {
      const fechaNac = new Date(fechaNacimiento)
      const hoy = new Date()
      let edad = hoy.getFullYear() - fechaNac.getFullYear()
      const mes = hoy.getMonth() - fechaNac.getMonth()

      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--
      }

      if (edad < 18) {
        errores.push("Debes ser mayor de 18 años")
      }
    }

    // Validar Género (que se haya seleccionado una opción)
    if (genero === "") {
      errores.push("Debes seleccionar un género")
    }

    // Validar Email (obligatorio y formato válido)
    if (email === "") {
      errores.push("El email es obligatorio")
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
      errores.push("Formato de email no válido")
    }

    // Validar Teléfono (solo números y mínimo 7 dígitos)
    const telefonoNumeros = telefono.replace(/\D/g, "")
    if (telefono === "") {
      errores.push("El teléfono es obligatorio")
    } else if (telefonoNumeros.length < 7) {
      errores.push("El teléfono debe tener al menos 7 dígitos")
    }

    // Validar Dirección (mínimo 5 caracteres)
    if (direccion === "" || direccion.length < 5) {
      errores.push("La dirección debe tener al menos 5 caracteres")
    }

    // Validar Ciudad y País (solo letras y espacios)
    if (ciudad === "" || !/^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]+$/.test(ciudad)) {
      errores.push("La ciudad solo debe contener letras y espacios")
    }

    if (pais === "" || !/^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]+$/.test(pais)) {
      errores.push("El país solo debe contener letras y espacios")
    }

    // Si hay errores, mostrarlos y detener el envío
    if (errores.length > 0) {
      event.preventDefault()
      alert("Errores:\n\n- " + errores.join("\n- "))
    }
  })
})

export function useValidation() {
  const validateLogin = (email, password) => {
    if (!email || !password) {
      alert('Por favor complete todos los campos')
      return false
    }

    if (!email.endsWith('@live.uleam.edu.ec')) {
      alert('Por favor ingrese un email válido con dominio @live.uleam.edu.ec')
      return false
    }

    return true
  }

  const validateRegister = (form) => {
    if (!form.nombres || !form.cedula || !form.email || !form.password || !form.confirmPassword) {
      alert('Por favor complete todos los campos')
      return false
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.nombres)) {
      alert('El campo de nombres y apellidos solo debe contener letras')
      return false
    }

    if (form.cedula.length !== 10 || isNaN(form.cedula)) {
      alert('La cédula debe tener 10 dígitos numéricos')
      return false
    }

    if (!form.email.endsWith('@live.uleam.edu.ec')) {
      alert('Por favor ingrese un email válido con dominio @live.uleam.edu.ec')
      return false
    }

    if (form.password !== form.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return false
    }

    if (form.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres')
      return false
    }

    return true
  }

  const validateUser = (form) => {
    if (!form.nombres || !form.cedula || !form.email || !form.password || !form.confirmPassword) {
      alert('Por favor complete todos los campos')
      return false
    }

    // Validar que nombres solo contenga letras y espacios
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.nombres)) {
      alert('El campo de nombres y apellidos solo debe contener letras')
      return false
    }

    if (form.cedula.length !== 10 || isNaN(form.cedula)) {
      alert('La cédula debe tener 10 dígitos numéricos')
      return false
    }

    if (!form.email.endsWith('@live.uleam.edu.ec')) {
      alert('Por favor ingrese un email válido con dominio @live.uleam.edu.ec')
      return false
    }

    if (form.password !== form.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return false
    }

    if (form.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres')
      return false
    }

    return true
  }

  const validateReservation = (form) => {
    if (!form.zone || !form.date || !form.startTime || !form.endTime) {
      alert('Por favor complete todos los campos')
      return false
    }

    const selectedDate = new Date(form.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const maxDate = new Date(today)
    maxDate.setDate(today.getDate() + 5)

    if (selectedDate < today) {
      alert('No puede seleccionar una fecha anterior a la de hoy')
      return false
    }

    if (selectedDate > maxDate) {
      alert('No puede seleccionar una fecha mayor a 5 días desde hoy')
      return false
    }

    const startTime = form.startTime.split(':')
    const endTime = form.endTime.split(':')
    const startMinutes = parseInt(startTime[0]) * 60 + parseInt(startTime[1])
    const endMinutes = parseInt(endTime[0]) * 60 + parseInt(endTime[1])

    if (endMinutes <= startMinutes) {
      alert('La hora de fin debe ser mayor que la hora de inicio')
      return false
    }

    if (selectedDate.getTime() === today.getTime()) {
      const now = new Date()
      const currentMinutes = now.getHours() * 60 + now.getMinutes()
      if (startMinutes < currentMinutes) {
        alert('La hora de inicio no puede ser menor que la hora actual')
        return false
      }
    }

    return true
  }

  return {
    validateLogin,
    validateRegister,
    validateUser,
    validateReservation
  }
}

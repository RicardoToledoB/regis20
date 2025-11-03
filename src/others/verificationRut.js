// ✅ Función para formatear el RUT (ej: 12345678K → 12.345.678-K)
export function formatRut(value) {
  if (!value) return ""
  // Eliminar todo lo que no sea número o K/k
  value = value.replace(/^0+|[^0-9kK]+/g, "").toUpperCase()
  if (value.length <= 1) return value

  const body = value.slice(0, -1)
  const dv = value.slice(-1)
  let formatted = ""
  let count = 0

  for (let i = body.length - 1; i >= 0; i--) {
    formatted = body.charAt(i) + formatted
    count++
    if (count === 3 && i !== 0) {
      formatted = "." + formatted
      count = 0
    }
  }
  return `${formatted}-${dv}`
}

// ✅ Función para validar el RUT chileno
export function validateRut(rut) {
  if (!rut || typeof rut !== "string") return false
  rut = rut.replace(/^0+|[^0-9kK]+/g, "").toUpperCase()
  if (rut.length < 2) return false

  const body = rut.slice(0, -1)
  const dv = rut.slice(-1)
  let sum = 0
  let multiplier = 2

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body.charAt(i)) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }

  const expectedDV = 11 - (sum % 11)
  const computedDV = expectedDV === 11 ? "0" : expectedDV === 10 ? "K" : expectedDV.toString()

  return dv === computedDV
}

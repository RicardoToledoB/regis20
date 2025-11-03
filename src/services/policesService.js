import axiosClient from './axiosClient'

export default {
  // ✅ Obtener todos los usuarios
  getAll() {
    return axiosClient.get('/api/v1/polices')
  },

  // ✅ Obtener usuario por ID
  getById(id) {
    return axiosClient.get(`/api/v1/polices/${id}`)
  },

  // ✅ Crear usuario
  create(data) {
    return axiosClient.post(`/api/v1/polices`, data)
  },

  // ✅ Actualizar usuario
  update(id, data) {
    return axiosClient.put(`/api/v1/polices/${id}`, data)
  },

  // ✅ Eliminar usuario
  delete(id) {
    return axiosClient.delete(`/api/v1/polices/${id}`)
  },


  // ✅ Obtener usuario por RUT
  getByRut(rut) {
      const rutLimpio = rut.replace(/[\.\-\s]/g, '')

    return axiosClient.get(`/api/v1/polices/findByRut/${rutLimpio}`)
  },
}

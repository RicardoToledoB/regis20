import axiosClient from './axiosClient'

export default {
  // ✅ Obtener todos los usuarios
  getAll() {
    return axiosClient.get('/api/v1/substances')
  },

  // ✅ Obtener usuario por ID
  getById(id) {
    return axiosClient.get(`/api/v1/substances/${id}`)
  },

    // ✅ Obtener usuario por ID
  getByReceptionId(receptionId) {
    return axiosClient.get(`/api/v1/substances/findByReceptionId/${receptionId}`)
  },

  // ✅ Crear usuario
  create(data) {
    return axiosClient.post(`/api/v1/substances`, data)
  },

  // ✅ Actualizar usuario
  update(id, data) {
    return axiosClient.put(`/api/v1/substances/${id}`, data)
  },

  // ✅ Eliminar usuario
  delete(id) {
    return axiosClient.delete(`/api/v1/substances/${id}`)
  }
}

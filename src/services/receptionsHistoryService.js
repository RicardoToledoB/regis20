import axiosClient from './axiosClient'

export default {
  // ✅ Obtener todos los usuarios
  getAll() {
    return axiosClient.get('/api/v1/receptions_histories')
  },
   // ✅ Obtener todos los usuarios
  getAllPaginated() {
    return axiosClient.get('/api/v1/receptions_histories/getAllPaginated')
  },

  // ✅ Obtener usuario por ID
  getById(id) {
    return axiosClient.get(`/api/v1/receptions_histories/${id}`)
  },
    // ✅ Obtener usuario por ID
  getByReceptionId(id) {
    return axiosClient.get(`/api/v1/receptions_histories/findByReceptionId/${id}`)
  },

  // ✅ Crear usuario
  create(data) {
    return axiosClient.post(`/api/v1/receptions_histories`, data)
  },

  // ✅ Actualizar usuario
  update(id, data) {
    return axiosClient.put(`/api/v1/receptions_histories/${id}`, data)
  },

  // ✅ Eliminar usuario
  delete(id) {
    return axiosClient.delete(`/api/v1/receptions_histories/${id}`)
  }
}

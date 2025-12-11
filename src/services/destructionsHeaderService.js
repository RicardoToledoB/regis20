import axiosClient from './axiosClient'

export default {
  // Obtener todas las destrucciones
  getAll() {
    return axiosClient.get('/api/v1/destructions_headers')
  },

  // Obtener destrucción por ID
  getById(id) {
    return axiosClient.get(`/api/v1/destructions_headers/${id}`)
  },

  // Crear destrucción
  create(data) {
    return axiosClient.post(`/api/v1/destructions_headers`, data)
  },

  // Actualizar destrucción
  update(id, data) {
    return axiosClient.put(`/api/v1/destructions_headers/${id}`, data)
  },

  // Eliminar destrucción
  delete(id) {
    return axiosClient.delete(`/api/v1/destructions_headers/${id}`)
  },
}

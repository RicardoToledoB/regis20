import axiosClient from './axiosClient'

export default {
  // Obtener todos los detalles de destrucción
  getAll() {
    return axiosClient.get('/api/v1/destructions_details')
  },

  // Obtener detalle de destrucción por ID
  getById(id) {
    return axiosClient.get(`/api/v1/destructions_details/${id}`)
  },

  // Obtener detalles de destrucción por ID de header
  getByHeaderId(headerId) {
    return axiosClient.get(`/api/v1/destructions_details/by-header/${headerId}`)
  },

  // Crear detalle de destrucción
  create(data) {
    return axiosClient.post(`/api/v1/destructions_details`, data)
  },

  // Actualizar detalle de destrucción
  update(id, data) {
    return axiosClient.put(`/api/v1/destructions_details/${id}`, data)
  },

  // Eliminar detalle de destrucción
  delete(id) {
    return axiosClient.delete(`/api/v1/destructions_details/${id}`)
  },
}

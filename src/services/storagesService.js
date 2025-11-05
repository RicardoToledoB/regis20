import axiosClient from './axiosClient'

export default {
  // ✅ Obtener todos los usuarios
  getAll() {
    return axiosClient.get('/api/v1/storages')
  },

  // ✅ Obtener usuario por ID
  getById(id) {
    return axiosClient.get(`/api/v1/storages/${id}`)
  },

  // ✅ Crear usuario
  create(data) {
    return axiosClient.post(`/api/v1/storages`, data)
  },

  // ✅ Actualizar usuario
  update(id, data) {
    return axiosClient.put(`/api/v1/storages/${id}`, data)
  },

  // ✅ Eliminar usuario
  delete(id) {
    return axiosClient.delete(`/api/v1/storages/${id}`)
  }
}

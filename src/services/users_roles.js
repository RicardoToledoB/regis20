import axiosClient from './axiosClient'

export default {
  // ✅ Obtener todos los usuarios
  getAll() {
    return axiosClient.get('/api/v1/users_roles')
  },

  // ✅ Obtener usuario por ID
  getById(id) {
    return axiosClient.get(`/api/v1/users_roles/${id}`)
  },

  // ✅ Crear usuario
  create(data) {
    return axiosClient.post(`/api/v1/users_roles`, data)
  },

  // ✅ Actualizar usuario
  update(id, data) {
    return axiosClient.put(`/api/v1/users_roles/${id}`, data)
  },

  // ✅ Eliminar usuario
  delete(id) {
    return axiosClient.delete(`/api/v1/users_roles/${id}`)
  }
}

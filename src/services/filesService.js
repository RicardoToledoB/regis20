import axiosClient from './axiosClient'

export default {
  // ✅ Obtener todos los archivos
  getAll() {
    return axiosClient.get('/api/v1/files')
  },

  // ✅ Obtener archivo por ID
  getById(id) {
    return axiosClient.get(`/api/v1/files/${id}`)
  },

  // ✅ Obtener archivos por ID de recepción
  getByReceptionId(receptionId) {
    return axiosClient.get(`/api/v1/files/by-reception/${receptionId}`)
  },

  // ✅ Crear archivo (con FormData para multipart/form-data)
  create(receptionId, userId, file, description = '') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('description', description)

    return axiosClient.post(
      `/api/v1/files/upload?reception_id=${receptionId}&user_id=${userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
  },

  // ✅ Actualizar archivo
  update(id, data) {
    return axiosClient.put(`/api/v1/files/${id}`, data)
  },

  // ✅ Eliminar archivo
  delete(id) {
    return axiosClient.delete(`/api/v1/files/${id}`)
  },
}

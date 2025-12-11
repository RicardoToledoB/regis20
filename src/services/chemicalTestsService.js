import axiosClient from './axiosClient'

export default {
  // ✅ Obtener todos los exámenes químicos
  getAll() {
    return axiosClient.get('/api/v1/chemical_tests')
  },

  // ✅ Obtener examen químico por ID
  getById(id) {
    return axiosClient.get(`/api/v1/chemical_tests/${id}`)
  },

  // ✅ Obtener exámenes químicos por ID de análisis
  getByAnalysisId(analysisId) {
    return axiosClient.get(`/api/v1/chemical_tests/by-analysis/${analysisId}`)
  },

  // ✅ Crear examen químico
  create(data) {
    return axiosClient.post(`/api/v1/chemical_tests`, data)
  },

  // ✅ Actualizar examen químico
  update(id, data) {
    return axiosClient.put(`/api/v1/chemical_tests/${id}`, data)
  },

  // ✅ Eliminar examen químico
  delete(id) {
    return axiosClient.delete(`/api/v1/chemical_tests/${id}`)
  },
}

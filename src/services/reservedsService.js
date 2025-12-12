import axiosClient from './axiosClient'

const reservedsService = {
  // Crear un nuevo reservado
  create: async (payload) => {
    try {
      const { data } = await axiosClient.post('/api/v1/reserveds', payload)
      return { data }
    } catch (error) {
      console.error('Error creando reservado:', error)
      throw error
    }
  },

  // Obtener todos los reservados
  getAll: async () => {
    try {
      const { data } = await axiosClient.get('/api/v1/reserveds')
      return { data }
    } catch (error) {
      console.error('Error obteniendo reservados:', error)
      throw error
    }
  },

  // Obtener reservado por ID
  getById: async (id) => {
    try {
      const { data } = await axiosClient.get(`/api/v1/reserveds/${id}`)
      return { data }
    } catch (error) {
      console.error('Error obteniendo reservado:', error)
      throw error
    }
  },

  // Actualizar reservado
  update: async (id, payload) => {
    try {
      const { data } = await axiosClient.put(`/api/v1/reserveds/${id}`, payload)
      return { data }
    } catch (error) {
      console.error('Error actualizando reservado:', error)
      throw error
    }
  },

  // Eliminar reservado
  delete: async (id) => {
    try {
      const { data } = await axiosClient.delete(`/api/v1/reserveds/${id}`)
      return { data }
    } catch (error) {
      console.error('Error eliminando reservado:', error)
      throw error
    }
  },

  // Obtener reservados por analysis ID
  getByAnalysisId: async (analysisId) => {
    try {
      const { data } = await axiosClient.get(`/api/v1/reserveds/by-analysis/${analysisId}`)
      return { data }
    } catch (error) {
      console.error('Error obteniendo reservados del analysis:', error)
      throw error
    }
  },

  // Obtener análisis por número de reservado (paginado)
  getByNumberPaginated: async (reservedNumber) => {
    try {
      const { data } = await axiosClient.get(`/api/v1/reserveds/by-number/paginated`, {
        params: { number: reservedNumber },
      })
      return { data }
    } catch (error) {
      console.error('Error obteniendo análisis por número de reservado:', error)
      throw error
    }
  },
}

export default reservedsService

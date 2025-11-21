import axiosClient from './axiosClient'

export default {
  getAll() {
    return axiosClient.get('/api/v1/analysis')
  },

  getById(id) {
    return axiosClient.get(`/api/v1/analysis/${id}`)
  },

  create(data) {
    return axiosClient.post(`/api/v1/analysis`, data)
  },

  update(id, data) {
    return axiosClient.put(`/api/v1/analysis/${id}`, data)
  },

  delete(id) {
    return axiosClient.delete(`/api/v1/analysis/${id}`)
  },
}

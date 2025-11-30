const API_URL = 'http://localhost:5000/api/resources'
const RESOURCES_KEY = 'ssplp_resources'

export const resourceService = {
  // Get all resources
  getAllResources: async () => {
    try {
      const response = await fetch(API_URL)
      return await response.json()
    } catch (error) {
      console.error('API error, using localStorage:', error)
      const stored = localStorage.getItem(RESOURCES_KEY)
      return stored ? JSON.parse(stored) : []
    }
  },

  // Get resources by subject
  getResourcesBySubject: async (subjectId) => {
    const resources = await resourceService.getAllResources()
    return resources.filter(r => r.subjectId === subjectId.toString())
  },

  // Add resource
  addResource: async (resource) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resource)
      })
      return await response.json()
    } catch (error) {
      console.error('API error, using localStorage:', error)
      const resources = JSON.parse(localStorage.getItem(RESOURCES_KEY) || '[]')
      const newResource = { id: Date.now(), uploadedAt: new Date().toISOString(), ...resource }
      resources.unshift(newResource)
      localStorage.setItem(RESOURCES_KEY, JSON.stringify(resources))
      return newResource
    }
  },

  // Delete resource
  deleteResource: async (resourceId) => {
    try {
      await fetch(`${API_URL}/${resourceId}`, { method: 'DELETE' })
      return true
    } catch (error) {
      console.error('API error, using localStorage:', error)
      const resources = JSON.parse(localStorage.getItem(RESOURCES_KEY) || '[]')
      const filtered = resources.filter(r => r.id !== resourceId && r._id !== resourceId)
      localStorage.setItem(RESOURCES_KEY, JSON.stringify(filtered))
      return true
    }
  },

  // Get resources by teacher
  getResourcesByTeacher: async (teacherId) => {
    try {
      const response = await fetch(`${API_URL}/teacher/${teacherId}`)
      return await response.json()
    } catch (error) {
      console.error('API error, using localStorage:', error)
      const resources = JSON.parse(localStorage.getItem(RESOURCES_KEY) || '[]')
      return resources.filter(r => r.teacherId === teacherId)
    }
  },

  // Update resource status
  updateResourceStatus: async (resourceId, status) => {
    try {
      const response = await fetch(`${API_URL}/${resourceId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      return await response.json()
    } catch (error) {
      console.error('API error, using localStorage:', error)
      const resources = JSON.parse(localStorage.getItem(RESOURCES_KEY) || '[]')
      const updated = resources.map(r => 
        (r.id === resourceId || r._id === resourceId) ? { ...r, status } : r
      )
      localStorage.setItem(RESOURCES_KEY, JSON.stringify(updated))
      return updated.find(r => r.id === resourceId || r._id === resourceId)
    }
  }
}

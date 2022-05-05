import * as axios from 'axios'
import { API } from '@/shared/config.js'

async function getTrailsByParkId (id) {
  const response = await axios.get(`${API}/api/parks/` + id + '/trails')
  console.log(response.data)
  return response.data
}

export const trailsService = {
  getTrailsByParkId
}

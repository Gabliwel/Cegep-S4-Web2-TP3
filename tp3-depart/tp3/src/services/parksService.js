import * as axios from 'axios'
import { API } from '@/shared/config.js'

async function getParks () {
  const response = await axios.get(`${API}/api/parks`)
  return response.data
}

export const parksService = {
  getParks
}

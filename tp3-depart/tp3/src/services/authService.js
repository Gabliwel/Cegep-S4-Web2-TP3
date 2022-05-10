import { API } from '@/shared/config'
import axios from 'axios'
import { parseAxiosErrorToAppError } from '@/shared/errorHelper'

async function getToken (credential) {
  try {
    const response = await axios.post(`${API}/login`, {
      email: credential.email,
      password: credential.password
    })
    const token = response.data.accessToken
    return token
  } catch (error) {
    throw parseAxiosErrorToAppError(error)
  }
}

export const authService = {
  getToken
}

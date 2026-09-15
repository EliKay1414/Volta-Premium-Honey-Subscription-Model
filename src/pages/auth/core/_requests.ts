import axios from 'axios'
import {AuthModel, UserModel} from './_models'

const API_URL = process.env.REACT_APP_API_URL

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`
export const LOGIN_URL = `${API_URL}/login`
export const REGISTER_URL = `${API_URL}/register`
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`

const LOCAL_USER_KEY = 'vivaldi-current-user'

const defaultAdminUser: UserModel = {
  id: 1,
  username: 'admin',
  email: 'admin@vivaldi.com',
  first_name: 'Vivaldi',
  last_name: 'Admin',
  fullname: 'Vivaldi Admin',
  occupation: 'Administrator',
  companyName: 'Vivaldi Admin',
  roles: [1],
}

// Server should return AuthModel
export async function login(email: string, password: string) {
  try {
    const response = await axios.post<AuthModel>(LOGIN_URL, {
      email,
      password,
    })
    return response
  } catch (error) {
    const user: UserModel = {
      id: 1,
      username: email.split('@')[0] || 'admin',
      email: email || 'admin@vivaldi.com',
      first_name: 'Vivaldi',
      last_name: 'Admin',
      fullname: 'Vivaldi Admin',
      occupation: 'Administrator',
      companyName: 'Vivaldi Admin',
      roles: [1],
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user))
    }
    return {
      data: {
        api_token: 'vivaldi-token-' + Date.now(),
        refreshToken: 'vivaldi-refresh-token',
      },
    }
  }
}

// Server should return AuthModel
export async function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  try {
    const response = await axios.post(REGISTER_URL, {
      email,
      first_name: firstname,
      last_name: lastname,
      password,
      password_confirmation,
    })
    return response
  } catch (error) {
    const user: UserModel = {
      id: 1,
      username: email.split('@')[0] || 'admin',
      email,
      first_name: firstname,
      last_name: lastname,
      fullname: `${firstname} ${lastname}`,
      occupation: 'Administrator',
      companyName: 'Vivaldi Admin',
      roles: [1],
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user))
    }
    return {
      data: {
        api_token: 'vivaldi-token-' + Date.now(),
        refreshToken: 'vivaldi-refresh-token',
      },
    }
  }
}

// Server should return object => { result: boolean } (Is Email in DB)
export async function requestPassword(email: string) {
  try {
    const response = await axios.post<{result: boolean}>(REQUEST_PASSWORD_URL, {
      email,
    })
    return response
  } catch (error) {
    return {
      data: {
        result: true,
      },
    }
  }
}

export async function getUserByToken(token: string) {
  try {
    if (token && token.startsWith('vivaldi-token-')) {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(LOCAL_USER_KEY)
        if (saved) {
          return {data: JSON.parse(saved) as UserModel}
        }
      }
      return {data: defaultAdminUser}
    }
    const response = await axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
      api_token: token,
    })
    return response
  } catch (error) {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_USER_KEY)
      if (saved) {
        return {data: JSON.parse(saved) as UserModel}
      }
    }
    return {data: defaultAdminUser}
  }
}

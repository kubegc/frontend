import Cookies from 'js-cookie'

const TokenKey = 'kubernetes_admin_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setValue(name, value) {
  return Cookies.set(name, value)
}

export function getValue(name) {
  return Cookies.get(name)
}

export function removeValue(name) {
  return Cookies.remove(name)
}

// Copyright (2021, ) Institute of Software, Chinese Academy of Sciences
import Cookies from 'js-cookie'

const TokenKey = 'kubernetes_admin_token'

/**
 * Get token from cookies
 */
export function getToken() {
  return Cookies.get(TokenKey)
}

/**
 * Set token to cookies
 */
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

/**
 * Remove token in cookies
 */
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

// Copyright (2021, ) Institute of Software, Chinese Academy of Sciences

/**
 * get Grafana link
 * @returns {string}
 */
export function getGrafanaLink() {
  return getBaseUrl('31002')
}

/**
 * get Loki link
 * @returns {string}
 */
export function getLokiLink() {
  return getBaseUrl('31002')
}

/**
 * get SuperSet link
 * @returns {string}
 */
export function getSupersetLink() {
  return getBaseUrl('31003')
}

/**
 * get SuperSet link
 * @param {string} sourceName
 * @returns {string}
 */
export function getSourceLink(sourceName) {
  switch (sourceName) {
    case 'grafana':
      return getGrafanaLink()
    case 'loki':
      return getLokiLink()
    case 'superset':
      return getSupersetLink()
    default:
      return ''
  }
}

/**
 * @param {string} sourceName
 * @returns {string}
 */
export function getBaseUrl(port) {
  return window.g.baseURL.replace('30308', port)
}


import request from '@/utils/request'

export function createResource(payload) {
  return request({
    url: window.g.baseURL + '/createResource',
    method: 'post',
    payload
  })
}

export function updateResource(payload) {
  return request({
    url: window.g.baseURL + '/kube/updateResource',
    method: 'post',
    payload
  })
}

export function deleteResource(payload) {
  return request({
    url: window.g.baseURL + '/kube/deleteResource',
    method: 'post',
    payload
  })
}

export function getResource(payload) {
  return request({
    url: window.g.baseURL + '/kube/getResource',
    type: 'get',
    params: payload
  })
}

export function listResources(payload) {
  return request({
    url: window.g.baseURL + '/kube/listResources',
    method: 'get',
    params: payload
  })
}

export function validateRes(res) {
  if (res.code === 20000) {
    return true
  } else {
    this.$notify({
      title: 'error',
      message: res.data,
      type: 'warning',
      duration: 3000
    })
    return false
  }
}

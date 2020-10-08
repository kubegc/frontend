import request from '@/utils/request'

export function createResource(payload) {
  return request({
    url: '/kube/createResource',
    method: 'post',
    payload
  })
}

export function updateResource(payload) {
  return request({
    url: '/kube/updateResource',
    method: 'post',
    payload
  })
}

export function deleteResource(payload) {
  return request({
    url: '/kube/deleteResource',
    method: 'post',
    payload
  })
}

export function getResource(payload) {
  return request({
    url: '/kube/getResource',
    type: 'get',
    params: payload
  })
}

export function listResources(payload) {
  return request({
    url: '/kube/listResources',
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

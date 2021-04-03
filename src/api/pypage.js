import request from '@/utils/request'

export function execFunc() {
  return request({
    url: 'http://localhost:5000/exec',
    method: 'get'
  })
}

export function saveConfig(data) {
    return request({
      url: 'http://localhost:5000/save',
      method: 'post',
      data
    })
  }

// Copyright (2021, ) Institute of Software, Chinese Academy of Sciences

import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getUserInfo(payload) {
  return request({
    url: '/user/getUserInfo',
    method: 'get',
    params: payload
  })
}

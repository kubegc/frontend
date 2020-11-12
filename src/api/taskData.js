import request from '@/utils/request'

export function getListAllData(listQuery) {
  var res = request({
    url: '/list/getList',
    method: 'get',
    params: listQuery
  })
  return res
}

export function getColumns(query) {
  var res = request({
    url: '/list/getColumns',
    method: 'get',
    params: query
  })
  return res
}

export function getActions(query) {
  var res = request({
    url: '/list/getActions',
    method: 'get',
    params: query
  })
  return res
}

export function getFilterForm(query) {
  var res = request({
    url: '/list/getFilterForm',
    method: 'get',
    params: query
  })
  return res
}

export function getLittleDataSource(query) {
  var res = request({
    url: '/list/getLittleDataSource',
    method: 'get',
    params: query
  })
  return res
}


export function getRules(query) {
  var res = request({
    url: '/list/getRules',
    method: 'get',
    params: query
  })
  return res
}

export function getTemp(query) {
  var res = request({
    url: '/list/getTemp',
    method: 'get',
    params: query
  })
  return res
}

export function getGrafanaLink(query) {
  var res = request({
    url: '/getGrafanaLink',
    method: 'get',
    params: query
  })
  return res
}

export function getAllTaskData(listQuery) {
  var res = request({
    url: '/list/getList',
    method: 'get',
    params: listQuery
  })
  return res
}

export function getEchartsData(listQuery) {
  var res = request({
    url: '/getEchartsData',
    method: 'get',
    params: listQuery
  })
  return res
}

export function getScheduleData(listQuery) {
  var res = request({
    url: '/getScheduleData',
    method: 'get',
    params: listQuery
  })
  return res
}

export function AgetScheduleData(listQuery) {
  var res = request({
    url: '/AgetScheduleData',
    method: 'get',
    params: listQuery
  })
  return res
}

export function getPriorityData(listQuery) {
  var res = request({
    url: '/getPriorityData',
    method: 'get',
    params: listQuery
  })
  return res
}

export function getRouterData(listQuery) {
  var res = request({
    url: '/getRouterData',
    method: 'get',
    params: listQuery
  })
  return res
}

export function getPipelineItems(listQuery) {
  var res = request({
    url: '/getPipelineItems',
    method: 'get',
    params: listQuery
  })
  return res
}


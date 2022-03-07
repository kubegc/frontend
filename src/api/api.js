import { get } from '../config/RequestConfig'

export function getUserList(data) {
  return get('/pipelineItems')
}



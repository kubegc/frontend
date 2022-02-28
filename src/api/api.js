import { get } from '../config/RequestConfig'
import { push } from '../config/RequestConfig'

export function getUserList(data) {
  return get('/pipelineItems')
}

export function addInput(data) {
  return push('/pipelineItems')
}

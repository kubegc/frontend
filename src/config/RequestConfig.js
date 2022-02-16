import axios from 'axios'
import { Message } from 'element-ui'

export const get = async(url = '', params = {}, method = 'get') => {
  const res = await axios(url, {
    params: params,
    method: method
  })
  if (res) {
    return res
  } else {
    Message({
      showClose: true,
      message: '请求失败',
      type: 'error'
    })
    return false
  }
}

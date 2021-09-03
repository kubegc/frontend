import { createResource, deleteResource, getResource, listResources, updateResource, getScreen, queryResourceCount  } from '@/api/kubernetes'
import Message from 'element-ui/packages/message/src/main'
// eslint-disable-next-line no-unused-vars
/* eslint-disable */
/** *****************************
 *
 *
 * common cases
 *
 *
 ********************************/
export default function validResponse(response) {
  // eslint-disable-next-line no-prototype-builtins
  return response != null && response.hasOwnProperty('code') && response.code === 20000
}
export function message(message, type) {
  Message({
    message: message,
    type: type,
    duration: 3000
  })
}
/** *****************************
 *
 *
 * various values
 *
 *
 ********************************/
// TODO
export function dropdownValues(name, values) {
  getResource({
    kind: 'ConfigMap',
    namespace: 'default',
    name })
    .then(response => {
        if (validResponse(response)) {
          values = response.data.spec
        }
      }
    )
}
export function getComplexOrDefValue(scope, longKey, defKey) {
  const value = getComplexValue(scope, longKey)
  if (value.startsWith('-') && defKey) {
    return getTextValue(scope, defKey)
  }
  return value
}
export function getComplexValue(scope, key) {
  if (JSON.stringify(scope) === '{}' || !key) {
    return ''
  }
  let value = ''
  const strAry = key.split(';')

  if (strAry.length === 1) {

    // convert 1516703495241 to 2018-01-23 18:31:35
    // function time()
    if (key.startsWith('time(')) {
      value = getTextValue(scope, key.substring('time('.length, key.length - 1))
      let date = new Date(parseInt(value.toString()))
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      value = y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    } else {
      value = getTextValue(scope, key)
    }

    value = '.' + value
  } else {
    for (let i = 0; i < strAry.length; i++) {
      const longKey = strAry[i]
      if (i%2 === 0) {
        const v = getTextValue(scope, longKey)
        if (strAry[1] === '|') {
          value = v.substring(0) !== '-' ? "." + v : value
        } else {
          value = value + strAry[1] + v.substring(0)
        }
      }
    }
  }

  return value.substring(1)
}
export function getTextValue(scope, longKey) {
  if (JSON.stringify(scope) === '{}' || !longKey) {
    return '-'
  }
  let result = scope
  longKey.split('.').every((item) => {
    item = item.replaceAll('#', '.')
    if (item.indexOf('[') > 0) {
      result = result[item.substring(0, item.indexOf('['))]
      if (result === undefined || result.length === 0) {
        result = '-'
        return false
      } else {
        result =
          result[
            parseInt(
              item.substring(item.indexOf('[') + 1, item.indexOf(']'))
            )
            ]
        return true
      }
    } else {
      if (result && result[item] !== undefined) {
        result = result[item]
        return true
      } else {
        result = '-'
        return false
      }
    }
  })

  if (result instanceof Object || result instanceof Array) {
    const objResult = new Set()
    for (const key in result) {
      if (result[key] === '') {
        continue
      }
      objResult.add(result[key])
    }
    return objResult
  } else {
    if (result === 'Running') {
      result = '运行中'
    } else if (result === 'Terminating') {
      result = '销毁中'
    } else if (result === 'Pending') {
      result = '挂起中'
    } else if (result === 'Succeeded') {
      result = '执行完成'
    } else if (result === 'Completed') {
      result = '执行完成'
    } else if (result === 'Failed') {
      result = '执行失败'
    } else if (result === 'Unknown') {
      result = '未知状态'
    } else if (result === 'Ready') {
      result = '健康运行'
    } else if (result === 'Leader') {
      result = '主控节点'
    } else if (result === 'Worker') {
      result = '工作节点'
    } else if (result === 'NoSchedule') {
      result = '正在维护'
    } else if (result === 'Schedule') {
      result = '正在工作'
    } else if (result.endsWith('Ki')) {
      result = (Number(result.substring(0, result.length - 2).trim())/1024/1024).toFixed(2) + 'GB'
    } else if (result.endsWith('Mi')) {
      result = (Number(result.substring(0, result.length - 2).trim())/1024).toFixed(2) + 'GB'
    } else if (result.endsWith('Ti')) {
      result = (Number(result.substring(0, result.length - 2).trim())*1024).toFixed(2) + 'GB'
    } else if (result === 'local') {
      result = '本地服务器'
    } else if (result === 'cloud') {
      result = '公有云资源'
    } else if (result === 'edge') {
      result = '边缘端设备'
    }
    return result
  }
}
/** *****************************
 *
 *
 * frontend metadata and data
 *
 *
 ********************************/
export function frontendMeta(token, kind, tablePage) {
  // 获取描述元信息
  getResource({
    token,
    kind: 'Frontend',
    name: 'desc-' + kind,
    namespace: 'default'
  }).then((response) => {
    if (validResponse(response)) {
      tablePage.desc = response.data.spec.desc
    }
  })
  // 获取搜索表单元信息
  getResource({
    token,
    kind: 'Frontend',
    name: 'formsearch-' + kind,
    namespace: 'default'
  }).then((response) => {
    if (validResponse(response)) {
      tablePage.dynamicFormJson = response.data.spec.data
      tablePage.dynamicFormVisible = true
    }
  })
}
export function frontendData(ref, token, kind, listQuery, tablePage) {
  listResources({
    token: token,
    kind: kind,
    limit: listQuery.limit,
    page: listQuery.page,
    labels: listQuery.labels
  }).then((response) => {
    if (validResponse(response)) {
      tablePage.listLoading = true
      tablePage.tableItems = response.data.items
      tablePage.tableItemsSize = response.data.metadata.totalCount
      // 获取可以进行的操作
      getResource({
        token,
        kind: 'Frontend',
        name: 'action-' + kind,
        namespace: 'default'
      }).then((response) => {
        if (validResponse(response)) {
          // eslint-disable-next-line no-prototype-builtins
          if (response.hasOwnProperty('data')) {
            tablePage.actions = response.data.spec.data
          } else {
            tablePage.actions = []
          }
          tablePage.tableData = []
          // 这里的 tableData 就是最后传进 table 的 data prop的数据
          for (let i = 0; i < tablePage.tableItems.length; i++) {
            tablePage.tableData.push({})
            tablePage.tableData[i].json = tablePage.tableItems[i]
            tablePage.tableData[i].actions = tablePage.actions
            tablePage.tableData[i].val = ''
          }
          // 获取表头信息
          // getResource({
          //   token,
          //   kind: 'Frontend',
          //   name: 'table' + '-' + kind,
          //   namespace: 'default'
          // }).then((response) => {
          //   if (validResponse(response)) {
          //     tablePage.tableColumns = response.data.spec.data
          //     tablePage.listLoading = false
          //   }
          // })
          getResource({
            token,
            kind: 'Frontend',
            name: 'table' + '-' + kind,
            namespace: 'default'
          }).then((response) => {
            if (validResponse(response)) {
              tablePage.tableColumns = response.data.spec.data
              for(let i = 0; i < tablePage.tableColumns.length; i ++) {

                if(tablePage.tableColumns[i].kind === 'internalLink' && tablePage.tableColumns[i].row.indexOf('@') !== -1) {
                  const key = tablePage.tableColumns[i].row.substring(1) + '-' +tablePage.tableColumns[i].tag
                  const arr = {}
                  // listQuery.data[key] = arr
                  ref.$set(listQuery.data, key, arr)

                  for(let j = 0; j < tablePage.tableData.length; j ++) {
                    queryResourceCount({token, data:{link: tablePage.tableColumns[i].link, tag: tablePage.tableColumns[i].tag, value: getTextValue(tablePage.tableData[j].json, tablePage.tableColumns[i].row.substring(1))}}).then(
                      response => {
                        if(validResponse(response)) {
                          ref.$set(listQuery.data[key], tablePage.tableData[j].json.metadata.name, response.data.totalCount)
                        }
                      }
                    )
                  }
                }
              }
            }
            tablePage.listLoading = false
          })
        }
      })
    }
  })
}

export function components(token) {
  getComponents({
    token
  }).then((response) => {
    if (validResponse(response)) {
      return response.data
    }
  })
}
export function screenData(name) {
  // 获取描述元信息
  return getScreen({
    name: name,
  }).then((response) => {
    if (validResponse(response)) {
      return response.data.spec
    }
  })
}
/** *****************************
 *
 *
 * lifecycle
 *
 *
 ********************************/
export function handleCreateTemplateChange(template, token, kind, createAbout) {
  // 获取创建的模板信息，里面可能会有创建这资源所需要填写的字段的信息
  getResource({
    token,
    kind: 'doslab.io.Template',
    name: kind + '-create.' + template,
    namespace: 'default'
  }).then((response) => {
    if (validResponse(response)) {
      // 就是创建这个资源的 json 模板
      createAbout.createJsonPattern = response.data.spec.data.template
      // 生成之后就会变成填写字段信息表格的数据来源数组
      createAbout.createFormConfig = []
      // eslint-disable-next-line no-prototype-builtins
      if (response.hasOwnProperty('data')) {
        createAbout.createFormConfig = response.data.spec.data.values
        for (let i = 0; i < createAbout.createFormConfig.length; i++) {
          if (createAbout.createFormConfig[i].type === 'bool') {
            createAbout.createFormConfig[i].value = true
          } else {
            createAbout.createFormConfig[i].value = ''
          }
          createAbout.createFormConfig[i].placeholder = createAbout.createFormConfig[i].type
        }
      }
    }
  })
}
export function createObject(ref, token, kind, listQuery, tablePage, createAbout) {
  // 创建资源的 dialog 需要消失
  createAbout.createDialogVisible = false
  if (!createAbout.ifJsonEditorForCreate) {
    updateJsonObj(createAbout.createJsonPattern, createAbout.createFormConfig)
  }
  // if (typeof this.createJsonPattern === 'string') {
  //   this.createJsonPattern = JSON.parse(this.createJsonPattern)
  // }
  // 新建资源
  createResource({
    token,
    json: createAbout.createJsonPattern
  }).then((response) => {
    if (validResponse(response)) {
      message('创建成功', 'success')
      frontendData(ref, token, kind, listQuery, tablePage)
      // refresh()
    }
  })
}
export function applyOperation(ref, token, kind, listQuery, tablePage, updateAbout) {
  console.log(ref)
  updateAbout.actionDialogVisible = false
  // if (typeof this.updateJsonData === 'string') {
  //   this.updateJsonData = JSON.parse(this.updateJsonData)
  // }
  if (!updateAbout.ifJsonEditorForUpdate) {
    updateJsonObj(updateAbout.updateJsonData, updateAbout.updateFormConfig)
  }
  // this.createJsonData = JSON.parse(this.createJsonData);
  updateResource({
    token: token,
    json: updateAbout.updateJsonData
  }).then((response) => {
    if (validResponse(response)) {
      frontendData(ref, token, kind, listQuery, tablePage)
      message('更新成功', 'success')
    } else {
      message('更新失败', 'error')
    }
  })
}

export function createJson(token, kind, createAbout) {
  getResource({
    token: token,
    kind: 'doslab.io.Template',
    name: kind + '-' + 'create',
    namespace: 'default'
  }).then((response) => {
    if (validResponse(response)) {
      // this.customizedAction = true
      if (response.data.spec && response.data.spec.data) {
        createAbout.createTemplates = response.data.spec.data.support
        createAbout.ifJsonEditorForCreate = false
      } else {
        createAbout.ifJsonEditorForCreate = true
        createAbout.createJsonPattern = response.data
      }
      createAbout.createDialogVisible = true
    }
  })
}
export function handleActionChange(ref, action, row, token, kind, listQuery, tablePage, updateAbout) {
  if (action === 'update') {
    getResource({
      token,
      kind,
      name: row.metadata.name,
      namespace: row.metadata.namespace
    }).then((response) => {
      if (validResponse(response)) {
        updateAbout.updateJsonData = response.data
        updateAbout.ifJsonEditorForUpdate = true
        updateAbout.updateResourceTitle = '更新对象'
        updateAbout.actionDialogVisible = true
      }
    })
  } else if (action === 'delete') {
    deleteResource({
      token,
      kind,
      name: row.metadata.name,
      namespace: row.metadata.namespace
    }).then((response) => {
      if (validResponse(response)) {
        frontendData(ref, token, kind, listQuery, tablePage)
        message('删除成功', 'success')
      }
    })
  } else {
    getResource({
      token,
      kind,
      name: row.metadata.name,
      namespace: row.metadata.namespace
    }).then((response) => {
      if (validResponse(response)) {
        updateAbout.updateJsonData = response.data
        getResource({
          token,
          kind: 'doslab.io.Template',
          name: kind + '-' + action,
          namespace: 'default'
        }).then((response) => {
          if (validResponse(response)) {
            updateAbout.updateResourceTitle = response.data.spec.data.key
            updateAbout.ifJsonEditorForUpdate = false
            // 比如 action 是 scaleup 的时候，这里可能代表的就是需要修改的一些属性字段的信息
            // id是 spec.replicas
            // type 是字段的类型
            // value 是这个字段默认的值，bool 是 true, string 是 ''
            updateAbout.updateFormConfig = []
            if (response.data.spec.data.template.hasOwnProperty("operator")) {
              updateAbout.updateJsonData["operator"] = response.data.spec.data.template.operator
            }
            // eslint-disable-next-line no-prototype-builtins
            if (response.hasOwnProperty('data')) {
              updateAbout.updateFormConfig = response.data.spec.data.values
              for (let i = 0; i < updateAbout.updateFormConfig.length; i++) {
                if (updateAbout.updateFormConfig[i].type === 'bool') {
                  updateAbout.updateFormConfig[i].value = true
                } else {
                  updateAbout.updateFormConfig[i].value = ''
                }
                updateAbout.updateFormConfig[i].placeholder = updateAbout.updateFormConfig[i].type
              }
            }
            updateAbout.actionDialogVisible = true
          }
        })
      }
    })
  }
}
export function getTags(vueComponentObject) {
  getResource({
    token: vueComponentObject.token,
    kind: 'Frontend',
    namespace: 'default',
    name: 'tags-' + vueComponentObject.kind
  }).then(response => {
    if (validResponse(response)) {
      vueComponentObject.tags = response.data.spec.tags
      vueComponentObject.label = response.data.spec.label
    }
  })
}
export function updateJsonObj(jsonObj, configArray) {
  let jsonObjTemp
  let propertiesRequired
  for (const key in configArray) {
    // 如果 id 是长长的一串
    // 例如 ...,...,... 这种，就将这个长字符串按 ','  分成字符串数组 ['...','...','...']
    if (configArray[key].id.indexOf(',') > 0) {
      propertiesRequired = configArray[key].id.split(',')
    } else {
      propertiesRequired = []
      propertiesRequired.push(configArray[key].id)
    }
    // 这里是针对每一个属性进行一个循环
    for (let j = 0; j < propertiesRequired.length; j++) {
      jsonObjTemp = jsonObj
      const pathToProperty = propertiesRequired[j].split('.')
      // pathToProperty 数组中最后一个元素是我们的目标属性，所以要解析前面的中间属性
      for (let i = 0; i < pathToProperty.length - 1; i++) {
        if (pathToProperty[i].indexOf('[') > 0) {
          // 获得 example[index] 的 example 数组对象
          jsonObjTemp =
            jsonObjTemp[
              pathToProperty[i].substring(0, pathToProperty[i].indexOf('['))
              ]
          // 获得 example 数组对象里面的 index 索引下的对象
          jsonObjTemp =
            jsonObjTemp[
              parseInt(
                pathToProperty[i].substring(
                  pathToProperty[i].indexOf('[') + 1,
                  pathToProperty[i].indexOf(']')
                )
              )
              ]
        } else {
          jsonObjTemp = jsonObjTemp[pathToProperty[i]]
        }
      }
      // 处理目标属性，是 example 这种 还是 exapmle[index] 这种
      if (pathToProperty[pathToProperty.length - 1].indexOf('[') > 0) {
        jsonObjTemp =
          jsonObjTemp[
            pathToProperty[pathToProperty.length - 1].substring(
              0,
              pathToProperty[pathToProperty.length - 1].indexOf('[')
            )
            ]
        if (configArray[key].type === 'integer') {
          jsonObjTemp[
            parseInt(
              pathToProperty[pathToProperty.length - 1].substring(
                pathToProperty[pathToProperty.length - 1].indexOf('[') + 1,
                pathToProperty[pathToProperty.length - 1].indexOf(']')
              )
            )
            ] = Number(configArray[key].value) // 这里的 value 就是用户填写的信息
        } else {
          jsonObjTemp[
            parseInt(
              pathToProperty[pathToProperty.length - 1].substring(
                pathToProperty[pathToProperty.length - 1].indexOf('[') + 1,
                pathToProperty[pathToProperty.length - 1].indexOf(']')
              )
            )
            ] = configArray[key].value
        }
      } else if (configArray[key].type === 'integer') {
        jsonObjTemp[
          pathToProperty[pathToProperty.length - 1]
          ] = Number(configArray[key].value)
      } else {
        jsonObjTemp[
          pathToProperty[pathToProperty.length - 1]
          ] = configArray[key].value
      }
    }
  }
}

// Copyright (2021, ) Institute of Software, Chinese Academy of Sciences

import { createResource, deleteResource, getResource, listResources, updateResource, getScreen, queryResourceCount } from '@/api/kubernetes'
import Message from 'element-ui/packages/message/src/main'
import Vue from 'vue'
// eslint-disable-next-line no-unused-vars
/* eslint-disable */
/** *****************************
 *
 *
 * common cases
 *
 *
 ********************************/
/**
 * Get project title
 * @param {(Object)} doc
 */
export function getTitle(doc) {
  getResource({
    token: 'default',
    kind: 'Frontend',
    namespace: 'default',
    name: 'frontend-project'
  }).then((response) => {
    doc.title = response.data.spec.data[0].label
  })
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {desc} regexp
 * @param {value}  value
 * @returns {Boolean}
 */
export function doCheck(desc, value) {
  const regexp = new RegExp(desc)
  if (value === undefined || !regexp.test(value)) {
    return false
  } else {
    return true
  }
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

export function validResponse(response) {
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
  // if scope is null, just return '-'
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
        // we should consider this case in route-admin,
        // in our design, apiVersion is a system keyword
        //
        // for example, the deployment kind in route-admin is "apps.Deploymnet"
        // when we try to find the Pod's parent, we must find it in the following json.
        // In order to get 'apps.Deployment', we should handle the apiVersion.
        // "ownerReferences": [
        //       {
        //         "apiVersion": "apps/v1",
        //         "kind": "Deployment",
        //         "name": "coredns",
        //         "uid": "a018d44a-5ca6-48f4-bc15-f0abe639c297",
        //         "controller": true,
        //         "blockOwnerDeletion": true
        //       }
        if (item === 'apiVersion') {
          let idx = result.indexOf('/')
          result = result.substring(0, idx)
        }
        return true
      } else {
        result = '-'
        return false
      }
    }
  })

  // if result is Object or Array ???
  if (result instanceof Object || result instanceof Array) {
    const objResult = new Set()
    for (const key in result) {
      if (result[key] === '') {
        continue
      }
      objResult.add(result[key])
    }
    return objResult
  } else if (result instanceof String) {
    // Pod lifecycle: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/
    if (result.toLowerCase() === 'running') {
      result = '运行中'
    } else if (result.toLowerCase() === 'terminating') {
      result = '销毁中'
    } else if (result.toLowerCase() === 'pending') {
      result = '挂起中'
    } else if (result.toLowerCase() === 'succeeded') {
      result = '执行完成'
    } else if (result.toLowerCase() === 'completed') {
      result = '执行完成'
    } else if (result.toLowerCase() === 'failed') {
      result = '执行失败'
    } else if (result.toLowerCase() === 'unknown') {
      result = '未知状态'
    } else if (result.toLowerCase() === 'ready') {
      result = '正常运行'
    } else if (result.toLowerCase() === 'active') {
      result = '正常工作'
    }
    // Resource memory size when executing kubectl get no [name] -n [namespace] -o yaml
    // status:
    //   addresses:
    //   - address: 133.133.135.52
    //     type: InternalIP
    //   - address: ubuntu
    //     type: Hostname
    //   allocatable:
    //     cpu: "4"
    //     memory: 7711Mi
    //     pods: "110"
    //   capacity:
    //     cpu: "4"
    //     memory: 7811Mi
    //     pods: "110
    // We want to display it as Gi
    // Here, result + ‘’:   because we want to handle it as a string type
    else if ((result + '').endsWith('Ki')) {
      result = (Number(result.substring(0, result.length - 2).trim())/1024/1024).toFixed(2) + 'GB'
    } else if ((result + '').endsWith('Mi')) {
      result = (Number(result.substring(0, result.length - 2).trim())/1024).toFixed(2) + 'GB'
    } else if ((result + '').endsWith('Ti')) {
      result = (Number(result.substring(0, result.length - 2).trim())*1024).toFixed(2) + 'GB'
    }
    // Resource classification:  https://www.yuque.com/kubesys/kube-frontend/ipnl6c
    else if (result === 'local') {
      result = '本地服务器'
    } else if (result === 'cloud') {
      result = '公有云资源'
    } else if (result === 'edge') {
      result = '边缘端设备'
    } else if (result === 'leader') {
      result = '主控节点'
    } else if (result === 'worker') {
      result = '工作节点'
    } else if (result === 'no-schedule') {
      result = '正在维护'
    } else if (result === 'schedule') {
      result = '正在工作'
    }
    return result
  } else {
    return result
  }
}
/** *****************************
 *
 *
 * ConfigMap
 *
 *
 ********************************/
export function ConfigMapValue(token, name, mapper) {
  getResource({
    token,
    kind: 'ConfigMap',
    name: name,
    namespace: 'default'
  }).then((response) => {
    if (validResponse(response)) {
      var result = response.data.data
      for (var key in result) {
        Vue.set(mapper, key, result[key])
      }
    }
  })
}
/** *****************************
 *
 *
 * frontend metadata and data
 *
 *
 ********************************/
export function frontendMeta(token, kind, pageSpec) {
  // 获取描述元信息
  getResource({
    token,
    kind: 'Frontend',
    name: 'desc-' + kind,
    namespace: 'default'
  }).then((response) => {
    if (validResponse(response)) {
      pageSpec.description.activeDesc = response.data.spec.desc
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
      pageSpec.formSearch.formSearchJson = response.data.spec.data
      pageSpec.formSearch.formSearchVisible = true
    }
  })
}

export function frontendData(ref, token, kind, listQuery, tableSpec) {

  let idx = kind.indexOf('-')
  listResources({
    token: token,
    kind: idx === -1 ? kind : kind.substring(0, idx),
    limit: listQuery.limit,
    page: listQuery.page,
    labels: listQuery.allLabels
  }).then((response) => {
    if (validResponse(response)) {
      tableSpec.table.tableLoading = true
      tableSpec.table.tableItems = response.data.items
      tableSpec.table.tableItemsSize = response.data.metadata.totalCount
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
            tableSpec.actions = response.data.spec.data
          } else {
            tableSpec.actions = []
          }
          tableSpec.table.tableData = []
          // 这里的 tableData 就是最后传进 table 的 data prop的数据
          for (let i = 0; i < tableSpec.table.tableItems.length; i++) {
            tableSpec.table.tableData.push({})
            tableSpec.table.tableData[i].json = tableSpec.table.tableItems[i]
            tableSpec.table.tableData[i].actions = tableSpec.actions
            tableSpec.table.tableData[i].val = ''
          }

          getResource({
            token,
            kind: 'Frontend',
            name: 'table' + '-' + kind,
            namespace: 'default'
          }).then((response) => {
            if (validResponse(response)) {
              tableSpec.table.tableColumns = response.data.spec.data
              for(let i = 0; i < tableSpec.table.tableColumns.length; i ++) {

                if(tableSpec.table.tableColumns[i].kind === 'internalLink' && tableSpec.table.tableColumns[i].row.indexOf('@') !== -1) {
                  const key = tableSpec.table.tableColumns[i].row.substring(1) + '-' +tableSpec.table.tableColumns[i].tag
                  const arr = {}

                  ref.$set(listQuery.dynamicData, key, arr)

                  for(let j = 0; j < tableSpec.table.tableData.length; j ++) {
                    let tag = tableSpec.table.tableColumns[i].tag
                    tag = tag.startsWith('@') ? getTextValue(tableSpec.table.tableData[j].json, tag.substring(1)) : tag;
                    queryResourceCount({token, data:{link: tableSpec.table.tableColumns[i].link,
                                                          tag: tag,
                                                          value: getTextValue(tableSpec.table.tableData[j].json, tableSpec.table.tableColumns[i].row.substring(1))}}).then(
                      response => {
                        if(validResponse(response)) {
                          ref.$set(listQuery.dynamicData[key], tableSpec.table.tableData[j].json.metadata.name, response.data.totalCount)
                        }
                      }
                    )
                  }
                }
              }
            }
            tableSpec.table.tableLoading = false
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

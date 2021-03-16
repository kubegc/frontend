import { createResource, deleteResource, getResource, listResources, updateResource } from '@/api/kubernetes'
import { updateJsonObj } from '@/api/parser'
import Message from 'element-ui/packages/message/src/main'
export default function valid(response) {
  return response.data && response.data !== null && response.data !== 404 && response.data.code !== 404
}
export function metadata(name) {
  const res = getResource({ kind: 'Metadata', namespace: 'default', name }).then(
    response => {
      if (valid(response)) {
        return response.data.spec
      }
    }
  )
  return res
}
export function frontend(token, kind, listQuery, tablePage) {
  getResource({
    token,
    kind: 'Frontend',
    name: 'desc-' + kind.toLowerCase(),
    namespace: 'default'
  }).then((response) => {
    if (valid(response)) {
      tablePage.desc = response.data.spec.desc
    }
  })
  // 获取上面搜索表单的信息
  getResource({
    token,
    kind: 'Frontend',
    name: 'formsearch-' + kind.toLowerCase(),
    namespace: 'default'
  }).then((response) => {
    if (valid(response)) {
      tablePage.dynamicFormJson = response.data.spec.data
      // res.message = this.responseJson.model
      tablePage.dynamicFormVisible = true
    }
  })
}
export function frontendData(token, kind, listQuery, tablePage) {
  listResources({
    token,
    kind,
    limit: listQuery.limit,
    page: listQuery.page,
    labels: listQuery.labels
  }).then((response) => {
    if (valid(response)) {
      tablePage.listLoading = true
      tablePage.tableItems = response.data.items
      tablePage.tableItemsSize = response.data.metadata.totalCount
      // 获取可以进行的操作
      getResource({
        token,
        kind: 'Frontend',
        name: 'action-' + kind.toLowerCase(),
        namespace: 'default'
      }).then((response) => {
        if (valid(response)) {
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
          getResource({
            token,
            kind: 'Frontend',
            name: 'table' + '-' + kind.toLowerCase(),
            namespace: 'default'
          }).then((response) => {
            if (valid(response)) {
              tablePage.tableColumns = response.data.spec.data
              tablePage.listLoading = false
            }
          })
        }
      })
    }
  })
}
export function handleCreateTemplateChange(template, token, kind, createAbout) {
  // 获取创建的模板信息，里面可能会有创建这资源所需要填写的字段的信息
  getResource({
    token,
    kind: 'Template',
    name: kind.toLowerCase() + '-create.' + template,
    namespace: 'default'
  }).then((response) => {
    if (valid(response)) {
      // 就是创建这个资源的 json 模板
      createAbout.createJsonPattern = response.data.spec.data.template
      // 生成之后就会变成填写字段信息表格的数据来源数组
      createAbout.createFormConfig = []
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
export function create(token, kind, listQuery, tablePage, createAbout) {
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
    if (valid(response)) {
      message('创建成功', 'success')
      frontendData(token, kind, listQuery, tablePage)
      // refresh()
    }
  })
}
export function applyOperation(token, kind, listQuery, tablePage, updateAbout) {
  updateAbout.actionDialogVisible = false
  // if (typeof this.updateJsonData === 'string') {
  //   this.updateJsonData = JSON.parse(this.updateJsonData)
  // }
  if (!updateAbout.ifJsonEditorForUpdate) {
    updateJsonObj(updateAbout.updateJsonData, updateAbout.updateFormConfig)
  }
  // this.createJsonData = JSON.parse(this.createJsonData);
  updateResource({
    token,
    json: updateAbout.updateJsonData
  }).then((response) => {
    if (valid(response)) {
      frontendData(token, kind, listQuery, tablePage)
      // for (const key in this.list) {
      //   this.list[key].val = ''
      // }
      message('更新成功', 'success')
    }
  })
}
export function message(message, type) {
  Message({
    message: message || '操作成功',
    type: type || 'info',
    duration: 3000
  })
}
export function createJson(token, kind, createAbout) {
  getResource({
    token,
    kind: 'Template',
    name: kind.toLowerCase() + '-' + 'create',
    namespace: 'default'
  }).then((response) => {
    if (valid(response)) {
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
export function handleActionChange(action, row, token, kind, listQuery, tablePage, updateAbout) {
  if (action === 'update') {
    getResource({
      token,
      kind,
      name: row.metadata.name,
      namespace: row.metadata.namespace
    }).then((response) => {
      if (valid(response)) {
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
      if (valid(response)) {
        frontendData(token, kind, listQuery, tablePage)
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
      if (valid(response)) {
        updateAbout.updateJsonData = response.data
        getResource({
          token,
          kind: 'Template',
          name: kind.toLowerCase() + '-' + action.toLowerCase(),
          namespace: 'default'
        }).then((response) => {
          if (valid(response)) {
            updateAbout.updateResourceTitle = response.data.spec.data.key
            updateAbout.ifJsonEditorForUpdate = false
            // 比如 action 是 scaleup 的时候，这里可能代表的就是需要修改的一些属性字段的信息
            // id是 spec.replicas
            // type 是字段的类型
            // value 是这个字段默认的值，bool 是 true, string 是 ''
            updateAbout.updateFormConfig = []
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
    name: 'tags-' + vueComponentObject.kind.toLowerCase()
  }).then(response => {
    if (valid(response)) {
      vueComponentObject.tags = response.data.spec.tags
      vueComponentObject.label = response.data.spec.label
    }
  })
}


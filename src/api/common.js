import { getResource, listResources } from '@/api/k8sResource'
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


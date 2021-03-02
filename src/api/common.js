import { getResource, listResources } from '@/api/k8sResource'
export default function valid(response) {
  return response.data !== null && response.data !== 404 && response.data.code !== 404
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

export async function frontend(token, kind, listQuery) {
  let res = {}
  // 获取上面搜索表单的信息
  res = await getResource({
    token,
    kind: 'Frontend',
    name: 'formsearch-' + kind.toLowerCase(),
    namespace: 'default'
  }).then((response) => {
    if (valid(response)) {
      res.dynamicFormJson = response.data.spec.data
      // res.message = this.responseJson.model
      res.dynamicFormVisible = true
      return res
    }
  })
  // 获取表头信息
  res = await getResource({
    token,
    kind: 'Frontend',
    name: 'table' + '-' + kind.toLowerCase(),
    namespace: 'default'
  }).then((response) => {
    if (valid(response)) {
      res.tableColumns = response.data.spec.data
      return res
    }
  })
  // 获取表格数据
  res = await listResources({
    token,
    kind,
    limit: listQuery.limit,
    page: listQuery.continue,
    labels: listQuery.labels
  }).then((response) => {
    if (valid(response)) {
      res.tableItems = response.data.items
      res.tableItemsSize = response.data.metadata.totalCount
      listQuery.continue = response.data.metadata.continue
      // this.listLoading = false
      return res
    }
  })

  // 获取可以进行的操作
  res = await getResource({
    token,
    kind: 'Frontend',
    name: 'action-' + kind.toLowerCase(),
    namespace: 'default'
  }).then((response) => {
    if (valid(response)) {
      if (response.hasOwnProperty('data')) {
        res.actions = response.data.spec.data
      } else {
        res.actions = []
      }
      return res
    }
  })

  res = await getResource({
    token,
    kind: 'Frontend',
    name: 'desc-' + kind.toLowerCase(),
    namespace: 'default'
  }).then((response) => {
    if (valid(response)) {
      res.desc = response.data.spec.desc
      return res
    }
  })

  return res
}

export async function frontendData(token, kind, listQuery) {

}


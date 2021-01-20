<template>
  <div>
    <div class="app-container" style="margin-bottom: 20px">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item>
          <template slot="title">
            功能描述<i class="header-icon el-icon-info" />
          </template>
          <div v-text="desc" />
        </el-collapse-item>
      </el-collapse>
    </div>

    <div class="app-container">
      <dynamic-form
        v-if="formVisible"
        :form-data="responseJson"
        :kind="kind"
        @watchSearch="searchList"
      />

      <div class="base-button-container">
        <el-button
          icon="el-icon-plus"
          type="primary"
          class="filter-item"
          circle
          @click.native="createJson"
        />

        <el-button
          icon="el-icon-refresh"
          class="filter-item"
          round
          @click.native="getList"
        >刷新页面
        </el-button>
      </div>

      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        highlight-current-row
        :header-cell-style="{ 'background-color': '#eef1f6', color: '#606266' }"
      >
        <el-table-column
          v-for="item in columns"
          :key="item.key"
          :label="item.label"
        >
          <template slot-scope="scope">
            <router-link
              v-if="item.kind == 'a'"
              :to="{
                path: resourceInfo,
                query: {
                  tabName: tabName,
                  name: getInputValue(scope.row.json, item.row),
                  nodeName: scope.row.json.spec.nodeName,
                  namespace: scope.row.json.metadata.namespace,
                },
              }"
              tag="a"
              class="link"
            >{{ getInputValue(scope.row.json, item.row) }}</router-link>
            <span v-if="item.kind === undefined">{{
              getInputValue(scope.row.json, item.row)
            }}</span>
            <el-select
              v-if="item.kind === 'action'"
              v-model="scope.row.val"
              placeholder="请选择"
              @change="handleAction($event, scope.row.json)"
            >
              <el-option
                v-for="item in actions"
                :key="item.key"
                :label="item.key"
                :value="item.type"
              />
            </el-select>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import {
  getResource,
  listResources,
  deleteResource,
  createResource,
  updateResource
} from '@/api/k8sResource'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import JsonEditor from '@/components/JsonEditor'
import DynamicForm from '@/components/DynamicForm'
import { mapGetters } from 'vuex'
import { getList } from '@/api/table'

export default {
  name: 'DynamicTable',
  components: { Pagination, JsonEditor, DynamicForm },
  props: {
    tabName: {
      type: String,
      default: 'Pod'
    }
  },

  data() {
    return {
      pollingId: undefined,
      activeName: '1',
      tableKey: 0,
      desc: '',

      formVisible: false,

      list: [],
      listLoading: true,
      columns: [],
      listQuery: {
        page: 1,
        limit: 10,
        continue: 1
      },
      total: 0,
      namespace: 'default',
      kind: '',
      actions: [],
      listJsonTemp: '',
      createJsonData: {},
      createDialogVisible: false,
      createResource: '创建对象',
      createTemplate: {},
      actionDialogVisible: false,
      responseJson: {},

      Variables: [],
      createTableData: [],
      customizedAction: false,
      propertiesInfo: [],
      message: {},
      resourceInfo: ''
    }
  },
  computed: {
    ...mapGetters(['token'])
  },

  created() {
    this.kind = this.$route.name // 该资源的名字

    // 获取上面搜索表单的信息
    getResource({
      token: this.token,
      kind: 'Frontend',
      name: 'formsearch-' + this.kind.toLowerCase(),
      namespace: 'default'
    }).then((response) => {
      this.responseJson = response.data.spec.data
      this.message = this.responseJson.model
      this.formVisible = true
    })

    // 获取表头信息
    getResource({
      token: this.token,
      kind: 'Frontend',
      name: 'table' + '-' + this.kind.toLowerCase(),
      namespace: 'default'
    }).then((response) => {
      if (this.$valid(response)) {
        this.columns = response.data.spec.data
        // 获取表格数据
        listResources({
          token: this.token,
          kind: this.kind,
          limit: this.listQuery.limit,
          page: this.listQuery.continue
        }).then((response) => {
          if (this.$valid(response)) {
            this.listJsonTemp = response.data.items
            this.total = response.data.metadata.totalCount
            this.listQuery.continue = response.data.metadata.continue
            this.listLoading = false
            // 获取可以进行的操作
            getResource({
              token: this.token,
              kind: 'Frontend',
              name: 'action-' + this.kind.toLowerCase(),
              namespace: 'default'
            }).then((response) => {
              if (this.$valid(response)) {
                if (response.hasOwnProperty('data')) {
                  this.actions = response.data.spec.data
                } else {
                  this.actions = []
                }
                // 这里的 list 就是最后传进 table 的 data prop的数据
                for (let i = 0; i < this.listJsonTemp.length; i++) {
                  this.list.push({})
                  this.list[i].json = this.listJsonTemp[i]
                  this.list[i].actions = this.actions
                  this.list[i].val = ''
                }
              }
            })
          }
        })
      }
    })

    getResource({
      token: this.token,
      kind: 'Frontend',
      name: 'desc-' + this.kind.toLowerCase(),
      namespace: 'default'
    }).then((response) => {
      if (this.$valid(response)) {
        this.desc = response.data.spec.desc
      }
    })
    this.pollingId = setInterval(this.getList, 10000)
  },
  beforeDestroy() {
    console.log(this.pollingId)
    clearInterval(this.pollingId)
  },
  methods: {
    // 创建资源选择模板的时候触发的函数，比如选择 simple 模板的时候，这里的 event 就是选择的 value，或者说是模板的名字
    // 这里完成之后就是需要点击确定，转到 create() 来看接下来的逻辑
    handleModel(event) {
      // 获取创建的模板信息，里面可能会有创建这资源所需要填写的字段的信息
      getResource({
        token: this.token,
        kind: 'Template-' + this.name.toLowerCase(),
        name: this.kind.toLowerCase() + '-create.' + event,
        namespace: 'default'
      }).then((response) => {
        if (this.$valid(response)) {
          // 这个 otherOperation 应该就是看有没有提供创建的模板所需要填写的字段的信息，没有的话就需要手动填写 json 字符串
          this.customizedAction = true
          // 这里的 RS 我理解为 Resource，就是创建这个资源的模板 template 字段的信息
          this.createTemplate = response.data.spec.data.template
          console.log(this.createTemplate)
          // 生成之后就会变成填写字段信息表格的数据来源数组
          this.createTableData = []
          if (response.hasOwnProperty('data')) {
            // 字段信息的一个临时副本，其他方法会用的比如 create()
            this.propertiesInfo = response.data.spec.data.values
            for (let i = 0; i < this.propertiesInfo.length; i++) {
              this.createTableData.push({})
              // 当前这个字段变量的名字
              this.createTableData[i].nameVariable = this.propertiesInfo[
                i
              ].name
              // 如果像是这种的
              // "metadata.name,
              //  metadata.labels.job-name,
              //  spec.selector.matchLabels.job-name,
              //  spec.template.metadata.labels.job-name,
              //  spec.template.spec.containers[0].name"
              if (this.propertiesInfo[i].id.indexOf(',') > 0) {
                // 这里的意思是只取第一个，比如这里的 metadata.name
                this.createTableData[i].id = this.propertiesInfo[
                  i
                ].id.substring(0, this.propertiesInfo[i].id.indexOf(','))
              } else {
                // 比如只有 metadata.name 这种的
                this.createTableData[i].id = this.propertiesInfo[i].id
              }
              this.createTableData[i].type = this.propertiesInfo[i].type
              if (this.propertiesInfo[i].type === 'bool') {
                this.createTableData[i].value = true
                // 这里的 placeholder 是指在生成表格的时候，需要填写字段信息的 input 组件的 placeholder（我也不知道怎么翻译）
                this.createTableData[i].placeholder = this.propertiesInfo[
                  i
                ].type
              } else {
                this.createTableData[i].value = ''
                this.createTableData[i].placeholder = this.propertiesInfo[
                  i
                ].type
              }
            }
          }
        }
      })
    },

    searchList() {
      this.list = []
      this.listJsonTemp = ''
      this.listLoading = false
      listResources({
        token: this.token,
        kind: this.kind,
        labels: this.message,
        limit: 10,
        page: 1
      }).then((response) => {
        this.listJsonTemp = response.data.items
        this.total = response.data.metadata.totalCount
        getResource({
          token: this.token,
          kind: 'Frontend',
          name: 'action-' + this.kind.toLowerCase(),
          namespace: 'default'
        }).then((response) => {
          if (this.$valid(response)) {
            if (response.hasOwnProperty('data')) {
              this.actions = response.data.spec.data
            } else {
              this.actions = []
            }

            for (var i = 0; i < this.listJsonTemp.length; i++) {
              this.list.push({})
              this.list[i].json = this.listJsonTemp[i]
              this.list[i].actions = this.actions
              this.list[i].val = ''
            }
          }
        })
      })
    },

    // 将表格的 list 和 action 进行更新
    getList() {
      // this.listLoading = true
      // this.list = []
      listResources({
        token: this.token,
        kind: this.kind,
        limit: this.listQuery.limit,
        page: this.listQuery.page,
        labels: this.message
      }).then((response) => {
        if (this.$valid(response)) {
          this.listJsonTemp = response.data.items
          this.total = response.data.metadata.totalCount
          // this.total = response.data.metadata.remainingItemCount + 10
          // this.listQuery.page = this.listQuery.page + 1
          this.listQuery.continue = response.data.metadata.continue
          // this.listLoading = false
          getResource({
            token: this.token,
            kind: 'Frontend',
            name: 'action-' + this.kind.toLowerCase(),
            namespace: 'default'
          }).then((response) => {
            this.$valid(response) ? this.actions = response.data.spec.data : this.actions = []
            for (let i = 0; i < this.listJsonTemp.length; i++) {
              if (!this.list[i]) {
                this.list.push({})
              }
              this.list[i].json = this.listJsonTemp[i]
              this.list[i].actions = this.actions
              this.list[i].val = ''
            }
            if (this.list.length > this.listJsonTemp.length) {
              const start = this.listJsonTemp.length
              const end = this.list.length - 1
              this.list.splice(start, end)
            }
          })
        }
      })
    },

    handleAction(event, row) {
      this.customizedAction = false

      if (event === 'update') {
        getResource({
          token: this.token,
          kind: this.kind,
          name: row.metadata.name,
          namespace: row.metadata.namespace
        }).then((response) => {
          if (this.$valid(response)) {
            console.log(response)
          }
        })
      } else if (event === 'delete') {
        deleteResource({
          token: this.token,
          kind: this.kind,
          name: row.metadata.name,
          namespace: row.metadata.namespace
        }).then((response) => {
          if (this.$valid(response)) {
            this.getList()
            this._message('删除成功', 'success')
          }
        }).bind(this)
      } else {
        getResource({
          token: this.token,
          kind: 'Template',
          name: this.kind.toLowerCase() + '-' + event.toLowerCase()
        }).then((response) => {
          if (this.$valid(response)) {
            this.dialogTitle = response.data.spec.data.key
            this.customizedAction = true
            // 比如 action 是 scaleup 的时候，这里可能代表的就是需要修改的一些属性字段的信息
            // id是 spec.replicas
            // type 是字段的类型
            // value 是这个字段默认的值，bool 是 true, string 是 ''
            this.Variables = []
            if (response.hasOwnProperty('data')) {
              const nameVariables = response.data.spec.data.values
              for (var i = 0; i < nameVariables.length; i++) {
                this.Variables.push({})
                this.Variables[i].nameVariable = nameVariables[i].name
                this.Variables[i].id = nameVariables[i].id
                this.Variables[i].type = nameVariables[i].type
                if (nameVariables[i].type === 'bool') {
                  this.Variables[i].value = true
                  this.Variables[i].placeholder = nameVariables[i].type
                } else {
                  this.Variables[i].value = ''
                  this.Variables[i].placeholder = nameVariables[i].type
                }
              }
            }
          }
        })
      }

      // if (event === "update") {

      // } else if (event === "delete") {
      //   deleteResource({
      //     token: this.token,
      //     kind: this.kind,
      //     namespace: this.namespace,
      //     name: row.metadata.name,
      //   }).then((response) => {
      //     if (this.$valid(response)) {
      //       const deleteName = response.data.details
      //         ? response.data.details.name
      //         : response.data.metadata.name;
      //       this.listLoading = true;
      //       const id = setInterval(
      //         function () {
      //           getResource({
      //             token: this.token,
      //             name: deleteName,
      //             kind: this.kind,
      //             namespace: this.namespace,
      //           }).then((response) => {
      //             if (!this.$valid(response)) {
      //               clearInterval(id);
      //               // if (this.message) {
      //               //   this.searchList(this.message)
      //               // } else {
      //               //   this.refresh()
      //               // }
      //               this.getList();
      //               this._message("删除成功", "success");
      //             }
      //           });
      //         }.bind(this),
      //         500
      //       );
      //     }
      //   });
      // } else {
      //   console.log("")
      // }
    },

    create() {
      let createTemplateTemp
      let propertiesRequired
      // 创建资源的 dialog 需要消失
      this.createDialogVisible = false
      for (const key in this.createTableData) {
        // 如果 id 是长长的一串
        // 例如 ...,...,... 这种，就将这个长字符串按 ','  分成字符串数组 ['...','...','...']
        if (this.propertiesInfo[key].id.indexOf(',') > 0) {
          propertiesRequired = this.propertiesInfo[key].id.split(',')
        } else {
          propertiesRequired = []
          propertiesRequired.push(this.propertiesInfo[key].id)
          console.log(propertiesRequired)
        }

        // 这里是针对每一个属性进行一个循环
        for (let j = 0; j < propertiesRequired.length; j++) {
          createTemplateTemp = this.createTemplate
          const pathToProperty = propertiesRequired[j].split('.')
          // pathToProperty 数组中最后一个元素是我们的目标属性，所以要解析前面的中间属性
          for (let i = 0; i < pathToProperty.length - 1; i++) {
            // console.log(longkey[i]);
            if (pathToProperty[i].indexOf('[') > 0) {
              // 获得 example[index] 的 example 数组对象
              createTemplateTemp =
                createTemplateTemp[
                  pathToProperty[i].substring(0, pathToProperty[i].indexOf('['))
                ]
              // 获得 example 数组对象里面的 index 索引下的对象
              createTemplateTemp =
                createTemplateTemp[
                  parseInt(
                    pathToProperty[i].substring(
                      pathToProperty[i].indexOf('[') + 1,
                      pathToProperty[i].indexOf(']')
                    )
                  )
                ]
              // console.log(createJsonDataTmp);
            } else {
              createTemplateTemp = createTemplateTemp[pathToProperty[i]]
              // console.log(createJsonDataTmp);
            }
          }
          // 处理目标属性，是 example 这种 还是 exapmle[index] 这种
          if (pathToProperty[pathToProperty.length - 1].indexOf('[') > 0) {
            createTemplateTemp =
              createTemplateTemp[
                pathToProperty[pathToProperty.length - 1].substring(
                  0,
                  pathToProperty[pathToProperty.length - 1].indexOf('[')
                )
              ]

            if (this.createTableData[key].type === 'integer') {
              createTemplateTemp[
                parseInt(
                  pathToProperty[pathToProperty.length - 1].substring(
                    pathToProperty[pathToProperty.length - 1].indexOf('[') + 1,
                    pathToProperty[pathToProperty.length - 1].indexOf(']')
                  )
                )
              ] = Number(this.createTableData[key].value) // 这里的 value 就是用户填写的信息
            } else {
              createTemplateTemp[
                parseInt(
                  pathToProperty[pathToProperty.length - 1].substring(
                    pathToProperty[pathToProperty.length - 1].indexOf('[') + 1,
                    pathToProperty[pathToProperty.length - 1].indexOf(']')
                  )
                )
              ] = this.createTableData[key].value
            }
          } else if (this.createTableData[key].type === 'integer') {
            createTemplateTemp[
              pathToProperty[pathToProperty.length - 1]
            ] = Number(this.createTableData[key].value)
          } else {
            createTemplateTemp[
              pathToProperty[pathToProperty.length - 1]
            ] = this.createTableData[key].value
          }
        }
      }

      if (typeof this.createTemplate === 'string') {
        this.createTemplate = JSON.parse(this.createTemplate)
      }
      // 新建资源
      createResource({
        token: this.token,
        json: this.createTemplate
      }).then((response) => {
        if (this.$valid(response)) {
          this._message('创建成功', 'success')
          this.successCreate = 'success'
          // this.refresh()
          this.getList()
        }
      })
    },
    // 获取创建资源的模板信息，models 存有下拉列表的选项数据
    createJson() {
      this.createDialogVisible = true

      getResource({
        token: this.token,
        kind: 'Template',
        name: this.kind.toLowerCase() + '-' + 'create',
        namespace: 'default'
      }).then((response) => {
        if (this.$valid(response)) {
          this.customizedAction = true
        }
      })
    },

    // 用于更新的 action 提交
    applyOperation() {
      this.actionDialogVisible = false
      // createJsonData 是得到的这个资源的 json 文件，更新的时候需要在这里进行更改
      if (typeof this.createJsonData === 'string') {
        this.createJsonData = JSON.parse(this.createJsonData)
      }

      let createJsonDataTmp = this.createJsonData
      for (const key in this.Variables) {
        const longkey = this.Variables[key].id.split('.')
        for (let i = 0; i < longkey.length - 1; i++) {
          createJsonDataTmp = createJsonDataTmp[longkey[i]]
          console.log(this.createJsonData)
        }
        if (this.Variables[key].type === 'integer') {
          createJsonDataTmp[longkey[longkey.length - 1]] = Number(
            this.Variables[key].value
          )
        } else {
          createJsonDataTmp[longkey[longkey.length - 1]] = this.Variables[
            key
          ].value
        }
      }
      // this.createJsonData = JSON.parse(this.createJsonData);

      updateResource({
        token: this.token,
        json: this.createJsonData
      }).then((response) => {
        if (response.code === 20000) {
          this.getList()
          for (var key in this.list) {
            this.list[key].val = ''
          }
          this._message('更新成功', 'success')
        }
      })
    },

    _message(message, type) {
      this.$message({
        message: message || '操作成功',
        type: type || 'info',
        duration: 3000
      })
    },

    getInputValue(scope, longKey) {
      if (JSON.stringify(scope) === '{}' || !longKey) {
        return ''
      }
      if (longKey.indexOf('.') < 0) {
        if (longKey === 'unknown') {
          return '无'
        } else {
          return scope[longKey]
        }
      }
      const keys = longKey.split('.')
      let res = scope
      keys.every((item) => {
        if (item.indexOf('[') > 0) {
          res = res[item.substring(0, item.indexOf('['))]
          if (res === undefined || res.length === 0) {
            res = 'unknown'
            return false
          } else {
            res =
              res[
                parseInt(
                  item.substring(item.indexOf('[') + 1, item.indexOf(']'))
                )
              ]
            return true
          }
        } else {
          // todo 这里代码有问题，if走不到
          if (res && res[item]) {
            res = res[item]
            return true
          } else {
            res = '无'
            return false
          }
        }
      })
      // console.log(res)
      return res
    },

    updateInputValue(scope, longKey, event) {
      if (longKey.indexOf('.') < 0) {
        scope[longKey] = event
        return
      }
      var keys = longKey.split('.')
      var obj = scope
      for (var i = 0; i < keys.length; i++) {
        var element = keys[i]
        if (element.indexOf('[') > 0) {
          obj = obj[element.substring(0, element.indexOf('['))]
          obj =
            obj[
              parseInt(
                element.substring(
                  element.indexOf('[') + 1,
                  element.indexOf(']')
                )
              )
            ]
        } else {
          obj = obj[element]
        }
      }
      obj[keys[keys.length - 1]] = event
    }
  }
}
</script>

<style scoped>
.dynamic-form-container {
  margin-bottom: 30px;
}

.base-button-container {
  padding: 10px;
  margin-bottom: 22px;
}

.link {
  color: red;
  cursor: pointer;
}

a:hover {
  text-decoration: underline;
}

input {
  height: 35px;
}
</style>

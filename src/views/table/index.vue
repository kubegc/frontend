<template>
  <div>
    <div class="app-container" style="margin-bottom: 20px">
      <el-collapse v-model="tablePage.activeName" accordion>
        <el-collapse-item>
          <template slot="title">
            功能描述<i class="header-icon el-icon-info" />
          </template>
          <div v-text="tablePage.desc" />
        </el-collapse-item>
      </el-collapse>
    </div>

    <div class="app-container">
      <dynamic-form
        v-if="tablePage.dynamicFormVisible"
        :form-data="tablePage.dynamicFormJson"
        :kind="kind"
        @watchSearch="search($event)"
      />

      <div class="base-button-container">
        <el-button
          icon="el-icon-plus"
          type="primary"
          class="buttonShadow"
          circle
          @click.native="createJson"
        />

        <el-button
          icon="el-icon-refresh"
          round
          @click.native="refresh"
        >刷新页面
        </el-button>
      </div>

      <el-table
        ref="table"
        v-loading="tablePage.listLoading"
        :data="tablePage.tableData"
        highlight-current-row
        :header-cell-style="{ 'background-color': '#eef1f6', color: '#606266' }"
      >
        <el-table-column
          v-for="item in tablePage.tableColumns"
          :key="item.key"
          :label="item.label"
        >
          <template slot-scope="scope">
            <router-link
              v-if="item.kind === 'internalLink'"
              :to="{
                name: item.link.indexOf('@') === -1 ? item.link : getInputValue(scope.row.json, item.link.substring(1)),
                params: {
                  // tabName: tabName,
                  // name: getInputValue(scope.row.json, item.row),
                  // nodeName: scope.row.json.spec.nodeName,
                  // namespace: scope.row.json.metadata.namespace,
                  key: item.tag,
                  value: item.tag ? getInputValue(scope.row.json, item.row.indexOf('@') === -1 ? item.row : item.row.substring(1)) : undefined
                }
              }"
              class="link"
            >
              <el-link type="primary">{{ item.row.indexOf('@') === -1 ? getInputValue(scope.row.json, item.row) : item.label }}</el-link>
            </router-link>
            <el-link v-if="item.kind === 'externalLink'" type="primary" :href="getInputValue(scope.row.json, item.row)">{{ getInputValue(scope.row.json, item.row) }}</el-link>
            <span v-if="item.kind === undefined">{{
              getInputValue(scope.row.json, item.row)
            }}</span>
            <el-link v-if="item.kind === 'terminal'" type="primary" :underline="false" :href="getTerminalAddr(scope.row.json, item)" target="_blank">
              <svg-icon
                icon-class="pc"
              />
            </el-link>
            <el-select
              v-if="item.kind === 'action'"
              v-model="scope.row.val"
              placeholder="请选择"
              @change="handleActionChange($event, scope.row.json)"
            >
              <el-option
                v-for="item in tablePage.actions"
                :key="item.key"
                :label="item.key"
                :value="item.type"
              />
            </el-select>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="tablePage.tableItemsSize > 0"
        :auto-scroll="false"
        :total="tablePage.tableItemsSize"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="refresh"
      />
      <JsonDialog
        :json-editor="ifJsonEditorForCreate"
        :title="createResourceTitle"
        :value.sync="createDialogVisible"
        :json-file-obj="createJsonPattern"
        :create-templates="createTemplates"
        :form-data="createFormConfig"
        @update:jsonFileObj="createJsonPattern = JSON.parse($event)"
        @action="create"
        @selectChange="handleModel($event)"
      />
      <JsonDialog
        :if-create="false"
        :json-editor="ifJsonEditorForUpdate"
        :title="updateResourceTitle"
        :value.sync="actionDialogVisible"
        :json-file-obj="updateJsonData"
        :form-data="updateFormConfig"
        @update:jsonFileObj="updateJsonData = JSON.parse($event)"
        @action="applyOperation"
      />
    </div>
  </div>
</template>

<script>
import { frontend, frontendData } from '@/api/common'
import {
  getResource,
  deleteResource,
  createResource,
  updateResource
} from '@/api/k8sResource'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import DynamicForm from '@/components/DynamicForm'
import { mapGetters } from 'vuex'
import JsonDialog from '@/components/JsonDialog'
export default {
  name: 'DynamicTable',
  components: { JsonDialog, Pagination, DynamicForm },
  props: {
    tabName: {
      type: String,
      default: 'Pod'
    }
  },
  data() {
    return {
      // 轮询
      pollingId: undefined,
      tablePage: {
        // 描述
        activeName: '1',
        desc: '',
        // 查询表单
        dynamicFormJson: {},
        dynamicFormVisible: false,
        // 动态表格
        tableData: [],
        listLoading: true,
        tableItems: {},
        tableColumns: [],
        tableItemsSize: 0,
        // 操作集
        actions: []
      },
      listQuery: {
        page: 0,
        limit: 10,
        labels: {}
      },
      // 资源相关
      namespace: 'default',
      kind: '',
      // 对话框
      updateJsonData: {},
      createDialogVisible: false,
      ifJsonEditorForCreate: true,
      ifJsonEditorForUpdate: true,
      createTemplates: [],
      createResourceTitle: '创建对象',
      updateResourceTitle: '更新对象',
      createJsonPattern: {},
      actionDialogVisible: false,
      updateFormConfig: [],
      createFormConfig: [],
      propertiesInfo: []
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  created() {
    this.kind = this.$route.name // 该资源的名字
    if (this.$route.params && this.$route.params.key) {
      const key = this.$route.params.key
      const value = this.$route.params.value
      this.listQuery.labels[key] = value
    }
    frontend(this.token, this.kind, this.listQuery, this.tablePage)
    frontendData(this.token, this.kind, this.listQuery, this.tablePage)
    // this.pollingId = setInterval(this.getList, 10000)
  },

  methods: {
    getTerminalAddr(json, item) {
      const params = item.row.split(',')
      const len = params.length
      let addr = item.link
      for (let i = 0; i < len; i++) {
        const currParam = this.getInputValue(json, params[i])
        addr = addr.replace('{' + (i + 1) + '}', currParam)
      }
      return addr
    },
    handleModel(event) {
      // 获取创建的模板信息，里面可能会有创建这资源所需要填写的字段的信息
      getResource({
        token: this.token,
        kind: 'Template',
        name: this.kind.toLowerCase() + '-create.' + event,
        namespace: 'default'
      }).then((response) => {
        if (this.$valid(response)) {
          // 就是创建这个资源的 json 模板
          this.createJsonPattern = response.data.spec.data.template
          // 生成之后就会变成填写字段信息表格的数据来源数组
          this.createFormConfig = []
          if (response.hasOwnProperty('data')) {
            this.createFormConfig = response.data.spec.data.values
            for (let i = 0; i < this.createFormConfig.length; i++) {
              if (this.createFormConfig[i].type === 'bool') {
                this.createFormConfig[i].value = true
              } else {
                this.createFormConfig[i].value = ''
              }
              this.createFormConfig[i].placeholder = this.createFormConfig[i].type
            }
          }
        }
      })
    },
    search(labels) {
      this.listQuery.labels = labels
      frontendData(this.token, this.kind, this.listQuery, this.tablePage)
    },
    // 将表格的 list 和 action 进行更新
    refresh() {
      frontendData(this.token, this.kind, this.listQuery, this.tablePage)
    },
    handleActionChange(event, row) {
      if (event === 'update') {
        getResource({
          token: this.token,
          kind: this.kind,
          name: row.metadata.name,
          namespace: row.metadata.namespace
        }).then((response) => {
          if (this.$valid(response)) {
            this.updateJsonData = response.data
            this.ifJsonEditorForUpdate = true
            this.updateResourceTitle = '更新对象'
            this.actionDialogVisible = true
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
            this.refresh()
            this._message('删除成功', 'success')
          }
        }).bind(this)
      } else {
        getResource({
          token: this.token,
          kind: this.kind,
          name: row.metadata.name,
          namespace: row.metadata.namespace
        }).then((response) => {
          if (this.$valid(response)) {
            this.updateJsonData = response.data
            getResource({
              token: this.token,
              kind: 'Template',
              name: this.kind.toLowerCase() + '-' + event.toLowerCase(),
              namespace: 'default'
            }).then((response) => {
              if (this.$valid(response)) {
                this.updateResourceTitle = response.data.spec.data.key
                this.ifJsonEditorForUpdate = false
                // 比如 action 是 scaleup 的时候，这里可能代表的就是需要修改的一些属性字段的信息
                // id是 spec.replicas
                // type 是字段的类型
                // value 是这个字段默认的值，bool 是 true, string 是 ''
                this.updateFormConfig = []
                if (response.hasOwnProperty('data')) {
                  this.updateFormConfig = response.data.spec.data.values
                  for (let i = 0; i < this.updateFormConfig.length; i++) {
                    if (this.updateFormConfig[i].type === 'bool') {
                      this.updateFormConfig[i].value = true
                    } else {
                      this.updateFormConfig[i].value = ''
                    }
                    this.updateFormConfig[i].placeholder = this.updateFormConfig[i].type
                  }
                }
                this.actionDialogVisible = true
              }
            })
          }
        })
      }
    },
    create() {
      // 创建资源的 dialog 需要消失
      this.createDialogVisible = false
      if (!this.ifJsonEditorForCreate) {
        this.updateJsonObj(this.createJsonPattern, this.createFormConfig)
      }
      // if (typeof this.createJsonPattern === 'string') {
      //   this.createJsonPattern = JSON.parse(this.createJsonPattern)
      // }
      // 新建资源
      createResource({
        token: this.token,
        json: this.createJsonPattern
      }).then((response) => {
        if (this.$valid(response)) {
          this._message('创建成功', 'success')
          // this.refresh()
          this.refresh()
        }
      })
    },
    // 获取创建资源的模板信息，models 存有下拉列表的选项数据
    createJson() {
      getResource({
        token: this.token,
        kind: 'Template',
        name: this.kind.toLowerCase() + '-' + 'create',
        namespace: 'default'
      }).then((response) => {
        if (this.$valid(response)) {
          // this.customizedAction = true
          if (response.data.spec && response.data.spec.data) {
            this.createTemplates = response.data.spec.data.support
            this.ifJsonEditorForCreate = false
          } else {
            this.ifJsonEditorForCreate = true
            this.createJsonPattern = response.data
          }
          this.createDialogVisible = true
        }
      })
    },
    // 用于更新的 action 提交
    applyOperation() {
      this.actionDialogVisible = false
      // if (typeof this.updateJsonData === 'string') {
      //   this.updateJsonData = JSON.parse(this.updateJsonData)
      // }
      if (!this.ifJsonEditorForUpdate) {
        this.updateJsonObj(this.updateJsonData, this.updateFormConfig)
      }
      // this.createJsonData = JSON.parse(this.createJsonData);
      updateResource({
        token: this.token,
        json: this.updateJsonData
      }).then((response) => {
        if (this.$valid(response)) {
          this.refresh()
          // for (const key in this.list) {
          //   this.list[key].val = ''
          // }
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
      if (longKey.indexOf('.') === -1) {
        return scope[longKey]
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
          if (res && res[item] !== undefined) {
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
    // updateInputValue(scope, longKey, event) {
    //   if (longKey.indexOf('.') < 0) {
    //     scope[longKey] = event
    //     return
    //   }
    //   const keys = longKey.split('.')
    //   let obj = scope
    //   for (let i = 0; i < keys.length; i++) {
    //     const element = keys[i]
    //     if (element.indexOf('[') > 0) {
    //       obj = obj[element.substring(0, element.indexOf('['))]
    //       obj =
    //         obj[
    //           parseInt(
    //             element.substring(
    //               element.indexOf('[') + 1,
    //               element.indexOf(']')
    //             )
    //           )
    //         ]
    //     } else {
    //       obj = obj[element]
    //     }
    //   }
    //   obj[keys[keys.length - 1]] = event
    // },
    updateJsonObj(jsonObj, configArray) {
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
input {
  height: 35px;
}
.buttonShadow{
  box-shadow: 0 8px 16px 0 rgba(36, 46, 66, 0.28);
}
</style>

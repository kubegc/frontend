<template>
  <div class="app-container">
    <div>
      <dynamic-form v-if="formVisible" :form-data="responseJson" :kind="catalog_operator" @watchSearch="searchList"/>
    </div>
    <div class="filter-container" style="margin-bottom:50px">
      <el-button
        icon="el-icon-plus"
        style="float:left"
        type="primary"
        class="filter-item"
        @click.native="createJson"
      >{{ this.createResource }}
      </el-button>
      <el-button
        icon="el-icon-refresh"
        style="float:left;margin-right:20px"
        class="filter-item"
        @click.native="refresh"
      >刷新页面
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      @sort-change="sortChange"
    >
      <el-table-column
        v-for="item in columns"
        :key="item.key"
        :label="item.label"
        align="left"
        :width="item.width"
      >
        <template slot-scope="scope">
          <router-link
            v-if="item.kind == 'a'"
            :to="{path:'/resourceInfo/metadataInfo',query:{kind: catalog_operator, name:scope.row.json}}"
            tag="a"
            class="link"
            @click="getData"
          >{{ getInputValue(scope.row.json, item.row) }}
          </router-link>
          <span v-if="item.kind == undefined">{{ getInputValue(scope.row.json, item.row) }}</span>
          <svg-icon
            v-if="item.kind == 'terminal'"
            icon-class="pc"
            class-name="custom-class"
            @click="openTerminal(scope.row)"
          />
          <el-select
            v-if="item.kind == 'action'"
            v-model="scope.row.val"
            placeholder="更多操作"
            @change="(handleUpdate($event, scope.row.json))"
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

    <el-dialog
      v-el-drag-dialog
      :visible.sync="actionDialogTableVisible"
      :title="this.dialogTitle"
      @dragDialog="handleDrag"
    >
      <div class="card-editor-container">
        <json-editor v-if="otherOperation==false" ref="jsonEditor" v-model="createJsonData"/>
      </div>
      <el-table
        v-if="otherOperation==true"
        v-loading="listLoading"
        :data="Variables"
        border
        fit
        highlight-current-row
        style="width: 100%;margin-top:20px"
        @sort-change="sortChange"
      >
        <el-table-column label="key" align="center">
          <template slot-scope="{row}">
            <span>{{ row.nameVariable }}</span>
          </template>
        </el-table-column>
        <el-table-column label="value" align="center">
          <template slot-scope="{row}">
            <el-radio-group v-if="row.placeholder == 'bool'" v-model="row.value">
              <el-radio :label="true">true</el-radio>
              <el-radio :label="false">false</el-radio>
            </el-radio-group>
            <input
              v-if="row.placeholder != 'bool'"
              style="border-radius:8px;border:1px solid grey;outline:none"
              class="el-input"
              :placeholder="row.placeholder"
              :value="getInputValue(row,'value')"
              @input="updateInputValue(row,'value',$event.target.value)"
            >
          </template>
        </el-table-column>
      </el-table>
      <div style="width:100%;height:50px;">
        <el-button
          type="primary"
          style="float:right;margin-top:20px;height:40px;display:inline;"
          @click.native="applyOperation"
        >确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      :visible.sync="createDialogTableVisible"
      :title="this.createResource"
      @dragDialog="handleDrag"
    >
      <div class="card-editor-container">
        <!-- <p>请填写JSON格式（因版本兼容性约束，请使用以下的group和version信息创建资源）</p> -->
        <json-editor v-if="otherOperation==false" ref="jsonEditor" v-model="createRSJson"/>
        <div v-if="otherOperation==true">
          请选择模版：
          <el-select v-model="createModel" placeholder="选择模版" @change="(handleModel($event))">
            <el-option v-for="item in models" :key="item" :label="item" :value="item"/>
          </el-select>
        </div>
        <el-table
          v-if="otherOperation === true"
          v-loading="listLoading"
          :data="CVariables"
          border
          fit
          highlight-current-row
          style="width: 100%;margin-top:20px"
          @sort-change="sortChange"
        >
          <el-table-column label="key" align="center">
            <template slot-scope="{row}">
              <span>{{ row.nameVariable }}</span>
            </template>
          </el-table-column>
          <el-table-column label="value" align="center">
            <template slot-scope="{row}">
              <el-radio-group v-if="row.placeholder == 'bool'" v-model="row.value">
                <el-radio :label="true">true</el-radio>
                <el-radio :label="false">false</el-radio>
              </el-radio-group>
              <input
                v-if="row.placeholder != 'bool'"
                style="border-radius:8px;border:1px solid grey;outline:none"
                class="el-input"
                :placeholder="row.placeholder"
                :value="getInputValue(row,'value')"
                @input="updateInputValue(row,'value',$event.target.value)"
              >
            </template>
          </el-table-column>
        </el-table>

        <div style="width:100%;height:50px;">
          <el-button
            type="primary"
            style="float:right;margin-top:20px;height:40px;display:inline;"
            @click.native="create"
          >确认
          </el-button>
          <!-- <el-button type="primary" style="float:right;margin-top:20px;height:40px;display:inline;margin-right:0px;" >取消</el-button> -->
        </div>
      </div>
    </el-dialog>
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
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Bus from '@/utils/Bus'
import JsonEditor from '@/components/JsonEditor'
import elDragDialog from '@/directive/el-drag-dialog'
import { connectTerminal } from '@/api/commonKindMethod'
import DynamicForm from '@/components/DynamicForm'
import { mapGetters } from 'vuex'

export default {
  name: 'NodeTable',
  components: { Pagination, JsonEditor, DynamicForm },
  directives: { waves, elDragDialog },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      formVisible: false,
      tableKey: 0,
      list: [],
      listLoading: true,
      downloadLoading: false,
      columns: [],
      listQuery: {
        page: 1,
        limit: 10,
        continue: 1
      },
      total: 0,
      frontend_kind: 'Frontend',
      table_kind: 'table',
      catalog_operator: '',
      actions: [],
      listJsonTemp: '',
      createJsonData: {},
      createDialogTableVisible: false,
      createResource: '创建对象',
      createRSJson: {},
      actionDialogTableVisible: false,
      responseJson: {},
      formsearch_kind: 'formsearch',
      namespace: 'default',
      Variables: [],
      CVariables: [],
      container_kind: 'Container',
      otherOperation: false,
      createModel: '',
      models: '',
      nameTempVariables: [],
      message: {}
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  mounted() {
    // kind=Frontend&name=table-node
    // route name:frontend_kind-table_kind-catalog_operator
    var str = this.$route.name.split('-')
    if (str.length === 3) {
      this.frontend_kind = str[0]
      this.table_kind = str[1]
      this.catalog_operator = str[2]
    } else {
      this.frontend_kind = 'Frontend'
      this.table_kind = 'table'
      this.catalog_operator = this.$route.name
    }
  },
  created() {
    this.catalog_operator = this.$route.name
    this.responseJson = this.$route.meta.data
    this.dialogTitle = this.catalog_operator
    // 获取上面的表单的信息
    getResource({
      token: this.token,
      kind: this.frontend_kind,
      name: this.formsearch_kind + '-' + this.catalog_operator.toLowerCase(),
      namespace: 'default'
    }).then((response) => {
      this.responseJson = response.data.spec.data
      this.formVisible = true
    })

    // 获取表头信息
    getResource({
      token: this.token,
      kind: this.frontend_kind,
      name: this.table_kind + '-' + this.catalog_operator.toLowerCase(),
      namespace: 'default'
    }).then((response) => {
      if (this.validateRes(response) === 1) {
        this.columns = response.data.spec.data
        // 获取表格数据
        listResources({
          token: this.token,
          kind: this.catalog_operator,
          limit: this.listQuery.limit,
          page: this.listQuery.continue
        }).then((response) => {
          if (this.validateRes(response) === 1) {
            this.listJsonTemp = response.data.items
            this.total = response.data.metadata.totalCount
            this.listQuery.continue = response.data.metadata.continue
            this.listLoading = false
            // 获取可以进行的操作
            getResource({
              token: this.token,
              kind: this.frontend_kind,
              name: 'action-' + this.catalog_operator.toLowerCase(),
              namespace: 'default'
            }).then((response) => {
              if (this.validateRes(response) === 1) {
                if (response.hasOwnProperty('data')) {
                  this.actions = response.data.spec.data
                } else {
                  this.actions = []
                }
                // 这里的list就是最后传进table的data的数据
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
  },
  methods: {
    validateRes(res) {
      if (res.code === 20000) {
        return 1
      } else {
        this.$notify({
          title: 'error',
          message: res.data,
          type: 'warning',
          duration: 3000
        })
        return 0
      }
    },

    // 创建资源选择模板的时候触发的函数
    handleModel(event) {
      getResource({
        token: this.token,
        kind: this.container_kind + 'Template',
        name: this.catalog_operator.toLowerCase() + '-create.' + event,
        namespace: 'default'
      }).then((response) => {
        if (response.code === 20000) {
          this.otherOperation = true
          this.createRSJson = response.data.spec.data.template
          this.CVariables = []
          if (response.hasOwnProperty('data')) {
            var nameVariables = response.data.spec.data.values
            this.nameTempVariables = response.data.spec.data.values
            for (var i = 0; i < nameVariables.length; i++) {
              this.CVariables.push({})
              this.CVariables[i].nameVariable = nameVariables[i].name
              if (nameVariables[i].id.indexOf(',') > 0) {
                this.CVariables[i].id = nameVariables[i].id.substring(
                  0,
                  nameVariables[i].id.indexOf(',')
                )
              } else {
                this.CVariables[i].id = nameVariables[i].id
              }
              this.CVariables[i].type = nameVariables[i].type
              if (nameVariables[i].type === 'bool') {
                this.CVariables[i].value = true
                this.CVariables[i].placeholder = nameVariables[i].type
              } else {
                this.CVariables[i].value = ''
                this.CVariables[i].placeholder = nameVariables[i].type
              }
            }
          }
        }
      })
    },
    getData() {
      Bus.$emit('val', this.list)
    },

    searchList(message) {
      this.message = message
      this.list = []
      this.listJsonTemp = ''
      // this.total = response3.total
      console.log(message)
      this.listLoading = false
      listResources({
        token: this.token,
        kind: this.catalog_operator,
        labels: message,
        page: 1
      }).then((response) => {
        this.listJsonTemp = response.data.items
        this.total = response.data.metadata.totalCount
        getResource({
          token: this.token,
          kind: this.frontend_kind,
          name: 'action-' + this.catalog_operator.toLowerCase(),
          namespace: 'default'
        }).then((response) => {
          if (this.validateRes(response) == 1) {
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
      this.listLoading = true
      this.list = []
      listResources({
        token: this.token,
        kind: this.catalog_operator,
        limit: this.listQuery.limit,
        page: this.listQuery.page,
        labels: this.message
      }).then((response) => {
        if (this.validateRes(response) == 1) {
          this.listJsonTemp = response.data.items
          // this.total = response.data.metadata.remainingItemCount + 10
          // this.listQuery.page = this.listQuery.page + 1
          this.listQuery.continue = response.data.metadata.continue
          this.listLoading = false
          getResource({
            token: this.token,
            kind: this.frontend_kind,
            name: 'action-' + this.catalog_operator.toLowerCase(),
            namespace: 'default'
          }).then((response) => {
            if (this.validateRes(response) == 1) {
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
        }
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    handleDrag() {
      this.$refs.select.blur()
    },

    sortByID(order) {
      this.handleFilter()
    },
    handleUpdate(event, row) {
      console.log('event name is ' + event)
      this.otherOperation = false
      this.operator = event
      var name = row.metadata.name
      if (row.metadata.namespace !== undefined) {
        this.namespace = row.metadata.namespace
      }

      getResource({
        token: this.token,
        kind: this.container_kind + 'Template',
        name: this.catalog_operator.toLowerCase() + '-' + event.toLowerCase()
      }).then((response) => {
        if (response.code === 20000) {
          this.dialogTitle = response.data.spec.data.key
          this.otherOperation = true
          // 比如 action 是 scaleup 的时候，这里可能代表的就是需要修改的一些属性字段的信息
          // id是 spec.replicas
          // type 是字段的类型
          // vlue 是这个字段默认的值，bool 是 true, string 是 ''
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

      if (event === 'delete') {
        deleteResource({
          token: this.token,
          kind: this.catalog_operator,
          namespace: this.namespace,
          name: row.metadata.name
        }).then((response) => {
          if (this.validateRes(response) === 1) {
            var deleteName = response.data.metadata.name
            this.listLoading = true
            var id = setInterval(
              function() {
                getResource({
                  token: this.token,
                  name: deleteName,
                  kind: this.catalog_operator,
                  namespace: this.namespace
                }).then((response) => {
                  if (response.code === 20000 && response.data.code && response.data.code === 404) {
                    clearInterval(id)
                    this.refresh()
                    this._message('删除成功')
                  }
                })
              }.bind(this),
              500
            )
          }
        })
      } else if (event.slice(event.length - 8) === 'Instance') {
        getResource({
          token: this.token,
          name: name,
          kind: this.catalog_operator,
          namespace: this.namespace
        }).then((response) => {
          this.createJsonData = response.data
          this.createJsonData.spec.lifecycle = {}
          this.createJsonData.spec.lifecycle[event + 'Request'] = {}
          this.createJsonData.spec.lifecycle[event + 'Request'].instanceId =
            response.data.spec.data.instances[0].instanceId
          updateResource({
            json: this.createJsonData,
            kind: this.catalog_operator,
            namespace: this.namespace
          }).then((response) => {
            if (response.code === 20000) {
              for (var key in this.list) {
                this.list[key].val = ''
              }
              // this.handleSuccess();
              if (event === 'startInstance') {
                // this.listLoading = true;
                // var id = setInterval(
                //   function() {
                //     getObj({
                //       name: name,
                //       kind: this.catalog_operator,
                //       namespace: this.namespace
                //     }).then(response => {
                //       if (
                //         response.data.spec.data.instances[0].status == "Staring"
                //       ) {
                //         this.getList();
                //         clearInterval(id);
                //       }
                //     });
                //   }.bind(this),
                //   2 * 1000
                // );
              } else {
                this._message()
              }
            }
          })
        })
      } else {
        // 更新 update 的情况
        this.actionDialogTableVisible = true
        getResource({
          token: this.token,
          name: name,
          kind: this.catalog_operator,
          namespace: this.namespace
        }).then((response) => {
          this.listLoading = false
          this.createJsonData = response.data
          console.log(this.createJsonData)
        })
        for (var key in this.list) {
          this.list[key].val = ''
        }
      }
    },
    create() {
      this.createDialogTableVisible = false

      // console.log(createJsonDataTmp);
      // this.createRSJson = JSON.parse(this.createRSJson);
      for (const key in this.CVariables) {
        // var createJsonDataTmp = this.createRSJson;
        console.log(this.CVariables)
        console.log(createJsonDataTmp)
        if (this.nameTempVariables[key].id.indexOf(',') > 0) {
          var outerlongkey = this.nameTempVariables[key].id.split(',')
        } else {
          var outerlongkey = []
          outerlongkey.push(this.nameTempVariables[key].id)
          console.log(outerlongkey)
        }

        for (let j = 0; j < outerlongkey.length; j++) {
          var createJsonDataTmp = this.createRSJson
          var longkey = outerlongkey[j].split('.')

          // console.log(longkey)

          for (let i = 0; i < longkey.length - 1; i++) {
            // console.log(longkey[i]);
            if (longkey[i].indexOf('[') > 0) {
              createJsonDataTmp =
                createJsonDataTmp[
                  longkey[i].substring(0, longkey[i].indexOf('['))
                  ]
              createJsonDataTmp =
                createJsonDataTmp[
                  parseInt(
                    longkey[i].substring(
                      longkey[i].indexOf('[') + 1,
                      longkey[i].indexOf(']')
                    )
                  )
                  ]
              // console.log(createJsonDataTmp);
            } else {
              createJsonDataTmp = createJsonDataTmp[longkey[i]]
              // console.log(createJsonDataTmp);
            }
          }

          if (longkey[longkey.length - 1].indexOf('[') > 0) {
            createJsonDataTmp =
              createJsonDataTmp[
                longkey[longkey.length - 1].substring(
                  0,
                  longkey[longkey.length - 1].indexOf('[')
                )
                ]

            if (this.CVariables[key].type == 'integer') {
              createJsonDataTmp[
                parseInt(
                  longkey[longkey.length - 1].substring(
                    longkey[longkey.length - 1].indexOf('[') + 1,
                    longkey[longkey.length - 1].indexOf(']')
                  )
                )
                ] = Number(this.CVariables[key].value)
            } else {
              createJsonDataTmp[
                parseInt(
                  longkey[longkey.length - 1].substring(
                    longkey[longkey.length - 1].indexOf('[') + 1,
                    longkey[longkey.length - 1].indexOf(']')
                  )
                )
                ] = this.CVariables[key].value
            }
          } else if (this.CVariables[key].type === 'integer') {
            createJsonDataTmp[longkey[longkey.length - 1]] = Number(
              this.CVariables[key].value
            )
          } else {
            createJsonDataTmp[longkey[longkey.length - 1]] = this.CVariables[
              key
            ].value
            console.log(key)
            console.log(this.CVariables[key].value)
          }
        }
        // var longkey = this.CVariables[key].id.split(".");
      }

      if (typeof this.createRSJson === 'string') {
        this.createRSJson = JSON.parse(this.createRSJson)
      }
      console.log(this.createRSJson)
      // 新建资源
      createResource({
        token: this.token,
        json: this.createRSJson
      }).then((response) => {
        if (this.validateRes(response) === 1) {
          if (response.code === 20000) {
            this._message()
            this.successCreate = 'success'
            this.refresh()
          }
        }
      })
    },
    createJson() {
      this.createDialogTableVisible = true

      getResource({
        token: this.token,
        kind: this.container_kind + 'Template',
        name: this.catalog_operator.toLowerCase() + '-' + 'create',
        namespace: 'default'
      }).then((response) => {
        if (response.code === 20000) {
          console.log(response.data)
          this.otherOperation = true
          this.models = response.data.spec.data.support
        }
      })
    },
    refresh() {
      this.listLoading = true
      // this.list = [];
      getResource({
        token: this.token,
        kind: this.frontend_kind,
        name: this.table_kind + '-' + this.catalog_operator.toLowerCase(),
        namespace: 'default'
      }).then((response) => {
        if (this.validateRes(response) === 1) {
          this.columns = response.data.spec.data
          listResources({
            token: this.token,
            kind: this.catalog_operator,
            limit: this.listQuery.limit,
            page: this.listQuery.page
          }).then((response) => {
            if (this.validateRes(response) === 1) {
              this.listJsonTemp = response.data.items
              // this.total = response3.total
              this.listLoading = false
              getResource({
                token: this.token,
                kind: this.frontend_kind,
                name: 'action-' + this.catalog_operator.toLowerCase(),
                namespace: 'default'
              }).then((response) => {
                if (response.code === 20000) {
                  if (response.data) {
                    this.actions = response.data.spec.data
                  } else {
                    this.actions = []
                  }
                  this.list = []
                  for (let i = 0; i < this.listJsonTemp.length; i++) {
                    this.list.push({})
                    this.list[i].json = this.listJsonTemp[i]
                    this.list[i].actions = this.actions
                    this.list[i].val = ''
                  }
                  this.listLoading = false
                  // console.log(this.list);
                }
              })
            }
          })
        }
      })
    },
    // 用于更新的 action 提交
    applyOperation() {
      this.actionDialogTableVisible = false
      // createJsonData 是得到的这个资源的 json 文件，更新的时候需要在这里进行更改
      if (typeof this.createJsonData === 'string') {
        this.createJsonData = JSON.parse(this.createJsonData)
      }

      var createJsonDataTmp = this.createJsonData
      for (const key in this.Variables) {
        var longkey = this.Variables[key].id.split('.')
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
          this._message('更新成功', 'suceess')
        }
      })
    },

    _message(message, type) {
      this.$message({
        message: message || '操作成功',
        type: type || 'info',
        duration: 2000
      })
    },

    openTerminal(row) {
      if (this.catalog_operator === 'Pod') {
        this.$router.push({
          path: '/resourceInfo/podTerminal',
          query: { catalog_operator: this.catalog_operator, row: row }
        })
      }
      connectTerminal(this.catalog_operator, row)
    },
    getInputValue(scope, longKey) {
      if (JSON.stringify(scope) == '{}') {
        return ''
      }
      if (
        longKey == '' ||
        longKey == undefined ||
        longKey == null ||
        !longKey
      ) {
        return ''
      }
      if (longKey.indexOf('.') < 0) {
        if (longKey == 'unknown') {
          return '无'
        } else {
          return scope[longKey]
        }
      }
      var keys = longKey.split('.')
      var res = scope
      keys.forEach((element) => {
        if (element.indexOf('[') > 0) {
          res = res[element.substring(0, element.indexOf('['))]
          if (res == undefined) {
            res = 'unknown'
          } else if (res.length == 0) {
            res = 'unknown'
          } else {
            res =
              res[
                parseInt(
                  element.substring(
                    element.indexOf('[') + 1,
                    element.indexOf(']')
                  )
                )
                ]
          }
        } else {
          // todo 这里代码有问题，if走不到
          if (res.hasOwnProperty(element)) {
            res = res[element]
            return res

            if (res == undefined) {
              res = 'unknown'
            }
          } else {
            res = '无'
            return res
            throw new Error('notExist')
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

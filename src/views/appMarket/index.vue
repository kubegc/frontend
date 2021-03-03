<template>
  <div class="imageMarket-app-container">
    <el-row style="margin-bottom: 5vh">
      <el-tag effect="dark"><i class="header-icon el-icon-info" /> 功能描述：{{ tablePage.desc }}</el-tag>
    </el-row>

    <el-row style="margin-bottom: 2vh">
      <dynamic-form
        v-if="tablePage.dynamicFormVisible"
        :form-data="tablePage.dynamicFormJson"
        :kind="kind"
        @watchSearch="search($event)"
      />
    </el-row>
    <el-row style="margin-bottom: 5vh">
      <el-button icon="el-icon-plus" type="primary" circle @click="createJson" />
      <el-button
        icon="el-icon-refresh"
        round
        @click.native="refresh"
      >刷新页面
      </el-button>
    </el-row>
    <el-divider />

    <el-row>
      <el-radio-group v-model="chosenRadioName" @change="handleRadioClick">
        <el-radio-button label="上海" />
        <el-radio-button label="北京" />
        <el-radio-button label="广州" />
        <el-radio-button label="深圳" />
      </el-radio-group>

    </el-row>
    <el-row
      :gutter="20"
      v-loading="tablePage.listLoading"
    >
      <el-col
        v-for="(item, index) in tablePage.tableData"
        :key="index"
        :span="6"
      >
        <el-tooltip placement="top">
          <div slot="content" style="width: 200px;">
            <p>{{ item.json.metadata.name }}</p>
          </div>
          <el-card>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-image
                  style="border-radius: 2px;"
                  :src="require('../../assets' + (item.avatar ? item.avatar : '/avatar.jpg'))"
                  :fit="'fit'"
                />
              </el-col>
              <el-col :span="16">
                <div style="display: block;overflow: hidden;height: 90px">
                  <p style="margin: 0;"><strong>{{ item.json.metadata.name }}</strong></p>
                  <p v-if="item.describe" style="margin: 0;color: gray;overflow: hidden">
                    {{ item.describe }}
                  </p>
                </div>
              </el-col>
            </el-row>
            <el-row style="margin-top: 20px">
              <el-col v-if="item.developer" :span="12">
                <span style="color: black">
                  {{ '开发者：' + item.developer }}
                </span>
              </el-col>
              <el-col :span="12">
                <span style="color: black">
                  {{ 'apiVersion: ' + item.json.apiVersion }}
                </span>
              </el-col>
            </el-row>
          </el-card>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px">
      <pagination
        :auto-scroll="false"
        v-show="tablePage.tableItemsSize > listQuery.limit"
        :total="tablePage.tableItemsSize"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="refresh"
      />
    </el-row>

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

</template>

<script>
import { frontend, frontendData } from '@/api/common'
import { createResource, getResource, listResources, updateResource } from '@/api/k8sResource'
import Pagination from '@/components/Pagination'
import JsonDialog from '@/components/JsonDialog'
import DynamicForm from '@/components/DynamicForm'
import { mapGetters } from 'vuex'
export default {
  components: { Pagination, JsonDialog, DynamicForm },
  data() {
    return {
      cardsData: [],
      chosenRadioName: 'all',
      total: 0,
      listQuery: {
        page: 1,
        limit: 12,
        labels: {}
      },
      createTemplate: {},
      tablePage: {
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
      kind: '',
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
  created() {
    this.kind = this.$route.meta.kind
    frontend(this.token, this.kind, this.listQuery, this.tablePage)
    frontendData(this.token, this.kind, this.listQuery, this.tablePage)
  },
  computed: {
    ...mapGetters(['token'])
  },
  methods: {
    search(labels) {
      this.listQuery.labels = labels
      frontendData(this.token, this.kind, this.listQuery, this.tablePage)
    },
    refresh() {
      frontendData(this.token, this.kind, this.listQuery, this.tablePage)
    },
    handleRadioClick(tab) {
      const type = tab.name
      this.getData(type)
      this.resetListQuery()
    },
    resetListQuery() {
      this.listQuery.page = 1
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
    }
  }
}
</script>

<style lang="scss" scoped>
.imageMarket-app-container {
  padding: 10px 20px;
  font-size: 14px;
  line-height: 1.67;
.el-row{
  .el-card {
    box-shadow: 0px 1px 2px -2px rgba(0, 0, 0, 0.16),
    0px 3px 6px 0px rgba(0, 0, 0, 0.12),
    0px 5px 12px 4px rgba(0, 0, 0, 0.09);
    margin-top: 30px;
  }

  .el-card:hover {
    box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.08),
    0px 9px 28px 0px rgba(0, 0, 0, 0.05),
    0px 12px 48px 16px rgba(0, 0, 0, 0.03);
    transform: translateY(-5px);
    color: yellowgreen;
    //border-top: #409EFF 1px solid;
    border: #1f1f1f 1px solid;
  }
}

  .el-tag {
    box-shadow: 0 8px 16px 0 rgba(36, 46, 66, 0.28);
  }
}
</style>

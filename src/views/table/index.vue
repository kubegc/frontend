<template>
  <div>
    <!-- https://element.eleme.cn/#/zh-CN/component/collapse -->
    <div class="app-container" style="margin-bottom: 20px">
      <el-collapse v-model="pageSpec.description.activeName" accordion>
        <el-collapse-item>
          <template slot="title">
            功能描述<i class="header-icon el-icon-info" />
          </template>
          <div v-text="pageSpec.description.activeDesc" />
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- https://element.eleme.cn/#/zh-CN/component/form -->
    <div class="app-container">
      <dynamic-form
        v-if="pageSpec.formSearch.formSearchVisible"
        :form-data="pageSpec.formSearch.formSearchJson"
        :kind="kind"
        @watchSearch="search($event)"
      />

      <!-- https://element.eleme.cn/#/zh-CN/component/button -->
      <el-row style="margin-bottom: 5vh">
        <el-button icon="el-icon-plus" type="primary" circle @click="createJson(token, kind, createJsonDialog)" />
        <el-button
          icon="el-icon-refresh"
          round
          @click.native="refresh"
        >刷新页面
        </el-button>
      </el-row>

      <!-- https://element.eleme.cn/#/zh-CN/component/table -->
      <el-table
        ref="table"
        v-loading="pageSpec.table.tableLoading"
        :data="pageSpec.table.tableData"
        highlight-current-row
        :header-cell-style="{ 'background-color': '#eef1f6', color: '#606266' }"
      >
        <el-table-column
          v-for="item in pageSpec.table.tableColumns"
          :key="item.key"
          :label="item.label"
        >
          <template slot-scope="scope">
            <!-- tag -->
            <div v-if="item.kind === 'tag'">
              <el-row v-for="(tag, i) in getTextValue(scope.row.json, item.row)" :key="i">
                <el-tooltip :content="JSON.stringify(tag)"><el-tag> {{ tag }} </el-tag></el-tooltip>
              </el-row>
            </div>
            <!-- internalLink -->
            <router-link
              v-else-if="item.kind === 'internalLink'"
              :to="{
                name: item.link.indexOf('@') === -1 ? item.link : getComplexOrDefValue(scope.row.json, item.link.substring(1), item.def),
                params: {
                  key: item.tag,
                  value: item.tag ? getComplexOrDefValue(scope.row.json, item.row.indexOf('@') === -1 ? item.row : item.row.substring(1), item.def) : undefined
                }
              }"
            >
              <el-link type="primary">{{
                item.row.indexOf('@') === -1 ? getComplexOrDefValue(scope.row.json, item.row, item.def) : listQuery.dynamicData[item.row.substring(1) + '-' +item.tag][scope.row.json.metadata.name]
              }}</el-link>
            </router-link>

            <!-- externalLink -->
            <el-link v-else-if="item.kind === 'externalLink'" type="primary" :href="getExternalLink(scope.row.json, item)" target="_blank">{{
              getTextValue(scope.row.json, item.row)
            }}</el-link>

            <!-- terminal -->
            <el-link v-else-if="item.kind === 'terminal'" type="primary" :underline="false" :href="getTerminalAddr(scope.row.json, item)" target="_blank">
              <svg-icon
                icon-class="pc"
              />
            </el-link>
            <!-- action -->
            <el-select
              v-else-if="item.kind === 'action'"
              v-model="scope.row.val"
              placeholder="请选择"
              @change="handleActionChangeHelper($event, scope.row.json, token, kind, listQuery, pageSpec, updateJsonDialog)"
            >
              <el-option
                v-for="item in pageSpec.actions"
                :key="item.key"
                :label="item.key"
                :value="item.type"
              />
            </el-select>
            <span v-else>{{
              getComplexOrDefValue(scope.row.json, item.row, item.def)
            }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="pageSpec.table.tableItemsSize > 0"
        :auto-scroll="false"
        :total="pageSpec.table.tableItemsSize"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="refresh"
      />
      <JsonDialog
        :json-editor="createJsonDialog.ifJsonEditorForCreate"
        :title="createJsonDialog.createResourceTitle"
        :value.sync="createJsonDialog.createDialogVisible"
        :json-file-obj="createJsonDialog.createJsonPattern"
        :create-templates="createJsonDialog.createTemplates"
        :form-data="createJsonDialog.createFormConfig"
        @update:jsonFileObj="createJsonDialog.createJsonPattern = JSON.parse($event)"
        @action="create(token, kind, listQuery, pageSpec, createJsonDialog)"
        @selectChange="handleCreateTemplateChange($event, token, kind, createJsonDialog)"
      />
      <JsonDialog
        :if-create="false"
        :json-editor="updateJsonDialog.ifJsonEditorForUpdate"
        :title="updateJsonDialog.updateResourceTitle"
        :value.sync="updateJsonDialog.actionDialogVisible"
        :json-file-obj="updateJsonDialog.updateJsonData"
        :form-data="updateJsonDialog.updateFormConfig"
        @update:jsonFileObj="updateJsonDialog.updateJsonData = JSON.parse($event)"
        @action="applyOperationHelper(token, kind, listQuery, pageSpec, updateJsonDialog)"
      />
    </div>
  </div>
</template>

<script>
import { frontendMeta, frontendData, handleCreateTemplateChange, createObject, applyOperation, createJson, handleActionChange, getTextValue, getComplexOrDefValue } from '@/api/common'
import Pagination from '@/components/Pagination'
import DynamicForm from '@/components/DynamicForm'
import JsonDialog from '@/components/JsonDialog'
import { mapGetters } from 'vuex'
export default {
  components: { JsonDialog, Pagination, DynamicForm },
  data() {
    return {
      // kind = 'Kubernetes kind(Pod, apps.Deployment)' + 'our subKind'
      // Kubernetes kind: https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/
      // subKind: https://www.yuque.com/kubesys/kube-frontend/hntivn
      // If subKind is null, kind = 'Kubernetes kind'
      // Otherwise, kind = 'Kubernetes kind' + '-' + subKind
      kind: '',
      // namespace. In current design, it is always 'default'
      // https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/
      namespace: 'default',
      // pageSpec
      pageSpec: {
        // description
        description: {
          activeName: '1',
          activeDesc: ''
        },

        // formSearch
        formSearch: {
          formSearchJson: {},
          formSearchVisible: false
        },

        // table
        table: {
          tableData: [],
          tableLoading: true,
          tableItems: {},
          tableColumns: [],
          tableItemsSize: 0
        },

        // action
        actions: []
      },

      // query context
      listQuery: {
        page: 0,
        limit: 10,
        // input labels from users
        allLabels: {},
        // support the 'filter' feature (https://www.yuque.com/kubesys/kube-frontend/qz0cuq)
        // it is a global label.
        defLabels: {},
        // support the advanced features (https://www.yuque.com/kubesys/kube-frontend/bfxmem)
        // the value is generated by invoking a new function according to labels
        dynamicData: {}
      },

      // for button 'create'
      // https://element.eleme.cn/#/zh-CN/component/dialog
      createJsonDialog: {
        createDialogVisible: false,
        ifJsonEditorForCreate: true,
        createTemplates: [],
        createResourceTitle: '创建对象',
        createJsonPattern: {},
        createFormConfig: []
      },

      // for action 'update'
      // https://element.eleme.cn/#/zh-CN/component/dialog
      updateJsonDialog: {
        updateJsonData: {},
        ifJsonEditorForUpdate: true,
        updateResourceTitle: '更新对象',
        actionDialogVisible: false,
        updateFormConfig: [],
        propertiesInfo: []
      }
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  created() {
    this.kind = this.$route.name // 该资源的名字
    this.listQuery.defLabels = this.$route.meta.filter || {}
    this.listQuery.allLabels = this.listQuery.defLabels

    // kind support filter
    let filterStr = JSON.stringify(this.listQuery.defLabels)
    if (JSON.stringify(this.listQuery.defLabels) !== '{}') {
      const i = filterStr.lastIndexOf('\"')
      filterStr = filterStr.substring(0, i)
      const j = filterStr.lastIndexOf('\"')
      filterStr = filterStr.substring(j + 1)
      this.kind = this.kind + '-' + filterStr.trim()
    }

    if (this.$route.params && this.$route.params.key) {
      const key = this.$route.params.key
      const value = this.$route.params.value
      this.listQuery.allLabels[key] = value
    }
    frontendMeta(
      this.token,
      this.kind,
      this.pageSpec)
    frontendData(
      this,
      this.token,
      this.kind,
      this.listQuery,
      this.pageSpec)
    // this.pollingId = setInterval(this.getList, 10000)
  },

  methods: {
    getTerminalAddr(json, item) {
      const params = item.row.split(',')
      const len = params.length
      let addr = item.link
      for (let i = 0; i < len; i++) {
        const currParam = this.getTextValue(json, params[i])
        addr = addr.replace('{' + (i + 1) + '}', currParam)
      }
      return addr
    },
    getExternalLink(json, item) {
      if (item['link'].startsWith('@')) {
        return getTextValue(json, item['link'].substring(1))
      } else {
        let linkUrl = item['link']
        const tags = item['tag'].split(',')
        const len = tags.length
        for (let i = 0; i < len; i++) {
          const tag = this.getTextValue(json, tags[i])
          linkUrl = linkUrl.replace('{' + (i + 1) + '}', tag)
        }
        return linkUrl
      }
    },
    handleCreateTemplateChange,
    search(labels) {
      this.listQuery.allLabels = Object.assign(labels, this.listQuery.defLabels)
      frontendData(this, this.token, this.kind, this.listQuery, this.pageSpec)
    },
    // 将表格的 list 和 action 进行更新
    refresh() {
      frontendData(this, this.token, this.kind, this.listQuery, this.pageSpec)
    },
    handleActionChangeHelper(event, json, token, kind, listQuery, tablePage, updateAbout) {
      handleActionChange(this, event, json, token, kind, listQuery, tablePage, updateAbout)
    },
    create(token, kind, listQuery, tablePage, createAbout) {
      createObject(this, token, kind, listQuery, tablePage, createAbout)
    },
    // 获取创建资源的模板信息，models 存有下拉列表的选项数据
    createJson,
    // 用于更新的 action 提交
    applyOperationHelper(token, kind, listQuery, tablePage, updateAbout) {
      applyOperation(this, token, kind, listQuery, tablePage, updateAbout)
    },
    getTextValue,
    getComplexOrDefValue
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

<template>
  <div>
    <!-- https://element.eleme.cn/#/zh-CN/component/collapse -->
    <div class="app-container" style="margin-bottom: 20px">
      <el-collapse v-model="pageSpec.activeName" accordion>
        <el-collapse-item>
          <template slot="title">
            功能描述<i class="header-icon el-icon-info" />
          </template>
          <div v-text="pageSpec.activeDesc" />
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- https://element.eleme.cn/#/zh-CN/component/form -->
    <div class="app-container">
      <dynamic-form
        v-if="pageSpec.jsonVisible"
        :form-data="pageSpec.jsonObject"
        :kind="kind"
        @watchSearch="search($event)"
      />

      <!-- https://element.eleme.cn/#/zh-CN/component/button -->
      <div class="base-button-container">
        <el-button
          icon="el-icon-plus"
          type="primary"
          class="buttonShadow"
          circle
          @click.native="createJson(token, kind, createAbout)"
        />

        <el-button
          icon="el-icon-refresh"
          round
          @click.native="refresh"
        >刷新页面
        </el-button>
      </div>

      <!-- https://element.eleme.cn/#/zh-CN/component/table -->
      <el-table
        ref="table"
        v-loading="pageSpec.listLoading"
        :data="pageSpec.tableData"
        highlight-current-row
        :header-cell-style="{ 'background-color': '#eef1f6', color: '#606266' }"
      >
        <el-table-column
          v-for="item in pageSpec.tableColumns"
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
                item.row.indexOf('@') === -1 ? getComplexOrDefValue(scope.row.json, item.row, item.def) : listQuery.data[item.row.substring(1) + '-' +item.tag][scope.row.json.metadata.name]
              }}</el-link>
            </router-link>

            <!-- externalLink -->
            <el-link v-else-if="item.kind === 'externalLink'" type="primary" :href="getTextValue(scope.row.json, item.row)">{{
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
              @change="handleActionChangeHelper($event, scope.row.json, token, kind, listQuery, pageSpec, updateAbout)"
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
        v-show="pageSpec.tableItemsSize > 0"
        :auto-scroll="false"
        :total="pageSpec.tableItemsSize"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="refresh"
      />
      <JsonDialog
        :json-editor="createAbout.ifJsonEditorForCreate"
        :title="createAbout.createResourceTitle"
        :value.sync="createAbout.createDialogVisible"
        :json-file-obj="createAbout.createJsonPattern"
        :create-templates="createAbout.createTemplates"
        :form-data="createAbout.createFormConfig"
        @update:jsonFileObj="createAbout.createJsonPattern = JSON.parse($event)"
        @action="create(token, kind, listQuery, pageSpec, createAbout)"
        @selectChange="handleCreateTemplateChange($event, token, kind, createAbout)"
      />
      <JsonDialog
        :if-create="false"
        :json-editor="updateAbout.ifJsonEditorForUpdate"
        :title="updateAbout.updateResourceTitle"
        :value.sync="updateAbout.actionDialogVisible"
        :json-file-obj="updateAbout.updateJsonData"
        :form-data="updateAbout.updateFormConfig"
        @update:jsonFileObj="updateAbout.updateJsonData = JSON.parse($event)"
        @action="applyOperationHelper(token, kind, listQuery, pageSpec, updateAbout)"
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
      // routes-admin supports 'filter', it means we can get different view using this feature.
      // In order to have self-defined UI, we should get different metadata.
      // Note that the filter has and only has one property, if it has one
      // then metadata name is kind + '-' + property value, otherwise it is kind
      kind: '',
      // namespace. In current design, it is always 'default'
      namespace: 'default',
      // pageSpec
      pageSpec: {
        // 描述
        activeName: '1',
        activeDesc: '',
        // 查询表单
        jsonObject: {},
        jsonVisible: false,
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
        labels: {},
        fixedLabels: {},
        data: {}
      },
      // a
      createAbout: {
        createDialogVisible: false,
        ifJsonEditorForCreate: true,
        createTemplates: [],
        createResourceTitle: '创建对象',
        createJsonPattern: {},
        createFormConfig: []
      },
      updateAbout: {
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
    this.listQuery.fixedLabels = this.$route.meta.filter || {}
    this.listQuery.labels = this.listQuery.fixedLabels

    // kind support filter
    let filterStr = JSON.stringify(this.listQuery.fixedLabels)
    if (JSON.stringify(this.listQuery.fixedLabels) !== '{}') {
      const i = filterStr.lastIndexOf('\"')
      filterStr = filterStr.substring(0, i)
      const j = filterStr.lastIndexOf('\"')
      filterStr = filterStr.substring(j + 1)
      this.kind = this.kind + '-' + filterStr.trim()
    }

    if (this.$route.params && this.$route.params.key) {
      const key = this.$route.params.key
      const value = this.$route.params.value
      this.listQuery.labels[key] = value
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
    handleCreateTemplateChange,
    search(labels) {
      this.listQuery.labels = Object.assign(labels, this.listQuery.fixedLabels)
      console.log(JSON.stringify(this.listQuery.labels))
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

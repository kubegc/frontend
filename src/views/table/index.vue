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
          @click.native="createJson(token, kind, createAbout)"
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
              @change="handleActionChange($event, scope.row.json, token, kind, listQuery, tablePage, updateAbout)"
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
        :json-editor="createAbout.ifJsonEditorForCreate"
        :title="createAbout.createResourceTitle"
        :value.sync="createAbout.createDialogVisible"
        :json-file-obj="createAbout.createJsonPattern"
        :create-templates="createAbout.createTemplates"
        :form-data="createAbout.createFormConfig"
        @update:jsonFileObj="createAbout.createJsonPattern = JSON.parse($event)"
        @action="create(token, kind, listQuery, tablePage, createAbout)"
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
        @action="applyOperation(token, kind, listQuery, tablePage, updateAbout)"
      />
    </div>
  </div>
</template>

<script>
import { frontend, frontendData, handleCreateTemplateChange, create, applyOperation, createJson, handleActionChange } from '@/api/common'
import { getInputValue } from '@/api/parser'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import DynamicForm from '@/components/DynamicForm'
import { mapGetters } from 'vuex'
import JsonDialog from '@/components/JsonDialog'
export default {
  name: 'DynamicTable',
  components: { JsonDialog, Pagination, DynamicForm },
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
    handleCreateTemplateChange,
    search(labels) {
      this.listQuery.labels = labels
      frontendData(this.token, this.kind, this.listQuery, this.tablePage)
    },
    // 将表格的 list 和 action 进行更新
    refresh() {
      frontendData(this.token, this.kind, this.listQuery, this.tablePage)
    },
    handleActionChange,
    create,
    // 获取创建资源的模板信息，models 存有下拉列表的选项数据
    createJson,
    // 用于更新的 action 提交
    applyOperation,
    getInputValue
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

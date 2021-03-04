<template>
  <div class="imageMarket-app-container">
    <el-row style="margin-bottom: 5vh">
      <el-tag style="box-shadow: 0 8px 16px 0 rgba(36, 46, 66, 0.28);" effect="dark"><i class="header-icon el-icon-info" /> 功能描述：{{ tablePage.desc }}</el-tag>
    </el-row>


    <el-row style="margin-bottom: 5vh">
      <el-button icon="el-icon-plus" type="primary" circle @click="createJson(token, kind, createAbout)" />
      <el-button
        icon="el-icon-refresh"
        round
        @click.native="refresh"
      >刷新页面
      </el-button>
    </el-row>
    <el-divider />

    <el-row>
<!--      <el-row style="margin-bottom: 2vh">-->
        <dynamic-form
          v-if="tablePage.dynamicFormVisible"
          :form-data="tablePage.dynamicFormJson"
          :kind="kind"
          @watchSearch="search($event)"
        />
<!--      </el-row>-->
      <el-radio-group v-model="chosenRadioName" @change="handleRadioClick">
        <el-radio-button label="上海"></el-radio-button>
        <el-radio-button label="北京" />
        <el-radio-button label="广州" />
        <el-radio-button label="深圳" />
      </el-radio-group>

    </el-row>
    <el-row
      v-loading="tablePage.listLoading"
      :gutter="20"
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
            <el-row>
              <el-col :span="8" style="margin-top: 20%">
                <el-image
                  style="border-radius: 2px;"
                  :src="require('../../assets' + (item.avatar ? item.avatar : '/avatar.jpg'))"
                  :fit="'fit'"
                />
              </el-col>

              <el-col :span="16">
                <el-row>
                  <el-form label-position="right" label-width="7vw">
                    <el-form-item v-for="(labelItem, key) in tablePage.tableColumns" :label="labelItem.label" :key="key">
                      <el-select
                        size="mini"
                        v-if="labelItem.kind === 'action'"
                        v-model="item.val"
                        placeholder="请选择"
                        @change="handleActionChange($event, item.json, token, kind, listQuery, tablePage, updateAbout)"
                      >
                        <el-option
                          v-for="i in tablePage.actions"
                          :key="i.key"
                          :label="i.key"
                          :value="i.type"
                        />
                      </el-select>
                      <el-tag size="small" v-else>{{getInputValue(item.json, labelItem.row)}}</el-tag>
                    </el-form-item>
                  </el-form>
                </el-row>

              </el-col>
            </el-row>
          </el-card>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px">
      <pagination
        v-show="tablePage.tableItemsSize > listQuery.limit"
        :auto-scroll="false"
        :total="tablePage.tableItemsSize"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="refresh"
      />
    </el-row>

    <JsonDialog
      :json-editor="createAbout.ifJsonEditorForCreate"
      :title="createAbout.createResourceTitle"
      :value.sync="createAbout.createDialogVisible"
      :json-file-obj="createAbout.createJsonPattern"
      :create-templates="createAbout.createTemplates"
      :form-data="createAbout.createFormConfig"
      @update:jsonFileObj="createJsonPattern = JSON.parse($event)"
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
      @update:jsonFileObj="updateJsonData = JSON.parse($event)"
      @action="applyOperation(token, kind, listQuery, tablePage, updateAbout)"
    />
  </div>

</template>

<script>
import { frontend, frontendData, getInputValue, handleCreateTemplateChange, create, applyOperation, createJson, handleActionChange } from '@/api/common'
import Pagination from '@/components/Pagination'
import JsonDialog from '@/components/JsonDialog'
import DynamicForm from '@/components/DynamicForm'
import { mapGetters } from 'vuex'
export default {
  components: { Pagination, JsonDialog, DynamicForm },
  data() {
    return {
      chosenRadioName: 'all',
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
    handleCreateTemplateChange,
    create,
    applyOperation,
    createJson,
    getInputValue,
    handleActionChange
  }
}
</script>

<style lang="scss" scoped>
.imageMarket-app-container {
  padding: 10px 20px;
  font-size: 14px;
  //line-height: 1.67;
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
  .el-form-item{
    margin-bottom: 0;
    font-size: 6px;
    overflow: hidden;
  }
}
</style>

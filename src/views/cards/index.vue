<template>

  <div class="imageMarket-app-container">
    <div class="app-container" style="margin-bottom: 20px">
      <el-collapse v-model="page.activeName" accordion>
        <el-collapse-item>
          <template slot="title">
            功能描述<i class="header-icon el-icon-info" />
          </template>
          <div v-text="page.desc" />
        </el-collapse-item>
      </el-collapse>
    </div>

    <div class="app-container" style="margin-bottom: 20px">
      <el-row>
        <dynamic-form
          v-if="page.dynamicFormVisible"
          :form-data="page.dynamicFormJson"
          :kind="kind"
          @watchSearch="search($event)"
        />
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
      <!-- <el-divider /> -->

      <el-row>
        <el-radio-group v-model="chosenRadioName" @change="handleRadioClick">
          <el-radio-button label="所有" />
          <el-radio-button v-for="(value, name) in tags" :key="value" :label="name" />
        </el-radio-group>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="leftSpan" style="transition: all 0.28s;">
          <el-row
            v-loading="page.listLoading"
            :gutter="leftGutter"
          >
            <el-col
              v-for="(item, index) in page.tableData"
              :key="index"
              style="cursor: pointer"
              :span="6"
              @click.native="showDetail(item)"
            >
              <el-tooltip placement="top">
                <div slot="content">
                  <p>{{ item.json.metadata.name }}</p>
                </div>
                <el-card class="exhibition">
                  <el-row style="margin-bottom: 20px;">
                    <el-col style="text-align:center">
                      <el-image
                        style="border-radius: 2px;max-height: 80%;max-width: 80%;"
                        :src="item.json.metadata.imageurl"
                        :fit="'fit'"
                      >
                        <div slot="error">
                          <i class="el-icon-picture-outline" />
                        </div>
                      </el-image>
                    </el-col>
                  </el-row>

                  <el-row type="flex" justify="center" style="text-align:center">

                    <el-tag>{{ item.json.metadata.name }}</el-tag>
                  </el-row>
                </el-card>
              </el-tooltip>
            </el-col>
          </el-row>

        </el-col>

        <transition name="el-zoom-in-top">
          <el-col v-show="detailVisible" :span="24 - leftSpan">
            <el-card shadow="never" style="margin-top: 30px;border: #2b2f3a 1px solid">
              <el-row>
                <el-form>
                  <el-form-item v-for="(labelItem, key) in page.tableColumns" :key="key" :label="labelItem.label">
                    <el-select
                      v-if="labelItem.kind === 'action'"
                      v-model="detailItem.val"
                      size="mini"
                      placeholder="请选择"
                      @change="handleActionChange($event, detailItem.json, token, kind, listQuery, page, updateAbout)"
                    >
                      <el-option
                        v-for="i in page.actions"
                        :key="i.key"
                        :label="i.key"
                        :value="i.type"
                      />
                    </el-select>
                    <el-tag v-else size="small">{{ getInputValue(detailItem.json, labelItem.row) }}</el-tag>
                  </el-form-item>
                </el-form>
              </el-row>
              <el-divider v-if="this.detailItem.json && this.detailItem.json.spec.basic && this.detailItem.json.spec.basic.desc">详情</el-divider>
              <el-tag v-if="this.detailItem.json && this.detailItem.json.spec.basic && this.detailItem.json.spec.basic.desc" style="overflow: hidden"> {{ this.detailItem.json.spec.basic.desc }}</el-tag>
            </el-card>
          </el-col>
        </transition>

      </el-row>
      <el-row style="margin-top: 30px">
        <pagination
          v-show="page.tableItemsSize > listQuery.limit"
          :auto-scroll="false"
          :total="page.tableItemsSize"
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
        @update:jsonFileObj="createAbout.createJsonPattern = JSON.parse($event)"
        @action="create(token, kind, listQuery, page, createAbout)"
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
        @action="applyOperation(token, kind, listQuery, page, updateAbout)"
      />
    </div>
  </div>

</template>

<script>
import { frontendMeta, frontendData, handleCreateTemplateChange, createObject, applyOperation, createJson, handleActionChange, getTags, getTextValue } from '@/api/common'
import Pagination from '@/components/Pagination'
import JsonDialog from '@/components/JsonDialog'
import DynamicForm from '@/components/DynamicForm'
import { mapGetters } from 'vuex'
export default {
  components: { Pagination, JsonDialog, DynamicForm },
  data() {
    return {
      chosenRadioName: '所有',
      listQuery: {
        page: 1,
        limit: 12,
        labels: {}
      },
      createTemplate: {},
      page: {
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
      },
      leftSpan: 24,
      detailVisible: false,
      // leftCardSpan: 3,
      leftGutter: 20,
      detailItem: {},
      tags: [],
      label: ''
    }
  },
  created() {
    this.kind = this.$route.name
    frontendMeta(this.token, this.kind, this.page)
    frontendData(this.token, this.kind, this.listQuery, this.page)
    getTags(this)
  },
  computed: {
    ...mapGetters(['token'])
  },
  methods: {
    search(labels) {
      this.listQuery.labels = labels
      if (this.chosenRadioName === '所有') {
        this.listQuery.labels[this.label] = ''
      } else {
        this.listQuery.labels[this.label] = this.chosenRadioName
      }
      frontendData(this.token, this.kind, this.listQuery, this.page)
    },
    refresh() {
      frontendData(this.token, this.kind, this.listQuery, this.page)
    },
    handleRadioClick(name) {
      if (name === '所有') {
        name = ''
      }
      this.listQuery.labels[this.label] = this.tags[name]
      this.refresh()
    },

    handleCreateTemplateChange,
    create: createObject,
    applyOperation,
    createJson,
    getInputValue: getTextValue,
    handleActionChange,
    showDetail(detailItem) {
      if (!this.detailItem.json || this.detailItem.json.metadata.name === detailItem.json.metadata.name) {
        this.leftSpan = this.leftSpan === 24 ? 18 : 24
        this.leftGutter = this.leftGutter === 20 ? 10 : 20
        this.detailItem = detailItem
        setTimeout(() => {
          this.detailVisible = !this.detailVisible
        }, 280)
        // this.detailVisible = true
      } else {
        this.detailItem = detailItem
        if (this.leftSpan === 24 && this.leftGutter === 20) {
          this.leftSpan = 18
          this.leftGutter = 10
          setTimeout(() => {
            this.detailVisible = !this.detailVisible
          }, 280)
        }
      }
    },
    getTags
  }
}
</script>

<style lang="scss" scoped>
.imageMarket-app-container {
  padding: 10px 20px;
  font-size: 14px;
  //line-height: 1.67;

.el-row{
  .exhibition {
    box-shadow: 0px 1px 2px -2px rgba(0, 0, 0, 0.16),
    0px 3px 6px 0px rgba(0, 0, 0, 0.12),
    0px 5px 12px 4px rgba(0, 0, 0, 0.09);
    margin-top: 30px;
  }

  .exhibition:focus {
    //box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.08),
    //0px 9px 28px 0px rgba(0, 0, 0, 0.05),
    //0px 12px 48px 16px rgba(0, 0, 0, 0.03);
    //transform: translateY(-5px);
    border: #409EFF 1px solid;
  }
}
  .el-form-item{
    margin-bottom: 0;
    font-size: 6px;
    overflow: hidden;
  }
::v-deep {
  .el-form-item__label {
    font-size: 1vmin;
  }
}
}
</style>

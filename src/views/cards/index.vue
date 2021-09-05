<template>

  <!-- https://element.eleme.cn/#/zh-CN/component/collapse -->
  <div class="imageMarket-app-container">
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
    <div class="app-container" style="margin-bottom: 20px">
      <el-row>
        <dynamic-form
          v-if="pageSpec.formSearch.formSearchVisible"
          :form-data="pageSpec.formSearch.formSearchJson"
          :kind="kind"
          @watchSearch="search($event)"
        />
      </el-row>

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
      <!-- <el-divider /> -->

      <!--      <el-row>-->
      <!--        <el-radio-group v-model="chosenRadioName" @change="handleRadioClick">-->
      <!--          <el-radio-button label="所有" />-->
      <!--          <el-radio-button v-for="(value, name) in tags" :key="value" :label="name" />-->
      <!--        </el-radio-group>-->
      <!--      </el-row>-->

      <el-row :gutter="10">
        <el-col :span="leftSpan" style="transition: all 0.28s;">
          <el-row
            v-loading="pageSpec.table.tableLoading"
            :gutter="leftGutter"
          >
            <el-col
              v-for="(item, index) in pageSpec.table.tableData"
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
          <el-col v-if="detailVisible" :span="24 - leftSpan">
            <el-card shadow="never" style="margin-top: 30px;border: #2b2f3a 1px solid">
              <el-row>
                <el-form>
                  <el-form-item v-for="(labelItem, key) in pageSpec.table.tableColumns" :key="key" :label="labelItem.label">

                    <!-- tag -->
                    <div v-if="labelItem.kind === 'tag'">
                      <el-row v-for="(tag, i) in getTextValue(detailItem.json, labelItem.row)" :key="i">
                        <el-tooltip :content="JSON.stringify(tag)"><el-tag> {{ tag }} </el-tag></el-tooltip>
                      </el-row>
                    </div>

                    <!-- internalLink -->
                    <router-link
                      v-else-if="labelItem.kind === 'internalLink'"
                      :to="
                        {
                          name: labelItem.link.indexOf('@') === -1 ? labelItem.link : getComplexOrDefValue(detailItem.json, labelItem.link.substring(1), labelItem.def),
                          params: {
                            key: labelItem.tag,
                            value: labelItem.tag ? getComplexOrDefValue(detailItem.json, labelItem.row.indexOf('@') === -1 ? labelItem.row : labelItem.row.substring(1), labelItem.def) : undefined
                          }
                        }"
                    >
                      <el-link type="primary">{{
                        labelItem.row.indexOf('@') === -1 ? getComplexOrDefValue(detailItem.json, labelItem.row, labelItem.def) : listQuery.data[labelItem.row.substring(1) + '-' +labelItem.tag][detailItem.json.metadata.name]
                      }}</el-link>
                    </router-link>

                    <!-- externalLink -->
                    <el-link v-else-if="labelItem.kind === 'externalLink'" type="primary" :href="getTextValue(detailItem.json, labelItem.row)">{{
                      getTextValue(detailItem.json, labelItem.row)
                    }}</el-link>

                    <!-- terminal -->
                    <el-link v-else-if="labelItem.kind === 'terminal'" type="primary" :underline="false" :href="getTerminalAddr(detailItem.json, labelItem)" target="_blank">
                      <svg-icon
                        icon-class="pc"
                      />
                    </el-link>

                    <el-select
                      v-else-if="labelItem.kind === 'action'"
                      v-model="detailItem.val"
                      size="mini"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="i in pageSpec.actions"
                        :key="i.key"
                        :label="i.key"
                        :value="i.type"
                        @click.native="handleActionChangeHelper(i.type, detailItem.json, token, kind, listQuery, pageSpec, updateJsonDialog)"
                      />
                    </el-select>
                    <el-tag v-else size="small">{{ getComplexOrDefValue(detailItem.json, labelItem.row) }}</el-tag>
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
          v-show="pageSpec.table.tableItemsSize > listQuery.limit"
          :auto-scroll="false"
          :total="pageSpec.table.tableItemsSize"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="refresh"
        />
      </el-row>
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
import { frontendMeta, frontendData, handleCreateTemplateChange, createObject, applyOperation, createJson, handleActionChange, getTags, getTextValue, getComplexOrDefValue } from '@/api/common'
import Pagination from '@/components/Pagination'
import JsonDialog from '@/components/JsonDialog'
import DynamicForm from '@/components/DynamicForm'
import { mapGetters } from 'vuex'
export default {
  components: { Pagination, JsonDialog, DynamicForm },
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
      // chosenRadioName: '所有',
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

        // actions
        actions: []
      },
      listQuery: {
        page: 1,
        limit: 12,
        labels: {},
        fixedLabels: {},
        data: {}
      },
      createTemplate: {},
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
    frontendMeta(this.token, this.kind, this.pageSpec)
    frontendData(this, this.token, this.kind, this.listQuery, this.pageSpec)
    // getTags(this)
  },
  computed: {
    ...mapGetters(['token']),
    getRef() {
      return this
    }
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
    search(labels) {
      this.listQuery.labels = labels
      if (this.chosenRadioName === '所有') {
        this.listQuery.labels[this.label] = ''
      } else {
        this.listQuery.labels[this.label] = this.chosenRadioName
      }
      frontendData(this, this.token, this.kind, this.listQuery, this.pageSpec)
    },
    refresh() {
      frontendData(this, this.token, this.kind, this.listQuery, this.pageSpec)
    },
    // handleRadioClick(name) {
    //   if (name === '所有') {
    //     name = ''
    //   }
    //   this.listQuery.labels[this.label] = this.tags[name]
    //   this.refresh()
    // },

    handleCreateTemplateChange,
    create(token, kind, listQuery, tablePage, createAbout) {
      createObject(this, token, kind, listQuery, tablePage, createAbout)
    },
    applyOperationHelper(token, kind, listQuery, tablePage, updateAbout) {
      applyOperation(this, token, kind, listQuery, tablePage, updateAbout)
    },
    createJson,
    getInputValue: getTextValue,
    handleActionChangeHelper(event, json, token, kind, listQuery, tablePage, updateAbout) {
      handleActionChange(this, event, json, token, kind, listQuery, tablePage, updateAbout)
    },
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
    getTags,
    getComplexOrDefValue,
    getTextValue
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

<template>
  <div class="app-container">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="130px">
        <el-col :span="12">
          <el-form-item label="资源名称" prop="resource">
            <el-input
              v-model="formData.resource"
              placeholder="请输入资源名称"
              clearable
              prefix-icon='el-icon-folder'
              :style="{width: '100%'}"
              @change="handleInputChange">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item label="编辑表列信息" prop="">
            <el-button
              type="text"
              icon="el-icon-document-add"
              size="medium"
              @click="tableColumnVisible = !tableColumnVisible"> 点击编辑
            </el-button>
            <el-dialog
              :visible.sync="tableColumnVisible"
              width="70%">
              <json-editor v-model="tableColumnJson"></json-editor>
            </el-dialog>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item label="编辑查询表单" prop="">
            <el-button
              type="text"
              icon="el-icon-document-add"
              size="medium"
              @click="formSearchVisible = !formSearchVisible"> 点击编辑
            </el-button>
            <el-dialog
              :visible.sync="formSearchVisible"
              width="70%">
              <json-editor v-model="formSearchJson"></json-editor>
            </el-dialog>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item label="创建模板数量" prop="createTemplateNum">
            <el-input-number
              v-model="formData.createTemplateNum"
              placeholder="创建模板数量"
              :min="0"
              @change="handleCreateNumChange">
            </el-input-number>
          </el-form-item>
        </el-col>

        <el-col :span="13" v-if="formData.createTemplateNum > 0">
          <el-form-item
            v-for="item in createTemplates"
            :label="item.label"
            :key="item.key">
            <el-button
              type="text"
              icon="el-icon-document-add"
              size="medium"
              @click="item.dialogVisible = !item.dialogVisible">
              点击编辑创建资源的 json 文件
            </el-button>
            <el-dialog
              :visible.sync="item.dialogVisible"
              width="70%">
              <json-editor v-model="item.createJson"></json-editor>
            </el-dialog>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item label="资源操作种类" prop="actionNum">
            <el-input-number
              v-model="formData.actionNum"
              placeholder="资源操作种类"
              :min="0"
              @change="handleActionNumChange"
            >
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="13" v-if="formData.actionNum > 0">
          <el-form-item
            v-for="item in actionTemplates"
            :label="item.label"
            :key="item.key"
          >
            <el-button
              type="text"
              icon="el-icon-document-add"
              size="medium"
              @click="item.dialogVisible = !item.dialogVisible">
              点击编辑对资源操作的 json 文件
            </el-button>
            <el-dialog
              :visible.sync="item.dialogVisible"
              width="70%">
              <json-editor v-model="item.actionJson"></json-editor>
            </el-dialog>
          </el-form-item>
        </el-col>

        <el-col :span="13">
          <el-form-item label="编辑支持的 action" prop="">
            <el-button
              type="text"
              icon="el-icon-document-add"
              size="medium"
              @click="actionMetaVisible = !actionMetaVisible"> 点击编辑
            </el-button>
            <el-dialog
              :visible.sync="actionMetaVisible"
              width="70%">
              <json-editor v-model="actionMetaJson"></json-editor>
            </el-dialog>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item size="large">
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
import JsonEditor from '@/components/JsonEditor/index'
import { createResource, deleteResource } from '@/api/k8sResource'
import { mapGetters } from 'vuex'

export default {
  components: { JsonEditor },
  data() {
    return {
      formData: {
        resource: '',
        createTemplateNum: 0,
        actionNum: 0
      },
      rules: {
        resource: [{
          required: true,
          message: '请输入资源名称',
          trigger: 'blur'
        }],
        createTemplateNum: [{
          required: true,
          message: '创建模板数量',
          trigger: 'blur'
        }],
        actionNum: [{
          required: true,
          message: '资源操作种类',
          trigger: 'blur'
        }]
      },
      tableColumnVisible: false,
      formSearchVisible: false,
      actionMetaVisible: false,
      createTemplates: [],
      actionTemplates: [],
      createTemplateJson: {
        'apiVersion': 'cloudplus.io/v1alpha3',
        'kind': 'ContainerTemplate',
        'metadata': {
          'name': ''
        },
        'spec': {
          'data': {
            'key': '',
            'values': [{
              'id': '',
              'type': '',
              'required': 'true',
              'name': ''
            }],
            'template': {}
          }
        }
      },
      actionTemplateJson: {
        'apiVersion': 'cloudplus.io/v1alpha3',
        'kind': 'ContainerTemplate',
        'metadata': {
          'name': ''
        },
        'spec': {
          'data': {
            'key': '',
            'values': [{
              'id': '',
              'type': '',
              'required': 'true',
              'action': '',
              'name': ''
            }],
            'template': {}
          }
        }
      },
      tableColumnJson: {
        'apiVersion': 'cloudplus.io/v1alpha3',
        'kind': 'Frontend',
        'metadata': {
          'name': ''
        },
        'spec': {
          'data': [
            {
              'key': 0,
              'kind': '',
              'label': '',
              'link': '',
              'row': '',
              'style': '',
              'type': '',
              'width': ''
            }
          ],
          'type': 'table'
        }
      },
      formSearchJson: {
        'apiVersion': 'cloudplus.io/v1alpha3',
        'kind': 'Frontend',
        'metadata': {
          'name': ''
        },
        'spec': {
          'data': {},
          'type': 'formsearch'
        }
      },
      createMetaJson: {
        'apiVersion': 'cloudplus.io/v1alpha3',
        'kind': 'ContainerTemplate',
        'metadata': {
          'name': ''
        },
        'spec': {
          'data': {
            'support': []
          }
        }
      },
      actionMetaJson: {
        'apiVersion': 'cloudplus.io/v1alpha3',
        'kind': 'Frontend',
        'metadata': {
          'name': ''
        },
        'spec': {
          'data': [
            {
              'key': '删除',
              'type': 'delete'
            }
          ],
          'type': 'action'
        }
      }
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  methods: {
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        const alreadyCreate = []
        try {
          createResource({
            token: this.token,
            json: typeof this.tableColumnJson === 'string' ? this.tableColumnJson = JSON.parse(this.tableColumnJson) : this.tableColumnJson
          }).then(response => {
            if (response.code === 20000) {
              alreadyCreate.push(this.tableColumnJson)
              createResource({
                token: this.token,
                json: typeof this.formSearchJson === 'string' ? this.formSearchJson = JSON.parse(this.formSearchJson) : this.formSearchJson
              }).then(response => {
                if (response.code === 20000) {
                  alreadyCreate.push((this.formSearchJson))
                  if (this.createTemplates.length > 0) {
                    for (const item of this.createTemplates) {
                      createResource({
                        token: this.token,
                        json: typeof item.createJson === 'string' ? item.createJson = JSON.parse(item.createJson) : item.createJson
                      }).then(response => {
                        if (response.code === 20000) {
                          alreadyCreate.push(item.createJson)
                        }
                      })
                    }
                  }

                  if (this.actionTemplates.length > 0) {
                    for (const item of this.actionTemplates) {
                      createResource({
                        token: this.token,
                        json: typeof item.actionJson === 'string' ? item.actionJson = JSON.parse(item.actionJson) : item.actionJson
                      }).then(response => {
                        if (response.code === 20000) {
                          alreadyCreate.push(item.actionJson)
                        }
                      })
                    }
                  }
                  for (const item of this.createTemplates) {
                    this.createMetaJson.spec.data.support.push(item.createJson.metadata.name.substring(item.createJson.metadata.name.lastIndexOf('.') + 1, item.createJson.metadata.name.length))
                  }
                  createResource({ token: this.token, json: this.createMetaJson }).then(response => {
                    if (response.code === 20000) {
                      createResource({
                        token: this.token,
                        json: typeof this.actionMetaJson === 'string'
                          ? this.actionMetaJson = JSON.parse(this.actionMetaJson)
                          : this.actionMetaJson
                      }).then(response => {
                        if (response.code === 20000) {
                          this.$message({
                            message: '创建资源页面操作成功',
                            type: 'success',
                            duration: 2000
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        } catch (e) {
          for (const item of alreadyCreate) {
            deleteResource({ token: this.token, namespace: 'default', kind: item.kind, name: item.metadata.name }).then(
              response => {
                if (response.code === 20000) {
                  alreadyCreate.splice(-1, 1)
                }
              }
            )
          }
          if (alreadyCreate.length === 0) {
            this.$message({
              message: '增加新资源失败',
              type: 'error',
              duration: 2000
            })
          }
        }
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
    handleCreateNumChange(currNum) {
      this.createTemplates = []
      for (let i = 1; i <= currNum; i++) {
        const currObj = {}
        currObj.key = i
        currObj.label = '创建资源模板' + i
        currObj.dialogVisible = false
        currObj.createJson = this.createTemplateJson
        this.createTemplates.push(currObj)
      }
    },
    handleActionNumChange(currNum) {
      this.actionTemplates = []
      for (let i = 1; i <= currNum; i++) {
        const currObj = {}
        currObj.key = i
        currObj.label = 'action 模板' + i
        currObj.dialogVisible = false
        currObj.actionJson = this.actionTemplateJson
        this.actionTemplates.push(currObj)
      }
    },
    handleInputChange(value) {
      console.log('hereeeeeeeeeeeee')
      this.createTemplateJson.metadata.name = value.toLowerCase() + '-create.your_template_name_here'
      this.actionTemplateJson.metadata.name = value.toLowerCase() + '-your_action_name_here'
      this.createTemplates.forEach(item => {
        item.createJson.metadata.name = value.toLowerCase() + '-create.your_template_name_here'
      })
      this.actionTemplates.forEach(item => {
        item.actionJson.metadata.name = value.toLowerCase() + '-your_action_name_here'
      })
      this.createMetaJson.metadata.name = value.toLowerCase() + '-create'
      this.actionMetaJson.metadata.name = 'action-' + value.toLowerCase()
      this.tableColumnJson.metadata.name = 'table-' + value.toLowerCase()
      this.formSearchJson.metadata.name = 'formsearch-' + value.toLowerCase()
    }
  }
}
</script>
<style>
</style>

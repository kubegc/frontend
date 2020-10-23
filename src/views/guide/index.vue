<template>
  <div class="app-container">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="130px">

        <el-col :span="13">
          <el-form-item label="新增页面类型" prop="resource">
            <el-select v-model="formData.chosenGuideType" placeholder="请选择" @change="handleGuideTypeChange">
              <el-option
                v-for="item in guideTypes"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="canEdit">
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

        <el-col :span="13" v-if="canEdit">
          <el-form-item
            v-for="item in editTemplates"
            :label="item.label"
            :key="item.key"
          >
            <el-popover
              placement="right"
              trigger="hover"
            >
              <el-image
                style="width: 800px; height: 350px;"
                :src="require('../../assets/nodetable-' + item.key + '.jpg')"
              >
              </el-image>
              <el-button
                type="text"
                icon="el-icon-edit"
                size="medium"
                slot="reference"
                @click="item.dialogVisible = true"> 点击编辑
              </el-button>
            </el-popover>
            <el-dialog
              :visible.sync="item.dialogVisible"
              width="70%">
              <json-editor
                :value="JSON.stringify(item.jsonFileObj, null, 2)"
                @input="item.jsonFileObj = JSON.parse($event)"/>
              <div slot="footer" class="dialog-footer">
                <el-button @click="item.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="item.dialogVisible = false">确 定</el-button>
              </div>
            </el-dialog>
          </el-form-item>
        </el-col>

<!--        <el-col :span="13" v-if="canEdit">-->
<!--          <el-form-item-->
<!--            label="编辑路由信息">-->
<!--            <el-button-->
<!--              type="text"-->
<!--              icon="el-icon-edit"-->
<!--              size="medium"-->
<!--              @click="routeVisible = true"> 点击编辑-->
<!--            </el-button>-->
<!--            <el-dialog-->
<!--              :visible.sync="routeVisible"-->
<!--              width="70%">-->
<!--              <json-editor-->
<!--                :value="JSON.stringify(routeFile, null, 2)"-->
<!--                @input="routeFile = JSON.parse($event)"></json-editor>-->
<!--              <div slot="footer" class="dialog-footer">-->
<!--                <el-button @click="routeVisible = false">取 消</el-button>-->
<!--                <el-button type="primary" @click="routeVisible = false">确 定</el-button>-->
<!--              </div>-->
<!--            </el-dialog>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
        <el-col :span="13" v-if="canEdit">
          <el-form-item label="路由树">
            <routes-tree-view v-model= "routeFile"></routes-tree-view>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="canEdit">
          <el-form-item size="large">
            <el-button type="primary" @click="submitForm" round>提交</el-button>
            <el-button @click="resetForm" round>重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
import JsonEditor from '@/components/JsonEditorSpecial/index'
import { createResource, listResources, getResource, updateResource } from '@/api/k8sResource'
import { mapGetters } from 'vuex'
import RoutesTreeView from '@/components/RoutesTreeView/index'

export default {
  components: { RoutesTreeView, JsonEditor },
  data() {
    return {
      formData: {
        resource: '',
        createTemplateNum: 0,
        actionNum: 0,
        chosenGuideType: ''
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
      canEdit: false,
      editTemplates: [],
      guideTypes: [{ key: 'table1', label: '普通资源操作页面' }],
      routeVisible: false,
      routeFile: {},

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
      }
    }
  },
  created() {
    getResource({ token: this.token, kind: 'Frontend', name: 'routes-user', namespace: 'default' }).then(
      response => {
        if (response.code === 20000 && response.data !== null) {
          this.routeFile = response.data
        }
      }
    )
  },
  computed: {
    ...mapGetters(['token'])
  },
  methods: {
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // if valid
        const alreadyCreate = []
        try {
          this.editTemplates.forEach(item => {
            createResource({ token: this.token, json: item.jsonFileObj }).then(
              response => {
                if (response.code === 2000 && response.data !== null) {
                  alreadyCreate.push(item.jsonFileObj)
                } else {
                  throw Error
                }
              }
            )
          })
          updateResource({ token: this.token, json: this.routeFile }).then(
            response => {
              if (response.code === 20000 && response.data !== null) {
                this.$message({
                  message: '创建资源页面成功',
                  type: 'success',
                  duration: 2000
                })
              }
            }
          )
        } catch (e) {
          this.$message({
            message: '创建资源页面失败',
            type: 'error',
            duration: 2000
          })
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
      for (const item of this.editTemplates) {
        item.jsonFileObj.metadata.name = item.key + '-' + value.toLowerCase()
      }
    },
    handleGuideTypeChange(value) {
      listResources({ token: this.token, kind: 'Frontend', labels: { 'spec.type': 'wizard' } }).then(
        response => {
          if (response.code === 20000 && response.data != null) {
            const guideName = 'wizard-' + value
            const info = response.data.items.filter(item => item.metadata.name === guideName)[0].spec.data
            for (const key in info.keys) {
              const temp = {}
              temp.key = key
              temp.label = info.keys[key]
              temp.jsonFileObj = info.values[key]
              temp.dialogVisible = false
              this.editTemplates.push(temp)
            }
          }
          this.canEdit = true
        })
    }
  }
}
</script>
<style scoped>
</style>

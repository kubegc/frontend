<template>
  <el-dialog
    :title="title"
    :visible="value"
    :width="width"
    @update:visible="close"
  >
    <JsonEditor
      v-if="jsonEditor"
      :value="JSON.stringify(jsonFileObj, null, 2)"
      @input="handleInput($event)"
    />
    <div v-else>
      <el-form v-if="ifCreate">
        <el-form-item :label="'请选择模板：'">
          <el-select v-model="templateType" placeholder="选择模版" @change="handleChange">
            <el-option v-for="item in createTemplates" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-divider v-if="!ifCreate || dividerVisible" content-position="center"><i class="el-icon-edit" /> 如需{{
        title
      }}，请完整填写下列相关信息
      </el-divider>
      <el-form ref="userAddedInfo" :model="formShadow" label-width="auto" style="margin-top: 50px" :rules="rules">
        <el-form-item v-for="(formItem, index) in formData" :key="index" :label="formItem.name" :prop="index + ''">
          <el-col :span="22">
            <el-radio-group v-if="formItem.type === 'bool'" v-model="formShadow[index]">
              <el-radio :label="true">true</el-radio>
              <el-radio :label="false">false</el-radio>
            </el-radio-group>
            <el-input
              v-if="formItem.type === 'integer'"
              v-model.number="formShadow[index]"
              :placeholder="formItem.placeholder"
            />
            <el-input
              v-if="formItem.type === 'string'"
              v-model="formShadow[index]"
              :placeholder="formItem.placeholder"
            />
          </el-col>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" :disabled="(jsonEditor || !ifCreate || dividerVisible) ? false : true" @click="takeActionAndClose">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import JsonEditor from '@/components/JsonEditorSpecial'
import { check } from '@/utils/validate'
import { getResource } from '@/api/kubernetes'

export default {
  name: 'JsonDialog',
  components: { JsonEditor },
  props: {
    jsonFileObj: {
      required: false,
      type: Object
    },
    value: {
      required: true,
      type: Boolean
    },
    jsonEditor: {
      required: false,
      type: Boolean,
      default: true
    },
    title: {
      required: false,
      type: String
    },
    createTemplates: {
      required: false,
      type: Array
    },
    formData: {
      required: false,
      type: Array
    },
    ifCreate: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  data() {
    const stringValidator = (rule, value, callback) => {
      if (!check(this.defStringRegExp, value)) {
        callback(new Error(this.defStringRegExpDesc))
      } else {
        callback()
      }
    }

    const integerValidator = (rule, value, callback) => {
      if (!check(this.defNumberRegExp, value)) {
        callback(new Error(this.defNumberRegExpDesc))
      } else {
        callback()
      }
    }

    return {
      templateType: '',
      width: '70%',
      dividerVisible: false,
      formShadow: {},
      rules: {},
      defStringRegExp: '',
      defStringRegExpDesc: '',
      defNumberRegExp: '',
      defNumberRegExpDesc: '',
      integerRule: { required: true, trigger: 'blur', validator: integerValidator },
      stringRule: { required: true, trigger: 'blur', validator: stringValidator }
    }
  },

  watch: {
    jsonEditor: function(val) {
      val === true ? this.width = '70%' : this.width = '40%'
    },

    value: {
      handler: function(val) {
        if (val && !this.jsonEditor) {
          this.$nextTick(() => {
            this.$refs['userAddedInfo'].clearValidate()
            this.formShadow = {}
          })
        }
      },
      immediate: true
    },
    templateType: function() {
      this.formShadow = {}
    }
  },
  created() {
    getResource({
      token: 'default',
      kind: 'RegExp',
      namespace: 'default',
      name: 'defstr'
    }).then((response) => {
      this.defStringRegExp = response.data.spec.value
      this.defStringRegExpDesc = response.data.spec.desc
    })

    getResource({
      token: 'default',
      kind: 'RegExp',
      namespace: 'default',
      name: 'defnum'
    }).then((response) => {
      this.defNumberRegExp = response.data.spec.value
      this.defNumberRegExpDesc = response.data.spec.desc
    })
  },

  methods: {
    close() {
      this.$emit('update:value', !this.value)
    },
    handleInput(event) {
      this.$emit('update:jsonFileObj', event)
    },

    takeActionAndClose() {
      if (!this.jsonEditor) {
        this.copyInfo().then(() => {
          this.$refs['userAddedInfo'].validate(valid => {
            if (valid) {
              for (const index in this.formData) {
                this.formData[index].value = this.formShadow[index]
              }
              this.$emit('action')
              this.$emit('update:value', !this.value)
            }
          })
        })
      } else {
        this.$emit('action')
        this.$emit('update:value', !this.value)
      }
    },

    handleChange() {
      if (this.dividerVisible === false) {
        this.dividerVisible = true
      }
      this.$emit('selectChange', this.templateType)
    },
    async copyInfo() {
      for (const key in this.formData) {
        this.rules[key] = []
        if (this.formData[key].regexp) {
          const response = await getResource({
            token: 'default',
            kind: 'RegExp',
            namespace: 'default',
            name: this.formData[key].regexp
          })

          if (this.$valid(response)) {
            const validator = (rule, value, callback) => {
              if (!check(response.data.spec.value, value)) {
                callback(new Error(response.data.spec.desc))
              } else {
                callback()
              }
            }
            this.rules[key].push({ required: true, trigger: 'blur', validator })
          }
        } else if (this.formData[key].type === 'integer') {
          this.rules[key].push(this.integerRule)
        } else if (this.formData[key].type === 'string') {
          this.rules[key].push(this.stringRule)
        }
      }
    }
  }
}
</script>

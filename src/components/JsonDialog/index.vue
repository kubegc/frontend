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
import { getResource } from '@/api/k8sResource'

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
    const formValidator0 = (rule, value, callback) => {
      if (!check(this.formRegExp[0], this.formData[0])) {
        callback(new Error(this.formDesc[0]))
      } else {
        callback()
      }
    }

    const formValidator1 = (rule, value, callback) => {
      if (!check(this.formRegExp[1], this.formData[1])) {
        callback(new Error(this.formDesc[1]))
      } else {
        callback()
      }
    }

    const formValidator2 = (rule, value, callback) => {
      if (!check(this.formRegExp[2], this.formData[2])) {
        callback(new Error(this.formDesc[2]))
      } else {
        callback()
      }
    }

    const formValidator3 = (rule, value, callback) => {
      if (!check(this.formRegExp[3], this.formData[3])) {
        callback(new Error(this.formDesc[3]))
      } else {
        callback()
      }
    }

    const formValidator4 = (rule, value, callback) => {
      if (!check(this.formRegExp[4], this.formData[4])) {
        callback(new Error(this.formDesc[4]))
      } else {
        callback()
      }
    }

    const formValidator5 = (rule, value, callback) => {
      if (!check(this.formRegExp[5], this.formData[5])) {
        callback(new Error(this.formDesc[5]))
      } else {
        callback()
      }
    }

    const formValidator6 = (rule, value, callback) => {
      if (!check(this.formRegExp[6], this.formData[6])) {
        callback(new Error(this.formDesc[6]))
      } else {
        callback()
      }
    }

    const formValidator7 = (rule, value, callback) => {
      if (!check(this.formRegExp[7], this.formData[7])) {
        callback(new Error(this.formDesc[7]))
      } else {
        callback()
      }
    }

    const formValidator8 = (rule, value, callback) => {
      if (!check(this.formRegExp[8], this.formData[8])) {
        callback(new Error(this.formDesc[8]))
      } else {
        callback()
      }
    }

    const formValidator9 = (rule, value, callback) => {
      if (!check(this.formRegExp[9], this.formData[9])) {
        callback(new Error(this.formDesc[9]))
      } else {
        callback()
      }
    }

    const formValidator10 = (rule, value, callback) => {
      if (!check(this.formRegExp[10], this.formData[10])) {
        callback(new Error(this.formDesc[10]))
      } else {
        callback()
      }
    }

    const formValidator11 = (rule, value, callback) => {
      if (!check(this.formRegExp[11], this.formData[11])) {
        callback(new Error(this.formDesc[11]))
      } else {
        callback()
      }
    }

    const formValidator12 = (rule, value, callback) => {
      if (!check(this.formRegExp[12], this.formData[12])) {
        callback(new Error(this.formDesc[12]))
      } else {
        callback()
      }
    }

    const formValidator13 = (rule, value, callback) => {
      if (!check(this.formRegExp[13], this.formData[13])) {
        callback(new Error(this.formDesc[13]))
      } else {
        callback()
      }
    }

    const formValidator14 = (rule, value, callback) => {
      if (!check(this.formRegExp[14], this.formData[14])) {
        callback(new Error(this.formDesc[14]))
      } else {
        callback()
      }
    }

    const formValidator15 = (rule, value, callback) => {
      if (!check(this.formRegExp[15], this.formData[15])) {
        callback(new Error(this.formDesc[15]))
      } else {
        callback()
      }
    }

    const stringValidator = (rule, value, callback) => {
      if (!check(this.defStringRegExp, value)) {
        callback(new Error(this.defStringRegExpDesc))
      } else {
        callback()
      }
    }

    const integerValidator = (rule, value, callback) => {
      if (!check(this.defStringRegExp, value)) {
        callback(new Error(this.defStringRegExpDesc))
      } else {
        callback()
      }
    }

    return {
      templateType: '',
      width: '70%',
      dividerVisible: false,
      formShadow: {
        0: '',
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
        9: '',
        10: '',
        11: '',
        12: '',
        13: '',
        14: '',
        15: ''
      },
      formRule: {
        0: { required: true, trigger: 'blur', validator: formValidator0 },
        1: { required: true, trigger: 'blur', validator: formValidator1 },
        2: { required: true, trigger: 'blur', validator: formValidator2 },
        3: { required: true, trigger: 'blur', validator: formValidator3 },
        4: { required: true, trigger: 'blur', validator: formValidator4 },
        5: { required: true, trigger: 'blur', validator: formValidator5 },
        6: { required: true, trigger: 'blur', validator: formValidator6 },
        7: { required: true, trigger: 'blur', validator: formValidator7 },
        8: { required: true, trigger: 'blur', validator: formValidator8 },
        9: { required: true, trigger: 'blur', validator: formValidator9 },
        10: { required: true, trigger: 'blur', validator: formValidator10 },
        11: { required: true, trigger: 'blur', validator: formValidator11 },
        12: { required: true, trigger: 'blur', validator: formValidator12 },
        13: { required: true, trigger: 'blur', validator: formValidator13 },
        14: { required: true, trigger: 'blur', validator: formValidator14 },
        15: { required: true, trigger: 'blur', validator: formValidator15 }
      },
      formDesc: {
        0: '',
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
        9: '',
        10: '',
        11: '',
        12: '',
        13: '',
        14: '',
        15: ''
      },
      formRegExp: {
        0: '',
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
        9: '',
        10: '',
        11: '',
        12: '',
        13: '',
        14: '',
        15: ''
      },
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
          for (let i = 0; i < this.formData.length; i++) {
            this.formShadow[i] = this.formData[i].value
            console.log('---' + this.formShadow[i])
          }

          this.$nextTick(() => {
            this.$refs['userAddedInfo'].clearValidate()
          })
        }
      },
      immediate: true
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
      this.copyInfo()
      this.$refs['userAddedInfo'].validate(valid => {
        if (valid) {
          for (const index in this.formData) {
            this.formData[index].value = this.formShadow[index]
          }
          this.$emit('action')
          this.$emit('update:value', !this.value)
        }
      })
    },

    handleChange() {
      if (this.dividerVisible === false) {
        this.dividerVisible = true
      }
      this.$emit('selectChange', this.templateType)
    },
    copyInfo() {
      for (const key in this.formData) {
        this.rules[key] = []
        if (this.formData[key].regexp) {
          const validator = (rule, value, callback) => {
            if (!check(this.formData[key].regexp, value)) {
              callback(new Error(this.desc))
            } else {
              callback()
            }
          }
          const rule = { required: true, trigger: 'blur', validator }
          this.rules[key].push(rule)
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

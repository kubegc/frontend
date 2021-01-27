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
      <el-button type="primary" :disabled="(!ifCreate || dividerVisible) ? false : true" @click="takeActionAndClose">确 定</el-button>
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
    const stringValidator = (rule, value, callback) => {
      console.log(value)
      if (!check(this.stringRegExp, value)) {
        callback(new Error(this.stringRegExpDesc))
      } else {
        callback()
      }
    }
    const integerValidator = (rule, value, callback) => {
      console.log(value)
      if (!check(this.stringRegExp, value)) {
        callback(new Error(this.stringRegExpDesc))
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
      rules: {},
      stringRegExp: '',
      stringRegExpDesc: '',
      integerRegExp: '',
      integerRegExpDesc: '',
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
      name: 'username'
    }).then((response) => {
      this.stringRegExp = response.data.spec.value
      this.stringRegExpDesc = response.data.spec.desc
    })

    getResource({
      token: 'default',
      kind: 'RegExp',
      namespace: 'default',
      name: 'username'
    }).then((response) => {
      this.integerRegExp = response.data.spec.value
      this.integerRegExpDesc = response.data.spec.desc
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
        console.log(valid)
        if (valid) {
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
    updateOriginValue(index, value) {
      this.formShadow[index] = value
      this.$forceUpdate()
    },
    copyInfo() {
      for (const key in this.formData) {
        // if (this.formShadow[key] === undefined) {
        //   this.formShadow[key] = this.formData[key].value
        // }
        this.rules[key] = []
        if (this.formData[key].type === 'integer') {
          this.rules[key].push(this.integerRule)
        }
        if (this.formData[key].type === 'string') {
          this.rules[key].push(this.stringRule)
        }
      }
    }
  }
}
</script>

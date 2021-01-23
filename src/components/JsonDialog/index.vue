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
      <el-form>
        <el-form-item :label="'请选择模板：'">
          <el-select v-model="templateType" placeholder="选择模版" @change="handleChange">
            <el-option v-for="item in createTemplates" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-divider v-if="dividerVisible" content-position="center"><i class="el-icon-edit" /> 请完整填写下列相关信息</el-divider>
      <el-form label-width="auto" style="margin-top: 50px">
        <el-form-item v-for="(formItem, index) in createTableData" :key="index" :label="formItem.nameVariable">
          <el-col :span="22">
            <el-radio-group v-if="formItem.type === 'bool'" v-model="formItem.value">
              <el-radio :label="true">true</el-radio>
              <el-radio :label="false">false</el-radio>
            </el-radio-group>
            <el-input
              v-else
              :value="formItem.value"
              :placeholder="formItem.placeholder"
              @input="updateOriginValue(formItem, $event)"
            />
          </el-col>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="takeActionAndClose">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import JsonEditor from '@/components/JsonEditorSpecial'

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
    createTableData: {
      required: false,
      type: Array
    }
  },
  data() {
    return {
      templateType: '',
      width: '70%',
      dividerVisible: false
    }
  },
  watch: {
    jsonEditor: function(val) {
      val === true ? this.width = '70%' : this.width = '40%'
    }
  },
  methods: {
    close() {
      this.$emit('update:value', !this.value)
    },
    handleInput(event) {
      this.$emit('update:jsonFileObj', event)
    },
    takeActionAndClose() {
      this.$emit('action')
      this.$emit('update:value', !this.value)
    },
    handleChange() {
      if (this.dividerVisible === false) {
        this.dividerVisible = true
      }
      this.$emit('selectChange', this.templateType)
    },
    updateOriginValue(obj, value) {
      this.$forceUpdate()
      obj.value = value
    }
  }
}
</script>

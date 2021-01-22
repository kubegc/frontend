<template>
  <el-dialog
    :title="title"
    :visible="value"
    width="70%"
    @update:visible="close"
  >
    <JsonEditor
      v-if="jsonEditor"
      :value="JSON.stringify(jsonFileObj, null, 2)"
      @input="handleInput($event)"
    />
    <div v-else>
      <div>
        请选择模版：
        <el-select v-model="templateType" placeholder="选择模版" @change="handleChange">
          <el-option v-for="item in createTemplates" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </div>
      <el-table
        :data="createTableData"
        border
        fit
        highlight-current-row
        style="width: 100%;margin-top:20px"
      >
        <el-table-column label="key" align="center">
          <template slot-scope="{row}">
            <span>{{ row.nameVariable }}</span>
          </template>
        </el-table-column>
        <el-table-column label="value" align="center">
          <template slot-scope="{row}">
            <el-radio-group v-if="row.placeholder == 'bool'" v-model="row.value">
              <el-radio :label="true">true</el-radio>
              <el-radio :label="false">false</el-radio>
            </el-radio-group>
            <input
              v-if="row.placeholder != 'bool'"
              style="border-radius:8px;border:1px solid grey;outline:none"
              class="el-input"
              :placeholder="row.placeholder"
              :value="getInputValue(row,'value')"
              @input="updateInputValue(row,'value',$event.target.value)"
            >
          </template>
        </el-table-column>
      </el-table>
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
      templateType: ''
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
      this.$emit('selectChange', this.templateType)
    },
    getInputValue(scope, longKey) {
      if (JSON.stringify(scope) === '{}' || !longKey) {
        return ''
      }
      if (longKey.indexOf('.') < 0) {
        if (longKey === 'unknown') {
          return '无'
        } else {
          return scope[longKey]
        }
      }
      const keys = longKey.split('.')
      let res = scope
      keys.every((item) => {
        if (item.indexOf('[') > 0) {
          res = res[item.substring(0, item.indexOf('['))]
          if (res === undefined || res.length === 0) {
            res = 'unknown'
            return false
          } else {
            res =
              res[
                parseInt(
                  item.substring(item.indexOf('[') + 1, item.indexOf(']'))
                )
              ]
            return true
          }
        } else {
          // todo 这里代码有问题，if走不到
          if (res && res[item]) {
            res = res[item]
            return true
          } else {
            res = '无'
            return false
          }
        }
      })
      // console.log(res)
      return res
    },
    updateInputValue(scope, longKey, event) {
      if (longKey.indexOf('.') < 0) {
        scope[longKey] = event
        return
      }
      const keys = longKey.split('.')
      let obj = scope
      for (let i = 0; i < keys.length; i++) {
        const element = keys[i]
        if (element.indexOf('[') > 0) {
          obj = obj[element.substring(0, element.indexOf('['))]
          obj =
            obj[
              parseInt(
                element.substring(
                  element.indexOf('[') + 1,
                  element.indexOf(']')
                )
              )
            ]
        } else {
          obj = obj[element]
        }
      }
      obj[keys[keys.length - 1]] = event
    }
  }
}
</script>

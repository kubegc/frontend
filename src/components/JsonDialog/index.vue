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
    }
  }
}
</script>

<template>
  <el-dialog
    :visible.sync="value"
    width="70%"
  >
    <JsonEditor
      :value="JSON.stringify(jsonFileObj, null, 2)"
      @input="jsonFileObj = JSON.parse($event)"
    />
    <div slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="close">确 定</el-button>
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
    }
  },
  methods: {
    close() {
      this.value = false
    }
  }
}
</script>

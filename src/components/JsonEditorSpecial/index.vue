<template>
  <div class="json-editor">
    <textarea ref="textarea"/>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/panda-syntax.css'
require('script-loader!jsonlint')
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'

export default {
  name: 'JsonEditor',
  /* eslint-disable vue/require-prop-types */
  props: ['value'],
  data() {
    return {
      jsonEditor: false
    }
  },
  watch: {
    value: {
      handler: function(value) {
        const editorValue = this.jsonEditor.getValue()
        if (value !== editorValue) {
          // this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
          this.jsonEditor.setValue(value)
        }
      }
    }
  },
  mounted() {
    this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      mode: 'text/x-java',
      gutters: ['CodeMirror-lint-markers'],
      theme: 'panda-syntax',
      lint: true
    })
    // this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
    this.jsonEditor.setValue(this.value)
    this.jsonEditor.on('change', cm => {
      this.$emit('changed', cm.getValue())
      this.$emit('input', cm.getValue())
    })
  },
  methods: {
    getValue() {
      return this.jsonEditor.getValue()
    }
  }
}
</script>

<style lang="scss" scoped>
.json-editor {
  height: 100%;
  position: relative;
  //line-height: 120%;
  ::v-deep {
    .CodeMirror {
      height: auto;
      min-height: 300px;
      max-height: 600px;
    }

    .CodeMirror-scroll {
      min-height: 300px;
      max-height: 600px;
    }

    .cm-s-rubyblue span.cm-string {
      color: #F08047;
    }
  }
}
</style>

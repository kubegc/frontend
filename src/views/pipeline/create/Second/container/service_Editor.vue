<template>
  <div class="pipeline-workflow__column pipeline-workflow__column_left pipeline-workflow__column--w100p">
    <div class="white-box-with-shadow">
      <div class="white-box-with-shadow__content">
        <div class="row cf-pipeline-yml-build__wrapper">
          <div class="cf-pipeline-yml-build__editor cf-pipeline-yml-build__editor_inline">
            <div class="cf-pipeline-yml-build__editor-wrapper">
              <div class="yaml-desc" v-show="show1" @click="clicktrue()">请输入 Kubernetes YAML 配置</div>
              <textarea style="width: 100%; height: 100%" ref="textarea" v-show="show2" ></textarea>
            </div>
            <div class="modal-block" v-if="service.source === 'template' && showModal">
              <el-button type="primary" size="small" @click="showModal = false">预览/编辑</el-button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="info.message" class="yaml-errors__container yaml-errors__accordion-opened">
        <ul class="yaml-errors__errors-list yaml-infos__infos-list">
          <li class="yaml-errors__errors-list-item yaml-infos__infos-list-item">
            <div class="yaml-errors__errors-list-item-text">{{info.message}}</div>
          </li>
        </ul>
      </div>
      <div v-if="errors.length > 0" class="yaml-errors__container yaml-errors__accordion-opened">
        <ul class="yaml-errors__errors-list">
          <li v-for="(error,index) in errors" :key="index" class="yaml-errors__errors-list-item">
            <div class="yaml-errors__errors-list-item-counter">{{index+1}}</div>
            <div class="yaml-errors__errors-list-item-text">{{error.message}}</div>
          </li>
        </ul>
      </div>
      <div class="controls__wrap">
        <div class="controls__right">
          <el-button  v-hasPermi="{projectName: projectName, actions:['edit_service','create_service'],operator:'or'}" v-if="!hideSave" type="primary" size="small" :disabled="disabledSave || !yamlChange" @click="updateService">保存</el-button>
          <el-button v-if="!isOnboarding" type="primary" size="small" :disabled="!showJoinToEnvBtn" @click="showJoinToEnvDialog">加入环境</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import jsyaml from 'js-yaml'
// import { debounce } from 'lodash'
// import { codemirror } from 'vue-codemirror'
// import 'codemirror/lib/codemirror.css'
// import 'codemirror/mode/yaml/yaml.js'
// import 'codemirror/theme/xq-light.css'
// import 'codemirror/addon/scroll/annotatescrollbar.js'
// import 'codemirror/addon/search/matchesonscrollbar.js'
// import 'codemirror/addon/search/matchesonscrollbar.css'
// import 'codemirror/addon/search/match-highlighter.js'
// import 'codemirror/addon/search/jump-to-line.js'
//
// import 'codemirror/addon/dialog/dialog.js'
// import 'codemirror/addon/dialog/dialog.css'
// import 'codemirror/addon/search/searchcursor.js'
// import 'codemirror/addon/search/search.js'
// import {
//   validateYamlAPI,
//   serviceTemplateAPI,
//   saveServiceTemplateAPI
// } from '@api'
export default {
  // props: {
  //   serviceInTree: {
  //     type: Object,
  //     required: true
  //   },
  //   isOnboarding: {
  //     type: Boolean,
  //     default: false
  //   },
  //   showJoinToEnvBtn: {
  //     type: Boolean,
  //     default: false
  //   },
  //   yamlChange: Boolean
  // },
  data () {
    return {
      // codemirror options
      cmOptions: {
        tabSize: 5,
        readOnly: false,
        mode: 'text/yaml',
        lineNumbers: true,
        line: true,
        collapseIdentical: true
      },
      importTemplateEditorOption: {
        tabSize: 2,
        readOnly: 'nocursor',
        theme: 'neo',
        mode: 'text/x-dockerfile',
        lineNumbers: false,
        line: true,
        showGutter: false,
        displayIndentGuides: false,
        showPrintMargin: false,
        collapseIdentical: true
      },
      errors: [],
      info: { message: '' },
      service: {},
      stagedYaml: {},
      initYaml: '',
      dialogImportYamlVisible: false,
      previewYamlFile: false,
      showModal: true,
      show1:true,
      show2:false
    }
  },
  methods: {
    clicktrue(){
      this.show1 = !this.show1;
      this.show2 = !this.show2
    }
    // keepInitYaml (newYaml) {
    //   this.initYaml = newYaml
    //   this.$emit('update:yamlChange', this.initYaml !== this.service.yaml)
    // },
    // getService (val) {
    //   const serviceName = val ? val.service_name : this.serviceName
    //   const projectName = val.product_name
    //   const serviceType = val.type
    //   this.service.yaml = ''
    //   if (val && serviceType) {
    //     serviceTemplateAPI(serviceName, serviceType, projectName).then(res => {
    //       this.service = res
    //       // emit template id to tree
    //       if (res.template_id) {
    //         this.$emit('onGetTemplateId', { service_name: res.service_name, template_id: res.template_id })
    //       }
    //       this.keepInitYaml(res.yaml)
    //       if (this.$route.query.kind) {
    //         this.jumpToWord(`kind: ${this.$route.query.kind}`)
    //       }
    //     })
    //   }
    // },
    // updateServiceByKeyword () {
    //   const cantSave = this.hideSave || this.disabledSave || !this.yamlChange
    //   if (cantSave) {
    //     return
    //   }
    //   this.updateService()
    // },
    // updateService () {
    //   const projectName = this.projectName
    //   const serviceName = this.service.service_name
    //   const visibility = this.service.visibility
    //     ? this.service.visibility
    //     : 'private'
    //   const yaml = this.service.yaml
    //   const payload = {
    //     product_name: projectName,
    //     service_name: serviceName,
    //     visibility: visibility,
    //     type: 'k8s',
    //     yaml: yaml,
    //     source: 'spock'
    //   }
    //   return saveServiceTemplateAPI(payload).then(res => {
    //     this.$message({
    //       type: 'success',
    //       message: `服务 ${payload.service_name} 保存成功`
    //     })
    //     this.keepInitYaml(payload.yaml)
    //     this.$emit('onUpdateService', {
    //       serviceName: serviceName,
    //       serviceStatus: this.service.status,
    //       res
    //     })
    //     this.$emit('update:showJoinToEnvBtn', true)
    //   })
    // },
    // showJoinToEnvDialog () {
    //   this.$emit('showJoinToEnvDialog', true)
    // },
    // onCmCodeChange: debounce(function (newCode) {
    //   this.errors = []
    //   this.service.yaml = newCode
    //   this.$emit('update:yamlChange', this.initYaml !== this.service.yaml)
    //   if (this.service.yaml) {
    //     this.validateYaml(newCode)
    //     if (this.service.status === 'named') {
    //       this.stagedYaml[this.service.service_name] = newCode
    //     }
    //   }
    // }, 100),
    // validateYaml (code) {
    //   const payload = this.service
    //   validateYamlAPI(this.projectName, payload).then(res => {
    //     if (res && res.length > 0) {
    //       this.errors = res
    //     } else if (res && res.length === 0) {
    //       this.errors = []
    //       this.kindParser(payload.yaml)
    //     }
    //   })
    // },
    // kindParser (yaml) {
    //   const yamlJsonArray = yaml
    //     .split('---')
    //     .filter(element => {
    //       return element.indexOf('kind') > 0
    //     })
    //     .map(element => {
    //       return jsyaml.load(element)
    //     })
    //   this.$emit('onParseKind', {
    //     service_name: this.service.service_name,
    //     payload: yamlJsonArray.filter(item => {
    //       return item
    //     })
    //   })
    // },
    // jumpToWord (word) {
    //   this.$nextTick(() => {
    //     const result = this.codemirror.showMatchesOnScrollbar(word)
    //     if (result.matches.length > 0) {
    //       const line = result.matches[0]
    //       this.codemirror.setSelection(line.from, line.to)
    //       this.codemirror.scrollIntoView({ from: line.from, to: line.to }, 200)
    //     }
    //   })
    // },
    // editorFocus () {
    //   this.codemirror.focus()
    // }
  },
  computed: {
    // codemirror () {
    //   return this.$refs.myCm.codemirror
    // },
    // projectName () {
    //   return this.$route.params.project_name
    // },
    // serviceType () {
    //   return this.serviceInTree.type
    // },
    // serviceName () {
    //   return this.serviceInTree.service_name
    // },
    // disabledSave () {
    //   return this.errors.length > 0
    // },
    // hideSave () {
    //   if (
    //     this.service.source === 'gitlab' ||
    //     this.service.source === 'github' ||
    //     this.service.source === 'gerrit' ||
    //     (this.service.visibility === 'public' &&
    //       this.service.product_name !== this.projectName)
    //   ) {
    //     return true
    //   } else {
    //     return false
    //   }
    // }
  },
  watch: {
    // serviceInTree: {
    //   handler (val, old_val) {
    //     if (
    //       val.visibility === 'public' &&
    //       val.product_name !== this.projectName
    //     ) {
    //       this.info = {
    //         message:
    //           '信息：其他项目的共享服务，不支持在本项目中编辑，编辑器为只读模式'
    //       }
    //     } else if (
    //       val.product_name === this.projectName &&
    //       val.source &&
    //       val.source !== 'spock' && val.source !== 'template'
    //     ) {
    //       this.info = {
    //         message: '信息：当前服务为仓库管理服务，编辑器为只读模式'
    //       }
    //     } else {
    //       this.info = {
    //         message: ''
    //       }
    //     }
    //     if (val.status === 'added') {
    //       this.getService(val)
    //       if (
    //         val.source === 'gitlab' ||
    //         val.source === 'gerrit' ||
    //         val.source === 'github' ||
    //         (val.visibility === 'public' &&
    //           val.product_name !== this.projectName)
    //       ) {
    //         this.cmOptions.readOnly = 'nocursor'
    //       } else {
    //         this.cmOptions.readOnly = false
    //       }
    //       if (val.source === 'template') {
    //         this.showModal = true
    //       }
    //     } else if (val.status === 'named') {
    //       this.service = {
    //         yaml: '',
    //         service_name: val.service_name,
    //         status: 'named'
    //       }
    //       this.initYaml = '-#-'
    //       this.$emit('update:yamlChange', this.initYaml !== this.service.yaml)
    //       this.cmOptions.readOnly = false
    //       if (this.stagedYaml[val.service_name]) {
    //         this.service.yaml = this.stagedYaml[val.service_name]
    //       }
    //       this.$refs.myCm && this.editorFocus()
    //     }
    //   },
    //   immediate: true
    // }
  },
  mounted () {
    // this.editorFocus()
  },
  components: {
    // CodeMirror: codemirror
  }
}
</script>
<style lang="less">
  .pipeline-workflow__column_left {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    height: 100%;
    margin-right: 5px;
    padding-right: 15px;

    .CodeMirror {
      width: 100%;
      min-width: 100%;
      max-width: 100%;
      height: calc(~'100% - 20px');
      line-height: 21px;
      border-color: #464e5c;
      border-radius: 3px;
      outline: none !important;

      .CodeMirror-gutters {
        background: none;
        border: none;
      }
    }

    .btn-container {
      margin-top: 10px;
    }

    .white-box-with-shadow {
      display: flex;
      flex-direction: column;
      height: 100%;
      background-color: #fff;
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.05);

      .no-content {
        display: flex;
        flex-direction: column;
        align-content: center;
        align-items: center;
        justify-content: center;
        height: 100%;

        img {
          width: 200px;
          height: 200px;
        }

        p {
          color: #606266;
          font-size: 15px;
        }
      }

      .white-box-with-shadow__content {
        display: flex;
        flex: 1;
        flex-direction: column;
        min-height: 0;
        padding: 0 0 0 0;

        .cf-pipeline-yml-build__yaml-type {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;

          .service-name {
            span {
              font-size: 13px;
            }
          }

          .method-select {
            .el-button + .el-button {
              margin-left: 0;
            }
          }
        }

        .cf-pipeline-yml-build__wrapper {
          position: relative;
          display: flex;
          flex: 1;
          flex-direction: column;
          min-height: 0;
          margin-right: 0;
          margin-left: 0;
        }

        .cf-pipeline-yml-build__editor {
          display: flex;
          flex-direction: column;
          height: 100%;

          .cf-pipeline-yml-build__editor-wrapper {
            position: relative;
            flex: 1;
            min-height: 0;
            border: none !important;

            .from-code-container {
              margin-top: 50px;
            }

            .yaml-desc {
              position: absolute;
              z-index: 1;
              padding: 9px 34px;
              color: #ccc;
              font-size: 13px;
            }

            textarea{
              background:transparent;

              border-style:none;

              padding-left:20px;

            }
          }

          .modal-block {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 999;
            padding: 14px;
            background: rgba(234, 234, 234, 0.92);
            cursor: not-allowed;
          }
        }
      }

      .yaml-errors__container {
        position: relative;
        margin-bottom: 0;
        overflow-y: hidden;
        background-color: #eb5848;

        .yaml-errors__errors-list {
          max-height: 180px;
          margin: 0;
          padding: 0 15px;
          padding-top: 5px;
          padding-bottom: 5px;
          list-style: none;
          background-color: #eb5848;
          transition: max-height 200ms ease-out;

          &.yaml-infos__infos-list {
            background-color: #909399;
          }

          .yaml-errors__errors-list-item {
            display: flex;
            align-items: center;
            min-height: 35px;
            padding-left: 10px;
            color: #fff;
            font-size: 14px;
            background-color: #eb5848;
            border-bottom: 1px solid #ff7666;

            &.yaml-infos__infos-list-item {
              background-color: #909399;
            }

            .yaml-errors__errors-list-item-counter {
              margin-right: 20px;
              font-weight: bold;
            }

            .yaml-errors__errors-list-item-text {
              flex: 1;
              width: 300px;
              max-width: 100%;
              padding: 5px 0;
            }

            &:last-child {
              border-bottom: none;
            }
          }
        }
      }

      .controls__wrap {
        position: relative;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 55px;
        margin: 0 15px;
        background-color: #fff;
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.05);

        > * {
          margin-right: 10px;
        }

        .controls__right {
          display: flex;
          align-items: center;

          .save-btn {
            margin-right: 15px;
            padding: 10px 17px;
            color: #fff;
            font-size: 13px;
            text-decoration: none;
            background-color: #0066ff;
            border: 1px solid #0066ff;
            cursor: pointer;
            transition: background-color 300ms, color 300ms, border 300ms;
          }

          .save-btn[disabled] {
            background-color: #9ac9f9;
            border: 1px solid #9ac9f9;
            cursor: not-allowed;
          }
        }
      }
    }

    &.pipeline-workflow__column--w100p {
      padding-right: 0;
    }
  }

</style>

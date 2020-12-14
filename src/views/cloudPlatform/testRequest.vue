<template>
  <div class="container">
    <el-form label-position="top">
      <el-form-item label="方法列表">
        <el-select filterable style="float: left" v-model="value" placeholder="请选择" @change="handle(value)">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="请求参数：">
        <el-input :rows="6" type="textarea" v-model="form.desc"/>
        <el-row style="margin-top: 30px">
          <el-col>
            <el-button type="primary" @click="onSubmit">发送请求</el-button>
            <el-button>取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" width="70%" height="50%">
      <span slot="title">返回内容</span>
      <json-editor style="width:100%;"
                   :value="JSON.stringify(jsonString, null, 2)"
                   @input="jsonString  = JSON.parse($event)"
      />
      <el-button slot="footer" type="primary" @click="dialogVisible = false">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import JsonEditor from '@/components/JsonEditorSpecial/index'
import { createResource, getResource, updateResource, listResources, queryTest, getMeta } from '@/api/k8sResource'
import axios from 'axios'

export default {
  name: 'Dashboard',
  components: { JsonEditor },
  computed: {
    ...mapGetters(['name', 'role'])
  },
  data() {
    return {
      options: [],
      value: '',
      form: {
        desc: ''
      },
      jsonString: {},
      cloud_kind: 'AliyunECS',
      resTemp: [],
      requestPara: {},
      id: '',
      dialogVisible: false
    }
  },
  mounted() {
    listResources({
      kind: 'Template',
      page: 1,
      limit: 1000,
      labels: {
        type: this.cloud_kind
      }
    }).then((response) => {
      var res = response.data.items
      this.resTemp = response.data.items
      for (var i = 0; i < res.length; i++) {
        var obj = res[i].spec
        var key = Object.keys(obj)[0]
        var temp = { 'value': key, 'label': key }
        this.options.push(temp)
      }

    }),
      getResource({
        kind: 'Metadata', name: 'cloudid', namespace: 'default'
      }).then((response) => {
        this.id = response.data.spec.id
      })
  },
  methods: {
    handle(value) {
      for (var i = 0; i < this.resTemp.length; i++) {
        var obj = this.resTemp[i].spec
        var key = Object.keys(obj)[0]
        if (value == key) {
          this.form.desc = JSON.stringify(obj[value].lifecycle[value], null, 4)
          this.requestPara = obj
          break
        }

      }
    },
    onSubmit() {
      var temp = this.requestPara[this.value].lifecycle
      temp[this.value] = JSON.parse(this.form.desc)
      queryTest({
        id: this.id,
        lifecycle: temp
      }).then((response) => {
        this.jsonString = response.data
        this.dialogVisible = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.iframe {
  width: 100%;
  height: 1000px;
  border: 0ch;
}
</style>

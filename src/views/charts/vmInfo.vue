<template>
  <div class="app-container">
    <el-row :gutter="20">    
      <el-col :span="13" style="margin-bottom:32px;">
        <el-card>
                    <span style="display:inline-block; margin-bottom:10px; fontSize:16px; font-weight:bold">yaml配置</span>
          <div class="card-editor-container">
            <json-editor ref="jsonEditor" v-model="value" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="11" style="margin-bottom:32px;"> 
        <el-card>  
                    <span style="display:inline-block; margin-bottom:10px; fontSize:16px; font-weight:bold">监控信息</span>     
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="24">
              <iframe class="rate_iframe" :src="monitor_rs.cpu"></iframe>
            </el-col>
          </el-row>
        </el-card>
        <el-card>
        <el-row type="flex" class="row-bg">
          <el-col :span="24">
            <iframe class="rate_iframe" :src="monitor_rs.memory"></iframe>
          </el-col>
        </el-row>
      </el-card>
      <el-card>
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="24">
            <iframe class="rate_iframe" :src="monitor_rs.fs"></iframe>
          </el-col>
        </el-row>
      </el-card>
      <el-card> 
        <el-row>
          <el-col :span="24">
            <iframe class="IO_iframe" :src="monitor_rs.network"></iframe>
          </el-col>
        </el-row>  
      </el-card>      
      </el-col>   
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {getMonitorInfo} from '@/utils/getResource'
import JsonEditor from '@/components/JsonEditor'
import {
  getResource,
  listResources
} from '@/api/k8sResource'

export default {
  name: 'vmInfo',
  components: { JsonEditor },
  data() {
    return {
      tableKey: 0,
      list: null,
      activeTab: 'activity',
      key: '',
      monitor_rs:{},
      node:'',
      objectName:'link',
      viewerName:'VirtualMachine',
      nodeName:'',
      podList:'',
      listQuery:'',
      listLoading:'',
      columns:'',
      value: {},
      kind: '',
      table_kind: "table",
      frontend_kind: "Frontend",
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.vmName = this.$route.query.name
    this.node = this.$route.query.nodeName
    this.kind = this.$route.query.tabName

    this.monitor_rs = getMonitorInfo(this.viewerName, this.vmName, null)
          
    getResource({kind: this.frontend_kind , name: this.table_kind + '-' +this.kind.toLowerCase()}).then(response => {
      if (this.validateRes(response) == 1) {
      this.columns = response.data
        listResources({kind: this.kind}).then(response => {
          if (this.validateRes(response) == 1) {
          var data = response3.data.items
          //this.total = response3.total
          this.listLoading = false
        console.log(data)

          for(var i = 0; i < data.length; i++) {
              if(data[i].metadata.name == this.vmName) {
                this.list = data[i]
              }
            }
                this.value = this.list
            console.log(this.list)
          }
        })
      }
    })

  },
  mounted() {
    
  },
  methods: {
    validateRes(res) {
      if(res.code == 20000) {
        return 1
      }else {
        this.$notify({
          title: "error",
          message: res.data,
          type: "warning",
          duration: 3000
        });
        return 0
      }
    },
   
    getList() {
      this.listLoading = true
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      this.handleFilter()
    },
    getInputValue(scope,longKey){
      if( JSON.stringify(scope)=='{}'){
        return ''
      }
      if( longKey == "" || longKey == undefined || longKey == null || !longKey){
        return ''
      }
      if( longKey.indexOf('\.') < 0 ){
        return scope[longKey]
      }
      var keys = longKey.split("\.")
      var res =scope;
      keys.forEach(element => {
        if(element.indexOf('\[') > 0){
            if(res[element.substring(0,element.indexOf('\['))]) {
                res = res[element.substring(0,element.indexOf('\['))]
                res = res[parseInt(element.substring(element.indexOf('\[')+1,element.indexOf('\]')))]
            } else {
                res = ""
            }           
        }
        else{
            if(res[element]) {
                res = res[element]
            }else {
                res = ""
            }          
        }
      });
      //console.log(res)
      return res
    },
    updateInputValue(scope,longKey,event){
      if( longKey.indexOf('\.') < 0 ){
         scope[longKey] = event
         return 
      }
      var keys = longKey.split("\.")
      var obj = scope
      for (var i=0 ;i < keys.length -1 ;i++){
        var element = keys[i]
        if(element.indexOf('\[') > 0){
          obj = obj[element.substring(0,element.indexOf('\['))]
          obj = obj[parseInt(element.substring(element.indexOf('\[')+1,element.indexOf('\]')))]
        }
        else{
          obj = obj[element]
        }
      }
      obj[keys[keys.length-1]] = event
    }
  },
}
</script>
<style lang="scss" scoped>
.iframe{
  width: 280px;
  height: 135px;
  border: 0ch;
  }
.rate_iframe{
  width: 562px;
  height: 150px;
  border: 0ch;
  }
.IO_iframe{
  width: 562px;
  height: 150px;
  border: 0ch;
  }
.board {
  margin-left: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
.card-editor-container{
  position: relative;
  width: 100%;
  height: 70%;
}
</style>
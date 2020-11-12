<template>
  <div class="components-container">
    <el-row :gutter="20" style="margin:30px;">
      <el-col :span="7" v-for="(item,index) in value" :key="item.title" style="margin-bottom:30px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>
              <p style="display:inline;font-size:18px;"> <strong>{{ value[index].title }}</strong></p>
            </span>
          </div>
          <p style="font-size:12px;">此处配置项用于操作{{item.title}}</p>
          <el-button type="primary" style="float:left;margin:20px;" @click.native="applyA(index)">超分</el-button>
          <el-button type="primary" style="float:right;margin:20px;" @click.native="clickA(index)">编辑配置</el-button>
        </el-card>
      </el-col>
    </el-row>
    
    <el-dialog v-el-drag-dialog :visible.sync="dialogTableVisible" :title="json.kind" @dragDialog="handleDrag">
          <el-select ref="select" v-model="modelType" style="margin-top:0px;margin-bottom:20px;"  @change="refreshData">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"  />
          </el-select>
          <el-button type="primary" style="float:right;margin-top:0px;height:5%;display:inline;margin-right:20px;margin-bottom:20px;" @click.native="clickB">确认配置</el-button>
            <div class="card-editor-container">
              <!-- <json-editor ref="EditableJson" v-model="value" /> -->
            <EditableJson v-model="json" />
            </div>
        </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import EditableJson from '@/components/EditableJson'
import {getJsonData,saveContianerConfig,getListAllData } from '@/api/commonData'
import { getPriorityData} from '@/api/taskData'

export default {
  name: 'Template',
  directives: { elDragDialog },
  components: {
    // Kanban,
    EditableJson
  },
  data() {
    return {
      schedulingType: '未选择',
      group: 'mission',
      list1: [],
      list2: [],
      list3: [],
      dialogTableVisible: false,
      options: [
        
      ],
      modelType: '',
      value: [],
      // tasks:[{"key":1,"name":"创建pod"},{"key":2,"name":"创建deployment"}],
      viewerName: "containers",
      json:[],
      kind: "",
      index:0,
      viewer: 'nodes',
      list:[]

    }
  },
  
  mounted() {
  },
  created() {
      
        getListAllData({viewerName: this.viewer}).then(response3 => {
          if (this.validateRes(response3) == 1) {
          for(var i = 0; i < response3.data.length;i++) {
              var a ={title: response3.data[i].metadata.name,json:response3.data[i]}
            this.value.push(a)
        }
        console.log(this.value)
          }
         
        })
        
    
    // getJsonData({viewerName: "templates"}).then(response => {
    //   this.value = response.data;
    //   console.log(this.value)
    // })
    
  
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
      applyA(index) {
      this.$message({
        message: '主机被设置为可配置超分！',
        type: 'success'
      })
    },
    refreshData(val) {
      console.log(val)
      if(val == 'priority'){
        this.json = this.value[this.index+3]       
      }else if(val == 'default') {
        this.json = this.value[this.index]
      }
    },
    clickA(index) {
      this.dialogTableVisible = true
      this.json = this.value[index]
      this.kind = this.value[index].title
      this.index = index
    },
    clickB() {
      this.dialogTableVisible = false
      this.schedulingType = this.modelType
      var res = this.toRawJson(this.json);
      updateJsonData({operator:"update",json: JSON.parse(res), kind:this.kind}).then(response => {
      console.log(response.code)
      })
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      this.$refs.select.blur()
    },
    toRawJson(val){
      var str = JSON.stringify(val)
      str = str.replace(/ +/g,"")
      str = str.replace(/\\n/g,"")
      str = str.substring(1,str.length-1)
      str = str.replace(/\\/g,"")
      return str;
    }
  }
}
</script>

<style lang="scss">

.board {
  margin-left: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
.kanban {
  &.todo {
    .board-column-header {
      background: #4A9FF9;
    }
  }
  &.working {
    .board-column-header {
      background: #f9944a;
    }
  }
  &.done {
    .board-column-header {
      background: #2ac06d;
    }
  }
}

.card-editor-container{
  position: relative;
  width: 100%;
  height: 70%;
}
</style>


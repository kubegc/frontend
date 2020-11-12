<template>
  <div class="components-container">
    <el-row :gutter="20" style="margin:30px;">
      <el-col :span="7" v-for="(item,index) in value" :key="item.kind" style="margin-bottom:30px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            
            <el-checkbox label="value[index].action">
          <span>
              <p style="display:inline;font-size:18px;"> <strong>{{ value[index].action }}</strong></p>
            </span>
        </el-checkbox>
          </div>
          <p style="font-size:16px;">{{item.des}}</p>
          <el-button type="primary" style="float:left;margin:20px;" @click.native="applyA(index)">应用</el-button>

          <el-button type="primary" style="float:right;margin:20px;" @click.native="clickA(index)">编辑</el-button>
        </el-card>
      </el-col>   
    </el-row>
    
    <el-dialog v-el-drag-dialog :visible.sync="dialogTableVisible" :title="json.kind" @dragDialog="handleDrag">
          <el-select ref="select" v-model="modelType" style="margin-top:0px;margin-bottom:20px;" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
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
// import Kanban from '@/components/Kanban'
import EditableJson from '@/components/EditableJson'
import { getScheduleData} from '@/api/taskData'
import {getJsonData,saveContianerConfig } from '@/api/commonData'

const jsonData = '[{"items":[{"market_type":"forexdata","symbol":"XAUUSD"},{"market_type":"forexdata","symbol":"UKOIL"},{"market_type":"forexdata","symbol":"CORN"}],"name":""}]'

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
        { value: '', label: '' }
      ],
      modelType: '',
      value: [{kind:'schedule',action:'批处理场景',des:'关注网络吞吐量'},
              {kind:'schedule',action:'微服务场景',des:'关注约束'},
              {kind:'schedule',action:'机器学习场景',des:'关注异构资源'}],
      // tasks:[{"key":1,"name":"创建pod"},{"key":2,"name":"创建deployment"}],
      viewerName: "containers",
      json:{},
      kind: ""

    }
  },
  
  mounted() {
  },
  created() {
  
  },

  methods: {
    applyA(index) {
      this.$message({
        message: this.value[index].action+'调度策略应用成功！',
        type: 'success'
      })
    },
    
    clickA(index) {
      this.dialogTableVisible = true
      getScheduleData().then(response => {
          this.json = response.data.links[0]
                      
      })
      //this.json = this.value[index]
      //this.kind = this.value[index].kind
    },
    clickB() {
      this.dialogTableVisible = false
      
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


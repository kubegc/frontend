<template>
  <div class="workflow-task-detail">
    <div class="block-title">流水线</div>
    <el-row>
      <el-col :span="6">
        <div class="section-head">
          <el-button size="small" @click="createDialog" style="margin-bottom: 40px">新建流水线</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row
      v-for="row in pipelineItems.rows"
      :key="row.index"
      :gutter="pipelineItems.gutter"
    />
    <el-dialog
      :modal="true"
      :fullscreen="fullscreen"
      custom-class="dialog-custom"
      :visible.sync="dialog"
      width="90%"
      top="5vh"
    >
      <div>
        <pipeline />
      </div>
    </el-dialog>
<!--    <el-table-->
<!--      v-for="row in getUserList.rows"-->
<!--      :key="row.index"-->
<!--      :gutter="getUserList.gutter"-->
<!--      :data="getUserList.items">-->
<!--&lt;!&ndash;      {{row.items}}&ndash;&gt;-->
<!--      <el-table-column prop="name" label="名称"></el-table-column>-->
<!--    </el-table>-->
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      style="width: 100%" >
      <el-table-column label="序号" prop="index" min-width="40%">
      </el-table-column>
      <el-table-column prop="type" label="类型" min-width="80%">
      </el-table-column>
      <el-table-column prop="name" label="名称" min-width="80%">
      </el-table-column>
      <el-table-column  label="操作">
        <el-button
          type="primary"
          icon="el-icon-edit"
          circle
          size="small">
        </el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          circle
          size="small">
        </el-button>
<!--        <el-button-->
<!--          type="danger"-->
<!--          icon="el-icon-delete">取消-->
<!--        </el-button>-->
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top:15px;">
      <el-pagination
        align='center'
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10,20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { getUserList } from '../../api/api'
import pipeline from '../pipeline/pipeline'
export default {
  components: { pipeline },
  data() {
    return {
      pipelineItems: [],
      getUserList: [],
      tableData: [],
      dialog: false,
      fullscreen: false,
      currentPage: 1,
      total: 20,
      pageSize: 2
    }
  },
  mounted() {
    this.pipelinelength()
    this.initPage()
    // this.fetchdata()
    // var _this = this
    // axios.get('/pipelineItems')
    //   .then(function(res) {
    //     console.log(res)
    //     _this.tableData = res.data.items
    //   })
    //   .catch(function(error) {
    //     console.log(error)
    //   })
  },
  methods: {
    createDialog() {
      this.dialog = true
    },
    pipelinelength() {
      axios.get('/getPipelineItems').then(response => {
        while (response.data < 100) {
          return response.data.data
        }
      })
    },

    next() {
      if (this.active++ > 3) this.active = 0
    },

    initPage() {
      getUserList().then(res => {
        if (res) {
          console.log('getUserListres', res.data.data)
          this.tableData = res.data.data
        }
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.currentPage = 1
      this.pageSize = val
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
    }

    // fetchdata(){
    //   axios
    //     .get('/pipelineItems')
    //     .then(
    //       response => {
    //         console.log('fetchdata', response.data.data)
    //         this.tableData = response.data.data
    //       }
    //     )
    // }
  }
}
</script>

<style>
  .workflow-task-detail {
    margin-bottom: 350px;
    position: relative;
    flex: 1;
    padding: 0 20px;
    overflow: auto;
  }

  .section-head {
    margin-top: 30px;
    color: #303133;
    font-size: 20px;
    line-height: 20px;
    border-bottom: 1px solid #eee;
  }

  .demo-table-expand label {
    width: 90px;
     color: #99a9bf;
  }
</style>

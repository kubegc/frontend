<template>
  <div class="app">
    <el-row :gutter="20">
      <el-col>
        <el-card :body-style="{ height: '8em' }" />
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 30px">
      <el-col :xs="24" :sm="24" :lg="16">
        <el-card>
          <el-table
            :data="tableData"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="date"
              label="日期"
              width="180"
            />
            <el-table-column
              prop="name"
              label="姓名"
              width="180"
            />
            <el-table-column
              prop="address"
              label="地址"
            />
          </el-table>
        </el-card>

      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card :body-style="{ height: '8em'}" />
        <el-card :body-style="{ height: '8em'}" style="margin-top: 30px" />
        <el-card :body-style="{ height: '8em'}" style="margin-top: 30px" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  }
}
</script >
<style lang="scss" scoped>
.app{
  padding: 50px 50px;
}
</style>

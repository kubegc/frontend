<template>
  <div>
    <el-tree :data="treeData">
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-circle-plus"
            @click="append(data)"
            v-if="data.level === 2 && !data.oneChild"
          >
            增加子路由
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog :visible.sync="routeEditVisible" append-to-body>
      <el-row :gutter="15">
        <el-form ref="routeForm" :model="routeContent" :rules="rules" size="medium" label-width="100px">

          <el-col :span="21">
            <el-form-item label="title">
              <el-input v-model="routeContent.title" placeholder="title" clearable :style="{width: '100%'}" />
            </el-form-item>
          </el-col>

          <el-col :span="21">
            <el-form-item label="icon">
              <el-input v-model="routeContent.icon" placeholder="icon" clearable :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button @click="routeEditVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'RoutesTreeView',
  props: ['value', 'resourceName', 'pageType'],
  data() {
    return {
      treeData: undefined,
      routeEditVisible: false,
      submitRequire: undefined,
      routeContent: {
        title: undefined,
        icon: undefined
      },
      rules: {
        title: [{
          required: true,
          message: 'title',
          trigger: 'blur'
        }],
        icon: [{
          required: false,
          message: 'icon',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    const routes = this.value.spec.routes
    this.treeData = this.generateTreeData(routes)
  },
  methods: {
    generateTreeData(routes, parent) {
      const res = []
      for (const item of routes) {
        const currNode = {}
        if (item.meta) {
          currNode.label = item.meta.title
        } else {
          currNode.label = item.children[0].meta.title
          currNode.oneChild = true
        }
        currNode.path = []
        parent && parent.path
          ? currNode.path = parent.path.concat(currNode.label)
          : currNode.path = [].concat(currNode.label)
        parent ? currNode.level = parent.level + 1 : currNode.level = 1

        if (item.children && !currNode.oneChild) {
          currNode.children = this.generateTreeData(item.children, currNode)
        }
        res.push(currNode)
      }
      return res
    },
    append(data) {
      this.routeEditVisible = true
      this.submitRequire = data
    },
    handleSubmit() {
      this.$refs['routeForm'].validate(valid => {
        if (!valid) return
        const data = this.submitRequire
        const path = data.path
        let routesTemp = this.value.spec.routes
        console.log(path)
        for (const key of path) {
          routesTemp = routesTemp.filter(item => item.meta && item.meta.title === key)
          routesTemp = routesTemp[0].children
        }
        const routeContentTemp = {
          path: this.resourceName + '-' + new Date().getTime(),
          name: this.resourceName,
          component: '/charts/' + this.pageType,
          meta: {
            title: this.routeContent.title,
            icon: this.routeContent.icon
          }
        }
        routesTemp.push(routeContentTemp)

        const newRouteData = {}
        newRouteData.label = routeContentTemp.meta.title
        newRouteData.path = data.path.concat(newRouteData.label)
        newRouteData.level = data.level + 1
        data.children.push(newRouteData)
        this.routeEditVisible = false
        this.$message({
          message: '增加路由节点成功，不要忘记提交哦！',
          type: 'success',
          duration: 4000
        })
        this.$emit('input', this.value)
      }
      )
    }
  }
}
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>

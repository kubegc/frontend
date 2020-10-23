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
            @click="() => append(data)"
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
            <el-form-item label="path" prop="path">
              <el-input v-model="routeContent.path" placeholder="path" clearable :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
          <el-col :span="21">
            <el-form-item label="name" prop="name">
              <el-input v-model="routeContent.name" placeholder="name" clearable :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
          <el-col :span="21">
            <el-form-item label="component" prop="component">
              <el-input
                v-model="routeContent.component"
                placeholder="component"
                clearable
                :style="{width: '100%'}"
              />
            </el-form-item>
          </el-col>
          <el-col :span="21">
            <el-form-item label="meta" prop="meta">
              <el-input
                v-model="routeContent.meta"
                placeholder="meta 对象信息"
                clearable
                :style="{width: '100%'}"
              >
                <template slot="prepend">{</template>
                <template slot="append">}</template>
              </el-input>
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
  props: ['value'],
  data() {
    return {
      treeData: undefined,
      routeEditVisible: false,
      submitRequire: undefined,
      routeContent: {
        path: undefined,
        name: undefined,
        component: undefined,
        meta: undefined
      },
      rules: {
        path: [{
          required: true,
          message: 'path',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: 'name',
          trigger: 'blur'
        }],
        component: [{
          required: true,
          message: 'component',
          trigger: 'blur'
        }],
        meta: [{
          required: true,
          message: 'meta 对象信息',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    const routes = this.value.spec.routes
    this.treeData = this.generateTreeData(routes)
    console.log(this.treeData)
  },
  methods: {
    generateTreeData(routes, parent) {
      const res = []
      for (const item of routes) {
        const currNode = {}
        currNode.label = item.meta.title
        currNode.path = []
        parent && parent.path
          ? currNode.path = parent.path.concat(currNode.label)
          : currNode.path = [].concat(currNode.label)

        if (item.children) {
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
        // todo
        const data = this.submitRequire
        const path = data.path
        let routesTemp = this.value.spec.routes
        for (const key of path) {
          console.log(key)
          routesTemp = routesTemp.filter(item => item.meta.title === key)
          routesTemp = routesTemp[0].children
        }
        const routeContentTemp = Object.assign({}, this.routeContent);
        routeContentTemp.meta = JSON.parse('{' + routeContentTemp.meta + '}')
        routesTemp.push(routeContentTemp)

        const newRouteData = {}
        newRouteData.label = routeContentTemp.meta.title
        newRouteData.path = data.path.concat(newRouteData.label)
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

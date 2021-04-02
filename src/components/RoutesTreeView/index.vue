<template>
  <div>
    <el-tree :data="treeData">
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="data.level === 2 && !data.oneChild"
            type="text"
            size="mini"
            icon="el-icon-circle-plus"
            @click.stop="append(node)"
          />
          <el-button type="text" size="mini" @click.stop="del(node, data)">
            删除
          </el-button>
          <el-button type="text" size="mini" @click.stop="edit(node, data)">
            编辑
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog :visible.sync="routeAddVisible" append-to-body>
      <el-row :gutter="15">
        <el-form ref="routeForm" :model="routeContent" :rules="rules" size="medium" label-width="100px">

          <el-col :span="21">
            <el-form-item label="菜单名">
              <el-input v-model="routeContent.title" placeholder="title" clearable :style="{width: '100%'}" />
            </el-form-item>
          </el-col>

          <el-col :span="21">
            <el-form-item label="图标名">
              <el-select v-model="routeContent.icon" placeholder="icon" clearable :style="{width: '100%'}">
                <el-option
                  v-for="(item, key) in icons"
                  :key="key"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col v-if="!comp" :span="21">
            <el-form-item label="组件路径">
              <el-input v-model="routeContent.comp" placeholder="title" clearable :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button @click="routeAddVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="routeEditVisible" append-to-body>
      <JsonEditor
        :value="JSON.stringify(routeEditObj, null, 2)"
        @input="routeEditObj = JSON.parse($event)"
      />
      <div slot="footer">
        <el-button @click="routeEditVisible = false">取消</el-button>
        <el-button type="primary" @click="changeOriginRoutesFile">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { dropdownValues } from '@/api/common'
import JsonEditor from '@/components/JsonEditorSpecial/index'
export default {
  name: 'RoutesTreeView',
  components: { JsonEditor },
  props: ['value', 'resourceName', 'comp', 'pageType'],
  data() {
    return {
      treeData: undefined,
      routeAddVisible: false,
      routeEditVisible: false,
      routeEditObj: undefined,
      routeOriginObjParent: undefined,
      routeOriginObjIndex: undefined,
      currentEditNode: undefined,
      submitRequire: undefined,
      icons: [],
      routeContent: {
        title: undefined,
        icon: undefined,
        comp: undefined
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
  watch: {
    value(newVal) {
      this.treeData = this.generateTreeData(newVal.spec.routes)
    }
  },
  created() {
    const routes = this.value.spec.routes
    this.treeData = this.generateTreeData(routes)
    dropdownValues('icons', this.icons)
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
        parent ? currNode.level = parent.level + 1 : currNode.level = 1
        if (item.children && !currNode.oneChild) {
          currNode.children = this.generateTreeData(item.children, currNode)
        }
        res.push(currNode)
      }
      return res
    },
    append(node) {
      this.routeAddVisible = true
      this.submitRequire = node
    },
    handleSubmit() {
      this.$refs['routeForm'].validate(valid => {
        if (!valid) return
        const node = this.submitRequire
        const path = this.getPath(node)
        let routesTemp = this.value.spec.routes
        for (const key of path) {
          routesTemp = routesTemp.filter(item => item.meta && item.meta.title === key)
          routesTemp = routesTemp[0].children
        }
        const routeContentTemp = {
          path: new Date().getTime() + '',
          name: this.resourceName,
          component: this.comp || this.routeContent.comp,
          meta: {
            title: this.routeContent.title,
            icon: this.routeContent.icon,
            kind: this.pageType === 'cards' ? this.resourceName : undefined
          }
        }
        routesTemp.push(routeContentTemp)
        const newRouteData = {}
        newRouteData.label = routeContentTemp.meta.title
        // newRouteData.path = data.path.concat(newRouteData.label)
        newRouteData.level = node.data.level + 1
        node.data.children.push(newRouteData)
        this.routeAddVisible = false
        this.$message({
          message: '增加路由节点成功，不要忘记提交哦！',
          type: 'success',
          duration: 4000
        })
        // this.$emit('input', this.value)
      }
      )
    },
    del(node, data) {
      const path = this.getPath(node.parent)
      let routesTemp = this.value.spec.routes
      for (const key of path) {
        const pre = routesTemp
        routesTemp = routesTemp.filter(item => (item.meta && item.meta.title === key) || (!item.meta && item.children[0].meta.title === key))
        if (routesTemp[0].meta) {
          routesTemp = routesTemp[0].children
        } else {
          routesTemp = pre
        }
      }
      const index = routesTemp.findIndex(item => (item.meta && item.meta.title === data.label) || (!item.meta && item.children[0].meta.title === data.label))
      routesTemp.splice(index, 1)
      const parent = node.parent
      const children = parent.childNodes
      const idx = children.findIndex(item => item.id === node.id)
      children.splice(idx, 1)
    },
    edit(node, data) {
      this.currentEditNode = node
      const path = this.getPath(node)
      let routesTemp = this.value.spec.routes
      if (path.length === 1) {
        this.routeOriginObjParent = routesTemp
      }
      for (let i = 0; i < path.length; i++) {
        const key = path[i]
        const index = routesTemp.findIndex(item => (item.meta && item.meta.title === key) || (!item.meta && item.children[0].meta.title === key))
        if (i !== path.length - 1) {
          routesTemp = routesTemp[index].children
        } else {
          routesTemp = routesTemp[index]
          this.routeOriginObjIndex = index
        }
        if (i === path.length - 2) {
          this.routeOriginObjParent = routesTemp
        }
      }
      this.routeEditObj = routesTemp
      this.routeEditVisible = true
    },
    changeOriginRoutesFile() {
      this.routeOriginObjParent[this.routeOriginObjIndex] = this.routeEditObj
      this.diffAndChange(this.currentEditNode, this.routeEditObj)
      this.routeEditVisible = false
    },
    diffAndChange(node, routeObj) {
      node.data.label = routeObj.meta ? routeObj.meta.title : routeObj.children[0].meta.title
      if (routeObj.meta && routeObj.children) {
        for (let i = 0; i < routeObj.children.length; i++) {
          this.diffAndChange(node.childNodes[i], routeObj.children[i])
        }
      }
    },
    getPath(node) {
      const path = []
      while (node.data.label) {
        path.unshift(node.label)
        node = node.parent
      }
      return path
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

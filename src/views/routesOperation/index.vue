<template>
  <div class="app-container">
    <el-row>
      <el-button round @click="dialogVisible = true">编辑</el-button>
    </el-row>
    <el-row style="margin-top: 30px">
      <el-col :span="12">
        <routes-tree-view
          v-if="routesFile"
          ref="routesTreeView"
          v-model="routesFile"
        />
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px">
      <el-button round @click="revert">撤销修改</el-button>
      <el-button type="primary" round @click="submit">
        提交修改
      </el-button>
    </el-row>
    <el-dialog
      :visible.sync="dialogVisible"
      width="70%"
    >
      <json-editor
        v-if="routesFile"
        :value="JSON.stringify(routesFile.spec.routes, null, 2)"
        @input="routesFile.spec.routes = JSON.parse($event)"
      />
      <div slot="footer">
        <el-button @click="_close">取 消</el-button>
        <el-button type="primary" @click="_close">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RoutesTreeView from '@/components/RoutesTreeView/index'
import { getResource, updateResource } from '@/api/kubernetes'
import JsonEditor from '@/components/JsonEditorSpecial/index'
export default {
  components: { RoutesTreeView, JsonEditor },
  data() {
    return {
      routesFile: undefined,
      dialogVisible: false
    }
  },
  created() {
    this.revert()
  },
  methods: {
    revert() {
      getResource({
        kind: 'Frontend',
        name: 'routes-' + this.$store.getters.role.toLowerCase(),
        namespace: 'default'
      }).then(
        response => {
          if (this.$valid(response)) {
            this.routesFile = response.data
          }
        }
      )
    },
    submit() {
      updateResource({ json: this.routesFile }).then(
        response => {
          if (this.$valid(response)) {
            this.$message({
              message: '路由更新成功',
              type: 'success',
              duration: 4000
            })
            location.reload()
          }
        }
      )
    },
    _close() {
      this.dialogVisible = false
      this.$refs.routesTreeView.treeData = this.$refs.routesTreeView.generateTreeData(this.routesFile.spec.routes)
    }
  }
}
</script>

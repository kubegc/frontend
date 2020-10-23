<template>
  <div>
    <el-dialog v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" title="Dialog Titile">
      <el-row :gutter="15">
        <el-form ref="routeForm" :model="routeContent" :rules="rules" size="medium" label-width="100px">
          <el-col :span="21">
            <el-form-item label="path" prop="path">
              <el-input v-model="routeContent.path" placeholder="path" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="21">
            <el-form-item label="name" prop="name">
              <el-input v-model="routeContent.name" placeholder="name" clearable :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="21">
            <el-form-item label="component" prop="component">
              <el-input v-model="routeContent.component" placeholder="component" clearable
                        :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="21">
            <el-form-item label="meta" prop="meta">
              <el-input v-model="routeContent.meta" placeholder="meta 对象信息" clearable
                        :style="{width: '100%'}">
                <template slot="prepend">{</template>
                <template slot="append">}</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  components: {},
  props: [],
  data() {
    return {
      routeContent: {
        path: undefined,
        name: undefined,
        component: undefined,
        meta: undefined,
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
        }],
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onOpen() {},
    onClose() {
      this.$refs['routeForm'].resetFields()
    },
    close() {
      this.$emit('update:visible', false)
    },
    handelConfirm() {
      this.$refs['routeForm'].validate(valid => {
        if (!valid) return
        this.close()
      })
    },
  }
}

</script>
<style>
</style>

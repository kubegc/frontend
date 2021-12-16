<template>
  <div class="full-form">
    <el-form
      :ref="formName"
      :model="model"
      label-position="left"
      :inline="true"
    >
      <el-form-item
        v-for="(efi, key) in formData.items"
        :key="key"
        :label="efi.label"
        :prop="efi.path"
      >
        <el-input
          v-if="efi.type === 'textbox'"
          v-model="model[efi.path]"
          size="medium"
          :placeholder="efi.prompt"
        />
        <el-select
          v-if="efi.type === 'combobox'"
          v-model="model[efi.path]"
          :placeholder="efi.prompt"
        >
          <el-option
            v-for="(option, key) in efi.options"
            :key="key"
            :label="option"
            :value="key"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button icon="el-icon-search" type="primary" round @click="submitForm()">
          搜索
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button round @click="resetForm()"> 重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { queryResourceValue } from '@/api/kubernetes'
import { mapGetters } from 'vuex'

export default {
  name: 'DynamicForm',
  props: {
    formData: Object
  },
  data() {
    return {
      formName: 'search',
      model: {}
    }
  },
  watch: {
    formData(newVal) {
      this.formData = newVal
    }
  },
  created() {
    for (let i = 0; i < this.formData.items.length; i++) {
      if (this.formData.items[i].type === 'combobox') {
        queryResourceValue({ token: this.token, data: this.formData.items[i].data }).then(response => {
          console.log(this.$valid(response))
          if (this.$valid(response)) {
            this.formData.items[i]['options'] = response.data
            this.$forceUpdate()
          }
        })
      }
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  methods: {
    submitForm() {
      this.$emit('watchSearch', this.model)
    },
    resetForm() {
      this.$refs[this.formName].resetFields()
    }
  }
}
</script>

<style scoped>
.full-form {
  min-width: 100%;
  min-height: 100%;
  height: auto;
  overflow: hidden;
  margin-bottom: 22px;
}

.permission-tree {
  margin-bottom: 30px;
}

.full-form .el-form-item__label {
  font-weight: 400;
}

.full-form .el-form-item--medium .el-form-item__label {
  line-height: 32px;
}

.full-form .el-input--medium .el-input__inner {
  height: 32px;
  line-height: 32px;
}

.full-form .el-form-item__content {
  margin-left: 10px;
}

.full-form .el-button--medium {
  padding: 1px 15px;
  font-size: 14px;
  border-radius: 4px;
  height: 32px;
}

.el-form-item + .el-form-item {
  margin-left: 10px;
}

.el-form-item {
  margin-bottom: 0;
}

</style>

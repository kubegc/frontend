<template>
  <div class="app-detail-container">
    <el-row class="top-row">
      <el-col>
        {{ detail.metadata.name }}
        <a v-if="kind == 'Image'" :href="'http://39.106.40.190:5002/?image=' + detail.metadata.name">
          <el-button icon="el-icon-share" circle style="box-shadow: 0 8px 16px 0 rgba(36, 46, 66, 0.28);" />
        </a>
      </el-col>
    </el-row>
    <el-divider />
    <el-row>

      <el-form label-position="top">

        <el-form-item
          v-for="item in info"
          :key="item.label"
          :label="item.label"
        >
          <div v-if="typeof (item.value) === 'string'">
            <span>
              {{ item.value }}
            </span>
            <el-divider />
          </div>
          <el-row
            v-if="item.value instanceof Object"
            :gutter="20"
          >
            <el-col v-for="(itemValue, index) in item.value" :key="index" :span="8">
              <el-card shadow="hover">
                <div v-if="typeof index === 'string'" slot="header" class="p-style">
                  <span>{{ index }}</span>
                </div>
                <p v-for="(propValue, propKey) in itemValue" :key="propKey" class="p-style">
                  {{ propKey + ': ' + propValue }}
                </p>
              </el-card>
              <el-divider />
            </el-col>
          </el-row>

        </el-form-item>

      </el-form>
    </el-row>
  </div>
</template>

<script>
import { getResource } from '@/api/kubernetes'

export default {
  data() {
    return {
      info: [],
      detail: {},
      kind: ''
    }
  },
  created() {
    this.kind = this.$route.params.kind
    this.detail = this.$route.params.detail
    getResource({ kind: 'Frontend', name: 'detailspec-' + this.kind.toLowerCase(), namespace: 'default' }).then(
      response => {
        if (this.$valid(response)) {
          this.detailSpec = response.data.spec.detailSpec
          for (const item of this.detailSpec) {
            const tempObj = {}
            tempObj.label = item
            tempObj.value = this.getValue(item)
            this.info.push(tempObj)
          }
        }
      }
    )
  },
  methods: {
    getValue(key) {
      const pathToValue = key.split('.')
      let value = this.detail
      for (const item of pathToValue) {
        if (item.indexOf('[') !== -1) {
          const arrayName = item.substring(0, item.indexOf('['))
          const index = item.substring(item.indexOf('[') + 1, item.indexOf(']'))
          value = value[arrayName][index]
        } else {
          value = value[item]
        }
      }
      return value
    }
  }
}
</script>

<style lang="scss" scoped>
.app-detail-container {
  padding: 10px 20px;

  .top-row {
    margin-bottom: 30px;
    font-size: 50px;
  }

  .p-style {
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
  }

  .el-row {
    .el-form {
      margin-left: 20px;

      ::v-deep {
        label {
          font-size: 20px;
        }
      }

      .el-form-item {
        p, span {
          font-size: 16px;
        }

        //.el-col:nth-child(n + 4) {
        //  margin-top: 30px;
        //}
      }
    }
  }

}

</style>

<template>
  <div class="app-detail-container">
    <el-row class="top-row">
      <el-col>
        {{ detail.metadata.name }}
        <a href="http://39.106.40.190:5002/?image=tomcat">
          <el-button icon="el-icon-share" circle style="box-shadow: 0 8px 16px 0 rgba(36, 46, 66, 0.28);" />
        </a>

      </el-col>
    </el-row>
    <el-divider />
    <el-row>

      <el-form label-position="top">
        <el-form-item
          v-for="key in detailSpec"
          :key="key"
          :label="key"
        />

        <el-form-item label="architecture">
          <span>{{ imageJson.metadata.architecture }}</span>
          <el-divider />
        </el-form-item>

        <el-form-item label="os">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-card>
                <p v-for="(val, key) in imageJson.os" :key="key">
                  {{ key + ': ' + val }}
                </p>
              </el-card>
              <el-divider />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="application">
          <el-row :gutter="20">
            <el-col v-for="(item, index) in imageJson.application" :key="index" :span="6">
              <el-card>
                <p v-for="(val, key) in item" :key="key" class="p-style">{{ key + ':' + val }}</p>
              </el-card>
              <el-divider />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="image">
          <span>{{ imageJson.metadata.config.Image }}</span>
          <el-divider />
        </el-form-item>

      </el-form>
    </el-row>
  </div>
</template>

<script>
import { getResource } from '@/api/k8sResource'

export default {
  data() {
    return {
      detailSpec: [],
      detail: {}
    }
  },
  created() {
    const kind = this.$route.params.kind
    this.detail = this.$route.params.detail
    getResource({ kind: 'Frontend', name: 'detailSpec-' + this.kind.toLowerCase(), namespace: 'default' }).then(
      response => {
        if (this.$valid(response)) {
          this.detailSpec = response.data.spec.detailSpec
        }
      }
    )
  }
}
</script>

<style lang="scss" scoped>
.app-detail-container {
  padding: 10px 20px;

  .top-row{
    margin-bottom: 30px;
    font-size: 50px;
  }
  .p-style{
    overflow: hidden;
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
        p, span{
          font-size: 16px;
        }

        .el-col:nth-child(n + 5){
          margin-top: 30px;
        }
      }
    }
  }

}

</style>

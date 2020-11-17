<template>
  <div class="imageMarket-app-container">
    <el-divider content-position="left">{{ $route.meta.kind }}</el-divider>
    <el-row>
      <el-tabs v-model="chosenTabName" tab-position="top" @tab-click="handleTabClick">
        <el-tab-pane label="PublicCloud" name="PublicCloud" />
        <el-tab-pane label="AliyunECS" name="AliyunECS" />
        <el-tab-pane label="BaiduBCE" name="BaiduBCE" />
        <el-tab-pane label="TencentCVM" name="TencentCVM" />
      </el-tabs>
    </el-row>
    <el-row
      :gutter="20"
    >
      <a
        v-for="(item, index) in cardsData"
        :key="index"
        @click="handleClick(item)"
      >
        <el-col
          :span="6"
        >
          <el-tooltip placement="top">
            <div slot="content" style="width: 200px;">
              <p>{{ item.metadata.name }}</p>
            </div>
            <el-card>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-image
                    style="border-radius: 2px;width: 100px; height: 100px"
                    :src="require('../../assets' + (item.avatar ? item.avatar : '/avatar.jpg'))"
                    :fit="'fit'"
                  />
                </el-col>
                <el-col :span="16">
                  <div style="display: block;overflow: hidden;height: 90px">
                    <p style="margin: 0;"><strong>{{ item.metadata.name }}</strong></p>
                    <p v-if="item.describe" style="margin: 0;color: gray;overflow: hidden">
                      {{ item.describe }}
                    </p>
                  </div>
                </el-col>
              </el-row>
              <el-row style="margin-top: 20px">
                <el-col v-if="item.developer" :span="12">
                  <span style="color: black">
                    {{ '开发者：' + item.developer }}
                  </span>
                </el-col>
                <el-col :span="12">
                  <span style="color: black">
                    {{ '版本: ' + item.apiVersion }}
                  </span>
                </el-col>
              </el-row>
            </el-card>
          </el-tooltip>
        </el-col>
      </a>
    </el-row>
    <el-row style="margin-top: 30px">
      <pagination class="pagination" />
    </el-row>
  </div>

</template>

<script>
import { listResources } from '@/api/k8sResource'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    return {
      cardsData: [],
      chosenTabName: undefined,
      listQuery: {
        limit: 12,
        continue: 1
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    handleClick(detail) {
      this.$router.push({ name: 'appDetail', params: { push: true, kind: this.$route.meta.kind, detail }})
    },
    handleTabClick(tab) {
      const type = tab.name
      this.getData(type)
    },
    load() {
      const type = this.chosenTabName
      listResources({
        kind: this.$route.meta.kind,
        labels: { type },
        limit: this.listQuery.limit,
        page: this.listQuery.continue
      }).then(
        response => {
          if (this.$valid(response)) {
            this.cardsData.concat(response.data.items)
          }
        })
    },
    resetListQuery() {
      this.listQuery.continue = 1
    },
    getData(type) {
      listResources({
        kind: this.$route.meta.kind,
        labels: { type },
        limit: this.listQuery.limit,
        page: this.listQuery.continue
      }).then(
        response => {
          if (this.$valid(response)) {
            this.listQuery.continue = response.data.continue
            this.cardsData = response.data.items
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.imageMarket-app-container {
  padding: 10px 20px;
  font-size: 14px;
  line-height: 1.67;
}

.pagination .el-card {
  box-shadow: 0px 1px 2px -2px rgba(0, 0, 0, 0.16),
  0px 3px 6px 0px rgba(0, 0, 0, 0.12),
  0px 5px 12px 4px rgba(0, 0, 0, 0.09);
  margin-top: 30px;
}

.el-card:hover {
  box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.08),
  0px 9px 28px 0px rgba(0, 0, 0, 0.05),
  0px 12px 48px 16px rgba(0, 0, 0, 0.03);
  transform: translateY(-5px);
  color: yellowgreen;
  //border-top: #409EFF 1px solid;
  border: #409EFF 1px solid;
}

</style>

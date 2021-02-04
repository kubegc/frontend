<template>
  <div class="imageMarket-app-container">
    <el-row style="margin-bottom: 20px"><el-tag effect="dark">功能描述<i class="header-icon el-icon-info" /></el-tag></el-row>
    <el-row style="margin-bottom: 20px"><el-tag effect="dark" type="success">{{ desc }}</el-tag></el-row>
    <el-row style="margin-bottom: 30px">
      <el-button icon="el-icon-circle-plus" type="primary" round @click="handleCreateDialogClick">{{
        this.$route.meta.kind
      }}
    </el-button>
    </el-row>
    <el-dialog
      :visible.sync="createDialogVisible"
      width="70%"
    >
      <json-editor
        :value="JSON.stringify(createTemplate, null, 2)"
        @input="createTemplate = JSON.parse($event)"
      />
      <span slot="title">创建</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCreateClick">确 定</el-button>
      </div>
    </el-dialog>

    <el-row>
      <el-tabs v-model="chosenTabName" tab-position="top" @tab-click="handleTabClick">
        <el-tab-pane label="All" name="all"/>
        <el-tab-pane label="AliyunECS" name="AliyunECS"/>
        <el-tab-pane label="BaiduBCE" name="BaiduBCE"/>
        <el-tab-pane label="TencentCVM" name="TencentCVM"/>
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
                    style="border-radius: 2px;"
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
                    {{ 'apiVersion: ' + item.apiVersion }}
                  </span>
                </el-col>
              </el-row>
            </el-card>
          </el-tooltip>
        </el-col>
      </a>
    </el-row>
    <el-row style="margin-top: 30px">
      <pagination
        v-show="total > listQuery.limit"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getData(chosenTabName)"
      />
    </el-row>
  </div>

</template>

<script>
import { createResource, getResource, listResources } from '@/api/k8sResource'
import Pagination from '@/components/Pagination'
import JsonEditor from '@/components/JsonEditorSpecial/index'

export default {
  components: { Pagination, JsonEditor },
  data() {
    return {
      cardsData: [],
      chosenTabName: 'all',
      total: 0,
      listQuery: {
        page: 1,
        limit: 12
      },
      createDialogVisible: false,
      createTemplate: {},
      desc: ''
    }
  },
  created() {
    this.getData()
    getResource({
      token: this.token,
      kind: 'Frontend',
      name: 'desc-' + this.$route.meta.kind.toLowerCase(),
      namespace: 'default'
    }).then((response) => {
      if (this.$valid(response)) {
        this.desc = response.data.spec.desc
      }
    })
  },
  methods: {
    handleClick(detail) {
      this.$router.push({
        name: detail.to ? detail.to : 'appDetail',
        params: { push: true, kind: this.$route.meta.kind, detail }
      })
    },
    handleTabClick(tab) {
      const type = tab.name
      this.getData(type)
      this.resetListQuery()
    },
    handleCreateDialogClick() {
      getResource({
        kind: 'Frontend',
        name: 'createtemplate-' + this.$route.meta.kind.toLowerCase(),
        namespace: 'default'
      }).then(
        response => {
          if (this.$valid(response)) {
            this.createTemplate = response.data.spec
          } else {
            this.$message({
              message: '获取创建模板失败，请手动填写',
              type: 'error',
              duration: 2000
            })
          }
        }
      )
      this.createDialogVisible = true;
    },
    handleCreateClick() {
      createResource({ json: this.createTemplate }).then(
        response => {
          if (this.$valid(response)) {
            this.$message({
              message: '创建' + this.$route.meta.kind + '成功',
              type: 'success',
              duration: 2000
            })
            this.getData()
          } else {
            this.$message({
              message: '创建' + this.$route.meta.kind + '失败,请重新创建',
              type: 'error',
              duration: 2000
            })
          }
        }
      )
      this.createDialogVisible = false
    },
    resetListQuery() {
      this.listQuery.page = 1
    },
    getData(type) {
      listResources({
        kind: this.$route.meta.kind,
        labels: { type: type === 'all' ? undefined : type },
        limit: this.listQuery.limit,
        page: this.listQuery.page
      }).then(
        response => {
          if (this.$valid(response)) {
            this.total = response.data.metadata.totalCount
            this.listQuery.continue = response.data.metadata.continue
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

  .el-card {
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

  .el-tag {
    box-shadow: 0 8px 16px 0 rgba(36, 46, 66, 0.28);
  }
  .el-button{
    box-shadow: 0 8px 16px 0 rgba(36, 46, 66, 0.28);
  }
}
</style>

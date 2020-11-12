<template>
  <div class="imageMarket-app-container">
    <el-divider content-position="center">多云协作分析流水线</el-divider>
    <el-row
      v-for="(row, i1) in pipelineItems.rows"
      :key="row.index"
      :gutter="pipelineItems.gutter"
      style="margin-bottom: 30px"
    >
        <el-col
            v-for="(card, i2) in row.items"
            :key="card.index"
            :span="card.span"
        >
            <el-card v-if="card.type == 'span1'" class="box-card">
                <div slot="header" class="clearfix">
                    <span>{{card.name }}</span>
                    <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                </div>
                <div v-for="o in 4" :key="o" class="text item">
                    {{'列表内容 ' + o }}
                </div>
            </el-card>

            <div style="margin-top:4em" v-if="card.type == 'span2-right'">
               <svg width="6em" height="6em" viewBox="0 0 16 16" class="bi bi-arrow-right-circle-fill" fill="green" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-11.5.5a.5.5 0 0 1 0-1h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5z"/>
</svg>
            </div>

            <div style="margin-top:4em" v-if="card.type == 'span2-left'">
                <svg width="4em" height="4em" viewBox="0 0 16 16" class="bi bi-arrow-bar-left" :fill="card.color" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5zM10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5z"/>
</svg>
            </div>

            <div :style="card.style" v-if="card.type == 'span2-up'">
                <svg width="4em" height="4em" viewBox="0 0 16 16" class="bi bi-arrow-bar-up" :fill="card.color" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5zm-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z"/>
</svg>
            </div>

            <div :style="card.style" v-if="card.type == 'span2-down'">
                <svg width="4em" height="4em" viewBox="0 0 16 16" class="bi bi-arrow-bar-down" :fill="card.color" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zM8 6a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V6.5A.5.5 0 0 1 8 6z"/>
</svg>
            </div>

        </el-col>
    </el-row>

                <div>
            </div>
  </div>
</template>

<script>

import { getPipelineItems } from "@/api/taskData"
import mock from './mock.js'
import axios from 'axios'

export default {
  data() {
    return {
      pipelineItems: []
    }
  },
  mounted() {
    this.readPipeline()
  },
  methods: {
    handleClick() {
      
    },
    readPipeline() {
        axios.get("/getPipelineItems").then(response => {
            if (response.data) {
                this.pipelineItems = response.data.data;
                console.log(this.pipelineItems.span)
                console.log(this.pipelineItems.gutter)
            }
        })
    },
  }
}
</script>

<style lang="scss" scoped>
.imageMarket-app-container {
  padding: 10px 20px;
  font-size: 14px;
  line-height: 1.67
}

.el-card {
  box-shadow: 0px 1px 2px -2px rgba(0, 0, 0, 0.16),
  0px 3px 6px 0px rgba(0, 0, 0, 0.12),
  0px 5px 12px 4px rgba(0, 0, 0, 0.09);

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

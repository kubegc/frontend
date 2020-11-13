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
                    <span v-if="card.color == 'red'" style="color:red;font-weight:bold;font-size:16px;">{{ '步骤' + card.index+"：" }}</span>
                    <span v-if="card.color == 'brown'" style="color:brown;font-weight:bold;font-size:16px;">{{ '步骤' + card.index+"：" }}</span>
                    <span v-if="card.color == 'green'" style="color:green;font-weight:bold;font-size:16px;">{{ '步骤' + card.index+"：" }}</span>
                    <span>{{card.name }}</span>
                </div>
                <div class="text item">
                  <el-row gutter="10">
                      <el-col span="5" style="width:50%">
                        <el-image :src="require('../../assets/' + card.src)" fit="scale-down" lazy style="margin: 0;height:6em">
                        <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline"></i>
                        </div>
                        </el-image>
                      </el-col>
                      <el-col span="5" style="width:50%">
                        <p>{{card.description}}</p>
                      </el-col>
                  </el-row>
                  <el-row gutter="10">
                      <el-col span="5" style="width:50%">
                        <el-button style="background-color:black;width:7em;height:3em;font-size:1em;color:white;margin-left:30%">配置参数</el-button>
                      </el-col>
                      <el-col span="5" style="width:50%">
                        <el-button v-if="card.color == 'black'" style="background-color:black;width:7em;height:3em;font-size:1em;color:white;margin-left:30%">启动</el-button>
                        <el-button v-if="card.color == 'red'" style="background-color:red;width:7em;height:3em;font-size:1em;color:white;margin-left:30%">终止</el-button>
                      <el-button v-if="card.color == 'brown'" style="background-color:brown;width:7em;height:3em;font-size:1em;color:white;margin-left:30%">
                          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          运行
                      </el-button>
                      <el-button v-if="card.color == 'green'" style="background-color:green;width:7em;height:3em;font-size:1em;color:white;margin-left:30%">成功
                      </el-button>
                      </el-col>
                  </el-row>
                </div>
            </el-card>

            <div style="margin-top:4em" v-if="card.type == 'span2-right'">
               <svg width="4em" height="4em" viewBox="0 0 16 16" class="bi bi-arrow-right-circle-fill" :fill="card.color" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-11.5.5a.5.5 0 0 1 0-1h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5z"/>
</svg>
            </div>

            <div style="margin-top:4em" v-if="card.type == 'span2-left'">
                <svg width="4em" height="4em" viewBox="0 0 16 16" class="bi bi-arrow-left-circle-fill" :fill="card.color" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5.5a.5.5 0 0 0 0-1H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5z"/>
</svg>
            </div>

            <div :style="card.style" v-if="card.type == 'span2-up'">
                <svg width="4em" height="4em" viewBox="0 0 16 16" class="bi bi-arrow-up-circle-fill" :fill="card.color" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
</svg>
            </div>

            <div :style="card.style" v-if="card.type == 'span2-down'">
                <svg width="4em" height="4em" viewBox="0 0 16 16" class="bi bi-arrow-down-circle-fill" :fill="card.color" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
</svg>
            </div>

        </el-col>
    </el-row>
  </div>
</template>

<script>

import { getPipelineItems } from "@/api/taskData"
import mock from './mock.js'
import axios from 'axios'
//import './jquery-3.3.1.slim.min.js'
// import './popper.min.js'
// import './bootstrap.min.js'

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
@import './bootstrap.min.css';

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

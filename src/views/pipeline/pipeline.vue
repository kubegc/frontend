<template>
  <div class="imageMarket-app-container">
    <el-divider content-position="center" ><div class="block-title">多云协作分析流水线</div></el-divider>
    <el-steps :active="active" finish-status="success" style="margin: 50px">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
    </el-steps>
<!--    <div>-->
<!--      <div v-show="index == 0">-->
<!--        <el-input-->
<!--          placeholder="类型.."-->
<!--          size="mini"-->
<!--          style="width: 200px"-->
<!--          @keyup.enter.native="next"-->
<!--          v-model="salary.basicSalary"></el-input>-->
<!--      </div>-->
<!--    </div>-->
    <el-row
      v-for="row in pipelineItems.rows"
      :key="row.index"
      :gutter="pipelineItems.gutter"
    >
      <el-col v-for="card in row.items" :key="card.index" :span="card.span" style="text-align:center;">
        <el-card v-if="card.type == 'span1'" class="box-card" v-show="active == 1">
          <div slot="header" class="clearfix">
            <span
              v-if="card.color == 'black'"
              style="color: black; font-weight: bold; font-size: 16px"
            >{{ "步骤 " + card.index + "：" }}</span>
            <span
              v-if="card.color == 'red'"
              style="color: red; font-weight: bold; font-size: 16px"
            >{{ "步骤 " + card.index + "：" }}</span>
            <span
              v-if="card.color == 'brown'"
              style="color: brown; font-weight: bold; font-size: 16px"
            >{{ "步骤 " + card.index + "：" }}</span>
            <span
              v-if="card.color == 'green'"
              style="color: green; font-weight: bold; font-size: 16px"
            >{{ "步骤 " + card.index + "：" }}</span>
            <span>{{ card.name }}</span>
          </div>
          <div class="text item">
            <el-row :gutter="10">
              <el-col :span="5" style="width: 50%">
                <el-image
                  :src="require('../../assets/' + card.src)"
                  fit="scale-down"
                  lazy
                  style="margin: 0; height: 6em"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
              </el-col>
              <el-col :span="5" style="width: 50%">
                <p>{{ card.description }}</p>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12" style="text-align:center;">
                <el-button
                  v-if="card.color == 'black'"
                  style="
                    background-color: black;
                    width: 7em;
                    height: 3em;

                    color: white;
                    display: inline-block;
                  "
                  @click="handleClick('black', card.name)"
                >配置参数</el-button>
                <el-button
                  v-if="card.color == 'red'"
                  style="
                    background-color: red;
                    width: 7em;
                    height: 3em;
                    font-size: 1em;
                    color: white;
                    display: inline-block;
                  "
                  @click="handleClick('red', card.name)"
                >配置参数</el-button>
                <el-button
                  v-if="card.color == 'brown'"
                  style="
                    background-color: brown;
                    width: 7em;
                    height: 3em;
                    font-size: 1em;
                    color: white;
                    display: inline-block;
                  "
                  @click="handleClick('brown', card.name)"
                >配置参数</el-button>
                <el-button
                  v-if="card.color == 'green'"
                  style="
                    background-color: green;
                    width: 7em;
                    height: 3em;
                    font-size: 1em;
                    color: white;
                    display: inline-block;
                  "
                  @click="handleClick('green', card.name)"
                >配置参数</el-button>
              </el-col>
              <el-col :span="12" style="text-align:center;">
                <el-button
                  v-if="card.color == 'black'"
                  style="
                    background-color: black;
                    width: 7em;
                    height: 3em;
                    font-size: 1em;
                    color: white;
                    display: inline-block;
                  "
                  @click="checkLoki('black', card.name)"
                >启动</el-button>
                <el-button
                  v-if="card.color == 'red'"
                  style="
                    background-color: red;
                    width: 7em;
                    height: 3em;
                    font-size: 1em;
                    color: white;
                    display: inline-block;
                  "
                >终止</el-button>
                <el-button
                  v-if="card.color == 'brown'"
                  icon="el-icon-loading"
                  style="
                    background-color: brown;
                    width: 7em;
                    height: 3em;
                    font-size: 1em;
                    color: white;
                    display: inline-block;
                  "
                >

                  运行
                </el-button>
                <el-button
                  v-if="card.color == 'green'"
                  style="
                    background-color: green;
                    width: 7em;
                    height: 3em;
                    font-size: 1em;
                    color: white;
                  "
                >成功
                </el-button>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card v-if="card.type == 'span2'" class="box-card" v-show="active == 2">
          <div slot="header" class="clearfix">
            <span
              v-if="card.color == 'black'"
              style="color: black; font-weight: bold; font-size: 16px"
            >{{ "步骤 " + card.index + "：" }}</span>
            <span
              v-if="card.color == 'red'"
              style="color: red; font-weight: bold; font-size: 16px"
            >{{ "步骤 " + card.index + "：" }}</span>
            <span
              v-if="card.color == 'brown'"
              style="color: brown; font-weight: bold; font-size: 16px"
            >{{ "步骤 " + card.index + "：" }}</span>
            <span
              v-if="card.color == 'green'"
              style="color: green; font-weight: bold; font-size: 16px"
            >{{ "步骤 " + card.index + "：" }}</span>
            <span>{{ card.name }}</span>
          </div>
          <div class="text item">
            <el-row :gutter="10">
              <el-col :span="5" style="width: 50%">
                <el-image
                  :src="require('../../assets/' + card.src)"
                  fit="scale-down"
                  lazy
                  style="margin: 0; height: 6em"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
              </el-col>
              <el-col :span="5" style="width: 50%">
                <p>{{ card.description }}</p>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12" style="text-align:center;">
                <el-button
                  v-if="card.color == 'black'"
                  style="
                    background-color: black;
                    width: 7em;
                    height: 3em;

                    color: white;
                    display: inline-block;
                  "
                  @click="handleClick('black', card.name)"
                >配置参数</el-button>
                <el-button
                  v-if="card.color == 'red'"
                  style="
                    background-color: red;
                    width: 7em;
                    height: 3em;
                    font-size: 1em;
                    color: white;
                    display: inline-block;
                  "
                  @click="handleClick('red', card.name)"
                >配置参数</el-button>
                <el-button
                  v-if="card.color == 'brown'"
                  style="
                    background-color: brown;
                    width: 7em;
                    height: 3em;
                    font-size: 1em;
                    color: white;
                    display: inline-block;
                  "
                  @click="handleClick('brown', card.name)"
                >配置参数</el-button>
                <el-button
                  v-if="card.color == 'green'"
                  style="
                    background-color: green;
                    width: 7em;
                    height: 3em;
                    font-size: 1em;
                    color: white;
                    display: inline-block;
                  "
                  @click="handleClick('green', card.name)"
                >配置参数</el-button>
              </el-col>
              <el-col :span="12" style="text-align:center;">
                <el-button
                  v-if="card.color == 'black'"
                  style="
                    background-color: black;
                    width: 7em;
                    height: 3em;
                    font-size: 1em;
                    color: white;
                    display: inline-block;
                  "
                  @click="checkLoki('black', card.name)"
                >启动</el-button>
                <el-button
                  v-if="card.color == 'red'"
                  style="
                    background-color: red;
                    width: 7em;
                    height: 3em;
                    font-size: 1em;
                    color: white;
                    display: inline-block;
                  "
                >终止</el-button>
                <el-button
                  v-if="card.color == 'brown'"
                  icon="el-icon-loading"
                  style="
                    background-color: brown;
                    width: 7em;
                    height: 3em;
                    font-size: 1em;
                    color: white;
                    display: inline-block;
                  "
                >

                  运行
                </el-button>
                <el-button
                  v-if="card.color == 'green'"
                  style="
                    background-color: green;
                    width: 7em;
                    height: 3em;
                    font-size: 1em;
                    color: white;
                  "
                >成功
                </el-button>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card v-if="card.type == 'span3'" class="box-card" v-show="active == 3">
          <div slot="header" class="clearfix">
            <span
              v-if="card.color == 'black'"
              style="color: black; font-weight: bold; font-size: 16px"
            >{{ "步骤 " + card.index + "：" }}</span>
            <span
              v-if="card.color == 'red'"
              style="color: red; font-weight: bold; font-size: 16px"
            >{{ "步骤 " + card.index + "：" }}</span>
            <span
              v-if="card.color == 'brown'"
              style="color: brown; font-weight: bold; font-size: 16px"
            >{{ "步骤 " + card.index + "：" }}</span>
            <span
              v-if="card.color == 'green'"
              style="color: green; font-weight: bold; font-size: 16px"
            >{{ "步骤 " + card.index + "：" }}</span>
            <span>{{ card.name }}</span>
          </div>
          <div class="text item">
            <el-row :gutter="10">
              <el-col :span="5" style="width: 50%">
                <el-input
                  placeholder="类型"
                  size="mini"
                  style="width: 200px"
                  @keyup.enter.native="next"
                  v-model="salary.basicSalary">
                </el-input>
                <el-input
                  placeholder="名称"
                  size="mini"
                  style="width: 200px"
                  @keyup.enter.native="next"
                  v-model="ifon.basicifon">
                </el-input>
              </el-col>
              <el-col :span="5" style="width: 50%">
                <p>{{ card.description }}</p>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12" style="text-align:center;">
                <el-button
                  v-if="card.color == 'black'"
                  style="
                    background-color: black;
                    width: 7em;
                    height: 3em;

                    color: white;
                    display: inline-block;
                  "
                  @click="handleClick('black', card.name)"
                >基本信息</el-button>
                <el-button
                  v-if="card.color == 'red'"
                  style="
                    background-color: red;
                    width: 7em;
                    height: 3em;
                    font-size: 1em;
                    color: white;
                    display: inline-block;
                  "
                  @click="handleClick('red', card.name)"
                >配置参数</el-button>
                <el-button
                  v-if="card.color == 'brown'"
                  style="
                    background-color: brown;
                    width: 7em;
                    height: 3em;
                    font-size: 1em;
                    color: white;
                    display: inline-block;
                  "
                  @click="handleClick('brown', card.name)"
                >配置参数</el-button>
                <el-button
                  v-if="card.color == 'green'"
                  style="
                    background-color: green;
                    width: 7em;
                    height: 3em;
                    font-size: 1em;
                    color: white;
                    display: inline-block;
                  "
                  @click="handleClick('green', card.name)"
                >配置参数</el-button>
              </el-col>
              <el-col :span="12" style="text-align:center;">
                <el-button
                  v-if="card.color == 'black'"
                  style="
                    background-color: black;
                    width: 7em;
                    height: 3em;
                    font-size: 1em;
                    color: white;
                    display: inline-block;
                  "
                  @click="checkLoki('black', card.name)"
                >修改</el-button>
                <el-button
                  v-if="card.color == 'red'"
                  style="
                    background-color: red;
                    width: 7em;
                    height: 3em;
                    font-size: 1em;
                    color: white;
                    display: inline-block;
                  "
                >终止</el-button>
                <el-button
                  v-if="card.color == 'brown'"
                  icon="el-icon-loading"
                  style="
                    background-color: brown;
                    width: 7em;
                    height: 3em;
                    font-size: 1em;
                    color: white;
                    display: inline-block;
                  "
                >

                  运行
                </el-button>
                <el-button
                  v-if="card.color == 'green'"
                  style="
                    background-color: green;
                    width: 7em;
                    height: 3em;
                    font-size: 1em;
                    color: white;
                  "
                >成功
                </el-button>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card v-if="card.type == 'span4'" class="box-card" v-show="active == 4 ">
          <div slot="header" class="clearfix">
            <span
              v-if="card.color == 'black'"
              style="color: black; font-weight: bold; font-size: 16px"
            >{{ "步骤 " + card.index + "：" }}</span>
            <span
              v-if="card.color == 'red'"
              style="color: red; font-weight: bold; font-size: 16px"
            >{{ "步骤 " + card.index + "：" }}</span>
            <span
              v-if="card.color == 'brown'"
              style="color: brown; font-weight: bold; font-size: 16px"
            >{{ "步骤 " + card.index + "：" }}</span>
            <span
              v-if="card.color == 'green'"
              style="color: green; font-weight: bold; font-size: 16px"
            >{{ "步骤 " + card.index + "：" }}</span>
            <span>{{ card.name }}</span>
          </div>
          <div class="text item">
            <el-row :gutter="10">
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12" style="text-align:center;">
              </el-col>
            </el-row>
          </div>
        </el-card>
        <div style="height:100px" />
        <svg v-if="card.type == 'span2-right'" t="1605260206733" class="icon svg-middle" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1256" width="40" :fill="card.color"><path d="M512 128c211.74 0 384 172.26 384 384S723.74 896 512 896 128 723.74 128 512s172.26-384 384-384m0-64C264.58 64 64 264.58 64 512s200.58 448 448 448 448-200.58 448-448S759.43 64 512 64z" p-id="1257" /><path d="M733.53 524.23a31.93 31.93 0 0 0-6.78-34.67c0-0.05-0.07-0.13-0.12-0.19L568.23 331A32 32 0 0 0 523 376.24L626.75 480H320a32 32 0 0 0 0 64h306.75L523 647.76A32 32 0 0 0 568.23 693l158.4-158.39c0-0.06 0.07-0.14 0.12-0.19a31.92 31.92 0 0 0 6.78-10.19z" p-id="1258" /></svg>

        <svg v-if="card.type == 'span2-left'" t="1605260646357" class="icon svg-middle" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2901" width="40" :fill="card.color"><path d="M512 74.666667C270.933333 74.666667 74.666667 270.933333 74.666667 512S270.933333 949.333333 512 949.333333 949.333333 753.066667 949.333333 512 753.066667 74.666667 512 74.666667z m0 810.666666c-204.8 0-373.333333-168.533333-373.333333-373.333333S307.2 138.666667 512 138.666667 885.333333 307.2 885.333333 512 716.8 885.333333 512 885.333333z" p-id="2902" /><path d="M682.666667 480H405.333333l119.466667-128c12.8-12.8 10.666667-34.133333-2.133333-44.8s-34.133333-10.666667-44.8 2.133333l-170.666667 181.333334c-10.666667 12.8-10.666667 32 0 44.8l170.666667 181.333333c6.4 6.4 14.933333 10.666667 23.466666 10.666667 8.533333 0 14.933333-2.133333 21.333334-8.533334 12.8-12.8 12.8-32 2.133333-44.8l-119.466667-128h277.333334c17.066667 0 32-14.933333 32-32s-14.933333-34.133333-32-34.133333z" p-id="2903" /></svg>

        <svg v-if="card.type == 'span2-up'" t="1605260756138" class="icon svg-middle" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3038" width="40"><path d="M512 74.666667C270.933333 74.666667 74.666667 270.933333 74.666667 512S270.933333 949.333333 512 949.333333 949.333333 753.066667 949.333333 512 753.066667 74.666667 512 74.666667z m0 810.666666c-204.8 0-373.333333-168.533333-373.333333-373.333333S307.2 138.666667 512 138.666667 885.333333 307.2 885.333333 512 716.8 885.333333 512 885.333333z" p-id="3039" /><path d="M533.333333 307.2c-12.8-10.666667-32-10.666667-44.8 0l-181.333333 170.666667c-12.8 12.8-12.8 32-2.133333 44.8s32 12.8 44.8 2.133333l128-119.466667v277.333334c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V405.333333l128 119.466667c6.4 6.4 14.933333 8.533333 21.333333 8.533333 8.533333 0 17.066667-4.266667 23.466667-10.666666 12.8-12.8 10.666667-34.133333-2.133334-44.8l-179.2-170.666667z" p-id="3040" /></svg>

        <svg v-if="card.type == 'span2-down'" t="1605260794511" class="icon svg-middle" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3175" width="40"><path d="M512 74.666667C270.933333 74.666667 74.666667 270.933333 74.666667 512S270.933333 949.333333 512 949.333333 949.333333 753.066667 949.333333 512 753.066667 74.666667 512 74.666667z m0 810.666666c-204.8 0-373.333333-168.533333-373.333333-373.333333S307.2 138.666667 512 138.666667 885.333333 307.2 885.333333 512 716.8 885.333333 512 885.333333z" p-id="3176" /><path d="M672 499.2l-128 119.466667V341.333333c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v277.333334l-128-119.466667c-12.8-12.8-34.133333-10.666667-44.8 2.133333-12.8 12.8-10.666667 34.133333 2.133333 44.8l181.333334 170.666667c6.4 6.4 14.933333 8.533333 21.333333 8.533333s14.933333-2.133333 21.333333-8.533333l181.333334-170.666667c12.8-12.8 12.8-32 2.133333-44.8-12.8-12.8-32-14.933333-44.8-2.133333z" p-id="3177" /></svg>
      </el-col>
    </el-row>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="70%">

      <json-editor
        :value="JSON.stringify(jsonFileObj, null, 2)"
        @input="jsonFileObj = JSON.parse($event)"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateJson">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="dialogTitle" :visible.sync="lokiDialogTitle" width="70%">

      <iframe id="iframe" class="iframe" :src="lokiLink" width="100%" height="200" />

    </el-dialog>
    <el-button style="margin-top: 12px;" @click="next">
      <span v-if="active==4" @click="centerDialogVisible = false">完成</span>
      <span v-else-if="active < 4">下一步</span>
    </el-button>
  </div>
</template>

<script>

import axios from 'axios'
import JsonEditor from '@/components/JsonEditorSpecial/index'
// import { getLokiLink } from '@/utils/getResource'

export default {
  components: { JsonEditor },
  data() {
    return {
      pipelineItems: [],
      dialogVisible: false,
      centerDialogVisible: false,
      lokiDialogTitle: false,
      jsonFileObj: {},
      dialogTitle: '',
      lokiLink: '',
      active: 0,
      salary: {
        id: '',
        basicSalary: ''
      },
      ifon: {
        id: '',
        basicifon: ''
      }
    }
  },
  mounted() {
    this.readPipeline()
    // this.lokiLink = getLokiLink()
  },
  methods: {
    handleClick(color, name) {
      this.dialogTitle = name
      this.dialogVisible = true
    },

    checkLoki(color, name) {
      this.dialogTitle = name
      this.lokiDialogTitle = true
      // this.lokiLink = getLokiLink()
    },

    next() {
      if (this.active++ > 3) this.active = 0
    },

    // next() {
    //   if (this.active++ > 4) this.active = 1
    //   var _this = this;
    //   if (this.index == 4) {
    //     if (this.salary.id) { // 更新
    //       this.putRequest('/pipelineItems', this.salary).then(resp => {
    //         if (resp && resp.status == 200) {
    //           var data = resp.data;
    //           _this.$message({type: data.status, message: data.msg});
    //           _this.dialogVisible = false;
    //           _this.index = 0;
    //         }
    //       });
    //     } else { // 添加
    //       this.$prompt('请输入账套名称', '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消'
    //       }).then(({value}) => {
    //         this.salary.name = value;
    //         this.postRequest('/pipelineItems', this.salary).then(resp => {
    //           if (resp && resp.status == 200) {
    //             var data = resp.data;
    //             _this.$message({type: data.status, message: data.msg});
    //             _this.dialogVisible = false;
    //             _this.index = 0;
    //           }
    //         });
    //       }).catch(() => {
    //       });
    //     }
    //   } else {
    //     this.index++;
    //   }
    // },

    updateJson() {},

    readPipeline() {
      axios.get('/getPipelineItems').then((response) => {
        if (response.data) {
          this.pipelineItems = response.data.data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.imageMarket-app-container {
  padding: 20px 30px;
  font-size: 14px;
  line-height: 1.67;
}

.el-card {
  box-shadow: 0px 1px 2px -2px rgba(0, 0, 0, 0.16),
    0px 3px 6px 0px rgba(0, 0, 0, 0.12), 0px 5px 12px 4px rgba(0, 0, 0, 0.09);
}

.el-card:hover {
  box-shadow: 0px 6px 16px -8px rgba(0, 0, 0, 0.08),
    0px 9px 28px 0px rgba(0, 0, 0, 0.05), 0px 12px 48px 16px rgba(0, 0, 0, 0.03);
  transform: translateY(-5px);
  color: yellowgreen;
  //border-top: #409EFF 1px solid;
  border: #409eff 1px solid;
}
.svg-middle {
  margin:0 auto;display:inline-block;
}
</style>

<template>
  <div class="imageMarket-app-container">
    <el-button type="primary" round @click="adddialogVisible = true">场景输入</el-button>
    <el-button type="primary" round @click="picdialogVisible = true">显示简介</el-button>
    <el-button type="primary" round @click="tradialogVisible = true">重新训练</el-button>
    <el-dialog
      title="训练界面"
      :visible.sync="tradialogVisible"
      width="90%"
      center
    >
      <el-row>
        <el-button type="primary" @click="handletrain()">训 练</el-button>
      </el-row>
      <el-row>
        <el-button type="primary" @click="tradialogVisible = false">返 回</el-button>
      </el-row>
    </el-dialog>
    <el-dialog
      title="虚拟机实例"
      :visible.sync="picdialogVisible"
      width="90%"
      center
    >
      <el-table
        :data="tableData"
        height="600"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="name"
          label="虚拟机类型"
          width="180"
        />
        <el-table-column
          prop="memory"
          label="内存（GiB）"
          width="180"
        />
        <el-table-column
          prop="cpu"
          label="vCPU数"
          widt="180"
        />
        <el-table-column
          prop="ssd"
          label="存储（GB）"
          widt="180"
        />
      </el-table>
      <el-row>
        <el-button type="primary" @click="picdialogVisible = false">返 回</el-button>
      </el-row>
    </el-dialog>
    <el-dialog
      title="增加指标"
      :visible.sync="adddialogVisible"
      width="30%"
      center
    >
      <el-form ref="loginForm" :model="form" :rules="rules" label-width="100px" class="login-box">
        <h3 class="login-title">配置选择</h3>
        <el-form-item label="工作负载" prop="workload">
          <el-select v-model="form.workload" placeholder="请选择" @change="showworkload($event)">
            <el-option
              v-for="item in workload"
              :key="item.value"
              :label="item.label"
              :value="item.label"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="框架" prop="framework">
          <el-select v-model="form.framework" placeholder="请选择" @change="showframework($event)">
            <el-option
              v-for="item in framework"
              :key="item.value"
              :label="item.label"
              :value="item.label"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据集大小" prop="datasize">
          <el-select v-model="form.datasize" placeholder="请选择" @change="showdatasize($event)">
            <el-option
              v-for="item in datasize"
              :key="item.value"
              :label="item.label"
              :value="item.label"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="虚拟机类型" prop="vmtype">
          <el-select v-model="form.vmtype" placeholder="请选择" @change="showvmtype($event)">
            <el-option
              v-for="item in vmtype"
              :key="item.value"
              :label="item.label"
              :value="item.label"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="adddialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit('loginForm')">提交</el-button>
        </el-form-item>
      </el-form>

      <el-dialog
        title="温馨提示"
        :visible.sync="dialogVisible"
        width="30%"
        append-to-body
      >
        <span>请输入完整场景</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-dialog>

    <el-row
      :gutter="20"
    >
      <el-col
        v-for="(item, index) in cardsData"
        :key="index"
        :span="6"
      >
        <el-card :style="bgstyle(item.sort)">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-image
                style="border-radius: 2px;"
                :src="require('../../assets' + (item.avatar ? item.avatar : '/avatar.jpg'))"
                :fit="'fit'"
              />
            </el-col>
            <el-col :span="16">
              <div style="display: block;overflow: hidden;height: 120px">
                <!-- <p style="margin: 0;"><strong>{{ item.metadata.name }}</strong></p> -->
                <p v-if="item.name" style="margin: 0;color: black;overflow: hidden">
                  {{ 'vmtype: ' + item.name }}
                </p>
                <p v-if="item.cpu" style="margin: 0;color: black;overflow: hidden">
                  {{ 'cpu: ' + item.cpu }}
                </p>
                <p v-if="item.memory" style="margin: 0;color: black;overflow: hidden">
                  {{ 'memory: ' + item.memory }}
                </p>
                <p v-if="item.sort" style="margin: 0;color: black;overflow: hidden">
                  {{ 'rank: ' + item.sort }}
                </p>
                <p v-if="item.pred" style="margin: 0;color: black;overflow: hidden">
                  {{ 'predtime: ' + item.pred }}
                </p>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px">
            <el-button type="primary" round @click="sonclick(index,true)">显示路径</el-button>
            <el-button type="primary" round @click="nextsonclick(index)">创建pod</el-button>
          </el-row>
        </el-card>
        <el-dialog
          append-to-body
          :visible.sync="item.dialogvisible"
          width="90%"
          fullscreen
          center
        >
          <el-col class="textstyle">决策树序号</el-col>
          <el-col>
            <el-row>
              <el-button
                v-for="(pitem,k) in treenum"
                :key="k"
                :label="pitem"
                :value="pitem"
                type="primary"
                round
                @click="execute(item.name,k)"
              >{{ k }}</el-button>
            </el-row>
          </el-col>
          <div :id="item.name" style="width: 90%; height: 2100px;float: left;" />
          <el-button type="primary" round @click="closedialog(index)">关闭</el-button>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getResource } from '@/api/kubernetes'
import Pagination from '@/components/Pagination'
import JsonEditor from '@/components/JsonEditorSpecial/index'
import request from '@/utils/request'
const echarts = require('echarts')

export default {
  components: { Pagination, JsonEditor },
  data() {
    return {
      cardsData: [],
      tableData: [],
      workload: [],
      framework: [],
      datasize: [],
      vmtype: [],
      colorlist: [],
      form: {
        workload: '',
        framework: '',
        datasize: '',
        vmtype: '',
        treenum: ''
      },
      rules: {
        workload: [
          { required: true, message: '工作负载不可为空', trigger: 'blur' }
        ],
        datasize: [
          { required: true, message: '数据集大小不可为空', trigger: 'blur' }
        ],
        vmtype: [
          { required: true, message: '虚拟机类型不可为空', trigger: 'blur' }
        ],
        framework: [
          { required: true, message: '框架不可为空', trigger: 'blur' }
        ],
        treenum: [
          { required: true, message: '决策树序号不可为空', trigger: 'blur' }
        ]
      },

      pathdata: [],
      treenum: [],

      setintervalid: 0,
      setflag: false,

      // 对话框显示和隐藏
      dialogVisible: false,
      adddialogVisible: false,
      picdialogVisible: false,
      tradialogVisible: false
    }
  },
  created() {
    getResource({ token: this.token, kind: 'Metadata', name: 'vmtype-specs', namespace: 'default' }).then(
      response => {
        const tobj = response.data.spec
        for (let j = 0; j < tobj.length; j++) {
          tobj[j].sort = '-1'
          tobj[j].dialogvisible = false
          tobj[j].avatar = '/docker.jpg'
          tobj[j].pred = 'no data'
        }
        this.cardsData = tobj
      })
    getResource({ token: this.token, kind: 'Metadata', name: 'aws-specs', namespace: 'default' }).then(
      response => {
        this.tableData = response.data.spec
      })
    getResource({ token: this.token, kind: 'Metadata', name: 'scout-specs', namespace: 'default' }).then(
      response => {
        const dobj = response.data.spec
        this.workload = dobj.workload
        this.framework = dobj.framework
        this.datasize = dobj.datasize
        this.vmtype = dobj.vmtype
      })
    this.colorlist = ['#FFFFFF', '#33FF00', '#46E800', '#58D100', '#6BB900', '#7DA200', '#908B00', '#A27400', '#B55D00', '#C74600', '#DA2E00', '#EC1700', '#FF0000']
  },
  methods: {
    handleClick(item) {
      return 0
    },
    showdatasize(e) {
      console.log(e)
      this.s_datasize = e
    },
    showworkload(e) {
      this.s_workload = e
    },
    showframework(e) {
      this.s_framework = e
    },
    showvmtype(e) {
      this.s_vmtype = e
    },
    showtreenum(e) {
      this.s_treenum = e
    },
    changecard(data) {
      for (var j = 0, len = this.cardsData.length; j < len; j++) {
        for (var k = 0, len2 = data.length; k < len2; k++) {
          if (data[k]['workload'] + ' ' == this.cardsData[j]['name']) {
            this.cardsData[j]['sort'] = data[k]['sort'].toString()
            this.cardsData[j]['pred'] = data[k]['pred'].toFixed(4).toString()
          }
        }
      }
    },
    Trim(str) {
	    return str.replace(/(^\s*)|(\s*$)/g, '')
    },
    sonclick(i, f) {
      this.cardsData[i].dialogvisible = f
      console.log(i)
      var data = []
      data.push(this.form.workload)
      data.push(this.form.framework)
      data.push(this.form.datasize)
      data.push(this.Trim(this.cardsData[i].name))
      data.push(this.cardsData[i].cpu)
      data.push(this.cardsData[i].memory)
      for (var j = 0; j < 3; ++j) {
        data.push('0')
      }
      console.log(data)
      request({
        url: 'http://39.106.40.190:31930/showpath',
        method: 'post',
        data
      }).then(response => {
        console.log(response.data)
        this.pathdata = response.data
        this.treenum = []
        for (var j = 0; j < this.pathdata[0].length; ++j) {
          this.treenum.push(j)
        }
      })
    },
    nextsonclick(i) {
      var data = []
      data.push(this.form.workload)
      data.push(this.form.framework)
      data.push(this.form.datasize)
      data.push(this.Trim(this.cardsData[i].name))
      data.push(this.cardsData[i].cpu)
      data.push(this.cardsData[i].memory)
      request({
        url: 'http://39.106.40.190:31930/create',
        method: 'post',
        data
      }).then(response => {
        console.log(response.data)
      })
    },
    handletrain() {
      var data = []
      request({
        url: 'http://39.106.40.190:31930/train',
        method: 'post',
        data
      }).then(response => {
        console.log(response.data)
      })
    },
    closedialog(i) {
      this.cardsData[i].dialogvisible = false
      if (this.setflag == true) {
        clearInterval(this.setintervalid)
        this.setflag = false
      }
    },
    calcolor(a) {
      a = parseInt(a) + 1
      var len = this.cardsData.length
      var ans = 0
      switch (a) {
        case 0:
          ans = 0
          break
        case 1:
          ans = 1
          break
        default:
          ans = Math.ceil(a / len * 10) + 2
      }
      return ans
    },
    bgstyle(tmp) {
      return {
        backgroundColor: this.colorlist[this.calcolor(tmp)]
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = {}
          data['workload'] = this.s_workload
          data['framework'] = this.s_framework
          data['datasize'] = this.s_datasize
          data['vmtype'] = this.s_vmtype
          // 使用 vue-router 路由到指定页面，该方式称之为编程式导航
          request({
            url: 'http://39.106.40.190:31930/source/json',
            method: 'post',
            data
          }).then(response => {
            console.log(response.data)
            this.changecard(response.data)
            this.$forceUpdate()
            console.log(this.cardsData)
          })
          this.adddialogVisible = false
        } else {
          this.dialogVisible = true
        }
      })
    },
    child(param, k, set) { // 递归循环节点
      for (var j = 0, len = param.length; j < len; j++) {
		    this.changeColor(param[j], k, set)// 根据状态设置不同的颜色
		    if (param[j].children != null && param[j].children.length != 0) {
			    this.child(param[j].children, k, set)// 递归循环
		    }
	    }
    },

    searchchild(param, k) { // 递归循环节点
      for (var j = 0, len = param.length; j < len; j++) {
		    this.mulcolor(param[j], k)// 根据状态设置不同的颜色
		    if (param[j].children != null && param[j].children.length != 0) {
			    this.searchchild(param[j].children, k)// 递归循环
		    }
	    }
    },

    changeColor(obj, k, set) { // 设置节点颜色
      var greenColer = {
        color: 'green',
		    borderColor: 'green'
      }
      var blueColer = {
        color: 'blue',
		    borderColor: 'blue'
      }
      var redColer = {
        color: 'red',
		    borderColor: 'red'
      }
	    if (obj.pathtag == k.toString() && set % 2 == 0) {
		    // obj.itemStyle = blueColer;
        obj.symbolSize = 64
        obj.itemStyle.color = 'red'
	    }
      if (obj.pathtag == k.toString() && set % 2 == 1) {
		    // obj.itemStyle = greenColer;
        obj.symbolSize = 96
	    }
    },

    mulcolor(obj, k) {
      var cc = {
        color: obj.color,
        borderColor: '#000000'
      }
      obj.itemStyle = cc
      obj.symbolSize = 28
      obj.pathtag = obj.name
      var htmlstr = ''
      for (var key in obj.paramter) {
        htmlstr = htmlstr + key + ':' + obj.paramter[key] + '\n'
      }
      obj.name = htmlstr
    },

    changeline(obj, k) {
      var linecolor = [['#FFB6C1', '#FF1493', '#FFA500', '#00FF00'], ['#00FFFF', '#00BFFF', '#EE82EE', '#000080']]
      if (obj.children != null) {
        for (var j = 0, len = obj.children.length; j < len; j++) {
          obj.children[j].lineStyle = {
            color: linecolor[obj.children[j].tag - 1][k % 2],
            borderColor: linecolor[obj.children[j].tag - 1][k % 2]
          }
          this.changeline(obj.children[j], k)
        }
      }
    },

    sleep(delay) {
      for (var t = Date.now(); Date.now() - t <= delay;);
    },

    execute(chartname, knum) {
      var tobj = this.pathdata[0][knum]
      var pobj = this.pathdata[1][knum]
      this.tree = tobj
      this.path = pobj
      this.counter = 0
      var count = 0
      var set = 0
      var maxs = this.tree.paramter.samples
      var maxstep = 1
      for (var key in this.path) {
        count++
      }
      this.mulcolor(this.tree, maxs)// 根据返回数据的状态设置不同的颜色
      if (this.tree.children != null && this.tree.children.length != 0) { // 如果有子节点
        this.searchchild(this.tree.children, maxs)// 调用递归循环
      }
      if (this.setflag == true) {
        clearInterval(this.setintervalid)
      }
      this.setflag = true
      this.setintervalid = setInterval(function() {
        if (this.counter < 10070) {
          if (this.counter % count == 0) {
            set++
          }
          var k = this.path[(this.counter % count).toString()]
				  this.changeColor(this.tree, k, set)// 根据返回数据的状态设置不同的颜色
				  if (this.tree.children != null && this.tree.children.length != 0) { // 如果有子节点
					  this.child(this.tree.children, k, set)// 调用递归循环
				  }
          this.changeline(this.tree, this.counter)
          this.drawLine(chartname)
          this.counter++
        }
      }.bind(this), 500)
      console.log(this.setintervalid)
    },
    drawLine(chartname, step = 9) {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById(chartname))

      myChart.setOption({
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          formatter: function(params) {
            var htmlstr = ''
            var kk = 0
            var color = ['red', 'blue', 'yellow', 'green', 'orange']
            for (const key in params.data.paramter) {
              htmlstr = htmlstr + '<i style="width:10px;height:10px;border-radius:50%;background-color:' + color[kk] + ';margin-right: 5px;display: inline-block"></i><span style="width:70px; display:inline-block;">' + key + '</span>' + ':' + params.data.paramter[key] + '<br/>'
              kk++
            }
            return '<div class="showBox">' + params.data.name + '<br/>' + htmlstr + '</div>'
          }

        },
        series: [
          {
            type: 'tree',

            xAxis: {
              type: 'value',
              show: false
            },
            yAxis: {
              type: 'value',
              show: false
            },

            data: [this.tree],

            top: '1%',
            left: '7%',
            bottom: '1%',
            right: '20%',
            symbol: 'roundRect',
            symbolSize: 7,

            label: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'right',
              fontSize: 9
            },

            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
              }
            },
            initialTreeDepth: step,
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750,
            dataZoom: [
              {
                show: true,
                realtime: true,
                start: 0,
                end: 33
              },
              {
                type: 'inside',
                realtime: true,
                start: 0,
                end: 33
              }
            ]
          }
        ]
      }, true)
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

.textstyle {
    text-align: left;
    margin: 0 auto 40px auto;
    color: #303133;
  }

/*
.login-box {
    border: 1px solid #DCDFE6;
    width: 1050px;
    margin: 180px auto;
    padding: 35px 35px 15px 35px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    box-shadow: 0 0 25px #909399;
  }

  .login-title {
    text-align: center;
    margin: 0 auto 40px auto;
    color: #303133;
  }
  */

</style>

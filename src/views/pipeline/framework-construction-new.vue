<template>
  <div class="imageMarket-app-container">
    <el-divider content-position="center">多云协作框架</el-divider>
    <div style="width:100%;float:left">
      <el-button type="text" style="display:inline-block;float:left;width:20%">构造多云协作框架API进度：</el-button>
      <el-progress style="display:inline-block;float:left;width:75%;margin:7px 0 0 30px;" :text-inside="true" :stroke-width="24" :percentage="percentage" status="success" />
    </div>
    <div style="width:100%;float:left;margin:20px 0 0 0;">
      <p style="font-size:16px;margin:0 0 0 10px;height: 10%;"><a style="color:black;font-size:18px;">步骤 1：</a>接收示例代码输入：</p>
      <json-editor
        style="width:100%"
        :value="jsonString"
        @input="jsonString = $event"
      />
    </div>
    <div style="width:100%;float:left;margin:20px 0 0 0;">
      <p style="float:left;font-size:16px;margin:0 0 0 10px;height:10%;width:100%;display:inline-block;"><a style="color:black;font-size:18px;" @click="drawLine()">步骤 2.1:提取关键云服务操作：</a><span id="analysisTitle" style="color:brown;font-size:18px;margin-left:20px">待分析</span></p>
      <p style="float:left;font-size:16px;margin:0 0 0 10px;height:10%;width:100%;display:inline-block;"><a style="color:black;font-size:18px;" @click="constructTree()">步骤 2.2:构造云服务树形调用链:</a><span id="analysisTree" style="color:brown;font-size:18px;margin-left:20px">待生成</span></p>
      <div id="myChart" style="width: 100%; height: 500px;float: left;" />
    </div>
    <div style="width:100%;float:left;margin:20px 0 0 0;">
      <p style="float:left;font-size:16px;margin:0 0 0 10px;height:10%;width:100%;display:inline-block;"><a style="color:black;font-size:18px;" @click="showTriple()">步骤 3:生成初始的、针对特定云服务代码片段的API调用接口(三元组)：</a></p>
      <div id="step3" :style="isShown">
        <el-button id="step31" style="display:block;margin:10px" type="primary">客户端及初始化参数</el-button>
        <el-button id="step32" style="display:block;margin:10px" type="success">一个新请求</el-button>
        <el-button id="step33" style="display:block;margin:10px" type="info">请求需要的参数</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import mock from './mock.js'
import axios from 'axios'
import JsonEditor from '@/components/JsonEditorSpecial/index'
import { line } from 'echarts/lib/theme/dark'
const echarts = require('echarts')
import { setInterval, clearInterval } from 'timers'
// import './jquery-3.3.1.slim.min.js'
// import './popper.min.js'
// import './bootstrap.min.js'

export default {
  components: { JsonEditor },
  data() {
    return {
      percentage: 25,
      jsonString: 'import com.aliyuncs.DefaultAcsClient; \nimport com.aliyuncs.IAcsClient;\nimport com.aliyuncs.ecs.model.v20140526.CreateSnapshotRequest;\nimport com.aliyuncs.ecs.model.v20140526.CreateSnapshotResponse;\nimport com.aliyuncs.exceptions.ClientException;\nimport com.aliyuncs.exceptions.ServerException;\nimport com.aliyuncs.profile.DefaultProfile;\n/* pom.xml\n<dependency>\n  <groupId>com.aliyun</groupId>\n  <artifactId>aliyun-java-sdk-core</artifactId>\n  <version>3.0.9</version>\n</dependency>\n<dependency>\n  <groupId>com.aliyun</groupId>\n  <artifactId>aliyun-java-sdk-ecs</artifactId>\n  <version>4.10.1</version>\n</dependency>*/ \n\npublic class CreateSnapshotExample {\n\nprivate String accessKeyId = "<AccessKey>";\nprivate String accessSecret = "<AccessSecret>";\nprivate String regionId = "<RegionId>";\nprivate String diskId = "<DiskId>";\n\npublic void createSnapshot() {\n  DefaultProfile profile = DefaultProfile.getProfile(regionId, accessKeyId, accessSecret);\n  IAcsClient client = new DefaultAcsClient(profile);\n  CreateSnapshotRequest request = new CreateSnapshotRequest();\n  request.setRegionId(regionId);\n  request.setDiskId(diskId); \n  try {\n        CreateSnapshotResponse response = client.getAcsResponse(request);\n        logInfo(response.getSnapshotId());\n      } catch (ServerException e) {\n        logInfo(String.format("Fail. Something with your connection with Aliyun go incorrect. ErrorCode: %s",e.getErrCode()));\n      } catch (ClientException e) {\n        logInfo(String.format("Fail. Business error. ErrorCode: %s, RequestId: %s",e.getErrCode(), e.getRequestId()));\n    }\n  }\n\n  public static void main(String[] args) { \n    new CreateSnapshotExample().createSnapshot();\n  }\n}',
      textStyle: { // 标签的字体样式
        color: '#F5FFFA', // 字体颜色
        fontStyle: 'normal', // 文字字体的风格 'normal'标准 'italic'斜体 'oblique' 倾斜
        fontWeight: 'bolder', // 'normal'标准'bold'粗的'bolder'更粗的'lighter'更细的或100 | 200 | 300 | 400...
        fontFamily: 'sans-serif', // 文字的字体系列
        fontSize: 49 // 字体大小
      },
      itemStyle: {
        normal: {
          color: '#000000',
          fontSize: 49 // 字体大小
        }
      },
      analysisProcess: [],
      treeProcess: [],
      treeIndex: 0,
      leftX: 0,
      leftY: 0,
      leftInterval: 500,
      rightInterval: 500,
      middle: 150,
      spanX: 150,
      spanY: 100,
      levelY: 0,
      levelX: 0,
      symbols: [],
      links: [],
      isShown: 'display:none'
    }
  },
  mounted() {

  },
  methods: {
    findSingle(regex) {
      for (var index in this.symbols) {
        console.log(this.symbols[index])
        if (this.symbols[index].name.match(regex)) {
          return index
        }
      }
      return -1
    },
    findLeftOrRight(regex) {
      var indexList = []
      for (var index in this.symbols) {
        if (this.symbols[index].name.match(regex)) {
          indexList.push(index)
        }
      }
      return indexList
    },
    changeColorAndPrefix(color, prefix, index, x, y) {
      if (prefix != null) {
        const nList = this.symbols[index].name.split(':')
        this.symbols[index].name = prefix + nList[nList.length - 1].substring(0, 5) + '...'
        document.getElementById('analysisTree').innerHTML = '发现' + prefix + '节点！'
        this.symbols[index].symbolSize = [150, 30]
      }
      if (color != null) {
        this.symbols[index].itemStyle = { color: color }
      }
      if (x != null) {
        this.symbols[index].x = x
      }
      if (y != null) {
        this.symbols[index].y = y
      }
    },
    constructTree() {
      var rootIndex = this.findSingle(/client =/)
      console.log(rootIndex)
      var leftIndex = this.findSingle(/profile =/)
      console.log(leftIndex)
      var rightIndex = this.findSingle(/request =/)
      console.log(rightIndex)
      var setList = this.findLeftOrRight(/request\.set/)
      console.log('setList' + setList.length)
      var responseIndex = this.findSingle(/response =/)
      console.log('response' + responseIndex)
      this.treeProcess.push({ action: 'updateSymbol', index: rootIndex, color: 'rgb(0,128,0)', prefix: '客户端:' })
      this.treeProcess.push({ action: 'updateSymbol', index: leftIndex, color: 'rgb(0,128,0)', prefix: '认证:' })
      this.treeProcess.push({ action: 'updateSymbol', index: rightIndex, color: 'rgb(0,128,0)', prefix: '请求:' })
      this.treeProcess.push({ action: 'updateSymbol', index: rootIndex, color: 'rgb(0,128,0)', prefix: '客户端:', x: this.middle, y: this.levelY * this.spanY })
      this.levelY++
      this.treeProcess.push({ action: 'updateSymbol', index: leftIndex, color: 'rgb(0,128,0)', prefix: '认证:', x: this.levelX * this.spanX, y: this.levelY * this.spanY })
      this.levelX += 2
      this.treeProcess.push({ action: 'updateSymbol', index: rightIndex, color: 'rgb(0,128,0)', prefix: '请求:', x: this.levelX * this.spanX, y: this.levelY * this.spanY })
      this.levelY++
      for (var index in setList) {
        this.treeProcess.push({ action: 'updateSymbol', index: setList[index], color: 'rgb(0,128,0)', prefix: '参数' + index + ':' })
      }
      this.levelX += setList.length
      for (var index in setList) {
        this.treeProcess.push({ action: 'updateSymbol', index: setList[index], color: 'rgb(0,128,0)', prefix: '参数' + index + ':', x: (this.levelX + setList.length) * this.spanX / 2 - index * this.spanX / 2, y: this.levelY * this.spanY + index * this.spanY / 2 })
      }
      this.levelX -= 1.5 * setList.length
      this.treeProcess.push({ action: 'updateSymbol', index: responseIndex, color: 'rgb(0,128,0)', prefix: '请求返回' + ':' })
      this.treeProcess.push({ action: 'updateSymbol', index: responseIndex, color: 'rgb(0,128,0)', prefix: '请求返回' + ':', x: this.levelX * this.spanX, y: this.levelY * this.spanY })
      this.treeProcess.push({ action: 'insertLink',
        source: rootIndex,
        target: leftIndex,
        formatter: 'client初始化条件'
      })
      this.treeProcess.push({ action: 'insertLink',
        source: rootIndex,
        target: rightIndex,
        show: true,
        formatter: 'client发起请求'
      })
      for (var index in setList) {
        this.treeProcess.push({ action: 'insertLink',
          source: rightIndex,
          target: setList[index],
          formatter: '请求参数'
        })
      }
      this.treeProcess.push({ action: 'insertLink',
        source: rightIndex,
        target: responseIndex,
        formatter: '请求结果及异常处理'
      })
      const intervalFunc3 = setInterval(() => {
        if (this.treeIndex == this.treeProcess.length) {
          document.getElementById('analysisTree').innerHTML = 'API分析树构造完毕'
          clearInterval(intervalFunc3)
          this.percentage = 75
          document.getElementById('step31').innerHTML = '客户端及初始化参数:' + this.symbols[rootIndex].tooltip.formatter.split(/=/)[0] + ',' + this.symbols[leftIndex].tooltip.formatter.split(/=/)[0]

          document.getElementById('step32').innerHTML = '一个新请求:' + this.symbols[rightIndex].tooltip.formatter.split(/=/)[0]

          let str = '请求的参数:'
          for (var index in setList) {
            var start = this.symbols[setList[index]].tooltip.formatter.search('\.set')
            start += 4
            var end = start
            while (this.symbols[setList[index]].tooltip.formatter.charAt(end) != '(') {
              end++
            }
            str += this.symbols[setList[index]].tooltip.formatter.substring(start, end) + ';'
          }
          document.getElementById('step33').innerHTML = str
          return
        }
        if (this.treeProcess[this.treeIndex].action == 'updateSymbol') {
          this.changeColorAndPrefix(this.treeProcess[this.treeIndex].color, this.treeProcess[this.treeIndex].prefix, this.treeProcess[this.treeIndex].index, this.treeProcess[this.treeIndex].x, this.treeProcess[this.treeIndex].y)
        }
        if (this.treeProcess[this.treeIndex].action == 'insertLink') {
          console.log(this.treeProcess[this.treeIndex].source)
          this.links.push({ source: this.symbols[this.treeProcess[this.treeIndex].source].name, target: this.symbols[this.treeProcess[this.treeIndex].target].name, label: {
            show: true,
            formatter: this.treeProcess[this.treeIndex].formatter
          }})
        }
        this.refreashLeft()
        this.treeIndex++
      }, this.leftInterval)
    },
    refreashLeft() {
      const myChart = echarts.init(document.getElementById('myChart'))
      myChart.setOption({
        tooltip: {},
        animationDurationUpdate: 300,
        animationEasingUpdate: 'quadraticOut',
        series: [
          {
            type: 'graph',
            symbolSize: [650, 30],
            roam: true,
            label: {
              normal: {
                show: true,
                fontSize: 12
              }
            },
            edgeSymbol: ['circle', 'arrow'],
            lineStyle: {
              width: 2.5,
              color: '#33cc33'
            },
            data: this.symbols,
            links: this.links
          }
        ]
      }, true)
    },
    drawLine() {
      const myChart = echarts.init(document.getElementById('myChart'))
      const eachline = this.jsonString.split(/\r?\n/)
      this.selectProperLine(eachline)
      // console.log(this.analysisProcess)
      const intervalFunc = setInterval(() => {
        if (this.leftX == this.analysisProcess.length) {
          document.getElementById('analysisTitle').innerHTML = '云服务API提取完毕'
          this.leftX++
          clearInterval(intervalFunc)
          this.percentage = 50
          return
        }
        document.getElementById('analysisTitle').innerHTML = this.analysisProcess[this.leftX].title
        if (this.analysisProcess[this.leftX].action == 'updateGraph') {
          console.log(this.analysisProcess[this.leftX].name)
          this.symbols.push({ name: this.analysisProcess[this.leftX].name,
            symbol: 'Rect',
            x: this.middle,
            y: this.leftY * 10,
            label: { fontSize: 14 },
            itemStyle: {},
            tooltip: {
              formatter: this.analysisProcess[this.leftX].name
            }})
          this.refreashLeft()
          this.leftY++
        }
        this.leftX++
      }, this.leftInterval)
    },
    selectProperLine(lines) {
      const patternNeglect = [/^logInfo/, /^import/, /^{\/\*}/, /{\*\/}$/, /^{\/\/}/, /try/, /catch/]
      const patternNotice = ['忽略打印日志', '忽略导入的第三方包', '忽略注释开始位置', '忽略注释结束位置', '忽略整行注释', '忽略异常处理', '忽略异常处理']
      let startComment = false
      const patternKeyword = [/client/, /request/, /response/, /profile/]
      const outpuLine = []
      // console.log(lines[0].trim().match(/^import/))
      for (var index in lines) {
        let result1 = null
        for (var regex in patternNeglect) {
          result1 = lines[index].trim().match(patternNeglect[regex])
          if (regex == 2) {
            startComment = true
          }
          if (regex == 3) {
            startComment = false
          }
          if (result1 != null) {
            this.analysisProcess.push({ action: 'updateTitle', title: lines[index].trim() + ':' + patternNotice[regex] })
            break
          }
          if (startComment == true && regex != 2) {
            this.analysisProcess.push({ action: 'updateTitle', title: lines[index].trim() + ':忽略注释' })
            break
          }
        }
        if (result1 == null) {
          var findone = false
          for (var regex in patternKeyword) {
            if (lines[index].trim().match(patternKeyword[regex]) != null) {
              outpuLine.push(lines[index].trim())
              this.analysisProcess.push({ action: 'updateGraph', title: lines[index].trim() + ':发现关键云服务API调用', name: lines[index].trim() })
              findone = true
              break
            }
          }
          if (!findone) {
            this.analysisProcess.push({ action: 'updateTitle', title: lines[index].trim() + ':忽略非关键代码', name: lines[index].trim() })
          }
        }
      }
      return outpuLine
    },
    showTriple() {
      this.isShown = 'display:block'
      this.percentage = 100
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

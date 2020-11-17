<template>
  <div class="imageMarket-app-container">
    <el-divider content-position="center">多云协作框架</el-divider>
    <div style="width:100%;float:left">
    <el-button type="primary" style="display:inlie-block;float:left;width:15%">构造多云协作框架API进度：</el-button>
    <el-progress style="display:inlie-block;float:left;width:80%;margin:7px 0 0 30px;" :text-inside="true" :stroke-width="24" :percentage=percentage status="success"></el-progress>
    </div>
    <div style="width:100%;float:left;margin:20px 0 0 0;">
        <p style="font-size:16px;margin:0 0 0 10px;height: 10%;"><a style="color:red;font-size:18px;">步骤1：</a>框架接收示例代码输入：</p>
        <json-editor style="width:100%"
                :value="jsonString"
                @input="jsonString = $event"
        />
    </div>
    <div style="width:100%;float:left;margin:20px 0 0 0;">
        <div style="float:left;width:100%">
            <p style="float:left;font-size:16px;margin:0 0 0 10px;height:10%;width:50%display:inline-block;"><a style="color:red;font-size:18px;">步骤2：</a>提取关键云服务操作：</p>
            <p style="float:left;font-size:16px;margin:0 0 0 10px;height:10%;width:50%;display:inline-block;"><a style="color:red;font-size:18px;">步骤3：</a>构造云服务树形调用链：</p>
        </div>
    </div>
  </div>
</template>

<script>
import mock from "./mock.js";
import axios from "axios";
import JsonEditor from "@/components/JsonEditorSpecial/index";
//import './jquery-3.3.1.slim.min.js'
// import './popper.min.js'
// import './bootstrap.min.js'

export default {
  components: { JsonEditor },
  data() {
    return {
      percentage : 25,
      jsonString: "import com.aliyuncs.DefaultAcsClient; \nimport com.aliyuncs.IAcsClient;\nimport com.aliyuncs.ecs.model.v20140526.CreateSnapshotRequest;\nimport com.aliyuncs.ecs.model.v20140526.CreateSnapshotResponse;\nimport com.aliyuncs.exceptions.ClientException;\nimport com.aliyuncs.exceptions.ServerException;\nimport com.aliyuncs.profile.DefaultProfile;\n/* pom.xml\n<dependency>\n  <groupId>com.aliyun</groupId>\n  <artifactId>aliyun-java-sdk-core</artifactId>\n  <version>3.0.9</version>\n</dependency>\n<dependency>\n  <groupId>com.aliyun</groupId>\n  <artifactId>aliyun-java-sdk-ecs</artifactId>\n  <version>4.10.1</version>\n</dependency>*/ \n\npublic class CreateSnapshotExample {\n\nprivate String accessKeyId = \"<AccessKey>\";\nprivate String accessSecret = \"<AccessSecret>\";\nprivate String regionId = \"<RegionId>\";\nprivate String diskId = \"<DiskId>\";\n\npublic void createSnapshot() {\n  DefaultProfile profile = DefaultProfile.getProfile(regionId, accessKeyId, accessSecret);\n  IAcsClient client = new DefaultAcsClient(profile);\n  CreateSnapshotRequest request = new CreateSnapshotRequest();\n  request.setRegionId(regionId);\n  request.setDiskId(diskId); \n  try {\n        CreateSnapshotResponse response = client.getAcsResponse(request);\n        logInfo(response.getSnapshotId());\n      } catch (ServerException e) {\n        logInfo(String.format(\"Fail. Something with your connection with Aliyun go incorrect. ErrorCode: %s\",e.getErrCode()));\n      } catch (ClientException e) {\n        logInfo(String.format(\"Fail. Business error. ErrorCode: %s, RequestId: %s\",e.getErrCode(), e.getRequestId()));\n    }\n  }\n\n  public static void main(String[] args) { \n    new CreateSnapshotExample().createSnapshot();\n  }\n}",
         textStyle: { //标签的字体样式
            color : '#F5FFFA', //字体颜色
            fontStyle : 'normal',//文字字体的风格 'normal'标准 'italic'斜体 'oblique' 倾斜
            fontWeight : 'bolder',//'normal'标准'bold'粗的'bolder'更粗的'lighter'更细的或100 | 200 | 300 | 400...
            fontFamily : 'sans-serif', //文字的字体系列
            fontSize : 20, //字体大小
        },
        itemStyle: {
            normal: {
                color: "#000000"
            }
        },
      option:{
        title: {
            text: '提取API关键路径'
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        tooltip: {},
        series: [
            {
                type: 'graph',
                layout: 'none',
                //symbolSize:50,
                roam: true,
                label: {
                    show: true,
                    textStyle : this.textStyle,
                    itemStyle: this.itemStyle
                },
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [4, 10],
                edgeLabel: {
                    fontSize: 16
                },
                data:[
                    {
                        name: '分析代码片段中的云服务API',
                        symbol:"Rect",
                        symbolSize:[200 , 50],
                        x: 0,
                        y: 0,
                    },
                ],
                links:[

                ],
                lineStyle: {
                    opacity: 0.9,
                    width: 2,
                    curveness: 0
                }
            }
        ]
      },
      optionDemo: {
        title: {
            text: 'Graph 简单示例'
        },
    tooltip: {},
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
        {
            type: 'graph',
            layout: 'none',
            //symbolSize:50,
            roam: true,
            label: {
                show: true,
                textStyle : this.textStyle,
                itemStyle: this.itemStyle
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
                fontSize: 20
            },
            data: [{
                name: 'dddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
                symbol:"Rect",
                symbolSize:[200 , 50],
                x: 100,
                y: 100,
                
            }, {
                name: '节点2',
                x: 800,
                y: 300
            }, {
                name: '节点3',
                x: 550,
                y: 100
            }, {
                name: '节点4',
                x: 550,
                y: 500
            }],
            // links: [],
            links: [{
                source: 0,
                target: 1,
                symbolSize: [5, 20],
                label: {
                    show: true
                },
                lineStyle: {
                    width: 5,
                    curveness: 0.2
                }
            }, {
                source: '节点2',
                target: '节点1',
                label: {
                    show: true
                },
                lineStyle: {
                    curveness: 0.2
                }
            }, {
                source: '方块节点',
                target: '节点3'
            }, {
                source: '节点2',
                target: '节点3'
            }, {
                source: '节点2',
                target: '节点4'
            }, {
                source: '节点1',
                target: '节点4'
            }],
            lineStyle: {
                opacity: 0.9,
                width: 2,
                curveness: 0
            }
        }
    ]
}
    };
  },
  mounted() {
    
  },
  methods: {

  },
};
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

import Mock from 'mockjs';

Mock.mock('/getPipelineItems', { //输出数据
    code: 20000,
    data:{
        gutter: 20,
        rows:[
            {
                index: 10,
                items:[
                    {index: 1,type:"span1",span: 10,name: "多云API信息导入",color:"brown", src: "docker.png", description:"对应多种不同API，需要提供准确的maven依赖配置"},
                    // {index: 100,type:"span2-right",span: 1, color: "black"},
                    {index: 2,type:"span2",span: 10,name: "多云API引擎",color:"green", src: "docker.png", description:"对应多种不同API，需要提供准确的maven依赖配置"},
                    // {index: 101,type:"span2-right",span: 1, color: "black"},
                    {index: 3,type:"span3",span: 10,name: "基本信息",color:"black", description:"基本信息填写"},
                    // {index: 102,type:"span2-right",span: 1, color: "black"},
                    {index: 4,type:"span4",span: 10,name: "完成"},

                    // {index: 2,type:"span1",span: 6,color:"red"},
                    // {index: 105,type:"span2-right",span: 2, color: "red",name: "多云API分析引擎",src: "docker.png", description:"对应多种不同API，需要提供准确的maven依赖配置"},
                    // {index: 3,type:"span1",span: 6,color:"red"}
                ]
            }
            // {
            //     index: 10,
            //     items:[
            //         {title: "test1",index: 17,type:"span2-up",span: 10,style:"float:left;margin-left:4em",color: "red"},
            //         {title: "test1",index: 19,type:"span2-down",span: 10,style:"float:right;margin-right:1em", color: "red"},
            //     ]
            // },
            // {
            //     index: 15,
            //     items:[
            //         {title: "test1",index: 4,type:"span1",span: 6,src: "docker.png", description:"对应多种不同API，需要提供准确的maven依赖配置"},
            //         {title: "test1",index: 201,type:"span2-left",span: 2, color: "red"},
            //         {title: "test2",index: 5,type:"span1",span: 6,src: "docker.png", description:"对应多种不同API，需要提供准确的maven依赖配置"},
            //         {title: "test1",index: 202,type:"span2-left",span: 2, color: "red"},
            //         {title: "test2",index: 6,type:"span1",span: 6,src: "docker.png", description:"对应多种不同API，需要提供准确的maven依赖配置"}
            //     ]
            // }

       ]
    }
});

Mock.mock('/pipelineItems',{
  code:20000,
  data: [
          { index: 1, type: 'span1', name: ' qwer123' },
          { index: 2, type: 'span2', name: ' asd123' },
          { index: 3, type: 'span3', name: ' dsad-002' },
          { index: 4, type: 'span4', name: ' dsacxz4' },
          { index: 4, type: 'span4', name: ' dsacxz4' },
          { index: 4, type: 'span4', name: ' dsacxz4' },
          { index: 4, type: 'span4', name: ' dsacxz4' },
          // { index: 4, type: 'span4', name: ' dsacxz4' },
          // { index: 4, type: 'span4', name: ' dsacxz4' },
          // { index: 5, type: 'span5', name: ' cc-a2' },
          // { index: 6, type: 'span6', name: ' a5552' }
    ]

})

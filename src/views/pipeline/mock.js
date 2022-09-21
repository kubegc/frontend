import Mock from 'mockjs';

Mock.mock('/getPipelineItems', { //输出数据
    code: 20000,
    data:{
        gutter: 20,
        rows:[
            {
                index: 10,
                items:[
                    {index: 2,type:"span1",span: 10,name: "多云API信息导入",color:"brown", src: "docker.png", description:"对应多种不同API，需要提供准确的maven依赖配置"},
                    // {index: 100,type:"span2-right",span: 1, color: "black"},
                    {index: 2,type:"span2",span: 10,name: "多云API信息导入",color:"green", src: "docker.png", description:"对应多种不同API，需要提供准确的maven依赖配置"},
                    // {index: 101,type:"span2-right",span: 1, color: "black"},
                    // {index: 102,type:"span2-right",span: 1, color: "black"},
                    // {index: 4,type:"span4",span: 10,name: "完成"},

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
  data: [
          { type: 'span1', name: ' qwer123', index:'admin' },
          { type: 'span2', name: ' asd123', index:'admin' },
          { type: 'span3', name: ' dsad-002', index:'admin' },
          { type: 'span4', name: ' dsacxz4', index:'admin' },
          { type: 'span5', name: ' dsacxz4', index:'admin' },
          { type: 'span6', name: ' dsacxz4', index:'admin' },
          // { index: 4, type: 'span4', name: ' dsacxz4' },
    ]

});

Mock.mock('/getGuideItems',{
  code:20000,
  data: {
    gutter: 20,
    rows: [
      {
         index: 4,
         items:[
           {index: 1, type: 'span1', name: '项目配置'},
           {index: 2, type: 'span2', name: '创建服务'},
           {index: 3, type: 'span3', name: '加入运行环境'},
           {index: 4, type: 'span4', name: '工作流交付'}
         ]
      }
    ]
  }
});

Mock.mock('/getDescription',{
  code:20000,
  data: {
    gutter: 20,
    rows: [
      {
         index: 4,
         items:[
           {index: 1, type: 'span1', description: '对项目的流程做初步定义后，后续可在项目中进行调整。当您创建好服务后，我们会为您做如下的智能交付准备。系统会自动生成以下资源'},
           {index: 2, type: 'span2', description: '创建服务模板，后续均可在项目中重新配置'},
           {index: 3, type: 'span3', description: '将服务加入运行环境，并准备对应的交付工作流，后续均可在项目中进行配置'},
           {index: 4, type: 'span4', description: '运行工作流触发服务的自动化交付'}

         ]
      }
    ]
  }
});

Mock.mock('/getService',{
  code:20000,
  data: {
    gutter: 20,
    rows: [
      {
        index: 10,
        items:[
          {index: 1, type: 'span1', name: '2套信息'},

          {index: 2, type: 'span2', name: '3条工作流'}
        ]
      }
    ]
  }
});

Mock.mock('/getEnv',{
  code:20000,
  data: {
    gutter: 20,
    rows: [
      {
        index: 10,
        items:[
          {index: 1, type: 'span1', name: 'dev,qa'},

          {index: 2, type: 'span2', name: 'workflow-dev'}
        ]
      }
    ]
  }
});

Mock.mock('/getInfo',{
  code:20000,
  data: {
    gutter: 20,
    rows: [
      {
        index: 10,
        items:[
          {index: 1, type: 'span1', name: '托管平台'},

          {index: 2, type: 'span2', name: '代码库拥有者'},

          {index: 3, type: 'span3', name: '代码库名称'},

          {index: 4, type: 'span4', name: '分支'},

          {index: 5, type: 'span5', name: '文件路径'}
        ]
      }
    ]
  }
});

Mock.mock('/getChangeItems', { //输出数据
  code: 20000,
  data:{
    gutter: 20,
    rows:[
      {
        index: 10,
        items:[
          {index: 2,type:"span1",span: 10,name: "多云API信息导入",color:"brown", src: "docker.png", description:"对应多种不同API，需要提供准确的maven依赖配置"},
          // {index: 100,type:"span2-right",span: 1, color: "black"},
          {index: 2,type:"span2",span: 10,name: "多云API信息导入",color:"green", src: "docker.png", description:"对应多种不同API，需要提供准确的maven依赖配置"},
          // {index: 101,type:"span2-right",span: 1, color: "black"},
          // {index: 102,type:"span2-right",span: 1, color: "black"},
          // {index: 4,type:"span4",span: 10,name: "完成"},

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

Mock.mock('/services',{
  code:20000,
  data: {
    gutter: 20,
    rows: [
      {
        index: 10,
        length:[
          {index: 1, type: 'span1', name: '托管平台'},
        ]
      }
    ]
  }
});
Mock.mock('/selectHost',{
  code:20000,
  data: {
    items:[
      {value:'选项一',  Owner:'yanbingshuai', name:'project', label:'github'},
    ]
  }
});



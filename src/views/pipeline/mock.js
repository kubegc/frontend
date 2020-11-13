import Mock from 'mockjs';

Mock.mock('/getPipelineItems', { //输出数据
    code: 20000,
    data:{
        total: 6,
        gutter: 30,
        rows:[
            {
                index: 10,
                items:[
                    {index: 1,type:"span1",span: 6,name: "多云API信息导入",color:"green", src : "https://bkimg.cdn.bcebos.com/pic/2cf5e0fe9925bc31137974de55df8db1cb13704b?x-bce-process=image/resize,m_lfit,w_268,limit_1/format,f_jpg", description:"对应多种不同API，需要提供准确的maven依赖配置"},
                    {index: 100,type:"span2-right",span: 2, color: "red",name: "多云API分析元服务部署"},
                    {index: 2,type:"span1",span: 6,color:"red"},
                    {index: 105,type:"span2-right",span: 2, color: "red",name: "多云API分析引擎"},
                    {index: 3,type:"span1",span: 6,color:"red"}
                ]
            },
            {
                index: 10,
                items:[
                    {title: "test1",index: 17,type:"span2-up",span: 10,style:"float:left;margin-left:4em",color: "red"},
                    {title: "test1",index: 19,type:"span2-down",span: 10,style:"float:right;margin-right:1em", color: "red"},
                ]
            },
            {
                index: 15,
                items:[
                    {title: "test1",index: 4,type:"span1",span: 6},
                    {title: "test1",index: 201,type:"span2-left",span: 2, color: "red"},
                    {title: "test2",index: 5,type:"span1",span: 6},
                    {title: "test1",index: 202,type:"span2-left",span: 2, color: "red"},
                    {title: "test2",index: 6,type:"span1",span: 6}
                ]
            }

       ]
    }
});
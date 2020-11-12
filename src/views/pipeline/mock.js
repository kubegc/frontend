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
                    {title: "test1",index: 1,type:"span1",span: 6,name: "多云API信息导入"},
                    {title: "test1",index: 100,type:"span2-right",span: 2, color: "red"},
                    {title: "test2",index: 2,type:"span1",span: 6},
                    {title: "test1",index: 105,type:"span2-right",span: 2, color: "red"},
                    {title: "test2",index: 3,type:"span1",span: 6}
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
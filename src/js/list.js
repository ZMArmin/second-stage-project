require(['config'], () => {

    require(['url', 'template', 'header', 'aside', 'footer'], (url, template) => {
        class List {
            constructor() {
                this.getListData();

            }

            //请求列表数据渲染页面
            getListData() {
                //发送ajax发送请求
                //$.ajax最底层的封装，配置项多，对象的方式传递数据

                $.ajax({
                    // url：url.rapBaseUrl+"/list/get",
                    // //发送请求的时候携带的参数
                    // data:{},
                    // //传输数据的方式
                    // type:"get",
                    // dataType:"jason",
                    // //成功时的回调函数
                    // success:function(data){ console.log(data);},
                    // complete:function(){}//无论成功与否都会执行的函数
                    url: url.rapBaseUrl + "list/get",
                    type: 'get',
                    dataType: "json",
                    //成功时的回调函数
                    success: data => {
                            if (data.res_code == 1) { this.render(data.res_body.list) }
                        }
                        // complete: function() { console.log(url.rapBaseUrl + "list/get") }

                })
            }
            render(list) {
                $("#pictures-products").html(template("list-template", { list }));
                //console.log(template("list-template", { list }));
            }
        }
        new List();
    })


})
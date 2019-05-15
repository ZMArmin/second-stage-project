require(['config'], () => {

    require(['url', 'template', 'fly', 'header', 'aside', 'footer'], (url, template, fly) => {
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
                        this.addCartList(data);
                    }

                })

            }
            render(list) {
                    $("#pictures-products").html(template("list-template", { list }));
                    //console.log(template("list-template", { list }));
                }
                //加购物车方法
            addCartList(datalist) {
                $("#pictures-products").on("click", ".list-shopcar", function() {
                    //let id = $(this).attr("data-id");取到点击的这个数据的id
                    let id = $(this).attr("data-id");
                    console.log(id)
                        //let一个变量来接受数据
                    var data = datalist.res_body;
                    data = data.list;
                    //采用过滤的方法，将数据中id值等于我们当前点击的这个id的这条数据取出来，再赋值给声明的变量
                    data = data.filter(function(shop) {
                        return shop.id == id;
                    })
                    console.log(data);
                    //点击加购物车时，利用插件以抛物线的样子放进到购物车中
                    $(`<img src="${data.imgs}" style="width:30px;height:30px">`).fly({
                        start: {
                            left: event.clientX,
                            top: event.clientY
                        },
                        end: {
                            left: $("#shop-num").offset().left,
                            top: 200
                        },
                        onEnd: function() {
                            this.destroy();

                        }
                    });
                })
            }
        }
        new List();
    })


})
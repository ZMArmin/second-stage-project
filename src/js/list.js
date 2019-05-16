require(['config'], () => {
    require(['url', 'template', 'fly', 'header', 'aside', 'bootstrap', 'footer'], (url, template, fly, header, aside) => {
        class List {
            constructor() {
                this.getListData();
                header.init();

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
                        //数据请求成功时调用函数，并把这个数据当做参数传进去
                        this.getDetailData();
                    }

                })

            }
            render(list) {
                    $("#pictures-products").html(template("list-template", { list }));
                    //console.log(template("list-template", { list }));
                }
                //加购物车方法
            getDetailData() {
                let _this = this;
                $("#pictures-products").on("click", ".list-shopcar", function(event) {
                    //let id = $(this).attr("data-id");取到点击的这个数据的id
                    let id = $(this).attr("data-id");
                    //找到id利用id找详情页的数据
                    console.log(id)
                    $.get(url.rapBaseUrl + "detail/get", { id }, res => {
                        if (res.res_code === 1) {
                            //把数据取出来解构出来给data这个对象，{data:data}
                            //当数据为真实接口时是自带id的即后面两句就不需要把id放进去
                            var { data } = res.res_body;
                        }
                        console.log(event)
                        var price = data.price,
                            imgs = data.imgs,
                            title = data.title;
                        //取出我需要的数据，与我们请求数据的这个id值一起再放进这个数据中，方便后期取数据加购物车操作这个id
                        data = { imgs, price, title, id }
                            //请求数据成功调用函数将数据传进去
                        _this.addCart(data);
                        aside.shopCart();
                        aside.calcCartNum();
                        aside.calcCartPrice();
                        // $(".buy").show().delay(500).hide(300);
                        //点击出现模态框，500毫秒后消失
                        $('#myModal').modal('show');
                        setTimeout(function() {
                            $("#myModal").modal("hide")
                        }, 400);
                    })
                })
            }
            addCart(data) {
                //点击加购物车时，利用插件以抛物线的样子放进到购物车中
                let cart = localStorage.getItem('cart');
                if (cart) {
                    //如果cart已经有值了，说明已经添加过购物车；判断这个值得id;如果是当前id则只修改数据；如果不是当前id则直接放进购物车
                    //console.log(cart);
                    cart = JSON.parse(cart);
                    let index = -1;
                    if (cart.some((shop, i) => {
                            //some找到满足条件的就不再往下找了，所以index的值就等于满足条件的索引
                            index = i;
                            return shop.id === data.id;
                        })) {
                        //有这条数据,则这条数据的数值加一
                        cart[index].num++;

                    } else {
                        //没有当前的这个id的数据则将数据直接存进去
                        cart.push({...data, num: 1 })
                    }
                } else {
                    //购物车还没有数据，直接将数据赋值为加的这个数据
                    cart = [{...data, num: 1 }];
                }
                //重新存cart
                localStorage.setItem("cart", JSON.stringify(cart));
            }

        }
        new List();
    })


})
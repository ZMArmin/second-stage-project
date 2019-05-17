require(['config'], () => {
    require(['url', 'template', 'fly', 'header', 'aside', 'zoom', 'footer'], (url, template, fly, header, aside, ) => {
        class Detail {
            constructor() {
                    this.init();

                }
                //在地址栏中取到id值，再根据取到即用户点的产品的id，携带id请求详情数据；请求数据后渲染详情页
            init() {
                    //从url中取id,用location方法
                    let id = Number(location.search.slice(4));
                    $.get(url.rapBaseUrl + "detail/get", { id }, res => {
                        if (res.res_code === 1) {
                            //把数据取出来解构出来给data这个对象，{data:data}
                            //当数据为真实接口时是自带id的即后面两句就不需要把id放进去
                            var { data } = res.res_body;
                            this.render(data);
                        }

                        var price = data.price,
                            imgs = data.imgs,
                            title = data.title;
                        //取出我需要的数据，与我们请求数据的这个id值一起再放进这个数据中，方便后期取数据加购物车操作这个id
                        data = { imgs, price, title, id }
                        this.data = data;
                        this.addCart();
                    })
                }
                //通过请求的数据渲染详情页的数据
            render(data) {
                    $("#detaile-wrap").html(template("detail-template", { data }));
                    this.bindEvents();
                    this.zoom();
                }
                //放大镜的写法，插件
            zoom() {
                $(".zoom-image").elevateZoom({
                    gallery: 'smalls',
                    cursor: 'pointer',
                    galleryActiveClass: 'active',
                    borderSize: '1',
                    borderColor: '#888',
                    zoomWindowHeight: '200',
                    zoomWindowWidth: '200',

                });
            }
            bindEvents() {
                //详情页的内容变化
                $(".val-btn").on("click", () => {
                    $(".evaluate").show();
                    $(".discribes").hide();

                })
                $(".dis-btn").on("click", () => {
                    $(".evaluate").hide();
                    $(".discribes").show();

                })

            }

            //获取添加购物车的数量，加购物车的方法
            addCart() {
                let number = 1;
                $(".detaile-container").on("click", event => {
                    var $target = $(event.target);
                    if ($target.is("#reduce")) {
                        //如果事件源是加，则每点击一次数据加上一
                        number += 1;
                        $("#pro-num").val(number);
                    } else if ($target.is($("#plus"))) {
                        //如果事件源是减，则每点击一次数据减一
                        number -= 1;
                        if (number < 1) number = 1;
                        $("#pro-num").val(number);

                    } else if ($target.is($("#buyAddCar"))) {
                        //如果事件源是添加购物车的按钮
                        //实现加购物车抛物线的效果
                        $(`<img src="${this.data.imgs[0]}" style="width:30px;height:30px">`).fly({
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
                                aside.shopCart();
                                aside.calcCartNum();
                                aside.calcCartPrice();
                            }
                        });

                        //let id = $(this).attr("data-id");
                        //console.log(id)
                        //取到id对应的数据
                        //把this.data存在localstorage
                        //把cart取出来
                        let cart = localStorage.getItem('cart');
                        this.number = Number($("#pro-num").val());
                        if (cart) {
                            //如果cart已经有值了，说明已经添加过购物车；判断这个值得id;如果是当前id则只修改数据；如果不是当前id则直接放进购物车
                            //console.log(cart);
                            cart = JSON.parse(cart);
                            let index = -1;
                            if (cart.some((shop, i) => {
                                    //some找到满足条件的就不再往下找了，所以index的值就等于满足条件的索引
                                    index = i;
                                    return shop.id === this.data.id;
                                })) {
                                //有这条数据
                                cart[index].num += this.number;

                            } else {
                                cart.push({...this.data, num: this.number })
                            }
                        } else {
                            //购物车还没有数据
                            cart = [{...this.data, num: this.number }];
                        }
                        //重新存cart
                        localStorage.setItem("cart", JSON.stringify(cart));

                    }
                })
            }


        }
        new Detail();
    })
})
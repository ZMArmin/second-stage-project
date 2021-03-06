define(['jquery', 'url', 'template', 'cookie'], ($, url, template) => {
    function Aside() {
        this.aside = $("aside");
        this.load().then(() => {
            this.loginEvent();
            this.isloginEvent();
            this.shopCart();
            this.calcCartNum();
            this.calcCartPrice();
            this.goTop();
        });
    }
    $.extend(Aside.prototype, {
        load() {
            //加载faside的html加载到页面\
            return new Promise(resolve => {
                this.aside.load('/html/module/aside.html', () => {
                    resolve();
                });
            })
        },
        //判断是否已经登录，如果登录了点击侧边栏购物车出现购物车的列表栏；如果没登录，则弹出登录框登录
        isloginEvent() {
            let username = $.cookie("username");
            $("#shopCar").on("click", () => {
                if (username) {
                    $("aside").css("right", 0);
                    $("#user-login").hide();
                    this.rollAside();
                } else {
                    $("#user-login").show();
                    this.loginDiv();
                }
            })

        },
        //将侧边栏的位置调整点击收起来的按钮，侧边栏位移，使购物车的列表框隐藏起来
        rollAside() {
            $("#roll-up").on("click", () => {
                $("aside").css("right", -280);
            })
        },

        //弹出的登录框的操作，点击X使其消失，点击登录时登录并让弹出的框消失,防止事件向祖先元素传递需要阻止事件冒泡
        loginDiv() {
            $("#close").on("click", function(event) {
                $("#user-login").hide();
                event.stopPropagation();
            })
        },

        //弹出登录框后可以登录
        loginEvent() {
            this.usernameInput = $("#username");
            this.passwordInput = $("#password");
            this.loginBtn = $("#btn-login");
            this.loginBtn.on("click", () => {
                let username = this.usernameInput.val();
                let password = this.passwordInput.val();
                //获取之后发送请求数据
                $.ajax({
                    url: url.phpBaseUrl + "user/login.php",
                    dataType: "json",
                    data: { username, password },
                    type: "post",
                    success: data => {
                        if (data.res_code === 1) {
                            $.cookie("username", username, { path: "/" });
                            alert("登录成功");
                            //登录成功后将登录框隐藏，并且重判断是否登录渲染侧边栏的数据
                            $("#user-login").hide();
                            if (username) {
                                $("#unLogin").hide();
                                $("#loginReady").show();
                                $("#welcome").html(username);
                            }
                        } else {
                            alert("网络错误登录失败,请重试");
                        }
                        this.isloginEvent();
                    }
                })
            })
        },

        //购物车栏的数据
        shopCart() {
            let cart = localStorage.getItem('cart');
            if (cart) {
                //如果购物车有值则开始渲染数据页面
                cart = JSON.parse(cart);
                this.render(cart);
                this.cartBindEvents(cart);
            } else {
                $(".shop-scroll").html("<h1>购物车为空，快去选购吧</h1>");
            }
        },

        //根据数据渲染购物车
        render(cart) {
            $("#shop-list").html(template("cart-template", { list: cart }));
        },

        //购物车栏操作,增删改
        cartBindEvents(cart) {
            $("#shop-list").on("click", event => {
                var $target = $(event.target);
                //找到操作的当前行
                let li = $target.parent().parent();
                let id = li.attr("id");
                if ($target.is(".jia")) {
                    //事件源是加则调用加数据的方法
                    this.addShop(li);
                    if (cart.some((shop, i) => {
                            //some找到满足条件的就不再往下找了，所以index的值就等于满足条件的索引
                            index = i;
                            return shop.id == id;
                        })) {
                        //当前索引的数据的num值加等于这个number
                        cart[index].num++;
                        localStorage.setItem("cart", JSON.stringify(cart));
                    }
                    this.calcCartNum();
                    this.calcCartPrice();
                } else if ($target.is($(".jian"))) {
                    //点击减时，找
                    if (cart.some((shop, i) => {
                            //some找到满足条件的就不再往下找了，所以index的值就等于满足条件的索引
                            index = i;
                            return shop.id == id;
                        })) {
                        //当前索引的数据的num值加等于这个number
                        cart[index].num--;
                        if (cart[index].num < 1) cart[index].num = 1;
                        localStorage.setItem("cart", JSON.stringify(cart));
                    }
                    this.reduceShop(li);
                    this.calcCartNum();
                    this.calcCartPrice();
                } else if ($target.is($("i"))) {
                    li = $target.parent();
                    this.delShop(li);
                }
            })


        },
        //操作加数据
        addShop(li) {
            let number = li.find(".num").html();
            number = Number(number);
            // 如果事件源是加，则每点击一次数据加上一
            number += 1;
            li.find(".num").html(number);


        },
        //减少购物车数量
        reduceShop(li) {
            let number = li.find(".num").html();
            number = Number(number);
            // 如果事件源是加，则每点击一次数据加上一
            number--;
            if (number < 1) number = 1;
            li.find(".num").html(number);

        },

        //删除购物车
        delShop(li) {
            let cart = localStorage.getItem("cart");
            cart = JSON.parse(cart);
            if (confirm("确定要删除商品吗")) {
                li.remove();
                let id = li.attr("id");
                cart = cart.filter(function(shop) {
                    return shop.id != id;
                })
                localStorage.setItem("cart", JSON.stringify(cart));
            }

            this.calcCartNum();
            this.calcCartPrice();
        },
        //计算购物车每条数据的数量个数，即购买商品的数量
        calcCartNum() {
            let cart = localStorage.getItem("cart");
            let num = 0
            if (cart) {
                //如果有数据
                cart = JSON.parse(cart);
                //总数量，取到cart的每一个的num,加起来
                num = cart.reduce((n, shop) => {
                    n += shop.num;
                    return n
                }, 0)
            }
            $("#shop-num").find("strong").html(num);
        },

        //计算购物车总的价格
        calcCartPrice() {
            let cart = localStorage.getItem("cart");
            let totalPrice = Number($("#count-price").html());
            if (cart) {
                cart = JSON.parse(cart);
                totalPrice = cart.reduce((price, shop) => {
                    price += shop.num * shop.price;
                    // price = $(price).toFixed(2);
                    return price;
                }, 0)

                $("#count-price").html(totalPrice.toFixed(2));
            } else {
                $("#count-price").html(totalPrice);
            }
        },

        //回到顶部
        goTop() {
            $("#return-top").click(function() {
                $("html,body").animate({
                    scrollTop: 0
                }, 500);
            });
        }
    })
    return new Aside();
});
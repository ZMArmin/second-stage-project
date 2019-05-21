//基于jqurey，定义时引入jquery
define(['jquery', 'swiper', 'aside', 'cookie'], ($, Swiper, aside) => {
    function Header() {
        this.headerContainer = $("header");
        this.load().then(() => {
            this.search();
            this.bindEvent();
            this.isLogin();
            this.banner();

        });
    }
    //jqurey中的合并对象的方法
    $.extend(Header.prototype, {
        load() {
            //加载header的html加载到页面
            return new Promise(resolve => {
                this.headerContainer.load('/html/module/header.html', () => {
                    resolve();
                });
            })
        },

        search() {

            $("#search-input").on("keyup", function() {
                let keyWord = $(this).val();
                //用关键字请求开放的jsonp的接口
                console.log(keyWord)
                $.getJSON('https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?cb=?&wd=' + keyWord, data => {
                    //console.log(data);
                    var html = "";
                    data.s.forEach(function(curr) {
                        html += `<li>${curr}</li>`

                    })
                    console.log(html);
                    $("#search-res").html(html);
                    let ul = document.querySelector("#search-res")
                    ul.onclick = e => {

                        var target = e.target;
                        this.input = document.querySelector("#search-input");
                        this.input.value = target.innerHTML;
                        html = "";
                        ul.innerHTML = html;
                    }
                })
            })
        },
        //给导航条加点击事件点击时导航条颜色变化
        bindEvent() {
            // let nav = document.querySelector(".nav");
            // let lis = document.querySelectorAll("li");
            // for (var i = 0; i < lis.length; i++) {
            //     lis[i].onclick = function() {
            //         for (var j = 0; j < lis.length; j++) {
            //             lis[j].className = "";
            //         }
            //         this.className = "active";
            //     }
            // }
            //点击导航条给导航条增加样式
            $(document).ready(function() {
                $(".nav li a").each(function() {
                    var t = $(this);
                    // $this.attr("text-decoration", "none");
                    if (t[0].href == String(window.location)) {
                        t.addClass("active");
                    }
                });
            });
        },
        //判断是否登录，渲染头部的数据
        isLogin() {
            this.unLogin = $("#unLogin");
            this.loginReady = $("#loginReady");
            this.userspan = $("#welcome");
            this.loginOut = $("#login-out");
            let username = $.cookie("username");
            if (username) {
                this.unLogin.hide();
                this.loginReady.show();
                this.userspan.html(username);
            }
            this.loginOut.on("click", () => {
                if (confirm("确定要退出吗？")) {
                    $.removeCookie("username", { path: "/" });
                    this.unLogin.show();
                    this.loginReady.hide();
                    //退出登录后， 侧边栏的数据也需要重新渲染
                    aside.isloginEvent();
                    let username = $.cookie("username");
                    $("#shopCar").on("click", () => {
                        if (username) {
                            $("aside").css("right", 0);
                            $("#user-login").hide();

                        } else {
                            $("#user-login").show();
                            $("aside").css("right", -280);
                        }
                    })

                }
            })
        },

        //轮播图的方法
        banner() {
            var mySwiper = new Swiper('.swiper-container', {
                autoplay: true,
                direction: 'vertical',
                loop: true,

                // 如果需要分页器
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },

                // 如果需要前进后退按钮
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }


            })
        }


    })

    return new Header();
});
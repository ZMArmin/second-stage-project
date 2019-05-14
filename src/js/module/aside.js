define(['jquery', 'url', 'cookie'], ($, url) => {
    function Aside() {
        this.aside = $("aside");
        this.load().then(() => {
            this.isLogin();
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
        isLogin() {
            let username = $.cookie("username");

            if (username) {
                $("#shopCar").on("click", () => {
                    $("aside").css("right", 0);
                    this.rollAside();
                })
            } else {
                $("#shopCar").on("click", () => {
                    console.log($("#user-login").css('display'))

                    // $(".user-login")[0].style.display = "block"

                });
                this.loginDiv();
                this.loginEvent();
            }
        },
        //将侧边栏的位置调整点击收起来的按钮，侧边栏位移，使购物车的列表框隐藏起来
        rollAside() {
            $("#roll-up").on("click", () => {
                $("aside").css("right", -280);
            })
        },

        //弹出的登录框的操作，点击X使其消失，点击登录时登录并让弹出的框消失
        loginDiv() {

            // $("#close").on("click", () => {
            //     $(".user-login").hide();
            //     console.log($(".user-login"));
            // })
            $("#shopCar").on("click", "#close", () => {
                $("#user-login").removeAttr("style");
                //$("#user-login").css('display', 'none')

                // $(".user-login")[0].style.display = "none"

            })
        },

        //弹出登录框后可以登录
        loginEvent() {
            console.log("username")
            this.usernameInput = $("#username");
            this.passwordInput = $("#password");
            this.loginBtn = $("#btn-login");

            this.loginBtn.on("click", () => {
                let username = this.usernameInput.val();
                let password = this.passwordInput.val();
                console.log(username);
                console.log(password);
                //获取之后发送请求数据
                $.ajax({
                    url: url.phpBaseUrl + "user/login.php",
                    dataType: "json",
                    data: { username, password },
                    type: "post",
                    success: data => {
                        if (data.res_code === 1) {
                            this.loginSuccess(username);
                        }
                    }

                })
            })
        },
        //登录成功后存cookie
        loginSuccess(username) {

            $.cookie("username", username, {});
            alert("登录成功即将跳转首页");
            location.href = "/";
        }


    })
    return new Aside();
});
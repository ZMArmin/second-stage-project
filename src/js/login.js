require(['config'], () => {

    require(['url', 'template', 'cookie', 'header', 'footer'], (url, template) => {
        class Login {
            constructor() {
                    this.usernameInput = $("#usernameInput");
                    this.passwordInput = $("#passwordInput");
                    this.remember = $("#remember");
                    this.loginBtn = $("#login-btn");
                    this.sureImg = $("#img-sure");
                    this.init();
                    this.bindEvents();

                }
                //渲染生成验证码
            init() {
                $.get(url.rapBaseUrl + 'register/type', data => {

                    if (data.res_code === 1) {
                        let list = data.res_body.data;
                        let html = template("template-login", { list });
                        $("#img-sure").html(html);
                    }
                })


            }

            bindEvents() {
                //给生成验证码的框绑事件，每点击一次生成新的验证码
                this.sureImg.on("click", () => {
                    this.init();
                })
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
                                this.loginSuccess(username);
                            }
                        }

                    })

                })
            }

            loginSuccess(username) {
                    //登录成功后存cookie
                    let expires = this.remember.prop("checked") ? { expires: 10 } : {};
                    expires = Object.assign({ path: "/" }, expires);
                    $.cookie("username", username, expires);
                    alert("登录成功即将跳转首页");
                    location.href = "/";
                }
                //    //验证码的函数
                //     verification(){

            //     }

        }
        new Login();
    })


})
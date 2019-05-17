require(['config'], () => {
    require(['url', 'template', 'header', 'footer'], (url, template) => {
        class Register {
            constructor() {
                    this.usenameInput = $("#usename-input");
                    this.passwordInput = $("#password-input");
                    this.emailInput = $("#email-input");
                    this.registerBtn = $("#register-btn");
                    this.passwordSureInput = $("#makesure-input");
                    this.security = $("#sure-t");

                    //注册验证时，记录满足条件结果的变量
                    this.count = 0;

                    this.init();
                    this.bindEvents();
                }
                //默认事件，生成验证码
            init() {
                    $.get(url.rapBaseUrl + 'register/type', data => {

                        if (data.res_code === 1) {
                            let list = data.res_body.data;
                            let html = template("template-register", { list });
                            $("#sure-t").html(html);
                        }
                    })
                }
                //绑事件
            bindEvents() {
                    //密码输入框绑定事件
                    this.passwordInput.on("blur", () => {
                            this.passwordReg();
                            //  console.log(this.passwordInput.val());

                        })
                        //确认密码框绑定事件
                    this.passwordSureInput.on("blur", () => {
                            this.surePassword();
                            // console.log(this.passwordSureInput.val());
                        })
                        //邮箱输入事件
                    this.emailInput.on("blur", () => {
                            this.emailReg();
                            // console.log(this.passwordSureInput.val());
                        })
                        //给验证码的框绑定顶尖事件，每点击一次验证码的框就渲染一次
                    this.security.on("click", () => {
                            this.init();
                            console.log(this.security)
                        })
                        //给注册按钮绑定点击事件，获取输入的用户名，密码邮箱，点击按钮时发送数据请求
                    this.registerBtn.on("click", () => {
                        let username = this.usenameInput.val(),
                            password = this.passwordInput.val(),
                            email = this.emailInput.val(),
                            passwordSure = this.passwordSureInput.val();
                        if (username != "" && password != "" && email != "" && passwordSure != "" && this.count === 3) {
                            $.ajax({
                                url: url.phpBaseUrl + "user/register.php",
                                type: "post",
                                data: { username, password },
                                dataType: "json",
                                success: data => {
                                    if (data.res_code === 1) {
                                        alert("注册成功，即将跳转登录页面")
                                        location.href = 'login.html';
                                    } else if (data.res_code === 3) {
                                        alert("用户名已存在，请重新输入新的用户名")
                                    } else {
                                        alert("网络错误，注册失败，请重试")
                                    }
                                }
                            })
                        } else {
                            alert("请输入正确的注册信息")
                        }

                    })
                }
                //验证密码
            passwordReg() {
                    var passwordReg = /^[a-z0-9_-]{6,18}$/;
                    if (passwordReg.test(this.passwordInput.val())) {
                        this.passwordInput.siblings("span").html('密码设置正确');
                        this.count += 1;
                    } else {
                        this.passwordInput.siblings("span").html("请输入不少于6个字符,用英文加数字");
                    }

                }
                //确认密码输入验证
            surePassword() {
                if (this.passwordSureInput.val() === this.passwordInput.val()) {
                    this.passwordSureInput.siblings("span").html('密码输入正确');
                    this.count += 1;
                } else {
                    this.passwordSureInput.siblings("span").html("密码输入错误，请重新输入");
                }
            }


            emailReg() {
                var emailReg = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
                if (emailReg.test(this.emailInput.val())) {
                    this.emailInput.siblings("span").html('邮箱正确');
                    this.count += 1;

                } else {
                    this.emailInput.siblings("span").html('邮箱输入错误，请重新输入');

                }
            }
        }
        new Register();
    })
})
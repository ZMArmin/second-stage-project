//基于jqurey，定义时引入jquery
define(['jquery','cookie'], $ => {
    function Header() {
        this.headerContainer = $("header");
        this.load().then(() => {
            this.search();
            this.bindEvent();
            this.isLogin();

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
        //     let lis =$(".nav ul>li").toArray();        
        //    for(var i = 0; i < lis.length; i++) {
		// 	  $(lis[i]).on("click",function () {
		// 		for(var j = 0; j < lis.length; j++) {
		// 			$(lis[j]).removeClass("onc");	
		// 		}				
        //         $(lis[i]).addClass("onc");
        //         console.log($(lis[i]))
		// 	})
            let nav = document.querySelector(".nav");
            let lis = document.querySelectorAll("li");           
           for(var i = 0; i < lis.length; i++) {
			lis[i].onclick = function () {
				for(var j = 0; j < lis.length; j++) {
					lis[j].className = "";	
				}				
				this.className = "onc";	
			}
		}

        },

        isLogin(){
            this.unLogin = $("#unLogin");
            this.loginReady = $("#loginReady");
            this.userspan=$("#welcome");
            this.loginOut = $("#login-out");
            let username = $.cookie("username");
            if(username){
                this.unLogin.hide();
                this.loginReady.show();
                this.userspan.html(username);
            }
            this.loginOut.on("click",()=>{
               if(confirm("确定要退出吗？")){
                    $.removeCookie("username",{path:"/"});
                    this.unLogin.show();
                    this.loginReady.hide();
                }
              
            })
        }

        
    })

    return new Header();
});
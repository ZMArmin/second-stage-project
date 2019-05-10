//基于jqurey，定义时引入jquery
define(['jquery'], $ => {
    function Header() {
        this.headerContainer = $("header");
        this.load().then(() => {
            this.search();
            this.bindEvent();

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
        bindEvent() {
            // $(".nav").on("click", e => {

            //         let target = e.targrt;
            //         $(target).attr('class', "onc");
            //     })
            let nav = document.querySelector(".nav");
            nav.onclick = e => {
                var target = e.target;
                target.classList.add("onc");
                target.classList.remove("onc");
            }

        }
    })

    return new Header();
});
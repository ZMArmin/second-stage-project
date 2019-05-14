require(['config'], () => {
    // require(['header'], () => {

    //     })
    //需要用的config中配置的短名称
    require(['url', 'template', 'header', 'footer', 'aside'], (url, template) => {

        class Index {
            constructor() {
                    this.getType();
                    this.getTypeList();
                    console.log(111);

                }
                //获取首页的数据
                //渲染首页列表图片
            getType() {
                //发送ajax请求数据
                $.get(url.rapBaseUrl + 'index/type', data => {
                    //console.log(data);
                    if (data.res_code === 1) {
                        let list = data.res_body.list;
                        let html = template("list-fruits", { list });
                        $("#fruits-images").html(html);

                    }
                })
            }

            getTypeList() {
                $.get(url.rapBaseUrl + 'index/text/type', data => {
                    //console.log(data);
                    if (data.res_code === 1) {
                        this.renderTypeList(data.res_body.list);
                        console.log(data.res_body.list);
                    }
                })
            }

            renderTypeList(list) {
                let html = template("list-name", { list });
                $("#fruits-names").html(html);
            }

        }
        new Index();
    })


})
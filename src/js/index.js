require(['config'], () => {
    // require(['header'], () => {

    //     })
    //需要用的config中配置的短名称
    require(['url', 'template', 'header', 'footer', 'aside'], (url, template) => {

        class Index {
            constructor() {
                    this.getType();
                    this.getTypeList();
                    this.map();

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
                        //请求数据后渲染页面
                        this.renderTypeList(data.res_body.list);
                    }
                })
            }

            renderTypeList(list) {
                let html = template("list-name", { list });
                $("#fruits-names").html(html);
            }

            //地图
            map() {
                var map = new BMap.Map("allmap"); // 创建Map实例
                map.centerAndZoom(new BMap.Point(104.069491, 30.653605), 11); // 初始化地图,设置中心点坐标和地图级别
                //添加地图类型控件
                map.addControl(new BMap.MapTypeControl({
                    mapTypes: [
                        BMAP_NORMAL_MAP,
                        BMAP_HYBRID_MAP
                    ]
                }));
                map.setCurrentCity("成都"); // 设置地图显示的城市 此项是必须设置的
                map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
            }

        }
        new Index();
    })


})
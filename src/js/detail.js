require(['config'], () => {
    require(['url', 'template', 'zoom', 'header', 'footer', 'aside'], (url, template) => {
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
                            let { data } = res.res_body;
                            //扩展运算符，把我们请求数据的这个id值再放进这个数据中，方便后期取数据加购物车操作这个id
                            data = {...data, id }
                            this.render(data);

                        }
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
        }
        new Detail();
    })
})
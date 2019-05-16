require.config({
    baseUrl: "/",
    paths: {
        "jquery": "libs/jquery/jquery-3.2.1",
        "header": "js/module/header",
        "footer": "js/module/footer",
        "aside": "js/module/aside",
        "url": "js/module/url",
        "template": "libs/art-template/template-web",
        "cookie": "libs/jquery-plugins/jquery.cookie",
        "zoom": "libs/jquery-plugins/jquery.elevateZoom-3.0.8.min",
        "bootstrap": "libs/bootstrap/js/bootstrap.min",
        "fly": "libs/jquery-plugins/jquery.fly",
        "swiper": "libs/swiper/js/swiper",
        "bootstrap": "libs/bootstrap/js/bootstrap.min"
    },
    //cookie,写垫片；
    //垫片：给那些不满足AMD规范的插件，又要依赖于别的模块；如这个jquery.cookie，不满足AMD规范，又要依赖于jquery
    shim: {
        "cookie": {
            deps: ['jquery']
        },
        "zoom": {
            deps: ['jquery']
        },
        "fly": {
            deps: ['jquery']
        },
        "bootstrap": {
            deps: ['jquery']
        }
    }
})
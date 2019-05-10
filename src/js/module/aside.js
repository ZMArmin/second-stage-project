define(['jquery'], $ => {
    function Aside() {
        this.aside = $("aside");
        this.load();
    }
    $.extend(Aside.prototype, {
        load() {
            //加载footer的html加载到页面
            this.aside.load('/html/module/aside.html')
        }
    })
    return new Aside();
});
define(['jquery'], $ => {
    function Footer() {
        this.footerContainer = $("#footer");
        this.load();
    }
    $.extend(Footer.prototype, {
        load() {
            //加载footer的html加载到页面
            this.footerContainer.load('/html/module/footer.html')
        }
    })
    return new Footer();
});
define(['jquery', 'cookie'], $ => {
    class AddCart {
        constructor() {
                this.btn = $(".addCart");
                this.addCartWrap = $(".detaile-container");
                console.log("加入购物che")
                this.bindEvent();
            }
            //事件委托绑事件
        bindEvent() {
            this.addCartWrap.on("click", "this.btn", function() {
                let id = $(this).attr("data-id");
                console.log(id)
            })
        }


    }
    return new AddCart()
});
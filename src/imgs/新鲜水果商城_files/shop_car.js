// JavaScript Document
function show_gouwuche( user_name ) {
    var gouwuche = readCookie( user_name + "_gouwuche" );

    if ( gouwuche ) {
        var aOrder = JSON.parse( gouwuche );
        var goodNum = 0;
        for ( var key in aOrder ) {
            goodNum = nCount.add( goodNum, parseInt( aOrder[ key ].num ) );
        }
        $( "#shop_goods_num" ).html( goodNum );
        $( "#shop_car_pro_num" ).html( goodNum );//商城型在线客服购物车
        $( "span.shopcar-icon b" ).html( goodNum );
    }

    return true;
}

function show_count() {
    var ids_str = $('#pro_nos').val();
    var arr     = ids_str.split(',');
    var count   = 0;
    for(t=0; t<arr.length; t++) {
        var proid  = arr[t];
        var tmp = $('#goods_price_total_'+proid).html();
        tmp=parseFloat(tmp);
        count=nCount.add(count,tmp);
    }
    if (count === 0) {
        $('#count_price').html($weisiteLa.wuBaoJia);
    } else {
        count = count.toFixed(2);
        $('#count_price').html($weisiteLa.shopZongJinE+'：<font color="#FF0000">￥'+count+'</font>');
    }
}

function change_goods_num(key, idstr, sn ,param_id,zk) {
    $('.shopcar_add_jiesuan_but').hide();
    var num   = $('#goods_num_'+key).val();
    var price = parseFloat($('#goods_price_'+key).val());
    var std = UTCTimeDemo();
    if (checkRate(num) === false) {
        $.post('/self_define/ajax_set_info.php', {type:30, id:idstr,sn:sn,username:user_name, userid:ev_log_userid,std:std}, function (data) {
            if (data.indexOf('|') == -1) { return false; }
            var aVal = data.split('|');
            aVal[1]  = parseInt(aVal[1]);
            num = aVal[1];
            alert($weisiteLa.qingShuRuZhengQueDeShuZi);
            $('#goods_num_'+key).val(num);
            if (zk>0) {
                zk =nCount.div(zk,10);
                price = nCount.mul(price,zk);
            }
            var tmp_val= nCount.mul(num,price);
            $('#goods_price_total_'+key).html(tmp_val);
            show_count();
                $('.shopcar_add_jiesuan_but').show();
        });
    } else {
        var sndfObj = $('.sndf_'+idstr);
        var sndf =sndfObj.length;
        var shop_num = 0;
        if (sndf) {
            sndfObj.each(function() {
                var tmpVal = parseFloat($(this).find('.shopcar_add_txt').val());
                if (tmpVal) {
                    shop_num += tmpVal;
                }
            });
        } else {
            shop_num = num;
        }
        $.post('/self_define/ajax_set_info.php', {type:30, id:idstr,username:user_name,sn:sn,pro_num:shop_num, userid:ev_log_userid,std:std}, function (data) {
            if (data.indexOf('|') == -1) { return false; }
            var aVal = data.split('|');
            aVal[0]  = parseInt(aVal[0]);
            aVal[1]  = parseInt(aVal[1]);
            var aval2 = Number(aVal[2]);
            if (aval2 > 0) {
                price=nCount.mul(aval2,1);
                if (sndf) {
                    sndfObj.each(function() {
                        var tmpVal = parseFloat($(this).find('.shopcar_add_txt').val());
                        $(this).find('.onePrice').text(aval2);
                        $(this).find('.allPrice').text(nCount.mul(tmpVal,aval2));
                    });
                } else {
                    $('#pro_price_'+key).text(price);
                    $('#goods_price_'+key).val(price);
                }
            }
            if (aVal[1] && aVal[1] > num) {
                alert($weisiteLa.shopZuiXiaoDingLiang + aVal[1]);
                num = aVal[1];
                $('#goods_num_'+key).val(num);
            } else if (aVal[0] && aVal[0] < num) {
                alert($weisiteLa.shopKuCunWei + aVal[0]+'，'+ $weisiteLa.buNengChaoGuo + aVal[0]+'！');
                num = aVal[0];
                $('#goods_num_'+key).val(num);
            }
            if (zk>0) {
                zk =nCount.div(zk,10);
                price = nCount.mul(price,zk);
            }
            var tmp_val= nCount.mul(num,price);
            $('#goods_price_total_'+key).html(tmp_val);
            var f_ = function() {
                changeCookie(idstr,sn,num,param_id);
                show_gouwuche(user_name);
                show_count();
                $('.shopcar_add_jiesuan_but').show();
            };
            var checkLogin = readCookie('zz_userid');
            if (checkLogin) {
                $.post('/self_define/ajax_set_info.php', {type:31, user_name:user_name, id_str:idstr+'_'+param_id, pro_num:num,sn:sn,userid:ev_log_userid,std:std}, function (data) {
                    f_();
                });
            } else {
                f_();
            }
        });
    }
}
function changeCookie(id,sn,pro_num,param_id) {
    var gouwuche = readCookie(user_name+'_gouwuche');
    var isUpdate = 0;
    if (gouwuche) {
        var aOrder = JSON.parse(gouwuche);
        var i=0;
        for (var key in aOrder) {
            if (key==(id+'_'+param_id)) {
                aOrder[key]={'num':pro_num,'sort':aOrder[key].sort};
                var tmp_str = JSON.stringify(aOrder);
                writeCookie(user_name +'_gouwuche',tmp_str, 3600*7);
                isUpdate = 1;
                i = i+1;
            } else {
                i = i+1;
                continue;
            }
        } // for end
        if (!isUpdate) {
            if(i>100){
                alert($weisiteLa.shoppingCardYiMan);
                return false;
            }
            aOrder[id+'_'+param_id]={'num':pro_num,'sort':i};
            var tmp_str = JSON.stringify(aOrder);
            writeCookie(user_name +'_gouwuche',tmp_str, 3600*7);
        }
    } else {
        var arrayObj = {};
        arrayObj[id +"_"+ param_id]={'num':pro_num,'sort':1};
        var tmp_str = JSON.stringify(arrayObj);
        writeCookie(user_name+'_gouwuche',tmp_str,3600*7);
    }
}
function car_show_count() {
    var count=0;
    var full_cut_arr = [];
    $('ul.shopcar-list-ul li').each(function() {
        var proid = $(this).attr('data-id');
        var total=$(this).find('.span-sum').html();
        var tmp = total.substring(1);
        tmp = tmp*1;
        var full_cut_id = $('#full_cut_id_'+proid).val();
        if(full_cut_id){
            full_cut_arr.push(full_cut_id+'#'+tmp);
        }
        count = nCount.add(count,tmp);
    });
    if (count==0) {
        $('div.shopcar-btn-area span b').html($weisiteLa.wuBaoJia);
    } else {
        cutted_show_count(full_cut_arr,count);
    }
}
//满减后的金额处理
function cutted_show_count(full_cut_arr,count){
    var total = parseFloat(count);
    if(full_cut_arr.length > 0){
        var full_cut_str = full_cut_arr.join('_');
        $.post(
            '/self_define/ajax_set_info.php', 
            {type:40,user_name:user_name, full_cut_str:full_cut_str}, 
            function (data) {
                var cut_money = parseFloat(data);
                total = nCount.sub(total,cut_money);
                $('div.shopcar-btn-area span b').html("￥"+total);
            }
        );
    }else{
        $('div.shopcar-btn-area span b').html("￥"+count);
    }
}
function change_car_goods_num(key,id,sn,param_id,zk,ptype) {
    $('div.shopcar-btn-area a').hide();

    var num   = $('#car_num_'+key).val();
    var price = parseFloat($('#car_price_'+key).val());
    var std = UTCTimeDemo();
    var sndfObj = $(".carSndf_"+id);
    var sndf =sndfObj.length;
    var shop_num = 0;
    var sndf_num = 0;
    if (checkRate(num) === false) {
        $.post('/self_define/ajax_set_info.php', {type:30, id:id,username:user_name,sn:sn,class_type:ptype,userid:ev_log_userid,std:std}, function (data) {
            if (data.indexOf('|') == -1) { return false; }
            var aVal = data.split('|');
            aVal[1]  = parseInt(aVal[1]);
            num = aVal[1];
            alert($weisiteLa.qingShuRuZhengQueDeShuZi);
            $('#car_num_'+key).val(num);
            if (zk>0) {
                zk =nCount.div(zk,10);
                price = nCount.mul(price,zk);
            }
            var tmp_val= nCount.mul(num,price);
            $('#car_total_'+key).html(tmp_val);
            car_show_count();
            $('div.shopcar-btn-area a').show();
        });
    } else {
        if (sndf) {
            sndfObj.each(function() {
                var tmpVal = parseFloat($(this).find(".car_number").val());
                if (tmpVal) {
                    shop_num += tmpVal;
                }
            });
            sndf_num = nCount.sub(shop_num,num);
        } else {
            shop_num = num;
        }
        $.post('/self_define/ajax_set_info.php', {type:25, sn:sn, id:id,username:user_name,class_type:ptype,pro_num:shop_num, userid:ev_log_userid,std:std}, function (data) {
            if (data.indexOf('|') == -1) { return false; }
            var aVal = data.split('|');
            aVal[0]  = parseInt(aVal[0]);
            aVal[1]  = parseInt(aVal[1]);
            if (aVal[2]) {
                price = aVal[2];
                if (sndf) {
                    sndfObj.each(function() {
                        var tmpVal = parseFloat($(this).find('.car_number').val());
                        $(this).find('.onePrice').html(aVal[2]);
                        $(this).find('.allPrice').html('￥'+nCount.mul(tmpVal,aVal[2]));
                    });
                } else {
                    $('#car_price_'+key).val(aVal[2]);
                    $('#car_proprice_'+key).html(aVal[2]);
                }
            }
            if(sndf){
                if(shop_num>=aVal[1]){
                    sndf_flage =1;
                    num = shop_num;
                }
            }
            if (aVal[1] && aVal[1] > num) {
                if(sndf){
                    sndf_flage =0;
                    num = aVal[1] - sndf_num;
                }else{
                    num = aVal[1];
                }
                alert($weisiteLa.shopZuiXiaoDingLiang+ aVal[1]);
                $('#car_num_'+key).val(num);
            } else if (aVal[0] && aVal[0] < num) {
                alert($weisiteLa.shopZuiDaZhiBuNengDaYu + aVal[0]);
                num = aVal[0];
                $('#car_num_'+key).val(num);
            }
            if(sndf && sndf_flage==1){
                num = nCount.sub(shop_num,sndf_num);
            }
            if(num==0){
                num=1;
            }
            var f_ = function() {
            changeCookie(id,sn,num,param_id);
            show_gouwuche(user_name);
            if (zk>0) {
                zk =nCount.div(zk,10);
                price = nCount.mul(price,zk);
            }
                var tmp_val= nCount.mul(num,price);
                $('#car_total_'+key).html("￥"+tmp_val);
                car_show_count();
                $('div.shopcar-btn-area a').show();
            };
            var checkLogin = readCookie('zz_userid');
            if (checkLogin) {
                $.post('/self_define/ajax_set_info.php', {type:31, user_name:user_name, id_str:id+'_'+param_id, pro_num:num,sn:sn,userid:ev_log_userid,std:std}, function (data) {
                    f_();
                });
            } else {
                f_();
            }
        });
    }
}

function car_add_reduce_num3(key,id,param_id,obj,arithmetic,zk) {
    var Is_suppliers =$('#car_Is_suppliers_'+key).val();
    var reality_num  =$('#car_num_'+key).val();
    var Real_stock   =$('#car_Real_stock_'+key).val();
    var Minimum_ord  =$('#car_Minimum_ord_'+key).val();
    var liobj = $(obj).parents('li');
    var sn = liobj.attr("data-sn");
    var tmp_num;
    var tmp_num2;
    var shop_price =$('#car_price_'+key).val();

    Is_suppliers >0 ?   tmp_num=parseInt(Real_stock)    :   tmp_num=99999;
    Minimum_ord >0  ? tmp_num2=parseInt(Minimum_ord)    :   tmp_num2=1;
    if (tmp_num<tmp_num2) {
        $("#Go_Wu_Back").show();
        $("#Go_Wu_Back2").show();
        alert($weisiteLa.gongHuoBuZu);
        return false;
    }

    if (tmp_num==0) {
        alert($weisiteLa.zanWuGongHuo);
        $('#car_num_'+key).val(0);
        return false;
    }
    var sndfObj = $(".carSndf_"+id);
    var sndf =sndfObj.length;
    var shop_num = 0;
    var sndf_num = 0;
    var sndf_flage=0;
    var ptype = liobj.attr("data-type");
    if (arithmetic == 'reduce') {
        reality_num = nCount.sub(reality_num,1);
        if(sndf && reality_num==0){
            reality_num =1;
        }
    } else  if (arithmetic == 'add') {
        reality_num = nCount.add(reality_num,1);
    }
    if (sndf) {
        sndfObj.each(function() {
            var tmpVal = parseFloat($(this).find(".car_number").val());
            if (tmpVal) {
                shop_num += tmpVal;
            }
        });
        if (arithmetic == 'reduce') {
            shop_num = nCount.sub(shop_num,1);
        }else{
            shop_num = nCount.add(shop_num,1);
        }
        sndf_num = nCount.sub(shop_num,reality_num);
    }else{
       shop_num = reality_num;
    }
    var std = UTCTimeDemo();
    $.post(
        '/self_define/ajax_set_info.php',
        {type:25, sn:sn, id:id,username:user_name,class_type:ptype,pro_num:shop_num, userid:ev_log_userid,std:std},
        function (data) {
            if (data.indexOf('|') == -1) {
                return false;
            }
            var aVal = data.split('|');
            if (aVal[2]) {
                shop_price = aVal[2];
                if (sndf) {
                    sndfObj.each(function() {
                        var tmpVal = parseFloat($(this).find('.car_number').val());
                        $(this).find('.onePrice').text(aVal[2]);
                        $(this).find('.allPrice').text("￥"+nCount.mul(tmpVal,aVal[2]));
                    });
                } else {
                    liobj.find('.onePrice').text(aVal[2]);
                }
            }
            if(sndf){
                if(parseInt(shop_num)>=parseInt(aVal[1])){
                    sndf_flage =1;
                    reality_num = shop_num;
                }
            }
            if (aVal[1] && parseInt(aVal[1]) > parseInt(reality_num)) {
                if(sndf){
                    sndf_flage =0;
                    reality_num = nCount.sub(aVal[1],sndf_num);
                }else{
                    reality_num = aVal[1];
                }
                alert($weisiteLa.shopZuiXiaoDingLiang + $weisiteLa.buNengChaoGuo + aVal[1]);
            } else if (aVal[0] && parseInt(aVal[0]) < parseInt(reality_num)) {
                reality_num = aVal[0];
                alert($weisiteLa.shopKuCunWei + aVal[0]+'，' + $weisiteLa.buNengChaoGuo + aVal[0] + '！');
            }
            if(sndf && sndf_flage==1){
                reality_num = nCount.sub(shop_num,sndf_num);
            }
            if(reality_num==0){
                reality_num=1;
            }
            $('#car_num_'+key).val(reality_num);
        var f_ = function() {
            changeCookie(id,sn,reality_num,param_id);
            show_gouwuche(user_name);
            if (zk>0) {
                zk =nCount.div(zk,10);
                shop_price = nCount.mul(shop_price,zk);
            }
            var allMoney = nCount.mul(shop_price,reality_num);
            $('#car_total_'+key).html("￥"+ allMoney.toFixed(2));
            car_show_count();
        };
        var iLi = $(obj).parents("li");
        var sn = iLi.find(".car_shop_sn").val();
        var std = UTCTimeDemo();
        var checkLogin = readCookie('zz_userid');
        if (checkLogin) {
            $.post('/self_define/ajax_set_info.php', {type:31, user_name:user_name, id_str:id+'_'+param_id, pro_num:reality_num,sn:sn,userid:ev_log_userid,std:std}, function (data) {
                 f_();
                });
        } else {
            f_();
        }
    });
}

function add_pro_to_shopcar(id,user_name,type,obj) {
    id = parseInt(id);
    if ($(obj).data('noclick')==1 || !id) {
        return false;
    }

    if ($('#pStandardTable').length === 1) {
        addWholesaleCar('innerAddCat', 2);
        return false;
    }

    if (type) {
        var pro_num     = parseInt($('#pro_num').val());
        var param_id    = parseInt($('.param_id').val());
        var price_val   =0;
        var param_val     ='';
        var param_val_new ='';
        var sn            ='';
        sn = pro_sn(guige_param);
        addCookie(id, sn, pro_num, 2 ,param_id);
    } else {
        addCookie(id, '', 1, 2,0,'');
    }
}

//立即购买
function add_pro_to_shopcar_liji(id, user_name, type,obj)
{
    id = parseInt(id);
    if ($(obj).data('noclick')==1 || !id) {
        return false;
    }

    if ($("#pro_phone_num").length > 0 && !$("#pro_phone_num").val()) {
        alert($weisiteLa.qingXuanZeDianHuaHaoMa);
        return false;
    }

    if ($("#pStandardTable").length === 1) {
        addWholesaleCar('innerAddCat', type);
        return false;
    }
    var pro_num           = parseInt($('#pro_num').val()); // 获取购买商品数量
    var param_id          = parseInt($('.param_id').val());//获取规格id
    if (!param_id) { param_id = 0; }
    if (type) {
        var price_val     = 0;
        var param_val     ='';
        var param_val_new ='';
        var sn            ='';
        sn                = pro_sn(guige_param);
        addCookie(id, sn, pro_num, 1,param_id);
    } else {
        addCookie(id, '', pro_num, 1,param_id,''); //加入商品数量 pro_num
    }
}

//批发产品加入购物车
function addWholesaleCar(sButId, buy)
{
    var proId     = parseInt($("#id").val()); // 产品ID
    var wholesaleType = parseInt($("#is_trade_dynamic_type").val());
    var minimum = parseInt($('#pStandardTable').data('minum'));
    var chooseNum = 0;
    var isStop = 0;
    $('.buy-number').each(function(){
        chooseNum += parseInt($(this).find('.buyCnt').val());
        var tmpNum = parseInt($(this).find('.buyCnt').val());
        if (wholesaleType &&  (tmpNum<minimum) && tmpNum) {
            var tmpName = $(this).data('value');
            alert(tmpName +" "+ $weisiteLa.xingHaoDeProductBuGouQiPiLiang + '！');
            isStop = 1;
        }
    });
    if (isStop) {
        return false;
    }
    if (chooseNum == 0 || chooseNum < minimum) {
        alert($weisiteLa.gaiProductZuiXiaoDingLiangWei + minimum);
        return false;
    }

    $('.buy-number').each(function() {
        var buyCnt  = parseInt($(this).find('.buyCnt').val());
        if (buyCnt > 0) {
            var guigeId = parseInt($(this).parents('tr').data('dynamic'));
            var sn = 0;
            sn = $(this).data('guigeval');
            var gouwuche  = readCookie(user_name +'_gouwuche');
            var isUpdate  = 0;
            var carAllnum = 0;
            var i         = 0;
            var tmp_str   = '';

            if (gouwuche) {
                var aOrder = JSON.parse(gouwuche);
                for (var key in aOrder) {
                    if (key==(proId+'_'+guigeId)) {
                        aOrder[key]={'num':parseInt(aOrder[key].num)+buyCnt,'sort':aOrder[key].sort};
                        tmp_str = JSON.stringify(aOrder);
                        writeCookie(user_name +'_gouwuche',tmp_str, 3600*7);
                        isUpdate = 1;
                    }
                    i = i+1;
                    carAllnum = nCount.add(carAllnum,parseInt(aOrder[key].num));
                } // for end

                if (!isUpdate) {
                    if(i>100){
                        alert($weisiteLa.shoppingCardYiMan);
                        isStop = 1;
                        return false;
                    }

                    i = i+1;
                    aOrder[proId+'_'+guigeId]={'num':buyCnt,'sort':i};
                    tmp_str = JSON.stringify(aOrder);
                    carAllnum = nCount.add(carAllnum,buyCnt);
                    writeCookie(user_name +'_gouwuche',tmp_str, 3600*7);
                }
            } else {
                //初始情况
                var arrayObj = {};
                arrayObj[proId +"_"+ guigeId]={'num':buyCnt,'sort':i};
                tmp_str = JSON.stringify(arrayObj);
                writeCookie(user_name+'_gouwuche',tmp_str,3600*7);
            }
        }
    });
    if (isStop) {
        return false;
    }
    if (buy==1) {
        location.href="/dom/sc_shopcar_add.php?username="+user_name;
    } else  if (buy==2) {
        alert($weisiteLa.gaiProductYiChengGongJiaRuShoppingCard);
        show_gouwuche(user_name);
    }
}

function addCookie(id, sn, pro_num,buy,param_id) {
    var gouwuche = readCookie(user_name+'_gouwuche');
    var isUpdate = 0;
    var phone_num = 0;
    if ($("#pro_phone_num").length > 0) {
        phone_num = parseInt($("#pro_phone_num").val());
    }
    if (gouwuche) {
        var aOrder = JSON.parse(gouwuche);
        var i=0;
        for (var key in aOrder) {
            if (key==(id+'_'+param_id)) {
                var num =nCount.add(aOrder[key].num,pro_num);
                if (phone_num) {
                    aOrder[key]={'num':num,'sort':aOrder[key].sort,'phone':phone_num};
                } else {
                    aOrder[key]={'num':num,'sort':aOrder[key].sort};
                }
                var tmp_str = JSON.stringify(aOrder);
                if (buy!=1) {
                    writeCookie(user_name +'_gouwuche',tmp_str, 3600*7);
                }
                isUpdate = 1;
                i = i+1;
            } else {
                i = i+1;
                continue;
            }
        }
        if (!isUpdate) {
            if(i>100){
                alert($weisiteLa.shoppingCardYiMan);
                return false;
            }
            if (phone_num) {
                aOrder[id+'_'+param_id]={'num':pro_num,'sort':i,'phone':phone_num};
            } else {
                aOrder[id+'_'+param_id]={'num':pro_num,'sort':i};
            }
            var tmp_str = JSON.stringify(aOrder);
            if (buy!=1) {
                writeCookie(user_name +'_gouwuche',tmp_str, 3600*7);
            }
        }
    } else {
        var arrayObj = {};
        if (phone_num) {
            arrayObj[id +"_"+ param_id]={'num':pro_num,'sort':1,'phone':phone_num};
        } else {
            arrayObj[id +"_"+ param_id]={'num':pro_num,'sort':1};
        }
        var tmp_str = JSON.stringify(arrayObj);
        if (buy!=1) {
            writeCookie(    user_name+'_gouwuche',tmp_str,3600*7);
        }
    }
    if (buy==1) {
        sn = sn ? sn : '';
        location.href="/dom/sc_order_buy.php?username="+user_name+"&orderType=pro&param_pro="+id +"_"+ param_id+'&sn='+sn+'&is_liji=1&pro_num='+pro_num+'&phone='+phone_num;
    } else  if (buy==2) {
        alert($weisiteLa.gaiProductYiChengGongJiaRuShoppingCard);
        show_gouwuche(user_name);
    }
}

function checkRate(num) {
     var re = /^[1-9]+[0-9]*]*$/;   //判断字符串是否为数字     //判断正整数 /^[1-9]+[0-9]*]*$/
     if (!re.test(num)) {
        return false;
     } else {
        return true;
    }
}

//产品列表页 加入购物车
$(function() {
    $( ".pic-text-list-module" ).on( "click", ".list-shopcar-icon-add", function() {
        var id        = parseInt( $( this ).data( "id" ) );
        var is_feature = $(this).data('feature');
        if (is_feature) {
            window.location.href = "/"+user_name+"/products/"+id+".html";
            return;
        }

        var gouwuche = readCookie(user_name +'_gouwuche');

        var channelId = 0;
        if ( $( this ).data("chid") ) {
            channelId = parseInt( $( this ).data("chid") );
        } else {
            channelId = parseInt( $( "body" ).data( "chid" ) );
        }

        var sn        = '';
        var param_id  = 0;
        var isUpdate  = 0;
        var i         = 0;
        var url       = '/wap/ajaxShopCarList.php?username='+user_name;

        if ( !id || !channelId ) {
            return false;
        }

        if ( gouwuche ) {
            var aOrder = JSON.parse( gouwuche );
            for ( var key in aOrder ) {
                if ( key == (id +'_'+ param_id ) ) {
                    aOrder[key] = {'num':parseInt(aOrder[key].num)+1,'sort':aOrder[key].sort};
                    isUpdate = 1;
                }
                ++i;
            } // for end
            if ( !isUpdate ) {
                if(i>100){
                    wsf.f.alertWindow( $weisiteLa.shoppingCardYiMan, 1 );
                    return false;
                }
                ++i;

                var url = "/wap/ajaxShopCarList.php?username=" + user_name;
                $.ajax( {
                    url : url,
                    type : 'POST',
                    data : {pid:id,channel_id:channelId},
                    success : function( smallNum ) {
                        smallNum = parseInt( smallNum );
                        if ( smallNum ) {
                            //初始情况
                            var arrayObj = {};
                            aOrder[id +"_"+ param_id] = {'num':smallNum,'sort':i};
                            writeCookie( user_name+'_gouwuche', JSON.stringify(aOrder), 3600*7 );
                            wsf.f.alertWindow($weisiteLa.jiaRuShoppingCardChengGong, 3);
                            show_gouwuche(user_name);
                        } else {
                           wsf.f.alertWindow($weisiteLa.ciProductGongHuoBuZuQingXuanZeQiTaProduct, 1);
                        }
                    }
                } );
            } else {
                var tmp_str = JSON.stringify(aOrder);
                writeCookie( user_name + "_gouwuche", tmp_str, 3600*7 );
                wsf.f.alertWindow($weisiteLa.jiaRuShoppingCardChengGong, 3 );
                show_gouwuche( user_name );
            }
        } else {
            $.ajax( {
                url : url,
                type : 'POST',
                data : {pid:id,channel_id:channelId},
                success : function( smallNum ) {
                    smallNum = parseInt( smallNum );
                    if ( smallNum ) {
                        //初始情况
                        var arrayObj = {};
                        arrayObj[id +"_"+ param_id] = {'num':smallNum,'sort':i};
                        var tmp_str = JSON.stringify( arrayObj );
                        writeCookie( user_name+'_gouwuche', tmp_str, 3600*7 );
                        show_gouwuche( user_name );
                        wsf.f.alertWindow($weisiteLa.jiaRuShoppingCardChengGong, 3 );
                    } else {
                        wsf.f.alertWindow($weisiteLa.ciProductGongHuoBuZuQingXuanZeQiTaProduct, 1);
                    }
                }
            } );
        }
    } );
});

show_gouwuche( user_name );

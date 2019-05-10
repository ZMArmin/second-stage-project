function sidebar_r(_this,id){
	$(_this).addClass("cur").siblings().removeClass("cur");
	//验证是否登录
	//alert(temp_uid);
	var zz_userid=readCookie('zz_userid');
	if(id=='server_list'){
		if($("#sidebar_Mo").css("right") != 0){
			$("#sidebar_Mo").animate({"right":"0"});
		}
		$("."+id).animate({
			"margin-top":"0",
			"opacity":"1",
			"z-index":"1"
		}).siblings().animate({
			"opacity":"0",
			"margin-top":"400px",
			"z-index":"0"
		});
	}else{
		if(zz_userid==0 || zz_userid==''){
			if($(_this).attr("data-length") == 0){
				$(_this).siblings().find(".user_login").remove();
				$(_this).siblings().attr("data-length",0);
				var temp_str='',wxLogin_str='';
				if(temp_qq_login){
					if(temp_qq_key){
						temp_str='<a href="/qqApi/index.php?username='+user_name+'" class="qq_url"><em>QQ'+$weisiteLa.DengLu+'</em></a>';
					}else{
						//temp_str='<span class="qq_log"><{include file=./public/qq_login.tpl}></span>';
					}
				}
				if(isWx_login){
					//wxLogin_str='<a href="/dom/denglu.php?username='+user_name+'&isKfAlert=1"  class="wx_url"><em>微信登录</em></a>';
					wxLogin_str='<a href="###" onclick="alert_window = wsf.f.openWin(\''+$weisiteLa.weixin+'\',\'/dom/pc_wx_login.php?username='+user_name+'&wap=1&tj=1\',300, 320);"  class="wx_url"><em>'+$weisiteLa.weixin+'</em></a>';
				}
				var register_str = '<span style="float:right;width:70px;color:#444; font-size:14px;"><a href="/dom/zhuce.php?username='+user_name+'&trespass='+temp_url_trespass+'">'+$weisiteLa.ZhuCe+'</a></span>';
				if(show_register){
					register_str = '';
				}
				$(_this).append('<div class="user_login" style="display:block;"><h2><a href="###" class="clear_x">&nbsp;</a>'+$weisiteLa.huiyuandenglu+'</h2><div class="logon_list"><form action="/dom/denglu.php?username='+user_name+'"  method="post" enctype="multipart/form-data" name="form2" id="login1"><input type="hidden" value="'+temp_trespass+'" name="trespass" id="trespass" /><dl><dd class="clearfix input_name"><label><img src="/images/shop_online2016/name_icon.png"></label><input type="text" class="in_text" name="login_name" id="login_name_online" value=""></dd><dd class="clearfix input_pwd"><label><img src="/images/shop_online2016/pwd_icon.png"></label><input type="password" class="in_text" name="login_pwd" id="login_pwd_online" value=""></dd><dd class="clearfix input_yz"><input type="text" class="in_text" name="validatecode" id="validatecode_online" value=""><span onclick="getCode();" style="width:115px;"><img width="115px" height="60px" name="vcodesrc" id="vcodesrc_online" src="/include/captcha/captcha.php"></span><span style="float:right;color:#555; font-size:14px; width:84px;"><a href="###" onclick="getCode();">'+$weisiteLa.huanyizhang+'</a></span></dd><dd class="clearfix" style="padding-top:10px;"><span style="float:left;width:70px;color:#555; font-size:14px;"><a href="/dom/get_password.php?username='+user_name+'">'+$weisiteLa.wangjimima+'？</a></span>'+register_str+'</dd><dd class="clearfix register_btn" id="error_dd"></dd><dd class="clearfix login_btn" id="btn_dd"><a style="font-size:16px;" href="javascript:void(0)" onclick="login_check1()">'+$weisiteLa.DengLu+'</a></dd><dd class="login_url">'+temp_str+wxLogin_str+'</dd></dl></form></div><em class="jiao"></em></div>');
				$(_this).attr("data-length",1);
			}
		}else{
			var obj=$('#sidebar_Mo').find('.'+id);
			if($("#sidebar_Mo").css("right") != 0){
				$("#sidebar_Mo").animate({"right":"0"});
			}

			if(id=='user_list'){
				//用户信息
				get_user_info(obj,1);
			}else if(id=='assets_list'){
				//我的资产
				get_user_info(obj,2);
			}else if(id=='alt_list'){
				//我的消息
				//obj=obj.find('#my_message');
				get_user_info(obj,3);
			}else if(id=='coll_list'){
				//收藏
				get_user_info(obj,4);
			}else if(id=='shop_list'){
				//购物车
				get_user_info(obj,5);
			}
			$("."+id).animate({
				"margin-top":"0",
				"opacity":"1",
				"z-index":"1"
			}).siblings().animate({
				"opacity":"0",
				"margin-top":"400px",
				"z-index":"0"
			});
		}
	}
}

//ajax获取数据
function get_user_info(obj,type,tag){
	var timestamp=new Date().getTime();
	var win_w = $(window).outerHeight();
	$.ajax({
		url:'/shop_online_ajax.php?username='+temp_name+'&type='+type+'&timestamp='+timestamp,
		type:'get',
		success: function(data){
			if(data != 1){
				obj.html(data);
				if(tag){
					show_online_num(user_name);
				}
				if(type == 4){
					$(".coll_list .coll_c").css("height",win_w-90);
				}else if(type == 3){
					$(".alt_list .alt_c").css("height",win_w-90);
				}else if(type == 5){
					$(".shop_tab ul").css("height",win_w-151);
				}
			}
		}
	})
}

function close_alt(){
	$("#sidebar_Mo").animate({"right":"-280px"});
	$(".sidebar_list li").removeClass("cur");
}


//验证码
function getCode(){
  var date=new Date();
  document.getElementById("vcodesrc_online").src="/include/captcha/captcha.php?datete="+date.getTime();
}

//登录
function login_check1(){
	var login_name=$.trim($('#login_name_online').val());
	var login_pwd=$.trim($('#login_pwd_online').val());
	var validatecode=$.trim($('#validatecode_online').val());
	if(login_name==''){
		$('#error_dd').html('<font color="red" style="float:left">'+$weisiteLa.ZhangHaoBuNengWeiKong+'</font>');
		return false;
	}else if(login_pwd==''){
		$('#error_dd').html('<font color="red" style="float:left">'+$weisiteLa.MiMaBuNengWeiKong+'</font>');
		return false;
	}else if(validatecode==''){
		$('#error_dd').html('<font color="red" style="float:left">'+$weisiteLa.YanZhengMaBuNengWeiKong+'</font>');
		return false;
	}else{
		$('#error_dd').html('');
		$('#btn_dd').html('<a style="font-size:16px;" href="javascript:void(0)">'+$weisiteLa.DengLu+'...</a>');
		$('#login1').submit();
	}
}

//购物车商品数量
function show_online_num(user_name){
	var gouwuche = readCookie(user_name+'_gouwuche');
	if(gouwuche!=''){
		var aOrder = JSON.parse(gouwuche);
		var good_num=0;
		for (key in aOrder) {
			good_num = nCount.add(good_num,parseInt(aOrder[key].num));
		}
		$('#shop_car_pro_num').html(good_num);
		$('#shop_goods_num').html(good_num);
		$('span.shopcar-icon b').html(good_num);
	}
}

//购物车提交
function shop_car_submit(){
	$('#online_form').submit();
}




function checkRateForOnline(num){
	 var re = /^[1-9]+[0-9]*]*$/;   //判断字符串是否为数字     //判断正整数 /^[1-9]+[0-9]*]*$/
	 if (!re.test(num)){
		return false;
	 }else{
		return true;
	}
}

//购物车总价格
function show_count_for_online(){
	var ids_str=$('#online_pro_nos').val();
	var arr=ids_str.split(',');
	var count=0;
	var full_cut_arr = [];
	for(t=0; t<arr.length; t++){
		var proid  = arr[t];
		var tmp = $('#this_total_price_'+proid).html();
		var full_cut_id = parseInt($('#full_cut_id_'+proid).val());
		tmp=parseFloat(tmp);
		if(full_cut_id > 0){
        	full_cut_arr.push(full_cut_id+'#'+tmp);
     	}
		count=nCount.add(count,tmp);
	}
	 
	if(count==0){
		$('#count_price_for_online').html('无报价');
	}else{
		count = count.toFixed(2);
		show_cutted_count_for_online(full_cut_arr,count);
		//$('#count_price_for_online').html('<p>共计：<font>￥<i id="online_total_price">'+count+'</i></font></p><a href="javascript:shop_car_submit()" id="buy_for_online"><em>结算</em></a>');
	}
}
//满减后的金额处理
function show_cutted_count_for_online(full_cut_arr,count){
	var total = parseFloat(count);
    if(full_cut_arr.length > 0){
        var full_cut_str = full_cut_arr.join('_');
        $.post(
            '/self_define/ajax_set_info.php', 
            {type:40,user_name:user_name, full_cut_str:full_cut_str}, 
            function (data) {
                var cut_money = parseFloat(data);
                total = nCount.sub(total,cut_money);
                //total= total.toFixed(2);
                $('#count_price_for_online').html('<p>'+$weisiteLa.gongji+'：<font>￥<i id="online_total_price">'+total+'</i></font></p><a href="javascript:shop_car_submit()" id="buy_for_online"><em>'+$weisiteLa.jiesuan+'</em></a>');
            }
        );
    }else{
    	$('#count_price_for_online').html('<p>'+$weisiteLa.gongji+'：<font>￥<i id="online_total_price">'+count+'</i></font></p><a href="javascript:shop_car_submit()" id="buy_for_online"><em>'+$weisiteLa.jiesuan+'</em></a>');
    }
}
//验证商品数量
function change_goods_num_for_online(key, idstr, sn ,param_id,zk,this_,ptype){
	$('#buy_for_online').hide();
	//var num   = $('#online_goods_num_'+key).val();

	var num=parseInt($.trim($('#num_'+key).html()));
	var price = parseFloat($('#online_goods_price_'+key).val());
	var std = UTCTimeDemo();
	var sndfObj = $("#online_form .onliSndf_"+idstr);
	var sndf =sndfObj.length;
	var shop_num = 0;
	var sndf_num = 0;
	var sndf_flage = 0;
	if($(this_).hasClass("jia")){
		num=num+1;
	}else if($(this_).hasClass("jian")){
		num=num-1;
		if(sndf && num==0){
			num =1;
		}
	}
	if($("#restrict_"+idstr).length > 0){
        ptype = 11;
    }
	if(checkRateForOnline(num) === false){
		$.post('/self_define/ajax_set_info.php', {type:30, id:idstr,username:user_name,sn:sn,class_type:ptype,userid:ev_log_userid,std:std}, function (data) {
			if (data.indexOf('|') == -1) { return false; }
			var aVal = data.split('|');
			aVal[1]  = parseInt(aVal[1]);
			num = aVal[1];
			$('#num_'+key).html(num);
			$('#online_goods_num_'+key).val(num)
			if(zk>0){
				zk =nCount.div(zk,10);
				price = nCount.mul(price,zk);
			}
			var tmp_val= nCount.mul(num,price);
			$('#this_total_price_'+key).html(tmp_val.toFixed(2));
			show_count_for_online();
			$('#buy_for_online').show();
		});
	} else {
		if(sndf){
			sndfObj.each(function(){
				//var tmpVal = parseFloat($(this).find("#num_"+key).html());
				var tmpVal = parseFloat($(this).find(".pid_"+idstr).html());
				if (tmpVal) {
					shop_num += tmpVal;
				}
			});
			if($(this_).hasClass("jia")){
				shop_num=shop_num+1;
			}else if($(this_).hasClass("jian")){
				shop_num=shop_num-1;
			}
			sndf_num = shop_num - num;
		}else{
			shop_num = num;
		}
		
		$.post('/self_define/ajax_set_info.php', {type:30, id:idstr,username:user_name,class_type:ptype,sn:sn,pro_num:shop_num, userid:ev_log_userid,std:std}, function (data) {
			if (data.indexOf('|') == -1) { return false; }
			var aVal = data.split('|');
			aVal[0]  = parseInt(aVal[0]);
			aVal[1]  = parseInt(aVal[1]);
			aVal[3]  = parseInt(aVal[3]);
			var aval2 = Number(aVal[2]);
			if(aval2 > 0 && ptype != 11){
				price=nCount.mul(aval2,1);
				if(sndf){
					sndfObj.each(function(){
						var tmpVal = parseInt($(this).find(".pid_"+idstr).html());
						$(this).find('.Price_text').find('em').text(nCount.mul(tmpVal,aval2));
					});
				}else{
					//$('#pro_price_'+key).text(price);
					$('#online_goods_price_'+key).val(price);
				}
			}
			if(sndf){
				if(shop_num>=aVal[1]){
					sndf_flage =1;
					num = shop_num;
				}
			}
			var checkLogin = readCookie('zz_userid');
			if (aVal[1] && aVal[1] > num) {
				if(sndf){
					sndf_flage =0;
					num = aVal[1] - sndf_num;
				}else{
					num = aVal[1];
				}
				alert('商品最小定量'+ aVal[1]);
				$('#online_goods_num_'+key).val(num);
				$('#num_'+key).html(num)
			} else if (ptype == 11  && aVal[2] < num) {
				if (aVal[2] == 0 && checkLogin) {
					alert('商品可购买数量为0，不能购买！');
					del_goods_for_online_new(idstr,idstr+'_'+param_id);
				} else {
					if(checkLogin && aVal[3] > 0){
						alert('商品已购买数量为'+aVal[3]+'，不能超过'+aVal[2]+'！');
					}else{
					    showAllzz('该商品当前可购买数量为'+aVal[2]+'！');
					}
					
				}
				
				num = aVal[2];
				$('#online_goods_num_'+key).val(num);
				$('#num_'+key).html(num)
			} else if (aVal[0] && aVal[0] < num) {
				//alert('商品最大值不能大于'+ aVal[0]);
				alert('商品库存为'+aVal[0]+'，不能超过'+aVal[0]+'！');
				num = aVal[0];
				$('#online_goods_num_'+key).val(num);
				$('#num_'+key).html(num)
			}
			if(zk>0){
				zk =nCount.div(zk,10);
				price = nCount.mul(price,zk);
			}
			if(sndf && sndf_flage==1){
				num = shop_num - sndf_num;
			}
			if(num==0){
				num=1;
			}
			var tmp_val= nCount.mul(num,price);
			$('#this_total_price_'+key).html(tmp_val.toFixed(2));
			$('#total_price_'+key).html(tmp_val);
			$('#online_goods_num_'+key).val(num);
			$('#num_'+key).html(num);
			//$('#online_total_price').html();
			var f_ = function(){
				changeCookieForOnline(idstr,sn,num,param_id);
				show_online_num(user_name);
				show_count_for_online();
				$('#buy_for_online').show();
			}
			
			if(checkLogin){
				$.post('/self_define/ajax_set_info.php', {type:31, user_name:user_name, id_str:idstr+'_'+param_id, pro_num:num,sn:sn,userid:ev_log_userid,std:std}, function (data) {
					f_();
				});
			}else{
				f_();
			}
		});
	}
}

//删除购物车商品
function del_goods_for_online(id,tmp_t){
	if(confirm('确定删除选中的产品吗！删除后将无法恢复！')){
		var gouwuche = readCookie(user_name+'_gouwuche');
		if(gouwuche!=''){
			var temp_obj=$('#sidebar_Mo').find('.shop_list');;
            var aOrder = JSON.parse(gouwuche);
            var i=0,tn=0;
            var ordArr= {};
            var isUpdate=0;
            for (key in aOrder) {
                if(key==tmp_t){
                    isUpdate = 1;
                }else{
                    ordArr[key]={'num':parseInt(aOrder[key].num),'sn':aOrder[key].sn,'sort':i};
                    i = i+1;
                    continue;
                }
            }
            if(isUpdate){
                var f_ = function(){
                    var tmp_str = JSON.stringify(ordArr);
                    writeCookie(user_name+'_gouwuche',tmp_str,3600);
                    //location.reload();
					get_user_info(temp_obj,5,1);
					show_online_num(user_name)
                }
                var checkLogin = readCookie('zz_userid');
                if(checkLogin){
                    var std = UTCTimeDemo();
                    $.post('/self_define/ajax_set_info.php', {type:28,id_str:tmp_t, userid:temp_userid,std:std}, function (data) {
                        f_();
                    });
                }else{
                    f_();
                }
            }else{
                //location.reload();
				get_user_info(temp_obj,5,1);
				show_online_num(user_name)
            }
		}
	}
}
function del_goods_for_online_new(id,tmp_t){ 
	var gouwuche = readCookie(user_name+'_gouwuche');
	if(gouwuche!=''){
		var temp_obj=$('#sidebar_Mo').find('.shop_list');;
        var aOrder = JSON.parse(gouwuche);
        var i=0,tn=0;
        var ordArr= {};
        var isUpdate=0;
        for (key in aOrder) {
            if(key==tmp_t){
                isUpdate = 1;
            }else{
                ordArr[key]={'num':parseInt(aOrder[key].num),'sn':aOrder[key].sn,'sort':i};
                i = i+1;
                continue;
            }
        }
        if(isUpdate){
            var f_ = function(){
                var tmp_str = JSON.stringify(ordArr);
                writeCookie(user_name+'_gouwuche',tmp_str,3600);
                //location.reload();
				get_user_info(temp_obj,5,1);
				show_online_num(user_name)
            }
            var checkLogin = readCookie('zz_userid');
            if(checkLogin){
                var std = UTCTimeDemo();
                $.post('/self_define/ajax_set_info.php', {type:28,id_str:tmp_t, userid:temp_userid,std:std}, function (data) {
                    f_();
                });
            }else{
                f_();
            }
        }else{
            //location.reload();
			get_user_info(temp_obj,5,1);
			show_online_num(user_name)
        }
	} 
}
//改变cookie
function changeCookieForOnline(id,sn,pro_num,param_id){
	var gouwuche = readCookie(user_name+'_gouwuche');
	var isUpdate = 0;
	if (gouwuche) {
		var aOrder = JSON.parse(gouwuche);
		var i=0;
		for (key in aOrder) {
			if(key==(id+'_'+param_id)){
				aOrder[key]={'num':pro_num,'sn':aOrder[key].sn,'sort':aOrder[key].sort};
				var tmp_str = JSON.stringify(aOrder);
				writeCookie(user_name +'_gouwuche',tmp_str, 3600*7);
				isUpdate = 1;
				i = i+1;
			}else{
				i = i+1;
				continue;
			}
		} // for end
		if (!isUpdate) {
			aOrder[id+'_'+param_id]={'num':pro_num,'sn':sn,'sort':i};
			var tmp_str = JSON.stringify(aOrder);
			//i = i+1;
			//$(".mybutCount").html(i);
			writeCookie(user_name +'_gouwuche',tmp_str, 3600*7);
		}
	}else{
		var arrayObj = {};
		arrayObj[id +"_"+ param_id]={'num':pro_num,'sn':sn,'sort':1};
		var tmp_str = JSON.stringify(arrayObj);
		//$(".mybutCount").html(1);
		writeCookie(user_name+'_gouwuche',tmp_str,3600*7);
	}
}

/*//微信登录
function wx_login(){
	 get_url_window(
			"/dom/pc_wx_login.php?username="+user_name+"&wap=1",
			'微信登录',
			320,
			330,
			1
		);
}
*/
$(function(){
	$(window).scroll(function(){
		if ($(window).scrollTop() > 100){
			$("#return_top").show();
		}else{
			$("#return_top").hide();
		}
	})



	/*$(".sidebar_list ul>li>div").click(function(e){
		e.stopPropagation();
	})*/
	//显示购物车中商品数量
	show_online_num(temp_name);

	$(".sidebar_list").on("click",".clear_x",function(e){
		e.stopPropagation();
		$(this).parents("li").attr("data-length",0).removeClass("cur");
		$(this).parents("li").find(".hover_text").css({
			"right":"60px",
			"opacity":"0",
			"display":"none"
		})
		$(this).parent().parent().remove();
	})
	var win_w = $(window).outerHeight();
	$("#sidebar_Mo .server_c").css("height",win_w-90);
	$("#my_message").parents(".alt_c").css("height",win_w-90);
	$("#return_top").on("click",function(){
		$("body,html").animate({"scrollTop":0},function(){
			$("#return_top").hide();
		});
	})
	$("#sidebar_Mo").on("click",".server_tit a",function(){
		close_alt();
	})
	$(document).click(function(){
		close_alt();
	})
	$("#sidebar_Mo").click(function(e){
		e.stopPropagation();
		// return false;
	})
	$(".sidebar_list li").hover(function(){
		$(".sidebar_list li").stop(true,true);
		$(this).find(".hover_text").show().animate({"right":"35px","opacity":"1"});
		//$(this).find(".user_login").show();
		$(this).find(".QR_text").show();
	},function(){
		$(".sidebar_list li").stop();
		$(this).find(".hover_text").hide().animate({"right":"60px","opacity":"0"});
		//$(this).find(".user_login").hide();
		$(this).find(".QR_text").hide();
	})
})

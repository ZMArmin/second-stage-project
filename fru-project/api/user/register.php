<?php
	//处理跨域
	header("Access-Control-Allow-Origin:*");
	include("../config.php");
	$username = $_POST['username'];
	$password = $_POST['password'];
	$sql = "insert into user (username,password) values ('$username','$password')";
	$res= mysql_query($sql);
	if($res){
		echo json_encode(array(
		 'res_code'=>1,
		 'res_message'=>"注册成功"
		));
	}else{
		echo json_encode(array(
		 'res_code'=>0,
		 'res_message'=>"注册失败请重试"
		 
		));
	}
	

?>

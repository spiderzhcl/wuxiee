<?php

//应用的APPID
$app_id = "101180671";
//应用的APPKEY
$app_secret = "8bb65537fb7fd7c7ca3766eff914d6b1";
//成功授权后的回调地址
$my_url = "http://www.wuxiee.com/qqlogin.php";

//Step1：获取Authorization Code
session_start();
$code = $_REQUEST["code"];
if (empty($code)) {
    //state参数用于防止CSRF攻击，成功授权后回调时会原样带回
    $_SESSION['state'] = md5(uniqid(rand(), TRUE));
    //拼接URL     
    $dialog_url = "https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id="
            . $app_id . "&redirect_uri=" . urlencode($my_url) . "&state="
            . $_SESSION['state'];

    echo("<script> top.location.href='" . $dialog_url . "'</script>");
}

setcookie("usercode", $code, time() + 3600);
//Step2：通过Authorization Code获取Access Token
/* @var $_REQUEST type */
$state = $_REQUEST['state'];
if ($state === $_SESSION['state']) {
    //拼接URL   
    $token_url = "https://graph.qq.com/oauth2.0/token?grant_type=authorization_code&"
            . "client_id=" . $app_id . "&redirect_uri=" . urlencode($my_url)
            . "&client_secret=" . $app_secret . "&code=" . $code;
    $response = file_get_contents($token_url);
    setcookie("userstatresponse", $response, time() + 3600);
    if (strpos($response, "callback") !== false) {
        $lpos = strpos($response, "(");
        $rpos = strrpos($response, ")");
        $response = substr($response, $lpos + 1, $rpos - $lpos - 1);
        $msg = json_decode($response);
        if (isset($msg->error)) {
            echo "<h3>error:</h3>" . $msg->error;
            echo "<h3>msg  :</h3>" . $msg->error_description;
            exit;
        }
    }

    //Step3：使用Access Token来获取用户的OpenID
    $params = array();
    parse_str($response, $params);
    setcookie("userstatresponse", $response, time() + 3600);
    setcookie("userstatresponse2", "abcccc", time() + 3600);
    echo("\nHello " . $params['access_token']);
    $graph_url = "https://graph.qq.com/oauth2.0/me?access_token=" . $params['access_token'];
    setcookie("userurl", $graph_url, time() + 3600);
    $str = file_get_contents($graph_url);
    if (strpos($str, "callback") !== false) {
        $lpos = strpos($str, "(");
        $rpos = strrpos($str, ")");
        $str = substr($str, $lpos + 1, $rpos - $lpos - 1);
    }
    setcookie("userstr", $str, time() + 3600);
    $user = json_decode($str);
    if (isset($user->error)) {
        echo "<h3>error:</h3>" . $user->error;
        echo "<h3>msg  :</h3>" . $user->error_description;
        exit;
    }
    echo("\nHello " . $params['access_token']);
    echo("\nHello " . $user->openid);
} else {
    echo("The state does not match. You may be a victim of CSRF.");
}
?>
<?php
require 'php_sdk_simplified.php';

$client_id = '8219382526247995';
$secret = 'VT4v3foS44DsV6LXT8yhxCtf8Sfg9tu6';
$site_id = 'MCO';

$meli = new Meli($client_id, $secret, $site_id);

$data = $meli->automaticAuth('https://mercadolibre-ososorio1.c9users.io/example_login.php');

if ($data["access_token"] != NULL) {
    $params = array('access_token' => $data["access_token"]);

    $result = $meli->get('/users/me', $params);

    echo '<pre>';
    print_r($result['body']);
    echo '</pre>';
}

 ?>
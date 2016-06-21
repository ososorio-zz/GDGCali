<?php
require 'php_sdk_simplified.php';

$client_id = '8219382526247995';
$secret = 'VT4v3foS44DsV6LXT8yhxCtf8Sfg9tu6';
$site_id = 'MCO';
$meli = new Meli($client_id, $secret, $site_id);

$params = array();

$result = $meli->get('/sites/MCO', $params);

echo '<pre>';
print_r($result);
echo '</pre>';

?>
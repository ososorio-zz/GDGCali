<?php

require 'php_sdk_simplified.php';

$client_id = '8219382526247995';
$secret = 'VT4v3foS44DsV6LXT8yhxCtf8Sfg9tu6';
$site_id = 'MCO';
$meli = new Meli($client_id, $secret, $site_id);
$data = $meli->automaticAuth('https://mercadolibre-ososorio1.c9users.io/example_list_item.php');
if ($data["access_token"] != NULL) {
//https://api.mercadolibre.com/categories/MLA3530
	// We construct the item to POST
	$item = array(
		"title" => "Item de Testeo Por Favor no Ofertar",
		"category_id" => "MCO3530",
		"price" => 10,
		"currency_id" => "COP",
		"available_quantity" => 1,
		"buying_mode" => "buy_it_now",
		"listing_type_id" => "silver",
		"condition" => "new",
		"description" => "Item:, <strong> Ray-Ban WAYFARER Gloss Black RB2140 901 </strong> Model: RB2140. Size: 50mm. Name: WAYFARER. Color: Gloss Black. Includes Ray-Ban Carrying Case and Cleaning Cloth. New in Box",
		"video_id" => "RXWn6kftTHY",
		"warranty" => "12 month by Ray Ban",
		"pictures" => array(
			array(
				"source" => "http://mla-s1-p.mlstatic.com/480901-MLA20440584184_102015-O.jpg"
			),
			array(
				"source" => "http://mla-s2-p.mlstatic.com/672901-MLA20440584183_102015-O.jpg"
			)
		)
	);
	
	// We call the post request to list a item
	echo '<pre>';
	print_r($meli->post('/items', $item, array('access_token' => $data["access_token"])));
	echo '</pre>';
}

?>
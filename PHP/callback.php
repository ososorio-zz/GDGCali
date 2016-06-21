<?php

$rawPostData = file_get_contents("php://input");
    	if (!empty($rawPostData)) {
			file_put_contents('notification'.date("j.n.Y").'.log', $rawPostData . PHP_EOL, FILE_APPEND);
		
			
			
        echo '<pre>';
             print_r(	json_decode($rawPostData, true));
        echo '</pre>';
			
		}
		
		
		?>
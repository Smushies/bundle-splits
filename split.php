<?php
$lengthofstring = 3;

function RandomString($length) {
	$keys = array_merge(range(0,9), range('a', 'z'), range('A', 'Z'));
	for($i=0; $i < $length; $i++) {
		$key .= $keys[mt_rand(0, count($keys) - 1)];
	}
	return $key;
}

$filename = RandomString($lengthofstring);
file_put_contents($filename.'.json', file_get_contents('php://input'));

echo($filename);
?>

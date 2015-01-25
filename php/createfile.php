<?php

$DIR = 'points';

$agent = $_POST['agent'];
$farmer = $_POST['farmer'];
$lat = $_POST['lat'];
$lng = $_POST['lng'];
$crop = $_POST['crop'];
$size = $_POST['field'];

$coord = '[' . strval($lng) . ',' . strval($lat) . ']';

//generate random png and pdf filenames
$randfilename = md5(microtime().mt_rand());
$file =  sprintf("%s/%s.txt", $DIR, $randfilename);

$attr = array('Agent' => $agent, 'Farmer' => $farmer, 'Crop' => $crop, 'Fieldsize' => $size, 'Time' => 6);
$attributes = json_encode($attr);

$geom = array('type' => 'Point', 'coordinates' => $coord);
$geometry = json_encode($geom);

$feat = array('type' => 'Feature', 'properties' => $attributes, 'geometry' => $geometry);
$feature = json_encode($feat);

echo $feature;

$newfile = fopen($file, "w");
fwrite($newfile, $feature);
fclose($newfile);

?>
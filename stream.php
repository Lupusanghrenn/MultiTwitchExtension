<?php
$urls=urldecode(unserialize($_GET['url']));
$curl = curl_init();
$curl_url = "https://api.twitch.tv/kraken/streams/ogaming"
$curl_request = array(
      CURLOPT_URL            => $url,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HEADER         => false
);
curl_setopt_array($curl,$options);
$content = curl_exec($curl);
curl_close($curl);
return json_encode($content);
?>
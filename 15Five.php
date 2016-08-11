<?php
//connect to the database
include "db_connect.php";

//Look up the last TimeStamp
$query = "SELECT lastSearchDate FROM settings LIMIT 1";
$stmt  = $db->prepare($query);
$stmt->execute();
if ($stmt) {
  $row = $stmt->fetch(PDO::FETCH_ASSOC);
  $datetime = $row['lastSearchDate'];
  $date = date("Y-m-d", strtotime( $datetime ) );
} else {
  echo "Query Error";
}

$url =  "https://riseinteractive.15five.com/api/public/high-five/?created_on_start=" . $date;

/* ----- INITIATE CURL STATEMENT  ----  */

$ch = curl_init();
// Disable SSL verification
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
// Will return the response, if false it print the response
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// Set the url
curl_setopt($ch, CURLOPT_URL,$url);
//set header varable
$header = array();
$header[] = 'Content-length: 0';
$header[] = 'Content-type: application/json';
$header[] = 'Authorization: f9b4e9acb4834fd2b8e5a4336b706c57';
curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
// Execute
$result=curl_exec($ch);
// Closing
curl_close($ch);

/* ----- END CURL STATEMENT  ----  */


$json = json_decode($result, true);
$foundNew = 1;

// Loop through the JSON Results and inspect them
foreach ($json['results'] as &$result) {
  $fiveDate = strtotime( $fiveDate = $result['create_ts'] );
  if ( $datetime < $fiveDate ) {
    //echo $fiveText;
    $fiveTS = $result['create_ts'];
    $fiveID =  $result['id'];
    $fiveCreator = $result['creator_id'];
    $fiveText = $result['text'];

    //Add the new high fives to the database
    $query2 = "INSERT INTO highfives (id, creator_id, text, creation_ts, redeemed, qty)
        VALUES (:id, :user, :text, :ts, :redeemed, :qty)";

    $params = array(
        ':id' => $fiveID,
        ':user' => $fiveCreator,
        ':text' => $fiveText,
        ':ts' => $fiveTS,
        ':redeemed' => 0,
        ':qty' => 1
    );
    $stmt   = $db->prepare($query2);
    $stmt->execute($params);

    //Update the database settings lastSearchDate

    $query3 = "UPDATE settings SET lastSearchDate = :ts";
    $params = array(
        ':ts' => $fiveTS
    );
    $stmt   = $db->prepare($query3);
    $stmt->execute($params);

  }
}

  $query = "SELECT * FROM highfives ORDER BY creation_ts DESC LIMIT 50";
  $stmt   = $db->prepare($query);
  $stmt->execute();
  if ($stmt) {
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
      $json = json_encode($results);
      echo $json;
  }


?>

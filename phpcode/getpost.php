<?php
#echo '[{ "post_id":"1502431260005933","comments":"456" }
#, {"post_id":"831407196889983","comments":"hehe"}
#]';


$servername = "127.0.0.1";
$username = "root";
$password = "0000";
$dbname = "test";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM fbnudge";
$result = $conn->query($sql);

$resultStr = "";
if ($result->num_rows > 0) {
    // output data of each row
    $resultStr = $resultStr . '[';
    while($row = $result->fetch_assoc()) {
        $resultStr = $resultStr . "{\"index\":\"".$row["index"]."\",\"post_id\":\"".$row["id"]."\",\"comments\":\"".$row["msg"]."\"},";
    }
    $resultStr = substr($resultStr,0,strlen($resultStr)-1);
    $resultStr = $resultStr . ']';
} else {
    echo "0 results";
}
echo $resultStr;
$conn->close();


?>

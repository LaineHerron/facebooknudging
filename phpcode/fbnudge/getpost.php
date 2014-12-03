<?php
#echo '[{ "post_id":"1502431260005933","comments":"456" }
#, {"post_id":"831407196889983","comments":"hehe"}
#]';

$servername = "127.0.0.1";
$username = "courseproject";
$password = "zxcv!@#$";
$dbname = "course_project";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//$sql = "SELECT * FROM fbnudge";
//$sql = "select id, count(id), msg from `fbnudge` group by id, msg";
$sql = "SELECT id, group_concat(DISTINCT msg) AS msg FROM ((select id,msg,count(msg) from `fbnudge` group by id,msg having count(msg) <= 4))AS smaller group by id";
$result = $conn->query($sql);

$resultStr = ""; 
if ($result->num_rows > 0) {
    // output data of each row
    $resultStr = $resultStr . '[';
    while($row = $result->fetch_assoc()) {
        //$resultStr = $resultStr . "{\"index\":\"".$row["index"]."\",\"post_id\":\"".$row["id"]."\",\"comments\":\"".$row["msg"]."\"},";
        //$resultStr = $resultStr . "{\"count\":\"".$row["count(id)"]."\",\"post_id\":\"".$row["id"]."\",\"comments\":\"".$row["msg"]."\"},";
    
	$resultStr = $resultStr . "{\"post_id\":\"".$row["id"]."\",\"count\":\"1\",\"comments\":\"".$row["msg"]."\"},";
	}   

    
    $sql2 = "SELECT id, group_concat(DISTINCT msg) AS msg FROM ((select id,msg,count(msg) from `fbnudge` group by id,msg having count(msg) >= 5))AS smaller group by id";
    $result2 = $conn->query($sql2);
    if ($result2->num_rows > 0) {
        while($row2 = $result2->fetch_assoc()) {
            $resultStr = $resultStr . "{\"post_id\":\"".$row2["id"]."\",\"count\":\"5\",\"comments\":\"".$row2["msg"]."\"},";
        }   
    }  


    $resultStr = substr($resultStr,0,strlen($resultStr)-1);
    $resultStr = $resultStr . ']';
} else {
    echo "0 results";
}
echo $resultStr;
$conn->close();


?>

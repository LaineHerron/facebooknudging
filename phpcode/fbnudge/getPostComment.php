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

$sql = "select * from fbnudge;";
$result = $conn->query($sql);
$resultStr = ""; 
if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
	
echo "post_id:".$row["id"].",string:".$row["msg"]."<br />";
}   
    

} else {
    echo "0 results";
}
$conn->close();


?>

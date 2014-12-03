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

$sql = "SELECT * FROM posts";
//$sql = "select id, count(id), msg from `fbnudge` group by id, msg";
//$sql = "SELECT id, group_concat(DISTINCT msg) AS msg FROM ((select id,msg,count(msg) from `fbnudge` group by id,msg having count(msg) <= 4))AS smaller group by id";
$result = $conn->query($sql);

$resultStr = ""; 
if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
	
echo "post_id:".$row["id"].",string:".$row["post"]."<br />";
}   
    

} else {
    echo "0 results";
}
$conn->close();


?>

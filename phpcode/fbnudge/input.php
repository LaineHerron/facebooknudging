<?php
    echo "hello";
    $id=$_POST['id'];
    $msg=$_POST['msg'];
     //$msg = str_replace("\""," ",$msg);    
     //$msg = str_replace("'"," ",$msg);    
$postStr = $_POST['postStr'];     
echo 'post:'.$id.'   '.$msg.'<br />';
 	
     $postStr = str_replace("\""," ",$postStr);    
     $postStr = str_replace("'"," ",$postStr);    

    if(strcmp($msg,"Comment inappropriate because of")!=0){
    
    $link  =mysqli_connect("127.0.0.1","courseproject","zxcv!@#$") or die("failed".mysql_error());
    mysqli_select_db($link,"course_project")or die ("db failed".mysql_error()); 

    $sql ="INSERT INTO fbnudge (id,msg)  VALUES ( '$id' , '$msg')";

    mysqli_query($link,$sql)or die ("insert failed".mysql_error());
	
    $sql ="INSERT INTO posts (id,post)  VALUES ( '$id' , '$postStr')";
    
    mysqli_query($link,$sql)or die ("insert failed".mysql_error());

    mysql_close($link);
    }
?>

<?php
    echo "hello";
    $id=$_POST['id'];
    $msg=$_POST['msg'];
    echo 'post:'.$id.'   '.$msg.'<br />';


    $link  =mysqli_connect("127.0.0.1","root","0000") or die("failed".mysql_error());
    mysqli_select_db($link,"test")or die ("db failed".mysql_error()); 

    $sql ="INSERT INTO fbnudge2 (id,msg)  VALUES ( '$id' , '$msg')";

    mysqli_query($link,$sql)or die ("insert failed".mysql_error());

    mysql_close($link);
?>

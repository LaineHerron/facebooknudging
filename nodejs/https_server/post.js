// 引用 http 模塊
var http = require("http");
// 引用 querystring 模塊
var querystring = require("querystring");
// 創建服務端
http.createServer(function (request, response) {
        // 定義變量，用來處理post數據
        var postData = "";
        // 輸出字符串
        var responseString = "";
        response.writeHead(200, {
            "content-type": "text/html"
            });
        // 如果是get請求
        if (request.method == "GET") {
        responseString = '<!doctype html><html lang="en"><head><meta charset="UTF-8" /><title>Document</title></head><body>\
        <form action="/" method="post">\
        <input type="text" name="a" value="1" />\
        <input type="text" name="b" value="2" />\
        <input type="text" name="c" value="3" />\
        <input type="submit" value="submit" />\
        </form>\
        </body></html>';
        response.write(responseString);
        response.end();
        }
        // 如果是post請求
        else if (request.method == "POST") {
            // 設置接收數據編碼格式為 UTF-8
            request.setEncoding("utf8");
            // 因為nodejs在處理post數據的時候，會將數據分成小包來序列處理
            // 所以必須監聽每一個數據小包的結果
            request.addListener("data", function (postDataChunk) {
                    postData += postDataChunk;
                    });
            // 所有數據包接收完畢
            request.addListener("end", function () {
                    // 解析post數據
                    var objectPostData = querystring.parse(postData);
                    for (var i in objectPostData) {
                    responseString += i + " => " + objectPostData[i] + "<br>";
                    }
                    console.log(responseString);
                    response.write(responseString);
                    response.end();
                    });
        }
}).listen(2014);

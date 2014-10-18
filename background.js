var a_facebook_api = {
	
	api_url: 'http://afb-extension.com/api/',
		
	getPostFromDB: function(post_list, return_func){
		
		if(typeof return_func!='function') return_func = function(){};
		
		//
		
		var post_list_string = this.listPostToString(post_list);
		
		if(!post_list_string){
			
			return false;
			
		}
		
		var default_data = {
			string: null,
		};

		
		
		//alert(1);

		
		
		$.post( "http://anonymous.comze.com/test2.php", {string:post_list_string},function(data1)
		{
		    // return data1;
		    //alert(data1);
		    //data1 = jQuery.parseJSON(data1);
		    var i=0;
		    var array=new Array();
		    var object=new Array();
		    var data="";
		    var flag=0;
		    for(i=0;i<data1.length;i++)
			{
			    if(flag==1)
				{
				   
				    if(data1[i]=='}')
					{
					    data+=data1[i];
					    array.push(data);
					    //    alert(data);
					    data='';
					    //alert(data)
					    flag=0;
					    continue;
					}
				    data+=data1[i];
				    
				}

			    if(data1[i]=='{')
				{
				    data+=data1[i];
				    flag=1;
				}

			}
		    //  var temp=jSON.parse（）array[1]);
		    //alert(array[0]);
		    for(i=0;i<array.length;i++)
			{
			    var temp=JSON.parse(array[i]);
			    object.push(temp);
			}
		    //alert(object);
		    return_func(object);
		    // alert(array);
		    //    alert(data1.length);
		    //return return_func(data1);  

		}


);

		//alert(1);
		var url = this.api_url + '?act=post_list&post_list=' + post_list_string;
		/*						
		//
		
		jQuery.getJSON(url, function(data){
						
			if(!data || !data['status'] || data['status']=='error'){
				
				return_func(false);
				
				return false;
				
			}
			//	allert( data['value']);
			return_func(data['value']);
			
		}).error(function(){
			
			return_func(false);
			
		});
		*/
		
	},
	
	addPostToDB: function(data, return_func){
		
		if(typeof return_func!='function') return_func = function(){};
		
		//
		
		var default_data = {
			post_id: null,
			message: null,
			u1: null
		};
		
		data = jQuery.extend(default_data, data);
		
		
	//	alert(data['message'] );
	//	alert(data['u1']);
	//	alert(data['post_id']);
		if(!data['post_id'] || !data['message']){
			
			return false;
			
		}
		
		//
		
		$.post( "http://anonymous.comze.com/test1.php", data);
		var url = a_facebook_api.api_url + '?act=post_list&act=post_add&post_id=' + data['post_id'] + '&message=' + data['message'] + '&u1=' + data['u1'];
		//alert(url);	
		console.log(url);	
		








			
		jQuery.getJSON(url, function(data){

			if(!data || !data['status'] || data['status']=='error')			{
				
				return_func(false);
				
				return false;
				
			}
			
			return_func(true);

		}).error(function(){
			
			return_func(false);
			
		});
		
	},
	
	listPostToString: function(post_list){

		var post_list_string = '';
		
		for(i in post_list){
			
			var post_id = post_list[i];
			
			if(typeof post_id!='number') continue;
			
			//
			
			post_list_string += post_id + ',';
			
		}
		
		if(post_list_string==''){
			
			return false;
			
		}
		
		return post_list_string.substr(0, post_list_string.length-1);

	}
	
};


chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		
		if(!request.method){
			
			return false;
			
		}
		
		if(request.method=='postList' && request.post_list){
			
			a_facebook_api.getPostFromDB(request.post_list, function(data){
				
				sendResponse(data);
				
			});
			
		} else if(request.method=='postAdd' && request.post_data){
			
			a_facebook_api.addPostToDB(request.post_data, function(data){
				
				sendResponse(data);
				
			});
			
		}
		
		return true;
		
	}
);

chrome.tabs.onUpdated.addListener(function(tabId,changeInfo){
	
	if(changeInfo.status=='complete'){
				
		chrome.tabs.executeScript(tabId, {code: "var create_listener = setTimeout(function(){  a_facebook.initPage();  },1000); "});
		
	}
		
});
var a_facebook = {
	
	wall_length: 0,
	profile_length: 0,
	
	listener_func: null,
	u1: null,
        array:null,
	lang: {
	post_placeholder: 'Type your anonymous post...',
		post_add: 'Send'
	},
		
	create: function(){
				
		this.initPage();
		
		
	},
	
	 initPage: function(){
	
	array=new Array('value1','value2','value3');

	
	 	var i=0;
		clearInterval(a_facebook.listener_func);
		this.listener_fu=setInterval(function(){
			
			elements=document.getElementsByClassName("_5jmm _5pat _5srp");
	    		select_text="";
			for(i=0;i<array.length;i++)
			    {
				select_text+="<option value=>";
				//select_text+="\"+"\">";
				select_text+=array[i];
				select_text+="</option>";
				
			    }
		
			for(i=0;i<elements.length;i++)
		{
		    var exist_name="submit"+i;
		    var exist_button = document.getElementById(exist_name);
		    if (exist_button!=null)
			continue;
	 var  a=elements[i].getElementsByClassName("uiUfi UFIContainer _5pc9");
	
	 if(a.length!=0)
	     {
		 
			var button_id="submit"+i;
			var button=document.createElement("input");
			button.id=button_id;
			button.type="submit";
			button.value="send";
			mydata=JSON.parse(elements[i].dataset['ft']);
			var post_id=mydata['mf_story_key'];
			//alert(post_id);
			button.value="send";
			button.onlick=function()
			    {
				//		posttoDB(i,post_id);
				document.write("hello world");
			    };
			//alert(button_id);
			a[0].appendChild(button);
			//var buff = new Array(['one','1'],['two','2'],['there','3']);
			//a[0].innerHTML +=
		       
			var select_id="select"+i;
			inner_select_html="<select id=\"";
			inner_select_html+=select_id;
			inner_select_html+="\"  style=\"width: 400px;height: 30px;line-height:30px;\">";
			inner_select_html+=select_text;
			inner_select_html+="</select>";
			a[0].innerHTML+=inner_select_html;

	     }
	     }
		    }					      
		    ,1000);
    },
	posttoDB: function(index,post_id)
	{
	    // alert(i);
	    //alert(post_id);
	    var default_data = {
		post_id: null,
		message: null,
		
	    };
	    // document.write("hellw")
	    var select_id="select"+index;
	    var place=document.getElementById(select_id);
	    var i=0;
	    var data=default_data;
	    for(i=0;i<place.length;i++)
		{
		    if(place.options[i].selected)
			{
			    data.message=place.options[i].text;
			    break;
			}

		}
	    data.post_id=post_id;
	    var text_field=document.createElement("p");
	   
	    text_field.innerHTML=data.message;
	    elements=document.getElementsByClassName("_5jmm _5pat _5srp");
	    //	    var a=elements[i].
	    	 var  a=elements[i].getElementsByClassName("uiUfi UFIContainer _5pc9");
	    a[0].appendChild(text_field);
	}
	
	
	

};

a_facebook.create();
var a_facebook = {
	
	wall_length: 0,
	
	profile_length: 0,
	
	listener_func: null,
	
	u1: null,
	
	lang: {
		post_placeholder: 'Type your anonymous post...',
		post_add: 'Send'
	},
		
	create: function(){
				
		this.initPage();
		
		this.livePosting2();
		
		this.changeUrlListener();
		
		this.updateU1();
		
		//
		
		// this.importCSS();
		
	},
	
	initPage: function(){
	
		var container = this.recognizePageType();
				
		clearInterval(a_facebook.listener_func);
		
		//
		 
		if(container=='wall'){
		
			this.insertWallFrame();
			
			this.listenWallLength();
					
		} else if(container=='profile'){

			this.insertProfileFrame();
			
			this.listenProfilePostLength();

		} else if(container=='photo'){
			
			this.insertPhotoFrame();
			
		}
		else{
		this.insert();
		}//	alert(1);
		
	},
	
	updateU1: function(){
		
		var u1 = $("#pageNav .headerTinymanPhoto:eq(0)").attr('id');
		
		if(!u1) return false;
		
		u1 = u1.replace('profile_pic_header_', '') * 1;
		
		this.u1 = u1;	
		
	},
	
	recognizePageType: function(){
		
		var type = null;
		
		if(location.href.match(/photo\.php/i)){
		    
			type = 'photo';
			
		} else if(jQuery('._5uch _5jmm _5pat').length){
		    alert(2);
			type = 'wall';
			
		} else if(jQuery('.fbTimelineUnit').length){
		    // alert(4);
			type = 'profile';
			
		}
		
		return type;
		
	},
	
	changeUrlListener: function(){
		
		var stored_url = window.location.href;
		
		setInterval(function () {

			if (location.href != stored_url) {
				stored_url = location.href;
				a_facebook.changeUrl();
				
			}
		}, 500);
		
	},
	
	changeUrl: function(){
		
		var page_type = this.recognizePageType();
				
		if(page_type=='photo'){
			
			this.insertPhotoFrame();
			
		}
		
	},
	
	postIdByFeedbackParams: function($container){
		
		var feedback_params = $container.find("input[name='feedback_params']").val();
				
		feedback_params = jQuery.parseJSON(feedback_params);
				
		if(!feedback_params || !feedback_params['target_fbid']){
					
			return false;
					
		}
				
		return feedback_params['target_fbid'] * 1;
		
	},
	
	/* Container Photo */
	
	insertPhotoFrame: function(){
		
		var photo_type = 'popup';
		
		if(jQuery('.fbPhotoUfiCol .photoUfiContainer').length){
			
			var photo_type = 'page';
			
		}
				
		if(photo_type=='page'){

			jQuery('.fbPhotoUfiCol .afb-comments').remove();
			
			//
			
			var $container = jQuery('.fbPhotoUfiCol .photoUfiContainer');
																	
			//
										
			var post_id = this.postIdByFeedbackParams($container);
						
			if(!post_id){
				
				return false;
				
			}
			
			//
			
			$container.after(a_facebook.addPostContainerHTML({post_id: post_id}));
			
			this.updatePostContent([post_id]);
						
		} else if(photo_type=='popup'){
			
			var $popup = jQuery('.fbPhotosSnowboxFeedbackInput .UFIList');
			
			if($popup.length || !$popup.prop('data-afacebook-status')){
										
				$popup.prop('data-afacebook-status', true)			
				
				$popup.find('.afb-comments-photo').remove();
							
				// $popup.after();
								
				var post_id = this.postIdByFeedbackParams($popup.parent());
				
				//
								
				$popup.append('<li class="afb-comments-photo">' + a_facebook.addPostContainerHTML({post_id: post_id}) + '</li>');	
				
				//
				
				this.updatePostContent([post_id]);
				
			}
			
		}
		
	},
	
	/* Container Profile */
	
	insertProfileFrame: function(){
		
		var update_post = [];
		
		jQuery('.fbTimelineUnit').each(function(){
			
			var $this = jQuery(this);
			
			if($this.prop('data-afacebook-status')){
				
				return true;
				
			}
			
			$this.prop('data-afacebook-status', true);
			
			//
			
			var post_id = a_facebook.postIdByFeedbackParams($this);
			
			/*
			
			//
			
			
			var share_href = $this.find('.share_action_link').attr('href');
			
			if(share_href){
				
				share_href_match = share_href.match(/p\%5B1\%5D\=(.*)/i);
				
				if(share_href_match[1]){
					
					post_id = share_href_match[1] * 1;
					
				}
				
			}
			
			*/
			
			if(!post_id){
				
				return true;
				
			}
			
			update_post.push(post_id);
			
			//
			
			$this.find('.UFIContainer').append(a_facebook.addPostContainerHTML({post_id: post_id}));	
				
		});
		
		this.updatePostContent(update_post);
				
	},
	
	listenProfilePostLength: function(){
		
		this.listener_func = setInterval(function(){
			
			var profile_post_length = jQuery('.fbTimelineUnit').length;
			
			if(profile_post_length > a_facebook.profile_length){
				
				a_facebook.profile_length = profile_post_length;
				
				a_facebook.insertProfileFrame();
				
			}
			
		}, 1000);
		
	},
	
	/* Container Wall */
		
	addPost: function(data){

		var default_data = {
			post_id: null,
			message: null,
			time: null
		};
		
		data = jQuery.extend(default_data, data);
		
		//
		
		this.addPostToHTML(data);
		
		//
		//alert(data['post_id']);
		this.addPostToDB(data, function(){
			
		});
		
	},
	
	addPostToHTML: function(data){
		
		var default_data = {
			post_id: null,
			message: null,
			time: null
		};
		
		data = jQuery.extend(default_data, data);
		
		if(!data['time']){
			
			data['time'] = time();
						
		}
		
		data['time'] = date('H:i d/m', data['time']);
				
		//
		
		var $comments_list = jQuery(".fb-comments-post" + data['post_id'] + ' .afb-comments-list');
		
		//
		
		var post_html = '<li><header><span class="author">Anonym</span><span class="seperator">|</span><span class="date">' + data['time'] + '</span></header><section class="content">' + data['message'] + '</section></li>';
				
		//
		
		if($comments_list.find('ul').length){
			
			$comments_list.find('ul').append(post_html);
			
		} else {
			
			$comments_list.html('<ul>' + post_html + '</ul>');
			
		}
		
	},
	
	insert: function()
	{
	    // alert(1);
	   
	    this.listener_func = setInterval(function(){
	    elements=document.getElementsByClassName("_5jmm _5pat _5pat");
	    updatePostContent();
	    //connsole.log(elements.length);
	    // updatePostContent();
	    // alert(elements.length);
	        for(i=0;i<elements.length;i++)
		{
		    var a=elements[i].getElementsByClassName("uiUfi UFIContainer _5pc9");
		    if(a.length==0)
	               continue;
		    var b=a[0].getElementsByClassName('afb-comments fb-comments-post');
		  
		    if(b.length==0)
			{
		    
		    mydata=JSON.parse(elements[i].dataset['ft']);
		    var post_id=mydata['mf_story_key'];
		    // alert(1);
		    // alert(post_id);
		    name1='rate1'+i;
		    name2='rate2'+i;
		    name3='rate3'+i;
		    name4='rate4'+i;
		    name5='rate5'+i;
		    //    array4[i]=1;
		    //  a[0].innerHTML+=a_facebook.addPostContainerHTML({post_id:post_id});
	  a[0].innerHTML+='<div class="rate_widget"><div class="star_1 ratings_stars"'+'id= "'+name1+'"></div><div class="star_2 ratings_stars"'+'id= "'+name2+'"></div><div class="star_3 ratings_stars"'+'id= "'+name3+'"></div><div class="star_4 ratings_stars"' +'id= "'+name4+'"></div><div class="star_5 ratings_stars"'+'id= "'+name5+'"></div></div>';
	  a[0].innerHTML+=a_facebook.addPostContainerHTML({post_id:post_id});
			}
			}
		},1000);
	    // alert(1);
	    // $('clearfix _5pcr userContentWrapper').each(function(){
	    //alert(1);
	    //    });
	},






	insertWallFrame: function(){
		
		var update_post = [];
				
		jQuery("#home_stream li.uiStreamStory").each(function(){
						
			var $this = jQuery(this);
			
			var $this_sub_stories = $this.find('.uiStreamSubstories li');
			
			// Gdy występują sub stories
			
			if($this_sub_stories.length){
								
				$this_sub_stories.each(function(){
										
					var $this = $(this);
					
					if($this.prop('data-afacebook-status')){
						
						return true;
						
					}
					
					$this.prop('data-afacebook-status', true);
					
					var post_id = a_facebook.postIdByFeedbackParams($this);
										
					if(!post_id){
						
						return true;
						
					}
					
					update_post.push(post_id);
														
					//
					
					var $space = $this.find('.uiStreamFooter').next();
					
					if($space.hasClass('uiStreamEdgeStoryLine')){
						
						$space = $this.find('.uiStreamFooter').eq(1).next();
						
					}
					
					
																	
					$space.after(a_facebook.addPostContainerHTML({post_id: post_id}));
					
				});
								
			} else {
			
				//
				
				if($this.prop('data-afacebook-status')){
					
					return true;
					
				}
				
				$this.prop('data-afacebook-status', true);
				
				var post_id = a_facebook.postIdByFeedbackParams($this);
				
				if(!post_id){
					
					return true;
					
				}
				
				update_post.push(post_id);
													
				//
				
				var $space = $this.find('.uiStreamFooter').next();
				
				if($space.hasClass('uiStreamEdgeStoryLine')){
					
					$space = $this.find('.uiStreamFooter').eq(1).next();
					
				}
				
				//
																
				$space.after(a_facebook.addPostContainerHTML({post_id: post_id}));
			
			}
						
		});
						
		this.updatePostContent(update_post);
		
	},
	
	updatePostContent: function(input_post_list){
	console.log(input_post_list);
		this.getPostFromDB(input_post_list, function(post_list){
						
			if(!post_list){
				
				return false;
				
			}
			
			//
			//alert(1);
			for(i in post_list){
				
				var e = post_list[i];
												
				a_facebook.addPostToHTML({post_id: e.post_id, message: e.comments, time:e.time});
				
			}
						
		});
		
		
	},
	
	getPostFromDB: function(post_list, return_func){
								
		chrome.extension.sendMessage({method: "postList",post_list: post_list}, function(data) {
						
		 	 return_func(data);
		  
		});		
	},
	
	addPostToDB: function(data, return_func){
				
		var data_default = {
			u1: this.u1
		};
		
		data = $.extend(data_default, data);
		//alert(data['ul']);
		//
						
		chrome.extension.sendMessage({method: "postAdd",post_data: data}, function(response) {

		 	 // console.log(response);
		  
		});		

	},
		
	listenWallLength: function(){
		
		this.listener_func = setInterval(function(){
			
			var wall_length = jQuery("#home_stream li.uiStreamStory").length;
			
			if(wall_length > a_facebook.wall_length){
								
				a_facebook.wall_length = wall_length;
				
				a_facebook.insertWallFrame();
				
			}
			
		},1000);
		
	},
	
	importCSS: function(){
		
		jQuery('<link rel="stylesheet" href="http://127.0.0.1/afacebook_chrome/app.css"/>').appendTo("head");
		
	},
	
	formatTime: function(time){
		
		if(!time){
		
			var d = new Date();
		
		} else {
			
			var d = new Date(time);
			
		}
		
		var day = d.getDate();
		
		var month = d.getMonth() + 1;
		
		if(day < 10){
			
			day = '0' + day;
			
		}
		
		if(month < 10){
			
			month = '0' + month;
			
		}
		
		//
		
		var date_string = d.getHours() + ":" + d.getMinutes() + ' ' +  day + '.' + month;
		
		return date_string;
		
	},
	
	getPostID: function(href){
		
		if(!href){
			
			return false;
			
		}
		
		var post_id = null;
				
		//
		
		if(href.indexOf('/permalink.php?story_fbid=') > -1){

			var matches = href.match(/permalink\.php\?story_fbid\=(.*)\&/i);
			
			post_id = matches[1];

		}  else if(href.indexOf('/media/set/?set=a.') > -1){
						
			var matches = href.match(/set\/\?set=a\.(.*)/i);
			
			if(!matches[1]){
				
				return false;
				
			}
			
			matches = matches[1].split('.');
			
			post_id = matches[0];
						
		} else if(href.indexOf('photo.php?fbid=') > -1){
						
			var matches = href.match(/photo.php\?fbid=(.*)\&set\=/i);
			
			post_id = matches[1];
			
		} else if(href.indexOf('/posts/') > -1){
			
			var matches = href.match(/\/posts\/(.*)/i);
			
			post_id = matches[1];
			
		}
		
		post_id *= 1;
		
		if(isNaN(post_id) || !post_id){
			
			return false;
			
		}
		
		return post_id;
		
	},
	livePosting2: function(){
	array=new Array('Too much personal information','Sexual content','Relationship','Profanity','Alcohol/drug use','Inappropriate jokes','Lies','Information about work/colleague','Humiliating others','Political','Insensitive');


	setInterval(function(){
	elements=document.getElementsByClassName('_5uch _5jmm _5pat');
	//console.log(elements.length);
	for(i=0;i<elements.length;i++)
	    {
		b=elements[i]. getElementsByClassName('input-submit');
		if(b.length==0)
		    continue;
		if(b==null)
		    {
			console.log('b is null');
			continue;
		    }
		exist_button=b[0];
		if(i==0)
		    exist_button.onclick=function(){posttoDB(0);};
		   
		if(i==1)
		    exist_button.onclick=function(){posttoDB(1);};
		if(i==2)
		    exist_button.onclick=function(){posttoDB(2);};
		if(i==3)
		    exist_button.onclick=function(){posttoDB(3);};
		if(i==4)
		    exist_button.onclick=function(){posttoDB(4);};
		if(i==5)
		    exist_button.onclick=function(){posttoDB(5);};
		if(i==6)
		    exist_button.onclick=function(){posttoDB(6);};
		if(i==7)
		    exist_button.onclick=function(){posttoDB(7);};
		if(i==8)
		    exist_button.onclick=function(){posttoDB(8);};
		if(i==9)
		    exist_button.onclick=function(){posttoDB(9);};
		if(i==10)
		    exist_button.onclick=function(){posttoDB(10);};
		if(i==11)
		    exist_button.onclick=function(){posttoDB(11);};
		if(i==12)
		    exist_button.onclick=function(){posttoDB(12);};
		if(i==13)
		    exist_button.onclick=function(){posttoDB(13);};
		if(i==14)
		    exist_button.onclick=function(){posttoDB(14);};
		if(i==15)
		    exist_button.onclick=function(){posttoDB(15);};
		if(i==16)
		    exist_button.onclick=function(){posttoDB(16);};
		if(i==17)
		    exist_button.onclick=function(){posttoDB(17);};
		if(i==18)
		    exist_button.onclick=function(){posttoDB(18);};
		if(i==19)
		    exist_button.onclick=function(){posttoDB(19);};
		if(i==20)
		    exist_button.onclick=function(){posttoDB(20);};
		if(i==21)
		    exist_button.onclick=function(){posttoDB(21);};
		if(i==22)
		    exist_button.onclick=function(){posttoDB(22);};
		   
		
	    }
	    },1000);
    },

	livePosting: function(){
		
		jQuery('.afb-comments .afb-comment-add .input-submit').live('click', function(){
			
			var $this = jQuery(this);
			var a=jQuery(this);
			a.getElementsByClassName('selbox');
			console.log(a);
			var $post_container = $this.parent().parent();
			//	alert(1);		
			var $post_input = $post_container.find('.afb-comment-add .selbox');
			
			//
			//	var $a=$post_input.first();
			var post_id = $post_container.attr('data-post-id');
			console.log(post_id);
			
			var post_message = $post_input.val();
		      	//console.log($a.get(0).selectedindex);
			//	console.log($post_input.option[0].selected);
			
			//
			//alert(post_message);
			if(post_message==''){
				
				return false;
				
			}
			
			//
									
			a_facebook.addPost({
				post_id: post_id,
				message: post_message
			});
			
			//
			
			$post_input.val('');		
			
			//
			
			return false;
			
		});
		
	},
	
	addPostContainerHTML: function(data){

		array=new Array('Too much personal information','Sexual content','Relationship','Profanity','Alcohol/drug use','Inappropriate jokes','Lies','Information about their work/boss','Humiliating others','Political','other');

	elements=document.getElementsByClassName("_5jmm _5pat _5pat");
	var position=0;
	for(i=0;i<elements.length;i++)
	    {
		mydata=JSON.parse(elements[i].dataset['ft']);
		var post_id=mydata['mf_story_key'];
		if(data['post_id']==post_id)
		    {
			console.log(i);
			position=i;
			break;
		    }
	    }
	select_id='select'+position;
	    select_text='<option selected disabled hidden value=\'\'>Comment inappropriate because of </option>"';
	
	    for(i=0;i<array.length;i++)
		{
		    select_text+="<option value=>";
		    //select_text+="\"+"\">";
		    select_text+=array[i];
		    select_text+="</option>";
		    
		}
		var default_data = {
			post_id: null
		};
		
		data = jQuery.extend(default_data, data);
		if(data['post_id']==null)
		    return '';
		return '<div class="afb-comments fb-comments-post' + '" data-post-id="' + data['post_id'] + '"><div class="afb-comments-list"></div><div class="afb-comment-add">	<Select '+'id='+'"'+select_id+'"'+' Size=1 Style="Width:270px;Height:30px;Font-size:10pt" class= "selbox" >'+select_text+'</select><label class="uiButton uiButtonConfirm input-submit"><input type="button" value="' + 'send' + '"></label></div></div>';
	
	}
	
};
 function posttoDB(id)
{
    // console.log(id);
    var select_id="select"+id;
    var place=document.getElementById(select_id);
    elements=document.getElementsByClassName("_5jmm _5pat _5pat");
    mydata=JSON.parse(elements[id].dataset['ft']);
    
    var post_id=mydata['mf_story_key'];
    console.log(post_id);
    if(post_id==null)
	{
	    element=elements[id].getElementsByClassName('afb-comments');
	    post_id=element[0].attributes['data-post-id'];
	    console.log(post_id);
	}
    var i=0;
        var data=
	{
	    message:"",
	    post_id:1
	};
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
	//	console.log(text_field);
	
	var a=elements[id].getElementsByClassName("uiUfi UFIContainer _5pc9");
	//	console.log(a[0]);
	//a[0].appendChild(text_field);
	a[0].appendChild(text_field);
	//console.log(data);
	addPostToDB(data);
}
function addPostToDB(data)
{
    //    var data_default = {
    //	u1: this.u1
    //};
    console.log(data['message']);
    console.log(data['post_id']);
    $.post( "http://anonymous.comze.com/test1.php", {message:data['message'], post_id:data['post_id']});
    //data = $.extend(data_default, data);
    // console.log(data);
    //   $.post( "http://anonymous.comze.com/test1.php", {mes,post"1", post_id:"2"},function(data1)
    //	    {
    //		console.log(data1);
    //	    }
    //	    );
    //alert(data['ul']);
    //
    //alert(data);
    //console.log(data);
    // chrome.runtime.sendMessage({method: "postAdd",post_data: data}, function(response) {
	    //alert(response);
	    // console.log(response);
	          
    //	});
}

function getPostFromDB (post_list){
    
    // alert(post_list);
    $.post( "http://anonymous.comze.com/test2.php", {string:post_list},function(data1)
	    {
		//alert(data1);
		// return data1;
		//alert(123);
		//data1 = jQuery.parseJSON(data1);
		//alert(1);
		//console.log(data1);
		addPostToHtml(data1);
		//return object;
		//    alert(object);
		//return_func(data1);
		// alert(array);
		//    alert(data1.length);
		//return return_func(data1);  

	    }
	    );




    // alert(post_list);
    // var message;
    //console.log('123s');
    // chrome.runtime.sendMessage({method: "postList",post_list: post_list}, function(response) {
    //     alert(1);
    // console.log(response.question);
    // console.log(response.data);
    //     message=response.data; 
    //    });
    //alert(message);
      
    
}
function addPostToHtml(data1)
{
    //alert(post_array);
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
    
    for(i=0;i<array.length;i++)
	{
	    var temp=JSON.parse(array[i]);
	    object.push(temp);
	}
    //alert(object.length);
    elements=document.getElementsByClassName("_5jmm _5pat _5pat");
    for(i=0;i<object.length;i++)
	{
	    //alert(object[i].post_id);
	    for(j=0;j<elements.length;j++)
		{
		    var  a=elements[j].getElementsByClassName("uiUfi UFIContainer _5pc9");
		    mydata=JSON.parse(elements[j].dataset['ft']);
		    var post_id=mydata['mf_story_key'];
		    //exist_button = document.getElementById(exist_name);
		    if(object[i].post_id==post_id)
			{
			    //alert(1);
			    var text_field=document.createElement("p");
			    //   alert(object[i].comments);
			    text_field.innerHTML=object[i].comments;
			    elements=document.getElementsByClassName("_5jmm _5pat _5pat");
			      
			    a=elements[j].getElementsByClassName("uiUfi UFIContainer _5pc9");
			    a[0].appendChild(text_field);
			    break;
			}
		}
	}
    
}

function updatePostContent(){
    input_post_list='';
    
    elements=document.getElementsByClassName("_5jmm _5pat _5pat");
    for(i=0;i<elements.length;i++)
	{
	    //  console.log(array5[i]);
	     if(array5[i]==1)
	    	continue;
	    array5[i]=1;
	    var  a=elements[i].getElementsByClassName("uiUfi UFIContainer _5pc9");
	    mydata=JSON.parse(elements[i].dataset['ft']);
	    var post_id=mydata['mf_story_key'];
	    input_post_list=input_post_list+post_id;
	    input_post_list=input_post_list+',';
	} 
    
    
    //        alert(input_post_list);
    getPostFromDB(input_post_list);
    


    //alert(message);
    /* getPostFromDB(input_post_list, function(post_list){
           
           alert(post_list);
	       if(!post_list){
	       
	       return false;
	       
	           }
		       
		       //
		           //alert(1);
			       for(i in post_list){
			       
			       var e = post_list[i];
			       alert(e.comments);
			       //addPostToHTML({post_id: e.post_id, message: e.comments, time:e.time});
			       
			           }
				       
				   });*/
    
    
}








function rating() {
        
        $('.rate_widget').each(function(i) {
		var widget = this;
		var out_data = {
		    widget_id : $(widget).attr('id'),
		    fetch: 1
		};
		/*	$.post(
		       'ratings.php',
		       out_data,
		       function(INFO) {
			   $(widget).data( 'fsr', INFO );
			   set_votes(widget);
		       },
                'json'
		);*/
	    });
    

        $('.ratings_stars').hover(
				  // Handles the mouseover
				  function() {
				      $(this).prevAll().andSelf().addClass('ratings_over');
				      $(this).nextAll().removeClass('ratings_vote'); 
				      console.log('123');
				  },
				  // Handles the mouseout
				  function() {
				      $(this).prevAll().andSelf().removeClass('ratings_over');
				      // can't use 'this' because it wont contain the updated data
				      set_votes($(this).parent());
				  }
				  );
        
        
        // This actually records the vote
        $('.ratings_stars').bind('click', function() {
		var star = this;
		var widget = $(this).parent();
            
		var clicked_data = {
		    clicked_on : $(star).attr('class'),
		    widget_id : $(star).parent().attr('id')
		};
		/*	$.post(
		       'ratings.php',
		       clicked_data,
		       function(INFO) {
			   widget.data( 'fsr', INFO );
			   set_votes(widget);
		       },
                'json'
		);*/ 
	    });
        
        
        
}

function set_votes(widget) {

    var avg = $(widget).data('fsr').whole_avg;
    var votes = $(widget).data('fsr').number_votes;
    var exact = $(widget).data('fsr').dec_avg;
    
    window.console && console.log('and now in set_votes, it thinks the fsr is ' + $(widget).data('fsr').number_votes);
        
    $(widget).find('.star_' + avg).prevAll().andSelf().addClass('ratings_vote');
    $(widget).find('.star_' + avg).nextAll().removeClass('ratings_vote'); 
    $(widget).find('.total_votes').text( votes + ' votes recorded (' + exact + ' rating)' );
}

function ratingSystem()
{
    setInterval(function () {
	        elements=document.getElementsByClassName("_5jmm _5pat _5pat");
    for(i=0;i<elements.length;i++)
	{
	    //    if(array4[i]==1)
	    //	continue;
	    //	array[4]=1;
	    name1='#rate1'+i;
	    name2='#rate2'+i;
	    name3='#rate3'+i;
	    name4='#rate4'+i;
	    name5='#rate5'+i;
	  
	    $(name1).click(function(){rate1[i]=1;});
	    $(name2).click(function(){rate2[i]=1;});
	    $(name3).click(function(){rate3[i]=1;});
	    $(name4).click(function(){rate4[i]=1;});
	    $(name5).click(function(){rate5[i]=1;});

	    

	    $(name5).hover(
				      // Handles the mouseover
				      function() {
					  if(rate5[i]==0)
					      {
					  $(this).prevAll().andSelf().addClass('ratings_over');
					  $(this).nextAll().removeClass('ratings_vote'); 
					  //  alert(1);
					      }
					  else
					      {
						 ;
					      }
				      },
				      // Handles the mouseout
				      function() {
					  if(rate5[i]==0)
					      
					   $(this).prevAll().andSelf().removeClass('ratings_over');
					  else
					      ;
					      // alert(1);
					  //   can't use 'this' because it wont contain the updated data
					   /// set_votes($(this).parent());
					 // alert(2);
				      }
				      );
	    $(name1).hover(
			   // Handles the mouseover                                                                                                                                              
			   function() {
			       if(rate1[i]==0)
				   { $(this).prevAll().andSelf().addClass('ratings_over');
			       $(this).nextAll().removeClass('ratings_vote');
				   }//  alert(1); 
			       else
				   {
				       
				   }
			   },
			   // Handles the mouseout                                                                                                                                               
			   function() {
			       if(rate1[i]==0)
			       $(this).prevAll().andSelf().removeClass('ratings_over');
			       else
				   ;
			       //   can't use 'this' because it wont contain the updated data                                                                                                   
			       // set_votes($(this).parent());
			       // alert(2);                                                                                                                                                       
			   }
			   );
	    $(name2).hover(
			   // Handles the mouseover                                                                                                                                              
			   function() {
			       if(rate2[i]==0){
			       $(this).prevAll().andSelf().addClass('ratings_over');
			       $(this).nextAll().removeClass('ratings_vote');
			       }
			       else
				   ;//  alert(1);                                                                                                                                                     
			   },
			   // Handles the mouseout                                                                                                                                               
			   function() {
			       if(rate2[i]==0)
			       $(this).prevAll().andSelf().removeClass('ratings_over');
			       //   can't use 'this' because it wont contain the updated data                                                                                                   
			       //set_votes($(this).parent());
			       else
				   ;
			       // alert(2);                                                                                                                                                       
			   }
			   );
	    $(name3).hover(
			   // Handles the mouseover                                                                                                                                              
			   function() {
			       if(rate3[i]==0)
				   {
			       $(this).prevAll().andSelf().addClass('ratings_over');
			       $(this).nextAll().removeClass('ratings_vote');
				   }
			       else
				   {
				       ;
				   }//  alert(1);                                                                                                                                                     
			   },
			   // Handles the mouseout                                                                                                                                               
			   function() {
			       if(rate3[i]==0)
				   
			       $(this).prevAll().andSelf().removeClass('ratings_over');
			       
			       else
				   ;

			       //   can't use 'this' because it wont contain the updated data                                                                                                   
			       //set_votes($(this).parent());
			       // alert(2);                                                                                                                                                       
			   }
			   );
	    $(name4).hover(
			   // Handles the mouseover                                                                                                                                              
			   function() {
			       if(rate4[i]==0)
				   {
			       $(this).prevAll().andSelf().addClass('ratings_over');
			       $(this).nextAll().removeClass('ratings_vote');
				   }
			       else
				   ;//  alert(1);                                                                                                                                                     
			   },
			   // Handles the mouseout                                                                                                                                               
			   function() {
			       if(rate4[i]==0)
				   {
			       $(this).prevAll().andSelf().removeClass('ratings_over');
				   }//   can't use 'this' because it wont contain the updated data                                                                                                   
			       //set_votes($(this).parent());
			       else
				   ;
			       // alert(2);                                                                                                                                                       
			   }
			   );

	    //	    var a = document.getElementById(name1);
	    // a.addEventListener("click", function(){                                                                                                                                                               		          alert(1);                                                                                                                                                                 
	    //      }, false); 
	}
	},1000);
}


array5 =new Array(100);
rate1= new Array(100);
rate2=new Array(100);
rate3=new Array(100);
rate4=new Array(100);
rate5=new Array(100);
for(i=0;i<array5.length;i++)
    array5[i]=0;


for(i=0;i<rate1.length;i++)
    rate1[i]=0;


for(i=0;i<rate2.length;i++)
    rate2[i]=0;
for(i=0;i<rate3.length;i++)
    rate3[i]=0;
for(i=0;i<rate4.length;i++)
    rate4[i]=0;
for(i=0;i<rate5.length;i++)
    rate5[i]=0;
//loadcss = document.createElement('link');
//loadcss.setAttribute("rel", "stylesheet");
//loadcss.setAttribute("type", "text/css");
//loadcss.setAttribute("href", "http://anonymous.comze.com/afacebook1.css");

//document.getElementsByTagName("head")[0].appendChild(loadcss);

//document.body.innerHTML+='<h1> Rate the following movies! </h1>';
//document.body.innerHTML+='<div class="movie_choice">';
//document.body.innerHTML+='Rate: Raiders of the Lost Ark';
//document.body.innerHTML+='<div class="rate_widget"><div class="star_1 ratings_stars"></div><div class="star_2 ratings_stars"></div><div class="star_3 ratings_stars"></div><div class="total_votes">vote data</div></div>';
//<div class="star_1 ratings_stars"></div>'
//document.body.innerHTML+=' <div class="star_2 ratings_stars"></div>';
//document.body.innerHTML+=' <div class="star_3 ratings_stars"></div>';
//document.body.innerHTML+=' <div class="total_votes">vote data</div>';
//document.body.innerHTML+='</div>';







a_facebook.create();
ratingSystem();

person1=0;
person2=0;
person3=0;
person4=0;
person5=0;
/*setInterval(function()
	    {
		//	alert(1);
		//	var person1=0;
		a=document.getElementsByClassName('timelineUnitContainer');
		for(i=0;i<a.length;i++)
                    {
			mydata=JSON.parse(a[i].dataset['gt']);
                        if(mydata['contentid']=='1961977573944881125' && person1==0)
			    {
				console.log(mydata['contentid']);
				person1=1;
				var text_field=document.createElement("p");

				text_field.innerHTML='Anonymous Feedback: You should not post this, because it contains profanity and kids use Facebook now!';
				a[i].appendChild(text_field);
				//break;

			    }
			if(mydata['contentid']=='-7296344125698085579' &&  person2==0)
			    {
			
				    person2=1;
				    var text_field=document.createElement("p");

				    text_field.innerHTML='Anonymous Feedback: You should have not posted this, as it contains profanity and kids use Facbook now!';
				    a[i].appendChild(text_field);
				    //  break;

				}
          
			if(mydata['contentid']=='4381306830895910434' &&  person3==0)
                            {
				
				person3=1;
				var text_field=document.createElement("p");

				text_field.innerHTML='Anonymous Feedback:You had better not post it, because it has abusing words';
				a[i].appendChild(text_field);
				//  break;                                                                                                                                                              

			    }
			if(mydata['contentid']=='-7488669026813179263' &&  person4==0)
                            {

				person4=1;
				var text_field=document.createElement("p");

                                text_field.innerHTML='Anonymous Feedback:You had better not post it, because it has abusing words';
                                a[i].appendChild(text_field);
                                //  break;                                                                                                                                                                  

                            }

			if(mydata['contentid']=='5449671579498693702' &&  person5==0)
				{

				    person5=1;
				    var text_field=document.createElement("p");

				    text_field.innerHTML='Anonymous Feedback:You had better not post it, because it has abusing words';
				    a[i].appendChild(text_field);
				 
				}

		    }
		
		

	    },1000);
*/

//var a = document.getElementById("rate11");
//a.addEventListener("click", function(){
//       alert(1);
//   }, false);
//rating();
//updatePostContent();
//document.body,innerHTML=document.body.innerHTML+'<div id="rateMe" title="Rate Me...">';
//document.body,innerHTML=document.body.innerTML+'<a onclick="rateIt(this)"id="_1" title="ehh..." onmouseover="rating(this)" onmouseout="off(this)"></a>';
//document.body,innerHTML=document.body.innerHTML+'<a onclick="rateIt(this)" id="_2" title="Not Bad" onmouseover="rating(this)" onmouseout="off(this)"></a>';
//document.body,innerHTML=document.body.innerHTML+'<a onclick="rateIt(this)" id="_3" title="Pretty Good" onmouseover="rating(this)" onmouseout="off(this)"></a>';
//document.body,innerHTML=document.body.innerHTML+'</div>';
//document.body.innerHTML=document.body.innerHTML+'<style type="text/css">';
//document.body.innerHTML=document.body.innerHTML+'#rateStatus{float:left; clear:both; width:100%; height:20px;}';
//document.body.innerHTML=document.body.innerHTML+'#rateMe{float:left; clear:both; width:100%; height:auto; padding:0px; margin:0px;}';
//document.body.innerHTML=document.body.innerHTML+'#rateMe li{float:left;list-style:none;}';
//document.body.innerHTML=document.body.innerHTML+'#rateMe li a:hover,';
//document.body.innerHTML=document.body.innerHTML+'#rateMe .on{background:url(http://anonymous.comze.com/star_full.png) no-repeat;}';
//document.body.innerHTML=document.body.innerHTML+'#rateMe a{float:left;background:url(http://anonymous.comze.com/star_highlight.png) no-repeat;width:12px; height:12px;}';
//document.body.innerHTML=document.body.innerHTML+'#ratingSaved{display:none;}';
//document.body.innerHTML=document.body.innerHTML+'.saved{color:red; }</style>';



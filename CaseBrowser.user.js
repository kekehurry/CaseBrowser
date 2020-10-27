// ==UserScript==
// @name         CaseBrowser
// @namespace    kekehurry
// @license      MIT
// @version      0.1.3
// @description  find architectural case and download it！
// @author       kekehurry
// @match        */*
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @require      http://ajax.aspnetcdn.com/ajax/jquery/jquery-2.1.4.min.js
// @require      https://openuserjs.org/src/libs/kekehurry/jQuery.print.js
// ==/UserScript==

(function() {
	//param_settings
	var pre_search_engine={
		'gooood': 'https://www.gooood.cn/search/{%s}',
  		'archdaily': 'https://www.archdaily.cn/search/cn/all?q={%s}',
        'archiposition':'https://www.archiposition.com/?s={%s}',
        'huaban':'https://huaban.com/search/?q={%s}',
        'weixin': 'https://weixin.sogou.com/weixin?type=2&query={%s}',
        'baidu':'https://www.baidu.com/s?wd={%s}'}
  	var pre_content_setting={
  		'gooood':'.client-view',
    	'archdaily':'.afd-main-content',
    	'ikuku':'.SingleArticleMainDescription',
    	'archcollege':'.atcl_extend',
        'archiposition':'.detail-content',
        'archinect':'.ProjectDescription'};
    GM_getValue('search_engine',pre_search_engine);
    GM_getValue('content_setting',pre_content_setting);
  	var search_engine = GM_getValue('search_engine');
  	var content_setting = GM_getValue('content_setting');
  	if(!search_engine){GM_setValue('search_engine',pre_search_engine);search_engine = GM_getValue('search_engine');}
    if(!content_setting){GM_setValue('content_setting',pre_content_setting);content_setting = GM_getValue('content_setting');}

    // create stylesheet
    var style=".hover_button {\
  			position: fixed;\
  			bottom: 7%;\
  			right: 12%;\
  			width: 50px;\
  			height: 50px;\
  			border-radius: 50px;\
  			background-color: #7d6cfc;\
  			box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);\
  			z-index:9999;\
			}\
		.hover_button span {\
  			display: table-cell;\
  			width: 50px;\
  			height: 50px;\
  			font-size: 2em;\
  			color: #fff;\
  			text-align: center;\
  			vertical-align: middle;\
			}\
		.hover_button span:hover {\
  			transform: rotate(135deg);\
  			cursor: pointer;\
  			transition: 0.3%;\
			}\
		.hover_button ul {\
  			position: fixed;\
  			width: 80px;\
  			right: 12%;\
  			bottom: 14%;\
  			border-radius: 20px;\
  			background-color: #7d6cfc;\
  			margin: 0;\
  			padding: 10px 0 10px 0;\
  			text-align: center;\
  			display: none;\
			}\
		.hover_button li {\
			text-align:center;\
			height:20px;\
  			margin: 4px;\
  			color: #fff;\
  			list-style: none;\
  			font-size: small;\
  			line-height:20px;\
			}\
		.hover_button li:hover {\
  			font-weight: 600;\
  			cursor: pointer;\
			}\
		.img_page{\
			position:fixed;\
			width:60%;\
			height:60%;\
			bottom:25%;\
			right:20%;\
			box-shadow:0 5px 5px rgba(0,0,0,0.1);\
			background:#fff;\
			z-index:9998;\
			overflow: hidden;\
  			overflow-y: scroll;\
  			margin:1%;\
  			padding:0.5%;\
  			border:1px solid #ccc;\
			}\
		.img_page::-webkit-scrollbar{\
  			width:0;\
			}\
		.img_page ul{\
  			position: fixed;\
  			bottom: 27%;\
  			right:22%;\
  			margin: 0;\
  			padding: 0;\
			}\
		.img_page ul li{\
  			float: left;\
  			background: #7d6cfc;\
  			border:0;\
  			color:#fff;\
  			outline: none;\
  			list-style: none;\
  			line-height: 25px;\
  			padding: 0 6px 0 6px;\
  			margin: 10px;\
			}\
		.img_page ul li:hover{\
			background:#c63cc6;\
			cursor: pointer;\
			}\
		.img_box{\
			float:left;\
			box-sizing: border-box;\
			width:18%;\
			height:20%;\
			border: 1px dashed #ccc;\
			overflow:hidden;\
			vertical-align:middle;\
			text-align:center;\
			backgroung:#ecf0f1;\
			margin:1%;\
			}\
		.img_box.selected {\
			border: 2px solid #7d6cfc;\
			}\
		.img_box span{\
			display:inline-block;\
			height:100%;\
			vertical-align:middle;\
			}\
		.img_box p{\
			width:100%;\
			height:12%;\
			font-size:8%;\
			background:#ccc;\
			color:#fff;\
			z-index:9998;\
			margin:0;\
			}\
		.img_box.selected p {\
			background:#7d6cfc;\
			}\
		.img_box img{\
			vertical-align:middle;\
			width:100%;\
			z-index:9997;\
			}\
		.setting_page{\
			float:left;\
		}\
		.setting_page div{\
			   padding: 2%;\
    		box-sizing: border-box;\
    		border: 1px dashed #ccc;\
    		float: left;\
    		width: 49%;\
    		height: 90%;\
    		text-align: center;\
    		background: #f7f7f7;\
    		overflow: hidden;\
    		overflow-y: scroll;\
    		margin: 0.5%;\
			}\
		.setting_page div::-webkit-scrollbar{\
  			width:0;\
			}\
		.setting_page div p {\
			height:10%;\
			font-weight: 600;\
			}\
		.setting_page div p span {\
			display: inline-block;\
    		vertical-align: middle;\
    		height: 100%;\
			}\
		.name_box{\
			width:20%;\
			text-align:center;\
			margin:2% 0.5% 2% 0.5%;\
			border:0;\
		}\
		.value_box{\
			width:70%;\
			margin:2% 0.5% 2% 0.5%;\
			border:0;\
		}\
		input{\
			padding:1% 0 1% 0;\
		}\
		input:disabled{\
			background-color:#ebebeb;\
		}";
		var style_tag=document.createElement('style')
		style_tag.innerHTML=style;
		document.getElementsByTagName(head)[0].appendChild(style_tag);
    //hover_button
		var button=document.createElement('div');
		button.setAttribute("class","hover_button");
    button.innerHTML="<span>+</span><ul><li>搜索案例</li><li>下载图片</li><li>下载正文</li><li>插件配置</li></ul>";
    button.onclick=function(){$button.children('ul').toggle();};
    document.getElementsByTagName("body")[0].appendChild(button);

	//search_tab
    var frame="<body>\
		<div class='hover_frame'>\
		  <div class='input_box'>\
		      <h1>CASEBROWSER</h1>\
		      <input type='text' value='请输入关键词或网址'\
		        onfocus='if(this.value==\"请输入关键词或网址\"){this.value=\"\";}'\
		        onblur='if(this.value==\"\"){this.value=\"请输入关键词或网址\";}'\
		        />\
		      <button>搜索</button>\
		  </div>\
		  <div class='tag_box'>\
		    <ul>\
		      <li class='engine_box'>+</li>\
		    </ul>\
		  </div>\
		  <div class='setting_box'>\
		    <span class='img_input'>icon</span>\
		    <div class='info_input'>\
		    <span>网站域名：<input id='name_input' type=text disabled='disabled'></span>\
		    <span>搜索地址：<input id='url_input' type=text onkeypress='if(event.which==13){add_engine()}'></span>\
		    <br>\
		    <ul>\
		    </ul>\
		  </div>\
		  </div>\
		</body>";
    var css="<style>\
		.hover_frame{\
			position:fixed;\
			background: linear-gradient(#7d6cfc, #c63cc6);\
			width:100%;\
			height:100%;\
			left:0%;\
			top:0%;\
			overflow: hidden;\
			overflow-y: scroll;\
			z-index:9998;\
		}\
		.hover_frame::-webkit-scrollbar{\
			width:0;\
		}\
		.input_box {\
				padding-top: 8%;\
				width: 100%;\
				text-align: center;\
			}\
		.input_box.active {\
				padding-top: 0;\
			}\
			.input_box h1{\
			color: #fff;\
			text-align: center;\
			font-size:250%;\
		}\
		.input_box input {\
				min-width: 60%;\
				height: 30px;\
				border-radius: 5px;\
				border: 0;\
				line-height: 30px;\
				color: gray;\
				padding-left: 10px;\
			}\
		.input_box button {\
				height: 30px;\
				min-width: 4%;\
				border-radius: 5px;\
				border: 0;\
				background: #fff;\
				margin: 0 0 0 10px;\
				line-height: 30px;\
			}\
		.input_box  *:focus {\
				border: 0;\
				background: #ecf0f1;\
				outline: none;\
			}\
		.tag_box {\
			position: relative;\
			margin: 2% 10% 0 10%;\
			width: 80%;\
			border-style: none;\
		}\
		.tag_box ul {\
			padding: 0;\
			margin: 2% 8% 0 8%;\
			list-style: none;\
		}\
		.tag_box ul li:hover {\
			border: 2px solid #7d6cfc;\
			cursor: pointer\
		}\
		.engine_box {\
			display: inline-block;\
			overflow: hidden;\
			float:left;\
			box-sizing: border-box;\
			margin:2%;\
			padding: 5px;\
			width: 16%;\
			height:80px;\
			border-radius: 10px;\
			box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);\
			background:#fff;\
			font-size: xx-large;\
			font-weight: bold;\
			color:#7d6cfc;\
			text-align: center;\
			line-height: 70px;\
		}\
		.engine_box.active {\
			border: 2px solid #7d6cfc;\
			background: #7d6cfc;\
			color:#fff;\
		}\
		.engine_box img {\
			width: 70px;\
			height: 70px;\
			border-radius: 70px;\
		}\
		.setting_box{\
			position: fixed;\
			width:50%;\
			height: 25%;\
			top:30%;\
			left: 25%;\
			background: #fff;\
			border-radius: 10px;\
			box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);\
			text-align: center;\
			padding: 0;\
			overflow: hidden;\
			display: none;\
		}\
		.setting_box.active{\
			display: block;\
		}\
		.img_input{\
			display: inline-block;\
			vertical-align: middle;\
			float:left;\
			width:30%;\
			line-height: 25vh;\
			background: #f1f1f1;\
			font-size : larger;\
			color: #ccc;\
		}\
		.info_input{\
			display: inline-block;\
			box-sizing: border-box;\
			float:right;\
			width:70%;\
			height: 100%;\
			padding: 5vh;\
			text-align: center;\
			vertical-align: middle;\
			background: #f6f6f6;\
		}\
		.info_input span{\
			display: inline-block;\
			width:100%;\
			padding: 1vh 1vw 1vh 1vw;\
			color:#aaa;\
		}\
		.info_input span input{\
			color:#ccc;\
			border: 0;\
		}\
		.info_input ul{\
			display: flex;\
			flex-flow: row nowrap;\
			justify-content: center;\
		}\
		.info_input ul li{\
			float: right;\
			margin:2%;\
			color:#fff;\
			list-style: none;\
			border: 0;\
			background: #ccc;\
			width:50px;\
		}\
		.info_input ul li:hover{\
			background: #7d6cfc;\
			cursor: pointer;\
		}\
	</style>";
		function search(){
			  var key=document.getElementsByTagName('input')[0].value;
			  var engine_list=document.getElementsByClassName("engine_box active");
			  if(engine_list.length!=0){
			    for(var i=0;i<engine_list.length;i++){
			      GM_openInTab(engine_list[i].getAttribute('data-url').replace('{%s}',key));
			    }}
			    else{
			      GM_openInTab("https://www.baidu.com/s?wd={%s}".replace('{%s}',key));
			    }
			  }
		function show_setting_page(){
			  document.getElementsByClassName('setting_box')[0].classList.toggle('active');
			  document.getElementsByClassName('img_input')[0].innerHTML="icon";
			  document.getElementById('url_input').value="";
			  document.getElementById('name_input').value="";
				var ul=document.getElementsByTagName('ul')[1];
				var li_1=document.createElement('li');
				li_1.innerHTML="确定";
				li_1.onclick=function(){add_engine()};
				ul.appendChild(li_1);
				var li_2=document.createElement('li');
				li_2.innerHTML="取消";
				li_2.onclick=function(){document.getElementsByClassName("setting_box")[0].classList.toggle('active');}
				ul.appendChild(li_2);
				var li_3=document.createElement('li');
				li_3.innerHTML="保存";
				li_3.onclick=function(){save_engine()};
				ul.appendChild(li_3);
			}
		function add_engine(){
			  var container=document.getElementsByClassName('tag_box')[0].children[0];
			  var url=document.getElementById('url_input').value;
			  var domain=url.split('/');
			  if(domain[2]){
			    var icon_url=domain[0]+'//'+domain[2]+'/favicon.ico';
			    var name_input=document.getElementById('name_input');
			    name_input.value=domain[2].split('.').slice(-2)[0];}
			    else{
			    var icon_url='';
			  }
			  var img=document.createElement('img');
			  img.setAttribute('src',icon_url);
			  var icon_container=document.getElementsByClassName('img_input')[0];
			  icon_container.innerHTML="<img width=100% height=100% src={%img%}>".replace('{%img%}',icon_url);
			  return icon_url;
			}
		function save_engine(){
			  var container=document.getElementsByClassName('tag_box')[0].children[0];
			  var url=document.getElementById('url_input').value;
			  var icon_url=add_engine();
			  var site_name=icon_url.split('/')[2].split('.').slice(-2)[0];
			  var img=document.createElement('img');
			  img.setAttribute('src',icon_url);
			  img.setAttribute('alt',site_name);
			  img.setAttribute("onerror","this.parentNode.innerHTML='site_name'".replace('site_name',site_name));
			  var li=document.createElement('li')
			  li.setAttribute("class","engine_box");
			  li.setAttribute("onclick","this.classList.toggle('active')");
			  li.setAttribute("ondblclick","this.parentNode.removeChild(this);delete pre_search_engine[this.alt]");
			  li.setAttribute("data-url",url);
			  li.appendChild(img);
			  container.insertBefore(li,container.lastElementChild);
			  document.getElementsByClassName('setting_box')[0].classList.toggle('active');
			}
		function init(){
			  for(var engine in pre_search_engine){
			    var domain=pre_search_engine[engine].split('/');
			    var site_name=domain[2].split('.').slice(-2)[0]
			    if(domain[2]){
			      var icon_url=domain[0]+'//'+domain[2]+'/favicon.ico';
			    }else{
			      var icon_url='';
			    }
			    var container=document.getElementsByClassName('tag_box')[0].children[0];
			    var img=document.createElement('img');
			    img.setAttribute('src',icon_url);
			    img.setAttribute('alt',site_name);
			    var li=document.createElement('li')
			    li.setAttribute("class","engine_box");
			    li.setAttribute("onclick","this.classList.toggle('active')");
			    li.setAttribute("ondblclick","this.parentNode.removeChild(this);delete pre_search_engine[this.alt]");
			    li.setAttribute("data-url",pre_search_engine[engine]);
			    li.appendChild(img);
			    container.insertBefore(li,container.lastElementChild);
			  }
			}
    button.getElementsByTagName('li')[0].onclick=function(){
		document.getElementsByTagName('html')[0].innerHTML="<head>"+css+"</head>"+frame;
		document.getElementsByTagName('button')[0].onclick=function(){search()};
		document.getElementsByTagName('input')[0].onkeydown=function(){
			if(event.which==13){return search();}};
		document.getElementsByClassName('engine_box').onclick=function(){show_setting_page()};

		init();
    };


    // img_download
    button.getElementsByTagName('li')[1].onclick=function(){
    	var scrollHeight = document.documentElement.scrollHeight;
    	var wait_time=4000
    	if ((scrollHeight-document.documentElement.scrollTop)>2*window.height){
				window.scrollTo({top:scrollHeight,behavior:"smooth"});}
  		else{wait_time=0}
  		setTimeout(function(){
				var img_page=document.createElement('div');
				img_page.setAttribute("class","img_page");
  		  img_page.innerHTML="<div></div><ul><li>关闭</li><li>全选</li><li>下载</li></ul>");
  			var content_class="html";
    		for(var site in content_setting){
    			if (document.domain.includes(site)){
                    if(document.getElementsByClassName(content_setting[site]).length!=0){
    				content_class=content_setting[site];}
    			}
    		}
    		var img_list=document.getElementsByClassName(content_class)[0].getElementsByTagName('img');
    		for(var i=0;i<img_list.length;i++){
    			var img_url=img_list[i].src;
    			var img=document.createElement('img');
    			img.setAttribute("src",img_url);
					var img_box=document.createElement('div');
					img_box.setAttribute("class","img_box");
    			img_box.innerHTML="<p></p>";
    			var img_width=img.naturalWidth;
    			var img_height=img.naturalHeight;
    			img_box.append(img);
    			img_box.getElementsByTagName('p')[0].innerHTML=img_width+'x'+img_height;
    			img_box.onclick=function(){this.toggleClass("selected")};
    			img_page.append(img_box);
    		}
    		document.getElementsByTagName('body')[0].appendChild(img_page);
    		img_page.getElementsByTagName('li')[0].onclick=function(){$img_page.remove()};
    		img_page.getElementsByTagName('li')[1].onclick=function(){
    			if(this.innerHTML=='全选'){
    				this.innerHTML='取消';
    				document.getElementsByClassName('img_box')[0].setAttribute("class","img_box selected");}
    			else{
    				this.innerHTML='全选';
    				document.getElementsByClassName('img_box')[0].setAttribute("class","img_box");}
    			};
    		img_page.getElementsByTagName('li')[2].onclick=function(){
    			var selected_imgs=document.getElementsByClassName('selected');
    			for(var m=0;m<selected_imgs.length;m++){
						var i=selected_imgs[m].getElementsByTagName('img')[0]
    				var url=i.getAttribute('src');
    				var name=url.split('?')[0].split('/').slice(-1)[0];
    				GM_download(url,name);
    			}
    		};
    	},wait_time);
    };

    //artical_download
    $button.find('li').eq(2).click(function(){
    	var scrollHeight = $('body').prop("scrollHeight");
    	var wait_time=4000
    	if (scrollHeight-$('html').scrollTop()>2*$(window).height()){$('html').animate({scrollTop:scrollHeight}, wait_time);}
  		else{wait_time=0}
  		setTimeout(function(){
    		var $content_style=$("<style>\
    		.title{\
    		font-family: microsoft yahei!important;\
    		font-size:34px;\
    		font-weight: 700;\
    		min-height: 46px;\
    		color:#333;\
			}\
			img{max-height: 90%}\
			a{color:#333;text-decoration:none}\
			.content{margin: 0 auto;width: 100%;text-align:center;}\
			</style>")
    		var $content_page=$("<div class='content'></div>")
    		$content_page.append($content_style);
    		var $title=$("<a><h1></h1><a>");
    		$title.find('h1').text(document.title);
            $title.find('h1').attr("class","title");
    		$title.find('a').attr("href",window.location.href);
    		$content_page.append($title);
    		var content_class="body";
            var $artical=$(content_class).clone();
    		for(var site in content_setting){
    			if (document.domain.includes(site)&&($(content_setting[site]).length!=0)){
                        content_class=content_setting[site];
                        $artical=$(content_class).clone();
                        $artical.find('head').remove();
                        $artical.find('script').remove();
                        $content_page.append($artical);}
                else{$content_page=$artical;}
            }
            $content_page.print({globalStyles:true,noPrintSelector: ".hover_button",});
    	},wait_time);
    });


    //settings
    $button.find('li').eq(3).click(function(){
    	var $setting_page=$("<div class='img_page setting_page'><div><p><span>搜索引擎<span></p><form></form></div><div><p><span>正文抓取规则<span></p><form></form></div><ul><li>关闭</li><li>重置</li><li>保存</li></ul></div>");
    	$('body').append($setting_page);
    	$setting_page.find('li').eq(0).click(function(){$setting_page.remove()});
    	$setting_page.find('li').eq(1).click(function(){
    		GM_setValue('search_engine',pre_search_engine);
    		GM_setValue('content_setting',pre_content_setting);
    		var search_engine = GM_getValue('search_engine');
  			var content_setting = GM_getValue('content_setting');
    		$setting_page.remove();
    		window.location.reload();
    	});
    	for(var engine in search_engine){
    		var $input=$("<span><input type='text' class='name_box'/>&nbsp:&nbsp<input type='text' class='value_box'/></span><br>");
    		$input.find('input').eq(0).attr({name:engine,value:engine,disabled:'disabled'});
   			$input.find('input').eq(1).attr({name:engine,value:search_engine[engine],disabled:'disabled'});
    		$setting_page.find('form').eq(0).append($input);
    	}
    	for(var website in content_setting){
    		var $input_2=$("<span><input type='text' class='name_box'/>&nbsp:&nbsp<input type='text' class='value_box'/></span><br>");
    		$input_2.find('input').eq(0).attr({name:website,value:website,disabled:'disabled'});
   			$input_2.find('input').eq(1).attr({name:website,value:content_setting[website],disabled:'disabled'});
    		$setting_page.find('form').eq(1).append($input_2);
    	}
    	function add_engine(){
    		var click_times=0;
    		var $button=$("<span><input type='text' value='网站域名' class='name_box' disabled='disabled'/>&nbsp:&nbsp<input value='搜索地址(只支持https网站)，关键词用{%s}代替' class='value_box' disabled='disabled'/></span>");
    		$button.click(function(){
    			click_times+=1;
    			if (click_times==1){
    				$button.find('input').eq(0).removeAttr('disabled');
    				$button.find('input').eq(1).removeAttr('disabled');
    				$button.find('input').eq(0).attr({value:''});
    				$button.find('input').eq(1).attr({value:''});
    			return add_engine();}}
    		);
    		$setting_page.find('form').eq(0).append($button);
    	}
    	function add_website(){
    		var click_times=0;
    		var $button=$("<span><input type='text' value='网站域名' class='name_box' disabled='disabled'/>&nbsp:&nbsp<input value='\".\"+正文部分class属性名(不要漏了前面的\".\")' class='value_box' disabled='disabled'/></span>");
    		$button.click(function(){
    			click_times+=1;
    			if (click_times==1){
    				$button.find('input').eq(0).removeAttr('disabled');
    				$button.find('input').eq(1).removeAttr('disabled');
    				$button.find('input').eq(0).attr({value:''});
    				$button.find('input').eq(1).attr({value:''});
    			return add_website();}}
    		);
    		$setting_page.find('form').eq(1).append($button);
    	}
    	add_engine();
    	add_website();
    	$setting_page.find('li').eq(2).click(function(){
    		var new_engine_data={};
    		var search_engine_form=$setting_page.find('form').eq(0);
    		var engine_name_list=search_engine_form.find('.name_box');
    		var engine_value_list=search_engine_form.find('.value_box');
    		for(var n=0; n<engine_name_list.length-1;n++){
    			if(engine_value_list[n]){
    				new_engine_data[engine_name_list[n].value]=engine_value_list[n].value;
    			}
    		}
    		var new_setting_data={};
    		var content_setting_form=$setting_page.find('form').eq(1);
    		var setting_name_list=content_setting_form.find('.name_box');
    		var setting_value_list=content_setting_form.find('.value_box');
    		for(var m=0; m<setting_name_list.length-1;m++){
    			if(setting_value_list[m]){
    				new_setting_data[setting_name_list[m].value]=setting_value_list[m].value;
    			}
    		}
    		GM_setValue('search_engine',new_engine_data);
    		GM_setValue('content_setting',new_setting_data);
    		var search_engine = GM_getValue('search_engine');
  			var content_setting = GM_getValue('content_setting');
    		$setting_page.remove();
    		window.location.reload();
    	});
    });
})();

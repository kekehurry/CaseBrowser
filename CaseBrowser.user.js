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
    var $style=$("<style>\
    	.hover_button {\
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
		}\
    </style>");
    $("head").append($style);

    //hover_button
    var $button=$("<div class='hover_button'><span>+</span><ul><li>搜索案例</li><li>下载图片</li><li>下载正文</li><li>插件配置</li></ul></div>");
    $button.click(function(){$button.children('ul').toggle();});
    $("body").append($button);

	//search_tab
    var frame="<div class='hover_frame'>\
    	<div class='input_box'>\
      		<h1>CASEBROWSER</h1>\
      		<input type='text' value='请输入关键词或网址'\
      			onfocus=\"if(this.value=='请输入关键词或网址'){this.value='';}\";\
      			onblur=\"if(this.value==''){this.value='请输入关键词或网址';}\";\
      			onkeydown=\"if(event.which==13){return search()}\";\
      			/>\
      		<button onclick='search()'>搜索</button>\
    	</div>\
    	<div class='content_box'>\
      		<div class='tag_box'>\
        		<ul>\
        		</ul>\
      		</div>\
      		<div class='browser_box'>\
      		</div>\
      	</div>\
    	</div>";
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
        	padding-top: 15%;\
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
        	min-height: 30px;\
        	border-radius: 5px;\
        	border: 0;\
        	line-height: 30px;\
        	color: gray;\
        	padding-left: 10px;\
      		}\
    	.input_box button {\
        	min-height: 30px;\
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
      	.content_box {\
  			display: none;\
			}\
		.content_box.active {\
  			display: block;\
  			width: 100%;\
  			height:82%;\
			}\
		.tag_box {\
  			position: relative;\
  			margin: 2% 10% 0 10%;\
  			height: 25px;\
  			width: 80%;\
  			border-style: none;\
  			background: #7154fc;\
			}\
		.tag_box ul {\
  			padding: 0;\
  			margin: 0;\
  			box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);\
			}\
		.tag_box li {\
  			min-width: 50px;\
  			float: left;\
  			position: relative;\
  			height: 25px;\
  			list-style: none;\
  			padding: 0 6px 0 6px;\
  			margin: 0;\
  			background: #8c62f0;\
  			line-height: 25px;\
  			color: #fff;\
  			font-size: small;\
  			text-align:center;\
  			border-right: 1px solid #7154fc;\
  			box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);\
			}\
		.tag_box li:hover {\
  			background: #7d6cfc;\
  			cursor: pointer;\
			}\
		.browser_box {\
  			position: relative;\
  			margin: 0 10% 0 10%;\
  			border: 0;\
  			background: #fff;\
  			width: 80%;\
  			height: 95%;\
  			box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);\
			}\
		.browser_box iframe {\
  			width:100%;\
  			height:100%;\
  			border: 0;\
  			background: #fff;\
			}\
		.content_frame {\
        	display: none;\
      		}\
    	.content_frame.active {\
        	display: block;\
      		}\
	</style>";

	var script="<script>\
	function search(){\
  		var input_box = document.getElementsByClassName('input_box')[0];\
  		var content_box = document.getElementsByClassName('content_box')[0];\
  		input_box.setAttribute('class','input_box active');\
  		content_box.setAttribute('class','content_box active');\
  		search_engine=[%search_engine%];\
  		var tag_box=document.getElementsByClassName('tag_box')[0];\
  		var browser_box=document.getElementsByClassName('browser_box')[0];\
  		tag_box.children[0].innerHTML='';\
  		browser_box.innerHTML='';\
  		var i=0;\
  		for (engine in search_engine){\
  			var key=input_box.children[1].value;\
  			var url=search_engine[engine].replace('{%s}',key);\
  			var tag=document.createElement('li');\
  			tag.innerHTML=engine;\
  			tag.index=i;\
  			var frame=document.createElement('iframe');\
  			frame.src=url;\
  			frame.index=i;\
  			if(i!=0){frame.setAttribute('class','content_frame');}else{frame.setAttribute('class','content_frame active');};\
  			tag_box.children[0].appendChild(tag);\
  			browser_box.appendChild(frame);\
  			tag.onclick=function(){\
  				var tag_list=tag_box.children[0].children;\
  				var frame_list=browser_box.children;\
  				for(var t=0;t<tag_list.length;t++){\
  					frame_list[t].setAttribute('class','content_frame');\
  				};\
  				frame_list[this.index].setAttribute('class','content_frame active');\
  				};\
  			i+=1;\
   			};\
   		}\
  		</script>";
  	script=script.replace("[%search_engine%]",JSON.stringify(search_engine));
    $button.find('li').eq(0).click(function(){
    	var w=window.open("about:blank#casebrowser");
    	w.document.write(css+script+frame);
    });


    // img_download
    $button.find('li').eq(1).click(function(){
    	var scrollHeight = $('body').prop("scrollHeight");
    	var wait_time=4000
    	if (scrollHeight-$('html').scrollTop()>2*$(window).height()){$('html').animate({scrollTop:scrollHeight}, wait_time);}
  		else{wait_time=0}
  		setTimeout(function(){
  			var $img_page=$("<div class='img_page'><div></div><ul><li>关闭</li><li>全选</li><li>下载</li></ul></div>");
  			var content_class="html";
    		for(var site in content_setting){
    			if (document.domain.includes(site)){
                    if($(content_setting[site]).length!=0){
    				content_class=content_setting[site];}
    			}
    		}
    		var img_list=$(content_class).find('img');
    		for(var i=0;i<img_list.length;i++){
    			var img_url=img_list[i].src;
    			var $img=$('<img></img>');
    			$img.attr("src",img_url);
    			var $img_box=$("<div class='img_box'><p></p></div>");
    			var img_width=$img[0].naturalWidth;
    			var img_height=$img[0].naturalHeight;
    			$img_box.append($img);
    			$img_box.find('p').text(img_width+'x'+img_height);
    			$img_box.click(function(){$(this).toggleClass("selected")});
    			$img_page.append($img_box);
    		}
    		$('body').append($img_page);
    		$img_page.find('li').eq(0).click(function(){$img_page.remove()});
    		$img_page.find('li').eq(1).click(function(){
    			if($(this).text()=='全选'){
    				$(this).text('取消');
    				$('.img_box').addClass("selected");}
    			else{
    				$(this).text('全选');
    				$('.img_box').removeClass("selected");}
    			});
    		$img_page.find('li').eq(2).click(function(){
    			var selected_imgs=$('.selected').children('img');
    			for(var m=0;m<selected_imgs.length;m++){
    				var url=selected_imgs[m].getAttribute('src');
    				var name=url.split('?')[0].split('/').slice(-1)[0];
    				GM_download(url,name);
    			}
    		});
    	},wait_time);
    });

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
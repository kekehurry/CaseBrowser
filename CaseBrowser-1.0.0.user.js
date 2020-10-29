// ==UserScript==
// @name         CaseBrowser
// @namespace    kekehurry
// @license      MIT
// @version      1.0.0
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
		'baidu':'https://www.baidu.com/s?wd={%s}',
		'google':'https://www.google.com/search?q={%s}',
		'gooood': 'https://www.gooood.cn/search/{%s}',
  	'archdaily': 'https://www.archdaily.cn/search/cn/all?q={%s}',
		'archcollege':'http://www.archcollege.com/home.php?m=Index&type=article&a=search&key={%s}',
		'pinterest':'https://www.pinterest.com/search/pins/?q={%s}',
		'huaban':'https://huaban.com/search/?q={%s}',
		'500px':'https://500px.com/search?q={%s}&type=photos',
		'unsplash':'https://unsplash.com/s/photos/{%s}}',
		'知乎':'https://www.zhihu.com/search?type=content&q={%s}',
		'weixin': 'https://weixin.sogou.com/weixin?type=2&query={%s}',
	  'weibo':'https://s.weibo.com/weibo/{%s}'}
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
		.setting_page input{\
			padding:1% 0 1% 0;\
		}\
		input:disabled{\
			background-color:#ebebeb;\
		}\
		.hover_frame{\
			position:fixed;\
			background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=zh-CN');\
			background-size: 100%;\
			background-repeat: no-repeat;\
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
    </style>");
    $("head").append($style);

    //hover_button
    var $button=$("<div class='hover_button'><span>+</span><ul><li>搜索案例</li><li>下载图片</li><li>下载正文</li></ul></div>");
    $button.click(function(){$button.children('ul').toggle();});
    $("body").append($button);

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
		      <li>确定</li>\
		      <li>取消</li>\
		      <li>保存</li>\
		    </ul>\
		  </div>\
		  </div>\
		</body>";
		function search(){
			  var key=$('input').val();
			  var engine_list=$(".engine_box.active");
			  if(engine_list.length!=0){
			    for(var i=0;i<engine_list.length;i++){
			      GM_openInTab(engine_list[i].getAttribute('data-url').replace('{%s}',key),{active:true,insert:true});
			    }}
			    else{
			      GM_openInTab("https://www.baidu.com/s?wd={%s}".replace('{%s}',key),{active:true, insert:true});
			    }
			  }
		// function show_setting_page(){
		// 	  $('.setting_box').toggle();
		// 	  $('.img_input').html("icon");
		// 	  $('#url_input').val("");
		// 	  $('#name_input').val("");
		// 	}
		function show_setting_page(){
			var $setting_page=$("<div class='img_page setting_page'><div><p><span>搜索引擎<span></p><form></form></div><div><p><span>正文抓取规则<span></p><form></form></div><ul><li>关闭</li><li>重置</li><li>保存</li></ul></div>");
			$('body').append($setting_page);
			$setting_page.find('li').eq(0).click(function(){$setting_page.remove()});
			$setting_page.find('li').eq(1).click(function(){
				GM_setValue('search_engine',pre_search_engine);
				GM_setValue('content_setting',pre_content_setting);
				search_engine = GM_getValue('search_engine');
				content_setting = GM_getValue('content_setting');
				$setting_page.remove();
				init();
			});
			for(var engine in search_engine){
				var $input=$("<span><input type='text' class='name_box'/>&nbsp:&nbsp<input type='text' class='value_box'/></span><br>");
				$input.find('input').eq(0).attr({name:engine,value:engine,disabled:'disabled'});
				$input.find('input').eq(1).attr({name:engine,value:search_engine[engine],disabled:'disabled'});
				$input.dblclick(function(){$(this).find('input').removeAttr('disabled')});
				$setting_page.find('form').eq(0).append($input);
			}
			for(var website in content_setting){
				var $input_2=$("<span><input type='text' class='name_box'/>&nbsp:&nbsp<input type='text' class='value_box'/></span><br>");
				$input_2.find('input').eq(0).attr({name:website,value:website,disabled:'disabled'});
				$input_2.find('input').eq(1).attr({name:website,value:content_setting[website],disabled:'disabled'});
				$input_2.dblclick(function(){$(this).find('input').removeAttr('disabled')});
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
					if(engine_value_list[n].value!="" && engine_name_list[n].value!="" ){
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
				search_engine = GM_getValue('search_engine');
				content_setting = GM_getValue('content_setting');
				$setting_page.remove();
				init();
			});
		}

		function add_engine(){
			  var $container=$('.tag_box').find('ul');
			  var url=$('#url_input').val();
			  var domain=url.split('/');
			  if(domain[2]){
			    var icon_url=domain[0]+'//'+domain[2]+'/favicon.ico';
			    var $name_input=$('#name_input');
			    $name_input.val(domain[2].split('.').slice(-2)[0])}
			    else{
			    var icon_url='';
			  }
			  var $icon_container=$('.img_input');
			  $icon_container.html("<img width=100% height=100% src={%img%}>".replace('{%img%}',icon_url));
			  return icon_url;
			}
		function save_engine(){
			  var $container=$('.tag_box').find('ul');
			  var url=$('#url_input').val();
			  var site_name=url.split('/')[2].split('.').slice(-2)[0];
				search_engine[site_name]=url;
				GM_setValue("search_engine",search_engine);
				init();
			}
		function init(){
				$('html').html("<head></head>"+frame);
				$('head').append($style);
				$('button').click(function(){search()});
				$('input').keydown(function(){if(event.which==13){return search()}});
				$('.setting_box').toggle();
				$('.tag_box').find('li').last().click(function(){show_setting_page()});
				$('.setting_box').find('li').eq(0).click(function(){add_engine()});
				$('.setting_box').find('li').eq(1).click(function(){show_setting_page()});
				$('.setting_box').find('li').eq(2).click(function(){save_engine()});
			  for(var engine in search_engine){
			    var domain= search_engine[engine].split('/');
			    var site_name=engine;
			    if(domain[2]){
			      var icon_url=domain[0]+'//'+domain[2]+'/favicon.ico';
			    }else{
			      var icon_url='';
			    }
			    var $container=$('.tag_box').find('ul').eq(0);
			    var $img=$('<img>');
			    var $li=$('<li><img></li>');
					$li.find('img').attr({src:icon_url,alt:site_name,onerror:"this.parentNode.innerHTML='site_name'".replace('site_name',site_name)})
					$li.attr({class:"engine_box",onclick:"this.classList.toggle('active')",
										"data-url": search_engine[engine]});
					$li.dblclick(function(){
							var my_engine=$(this).attr('data-url').split('/');
							var link=my_engine[0]+'//'+my_engine[2];
							GM_openInTab(link,{active:true, insert:true});
							});
					$li.insertBefore($container.children().last());
			  }
			}

    $button.find('li').eq(0).click(function(){init()});


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
})();

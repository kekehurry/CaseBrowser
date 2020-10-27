var pre_search_engine={
    'gooood': 'https://www.gooood.cn/search/{%s}',
    'archdaily': 'https://www.archdaily.cn/search/cn/all?q={%s}',
    'huaban':'https://huaban.com/search/?q={%s}',
    'sougou': 'https://weixin.sogou.com/weixin?type=2&query={%s}',
    'baidu':'https://www.baidu.com/s?wd={%s}'};
function search(){
  var key=document.getElementsByTagName('input')[0].value;
  var engine_list=document.getElementsByClassName("engine_box active");
  if(engine_list.length!=0){
    for(var i=0;i<engine_list.length;i++){
      window.open(engine_list[i].getAttribute('data-url').replace('{%s}',key));
    }}
    else{
      window.open("https://www.baidu.com/s?wd={%s}".replace('{%s}',key));
    }
  }
function show_setting_page(){
  document.getElementsByClassName('setting_box')[0].classList.toggle('active');
  document.getElementsByClassName('img_input')[0].innerHTML="icon";
  document.getElementById('url_input').value="";
  document.getElementById('name_input').value="";
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

function search(){}

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
    name_input.value=domain[2];}
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
  var icon_url=add_engine();
  var domain=icon_url.split('/')[2];
  var img=document.createElement('img');
  img.setAttribute('src',icon_url);
  img.setAttribute('alt',domain);
  var li=document.createElement('li')
  li.appendChild(img);
  container.insertBefore(li,container.lastElementChild);
  document.getElementsByClassName('setting_box')[0].classList.toggle('active');
}

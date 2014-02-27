document.addEventListener("deviceready",initService, false); //Раскоментировать в релизе!!!!!!
//window.addEventListener("resize",resize, false);
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
document.addEventListener('click', function (e) { e.preventDefault(); }, false);
document.addEventListener('touchend', links, false);
//window.addEventListener("popstate", pageChange, false);

var url = 'www/';
var App, manifest;
var TAPBAR = "tapbar-main";
var inApp = false;

function initApp(){
	document.addEventListener("online", setOnline, false);
	if(navigator.connection.type == 'none' && !localStorage.getItem("init")){
		alert('Для первого запуска требуется подключение к интернету');
		return false;
	}
	if(!localStorage.getItem("fontSize")){
		localStorage.setItem("fontSize", 15)
	}
	document.getElementsByTagName('body')[0].style.fontSize = localStorage.getItem("fontSize")+"px";
	scrolls = new Scrolls();
	
	pagination = new pageNavigator('categories', null, true);
	pagination.onBack = function(state){
		setTimeout(function(){
			document.getElementById(state.nextPage+'-wrapp').innerHTML = "";
		},400);
		if(typeof state.data.btnFavorite == "undefined"){
			setTitle(state.data.title, state.data.back);
		}else{
			setTitle(state.data.title, state.data.back, false);
		}
		setTapbar(state.data.tapbar);
		var data = pagination.state.data;
		window[pagination.state.page]('update', data.db, data.cid);
		scrolls.destroy(state.nextPage);
		}
	
	manifest = getManifest();
	getFrame();
	getTemplate();
	content("add", "News");
	inApp = true;
	localStorage.setItem("init", true);
	}
	
function getManifest(){
	var json;
	$.ajax({
		url: url+"manifest.js",
		dataType: "json",
		async: false,
		success: function(data){
			json = data;
			}
		});
	return json;
	}
	
function getFrame(){
	$.ajax({
		url: url+"index.html",
		dataType: "html",
		async: false,
		success: function(data){
			document.getElementsByTagName('body')[0].innerHTML = data;
			}
		});
	}
	
function getTemplate(){
	var template = manifest.template;
	var keys = Object.keys(template);
	for(var i = 0; i < keys.length; i++){
		var name = keys[i];
		var config = template[name];
		$.ajax({
			url: url+config.path,
			dataType: "html",
			async: false,
			success: function(data){
				document.getElementById(name).innerHTML = data;
				}
			});
		}
	}
	
function setTitle(title, back, favorites){
	var header = document.getElementById("menubar-title");
	var wrapp = document.getElementById("menubar-wrapp");
	var btnBack = document.getElementById("menubar-btn-left");
	var btnFavorites = document.getElementById("menubar-btn-right");
	if(header.innerHTML != title){
		wrapp.style.opacity = 0;
		setTimeout(function(){
			header.innerHTML = title;
			wrapp.style.opacity = 1;
			if(!back){
				btnBack.style.display = "none";
			}else{
				btnBack.style.display = "block";
			}
			if(typeof favorites == "boolean" && !favorites){
				btnFavorites.style.display = "none";
			}else{
				btnFavorites.style.display = "block";
			}
		}, 200);
	}
}

function setTapbar(type, param){
	var tapbar = document.getElementById("tapbar");
	TAPBAR = type;
	switch(type){
		case "tapbar-main":
			add("tapbar-main", function(data){
				var news = "";
				var newsColor = "#929292";
				var activity = "";
				var activityColor = "#929292";
				var settings = "";
				var settingsColor = "#929292";
				switch(pagination.state.data.db){
					case "News":
					news = "-enabled";
					newsColor = "#007aff";
					break;
					case "Activity":
					activity = "-enabled";
					activityColor = "#ff8a00";
					break;
					case "Settings":
					settings = "-enabled";
					settingsColor = "#929292";
					break;
				}
				tapbar.innerHTML = data
					.replace("%news%", news)
					.replace("%activity%", activity)
					.replace("%settings%", settings)
					.replace("%news-color%", newsColor)
					.replace("%activity-color%", activityColor)
					.replace("%settings-color%", settingsColor);
			})
		break;
		case "tapbar-news":
			add("tapbar-news", tapbarContent)
		break;
		case "tapbar-activity":
			add("tapbar-activity", tapbarContent)
		break;
		case "tapbar-favorite-news":
			add("tapbar-favorite-news", tapbarContent)
		break;
		case "tapbar-favorite-activity":
			add("tapbar-favorite-activity", tapbarContent)
		break;
		}
	function add(name, callback){
		$.ajax({
			url: url+"template/"+name+".html",
			dataType: "html",
			success: function(data){
				callback(data);
				}
			});
	}
	function tapbarContent(data){
		var opacityLeft = 1;
		var opacityRight = 1;
		if(param.pre_id == null){opacityLeft = 0.3};
		if(param.next_id == null){opacityRight = 0.3};
		
		var favorite = "favorite";
		var favoriteText = "Сохранить";
		if(param.favorite){favorite = "delete"; favoriteText="Удалить";}
		var go = "disabled";
		var goText = "Пойти";
		if(param.go){go = "enabled"; goText="Иду";}
		tapbar.innerHTML = data
			.replace("%pre_id%", param.pre_id)
			.replace("%pre_header%", param.pre_header)
			.replace("%next_id%", param.next_id)
			.replace("%next_header%", param.next_header)
			.replace("%opacityLeft%", opacityLeft)
			.replace("%opacityRight%", opacityRight)
			.replace("%favorite%", favorite)
			.replace("%favoriteText%", favoriteText)
			.replace("%go%", go)
			.replace("%goText%", goText);
	}
}
	
function setContent(content){
	document.getElementById("content").innerHTML = content;
	}
	
function inputFocus(element){
	var input = element.children[0];
	input.disabled = false; 
	input.focus();
	input.onblur = function(){
		input.value = ""; 
		input.disabled = true;
	}
}

function links(e){
		if(e.srcElement.href){
   			window.open(e.srcElement.href, '_system');
			e.preventDefault();
		}
}

function setOnline(){
	if(!authService){
		initService();
	}
}

function setFontSize(element, size){
	document.getElementsByClassName("li-themes-check")[0].className = "";
	document.getElementsByTagName('body')[0].style.fontSize = size+"px";
	localStorage.setItem("fontSize", size)
	element.children[0].className = "li-themes-check";
}

/*
function getPage(name, param){
	var page = manifest.pages[name];
	Animation.THIS = page.animation;
	HTML.get(page.path, success);
		
	function success(data){
		document.getElementById("menubar-title").innerHTML = page.name;
		document.getElementById("content").innerHTML = data;
		if(typeof App.scripts[name] !== "undefined"){
			App.scripts[name](data, param);
			}
		}
	}
*/


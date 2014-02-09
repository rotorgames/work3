document.addEventListener("deviceready",initApp, false);
window.addEventListener("resize",resize, false);

$(window).bind('hashchange',getPage);

$.ajaxSetup ({
    cache: false,
});

function resize(){
	App.height = $(window).height();
	App.width = $(window).width();
	}

function initApp(){
	App = {
		height:$(window).height(),
		width:$(window).width(),
		dom:{}
		}; 
	
	$.ajaxSetup ({ async:false });
	getIndex();
	getPage();
	$.ajaxSetup ({ async:true });
	initTouch();
	}
	
function getIndex(){
	$.get("www/config.js",function(config){
		App.page = config.page;
		var template = config.template;
		var modules = config.template.modules;
		var page = config.page;
		
		$("body").load(template.url);
		
		var modulesKeys = Object.keys(modules);
		for(var i = 0; i < modulesKeys.length; i++){
			$("#"+modulesKeys[i]).load(modules[modulesKeys[i]].url);
			var elementsKeys = Object.keys(modules[modulesKeys[i]].elements);
			App.dom[modulesKeys[i]] = {elements:{},elementsList:[]};
			App.dom[modulesKeys[i]].elements.content = document.getElementById(modulesKeys[i]);
			App.dom[modulesKeys[i]].elementsList.push(App.dom[modulesKeys[i]].elements.content);
			for(var n = 0; n < elementsKeys.length; n++){
				App.dom[modulesKeys[i]].elements[elementsKeys[n]] = document.getElementById(modules[modulesKeys[i]].elements[elementsKeys[n]]);
				App.dom[modulesKeys[i]].elementsList.push(App.dom[modulesKeys[i]].elements[elementsKeys[n]]);
				}
			}
		},"json")
	}
	
function getPage(){
	var hash = location.hash;
	var url, name;
	if(hash == ""){
		name = "index";
		}else{
		var parseHash = hash.replace("#","");
		name = parseHash;
			}
	url = App.page[name].url;
	$("#wrapper").load(url, function(){updateTouch()});
	}
	
function initTouch(){
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	scrollContent = new IScroll('#beda', {mouseWheel: true, /*useTransform:true, useTransition:true,*/ scrollX:true , scrollY:false, scrollbars: false, resize:false, bounce:false, momentum:false, click: true });
	scrollWrapper = new IScroll('#wrapper', {mouseWheel: true, /*useTransform:true, useTransition:true,*/ scrollX:false , scrollY:true, scrollbars: true, click: true });
	
	scrollContent.scrollTo(scrollContent.maxScrollX, 0)
	
	scrollContent.on("scrollEnd", scrollEnd);
	scrollContent.on("scrollStart", scrollStart);
	
	var duration = 500,
		startScroll = false;
		
	function scrollStart(){
		startScroll = true;
		}
	
	function scrollEnd(){
		if(startScroll && this.directionLocked == "h" || this.directionLocked == "n"){
			startScroll = false;
			if(this.distX < 0){
				scrollWrapper.enable();
				this.scrollTo(this.maxScrollX, this.y, duration);
				}else
			if(this.distX > 0){
				scrollWrapper.disable();
				this.scrollTo(0, this.y, duration);
				}
			}
		}
	}

function updateTouch(){
	if(typeof scrollContent !== "undefined"){
		scrollWrapper = new IScroll('#wrapper', {scrollX:false , scrollY:true, scrollbars: true });
		var duration = 500;
		scrollContent.scrollTo(scrollContent.maxScrollX, scrollContent.y, duration)
		}
	}

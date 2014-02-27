function settings(type){
	if(type != "add"){return false};
	
	var title = "Настройки";
	setTitle(title, false, false);
	pagination.reset('settings', {title:title,db:"Settings",back:false, btnFavorite:false, tapbar:"tapbar-main"}, true);
	scrolls.destroyAll();
	
	setTapbar("tapbar-main");
		
	HTML.get("pages/settings.html", success);
	
	function success(context){
		var fontSize = localStorage.getItem("fontSize");
		var small = "";
		var medium = "";
		var high = "";
		switch(fontSize){
			case "13":
			small = "check";
			break;
			case "15":
			medium = "check";
			break;
			case "17":
			high = "check";
			break;
		}
		var content = context
			.replace("%small%", small)
			.replace("%medium%", medium)
			.replace("%high%", high);
		setContent(content);
		scrolls.add('settings', tap);
	}
	
	function tap(event){
		if(pagination.state.page == 'settings'){
			if(event.target.getAttribute('data-btn')){
				var element = event.target;
			}else
			if(event.target.parentElement.getAttribute('data-btn')){
				var element = event.target.parentElement;
			}else
			if(event.target.parentElement.parentElement.getAttribute('data-btn')){
				var element = event.target.parentElement.parentElement;
			}else{
				return false;	
			}
			var btn = element.getAttribute('data-btn');
			if(btn == "fontSize"){
				setFontSize(element, element.getAttribute('data-size'));
			}
			if(btn == "categories"){
				element.style.backgroundColor = "#d9d9d9";
				setTimeout(function(){
					element.style.backgroundColor = "";
					},500);
				settingsCategories(element.getAttribute('data-db'));
			}
		}
	}
}
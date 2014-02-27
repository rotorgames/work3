function settingsCategories(db){
	if(navigator.connection.type == 'none'){
		alert('Требуется подключение к интернету');
		return false;
	}
	if(db == "News"){
		name = "Новости";
	}else if(db == "Activity"){
		name = "Мероприятия";
		}
	
	pagination.pushState('settingsCategories', {title: name, db:db, back:true, tapbar:"tapbar-main"}, false);
	
	var container = document.getElementById('settingsCategories-wrapp');

	setTitle(name, true, false);
	
	HTML.get("pages/settings/list.html", add);
	
	function add(context){
		API.getSettingsCategories(db, function(data){
			show(context, data);
		});
	}
	
	function show(context, data){
		var content = "";
		for(var i = 0; i < data.length; i++){
			var category = data[i];
			var check = "check";
			if(category.exception){
				check = "";
			}
			content += context
				.replace("%id%", category.id)
				.replace("%name%", category.name)
				.replace("%check%", check);
		}
		container.innerHTML = content;
		pagination.enabled = true;
		scrolls.add('settingsCategories', tap);
	}
	
	function tap(event){
		if(pagination.state.page == 'settingsCategories'){
			if(event.target.getAttribute('data-id')){
				var element = event.target;
			}else
			if(event.target.parentElement.getAttribute('data-id')){
				var element = event.target.parentElement;
			}else
			if(event.target.parentElement.parentElement.getAttribute('data-id')){
				var element = event.target.parentElement.parentElement;
			}else{
				return false;	
			}
			var id = element.getAttribute('data-id');
			if(navigator.connection.type != 'none'){
				if(element.children[0].className == "li-themes-check"){
					element.children[0].className = "";
				}else{
					element.children[0].className = "li-themes-check";
				}
				API.setSettingsCategories(db, id, function(e){console.log(e)});
			}else{
				alert('Требуется подключение к интернету');
			}
		}
	}
}
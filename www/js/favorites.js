function favorites(type, db){
	var dblist = [];
	if(type == "add"){
		favoritesAdd(function(){
			var title = "Избранное";
			pagination.reset('favorites', {db:db,title:title,tapbar:"tapbar-main",back:false}, true);
			scrolls.destroyAll();
			setTitle(title, false);
			setTapbar("tapbar-main");
			scrolls.add('favorites', tap);
		});
	}else
	if(type == "update"){
		favoritesAdd(function(){
			scrolls.scrolls.favorites.iscroll.refresh();
		})
	}
	
	function favoritesAdd(callback){
		HTML.get("pages/favorites.html", add);
		
		function add(context){
			if(type == "add"){
				setContent(context);
			}
			var ldb = openDatabase("favorites", "0.1", "Favorites", 200000);
			ldb.transaction(function(tx) {
				tx.executeSql("SELECT * FROM "+db, [], success, error);
				
				function error(tx, error){
					console.log(error);
					}
				
				function success(tx, result){
					HTML.get("pages/favorites/list.html", show);
					function show(context){
						var conteiner = document.getElementById('favorites-wrapp');
						var content = "";
						for(var i = 0; i < result.rows.length; i++){
							var info = result.rows.item(i);
							dblist.push(info);
							var go = "";
							if(db == "Activity" && info.go){
								go = "enabled";
								}else
							if(db == "Activity" && !info.go){
								go = "disabled";
								}
							content += context
								.replace("%id%", i)
								.replace(/%header%/g, info.header)
								.replace("%date%", info.date)
								.replace("%time%", info.time)
								.replace("%go%", go);
						}
						conteiner.innerHTML = content;
						callback(conteiner);
					}
				}
			});
		}
	}
	function tap(event){ 
		if(pagination.state.page == 'favorites'){
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
			element.style.backgroundColor = "#d9d9d9";
			setTimeout(function(){
				element.style.backgroundColor = "";
				},500);
			var id = element.getAttribute('data-id');
			var name = element.getAttribute('data-name');
			favorite("add", db, id, name, dblist);
			}
		}
}
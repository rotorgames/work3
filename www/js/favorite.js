function favorite(type, db, id, name, dblist){
	
	if(id == "null"){return false};
	
	var container = document.getElementById('favorite-wrapp');
	pagination.pushState('favorite', {db:db,id:id,name:name,dblist:dblist}, false);

	setTitle(name, true);
	if(type == "add"){
		favoriteAdd(function(container){
			scrolls.add('favorite');
		});
	}else
	if(type == 'update'){
		container.style.opacity = 0;
		pagination.enabled = false;
		favoriteAdd(function(container){
			scrolls.scrolls.favorite.iscroll.refresh();
		});
	}
	
	function favoriteAdd(callback){	
		HTML.get("pages/favorites/wrapper.html", getContent);
		
		function getContent(context){
			var pagData = pagination.state.data;
			var data = pagination.state.data.dblist[id];
			data.favorite = 1;
			data.pre_header = null;
			data.pre_id = null
			data.next_header = null;
			data.next_id = null;
			var pre_id = parseInt(id)-1;
			var next_id = parseInt(id)+1;
			if(pagination.state.data.dblist[pre_id]){
				data.pre_header = pagination.state.data.dblist[pre_id].header;
				data.pre_id = pre_id;
			}
			if(pagination.state.data.dblist[next_id]){
				data.next_header = pagination.state.data.dblist[next_id].header;
				data.next_id = next_id;
			}
			console.log(data);
			pagData.id = data.id;
			pagData.header = data.header;
			pagData.main = data.main;
			pagData.time = data.time;
			pagData.date = data.date;
			pagData.go = data.go;
			if(db == "News"){
				setTapbar('tapbar-favorite-news', data);
			}else{
				setTapbar('tapbar-favorite-activity', data);
			}
			show(context, data);
		}
		
		function show(context, data){
			var go = "";
			if(db == "Activity" && data.go){
				go = "enabled";
				}else
			if(db == "Activity" && !data.go){
				go = "disabled";
				}
			var content = context
				.replace("%time%", data.time)
				.replace("%date%", data.date)
				.replace("%header%", data.header)
				.replace("%main%", data.main)
				.replace("%go%", go);
			container.innerHTML = content;
			container.style.opacity = 1;
			pagination.enabled = true;
			callback(container);
		}
	}
	}
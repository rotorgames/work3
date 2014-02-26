function wrapper(type, db, id, name){
	
	if(id == "null"){return false};
	
	var container = document.getElementById('wrapper-wrapp');

	setTitle(name, true);
	if(type == "add"){
		pagination.pushState('wrapper', {db:db,id:id,name:name}, false);
		wrapperAdd(function(container){
			scrolls.add('wrapper');
		});
	}else
	if(type == 'update'){
		container.style.opacity = 0;
		pagination.enabled = false;
		wrapperAdd(function(container){
			scrolls.scrolls.wrapper.iscroll.refresh();
		});
	}
	
	function wrapperAdd(callback){	
		HTML.get("pages/wrapper.html", getContent);
		
		function getContent(context){
			API.getContent(db, id, add, contentConnectionError);
			function add(data){
				var pagData = pagination.state.data;
				pagData.id = data.id;
				pagData.header = data.header;
				pagData.main = data.main;
				pagData.date = data.date;
				pagData.time = data.time;
				pagData.location = data.location;
				pagData.go = data.go;
				if(db == "News"){
					setTapbar('tapbar-news', data);
				}else{
					setTapbar('tapbar-activity', data);
				}
				show(context, data);
			}
		}
		
		function show(context, data){
			var favorite = "disabled";
			var go = "";
			if(db == "Activity"){
				var go = "disabled";
			}
			if(data.favorite){favorite = "enabled"};
			if(data.go){go = "enabled"};
			var content = context
				.replace("%time%", data.time)
				.replace("%date%", data.date)
				.replace("%header%", data.header)
				.replace("%main%", data.main)
				.replace("%favorite%", favorite)
				.replace("%go%", go);
			container.innerHTML = content;
			container.style.opacity = 1;
			pagination.enabled = true;
			callback(container);
		}
	}
	}
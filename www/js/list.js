function clist(type, db, cid, name, search){
	
	var element = document.getElementById('clist-wrapp');
	
	if(type == "add"){
		element.innerHTML = '<div class="imgPreloader" ><img src="www/img/loading.gif" height="100"></div>';
		setTitle(name, true);
		pagination.pushState('clist', {title: name, db:db, cid:cid, back:true, tapbar:"tapbar-main"}, false);
		listAdd(function(container){
			container.style.opacity = 1;
			scrolls.add('clist', tap);
		});
	}else
	if(type == 'update'){
		listAdd(function(container){
			scrolls.scrolls.clist.iscroll.refresh();
		});
	}
		
	function listAdd(callback){
		HTML.get("pages/list.html", getCount);
		
		function getCount(context){
			HTML.get("template/count.html", add);
			function add(template){
				count_template = template;
				show(context);
				}
			}
		
		function show(context){	
			API.getContents(db, cid, search, add, contentConnectionError);
			function add(data){
				success(context, data);
				}
			}
		
		function success(context, data){
			var template = context;
			var content = "";
			for(var i = 0; i < data.length; i++){
				var theme = "read"
				var count = "";
				var favorite = "disabled";
				var go = "";
				if(!data[i].read){
					count = count_template.replace("%count%", "new");
					theme = "new";
					}
				if(data[i].favorite){
					favorite = "enabled";
					}
				if(db == "Activity" && data[i].go){
					go = "enabled";
					}else
				if(db == "Activity" && !data[i].go){
					go = "disabled";
					}
				content += template
					.replace("%id%", data[i].id)
					.replace(/%header%/g, data[i].header)
					.replace("%date%", data[i].date)
					.replace("%time%", data[i].time)
					.replace("%category%", data[i].category)
					.replace("%theme%", theme)
					.replace("%count%", count)
					.replace("%favorite%", favorite)
					.replace(/%go%/g, go);
				}
			
			if(data.length){
				element.innerHTML = content;
			}else
			{
				element.innerHTML = "<h4>Список пуст</h4>";
			}
			
			pagination.enabled = true;
			callback(element);
			}	
	}
		
	function tap(event){ 
		if(pagination.state.page == 'clist'){
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
			wrapper("add", db, cid, id, name);
			}
		}
	}
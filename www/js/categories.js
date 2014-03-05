function categories(type, db, search){
	var name, count, scroll;
	
	var container = document.getElementById('categories-wrapp');
	
	if(db == "News"){
		name = "Новости";
	}else if(db == "Activity"){
		name = "Мероприятия";
		}
	var title = name+" <small>Выберите категорию<small>";
	pagination.state.data.title = title;
	pagination.state.data.tapbar = "tapbar-main";
	pagination.state.data.back = false;
	
	setTapbar(pagination.state.data.tapbar);
	
	if(type == "add"){
		setTitle(title, false);
		container.innerHTML = '<div class="imgPreloader" ><img src="www/img/loading.gif" height="100"></div>';
		categoriesAdd(function(container){
			container.style.opacity = 1;
			scrolls.add('categories', tap);
		});
	}else
	if(type == 'update'){
		categoriesAdd(function(container){
			scrolls.scrolls.categories.iscroll.refresh();
		});
	}
	
	function categoriesAdd(callback){
		
		API.getCategories(db,'Categories', search, getCount, contentConnectionError);
		
		function getCount(response){
			HTML.get("template/count.html", add);
			function add(template){
				count_template = template;
				showAll(response);
				}
			}
			
		function showAll(response){
			HTML.get("pages/categories/show-all.html", add);
			function add(template){
				if(response.count_all){
					var count_all = count_template.replace("%count%", response.count_all);
					}else{
					var count_all = "";
					}
				var context = template.replace(/%name%/g, name).replace("%count%", count_all);
				show(response, context);
				}
			}
			
		function show(response, showAll){
			data = response.data;
			HTML.get('pages/categories/list.html', add);
			function add(template){
				var content = showAll;
				for(var i = 0; i < data.length; i++){
					if(data[i].count){
						var count = count_template.replace("%count%", data[i].count);
						}else{
						var count = "";
						}
						content += template.replace(/%name%/g, data[i].name).replace("%id%", data[i].id);
						content = content.replace("%count%", count);
					}
				if(data.length){
					container.innerHTML = content;
				}else
				{
					container.innerHTML = "<h4>Список пуст</h4>";
				}
				callback(container);
				}
			}
	}
		
	function tap(event){ 
		if(pagination.state.page == 'categories'){
			if(event.target.getAttribute('data-id')){
				var element = event.target;
				}else
			if(event.target.parentElement.getAttribute('data-id')){
				var element = event.target.parentElement;
				}else{
				return false;	
				}
			element.style.backgroundColor = "#d9d9d9";
			setTimeout(function(){
				element.style.backgroundColor = "";
				},500);
			var cid = element.getAttribute('data-id');
			var name = element.getAttribute('data-name');
			
			clist('add', db, cid, name);
			}
		}
	}
	
function categoriesUpdate(){
	categoriesAdd(function(){
		
		})
}

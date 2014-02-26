function content(type, db){
	
	pagination.reset('categories', {db:db}, true);
	scrolls.destroyAll();
		
	HTML.get("pages/content.html", success);
	
	function success(context){
		setContent(context);
		categories(type, db);
		}
	}
	
function setFavorite(element){
	var db = openDatabase("favorites", "0.1", "Favorites", 200000);
	var pagData = pagination.state.data;
	var dbName = pagData.db;
	if(!db){alert("Failed to connect to database.");}
	
	getFavorite();
	
	function getFavorite(){
		db.transaction(function(tx) {
			tx.executeSql("SELECT * FROM "+dbName+" WHERE id = "+pagData.id, [], success, error);
		});
	}
	
	function success(tx, result){
		if(result.rows.length == 0){
			API.setFavorite(dbName, pagData.id, function(response){
				db.transaction(function(tx) {
					tx.executeSql("INSERT INTO  "+dbName+" (id ,header ,main ,date ,time, go)VALUES (?,  ?,  ?,  ?, ?, ?)", [pagData.id, pagData.header, pagData.main, pagData.date, pagData.time, pagData.go], null, null);
					element.children[0].src = "/www/img/tapbar/delete.png";
					element.children[1].innerHTML = "Удалить";
				});
			});
		}else{
			API.setFavorite(dbName, pagData.id, function(){
				db.transaction(function(tx) {
					tx.executeSql("DELETE FROM "+dbName+" WHERE id = "+pagData.id, [], null, null);
					element.children[0].src = "/www/img/tapbar/favorite.png";
					element.children[1].innerHTML = "Сохранить";
				})
			})
		}
	};
	
	function error(tx, error){
		db.transaction(function(tx) {
			tx.executeSql("CREATE TABLE "+dbName+" (id int(11) ,header text ,main text ,date text ,time text ,go int(1) ,PRIMARY KEY (id))", [], null, null);
			getFavorite();
		});
	}
		
}

function setActivity(element){
	var pagData = pagination.state.data;
	var dbName = pagData.db;
	API.setActivity(dbName, pagData.id, function(response){
		if(/-/.test(pagData.time)){
			var times = pagData.time.split("-");
			var startTime = times[0].split(":");
			var endTime = times[1].split(":");
		}else{
			var startTime = pagData.time.split(":");
			var endTime = startTime;
		}
		if(/-/.test(pagData.date)){
			var dates = pagData.date.split("-");
			var startDate = dates[0].split(".");
			var endDate = dates[1].split(".");
		}else{
			var startDate = pagData.date.split(".");
			var endDate = startDate;
		}
		
		var cStartDate = new Date(parseInt(startDate[2]),parseInt(startDate[1])-1,parseInt(startDate[0]),parseInt(startTime[0]),parseInt(startTime[1]));
		var cEndDate = new Date(parseInt(endDate[2]),parseInt(endDate[1])-1,parseInt(endDate[0]),parseInt(endTime[0]),parseInt(endTime[1]));

		if(response.event == "add"){
			pagination.state.data.go = 1;
			window.Calendar.createEvent(pagData.header, pagData.location, pagData.main, cStartDate, cEndDate, function(){
				element.children[0].src = "/www/img/tapbar/go-enabled.png";
				element.children[1].innerHTML = "Иду";
				
				var cdb = openDatabase("favorites", "0.1", "Favorites", 200000);
				cdb.transaction(function(tx) {
					tx.executeSql("SELECT * FROM "+dbName+" WHERE id = "+pagData.id, [], success, null);
					function success(tx, result){
						if(result.rows.length){
							tx.executeSql("UPDATE  "+dbName+" SET  go =  1 WHERE  id = "+pagData.id, [], null, null);
						}
					}
				});
			}, null);
		}else{
			pagination.state.data.go = 0;
			window.Calendar.deleteEvent(pagData.header, pagData.location, pagData.main, cStartDate, cEndDate, function(){
				element.children[0].src = "/www/img/tapbar/go-disabled.png";
				element.children[1].innerHTML = "Пойти";
				
				var cdb = openDatabase("favorites", "0.1", "Favorites", 200000);
				cdb.transaction(function(tx) {
					tx.executeSql("SELECT * FROM "+dbName+" WHERE id = "+pagData.id, [], success, null);
					function success(tx, result){
						if(result.rows.length){
							tx.executeSql("UPDATE  "+dbName+" SET  go =  0 WHERE  id = "+pagData.id, [], null, null);
						}
					}
				});
			}, null);
		}
	});
}
	
function contentConnectionError(error){
	if(error.status == 0){
		navigator.notification.alert('Отсутствует подключение к Интернету', function(){
			var db = pagination.states[0].data.db;
			favorites(db);
			},'Ошибка');
		}
	}
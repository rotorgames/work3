function syncdb(){
	function bnd(){}
	var db = openDatabase("favorites", "0.1", "Favorites", 200000);
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM News", [], function(){}, error);
		function error(){
			API.getNews(function(contents){
				db.transaction(function(tx) {
					tx.executeSql("CREATE TABLE News (id int(11) ,header text ,main text ,date text ,time text ,go int(1) ,location text ,PRIMARY KEY (id))", [], bnd, bnd);
					for(var i = 0; i < contents.length; i++){
						var content = contents[i];
						tx.executeSql("INSERT INTO  News (id ,header ,main ,date ,time, go, location)VALUES (?,  ?,  ?,  ?, ?, ?, ?)", [content.id, content.header, content.main, content.date, content.time, content.go, content.location], bnd, bnd);
					}
				});
			})
		}
	});
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM Activity", [], function(){}, error);
		function error(tx){
			API.getActivity(function(contents){
				db.transaction(function(tx) {
					tx.executeSql("CREATE TABLE Activity (id int(11) ,header text ,main text ,date text ,time text ,go int(1) ,location text ,PRIMARY KEY (id))", [], bnd, bnd);
					for(var i = 0; i < contents.length; i++){
						var content = contents[i];
						tx.executeSql("INSERT INTO  Activity (id ,header ,main ,date ,time, go, location)VALUES (?,  ?,  ?,  ?, ?, ?, ?)", [content.id, content.header, content.main, content.date, content.time, content.go, content.location], bnd, bnd);
					}
				});
			})
		}
	});
}
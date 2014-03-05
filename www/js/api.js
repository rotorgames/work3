API = {
	url: "http://api.medmind.ru/"
	};

API.ajax = function(url, data, callback, error){
	$.ajax({
		type:"POST",
		timeout: 20000,
		url: API.url+url,
		dataType: "json",
		cache: false,
		data:data,
		success: callback,
		error: error
		});
	}

API.getCategories = function(db, helper, search, callback, error){
	if(navigator.connection.type == 'none'){
		contentConnectionError();
		}else{
		this.ajax("content/getCategories", {db:db, search:search}, callback, error);
		}
	}
	
API.getContents = function(db, cid, search, callback, error){
	if(navigator.connection.type == 'none'){
		contentConnectionError();
		}else{
		this.ajax("content/getContents", {db:db, cid: cid, search:search}, callback, error);
		}
	}
	
API.getContent = function(db, cid, id, callback, error){
	if(navigator.connection.type == 'none'){
		contentConnectionError();
		}else{
		this.ajax("content/getContent", {db:db, cid:cid, id: id}, callback, error);
		}
	}
	
API.userRegistration = function(data, callback, error){
	if(navigator.connection.type == 'none'){
		contentConnectionError();
		}else{
		this.ajax("registration", data, callback, error);
		}
	}
	
API.setFavorite = function(db, id, callback, error){
	if(navigator.connection.type == 'none'){
		alert('Требуется подключение к интернету');
		}else{
		this.ajax("content/setFavorite", {db:db, id:id}, callback, contentConnectionError);
		}
	}
	
API.setActivity = function(db, id, callback, error){
	if(navigator.connection.type == 'none'){
		alert('Требуется подключение к интернету');
		}else{
		this.ajax("content/setActivity", {db:db, id:id}, callback, contentConnectionError);
		}
	}
	
API.getNews = function(callback){
	if(navigator.connection.type == 'none'){
		//contentConnectionError();
	}else{
		this.ajax("content/getNews", {}, callback, contentConnectionError);
	}
}
API.getActivity = function(callback){
	if(navigator.connection.type == 'none'){
		//contentConnectionError();
	}else{
		this.ajax("content/getActivity", {}, callback, contentConnectionError);
	}
}

API.getSettingsCategories = function(db, callback, error){
	if(navigator.connection.type == 'none'){
		alert('Требуется подключение к интернету');
		}else{
		this.ajax("content/getSettingsCategories", {db:db}, callback, error);
		}
	}
	
API.setSettingsCategories = function(db, id, callback, error){
	if(navigator.connection.type == 'none'){
		alert('Требуется подключение к интернету');
		}else{
		this.ajax("content/setSettingsCategories", {db:db, id:id}, callback, function(e){console.log(e)});
		}
	}

API.sendMail = function(db, id, email,callback){
	if(navigator.connection.type == 'none'){
		//contentConnectionError();
	}else{
		this.ajax("content/sendMail", {db:db,id:id,email:email}, callback, contentConnectionError);
	}
}
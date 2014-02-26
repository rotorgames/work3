HTML = {};

HTML.get = function(path, callback, error){
	$.ajax({
		url: url+path,
		dataType: "text",
		success: callback,
		error: error
		});
	}

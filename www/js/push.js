authService = false;
function initService(){
	if(navigator.connection.type != "none"){
		var pushNotification = window.plugins.pushNotification;
		if(device.platform == "android" || device.platform == "Android"){
			pushNotification.register(
				successHandler,
				errorHandler, {
					"senderID":"614682503532",
					"ecb":"onNotification"
				});
			}else{
				pushNotification.register(
				tokenHandler,
				errorHandler, {
					"badge":"true",
					"sound":"true",
					"alert":"true",
					"ecb":"onNotification"
				});
			}
		}else{
			if(!inApp){
				initApp();
			}
		}
	}

function successHandler(e){
	//Android
	}
	
function tokenHandler(e){
	registrationService(e, "Ios");
	}
	
function errorHandler(e){
	alert('Ошибка регистрации устройства');
	}
									
function onNotification(e){
	if(e.event == "registered"){
		registrationService(e.regid, "Android");
		}else{
		//On Message
		}
	}
	
function registrationService(regid, platform){
	var data = {
		regid:regid,
		platform:platform
		};
	API.userRegistration(data, success, error);
	function success(response){
		if(response.event == "success"){
			syncdb();
			authService = true;
			if(!inApp){
				initApp();
			}
			}
		}
	function error(err){
		alert('Ошибка регистрации на сервере');
		}
	}
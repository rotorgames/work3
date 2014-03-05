function pageNavigator(name, state, enable, back){
	this.app = navigator.app;
	this.enabled = enable;
	this.state = null;
	this.states = [];
	
	this.onBack = null;
	
	this.add(name, state, back);
	
	document.addEventListener("backbutton", this.back.bind(this), false);
	}
	
pageNavigator.prototype.pushState = function(name, state, enable, back){
	this.enabled = enable;
	this.state.nextPage = name;
	this.animate(this.state.page, 'lhide');
	this.animate(this.state.nextPage, 'rshow');
	this.add(name, state, back);
	}
		
pageNavigator.prototype.back = function(){
	//if(!event.state || event.state >= this.states.length){return};
	if(!this.enabled){
		return false
		}else
	if(this.states.length == 1){
		if(this.state.page == "favorites"){
			content("add", this.state.data.db);
			return false;	
		}
		if(device.platform != "iOS"){
			navigator.notification.confirm('Вы действительно хотите выйти?',function(e){
				if(e == 1){
					navigator.app.exitApp();
					}
				},'Выход')
			}
	}else{
		this.states.pop();
		this.state = this.states[this.states.length-1];
		this.animate(this.state.page, 'lshow');
		this.animate(this.state.nextPage, 'rhide');
		if(this.onBack){this.onBack(this.state)}
		return false;
		}
	}
		
pageNavigator.prototype.reset = function(name, state, enable, back){
	this.enabled = enable;
	this.state = null;
	this.states = [];
	this.add(name, state, back);
	}
		
pageNavigator.prototype.add = function(name, state, back){
	var state = {page:name, nextPage:null, data:state, back:back}
	this.state = state;
	this.states.push(state);
	}
	
pageNavigator.prototype.animate = function(name, type){
	var element = document.getElementById(name);
	switch(type){
		case "lhide":
			element.style['-webkit-transform'] = "translate(-50%, 0px) translateZ(0px)";
		break;
		case "rhide":
			element.style['-webkit-transform'] = "translate(100%, 0px) translateZ(0px)";
		break;
		case "lshow":
			element.style['-webkit-transform'] = "translate(0%, 0px) translateZ(0px)";
		break;
		case "rshow":
			element.style['-webkit-transform'] = "translate(0%, 0px) translateZ(0px)";
		break;
		}
	
	}
	
pageNavigator.prototype.destroy = function(){
	document.removeEventListener("backbutton", this.back.bind(this), false);
	}
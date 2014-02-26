function Scrolls(){
	this.scrolls = {};
	}

Scrolls.prototype.add = function(name, tap){
	this.scrolls[name] = {};
	var scroll = this.scrolls[name];
	scroll.iscroll = new IScroll('#'+name+'-scroll', {disableMouse:true, disablePointer:true, scrollX:false , scrollY:true, tap: true});
	scroll.element = document.getElementById(name+'-scroll');
	scroll.tap = tap;
	
	scroll.element.addEventListener('tap', scroll.tap, false);
	}
	
Scrolls.prototype.destroy = function(name){
	var scroll = this.scrolls[name];
	scroll.iscroll.destroy();
	scroll.element.removeEventListener('tap', scroll.tap, false);
	delete(this.scrolls[name]);
	}
	
Scrolls.prototype.destroyAll = function(){
	var keys = Object.keys(this.scrolls);
	for(var i = 0; i < keys.length; i++){
		this.destroy(keys[i]);
		}
	}
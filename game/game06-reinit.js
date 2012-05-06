playback.restore = function() {
	var p = localStorage.getItem('playback');
	if (!p) {
		return;
	}
	
	p = JSON.parse(p);
	var initialState = journal[0].state;
	
	// Only copy down and up properties.
	var j = p.journal;
	for (var key in j) {
		journal[key] = j[key];
	}
	
	journal[0].state = initialState;
	this.reset();
}

/* UI */

playback.updateControllerHTML = function() {
	var c = document.getElementById('controller');
	c.innerHTML = controller === this ? this.time+"/"+journal.time : "";
}

playback.animate = function() {
	++this.time;
	
	if (this.time >= journal.time) {
		controller = playController;
		pause();
	} else {
		journal.updateHeldKeys(this.time);
		update();
		redraw();
	}
	
	this.updateControllerHTML();
}

playback.reset = function(time) {
	if (time === undefined) {
		time = 0;
	}
	
	journal.reset(time);
	
	this.time = time;
	controller = this;
	this.updateControllerHTML();
	
	resume();
}
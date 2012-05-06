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
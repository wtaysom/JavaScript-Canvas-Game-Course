/** Random Numbers **/

PMCRandom.prototype.saveState = function() {
	return {
		__type: 'PMCRandom',
		seed: this.seed
	}
}

PMCRandom.restoreFromState = function(state) {
	return new PMCRandom(state.seed);
}

var random = new PMCRandom();

function randomBetween(min, max) {
	return random.between(min, max);
}

function randomX() {
	return randomBetween(0, canvas.width);
}

function randomY() {
	return randomBetween(0, canvas.height);
}

/** State **/

function state() {
	state.properties = {};
	for (var i = 0; i < arguments.length; ++i) {
		var properties = arguments[i].split(/\s+/);
		for (var j = 0; j < properties.length; ++j) {
			var property = properties[j];
			state.properties[property] = true;
		}
	}
}

state.save = function() {
	var gathered = {};
	for (var property in state.properties) {
		var v = window[property];
		if (typeof v === 'object' && 'saveState' in v) {
			v = v.saveState();
		}
		gathered[property] = v;
	}
	return JSON.stringify(gathered);
}

state.restore = function(s) {
	var gathered = JSON.parse(s);
	for (var property in state.properties) {
		var v = gathered[property];
		if (typeof v === 'object' && '__type' in v) {
			v = window[v.__type].restoreFromState(v);
		}
		window[property] = v;
	}
}

/** Journal **/

var journal = {time: 0};

var heldKeys = {};
journal.previouslyHeldKeys = {};

function heldKeys_isHoldingKey(key) {
	return key === undefined ? heldKeys : heldKeys[key];
}

journal.checkpoint = function() {
	var entry = this[this.time];
	if (!entry) {
		entry = this[this.time] = {};
	}
	entry.state = state.save();
}

journal.reset = function(time) {
	if (time === undefined) {
		time = 0;
	}
	
	// Restore most recent checkpoint.
	for (var t = time; t >= 0; --t) {
		var entry = this[t];
		if (entry && entry.state) {
			state.restore(entry.state);
			break;
		}
	}
	
	try {
		var c = controller;
		controller = {isHoldingKey: heldKeys_isHoldingKey};
		for (; t < time; ++t) {
			isHoldingKey = controller.isHoldingKey;
			this.updateHeldKeys(t);
			update();
			
			//? make a checkpoint as needed
		}
	} finally {
		controller = c;
	}
}

journal.updateHeldKeys = function(time) {
	var entry = this[time];
	if (!entry) {
		return;
	}
	
	for (var i in entry.down) {
		heldKeys[entry.down[i]] = true;
	}
	for (var i in entry.up) {
		delete heldKeys[entry.up[i]];
	}	
}

journal.clear = function(time) {
	if (time === undefined) {
		time = 0;
	}
	
	this.time = time;
		
	for (var t in journal) {
		if (t > time) {
			delete journal[t];
		}
	}
}

journal.record = function() {	
	++this.time;
	
	// Determine held keys.
	
	var down = [];
	for (var key in heldKeys) {
		if (!this.previouslyHeldKeys[key]) {
			down.push(key);
		}
	}

	var up = [];
	for (var key in this.previouslyHeldKeys) {
		if (!heldKeys[key]) {
			up.push(key);
		}
	}
	
	this.previouslyHeldKeys = {};
	for (var key in heldKeys) {
		this.previouslyHeldKeys[key] = true;
	}
	
	// Record entry.
	
	if (down.length || up.length) {
		var entry = journal[journal.time];
		if (entry) {
			delete entry.down;
			delete entry.up;
		} else {
			entry = journal[journal.time] = {};
		}
		
		if (down.length) {
			entry.down = down;
		}
		
		if (up.length) {
			entry.up = up;
		}
	}
}

/** Controller **/

var playController = {isHoldingKey: isHoldingKey};
var controller = playController;

var animateTimeout;

function setAnimateTimeout() {
	animateTimeout = setTimeout(animate, 1000 / fps);
}

function animate() {
	isHoldingKey = controller.isHoldingKey;
	heldKeys = isHoldingKey();
	if (paused) {
		return;
	}
	controller.animate();
	setAnimateTimeout();
}

playController.animate = function() {
	journal.record();
	update();
	redraw();
}

function pause() {
	clearTimeout(animateTimeout);
	if (paused) {
		return;
	}
	paused = true;
	infoOriginalHTML = info.innerHTML;
	info.innerHTML = "paused";
}

function resume() {
	if (!paused) {
		return;
	}
	paused = false;
	info.innerHTML = infoOriginalHTML;
	setAnimateTimeout();
	redraw();
}

/** Playback **/

var playback = {isHoldingKey: heldKeys_isHoldingKey};

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

playback.store = function() {
	localStorage.setItem('playback', JSON.stringify({
		journal: journal
	}));
}

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

playback.step = function(distance) {
	var time = this.time === undefined ? journal.time : this.time;
	var time = Math.min(Math.max(0, time + distance), journal.time);
	this.reset(time);
	pause();
	redraw();
}

playback.removeStore = function() {
	localStorage.removeItem('playback');
}

/** Keys **/

key('p', function() {
	playback.reset();
});

key('o', function() {
	playback.reset();
	pause();
});

key('l', function() {
	playback.store();
});

key('k', function() {
	playback.removeStore();
});

key('left', function() {
	playback.step(-1);
});

key('right', function() {
	playback.step(1);
});

/** Start **/

function start() {
	journal.checkpoint();
	playback.restore();
	animate();
}
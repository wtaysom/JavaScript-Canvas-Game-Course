/** Random Numbers **/

var random = new PMCRandom();

function randomBetween(min, max) {
	return random.between(min, max);
}

PMCRandom.prototype.saveState = function() {
	return {
		__type: 'PMCRandom',
		seed: this.seed
	}
}

PMCRandom.restoreFromState = function(state) {
	return new PMCRandom(state.seed);
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
		if (typeof v == 'object' && 'saveState' in v) {
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
		if (typeof v == 'object' && '__type' in v) {
			v = window[v.__type].restoreFromState(v);
		}
		window[property] = v;
	}
}

/** Journal **/

var journal = {time: 0};

journal.previouslyHeldKeys = {};

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
		}
	}
	
	for (; t < time; ++t) {
		update();
		
		//? make a checkpoint as needed
		//? previously held keys can get confused
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
	
	//? need to handle down and up keys else I think we get into trouble
}

journal.record = function() {	
	++this.time;
	
	// Determine heldKeys.
	
	var heldKeys = isHoldingKey();
	
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

function animate() {
	isHoldingKey = controller.isHoldingKey;
	if (paused) {
		return;
	}
	controller.animate();
	animateTimeout = setTimeout(animate, 1000 / fps);
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

/** Playback **/

var playback = {};

playback.isHoldingKey = function(key) {
	return key === undefined ? playback.heldKeys : playback.heldKeys[key];
}

playback.animate = function() {
	++this.time;
	
	if (this.time >= journal.time) {
		controller = playController;
		pause();
		return;
	}
	
	var entry = journal[this.time];
	if (entry) {
		for (var i in entry.down) {
			this.heldKeys[entry.down[i]] = true;
		}
		for (var i in entry.up) {
			delete this.heldKeys[entry.up[i]];
		}
	}
	
	update();
	redraw();
}

playback.reset = function(time) {
	if (time === undefined) {
		time = 0;
	}
	
	journal.reset(time);
	
	this.time = time;
	this.heldKeys = {}; //? The journal can probably give us a better answer.
	controller = this;
	
	resume();
}

//!! Add functions for step-by-step playback, rewind and such.

key('p', function() {
	playback.reset();
});

/** Start **/

state('player bullets bulletCoolDown badGuys random');
journal.checkpoint();
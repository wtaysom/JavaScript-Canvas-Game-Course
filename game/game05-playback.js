/** Random Numbers **/

var random = new PMCRandom();

function randomBetween(min, max) {
	return random.between(min, max);
}

/** Playback **/

function state() {
	for (var i = 0; i < arguments.length; ++i) {
		var properties = arguments[i].split(/\s+/);
		for (var j = 0; j < properties.length; ++j) {
			var property = properties[j];
			state.properties[property] = true;
		}
	}
}

state.properties = {};

state.saveInitial = function() {
	if (state.initialJSON) {
		return;
	}
	
	var initialState = {};
	for (var property in state.properties) {
		initialState[property] = window[property];
	}
	state.initialJSON = JSON.stringify(initialState);
}

state.reset = function() {
	var initialState = JSON.parse(state.initialJSON);
	for (var property in state.properties) {
		window[property] = initialState[property];
	}
}

var journal = {time: 0};
var previouslyHeldKeys = {};
var wasPaused = paused;

function record() {
	state.saveInitial();
	
	if (!state.initialJSON) {
		var initialState = {};
		for (var property in state.properties) {
			initialState[property] = window[property];
		}
		state.initialJSON = JSON.stringify(initialState);
	}
	
	++journal.time;
	
	var heldKeys = isHoldingKey();
	
	var down = [];
	for (var key in heldKeys) {
		if (!previouslyHeldKeys[key]) {
			down.push(key);
		}
	}

	var up = [];
	for (var key in previouslyHeldKeys) {
		if (!heldKeys[key]) {
			up.push(key);
		}
	}
	
	previouslyHeldKeys = {};
	for (var key in heldKeys) {
		previouslyHeldKeys[key] = true;
	}
	
	if (down.length || up.length) {
		var entry = {};
		journal[journal.time] = entry;
		
		if (down.length) {
			entry.down = down;
		}
		
		if (up.length) {
			entry.up = up;
		}
	}
}

var animateTimeout;

function animate() {
	if (paused) {
		return;
	}
	
	record();
	update();
	redraw();
	animateTimeout = setTimeout(animate, 1000 / fps);
}

var playbackTime;

function animatePlayback() {
	if (!paused) {
		++playbackTime;
		
		if (playbackTime >= journal.time) {
			return;
		}
		
		var entry = journal[playbackTime];
		if (entry) {		
			for (var i in entry.down) {
				playback.heldKeys[entry.down[i]] = true;
			}
			for (var i in entry.up) {
				delete playback.heldKeys[entry.up[i]];
			}
		}
		
		update();
		redraw();
		setTimeout(animate, 1000 / fps);
	}
}

//!! Add functions for step-by-step playback, rewind and such.

function playback() {
	pause();
	clearTimeout(animateTimeout);
	state.reset();
	playbackTime = 0;
	
	playback.originalIsHoldingKey = isHoldingKey;
	isHoldingKey = function(key) {
		return key === undefined ? playback.heldKeys :
			playback.heldKeys[key];
	}
	playback.heldKeys = {};
	
	playback.originalAnimate = animate;
	animate = animatePlayback;
	resume();
}

key('p', function() {
	playback();
});

/** State **/

state('player bullets badGuys');
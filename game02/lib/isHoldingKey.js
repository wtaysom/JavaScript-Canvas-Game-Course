// Quick little library for telling whether a key is being held down.

;(function(global){
	// Inverse of index in keymaster.js.
	var _MAP = {
		  8: 'backspace',
		  9: 'tab',
		 12: 'clear',
		 13: 'return',
		 27: 'escape',
		 32: 'space',
		 37: 'left',
		 38: 'up',
		 39: 'right',
		 40: 'down',
		 46: 'delete',
		 36: 'home',
		 35: 'end',
		 33: 'pageup',
		 34: 'pagedown',
		188: ',',
		190: '.',
		191: '/',
		192: '`',
		189: '-',
		187: '=',
		186: ';',
		222: '\'',
		219: '[',
		221: ']',
		220: '\\'
    };
	
	var heldKeys = {};
	
	function handler(event) {
		var keyName = _MAP[event.keyCode] ||
			String.fromCharCode(event.keyCode).toLowerCase();
		if (event.type == 'keydown') {
			heldKeys[keyName] = true;
		} else {
			delete heldKeys[keyName];
		};
	};
	
	global.addEventListener('keydown', handler, false);
	global.addEventListener('keyup', handler, false);
	
	global.isHoldingKey = function(key) {
		return key === undefined ? heldKeys : heldKeys[key];
	};
})(this);
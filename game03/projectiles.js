projectiles = {
	members: [],
	max: 30,
	maxCoolDown: 20,
	coolDown: 20, // same as maxCoolDown.
	add: function() {
		this.members.push(this.newMember());
		// `this` refers to the object `add` is called on.
		// When we say `projectiles.add()`, `this` is `projectiles`.
	},
	// Make a generic projectile.
	newMember: function() {
		return {
			x: canvas.width / 2,
			y: canvas.height / 2,
			width: 4,
			height: 16,
			speed: 400,
			color: '#AAA'
		};
	},
	remove: function(member) {
		var i = this.members.indexOf(member);
		if (i !== -1) {
			this.members.splice(i, 1);
		}
	},
	maybeAdd: function() {
		if (this.members.length >= this.max) {
			return;
		}
		
		if (this.coolDown > 0) {
			--this.coolDown;
			return;
		}
		
		this.coolDown = this.maxCoolDown;
		this.add();
	},
	update: function() {
		forEach(this.members, function(member) {
			member.y += member.speed / fps;
		});
	},
	maybeRemove: function() {
		reject(this.members, this.shouldBeRemoved);
	},
	// Decide whether a member should be removed.
	shouldBeRemoved: function(member) {
		return member.speed > 0 ? ifHasRunOffTheBottom(member) :
			ifHasRunOffTheTop(member);
	},
	draw: function() {
		forEach(this.members, fillPiece);
	}
};

function Projectiles() {
	// Assign a new array each time a Projectiles object is created.
	this.members = [];
}
Projectiles.prototype = projectiles;

/** State **/

projectiles.saveState = function() {
	return {
		__type: 'Projectiles',
		members: this.members,
		max: this.max,
		maxCoolDown: this.maxCoolDown,
		coolDown: this.coolDown
	}
}

Projectiles.restoreFromState = function(state) {
	var p = new Projectiles();
	p.members = state.members;
	p.max = state.max;
	p.maxCoolDown = state.maxCoolDown;
	p.coolDown = state.coolDown
	return p;
}
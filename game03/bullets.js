function Bullets() {
	Projectiles.call(this);
}
Bullets.prototype = new Projectiles();

Bullets.prototype.newMember = function() {
	return {
		x: player.x,
		y: sides(player).top,
		width: 4,
		height: 16,
		speed: -400,
		color: '#C84'
	}
}

Bullets.prototype.saveState = function() {
	return {
		__type: 'Bullets',
		members: this.members,
		max: this.max,
		maxCoolDown: this.maxCoolDown,
		coolDown: this.coolDown
	}
}

Bullets.restoreFromState = function(state) {
	var p = new Bullets();
	p.members = state.members;
	p.max = state.max;
	p.maxCoolDown = state.maxCoolDown;
	p.coolDown = state.coolDown
	return p;
}

var bullets = new Bullets();
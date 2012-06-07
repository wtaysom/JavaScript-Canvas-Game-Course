var boss = {
	x: canvas.width / 2,
	y: 10,
	width: 50,
	height: 20,
	speed: 80,
	approach: 18,
	color: '#25F'
};

function updateBoss() {
	//?? change in some way
}

function drawBoss() {
	fillPiece(boss);
}

/** Missiles **/

function Missiles() {
	Projectiles.call(this);
}
Missiles.prototype = new Projectiles();

Missiles.prototype.newMember = function() {
	return {
		x: boss.x,
		y: sides(boss).bottom,
		dx: randomBetween(-1, 2),
		dy: 1,
		width: 4,
		height: 16,
		speed: 400,
		color: '#8C4'
	}
}

Missiles.prototype.updateMember = function(missile) {
	missile.y += missile.speed / 4 / fps;
	
	missile.x += missile.dx;
	missile.y += missile.dy;
	
	// Wobbles.
	missile.x += missile.speed / 3 / fps * randomBetween(-1, 2);
	
	//missile.x += missile.x == player.x ? 0 : missile.x < player.x ? 1 : -1;
	//missile.y += missile.y == player.y ? 0 : missile.y < player.y ? 1 : -1;
	
	missile.dx += 0.2 * (missile.x == player.x ? 0 : missile.x < player.x ? 1 : -1);
	missile.dy += 0.2 * (missile.y == player.y ? 0 : missile.y < player.y ? 1 : -1);
}

Missiles.prototype.saveState = function() {
	return {
		__type: 'Missiles',
		members: this.members,
		max: this.max,
		maxCoolDown: this.maxCoolDown,
		coolDown: this.coolDown
	}
}

Missiles.restoreFromState = function(state) {
	var p = new Missiles();
	p.members = state.members;
	p.max = state.max;
	p.maxCoolDown = state.maxCoolDown;
	p.coolDown = state.coolDown
	return p;
}

var missiles = new Missiles();
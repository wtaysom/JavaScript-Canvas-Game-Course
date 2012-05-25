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
	//!! change in some way
}

function drawBoss() {
	fillPiece(boss);
}

/** Missiles **/

var missiles = [];
var maxMissiles = 30;
var maxMissileCoolDown = 20;
var missileCoolDown = maxMissileCoolDown;

function addMissile() {
	missiles.push({
		x: boss.x,
		y: sides(boss).bottom,
		dx: randomBetween(-1, 2),
		dy: 1,
		width: 4,
		height: 16,
		speed: 400,
		color: '#8C4'
	});
}

function removeMissile(missile) {
	var i = missiles.indexOf(missile);
	if (i !== -1) {
		missiles.splice(i, 1);
	}
}

function maybeAddMissile() {
	if (missiles.length >= maxMissiles) {
		return;
	}
	
	if (missileCoolDown > 0) {
		--missileCoolDown;
		return;
	}
	
	missileCoolDown = maxMissileCoolDown;
	addMissile();
}

function updateMissiles() {
	for (var i = 0; i < missiles.length; ++i) {
		var missile = missiles[i];
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
}

function maybeRemoveMissiles() {
	for (var i = 0; i < missiles.length; ++i) {
		var missile = missiles[i];
		removeIfHasRunOffTheBottom(missile, removeMissile);
	}
}

function drawMissiles() {
	for (var i = 0; i < missiles.length; ++i) {
		var missile = missiles[i];
		fillPiece(missile);
	}
}
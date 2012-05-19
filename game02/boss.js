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

/** Missles **/

var missles = [];
var maxMissles = 30;
var maxMissleCoolDown = 20;
var missleCoolDown = maxMissleCoolDown;

function addMissle() {
	missles.push({
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

function removeMissle(missle) {
	var i = missles.indexOf(missle);
	if (i !== -1) {
		missles.splice(i, 1);
	}
}

function maybeAddMissle() {
	if (missles.length >= maxMissles) {
		return;
	}
	
	if (missleCoolDown > 0) {
		--missleCoolDown;
		return;
	}
	
	missleCoolDown = maxMissleCoolDown;
	addMissle();
}

function updateMissles() {
	for (var i = 0; i < missles.length; ++i) {
		var missle = missles[i];
		missle.y += missle.speed / 4 / fps;
		
		missle.x += missle.dx;
		missle.y += missle.dy;
		
		// Wobbles.
		missle.x += missle.speed / 3 / fps * randomBetween(-1, 2);
		
		//missle.x += missle.x == player.x ? 0 : missle.x < player.x ? 1 : -1;
		//missle.y += missle.y == player.y ? 0 : missle.y < player.y ? 1 : -1;
		
		missle.dx += 0.2 * (missle.x == player.x ? 0 : missle.x < player.x ? 1 : -1);
		missle.dy += 0.2 * (missle.y == player.y ? 0 : missle.y < player.y ? 1 : -1);
	}
}

function maybeRemoveMissles() {
	for (var i = 0; i < missles.length; ++i) {
		var missle = missles[i];
		removeIfHasRunOffTheBottom(missle, removeMissle);
	}
}

function drawMissles() {
	for (var i = 0; i < missles.length; ++i) {
		var missle = missles[i];
		fillPiece(missle);
	}
}
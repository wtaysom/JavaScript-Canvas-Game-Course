var powerups = [];
var maxPowerups = 3;
var maxPowerupCoolDown = 600;
var powerupCoolDown = 20;

function addPowerup() {
	var size = randomBetween(10, 20);
	powerups.push({
		x: randomX(),
		y: -30,
		width: size,
		height: size,
		color: '#881'
	});
}

function removePowerup(powerup) {
	var i = powerups.indexOf(powerup);
	if (i !== -1) {
		powerups.splice(i, 1);
	}
}

function maybeAddPowerup() {
	if (powerups.length >= maxPowerups) {
		return;
	}
	
	if (randomBetween(0, powerupCoolDown) < 10) {
		powerupCoolDown = maxPowerupCoolDown;
		addPowerup();
	} else {
		--powerupCoolDown;
	}
}

function updatePowerups() {
	for (var i = 0; i < powerups.length; ++i) {
		var powerup = powerups[i];
		powerup.y += 2;
		
		if (intersects(powerup, player)) {
			removePowerup(powerup);
			powerupBullets();
		}
	}
}

function powerupBullets() {
	if (maxBulletCoolDown > 5) {
		maxBulletCoolDown *= 0.8;
	}
}

function maybeRemovePowerup() {
	reject(powerups, ifHasRunOffTheBottom);
}

function drawPowerups() {
	for (var i = 0; i < powerups.length; ++i) {
		var powerup = powerups[i];
		fillPiece(powerup);
	}
}
